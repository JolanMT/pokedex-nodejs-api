const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (username, password) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error("Utilisateur déjà existant");

  const newUser = new User({ username, password });
  await newUser.save();
  return generateToken(newUser);
};

const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Utilisateur introuvable");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mot de passe incorrect");

  return generateToken(user);
};

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = { register, login };
