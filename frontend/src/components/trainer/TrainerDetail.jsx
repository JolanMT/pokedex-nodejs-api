import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TrainerDetail = () => {
    const { id } = useParams();
    const [trainer, setTrainer] = useState(null);
    const token = localStorage.getItem("token");
    useEffect(() => {
      const fetchTrainer = async () => {
        try {
          if (!token) {
            console.error("🚫 Aucun token trouvé, redirection...");
            return;
          }
  
          const response = await axios.get(`http://localhost:5000/api/trainers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Ajout du token
          });
  
          setTrainer(response.data);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération du dresseur :", error);
        }
      };
  
      fetchTrainer();
    }, [id, token]);

  if (!trainer) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Détails de {trainer.username}</h1>
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
    </div>
  );
};

export default TrainerDetail;
