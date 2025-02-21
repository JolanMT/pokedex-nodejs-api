import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pkmn/${id}`);
        setPokemon(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du Pokémon :", error);
      }
    };
    fetchPokemon();
  }, [id]);

  if (!pokemon) return <p>Chargement...</p>;

  // 📌 Vérifier que les données sont bien au format objet
  const types = Array.isArray(pokemon.types) ? pokemon.types.join(", ") : "Inconnu";
  const capacities = Array.isArray(pokemon.capacities) ? pokemon.capacities.join(", ") : "Aucune capacité définie";
  const stats = typeof pokemon.stats === "object" ? pokemon.stats : {};

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", background: "#f9f9f9" }}>
      <h1>{pokemon.name}</h1>
      <img src={`http://localhost:5000${pokemon.imagePath}`} alt={pokemon.name} style={{ width: "250px", display: "block", margin: "0 auto" }} />

      <h2>Description</h2>
      <p>{pokemon.description}</p>

      <h2>Types</h2>
      <p>{types}</p>

      <h2>Régions</h2>
      {pokemon.regions.length > 0 ? (
        <ul>
          {pokemon.regions.map((r, index) => (
            <li key={index}>{r.regionName} (#{r.regionPokedexNumber})</li>
          ))}
        </ul>
      ) : (
        <p>Aucune région définie</p>
      )}

      <h2>Capacités</h2>
      <p>{capacities}</p>

      <h2>Statistiques</h2>
      {Object.keys(stats).length > 0 ? (
        <ul>
          <li><strong>HP :</strong> {stats.HP}</li>
          <li><strong>ATK :</strong> {stats.ATK}</li>
          <li><strong>ATKSPE :</strong> {stats.ATKSPE}</li>
          <li><strong>DEF :</strong> {stats.DEF}</li>
          <li><strong>DEFSPE :</strong> {stats.DEFSPE}</li>
          <li><strong>VIT :</strong> {stats.VIT}</li>
        </ul>
      ) : (
        <p>Aucune statistique disponible</p>
      )}
    </div>
  );
};

export default PokemonDetail;
