const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.bookAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId, doctorId, date, time } = req.body;

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if doctor is approved
    if (doctor.verificationStatus !== "approved") {
      return res.status(400).json({ message: "Doctor is not verified yet" });
    }

    // Check if slot already booked
    const existingAppointment = await Appointment.findOne({ doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const appointment = new Appointment({ patientId, doctorId, date, time });
    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    next(error);
  }
};

// Get appointments for a patient
exports.getAppointmentsByPatient = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.id })
      .populate("doctorId", "name specialization experience")
      .populate("patientId", "name email");

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    next(error);
  }
};

// Get appointments for a doctor
exports.getAppointmentsByDoctor = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.id })
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email");

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {
    next(error);
  }
};