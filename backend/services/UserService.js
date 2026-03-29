
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

export const saveUser = async ({ uid, name, email, phone, location, userType }) => {
    const [result] = await pool.query(
        `INSERT INTO users (firebase_uid, name, email, phone_number, location, userType)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [uid, name, email, phone, location, userType]
    );
    return result;
};
