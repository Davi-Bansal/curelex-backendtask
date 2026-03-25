require("dotenv").config();

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");


// =======================================================
// ================= USER CONTROLLER ======================
// =======================================================

// REGISTER USER
exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, age, gender, mobile } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      mobile
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        mobile: user.mobile,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};


// LOGIN USER
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};



// =======================================================
// ============== APPOINTMENT CONTROLLER ==================
// =======================================================

// BOOK APPOINTMENT
exports.bookAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId, doctorId, symptoms, appointmentTime } = req.body;

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
      where: { doctorId, appointmentTime }
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked"
      });
    }

    const meetingId = Math.random().toString(36).substring(2, 10);
    const meetingLink = `https://meet.curelex.com/${meetingId}`;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      symptoms,
      appointmentTime,
      meetingLink,
      status: "scheduled"
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    next(error);
  }
};


// GET PATIENT APPOINTMENTS
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


// GET DOCTOR APPOINTMENTS
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


// UPDATE APPOINTMENT STATUS
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["scheduled", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Status updated successfully",
      appointment
    });

  } catch (error) {
    next(error);
  }
};