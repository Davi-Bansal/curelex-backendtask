const Doctor = require("../models/Doctor");
const { validationResult } = require("express-validator");

exports.registerDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, specialization, experience } = req.body;

    // req.file.path gives the Cloudinary URL when using multer-storage-cloudinary
    const certificate = req.file ? req.file.path : null;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor with this email already exists" });
    }

    const doctor = new Doctor({
      name,
      email,
      specialization,
      experience,
      certificateUrl: certificate
    });

    await doctor.save();

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor
    });

  } catch (error) {
    next(error);
  }
};

exports.getApprovedDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ verificationStatus: "approved" });

    res.json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    next(error);
  }
};