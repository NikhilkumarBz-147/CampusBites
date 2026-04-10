const express = require("express");
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).send("Missing fields");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO admins (username, password) VALUES (?, ?)",
            [username, hashedPassword],
            (err) => {
                if (err) return res.status(500).send("Error");
                res.send("Admin created");
            }
        );
    } catch (hashErr) {
        res.status(500).send("Error");
    }
});

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM admins WHERE username = ?",
        [username],
        async (err, result) => {
            if (err) {
                return res.status(500).send("Unable to login");
            }

            if (result.length === 0) {
                return res.status(400).send("User not found");
            }

            const admin = result[0];
            const match = await bcrypt.compare(password, admin.password);

            if (!match) {
                return res.status(400).send("Wrong password");
            }

            res.send("Login successful");
        }
    );
});

module.exports = router;
