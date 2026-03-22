// tests/prescription.test.js
const request = require("supertest");
const app = require("./app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");

// Helper: create a patient
const createPatient = async () => {
  const hashedPassword = await bcrypt.hash("pass123", 10);
  return await User.create({
    name: "Patient John",
    email: "patient@test.com",
    password: hashedPassword,
    role: "patient"
  });
};

// Helper: create a doctor
const createDoctor = async () => {
  return await Doctor.create({
    name: "Dr. Sarah Khan",
    email: "sarah@hospital.com",
    specialization: "Cardiology",
    experience: 10,
    verificationStatus: "approved"
  });
};

describe("📋 Prescription Routes", () => {

  // ─── ADD PRESCRIPTION ────────────────────────────────────
  describe("POST /api/prescriptions/add", () => {

    it("should add a prescription successfully", async () => {
      const patient = await createPatient();
      const doctor = await createDoctor();

      const res = await request(app)
        .post("/api/prescriptions/add")
        .send({
          patientId: patient.id,
          doctorId: doctor.id,
          medicines: [
            { name: "Paracetamol", dosage: "500mg", duration: "5 days" }
          ],
          notes: "Take after meals"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Prescription added successfully");
      expect(res.body.prescription.medicines).toHaveLength(1);
      expect(res.body.prescription.notes).toBe("Take after meals");
    });

    it("should fail if patientId is missing", async () => {
      const doctor = await createDoctor();

      const res = await request(app)
        .post("/api/prescriptions/add")
        .send({
          doctorId: doctor.id,
          medicines: [{ name: "Paracetamol", dosage: "500mg", duration: "5 days" }]
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Patient ID is required");
    });

    it("should fail if doctorId is missing", async () => {
      const patient = await createPatient();

      const res = await request(app)
        .post("/api/prescriptions/add")
        .send({
          patientId: patient.id,
          medicines: [{ name: "Paracetamol", dosage: "500mg", duration: "5 days" }]
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Doctor ID is required");
    });

    it("should fail if medicines array is empty", async () => {
      const patient = await createPatient();
      const doctor = await createDoctor();

      const res = await request(app)
        .post("/api/prescriptions/add")
        .send({
          patientId: patient.id,
          doctorId: doctor.id,
          medicines: []
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Medicines array is required");
    });

    it("should fail if medicine name is missing inside array", async () => {
      const patient = await createPatient();
      const doctor = await createDoctor();

      const res = await request(app)
        .post("/api/prescriptions/add")
        .send({
          patientId: patient.id,
          doctorId: doctor.id,
          medicines: [{ name: "", dosage: "500mg", duration: "5 days" }]
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Medicine name required");
    });

    it("should add prescription with multiple medicines", async () => {
      const patient = await createPatient();
      const doctor = await createDoctor();

      const res = await request(app)
        .post("/api/prescriptions/add")
        .send({
          patientId: patient.id,
          doctorId: doctor.id,
          medicines: [
            { name: "Paracetamol", dosage: "500mg", duration: "5 days" },
            { name: "Ibuprofen", dosage: "400mg", duration: "3 days" }
          ]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.prescription.medicines).toHaveLength(2);
    });

  });

  // ─── GET PRESCRIPTIONS BY PATIENT ────────────────────────
  describe("GET /api/prescriptions/patient/:id", () => {

    it("should return prescriptions for a patient", async () => {
      const patient = await createPatient();
      const doctor = await createDoctor();

      await request(app)
        .post("/api/prescriptions/add")
        .send({
          patientId: patient.id,
          doctorId: doctor.id,
          medicines: [{ name: "Paracetamol", dosage: "500mg", duration: "5 days" }]
        });

      const res = await request(app)
        .get(`/api/prescriptions/patient/${patient.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });

    it("should return empty list for patient with no prescriptions", async () => {
      const patient = await createPatient();

      const res = await request(app)
        .get(`/api/prescriptions/patient/${patient.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(0);
    });

  });

  // ─── GET PRESCRIPTIONS BY DOCTOR ─────────────────────────
  describe("GET /api/prescriptions/doctor/:id", () => {

    it("should return prescriptions by a doctor", async () => {
      const patient = await createPatient();
      const doctor = await createDoctor();

      await request(app)
        .post("/api/prescriptions/add")
        .send({
          patientId: patient.id,
          doctorId: doctor.id,
          medicines: [{ name: "Paracetamol", dosage: "500mg", duration: "5 days" }]
        });

      const res = await request(app)
        .get(`/api/prescriptions/doctor/${doctor.id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });

  });

});