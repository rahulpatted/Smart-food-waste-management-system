const express = require("express");
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, controller.getProfile);
router.put("/profile", authMiddleware, controller.updateProfile);
router.get("/stats", authMiddleware, controller.getUserStats);

// Role-based partner listing
router.get(
  "/all-partners",
  authMiddleware,
  checkRole(["admin", "staff", "ngo"]),
  controller.getAllUsers
);
router.put("/admin/status/:id", authMiddleware, checkRole(["admin"]), controller.updateUserStatus);
router.delete("/admin/:id", authMiddleware, checkRole(["admin"]), controller.deleteUser);

module.exports = router;
