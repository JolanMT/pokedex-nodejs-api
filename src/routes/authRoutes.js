const express = require("express");
const { register, login, checkUser } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/checkUser", authMiddleware, checkUser);

module.exports = router;
