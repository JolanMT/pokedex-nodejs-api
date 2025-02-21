const Trainer = require("../models/Trainer");
const Pokemon = require("../models/Pokemon");

// ✅ Récupérer tous les trainers avec leurs Pokémon
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate("caughtPokemons", "name type") // Récupérer les infos des Pokémon attrapés
      .populate("favoritePokemon", "name type")
      .populate("team", "name type");

    res.json(trainers);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des trainers" });
  }
};

// ✅ Récupérer les infos du trainer connecté
exports.getTrainerProfile = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user.id)
      .populate("caughtPokemons", "name type")
      .populate("favoritePokemon", "name type")
      .populate("team", "name type");

    if (!trainer) {
      return res.status(404).json({ error: "Trainer non trouvé" });
    }

    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
};
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().select("-password -email -role").populate("favoritePokemon team");
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// 🔥 Nouvelle méthode pour récupérer un dresseur par ID
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).select("-password -email -role").populate("favoritePokemon team");
    
    if (!trainer) {
      return res.status(404).json({ message: "Dresseur non trouvé." });
    }

    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
// ✅ Capturer un Pokémon et l'ajouter à la liste
exports.catchPokemon = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user.id);
    const { pokemonId } = req.body;

    if (!trainer) return res.status(404).json({ error: "Trainer non trouvé" });

    if (!trainer.caughtPokemons.includes(pokemonId)) {
      trainer.caughtPokemons.push(pokemonId);
      trainer.caughtPokemonCount += 1;
    }

    await trainer.save();
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la capture du Pokémon" });
  }
};

// ✅ Définir un Pokémon favori
exports.setFavoritePokemon = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user.id);
    const { pokemonId } = req.body;

    if (!trainer) return res.status(404).json({ error: "Trainer non trouvé" });

    trainer.favoritePokemon = pokemonId;
    await trainer.save();
    
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du Pokémon favori" });
  }
};

// ✅ Gérer l'équipe (ajouter/enlever un Pokémon)
exports.manageTeam = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user.id);
    const { pokemonId } = req.body;

    if (!trainer) return res.status(404).json({ error: "Trainer non trouvé" });

    if (trainer.team.includes(pokemonId)) {
      trainer.team = trainer.team.filter(id => id.toString() !== pokemonId);
    } else {
      if (trainer.team.length >= 6) return res.status(400).json({ error: "L'équipe est pleine !" });
      trainer.team.push(pokemonId);
    }

    await trainer.save();
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la gestion de l'équipe" });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔄 Mise à jour du dresseur :", id);

    let updatedData = { ...req.body };

    // ✅ Si une image a été uploadée, on met à jour le chemin
    if (req.file) {
      updatedData.imagePath = `/uploads/${req.file.filename}`;
    }

    // ✅ Mise à jour de l'équipe
    if (updatedData.team) {
      const teamIds = Array.isArray(updatedData.team) ? updatedData.team : updatedData.team.split(",");
      const validTeam = await Pokemon.find({ _id: { $in: teamIds } });

      if (validTeam.length > 6) {
        return res.status(400).json({ message: "L'équipe ne peut contenir que 6 Pokémon maximum." });
      }
      updatedData.team = validTeam.map(pokemon => pokemon._id);
    }

    const updatedTrainer = await Trainer.findByIdAndUpdate(id, updatedData, { new: true }).populate("team", "name imagePath");
    if (!updatedTrainer) return res.status(404).json({ message: "Dresseur non trouvé." });

    console.log("✅ Dresseur mis à jour :", updatedTrainer);
    res.status(200).json(updatedTrainer);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du dresseur :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
