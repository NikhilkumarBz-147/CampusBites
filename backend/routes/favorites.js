const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Add favorite
router.post("/add", (req, res) => {
    const { user_id, shop_id } = req.body;

    const query = `
        INSERT IGNORE INTO favorites (user_id, shop_id)
        VALUES (?, ?)
    `;

    db.query(query, [user_id, shop_id], (err) => {
        if (err) return res.status(500).send("Error");
        res.send("Added to favorites");
    });
});

// Remove favorite
router.post("/remove", (req, res) => {
    const { user_id, shop_id } = req.body;

    const query = `
        DELETE FROM favorites
        WHERE user_id = ? AND shop_id = ?
    `;

    db.query(query, [user_id, shop_id], (err) => {
        if (err) return res.status(500).send("Error");
        res.send("Removed from favorites");
    });
});

// Get user favorites
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    const query = `
        SELECT shop_id FROM favorites
        WHERE user_id = ?
    `;

    db.query(query, [user_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

module.exports = router;
