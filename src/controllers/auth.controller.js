const { constants: http } = require('http2');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const { hashPassword, comparePasswords }= require('../utils/auth')
const redisClient = require('../services/redis.service');
const sendMail = require('../services/email.service');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const validate = validationResult(req);

  if (!validate.isEmpty()) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: validate.array()
    });
  }

  try {
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(http.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    const hashedPassword = await hashPassword(password)

    const name = email.split("@")[0]


    const newUser = await Users.create({ email, password: hashedPassword, name, role: 'user' });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: 'Account created',
      results: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const validate = validationResult(req);

  if (!validate.isEmpty()) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: validate.array()
    });
  }

  try {
    const user = await Users.findOne({ where: { email } });


    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'Email not found. Please register'
      });
    }

    const isMatch = await comparePasswords(password, user.password)

    if (!isMatch) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Wrong password'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.APP_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Login success',
      token
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    const resetToken = jwt.sign(
      { id: user.id, email: user.email, purpose: 'reset-password' },
      process.env.APP_SECRET,
      { expiresIn: '10m' }
    );

    await redisClient.set(`reset:${user.id}`, resetToken, { EX: 600 });

    await sendMail(email, 'Tontrix Password Reset', `Your reset token:\n\n${resetToken}`);

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Reset token sent to your email'
    });

  } catch (err) {
    console.error('ForgotPassword Error:', err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET);
    if (decoded.purpose !== 'reset-password') {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Invalid reset token purpose'
      });
    }

    const storedToken = await redisClient.get(`reset:${decoded.id}`);
    if (!storedToken || storedToken !== token) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Token expired or already used'
      });
    }

    const hashed = await hashPassword(newPassword);

    await Users.update(
      { password: hashed },
      { where: { id: decoded.id } }
    );

    await redisClient.del(`reset:${decoded.id}`);

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: 'Password has been reset'
    });

  } catch (err) {
    console.error('ResetPassword Error:', err);
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};



// with in-memory model
// exports.register = function(req, res){
//   const {email, password} = req.body;

//   if(model.getUserByEmail(email)){
//     return res.status(http.HTTP_STATUS_CONFLICT).json({
//       success: false,
//       message: 'Email is already registered'
//     })
//   }

//   const newUser = model.createUser({email, password})
//     return res.status(http.HTTP_STATUS_CREATED).json({
//     success: true,
//     message: "Account created",
//     results:  {
//       id: newUser.id,
//       email: newUser.email
//     }
//   })
//   }


// exports.login = function(req, res){
//   const {email ,password} = req.body;

//   const validate = validationResult(req);

//   if(!validate.isEmpty()){
//     return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
//       success: false,
//       message: "Validation error",
//       errors: validate.array(),
//     })
//   }


//   const user = model.getUserByEmail(email)
  
//   if(!user || user.password !== password){
//     return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
//     success: false,
//     message: 'Wrong email or password'
//   })
//   }

//   const token = jwt.sign(
//     { id: user.id,
//       email: user.email
//     },
//     process.env.APP_SECRET,
//     { expiresIn: '1h'}
//   );


//   return res.status(http.HTTP_STATUS_OK).json({
//     success: true,
//     message: 'Login Success',
//     token
//   })
// }