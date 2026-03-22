const Medicine = require("../models/Medicine");
const { validationResult } = require("express-validator");

exports.addMedicine = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, composition, dosageForm, manufacturer } = req.body;

    const medicine = await Medicine.create({
      name,
      composition,
      dosageForm,
      manufacturer
    });

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
    const medicines = await Medicine.findAll();
    res.json(medicines);
  } catch (error) {
    next(error);
  }
};