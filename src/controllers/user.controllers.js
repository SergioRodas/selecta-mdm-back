import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { SECRET } from '../config.js';

export const generateToken = (user) => {
    const userForToken = {
        id: user.id,
        username: user.username,
        email: user.email,
    };
    return jwt.sign(userForToken, SECRET );
};

const mapRowToUser = (row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    
});


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Se requiere email y contraseña' });
    }

    try {
        const sql = `SELECT * FROM MDM_SELECTA_USERS WHERE email = ? AND password = ?`;
        const [rows] = await pool.query(sql, [email, password]);

        if (!rows.length) {
            return res.status(404).json({ message: 'Usuario no encontrado o credenciales incorrectas' });
        }

        const user = mapRowToUser(rows[0]);

        const token = generateToken(user);
        await registerLoginUser(user.id);

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const sql = `INSERT INTO MDM_SELECTA_USERS (username, email, password) VALUES (?, ?, ?)`;
        const [result] = await pool.query(sql, [username, email, password]);

        const newUserId = result.insertId;
        const [rows] = await pool.query(`SELECT * FROM MDM_SELECTA_USERS WHERE id = ?`, [newUserId]);

        if (!rows.length) {
            return res.status(500).json({ message: 'Error al crear el usuario' });
        }

        res.status(201).json(mapRowToUser(rows[0]));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        const fields = Object.keys(updatedFields).map((key) => `${key} = ?`);
        const values = Object.values(updatedFields);
        values.push(id);

        const sql = `UPDATE MDM_SELECTA_USERS SET ${fields.join(', ')} WHERE id = ?`;
        await pool.query(sql, values);

        const [rows] = await pool.query(`SELECT * FROM MDM_SELECTA_USERS WHERE id = ?`, [id]);

        if (!rows.length) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(mapRowToUser(rows[0]));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `DELETE FROM MDM_SELECTA_USERS WHERE id = ?`;
        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllUsers = async (req, res) => {
    const { username } = req.query;

    try {
        let sql = `SELECT id, email, username FROM MDM_SELECTA_USERS WHERE 1=1`;
        const values = [];

      

        if (username) {
            sql += ` AND username LIKE ?`;
            values.push(`%${username}%`);
        }

        const [rows] = await pool.query(sql, values);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const registerLoginUser = async (userId) => {
    const date = new Date();
    const sql = `INSERT INTO MDM_SELECTA_USERS_LOGIN (user_id, date) VALUES (?, ?)`;

    await pool.query(sql, [userId, date]);
};
