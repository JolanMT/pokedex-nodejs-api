const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Trainer"); // Assurez-vous que le modèle est correct
const logger = require("../middlewares/logger");

exports.register = async (username, password) => {
  try {
    logger.info(`👤 Vérification de l'existence de ${username}...`);
    
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      logger.error(`⚠️ Échec: ${username} existe déjà`);
      throw new Error("Cet utilisateur existe déjà !");
    }

    logger.info(`🔑 Hashage du mot de passe pour ${username}...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    logger.info(`💾 Création de l'utilisateur ${username} en BDD...`);
    const newUser = await User.create({ username, password: hashedPassword });

    logger.info(`✅ Utilisateur ${username} enregistré avec succès !`);

    const token = jwt.sign({ id: newUser._id, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    logger.error(`❌ Erreur dans authService.register(): ${error.message}`);
    throw error;
  }
};
