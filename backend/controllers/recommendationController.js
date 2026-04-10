const { getShopRecommendations } = require("../services/recommendationService");

async function getRecommendations(req, res) {
    const userId = req.params.user_id || req.query.user_id;

    if (!userId) {
        return res.status(400).json({ error: "user_id is required" });
    }

    const recommendations = await getShopRecommendations(userId);

    return res.json({
        user_id: Number(userId),
        recommendations
    });
}

module.exports = {
    getRecommendations
};
