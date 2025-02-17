const express = require("express");
const { register, login, checkUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/checkUser", checkUser);

module.exports = router;
