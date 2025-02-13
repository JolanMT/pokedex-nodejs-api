const express = require("express");
const { getPokemons, createPokemon } = require("../controllers/pokemonController");

const router = express.Router();

router.get("/", getPokemons);
router.post("/", createPokemon);

module.exports = router;
