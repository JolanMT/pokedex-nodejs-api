const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.register(username, password);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.checkUser = (req, res) => {
  res.json({ user: req.user });
};
