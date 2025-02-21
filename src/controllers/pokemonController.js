const Pokemon = require("../models/Pokemon");
const logger = require("../middlewares/logger");

// 🟢 Lire un Pokémon par ID
exports.getPokemonById = async (req, res) => {
  try {
    console.log("🔍 Requête reçue pour getPokemonById avec ID :", req.params.id);
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) return res.status(404).json({ message: "Pokémon non trouvé." });

    res.status(200).json(pokemon);
  } catch (error) {
    logger.error(`❌ Erreur lors de la récupération d'un Pokémon : ${error.message}`);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// 🟢 Créer un Pokémon (avec image)
exports.createPokemon = async (req, res) => {
  try {
    const { name, description, types, regions, capacities, stats } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "L'image est obligatoire." });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const newPokemon = await Pokemon.create({
      name,
      imagePath,
      description,
      types: JSON.parse(types),
      regions: JSON.parse(regions),
      capacities: JSON.parse(capacities),
      stats: JSON.parse(stats),
    });

    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};


// 🟢 Modifier un Pokémon (avec gestion de l'image)
exports.updatePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔄 Modification du Pokémon avec ID :", id);

    let updatedData = { ...req.body };

    // ✅ Mise à jour de l'image si un nouveau fichier est envoyé
    if (req.file) {
      updatedData.imagePath = `/uploads/${req.file.filename}`;
    }

    // ✅ Vérification et conversion des données reçues
    if (updatedData.types) {
      updatedData.types = Array.isArray(updatedData.types) 
        ? updatedData.types 
        : JSON.parse(updatedData.types);
    }

    if (updatedData.regions) {
      updatedData.regions = Array.isArray(updatedData.regions) 
        ? updatedData.regions 
        : JSON.parse(updatedData.regions);
    }

    if (updatedData.capacities) {
      updatedData.capacities = Array.isArray(updatedData.capacities) 
        ? updatedData.capacities 
        : JSON.parse(updatedData.capacities);
    }

    if (updatedData.stats && typeof updatedData.stats === "string") {
      try {
        updatedData.stats = JSON.parse(updatedData.stats); // ✅ Correction pour stocker un vrai objet
      } catch (err) {
        return res.status(400).json({ message: "Format des statistiques invalide." });
      }
    }

    // 🔄 Mise à jour du Pokémon
    const updatedPokemon = await Pokemon.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedPokemon) return res.status(404).json({ message: "Pokémon non trouvé." });

    console.log("✅ Pokémon mis à jour :", updatedPokemon);
    res.status(200).json(updatedPokemon);
  } catch (error) {
    logger.error(`❌ Erreur lors de la mise à jour du Pokémon : ${error.message}`);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};


// 🟢 Lire tous les Pokémon
exports.getAllPokemons = async (req, res) => {
  try {
    console.log("🔍 Récupération de tous les Pokémon...");
    const pokemons = await Pokemon.find();
    res.status(200).json(pokemons);
  } catch (error) {
    logger.error(`❌ Erreur lors de la récupération des Pokémon : ${error.message}`);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// 🟢 Ajouter une région à un Pokémon
exports.addRegionToPokemon = async (req, res) => {
  try {
    console.log("📤 Données reçues pour ajout de région :", req.body);
    const { id, regionName, regionPokedexNumber } = req.body;

    const pokemon = await Pokemon.findById(id);
    if (!pokemon) return res.status(404).json({ message: "Pokémon non trouvé." });

    const existingRegion = pokemon.regions.find((region) => region.regionName === regionName);
    if (existingRegion) {
      existingRegion.regionPokedexNumber = regionPokedexNumber;
    } else {
      pokemon.regions.push({ regionName, regionPokedexNumber });
    }

    await pokemon.save();
    console.log("✅ Région ajoutée :", pokemon);
    res.status(200).json(pokemon);
  } catch (error) {
    logger.error(`❌ Erreur lors de l'ajout d'une région : ${error.message}`);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// 🟢 Recherche de Pokémon
exports.searchPokemons = async (req, res) => {
  try {
    console.log("🔍 Recherche Pokémon avec critères :", req.query);
    const { partialName, typeOne, typeTwo, page = 1, size = 10 } = req.query;

    let query = {};
    if (partialName) query.name = new RegExp(partialName, "i");
    if (typeOne) query.types = typeOne;
    if (typeTwo) query.types = { $all: [typeOne, typeTwo] };

    const pokemons = await Pokemon.find(query)
      .limit(parseInt(size))
      .skip((parseInt(page) - 1) * parseInt(size));

    console.log("✅ Pokémon trouvés :", pokemons);
    res.status(200).json({ count: pokemons.length, data: pokemons });
  } catch (error) {
    logger.error(`❌ Erreur lors de la recherche des Pokémon : ${error.message}`);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

// 🟢 Supprimer un Pokémon
exports.deletePokemon = async (req, res) => {
  try {
    console.log("🗑 Suppression du Pokémon avec ID :", req.params.id);
    const deletedPokemon = await Pokemon.findByIdAndDelete(req.params.id);

    if (!deletedPokemon) return res.status(404).json({ message: "Pokémon non trouvé." });

    console.log("✅ Pokémon supprimé :", deletedPokemon);
    res.status(204).send();
  } catch (error) {
    logger.error(`❌ Erreur lors de la suppression du Pokémon : ${error.message}`);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
