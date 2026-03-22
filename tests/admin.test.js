const request = require("supertest");
const app = require("./app");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper: create admin token
const getAdminToken = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@curelex.com",
    password: hashedPassword,
    role: "admin"
  });

  return jwt.sign(
    { id: admin.id, role: admin.role }, // ✅ FIXED
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );
};

// Helper: create patient token
const getPatientToken = async () => {
  const hashedPassword = await bcrypt.hash("pass123", 10);

  const user = await User.create({
    name: "Patient User",
    email: "patient@test.com",
    password: hashedPassword,
    role: "patient"
  });

  return jwt.sign(
    { id: user.id, role: user.role }, // ✅ FIXED
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  );
};

// Helper: create pending doctor
const createPendingDoctor = async () => {
  return await Doctor.create({
    name: "Dr. Sarah Khan",
    email: "sarah@hospital.com",
    specialization: "Cardiology",
    experience: 10,
    verificationStatus: "pending"
  });
};

describe("🛡️ Admin Routes", () => {

  // GET PENDING DOCTORS
  describe("GET /api/admin/pending-doctors", () => {

    it("should return pending doctors for admin", async () => {
      const token = await getAdminToken();
      await createPendingDoctor();

      const res = await request(app)
        .get("/api/admin/pending-doctors")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].verificationStatus).toBe("pending");
    });

    it("should block access without token", async () => {
      const res = await request(app).get("/api/admin/pending-doctors");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("No token provided");
    });

    it("should block access for non-admin users", async () => {
      const token = await getPatientToken();

      const res = await request(app)
        .get("/api/admin/pending-doctors")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

  });

  // APPROVE DOCTOR
  describe("POST /api/admin/approve/:id", () => {

    it("should approve a pending doctor", async () => {
      const token = await getAdminToken();
      const doctor = await createPendingDoctor();

      const res = await request(app)
        .post(`/api/admin/approve/${doctor.id}`) // ✅ FIXED
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Doctor Approved");
      expect(res.body.doctor.verificationStatus).toBe("approved");
    });

    it("should return 404 for invalid doctor id", async () => {
      const token = await getAdminToken();

      const res = await request(app)
        .post("/api/admin/approve/99999") // ✅ FIXED
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

  });

  // REJECT DOCTOR
  describe("POST /api/admin/reject/:id", () => {

    it("should reject a pending doctor", async () => {
      const token = await getAdminToken();
      const doctor = await createPendingDoctor();

      const res = await request(app)
        .post(`/api/admin/reject/${doctor.id}`) // ✅ FIXED
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Doctor Rejected");
      expect(res.body.doctor.verificationStatus).toBe("rejected");
    });

    it("should return 404 for invalid doctor id", async () => {
      const token = await getAdminToken();

      const res = await request(app)
        .post("/api/admin/reject/99999") // ✅ FIXED
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

  });

});