import axios from "axios";

const API_URL = "http://localhost:5000/api/pokemon";

export const fetchPokemons = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchPokemonById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createPokemon = async (pokemonData, token) => {
  const response = await axios.post(API_URL, pokemonData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePokemon = async (id, pokemonData, token) => {
  const response = await axios.put(`${API_URL}/${id}`, pokemonData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePokemon = async (id, token) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
