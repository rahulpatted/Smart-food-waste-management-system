const request = require("supertest");
const app = require("../server");

describe("Comprehensive API Tests", () => {
  let authToken;
  let testItemId;

  beforeAll(async () => {
    // 1. Register/Login to get a token for protected routes
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "rahulpatted02@gmail.com",
      password: "R@hul5655",
    });
    authToken = loginRes.body.token;
  });

  describe("Inventory API", () => {
    test("POST /api/inventory/add - should add a new item", async () => {
      const res = await request(app).post("/api/inventory/add").send({
        item: "Test Apples",
        quantity: 50,
        expiryDate: "2026-12-31",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.item).toBe("Test Apples");
      testItemId = res.body._id;
    });

    test("GET /api/inventory - should fetch all items", async () => {
      const res = await request(app).get("/api/inventory");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    test("PUT /api/inventory/:id/stock - should update stock", async () => {
      const res = await request(app).put(`/api/inventory/${testItemId}/stock`).send({
        quantity: 100,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.quantity).toBe(100);
    });
  });

  describe("Meal API (Protected)", () => {
    test("GET /api/meals/summary - should return daily summary (Authenticated)", async () => {
      const res = await request(app)
        .get("/api/meals/summary")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("Breakfast");
    });

    test("GET /api/meals/summary - should fail without token", async () => {
      const res = await request(app).get("/api/meals/summary");
      expect(res.statusCode).toEqual(401);
    });
  });
});
