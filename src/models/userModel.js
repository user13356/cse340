import pool from '../db.js';
import bcrypt from 'bcrypt';

// CREATE USER (SAVE TO RENDER DB)
export const createUser = async (name, email, password, role = 'user') => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, email, hashedPassword, role]
    );

    return result.rows[0];
};

// FIND USER
export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    return result.rows[0];
};

// GET USERS
export const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT name, email, role FROM users`
    );

    return result.rows;
};

// UPDATE ROLE
export const updateUserRole = async (email, role) => {
    const result = await pool.query(
        `UPDATE users SET role = $1 WHERE email = $2 RETURNING *`,
        [role, email]
    );

    return result.rows[0];
};