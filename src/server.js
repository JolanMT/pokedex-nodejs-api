const dotenv = require("dotenv").config({ path: "X:\\.env "});

const logger = require("./middlewares/logger");

logger.info("✅ Winston fonctionne bien !");
logger.error("⚠️ Ceci est un test d'erreur !");

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

connectDB();

app.use(express.static('public'));

app.use(express.json());

const trainerRoutes = require("./routes/trainerRoutes");
const authRoutes = require("./routes/authRoutes");
const pokemonRoutes = require("./routes/pokemonRoutes");

app.use("/uploads", express.static("uploads"));
app.use("/api/pkmn", pokemonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/pokemons", pokemonRoutes);
app.use("/api/pkmn", (req, res, next) => {
    console.log(`📡 Requête reçue sur /api/pkmn avec méthode ${req.method} et URL ${req.url}`);
    next();
  }, pokemonRoutes);
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
