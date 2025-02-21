import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import du contexte d'authentification
import "./register.css"; // Import du CSS spécifique

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Fonction pour gérer l'authentification
  const navigate = useNavigate(); // Hook pour la redirection

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Tentative d'inscription avec :", { email, username, password });

    try {
      // Inscription
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        username,
        password,
      });
      console.log("✅ Inscription réussie :", response.data);

      // Connexion automatique après inscription
      const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("✅ Connexion automatique réussie :", loginResponse.data);
      login(loginResponse.data.token, loginResponse.data.user); // Stocker le token et les infos user

      // Rediriger vers la gestion des Pokémon
      navigate("");

    } catch (error) {
      console.error("❌ Erreur :", error.response?.data || error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Inscription</h2>
        <form onSubmit={handleRegister}>
          <label>
            Email :
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br />
          <label>
            Nom d'utilisateur :
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <br />
          <label>
            Mot de passe :
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <br />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
