const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkRole = require('../middlewares/checkRole');
const pokemonController = require("../controllers/pokemonController");
const { authMiddleware } = require("../middlewares/authMiddleware"); // ✅ Correction de l'import
const Trainer = require("../models/Trainer"); // ✅ Import du modèle Trainer

// ✅ Route pour récupérer les infos du dresseur connecté
router.get("/me", authMiddleware, async (req, res) => {
    try {
        console.log("🔍 Requête reçue sur /me pour l'utilisateur :", req.user);

        const trainer = await Trainer.findById(req.user.id).select("-password -email -role");
        
        if (!trainer) {
            console.log("❌ Dresseur non trouvé !");
            return res.status(404).json({ message: "Dresseur non trouvé." });
        }

        console.log("✅ Dresseur trouvé :", trainer);
        res.status(200).json(trainer);
    } catch (error) {
        console.error("❌ Erreur serveur dans /me :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// Route POST pour l'inscription
router.post('/register', authController.register);

// Route POST pour la connexion
router.post('/login', authController.login);

// Route GET pour vérifier l'utilisateur connecté
router.get('/checkUser', authController.checkUser);

module.exports = router;
