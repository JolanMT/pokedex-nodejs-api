import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css"; // Import du CSS uniquement pour cette page

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Tentative de connexion avec :", { email, password });

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log("✅ Connexion réussie :", response.data);
      login(response.data.token);
      navigate("/"); // Redirige vers l'accueil après la connexion
    } catch (error) {
      console.error("❌ Erreur de connexion :", error.response?.data || error.message);
    }
  };

  return (
    <div className="login-page"> {/* Applique uniquement ce style ici */}
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <label>
            Email :
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br />
          <label>
            Mot de passe :
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <br />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
