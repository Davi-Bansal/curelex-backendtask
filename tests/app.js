// tests/app.js
// Separate app setup from server listen so tests can import without starting a port
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const errorHandler = require("../middleware/errorHandler");
const userRoutes = require("../routes/userRoutes");
const doctorRoutes = require("../routes/doctorRoutes");
const adminRoutes = require("../routes/adminRoutes");
const appointmentRoutes = require("../routes/appointmentRoutes");
const prescriptionRoutes = require("../routes/prescriptionRoutes");
const medicineRoutes = require("../routes/medicineRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medicines", medicineRoutes);

app.get("/", (req, res) => res.send("Curelex Backend Server Running"));

app.use(errorHandler);

module.exports = app;