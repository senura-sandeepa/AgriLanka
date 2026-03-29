import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mouni2002@",
    database: "agrilanka_db",
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;
