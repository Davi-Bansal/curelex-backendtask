// tests/doctor.test.js
const request = require("supertest");
const app = require("./app");

describe("🩺 Doctor Routes", () => {

  // ─── REGISTER DOCTOR ─────────────────────────────────────
  describe("POST /api/doctors/register", () => {

    it("should register a doctor successfully", async () => {
      const res = await request(app)
        .post("/api/doctors/register")
        .field("name", "Dr. Sarah Khan")
        .field("email", "sarah@hospital.com")
        .field("specialization", "Cardiology")
        .field("experience", "10");

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Doctor registered successfully");
      expect(res.body.doctor.verificationStatus).toBe("pending");
      expect(res.body.doctor.email).toBe("sarah@hospital.com");
    });

    it("should fail if name is missing", async () => {
      const res = await request(app)
        .post("/api/doctors/register")
        .field("email", "sarah@hospital.com")
        .field("specialization", "Cardiology")
        .field("experience", "10");

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Doctor name is required");
    });

    it("should fail if email is invalid", async () => {
      const res = await request(app)
        .post("/api/doctors/register")
        .field("name", "Dr. Sarah")
        .field("email", "not-valid")
        .field("specialization", "Cardiology")
        .field("experience", "10");

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Valid email is required");
    });

    it("should fail if experience is not a number", async () => {
      const res = await request(app)
        .post("/api/doctors/register")
        .field("name", "Dr. Sarah")
        .field("email", "sarah@hospital.com")
        .field("specialization", "Cardiology")
        .field("experience", "ten years");

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Experience must be a number");
    });

    it("should fail if doctor email already exists", async () => {
      // Register once
      await request(app)
        .post("/api/doctors/register")
        .field("name", "Dr. Sarah Khan")
        .field("email", "sarah@hospital.com")
        .field("specialization", "Cardiology")
        .field("experience", "10");

      // Register again with same email
      const res = await request(app)
        .post("/api/doctors/register")
        .field("name", "Dr. Sarah Again")
        .field("email", "sarah@hospital.com")
        .field("specialization", "Neurology")
        .field("experience", "5");

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Doctor with this email already exists");
    });

  });

  // ─── GET APPROVED DOCTORS ────────────────────────────────
  describe("GET /api/doctors/all", () => {

    it("should return empty array when no approved doctors", async () => {
      const res = await request(app).get("/api/doctors/all");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.doctors).toHaveLength(0);
    });

    it("should only return approved doctors", async () => {
      // Register a doctor (default status: pending)
      await request(app)
        .post("/api/doctors/register")
        .field("name", "Dr. Sarah Khan")
        .field("email", "sarah@hospital.com")
        .field("specialization", "Cardiology")
        .field("experience", "10");

      // Approved doctors list should still be empty
      const res = await request(app).get("/api/doctors/all");
      expect(res.body.doctors).toHaveLength(0);
    });

  });

});