const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const pokemonRoutes = require("./routes/pokemonRoutes");
const trainerRoutes = require("./routes/trainerRoutes");

app.use("/api/pokemons", pokemonRoutes);
app.use("/api/trainers", trainerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\? Serveur démarré sur le port \\));
