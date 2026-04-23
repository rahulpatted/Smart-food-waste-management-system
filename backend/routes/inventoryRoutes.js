const router = require("express").Router();
const controller = require("../controllers/inventoryController");

router.post("/add", controller.addItem);
router.get("/", controller.getItems);
router.put("/:id/stock", controller.updateStock);

module.exports = router;
