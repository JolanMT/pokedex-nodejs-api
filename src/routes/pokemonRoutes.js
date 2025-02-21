const express = require("express");
const pokemonController = require("../controllers/pokemonController");
const checkRole = require("../middlewares/checkRole");
const { authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

// 🟢 Routes pour récupérer les Pokémon
router.get("/all", pokemonController.getAllPokemons);
router.get("/search", pokemonController.searchPokemons);
router.get("/:id", pokemonController.getPokemonById); // Récupérer un Pokémon par ID

// 🟢 CRUD Pokémon (admin uniquement)
router.post("/", authMiddleware, checkRole("ADMIN"), upload.single("image"), pokemonController.createPokemon);
router.put("/:id", authMiddleware, checkRole("ADMIN"), upload.single("image"), pokemonController.updatePokemon);
router.delete("/:id", authMiddleware, checkRole("ADMIN"), pokemonController.deletePokemon);

// 🟢 Ajout de région
router.post("/region", authMiddleware, checkRole("ADMIN"), pokemonController.addRegionToPokemon);

module.exports = router;
