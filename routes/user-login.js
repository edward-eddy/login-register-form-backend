
const express = require("express");
const router = express.Router();

const {register, login, sendOtp, verifyOtp} = require("../controllers/user-login");
const { validateRegister, validateLogin } = require("../validators/authValidator")

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

module.exports = router;
