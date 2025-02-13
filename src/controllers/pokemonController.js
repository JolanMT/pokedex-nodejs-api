const pokemonService = require("../services/pokemonService");

exports.getPokemons = async (req, res) => {
  try {
    const pokemons = await pokemonService.getAllPokemons();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createPokemon = async (req, res) => {
  try {
    const newPokemon = await pokemonService.createPokemon(req.body);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du Pokémon" });
  }
};
