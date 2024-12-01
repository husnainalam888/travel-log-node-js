const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const {
  startJourney,
  endJourney,
  getLocation,
  allJourneys,
} = require("../controllers/JourneyController");
const {
  validateEndJourney,
  validateStartJourney,
} = require("../middlewares/validateInput");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/start",
  authenticate,
  upload.none(),
  validateStartJourney,
  startJourney
);
router.post(
  "/end",
  authenticate,
  upload.none(),
  validateEndJourney,
  endJourney
);
router.post("/location", authenticate, upload.none(), getLocation);
router.post("/all", authenticate, upload.none(), allJourneys);

module.exports = router;
