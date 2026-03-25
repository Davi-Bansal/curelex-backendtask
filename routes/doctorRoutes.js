const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const upload = require("../middleware/upload");
const {
  registerDoctor,
  getApprovedDoctors,
  getDoctorById
} = require("../controllers/doctorController");

router.post(
  "/register",
  upload.single("certificate"),
  [
    body("name").notEmpty().withMessage("Doctor name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("specialization").notEmpty().withMessage("Specialization is required"),
    body("experience").isNumeric().withMessage("Experience must be a number")
  ],
  registerDoctor
);

router.get("/all", getApprovedDoctors);
router.get("/:id", getDoctorById);
module.exports = router;