const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Trainer");
const logger = require("../middlewares/logger");

exports.register = async (email, username, password) => { 
  try {
    logger.info(`👤 Vérification de l'existence de ${email}...`);
    
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
      logger.error(`⚠️ Échec: ${email} existe déjà`);
      throw new Error("Cet email est déjà utilisé !");
    }

    logger.info(`🔑 Hashage du mot de passe pour ${username}...`);
    const hashedPassword = await bcrypt.hash(password, 10);

    logger.info(`💾 Création de l'utilisateur ${username} avec l'email ${email}...`);
    const newUser = await User.create({ email, username, password: hashedPassword });

    logger.info(`✅ Utilisateur ${username} enregistré avec succès !`);

    const token = jwt.sign(
      { id: newUser._id, email, username, role: newUser.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    

    return token;
  } catch (error) {
    logger.error(`❌ Erreur dans authService.register(): ${error.message}`);
    throw error;
  }
};
exports.login = async (email, password) => {
  try {
    logger.info(`👤 Vérification de l'existence de ${email}...`);
    const user = await User.findOne({ email });

    if (!user) {
      logger.error(`❌ Aucun utilisateur trouvé avec l'email ${email}`);
      throw new Error("Utilisateur non trouvé !");
    }

    logger.info(`🔐 Vérification du mot de passe pour ${email}...`);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.error(`❌ Mot de passe incorrect pour ${email}`);
      throw new Error("Mot de passe incorrect !");
    }

    logger.info(`✅ Connexion réussie pour ${email}`);
    const token = jwt.sign(
      { id: user._id, email, username: user.username, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    
    

    return token;
  } catch (error) {
    logger.error(`❌ Erreur dans authService.login(): ${error.message}`);
    throw error;
  }
};