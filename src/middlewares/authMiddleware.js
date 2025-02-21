const jwt = require("jsonwebtoken");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Accès interdit, admin requis" });
  }
  next();
};


const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("🔐 Token reçu dans authMiddleware :", token);  // <--- LOG

  if (!token) {
    console.log("🚫 Aucun token fourni !");
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé dans authMiddleware :", decoded);  // <--- LOG
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Erreur lors de la vérification du token :", error.message);  // <--- LOG
    res.status(401).json({ message: "Token invalide" });
  }
};


module.exports = { authMiddleware, isAdmin };
