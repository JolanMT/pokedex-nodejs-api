import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Bienvenue sur le Pokédex</h1>
      <p>Connecte-toi pour gérer tes Pokémon !</p>
      <Link to="/login">Se connecter</Link> | <Link to="/register">S'inscrire</Link>
    </div>
  );
}

export default Home;
