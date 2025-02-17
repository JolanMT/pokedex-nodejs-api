import { useState } from "react";
import axios from "axios";

const Register = () => {
  // Ajout de l'état pour l'email en plus de username et password
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Tentative d'inscription avec :", { email, username, password });

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email, // On ajoute l'email
        username,
        password,
      });
      console.log("✅ Inscription réussie :", response.data);
    } catch (error) {
      console.error("❌ Erreur d'inscription :", error.response?.data || error.message);
    }
  };

  return (
    <div>
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
  );
};

export default Register;
