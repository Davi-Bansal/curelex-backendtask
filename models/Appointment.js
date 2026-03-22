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
  date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "completed"),
    defaultValue: "pending"
  }
}, {
  timestamps: true
});

module.exports = Appointment;