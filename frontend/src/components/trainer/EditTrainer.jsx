import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTrainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 🔹 Définition du state du dresseur
    const [trainer, setTrainer] = useState({
        username: "",
        caughtPokemonCount: 0,
        favoritePokemon: "",
        team: Array(6).fill(""), // 🔥 Assure qu'il y a toujours 6 slots pour l'équipe
        imagePath: "",
    });

    const [pokemons, setPokemons] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Récupération des données du dresseur et des Pokémon
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Vérifier si le token est présent
                if (!token) {
                    console.error("❌ Aucun token trouvé, redirection vers connexion...");
                    navigate("/login");
                    return;
                }

                // ✅ Récupérer les infos du dresseur
                const trainerRes = await axios.get(`http://localhost:5000/api/trainers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // ✅ Récupérer les Pokémon capturés par le dresseur
                const pokemonsRes = await axios.get(`http://localhost:5000/api/trainers/${id}/caughtPokemons`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setPokemons(pokemonsRes.data);

                // 🔹 Mise à jour des infos du dresseur
                setTrainer({
                    username: trainerRes.data.username || "",
                    caughtPokemonCount: trainerRes.data.caughtPokemonCount || 0,
                    favoritePokemon: trainerRes.data.favoritePokemon?._id || "",
                    team: trainerRes.data.team?.length ? trainerRes.data.team.map(p => p._id) : Array(6).fill(""),
                    imagePath: trainerRes.data.imagePath || "",
                });

                setLoading(false);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des données :", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    // 🔹 Gestion des changements dans le formulaire
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
    
        // Vérifier si l’équipe ne contient que des Pokémon capturés
        const unauthorizedPokemon = trainer.team.some(pokeId => !pokemons.some(p => p._id === pokeId));
        if (unauthorizedPokemon) {
            alert("Vous ne pouvez ajouter que des Pokémon que vous avez capturés !");
            return;
        }
    
        const formData = new FormData();
        formData.append("username", trainer.username);
        formData.append("caughtPokemonCount", trainer.caughtPokemonCount);
        formData.append("favoritePokemon", trainer.favoritePokemon || "");
        formData.append("team", JSON.stringify(trainer.team));
    
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
    
    if (loading) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Modifier le dresseur</h2>
            <form onSubmit={handleSubmit}>
                {/* ✅ Image du dresseur */}
                <label>Image de profil :</label>
                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
                {trainer.imagePath && (
                    <img src={`http://localhost:5000${trainer.imagePath}`} alt="Avatar" style={{ width: "100px", borderRadius: "50%" }} />
                )}

                <label>Nom d'utilisateur :</label>
                <input type="text" name="username" value={trainer.username} onChange={handleChange} required />

                <label>Pokémons capturés :</label>
                <input type="number" name="caughtPokemonCount" value={trainer.caughtPokemonCount} onChange={handleChange} required />

                {/* ✅ Sélection du Pokémon favori */}
                <label>Pokémon favori :</label>
                <select name="favoritePokemon" value={trainer.favoritePokemon || ""} onChange={handleChange}>
                    <option value="">Aucun</option>
                    {pokemons.map((pokemon) => (
                        <option key={pokemon._id} value={pokemon._id}>
                            {pokemon.name}
                        </option>
                    ))}
                </select>

                {/* ✅ Sélection de l'équipe Pokémon */}
                <label>Équipe Pokémon :</label>
                {trainer.team.map((pokeId, index) => (
                    <div key={index}>
                        <label>Slot {index + 1} :</label>
                        <select onChange={(e) => handleTeamChange(index, e.target.value)} value={pokeId || ""}>
                            <option value="">Choisir un Pokémon</option>
                            {pokemons.map((pokemon) => (
                                <option key={pokemon._id} value={pokemon._id}>
                                    {pokemon.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                <button type="submit">Enregistrer</button>
            </form>
        </div>
    );
};

export default EditTrainer;
