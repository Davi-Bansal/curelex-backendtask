const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Appointment = sequelize.define("Appointment", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // ✅ NEW FIELD
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // ✅ REPLACE date + time
  appointmentTime: {
    type: DataTypes.DATE,
    allowNull: false
  },

  // ✅ NEW TELEMEDICINE FIELD
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ✅ UPDATED STATUS
  status: {
    type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
    defaultValue: "scheduled"
  }

}, {
  timestamps: true
});

module.exports = Appointment;