const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());

const pokemonRoutes = require("./routes/pokemonRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const pkmnRoutes = require("./routes/pkmnRoutes");


app.use("/api/pkmn", pkmnRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/pokemons", pokemonRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
