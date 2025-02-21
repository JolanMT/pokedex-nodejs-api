const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imagePath: { type: String, required: true }, // Chemin local au lieu d'une URL externe
  description: { type: String, required: true },
  types: [{ type: String, required: true }],
  regions: [{ type: String }],
  capacities: [{ type: String }],
  stats: {
    HP: { type: Number, required: true },
    ATK: { type: Number, required: true },
    ATKSPE: { type: Number, required: true },
    DEF: { type: Number, required: true },
    DEFSPE: { type: Number, required: true },
    VIT: { type: Number, required: true },
  },
});

module.exports = mongoose.model("Pokemon", pokemonSchema);
