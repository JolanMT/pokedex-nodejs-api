const Pokemon = require("../models/Pokemon");

const getAllPokemons = async () => {
  return await Pokemon.find();
};

const createPokemon = async (pokemonData) => {
  const newPokemon = new Pokemon(pokemonData);
  return await newPokemon.save();
};

module.exports = { getAllPokemons, createPokemon };
