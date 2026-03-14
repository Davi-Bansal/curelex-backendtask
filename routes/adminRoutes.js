const express = require("express");
const router = express.Router();

const {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor
} = require("../controllers/adminController");

const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.get("/pending-doctors", auth, adminAuth, getPendingDoctors);
router.post("/approve/:id", auth, adminAuth, approveDoctor);
router.post("/reject/:id", auth, adminAuth, rejectDoctor);

module.exports = router;