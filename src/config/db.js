const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI est manquant dans .env !");
    }
    await mongoose.connect(MONGO_URI);
    console.log("? MongoDB connect� avec succ�s !");
  } catch (error) {
    console.error("? Erreur de connexion � MongoDB :", error);
    process.exit(1);
  }
};

module.exports = connectDB;
