const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },

  imagePath: { type: String, default: "/uploads/default-avatar.png" }, // ✅ Ajout de l'image de profil

  caughtPokemonCount: { type: Number, default: 0 }, 
  caughtPokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }], 
  favoritePokemon: { type: mongoose.Schema.Types.ObjectId, ref: "Pokemon", default: null }, 
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon", maxlength: 6 }], // ✅ Confirmer la relation
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
