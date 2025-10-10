const Cake = require('../models/cake');

exports.getCakes = async (req, res) => {
  try { const cakes = await Cake.find(); res.json(cakes); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json(cake);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createCake = async (req, res) => {
  try {
    const cake = new Cake(req.body);
    await cake.save();
    res.status(201).json(cake);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateCake = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json(cake);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteCake = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.json({ message: 'Cake deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
