const express = require("express");
const router = express.Router();
const controller = require("../controllers/menuController");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

router.get("/", controller.getWeeklyMenu);
router.put("/", auth, checkRole(["admin", "staff"]), controller.updateMenu);

module.exports = router;
