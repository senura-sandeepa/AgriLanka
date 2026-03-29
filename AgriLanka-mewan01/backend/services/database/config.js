import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "Mewan",
    password: "Warcraft3ft@",
    database: "agrilanka_db",
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;
