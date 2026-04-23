const router = require("express").Router();
const controller = require("../controllers/donationController");
const auth = require("../middleware/authMiddleware");

router.post("/create", auth, controller.createDonation);
router.get("/", controller.getDonations);
router.put("/:id", auth, controller.updateDonationStatus);
router.delete("/:id", auth, controller.deleteDonation);

module.exports = router;
