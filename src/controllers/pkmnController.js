const pkmnService = require("../services/pkmnService");

exports.getTypes = (req, res) => {
  try {
    const types = pkmnService.getPokemonTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
