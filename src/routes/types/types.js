const express = require("express");
const { getTypes } = require("./middleware/getTypes.js");

const router = express.Router();

router.get("/types", getTypes);

module.exports = router;