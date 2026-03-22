const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql");

const Doctor = sequelize.define("Doctor", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  certificateUrl: {
    type: DataTypes.STRING
  },
  verificationStatus: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending"
  }
}, {
  timestamps: true
});

module.exports = Doctor;