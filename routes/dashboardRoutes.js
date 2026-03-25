const express = require("express");
const router = express.Router();

const {
  getPatientDashboard,
  getDoctorDashboard
} = require("../controllers/dashboardController");

// Patient dashboard
router.get("/patient/:id", getPatientDashboard);

// Doctor dashboard
router.get("/doctor/:id", getDoctorDashboard);

module.exports = router;