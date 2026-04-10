const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { getRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

router.get("/", asyncHandler(getRecommendations));
router.get("/:user_id", asyncHandler(getRecommendations));

module.exports = router;
