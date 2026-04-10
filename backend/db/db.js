const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hey!nickhelsten@23", // put your password here if any
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