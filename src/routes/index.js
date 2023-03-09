const express = require('express');
const router = express.Router();
const validationMiddlewares = require('../middlewares/validation');
const authControllers = require('../controllers/auth.js');

router.post(
  '/register',
  validationMiddlewares.validateRegister,
  authControllers.createUser
);

router.post(
  '/login',
  validationMiddlewares.validateLogin,
  authControllers.loginUser
);

router.post(
  '/validateToken',
  validationMiddlewares.validateToken,
  authControllers.validateToken
);

module.exports = router;
