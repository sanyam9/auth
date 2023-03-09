const authServices = require('../services/auth');

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await authServices.createUser({
      email,
      password,
    });
    return res.status(201).json({
      message: 'Created New User',
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authServices.loginUser({ email, password });
    await redisClient.set(email, token);
    return res.status(200).json({
      message: 'Signed In User',
      data: token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const validateToken = async (req, res) => {
  try {
    const { token } = req.body;
    const { email } = await authServices.validateToken(token);
    const savedToken = await redisClient.get(email);

    if (savedToken !== token) {
      return res.status(401).json({ error: 'FAKE_TOKEN' });
    }

    return res.status(200).json({
      message: 'Validated Token',
      data: {
        email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  validateToken,
};
