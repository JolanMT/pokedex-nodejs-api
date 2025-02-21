import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PokemonForm = ({ isEdit = false, existingPokemon = {} }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [types, setTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [stats, setStats] = useState({ HP: 0, ATK: 0, ATKSPE: 0, DEF: 0, DEFSPE: 0, VIT: 0 });
  const [imageFile, setImageFile] = useState(null); // Gestion de l'image

  const navigate = useNavigate();

  // 🔄 Remplissage des champs en mode édition
  useEffect(() => {
    if (isEdit && existingPokemon) {
      setName(existingPokemon.name || "");
      setDescription(existingPokemon.description || "");
      setTypes(existingPokemon.types || []);
      setRegions(existingPokemon.regions || []);
      setCapacities(existingPokemon.capacities || []);
      setStats(existingPokemon.stats || { HP: 0, ATK: 0, ATKSPE: 0, DEF: 0, DEFSPE: 0, VIT: 0 });
    }
  }, [isEdit, existingPokemon]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Aucun token trouvé, utilisateur non authentifié.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("types", JSON.stringify(types));
    formData.append("regions", JSON.stringify(regions));
    formData.append("capacities", JSON.stringify(capacities));
    formData.append("stats", JSON.stringify(stats));

    if (imageFile) {
      formData.append("image", imageFile); // Ajoute l'image
    }

    try {
      console.log("📤 Envoi des données :", formData);
      const url = isEdit
        ? `http://localhost:5000/api/pkmn/${existingPokemon._id}`
        : `http://localhost:5000/api/pkmn`;

      const method = isEdit ? "put" : "post";

      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      navigate("/pokemons");
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde du Pokémon :", error.response ? error.response.data : error.message);
    }
  };

  // ✅ Gestion des types
  const handleTypeChange = (e) => {
    setTypes(e.target.value.split(",").map((type) => type.trim().toUpperCase()));
  };

  // ✅ Gestion des régions
  const handleRegionChange = (e) => {
    setRegions(e.target.value.split(",").map((region) => region.trim()));
  };

  // ✅ Ajouter une capacité (max 4)
  const handleAddCapacity = () => {
    if (capacities.length < 4) {
      setCapacities([...capacities, ""]); // Ajoute un champ vide
    }
  };

  // ✅ Supprimer une capacité
  const handleRemoveCapacity = (index) => {
    const newCapacities = capacities.filter((_, i) => i !== index);
    setCapacities(newCapacities);
  };

  // ✅ Modifier une capacité existante
  const handleCapacityChange = (index, value) => {
    const newCapacities = [...capacities];
    newCapacities[index] = value;
    setCapacities(newCapacities);
  };

  // ✅ Gestion des statistiques
  const handleStatChange = (stat, value) => {
    setStats({ ...stats, [stat]: parseInt(value, 10) || 0 });
  };

  return (
    <div>
      <h2>{isEdit ? "Modifier le Pokémon" : "Ajouter un Pokémon"}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Nom :</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <br />

        <label>Description :</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        <br />

        <label>Image :</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!isEdit} />
        <br />

        <label>Types (séparés par des virgules) :</label>
        <input type="text" value={types.join(", ")} onChange={handleTypeChange} required />
        <br />

        <label>Régions (séparées par des virgules) :</label>
        <input type="text" value={regions.join(", ")} onChange={handleRegionChange} required />
        <br />

        {/* 🔹 Capacités dynamiques */}
        <label>Capacités (max 4) :</label>
        {capacities.map((capacity, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
            <input
              type="text"
              value={capacity}
              onChange={(e) => handleCapacityChange(index, e.target.value)}
              required
            />
            <button type="button" onClick={() => handleRemoveCapacity(index)}>🗑</button>
          </div>
        ))}
        {capacities.length < 4 && (
          <button type="button" onClick={handleAddCapacity}>+ Ajouter une capacité</button>
        )}
        <br />

        {/* 🔹 Statistiques */}
        <label>Statistiques :</label>
        <div>
          {["HP", "ATK", "ATKSPE", "DEF", "DEFSPE", "VIT"].map((stat) => (
            <div key={stat}>
              <label>{stat} :</label>
              <input
                type="number"
                value={stats[stat]}
                onChange={(e) => handleStatChange(stat, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <br />

        <button type="submit">{isEdit ? "Modifier" : "Ajouter"}</button>
      </form>
    </div>
  );
};

export default PokemonForm;
