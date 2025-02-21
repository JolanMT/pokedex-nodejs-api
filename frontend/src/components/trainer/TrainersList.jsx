import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./TrainersList.css";

const TrainersList = () => {
  const [trainers, setTrainers] = useState([]);
  const [currentTrainer, setCurrentTrainer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ Aucun token trouvé, redirection vers connexion...");
          navigate("/login");
          return;
        }

        // Récupérer l'utilisateur connecté
        const userResponse = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCurrentTrainer(userResponse.data);

        // Récupérer tous les dresseurs
        const response = await axios.get("http://localhost:5000/api/trainers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filtrer pour ne pas afficher le dresseur connecté deux fois
        const filteredTrainers = response.data.filter(t => t._id !== userResponse.data._id);
        setTrainers(filteredTrainers);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des dresseurs :", error);
      }
    };

    fetchTrainers();
  }, [navigate]);

  if (!currentTrainer) return <p>Chargement...</p>;

  return (
    <div className="trainers-container">
      <h1>Les Dresseurs Pokémon</h1>

      {/* Carte du dresseur connecté */}
      <div className="trainer-card current-trainer">
        <h2>🏅 {currentTrainer.username} (Moi)</h2>
        <p><strong>Pokémons attrapés :</strong> {currentTrainer.caughtPokemonCount}</p>
        <p><strong>Pokémon favori :</strong> {currentTrainer.favoritePokemon ? currentTrainer.favoritePokemon.name : "Aucun"}</p>
        <p><strong>Équipe :</strong></p>
        <div className="trainer-team">
          {currentTrainer.team.length > 0 ? (
            currentTrainer.team.map((pokemon, index) => (
              <div key={index} className="team-pokemon">
                <img src={`http://localhost:5000${pokemon.imagePath}`} alt={pokemon.name} />
                <p>{pokemon.name}</p>
              </div>
            ))
          ) : (
            <p>Pas d'équipe définie</p>
          )}
        </div>
        <div className="trainer-buttons">
          <Link to={`/trainer/${currentTrainer._id}`}>
            <button className="details-button">Voir Détails</button>
          </Link>
          <Link to={`/trainer/edit/${currentTrainer._id}`}>
            <button className="edit-button">Modifier</button>
          </Link>
        </div>
      </div>

      <h2>Autres Dresseurs</h2>
      <div className="trainers-list">
        {trainers.length > 0 ? (
          trainers.map((trainer) => (
            <div key={trainer._id} className="trainer-card">
              <h2>{trainer.username}</h2>
              <p><strong>Pokémons attrapés :</strong> {trainer.caughtPokemonCount}</p>
              <p><strong>Pokémon favori :</strong> {trainer.favoritePokemon ? trainer.favoritePokemon.name : "Aucun"}</p>
              <p><strong>Équipe :</strong></p>
              <div className="trainer-team">
                {trainer.team.length > 0 ? (
                  trainer.team.map((pokemon, index) => (
                    <div key={index} className="team-pokemon">
                      <img src={`http://localhost:5000${pokemon.imagePath}`} alt={pokemon.name} />
                      <p>{pokemon.name}</p>
                    </div>
                  ))
                ) : (
                  <p>Pas d'équipe définie</p>
                )}
              </div>
              <Link to={`/trainer/${trainer._id}`}>
                <button className="details-button">Voir Détails</button>
              </Link>
            </div>
          ))
        ) : (
          <p>Aucun autre dresseur trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default TrainersList;
