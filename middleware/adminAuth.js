const adminAuth = (req, res, next) => {
  try {
    // req.user is set by auth middleware before this runs
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;