const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Prescription = sequelize.define("Prescription", {
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
  medicines: {
    type: DataTypes.JSON, // important change
    allowNull: false
  },
  notes: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Prescription;