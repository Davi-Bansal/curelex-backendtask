const request = require("supertest");
const app = require("./app");

describe("👤 User Routes", () => {

  // ─── REGISTER ─────────────────────────────
  describe("POST /api/users/register", () => {

    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "John Doe",
          email: "john1@example.com",
          password: "123456",
          age: 22,
          gender: "male",
          mobile: "9876543210"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user.email).toBe("john1@example.com");
      expect(res.body.user.role).toBe("patient");
    });

    it("should fail if name is missing", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          email: "john2@example.com",
          password: "123456"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Name is required");
    });

    it("should fail if email is invalid", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "John",
          email: "invalid-email",
          password: "123456"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Enter a valid email");
    });

    it("should fail if password is too short", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          name: "John",
          email: "john3@example.com",
          password: "123"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toBe("Password must be at least 6 characters");
    });

    it("should fail if email already exists", async () => {
      await request(app).post("/api/users/register").send({
        name: "John",
        email: "john4@example.com",
        password: "123456"
      });

      const res = await request(app).post("/api/users/register").send({
        name: "John",
        email: "john4@example.com",
        password: "123456"
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });

  });

  // ─── LOGIN ────────────────────────────────
  describe("POST /api/users/login", () => {

    beforeEach(async () => {
      await request(app)
        .post("/api/users/register")
        .send({
          name: "Login User",
          email: "login@example.com",
          password: "123456"
        });
    });

    it("should login successfully", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "login@example.com",
          password: "123456"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toBeDefined();
    });

    it("should fail if user not found", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "notfound@example.com",
          password: "123456"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User not found");
    });

    it("should fail if password is wrong", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "login@example.com",
          password: "wrongpass"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid password");
    });

  });

});