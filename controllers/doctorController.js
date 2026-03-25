const Doctor = require("../models/Doctor");
const { validationResult } = require("express-validator");

// ================= REGISTER DOCTOR =================
exports.registerDoctor = async (req, res, next) => {
  try {
    // 1. Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, specialization, experience } = req.body;
    const certificate = req.file ? req.file.path : null;

    // 2. Check existing doctor
    const existingDoctor = await Doctor.findOne({
      where: { email }
    });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor with this email already exists"
      });
    }

    // 3. Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      specialization,
      experience,
      certificateUrl: certificate,
      verificationStatus: "pending"
    });

    // 4. Response
    res.status(201).json({
      message: "Doctor registered successfully",
      doctor
    });

  } catch (error) {
    // Handle unique constraint (extra safety)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Doctor with this email already exists"
      });
    }

    next(error);
  }
};


// ================= GET DOCTOR BY ID =================
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      success: true,
      doctor
    });

  } catch (error) {
    next(error);
  }
};


// ================= GET APPROVED DOCTORS =================
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