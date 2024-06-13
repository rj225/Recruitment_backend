import mysql from 'mysql2';
import { config } from 'dotenv';

config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // port:3306,
    connectionLimit: 10
});

const connectDB = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            throw err;
        }
        console.log("Database connected successfully");
    });
};

const query = async (sql, values) => {
    try {
        const [rows, fields] = await pool.promise().query(sql, values);
        return [rows, fields];
    } catch (error) {
        console.error('Error executing query:', error.message);
        throw error;
    }
};

export { connectDB, query};