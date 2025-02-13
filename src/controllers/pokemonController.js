const Pokemon = require("../models/Pokemon");

exports.getPokemons = async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createPokemon = async (req, res) => {
  try {
    const newPokemon = new Pokemon(req.body);
    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du Pokémon" });
  }
};
