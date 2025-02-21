const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("🛡️ Vérification du token dans authMiddleware...");
  
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("🔐 Token reçu :", token); 

  if (!token) {
    console.log("🚫 Aucun token fourni !");
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé :", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Erreur lors de la vérification du token :", error.message);
    res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = { authMiddleware };
