const bcrypt = require('bcryptjs')
const salt = 10

const hashPassword = async (password)=>{
  return bcrypt.hash(password, salt)
}

const comparePasswords = async (plainPassword, hashedPassword)=>{
  return bcrypt.compare(plainPassword, hashedPassword)
}

module.exports = {
  hashPassword,
  comparePasswords,
}