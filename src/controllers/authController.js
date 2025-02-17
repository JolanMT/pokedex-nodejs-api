const authService = require("../services/authService");
const logger = require("../middlewares/logger");

exports.register = async (req, res) => {
  try {
    console.log("Données reçues :", req.body); // Ajoute ce log

    const { username, password } = req.body;
    logger.info(`Tentative d'inscription: ${username}`);

    if (!username || !password) {
      logger.error("Échec d'inscription: Champs manquants");
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const token = await authService.register(username, password);
    logger.info(`✅ Inscription réussie pour ${username}`);
    res.status(201).json({ token });
  } catch (error) {
    logger.error(`❌ Erreur d'inscription pour ${req.body.username || "Utilisateur inconnu"} : ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    logger.info(`Tentative de connexion: ${username}`);

    if (!username || !password) {
      logger.error("Échec de connexion: Champs manquants");
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const token = await authService.login(username, password);

    logger.info(`✅ Connexion réussie pour ${username}`);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    logger.error(`❌ Erreur de connexion pour ${req.body.username || "Utilisateur inconnu"} : ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

exports.checkUser = (req, res) => {
  res.json({ user: req.user });
};
