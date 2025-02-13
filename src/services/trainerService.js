const Trainer = require("../models/Trainer");

const getAllTrainers = async () => {
  return await Trainer.find().populate("pokemons");
};

const createTrainer = async (trainerData) => {
  const newTrainer = new Trainer(trainerData);
  return await newTrainer.save();
};

module.exports = { getAllTrainers, createTrainer };
