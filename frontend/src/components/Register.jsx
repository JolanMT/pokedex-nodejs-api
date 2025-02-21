import { useState } from "react";
import axios from "axios";
import "./register.css"; // Import du CSS spécifique

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Tentative d'inscription avec :", { email, username, password });

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        username,
        password,
      });
      console.log("✅ Inscription réussie :", response.data);
    } catch (error) {
      console.error("❌ Erreur d'inscription :", error.response?.data || error.message);
    }
  };

  return (
    <div className="register-page"> {/* Classe spécifique pour ne pas affecter les autres pages */}
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
