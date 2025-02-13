const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: [String], required: true },
  level: { type: Number, default: 1 }
});

module.exports = mongoose.model("Pokemon", PokemonSchema);
