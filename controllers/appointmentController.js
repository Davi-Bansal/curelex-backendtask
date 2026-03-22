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

    const patient = await User.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.verificationStatus !== "approved") {
      return res.status(400).json({ message: "Doctor is not verified yet" });
    }

    const existingAppointment = await Appointment.findOne({
      where: { doctorId, date, time }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// Patient appointments
exports.getAppointmentsByPatient = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.params.id }
    });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// Doctor appointments
exports.getAppointmentsByDoctor = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      where: { doctorId: req.params.id }
    });

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};