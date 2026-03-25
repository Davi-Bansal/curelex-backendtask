const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  bookAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

const auth = require("../middleware/auth");

// ================= BOOK APPOINTMENT =================
router.post(
  "/book",
  auth,
  [
    body("patientId").notEmpty().withMessage("Patient ID is required"),
    body("doctorId").notEmpty().withMessage("Doctor ID is required"),
    body("appointmentTime")
      .notEmpty()
      .withMessage("Appointment time is required")
      .isISO8601()
      .withMessage("Invalid date format"),
    body("symptoms").optional().isString()
  ],
  bookAppointment
);

// ================= GET PATIENT =================
router.get("/patient/:id", auth, getAppointmentsByPatient);

// ================= GET DOCTOR =================
router.get("/doctor/:id", auth, getAppointmentsByDoctor);

// ================= UPDATE STATUS =================
router.put("/status/:id", auth, updateAppointmentStatus);

module.exports = router;