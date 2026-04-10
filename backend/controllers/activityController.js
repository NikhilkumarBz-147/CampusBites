const pool = require("../db/promiseDb");

async function trackShopActivity(req, res) {
    const { user_id: userId, shop_id: shopId } = req.body;
    const numericUserId = Number(userId);
    const numericShopId = Number(shopId);

    if (!Number.isInteger(numericUserId) || !Number.isInteger(numericShopId)) {
        return res.status(400).json({ error: "Valid user_id and shop_id are required" });
    }

    const [[shop]] = await pool.query(`
        SELECT id
        FROM shops
        WHERE id = ?
        LIMIT 1
    `, [numericShopId]);

    if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
    }

    await pool.query(`
        INSERT INTO user_activity (user_id, shop_id, clicks, last_visited)
        VALUES (?, ?, 1, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE
            clicks = clicks + 1,
            last_visited = CURRENT_TIMESTAMP
    `, [numericUserId, numericShopId]);

    const [[activity]] = await pool.query(`
        SELECT user_id, shop_id, clicks, last_visited
        FROM user_activity
        WHERE user_id = ? AND shop_id = ?
        LIMIT 1
    `, [numericUserId, numericShopId]);

    return res.json({
        message: "Activity tracked successfully",
        activity
    });
}

module.exports = {
    trackShopActivity
};
