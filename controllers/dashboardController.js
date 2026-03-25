const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const { Op } = require("sequelize");

// ================= PATIENT DASHBOARD =================
exports.getPatientDashboard = async (req, res, next) => {
  try {
    const patientId = req.params.id;

    const totalAppointments = await Appointment.count({
      where: { patientId }
    });

    const upcomingAppointments = await Appointment.count({
      where: {
        patientId,
        appointmentTime: {
          [Op.gt]: new Date()
        }
      }
    });

    const prescriptionsCount = await Prescription.count({
      where: { patientId }
    });

    const doctorsConsulted = await Appointment.count({
      distinct: true,
      col: "doctorId",
      where: { patientId }
    });

    res.json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        prescriptionsCount,
        doctorsConsulted
      }
    });

  } catch (error) {
    next(error);
  }
};

// ================= DOCTOR DASHBOARD =================
exports.getDoctorDashboard = async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    const totalAppointments = await Appointment.count({
      where: { doctorId }
    });

    const todayAppointments = await Appointment.count({
      where: {
        doctorId,
        appointmentTime: {
          [Op.between]: [
            new Date().setHours(0, 0, 0, 0),
            new Date().setHours(23, 59, 59, 999)
          ]
        }
      }
    });

    const totalPatients = await Appointment.count({
      distinct: true,
      col: "patientId",
      where: { doctorId }
    });

    const completedAppointments = await Appointment.count({
      where: {
        doctorId,
        status: "completed"
      }
    });

    res.json({
      success: true,
      data: {
        totalAppointments,
        todayAppointments,
        totalPatients,
        completedAppointments
      }
    });

  } catch (error) {
    next(error);
  }
};