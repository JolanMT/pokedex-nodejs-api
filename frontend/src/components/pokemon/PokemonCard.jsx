import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PokemonCard.css";

// 🎨 Mapping des couleurs RGB pour chaque type
const typeColors = {
  NORMAL: "rgb(168, 168, 120)",
  FIRE: "rgb(240, 128, 48)",
  WATER: "rgb(104, 144, 240)",
  ELECTRIC: "rgb(248, 208, 48)",
  GRASS: "rgb(120, 200, 80)",
  ICE: "rgb(152, 216, 216)",
  FIGHTING: "rgb(192, 48, 40)",
  POISON: "rgb(160, 64, 160)",
  GROUND: "rgb(224, 192, 104)",
  FLYING: "rgb(168, 144, 240)",
  PSYCHIC: "rgb(248, 88, 136)",
  BUG: "rgb(168, 184, 32)",
  ROCK: "rgb(184, 160, 56)",
  GHOST: "rgb(112, 88, 152)",
  DRAGON: "rgb(112, 56, 248)",
  DARK: "rgb(112, 88, 72)",
  STEEL: "rgb(184, 184, 208)",
  FAIRY: "rgb(240, 182, 188)",
};

// Fonction pour générer une ombre en fonction du premier type
const getShadowColor = (types) => {
  if (!types || types.length === 0) return "rgb(150, 150, 150)"; // Couleur par défaut
  const mainType = types[0].toUpperCase();
  return typeColors[mainType] || "rgb(150, 150, 150)"; // Si non trouvé, gris
};

const PokemonCard = ({ pokemon }) => {
  const [activeSection, setActiveSection] = useState("#general");
  const [isCaptured, setIsCaptured] = useState(false);

  useEffect(() => {
    const checkCapturedStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Vérifier si le Pokémon est capturé
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsCaptured(userRes.data.caughtPokemons.includes(pokemon._id));
      } catch (error) {
        console.error("❌ Erreur lors de la vérification du Pokémon capturé :", error);
      }
    };

    checkCapturedStatus();
  }, [pokemon._id]);

  const handleCapture = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5000/api/trainers/capture/${pokemon._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsCaptured(true); // Met à jour l'affichage
    } catch (error) {
      console.error("❌ Erreur lors de la capture du Pokémon :", error);
    }
  };

  if (!pokemon) return null;

  return (
    <div
      className="card"
      data-state={activeSection}
      style={{
        boxShadow: `0px 0px 15px ${getShadowColor(pokemon.types)}`, // Applique une ombre colorée
      }}
    >
      <div className="card-header">
        <img
          className="card-avatar"
          src={`http://localhost:5000${pokemon.imagePath}`}
          alt={pokemon.name}
        />
        <h1 className="card-fullname">{pokemon.name}</h1>
        <h2 className="card-jobtitle">{pokemon.types.join(", ")}</h2>
        <div
          className="card-cover"
          style={{
            backgroundImage: `url(http://localhost:5000${pokemon.imagePath})`,
          }}
        ></div>
      </div>

      {/* Bouton Capture */}
      <div className="capture-container">
        <button
          className={`capture-button ${isCaptured ? "captured" : ""}`}
          onClick={handleCapture}
          disabled={isCaptured}
        >
          {isCaptured ? "Capturé ✅" : "Capture"}
        </button>
      </div>
      <div className="card-main">

        {/* SECTION GÉNÉRAL */}
        <div
          className={`card-section`}
          id="general"
          style={{ display: activeSection === "#general" ? "block" : "none" }}
        >
          <div className="card-content">
            <div className="card-subtitle">GÉNÉRAL</div>
            <p className="card-desc">
              <strong>Description :</strong> {pokemon.description}
            </p>
            <p className="card-desc">
              <strong>Régions :</strong>{" "}
              {pokemon.regions.length > 0
                ? pokemon.regions.join(", ")
                : "Inconnu"}
            </p>
          </div>
        </div>

        {/* SECTION STATS */}
        <div
          className={`card-section`}
          id="stats"
          style={{ display: activeSection === "#stats" ? "block" : "none" }}
        >
          <div className="card-content">
            <div className="card-subtitle">STATS</div>
            <p className="card-desc">
              <strong>HP :</strong> {pokemon.stats?.HP}
            </p>
            <p className="card-desc">
              <strong>ATK :</strong> {pokemon.stats?.ATK}
            </p>
            <p className="card-desc">
              <strong>ATKSPE :</strong> {pokemon.stats?.ATKSPE}
            </p>
            <p className="card-desc">
              <strong>DEF :</strong> {pokemon.stats?.DEF}
            </p>
            <p className="card-desc">
              <strong>DEFSPE :</strong> {pokemon.stats?.DEFSPE}
            </p>
            <p className="card-desc">
              <strong>VIT :</strong> {pokemon.stats?.VIT}
            </p>
          </div>
        </div>

        {/* SECTION CAPACITÉS */}
        <div
          className={`card-section`}
          id="capacities"
          style={{ display: activeSection === "#capacities" ? "block" : "none" }}
        >
          <div className="card-content">
            <div className="card-subtitle">CAPACITÉS</div>
            {pokemon.capacities && pokemon.capacities.length > 0 ? (
              <ul>
                {pokemon.capacities.map((capacity, index) => (
                  <li key={index} className="card-desc">
                    {capacity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card-desc">Aucune capacité définie</p>
            )}
          </div>
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="card-actions">
          <Link to={`/pokemons/${pokemon._id}`}>
            <button className="action-button">
              <i className="fas fa-search"></i> {/* Loupe */}
            </button>
          </Link>
          <Link to={`/pokemons/edit/${pokemon._id}`}>
            <button className="action-button">
              <i className="fas fa-pencil-alt"></i> {/* Crayon */}
            </button>
          </Link>
          <Link to={`/pokemons/delete/${pokemon._id}`}>
            <button className="action-button delete">
              <i className="fas fa-times"></i> {/* Croix */}
            </button>
          </Link>
        </div>


        {/* BOUTONS DE NAVIGATION */}
        <div className="card-buttons">
          <button
            onClick={() => setActiveSection("#general")}
            className={activeSection === "#general" ? "is-active" : ""}
          >
            GÉNÉRAL
          </button>
          <button
            onClick={() => setActiveSection("#stats")}
            className={activeSection === "#stats" ? "is-active" : ""}
          >
            STATS
          </button>
          <button
            onClick={() => setActiveSection("#capacities")}
            className={activeSection === "#capacities" ? "is-active" : ""}
          >
            CAPACITÉS
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
