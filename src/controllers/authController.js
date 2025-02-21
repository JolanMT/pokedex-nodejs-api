const authService = require("../services/authService");
const logger = require("../middlewares/logger");

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body; 
    logger.info(`Tentative d'inscription: ${email}`);

    if (!email || !username || !password) {
      logger.error("Échec d'inscription: Champs manquants");
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const token = await authService.register(email, username, password, 'USER'); 
    logger.info(`✅ Inscription réussie pour ${username}`);
    res.status(201).json({ token });
  } catch (error) {
    logger.error(`❌ Erreur d'inscription pour ${username || "Utilisateur inconnu"} : ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Tentative de connexion: ${email}`);

    if (!email || !password) {
      logger.error("Échec de connexion: Champs manquants");
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const token = await authService.login(email, password);
    logger.info(`✅ Connexion réussie pour ${email}`);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`❌ Erreur de connexion pour ${email || "Utilisateur inconnu"} : ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

exports.checkUser = (req, res) => {
  res.json({ user: req.user });
};
