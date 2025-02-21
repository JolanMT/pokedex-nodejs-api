import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PokemonCard from "./PokemonCard";
import './global.css';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 12; // Nombre de Pokémon par page

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pkmn/all");
        setPokemons(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémons:", error);
      }
    };
    fetchPokemons();
  }, []);

  // Nombre total de pages (au moins 1 pour éviter de cacher la pagination)
  const totalPages = Math.max(1, Math.ceil(pokemons.length / pokemonsPerPage));

  // Déterminer les Pokémons à afficher pour la page actuelle
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = pokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  // Changer de page
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div id="listePokes">
      
      <h2>Liste des Pokémons</h2>

      {/* Bouton Ajouter un Pokémon */}
      <Link to="/pokemons/new">
        <button className="add-pokemon-button">Ajouter un Pokémon</button>
      </Link>

      {/* Grille d'affichage des cartes Pokémon */}
      <div className="pokemon-grid">
        {currentPokemons.map((pokemon) => (
          <PokemonCard key={pokemon._id} pokemon={pokemon} />
        ))}
      </div>

      {/* Pagination visible même avec une seule page */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Précédent</button>
        <span> Page {currentPage} / {totalPages} </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Suivant</button>
      </div>
    </div>
  );
};

export default PokemonList;
