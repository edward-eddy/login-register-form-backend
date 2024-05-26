
const express = require("express");
const router = express.Router();

const {register, login} = require("../controllers/user-login");
const { validateRegister, validateLogin } = require("../validators/authValidator")

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

module.exports = router;
