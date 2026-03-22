const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = adminAuth;