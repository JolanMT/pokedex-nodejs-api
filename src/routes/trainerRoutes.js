const express = require("express");
const { getTrainers, createTrainer } = require("../controllers/trainerController");

const router = express.Router();

router.get("/", getTrainers);
router.post("/", createTrainer);

module.exports = router;
