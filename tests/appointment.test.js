// tests/appointment.test.js
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
    email: "patient@test.com",
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

// Helper: create an approved doctor
const createApprovedDoctor = async () => {
  return await Doctor.create({
    name: "Dr. Sarah Khan",
    email: "sarah@hospital.com",
    specialization: "Cardiology",
    experience: 10,
    verificationStatus: "approved"
  });
};

// Helper: create a pending doctor
const createPendingDoctor = async () => {
  return await Doctor.create({
    name: "Dr. Ahmed Ali",
    email: "ahmed@hospital.com",
    specialization: "Neurology",
    experience: 5,
    verificationStatus: "pending"
  });
};

describe("📅 Appointment Routes", () => {

  // ─── BOOK APPOINTMENT ────────────────────────────────────
  describe("POST /api/appointments/book", () => {

    it("should book an appointment successfully", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          date: "2026-04-01",
          time: "10:00 AM"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Appointment booked successfully");
      expect(res.body.appointment.status).toBe("pending");
    });

    it("should fail if token is missing", async () => {
      const res = await request(app)
        .post("/api/appointments/book")
        .send({
          patientId: "someId",
          doctorId: "someId",
          date: "2026-04-01",
          time: "10:00 AM"
        });

      expect(res.statusCode).toBe(401);
    });

    it("should fail if doctor is not verified", async () => {
      const { user, token } = await createPatient();
      const doctor = await createPendingDoctor();

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          date: "2026-04-01",
          time: "10:00 AM"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Doctor is not verified yet");
    });

    it("should fail if same time slot is already booked", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      // Book once
      await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          date: "2026-04-01",
          time: "10:00 AM"
        });

      // Book again same slot
      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          date: "2026-04-01",
          time: "10:00 AM"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("This time slot is already booked");
    });

    it("should fail if required fields are missing", async () => {
      const { token } = await createPatient();

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({ patientId: "someId" }); // missing doctorId, date, time

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

  });

  // ─── GET APPOINTMENTS BY PATIENT ─────────────────────────
  describe("GET /api/appointments/patient/:id", () => {

    it("should return appointments for a patient", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          date: "2026-04-01",
          time: "10:00 AM"
        });

      const res = await request(app)
        .get(`/api/appointments/patient/${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });

    it("should return empty list for patient with no appointments", async () => {
      const { user, token } = await createPatient();

      const res = await request(app)
        .get(`/api/appointments/patient/${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(0);
    });

  });

  // ─── GET APPOINTMENTS BY DOCTOR ──────────────────────────
  describe("GET /api/appointments/doctor/:id", () => {

    it("should return appointments for a doctor", async () => {
      const { user, token } = await createPatient();
      const doctor = await createApprovedDoctor();

      await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${token}`)
        .send({
          patientId: user.id,
          doctorId: doctor.id,
          date: "2026-04-01",
          time: "11:00 AM"
        });

      const res = await request(app)
        .get(`/api/appointments/doctor/${doctor.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });

  });

});