const express = require("express");
const router = express.Router();
const Trainer = require("../models/Trainer");
const { authMiddleware } = require("../middlewares/authMiddleware");
const trainerController = require("../controllers/trainerController");
const upload = require("../middlewares/upload");

// 🔹 Récupérer tous les dresseurs (sans infos sensibles)
router.get("/", authMiddleware, trainerController.getAllTrainers);

// 🔹 Récupérer un dresseur par ID avec ses Pokémon capturés
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id)
            .populate("team favoritePokemon caughtPokemons", "name imagePath");

        if (!trainer) return res.status(404).json({ message: "Dresseur non trouvé." });

        res.status(200).json(trainer);
    } catch (error) {
        console.error("❌ Erreur dans GET /trainers/:id :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// 🔹 Mettre à jour un dresseur (image et équipe)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'utilisateur connecté est ADMIN ou s'il modifie son propre compte
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            return res.status(403).json({ message: "Accès interdit : vous ne pouvez modifier que votre propre profil." });
        }

        let updates = { ...req.body };

        // Gestion de l'image de profil
        if (req.file) {
            updates.imagePath = `/uploads/${req.file.filename}`;
        }

        // Vérifier que l'équipe ne contient que des Pokémon capturés
        if (updates.team && typeof updates.team === "string") {
            updates.team = JSON.parse(updates.team);
        }

        const trainer = await Trainer.findById(id);
        if (!trainer) return res.status(404).json({ message: "Dresseur non trouvé." });

        // Vérifier si tous les Pokémon de l'équipe sont dans `caughtPokemons`
        const unauthorizedPokemon = updates.team.some(pokeId => !trainer.caughtPokemons.includes(pokeId));
        if (unauthorizedPokemon) {
            return res.status(400).json({ message: "Vous ne pouvez ajouter que des Pokémon que vous avez capturés." });
        }

        const updatedTrainer = await Trainer.findByIdAndUpdate(id, updates, { new: true })
            .populate("team favoritePokemon caughtPokemons", "name imagePath");

        res.status(200).json(updatedTrainer);
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du dresseur :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// 🔹 Capture d'un Pokémon par un dresseur
router.post("/capture/:pokemonId", authMiddleware, async (req, res) => {
    try {
        const { pokemonId } = req.params;
        const trainer = await Trainer.findById(req.user.id);

        if (!trainer) return res.status(404).json({ message: "Dresseur non trouvé." });

        // Vérifier si le Pokémon est déjà capturé
        if (trainer.caughtPokemons.includes(pokemonId)) {
            return res.status(400).json({ message: "Vous avez déjà capturé ce Pokémon." });
        }

        // Ajouter le Pokémon capturé
        trainer.caughtPokemons.push(pokemonId);
        trainer.caughtPokemonCount = trainer.caughtPokemons.length;
        await trainer.save();

        res.status(200).json({ message: "Pokémon capturé avec succès !", trainer });
    } catch (error) {
        console.error("❌ Erreur lors de la capture du Pokémon :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// 🔹 Récupérer la liste des Pokémon capturés par un dresseur
router.get("/:id/caughtPokemons", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'utilisateur est ADMIN ou s'il récupère ses propres Pokémon
        if (req.user.role !== "ADMIN" && req.user.id !== id) {
            return res.status(403).json({ message: "Accès interdit." });
        }

        const trainer = await Trainer.findById(id).populate("caughtPokemons", "name imagePath");
        if (!trainer) return res.status(404).json({ message: "Dresseur non trouvé." });

        res.status(200).json(trainer.caughtPokemons);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des Pokémon capturés :", error);
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
