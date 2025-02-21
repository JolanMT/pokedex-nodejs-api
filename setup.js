require("dotenv").config();
const connectDB = require("./src/config/db");
const mongoose = require("mongoose");

const Pokemon = require("./src/models/Pokemon");
const Trainer = require("./src/models/Trainer");
const User = require("./src/models/User");

const initializeDB = async () => {
  try {
    console.log("Tentative de connexion...");
    await connectDB(); // Connexion MongoDB
    await mongoose.connection.asPromise(); // 🔹 Attendre que la connexion soit totalement établie
    console.log("✅ Connexion MongoDB établie !");

    console.log("Suppression des collections...");
    await Promise.all([
      Pokemon.deleteMany({}),
      Trainer.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log("✅ Collections supprimées !");

    console.log("Insertion des données...");
    await Pokemon.create({
      name: "Pikachu",
      imagePath: "images/pikachu.png",
      description: "Un Pokémon de type électrique connu pour sa rapidité.",
      types: ["Electric"],
      regions: ["Kanto"],
      capacities: ["Éclair", "Fatal-Foudre"],
      stats: {
        HP: 35,
        ATK: 55,
        ATKSPE: 50,
        DEF: 40,
        DEFSPE: 50,
        VIT: 90
      }
    });

    await Trainer.create({
      email: "ash@kanto.com",
      username: "AshKetchum",
      password: "pikachu123",
      role: "USER"
    });

    await User.create({
      username: "admin",
      password: "adminpassword",
      role: "ADMIN"
    });

    console.log("✅ Données insérées avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la base :", error);
    process.exit(1);
  }
};

// Exécuter l'initialisation
initializeDB();
