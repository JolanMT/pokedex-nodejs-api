const express = require("express");
const { getTrainers, createTrainer } = require("../controllers/trainerController");
const checkRole = require('../middlewares/checkRole');
const pokemonController = require("../controllers/pokemonController");

const router = express.Router();
router.post('/pokemons', checkRole('ADMIN'), pokemonController.createPokemon);

router.get("/", getTrainers);
router.post("/", createTrainer);

module.exports = router;
