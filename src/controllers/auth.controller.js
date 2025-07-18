const { constants: http } = require('http2');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(http.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    const newUser = await Users.create({ email, password });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: 'Account created',
      results: {
        id: newUser.id,
        email: newUser.email
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

    if (!user || user.password !== password) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Wrong email or password'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.APP_SECRET,
      { expiresIn: '1h' }
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