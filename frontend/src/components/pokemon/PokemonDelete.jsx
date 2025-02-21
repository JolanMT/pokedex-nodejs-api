import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PokemonDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); 

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/pkmn?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` } 
      });
      navigate('/pokemons');
    } catch (error) {
      console.error('Erreur lors de la suppression du Pokémon :', error);
    }
  };

  return (
    <div>
      <h2>Supprimer Pokémon</h2>
      <p>Voulez-vous vraiment supprimer ce Pokémon ?</p>
      <button onClick={handleDelete}>Oui, Supprimer</button>
      <button onClick={() => navigate('/pokemons')}>Annuler</button>
    </div>
  );
};

export default PokemonDelete;
