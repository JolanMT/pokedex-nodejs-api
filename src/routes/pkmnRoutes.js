const express = require("express");
const { getTypes } = require("../controllers/pkmnController");
const checkRole = require('../middlewares/checkRole');
const router = express.Router();
const pokemonController = require("../controllers/pokemonController");

router.post('/pokemons', checkRole('ADMIN'), pokemonController.createPokemon);


router.get("/types", getTypes);

module.exports = router;
