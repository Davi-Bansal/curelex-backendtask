const request = require("supertest");
const app = require("./app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper: create a patient with token
const createPatient = async () => {
  const hashedPassword = await bcrypt.hash("pass123", 10);

  const user = await User.create({
    name: "Patient John",
    email: `patient${Date.now()}@test.com`, // ✅ unique email
    password: hashedPassword,
    role: "patient"
  });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );

  return { user, token };
};

// Helper: approved doctor
const createApprovedDoctor = async () => {
  return await Doctor.create({
    name: "Dr. Sarah Khan",
    email: `doc${Date.now()}@hospital.com`,
    specialization: "Cardiology",
    experience: 10,
    verificationStatus: "approved"
  });
};

// Helper: pending doctor
const createPendingDoctor = async () => {
  return await Doctor.create({
    name: "Dr. Ahmed Ali",
    email: `doc${Date.now()}@hospital.com`,
    specialization: "Neurology",
    experience: 5,
    verificationStatus: "pending"
  });
};

describe("📅 Appointment Routes", () => {

  describe("POST /api/appointments/book", () => {

    it("should book appointment successfully", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          symptoms: "Fever",
          appointmentTime: "2026-04-01T10:00:00.000Z" // ✅ FIXED
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Appointment booked successfully");
      expect(res.body.appointment.status).toBe("scheduled"); // ✅ FIXED
    });

    it("should fail if token missing", async () => {
      const res = await request(app)
        .post("/api/appointments/book")
        .send({
          patientId: 1,
          doctorId: 1,
          appointmentTime: "2026-04-01T10:00:00.000Z"
        });

      expect(res.statusCode).toBe(401);
    });

    it("should fail if doctor not verified", async () => {
      const { user, token } = await createPatient();
      const doctor = await createPendingDoctor();

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          appointmentTime: "2026-04-01T10:00:00.000Z"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Doctor is not verified yet");
    });

    it("should fail if slot already booked", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      const payload = {
        patientId: user.id,
        doctorId: doctor.id,
        appointmentTime: "2026-04-01T10:00:00.000Z"
      };

      // First booking
      await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      // Second booking
      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("This time slot is already booked");
    });

    it("should fail if required fields missing", async () => {
      const { token } = await createPatient();

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({ patientId: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

  });

  describe("GET /api/appointments/patient/:id", () => {

    it("should return patient appointments", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          appointmentTime: "2026-04-01T10:00:00.000Z"
        });

      const res = await request(app)
        .get(`/api/appointments/patient/${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });

  });

  describe("GET /api/appointments/doctor/:id", () => {

    it("should return doctor appointments", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          appointmentTime: "2026-04-01T11:00:00.000Z"
        });

      const res = await request(app)
        .get(`/api/appointments/doctor/${doctor.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
    });

  });

});