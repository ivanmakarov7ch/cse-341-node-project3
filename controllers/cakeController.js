const Cake = require('../models/cake');

// GET all cakes
exports.getCakes = async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.status(200).json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single cake
exports.getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.status(200).json(cake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create cake
exports.createCake = async (req, res) => {
  try {
    const cake = new Cake(req.body);
    await cake.save();
    res.status(201).json(cake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update cake
exports.updateCake = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.status(200).json(cake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE cake
exports.deleteCake = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.status(200).json({ message: 'Cake deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
