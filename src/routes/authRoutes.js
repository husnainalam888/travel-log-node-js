const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validateSignUp,
  validateSignIn,
} = require("../middlewares/validateInput");
const upload = require("../middlewares/upload");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/signup", upload.none(), validateSignUp, authController.signUp);
router.post("/login", upload.none(), validateSignIn, authController.signIn);

module.exports = router;
