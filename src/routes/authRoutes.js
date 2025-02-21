const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkRole = require('../middlewares/checkRole');
const pokemonController = require("../controllers/pokemonController");

router.post('/pokemons', checkRole('ADMIN'), pokemonController.createPokemon);

// Route POST pour l'inscription
router.post('/register', authController.register);

// Route POST pour la connexion
router.post('/login', authController.login);

// Route GET pour vérifier l'utilisateur connecté
router.get('/checkUser', authController.checkUser);

module.exports = router;
