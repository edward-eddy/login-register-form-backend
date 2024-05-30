
const express = require("express");
const router = express.Router();

const { updateUserDetails, getUserById } = require("../controllers/user-data");
const { validateProfile, isTokenValid } = require("../validators/authValidator");

router.post("/updateUserDetails", isTokenValid, validateProfile, updateUserDetails);
router.get("/getUserById", isTokenValid, getUserById)

module.exports = router;
