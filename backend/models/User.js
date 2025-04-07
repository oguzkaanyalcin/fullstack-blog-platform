const pool = require('../config/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
    // Yeni kullanıcı oluşturma
    static async createUser(username, email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *',
                [username, email, hashedPassword]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Kullanıcı oluşturulurken hata oluştu:', error);
            throw error;
        }
    }

    // Tüm kullanıcıları getirme
    static async getAllUsers() {
        try {
            const result = await pool.query('SELECT username, email, created_at FROM users');
            return result.rows;
        } catch (error) {
            console.error('Kullanıcılar getirilirken bir hata oluştu:', error);
            throw new Error('Kullanıcılar getirilirken bir hata oluştu');
        }
    }

    // Kullanıcı adını kullanarak kullanıcı getirme
    static async getUserByUsername(username) {
        try {
            const result = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
            return result.rows[0];
        } catch (error) {
            console.error('Kullanıcı getirilirken bir hata oluştu:', error);
            throw new Error('Kullanıcı getirilirken bir hata oluştu');
        }
    }

    // E-posta adresini kullanarak kullanıcı getirme
    static async getUserByEmail(email) {
        try {
            const result = await pool.query('SELECT id, email, password, role FROM users WHERE email = $1', [email]);
            return result.rows[0];
        } catch (error) {
            console.error('Kullanıcı getirilirken bir hata oluştu:', error);
            throw new Error('Kullanıcı getirilirken bir hata oluştu');
        }
    }

    // Token kontrolü
    static async tokenControl(req, res) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ valid: false, message: 'Token bulunamadı' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.json({ valid: true, user: decoded });
        } catch (error) {
            res.status(401).json({ valid: false, message: 'Geçersiz token' });
        }
    }

    // Kullanıcı ID'sine göre kullanıcı getirme
    static async getUserById(id) {
        try {
            const result = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Kullanıcı getirilirken bir hata oluştu:', error);
            throw new Error('Kullanıcı getirilirken bir hata oluştu');
        }
    }

    // Şifre karşılaştırma
    static async comparePassword(inputPassword, hashedPassword) {
        try {
            return await bcrypt.compare(inputPassword, hashedPassword);
        } catch (error) {
            console.error('Şifre karşılaştırılırken bir hata oluştu:', error);
            throw error;
        }
    }
}

module.exports = User;