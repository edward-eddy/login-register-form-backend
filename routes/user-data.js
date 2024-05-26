
const express = require("express");
const router = express.Router();

const { updateUserDetails } = require("../controllers/user-data");
const { validateProfile, isTokenValid } = require("../validators/authValidator");

router.post("/updateUserDetails", isTokenValid, validateProfile, updateUserDetails);

module.exports = router;
