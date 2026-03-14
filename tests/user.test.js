// tests/user.test.js
const request = require("supertest");
const app = require("./app");

describe("👤 User Routes", () => {

  // ─── REGISTER ───────────────────────────────────────────
  describe("POST /api/users/register", () => {

    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "123456"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user.email).toBe("john@example.com");
      expect(res.body.user.role).toBe("patient");
      // Password should never be returned as plain text
      expect(res.body.user.password).not.toBe("123456");
    });

    it("should fail if name is missing", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "john@example.com", password: "123456" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Name is required");
    });

    it("should fail if email is invalid", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ name: "John", email: "not-an-email", password: "123456" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Enter a valid email");
    });

    it("should fail if password is less than 6 characters", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ name: "John", email: "john@example.com", password: "123" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Password must be at least 6 characters");
    });

    it("should fail if email already exists", async () => {
      // Register first time
      await request(app)
        .post("/api/users/register")
        .send({ name: "John", email: "john@example.com", password: "123456" });

      // Try to register again with same email
      const res = await request(app)
        .post("/api/users/register")
        .send({ name: "John Again", email: "john@example.com", password: "123456" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });

  });

  // ─── LOGIN ───────────────────────────────────────────────
  describe("POST /api/users/login", () => {

    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post("/api/users/register")
        .send({ name: "John Doe", email: "john@example.com", password: "123456" });
    });

    it("should login successfully and return a token", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "john@example.com", password: "123456" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toBeDefined();
    });

    it("should fail if user is not found", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "nobody@example.com", password: "123456" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User not found");
    });

    it("should fail if password is wrong", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ email: "john@example.com", password: "wrongpassword" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid password");
    });

  });

});