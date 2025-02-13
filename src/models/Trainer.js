const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  pokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }]
});

module.exports = mongoose.model("Trainer", TrainerSchema);
