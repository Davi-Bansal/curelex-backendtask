const Doctor = require("../models/Doctor");

exports.getPendingDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      where: { verificationStatus: "pending" }
    });

    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

exports.approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.verificationStatus = "approved";
    await doctor.save();

    res.json({
      message: "Doctor Approved",
      doctor
    });
  } catch (error) {
    next(error);
  }
};

exports.rejectDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.verificationStatus = "rejected";
    await doctor.save();

    res.json({
      message: "Doctor Rejected",
      doctor
    });
  } catch (error) {
    next(error);
  }
};