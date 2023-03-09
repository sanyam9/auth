const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config');
const db = require('../models');

const createUser = async (user) => {
  const { username, password, role } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
    role,
  };
  const createdUser = await db.User.create(newUser);
  return {
    username: createdUser.dataValues.username,
    role: createdUser.dataValues.role,
  };
};

const loginUser = async (user) => {
  const { username, password } = user;
  let getFromDB = await db.User.findOne({ where: { username } });
  getFromDB = getFromDB.dataValues;

  if (getFromDB === {} || !getFromDB) {
    throw new Error('USER_NOT_FOUND');
  }
  const isPasswordCorrect = await bcrypt.compare(password, getFromDB.password);
  if (!isPasswordCorrect) {
    throw new Error('WRONG_PASSWORD');
  }
  const token = jwt.sign({ username, role: getFromDB.role }, JWT_SECRET_KEY, {
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
