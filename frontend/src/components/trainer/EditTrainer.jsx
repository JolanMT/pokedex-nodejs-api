import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTrainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [trainer, setTrainer] = useState({
    username: "",
    caughtPokemonCount: 0,
    favoritePokemon: "",
    team: [],
    imagePath: ""
  });

  const [pokemons, setPokemons] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Récupérer les données du dresseur
        const trainerRes = await axios.get(`http://localhost:5000/api/trainers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrainer(trainerRes.data);

        // Récupérer tous les Pokémon disponibles pour choix
        const pokemonsRes = await axios.get("http://localhost:5000/api/pkmn", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPokemons(pokemonsRes.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer({ ...trainer, [name]: value });
  };

  const handleTeamChange = (index, value) => {
    const newTeam = [...trainer.team];
    newTeam[index] = value;
    setTrainer({ ...trainer, team: newTeam });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("username", trainer.username);
    formData.append("caughtPokemonCount", trainer.caughtPokemonCount);
    formData.append("favoritePokemon", trainer.favoritePokemon);
    formData.append("team", trainer.team.join(","));
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put(`http://localhost:5000/api/trainers/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      navigate(`/trainers/${id}`);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du dresseur :", error);
    }
  };

  if (!trainer || !pokemons.length) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Modifier le dresseur</h2>
      <form onSubmit={handleSubmit}>
        {/* Image du dresseur */}
        <label>Image de profil :</label>
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        {trainer.imagePath && <img src={`http://localhost:5000${trainer.imagePath}`} alt="Avatar" style={{ width: "100px", borderRadius: "50%" }} />}
        
        <label>Nom d'utilisateur :</label>
        <input type="text" name="username" value={trainer.username} onChange={handleChange} required />

        <label>Pokémons capturés :</label>
        <input type="number" name="caughtPokemonCount" value={trainer.caughtPokemonCount} onChange={handleChange} required />

        {/* Sélection du Pokémon favori */}
        <label>Pokémon favori :</label>
        <select name="favoritePokemon" value={trainer.favoritePokemon} onChange={handleChange}>
          <option value="">Aucun</option>
          {pokemons.map((pokemon) => (
            <option key={pokemon._id} value={pokemon._id}>
              {pokemon.name}
            </option>
          ))}
        </select>

        {/* Sélection de l'équipe de 6 Pokémon */}
        <label>Équipe Pokémon :</label>
        {trainer.team.map((pokeId, index) => (
          <select key={index} onChange={(e) => handleTeamChange(index, e.target.value)} value={pokeId || ""}>
            <option value="">Choisir un Pokémon</option>
            {pokemons.map((pokemon) => (
              <option key={pokemon._id} value={pokemon._id}>
                {pokemon.name}
              </option>
            ))}
          </select>
        ))}

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default EditTrainer;
