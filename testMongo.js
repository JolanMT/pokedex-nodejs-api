require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  try {
    console.log("Tentative de connexion à :", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connexion MongoDB réussie !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Échec de connexion à MongoDB :", error);
    process.exit(1);
  }
};

testConnection();
