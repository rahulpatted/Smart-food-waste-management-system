const request = require("supertest");
const app = require("../server");

describe("Auth Endpoints", () => {
  let testUser = {
    name: "Jest Test User",
    email: `jest_${Date.now()}@gmail.com`,
    password: "password123",
    role: "student",
  };

  test("POST /api/auth/register - should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
  });

  test("POST /api/auth/login - should login the registered user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
