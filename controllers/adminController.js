const Doctor = require("../models/Doctor");

exports.getPendingDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({
      verificationStatus: "pending"
    });

    res.json(doctors);

  } catch (error) {
    next(error);
  }
};

exports.approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: "approved" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

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
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: "rejected" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      message: "Doctor Rejected",
      doctor
    });

  } catch (error) {
    next(error);
  }
};