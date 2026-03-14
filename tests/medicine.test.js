// tests/medicine.test.js
const request = require("supertest");
const app = require("./app");

describe("💊 Medicine Routes", () => {

  const validMedicine = {
    name: "Paracetamol",
    composition: "Acetaminophen 500mg",
    dosageForm: "Tablet",
    manufacturer: "ABC Pharma"
  };

  // ─── ADD MEDICINE ────────────────────────────────────────
  describe("POST /api/medicines/add", () => {

    it("should add a medicine successfully", async () => {
      const res = await request(app)
        .post("/api/medicines/add")
        .send(validMedicine);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Medicine added successfully");
      expect(res.body.medicine.name).toBe("Paracetamol");
    });

    it("should fail if name is missing", async () => {
      const res = await request(app)
        .post("/api/medicines/add")
        .send({ ...validMedicine, name: "" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Medicine name is required");
    });

    it("should fail if composition is missing", async () => {
      const res = await request(app)
        .post("/api/medicines/add")
        .send({ ...validMedicine, composition: "" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Composition is required");
    });

    it("should fail if dosageForm is missing", async () => {
      const res = await request(app)
        .post("/api/medicines/add")
        .send({ ...validMedicine, dosageForm: "" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Dosage form is required");
    });

    it("should fail if manufacturer is missing", async () => {
      const res = await request(app)
        .post("/api/medicines/add")
        .send({ ...validMedicine, manufacturer: "" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Manufacturer is required");
    });

  });

  // ─── GET ALL MEDICINES ───────────────────────────────────
  describe("GET /api/medicines/all", () => {

    it("should return empty array when no medicines", async () => {
      const res = await request(app).get("/api/medicines/all");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it("should return all added medicines", async () => {
      // Add 2 medicines
      await request(app).post("/api/medicines/add").send(validMedicine);
      await request(app).post("/api/medicines/add").send({
        name: "Ibuprofen",
        composition: "Ibuprofen 400mg",
        dosageForm: "Tablet",
        manufacturer: "XYZ Pharma"
      });

      const res = await request(app).get("/api/medicines/all");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });

  });

});