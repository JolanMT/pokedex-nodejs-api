const trainerService = require("../services/trainerService");

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await trainerService.getAllTrainers();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const newTrainer = await trainerService.createTrainer(req.body);
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du dresseur" });
  }
};
