const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  bookAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor
} = require("../controllers/appointmentController");

const auth = require("../middleware/auth");

router.post(
  "/book",
  auth,
  [
    body("patientId").notEmpty().withMessage("Patient ID is required"),
    body("doctorId").notEmpty().withMessage("Doctor ID is required"),
    body("date").notEmpty().withMessage("Appointment date is required"),
    body("time").notEmpty().withMessage("Appointment time is required")
  ],
  bookAppointment
);

router.get("/patient/:id", auth, getAppointmentsByPatient);
router.get("/doctor/:id", auth, getAppointmentsByDoctor);

module.exports = router;