// services/locationService.js
import express from "express";
import mysql from "mysql2/promise"; // Using mysql2 with promises
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// MySQL pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// GET all locations
router.get("/locations", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, province, district, city, area FROM locations ORDER BY province, district, city, area"
        );
        res.json(rows);
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ error: "Failed to fetch locations" });
    }
});



export default router;
