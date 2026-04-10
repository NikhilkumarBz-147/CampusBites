const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { trackShopActivity } = require("../controllers/activityController");

const router = express.Router();

router.post("/track", asyncHandler(trackShopActivity));

module.exports = router;
