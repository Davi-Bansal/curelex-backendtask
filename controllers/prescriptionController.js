const Prescription = require("../models/Prescription");
const { validationResult } = require("express-validator");

exports.addPrescription = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId, doctorId, medicines, notes } = req.body;

    const prescription = new Prescription({ patientId, doctorId, medicines, notes });
    await prescription.save();

    res.status(201).json({
      message: "Prescription added successfully",
      prescription
    });

  } catch (error) {
    next(error);
  }
};

// Get prescriptions for a patient
exports.getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.id })
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email");

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });

  } catch (error) {
    next(error);
  }
};

// Get prescriptions by doctor
exports.getPrescriptionsByDoctor = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.params.id })
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email");

    res.json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });

  } catch (error) {
    next(error);
  }
};