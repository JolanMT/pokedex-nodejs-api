const express = require("express");
const router = express.Router();
const Trainer = require("../models/Trainer");
const { authMiddleware } = require("../middlewares/authMiddleware");
const trainerController = require("../controllers/trainerController");
const upload = require("../middlewares/upload");

// 🔹 Récupérer tous les dresseurs (sans infos sensibles)
router.get("/", authMiddleware, trainerController.getAllTrainers);

// 🔹 Récupérer un dresseur par ID
router.get("/:id", authMiddleware, trainerController.getTrainerById);

// 🔹 Mettre à jour un dresseur (avec upload d'image et gestion de l'équipe Pokémon)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        let updates = { ...req.body };

        // Gestion de l'image de profil
        if (req.file) {
            updates.imagePath = `/uploads/${req.file.filename}`;
        }

        // Gestion de l'équipe Pokémon (convertir une string en tableau si nécessaire)
        if (updates.team && typeof updates.team === "string") {
            updates.team = updates.team.split(",").map(pokeId => pokeId.trim());
        }

        // Mise à jour du dresseur
        const updatedTrainer = await Trainer.findByIdAndUpdate(id, updates, { new: true }).populate("team favoritePokemon caughtPokemons", "name imagePath");

        if (!updatedTrainer) return res.status(404).json({ message: "Dresseur non trouvé." });

        res.status(200).json(updatedTrainer);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du dresseur :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// 🔹 Récupérer les infos du dresseur connecté
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.user.id)
            .populate("team favoritePokemon caughtPokemons", "name imagePath");

        if (!trainer) return res.status(404).json({ message: "Dresseur non trouvé." });

        res.status(200).json(trainer);
    } catch (error) {
        console.error("❌ Erreur dans /me :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

module.exports = router;
