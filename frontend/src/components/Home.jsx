import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assurez-vous d'avoir un contexte d'authentification

function Home() {
  const { user } = useAuth(); // Récupération des infos de l'utilisateur
  const navigate = useNavigate();

  return (
    <div>
      <h1>Bienvenue sur le Pokédex</h1>

      {user ? (
        <>
          <button onClick={() => navigate("/pokemons")}>Gérer mes Pokémon</button>
          <button onClick={() => navigate("/trainers")} style={{ marginLeft: "10px" }}>
            Gérer le dresseur
          </button>
        </>
      ) : (
        <p>Connecte-toi pour gérer tes Pokémon et ton Trainer !</p>
      )}
    </div>
  );
}

export default Home;
