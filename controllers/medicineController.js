const Medicine = require("../models/Medicine");
const { validationResult } = require("express-validator");

exports.addMedicine = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, composition, dosageForm, manufacturer } = req.body;

    const medicine = new Medicine({ name, composition, dosageForm, manufacturer });
    await medicine.save();

    res.status(201).json({
      message: "Medicine added successfully",
      medicine
    });

  } catch (error) {
    next(error);
  }
};

exports.getMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    next(error);
  }
};