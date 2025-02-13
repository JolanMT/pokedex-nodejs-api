const express = require("express");
const { getTypes } = require("../controllers/pkmnController");

const router = express.Router();

router.get("/types", getTypes);

module.exports = router;
