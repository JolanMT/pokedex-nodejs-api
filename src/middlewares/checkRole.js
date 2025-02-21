const checkRole = (requiredRole) => {
  return (req, res, next) => {
    console.log("👤 Utilisateur courant dans checkRole :", req.user);  // <--- LOG
    if (req.user && req.user.role === requiredRole) {
      console.log(`✅ Rôle ${requiredRole} validé !`);
      next();
    } else {
      console.log(`🚫 Accès interdit, rôle requis : ${requiredRole}, rôle actuel : ${req.user?.role}`);
      res.status(403).json({ message: "Accès interdit." });
    }
  };
};
module.exports = checkRole;
