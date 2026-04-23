const router = require("express").Router();
const controller = require("../controllers/wasteController");

router.post("/add", controller.addWaste);
router.get("/", controller.getWasteLogs);
router.get("/stats", controller.getWasteStats);

module.exports = router;
