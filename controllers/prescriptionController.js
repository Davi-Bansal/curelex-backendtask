const Prescription = require("../models/Prescription");
const { validationResult } = require("express-validator");

exports.addPrescription = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId, doctorId, medicines, notes } = req.body;

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      medicines,
      notes
    });

    res.status(201).json({
      message: "Prescription added successfully",
      prescription
    });
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { patientId: req.params.id }
    });

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    next(error);
  }
};

exports.getPrescriptionsByDoctor = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { doctorId: req.params.id }
    });

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    next(error);
  }
};