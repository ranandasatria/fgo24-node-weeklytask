const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendMail(to, subject, text) {
  const mailOptions = {
    from: `"Tontrix Support" <${process.env.EMAIL_SENDER}>`,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendMail;
