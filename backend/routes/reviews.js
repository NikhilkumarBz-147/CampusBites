const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Keep the schema aligned with the frontend timestamp feature.
function ensureReviewTimestampColumn() {
    const columnCheckQuery = `
        SELECT 1
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'reviews'
          AND COLUMN_NAME = 'created_at'
        LIMIT 1
    `;

    db.query(columnCheckQuery, (checkErr, result) => {
        if (checkErr || result.length > 0) {
            return;
        }

        const alterQuery = `
            ALTER TABLE reviews
            ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `;

        db.query(alterQuery, (alterErr) => {
            if (alterErr) {
                console.log("Unable to add reviews.created_at column:", alterErr.message);
            }
        });
    });
}

ensureReviewTimestampColumn();

function recalculateShopRating(shopId, callback) {
    const ratingQuery = `
        UPDATE shops
        SET rating = COALESCE(
            (
                SELECT ROUND(AVG(rating), 1)
                FROM reviews
                WHERE shop_id = ?
            ),
            0
        )
        WHERE id = ?
    `;

    db.query(ratingQuery, [shopId, shopId], callback);
}

// Add or update today's review for the same user/shop pair.
router.post("/add", (req, res) => {
    const { user_id, username, shop_id, review_text, rating } = req.body;
    const normalizedText = review_text ? review_text.trim() : "";
    const numericRating = Number(rating);

    if (!user_id || !username || !shop_id || !normalizedText || !numericRating) {
        return res.status(400).send("Missing fields");
    }

    const checkQuery = `
        SELECT id
        FROM reviews
        WHERE user_id = ? AND shop_id = ? AND DATE(created_at) = CURDATE()
        LIMIT 1
    `;

    db.query(checkQuery, [user_id, shop_id], (checkErr, result) => {
        if (checkErr) {
            return res.status(500).send("Server error");
        }

        if (result.length > 0) {
            const updateQuery = `
                UPDATE reviews
                SET review_text = ?, rating = ?
                WHERE id = ?
            `;

            db.query(updateQuery, [normalizedText, numericRating, result[0].id], (updateErr) => {
                if (updateErr) {
                    return res.status(500).send("Update failed");
                }

                recalculateShopRating(shop_id, (ratingErr) => {
                    if (ratingErr) {
                        return res.status(500).send("Rating update failed");
                    }

                    return res.send("Review updated");
                });
            });

            return;
        }

        const insertQuery = `
            INSERT INTO reviews
            (user_id, shop_id, username, review_text, rating, created_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        db.query(
            insertQuery,
            [user_id, shop_id, username, normalizedText, numericRating],
            (insertErr) => {
                if (insertErr) {
                    return res.status(500).send("Insert failed");
                }

                recalculateShopRating(shop_id, (ratingErr) => {
                    if (ratingErr) {
                        return res.status(500).send("Rating update failed");
                    }

                    return res.send("Review submitted");
                });
            }
        );
    });
});

router.delete("/delete/:id", (req, res) => {
    const reviewId = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).send("User is required");
    }

    const ownerQuery = `
        SELECT id, shop_id
        FROM reviews
        WHERE id = ? AND user_id = ?
        LIMIT 1
    `;

    db.query(ownerQuery, [reviewId, user_id], (ownerErr, result) => {
        if (ownerErr) {
            return res.status(500).send("Server error");
        }

        if (result.length === 0) {
            return res.status(403).send("You can delete only your own review");
        }

        const { shop_id } = result[0];

        db.query("DELETE FROM reviews WHERE id = ?", [reviewId], (deleteErr) => {
            if (deleteErr) {
                return res.status(500).send("Delete failed");
            }

            recalculateShopRating(shop_id, (ratingErr) => {
                if (ratingErr) {
                    return res.status(500).send("Rating update failed");
                }

                return res.send("Review deleted");
            });
        });
    });
});

router.get("/:shop_id", (req, res) => {
    const shop_id = req.params.shop_id;

    const query = `
        SELECT
            id,
            user_id,
            username,
            review_text,
            rating,
            created_at,
            DATE(created_at) AS review_date
        FROM reviews
        WHERE shop_id = ?
        ORDER BY created_at DESC, id DESC
    `;

    db.query(query, [shop_id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json(result);
    });
});

module.exports = router;
