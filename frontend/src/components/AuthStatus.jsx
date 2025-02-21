import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthStatus = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div id="connexionHeader">


      {user ? (
        <>
          <p>Bienvenue, {user.username} !</p>
          <button onClick={logout}>Se déconnecter</button>
        </>
      ) : (
        <>
          <p>Vous n'êtes pas connecté.</p>
          <button onClick={() => navigate("/login")}>Se connecter</button>
          <button onClick={() => navigate("/register")}>S'inscrire</button>
        </>
      )}
            {location.pathname !== "/" && (
        <button onClick={() => navigate("/")}>Accueil</button>
      )}
    </div>
  );
};

export default AuthStatus;
