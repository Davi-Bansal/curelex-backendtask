const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  composition: { type: String },
  dosageForm: { type: String },
  manufacturer: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Medicine", medicineSchema);