const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { addMedicine, getMedicines } = require("../controllers/medicineController");

router.post(
  "/add",
  [
    body("name").notEmpty().withMessage("Medicine name is required"),
    body("composition").notEmpty().withMessage("Composition is required"),
    body("dosageForm").notEmpty().withMessage("Dosage form is required"),
    body("manufacturer").notEmpty().withMessage("Manufacturer is required")
  ],
  addMedicine
);

router.get("/all", getMedicines);

module.exports = router;