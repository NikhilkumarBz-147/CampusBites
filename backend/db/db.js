const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "ENTER_YOUR_USERNAME",
    password: "ENTER_YOUR_PASSWORD", // put your password here if any
    database: "campusbites"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("MySQL Connected ✅");
    }
});

module.exports = db;
