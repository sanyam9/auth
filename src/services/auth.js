const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config');
const db = require('../models');

const createUser = async (user) => {
  const { email, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    email,
    password: hashedPassword,
  };
  const createdUser = await db.users.create(newUser);
  return {
    email: createdUser.dataValues.email,
  };
};

const loginUser = async (user) => {
  const { email, password } = user;
  let getFromDB = await db.users.findOne({ where: { email } });
  getFromDB = getFromDB.dataValues;

  if (getFromDB === {} || !getFromDB) {
    throw new Error('USER_NOT_FOUND');
  }
  const isPasswordCorrect = await bcrypt.compare(password, getFromDB.password);
  if (!isPasswordCorrect) {
    throw new Error('WRONG_PASSWORD');
  }
  const token = jwt.sign({ email }, JWT_SECRET_KEY, {
    expiresIn: '1000h',
  });
  return token;
};

const validateToken = async (token) => {
  const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
  if (!decodedToken) {
    throw new Error('INVALID_TOKEN');
  }
  return decodedToken;
};

module.exports = { createUser, loginUser, validateToken };
