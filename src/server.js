const dotenv = require("dotenv").config({ path: "X:\\.env "});

const logger = require("./middlewares/logger");

logger.info("✅ Winston fonctionne bien !");
logger.error("⚠️ Ceci est un test d'erreur !");

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Configurer CORS pour accepter les requêtes depuis le frontend
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

connectDB();


app.use(express.json());

const pokemonRoutes = require("./routes/pokemonRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const pkmnRoutes = require("./routes/pkmnRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/pkmn", pkmnRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/pokemons", pokemonRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
