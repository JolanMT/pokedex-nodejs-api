import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PokemonForm from './PokemonForm';

const PokemonEdit = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pkmn/${id}`);
        setPokemon(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du Pokémon:", error);
      }
    };
    fetchPokemon();
  }, [id]);

  return (
    <div>
      {pokemon ? <PokemonForm isEdit={true} existingPokemon={pokemon} /> : <p>Chargement...</p>}
    </div>
  );
};

export default PokemonEdit;
