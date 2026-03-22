const Doctor = require("../models/Doctor");
const { validationResult } = require("express-validator");

exports.registerDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, specialization, experience } = req.body;
    const certificate = req.file ? req.file.path : null;

    // ✅ FIX: store result
    const existingDoctor = await Doctor.findOne({
      where: { email }
    });

    // ✅ FIX: correct message (must match test)
    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor with this email already exists"
      });
    }

    const doctor = await Doctor.create({
      name,
      email,
      specialization,
      experience,
      certificateUrl: certificate,
      verificationStatus: "pending"
    });

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor
    });

  } catch (error) {

    // ✅ EXTRA SAFETY (handles DB unique constraint)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Doctor with this email already exists"
      });
    }

    next(error);
  }
};

exports.getApprovedDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      where: { verificationStatus: "approved" }
    });

    res.json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    next(error);
  }
};