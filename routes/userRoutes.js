const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const userController = require("../controllers/userController");

// ================= REGISTER =================
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("age").optional().isInt({ min: 1 }).withMessage("Age must be valid"),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("mobile")
      .optional()
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile must be 10 digits"),
  ],
  userController.registerUser
);

// ================= LOGIN =================
router.post("/login", userController.loginUser);

module.exports = router;