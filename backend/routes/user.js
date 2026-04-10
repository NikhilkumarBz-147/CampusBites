const express = require("express");
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcrypt");

// SIGNUP
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(400).send("User already exists");
                }
                res.send("Signup successful");
            }
        );
    } catch (err) {
        res.status(500).send("Error signing up");
    }
});

// LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).send("User not found");
            }

            const user = results[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).send("Wrong password");
            }

            res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    );
});

router.post("/change-password", (req, res) => {
    const { user_id, oldPassword, newPassword } = req.body;

    db.query(
        "SELECT * FROM users WHERE id = ?",
        [user_id],
        async (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).send("User not found");
            }

            const user = results[0];
            const match = await bcrypt.compare(oldPassword, user.password);

            if (!match) {
                return res.send("Incorrect old password");
            }

            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                db.query(
                    "UPDATE users SET password = ? WHERE id = ?",
                    [hashedPassword, user_id],
                    (updateErr) => {
                        if (updateErr) {
                            return res.send("Error updating password");
                        }

                        res.send("Password updated successfully");
                    }
                );
            } catch (hashErr) {
                res.status(500).send("Error updating password");
            }
        }
    );
});

module.exports = router;
