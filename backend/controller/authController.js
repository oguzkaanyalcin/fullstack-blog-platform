const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../middleware/AuthMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Kullanıcı kayıt işlemi
exports.postRegister = async (req, res) => {
    const { username, email, password } = req.body;

    // Tüm alanların doldurulup doldurulmadığını kontrol et
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun!' });
    }

    try {
        // Kullanıcı adının zaten var olup olmadığını kontrol et
        const userExists = await User.getUserByUsername(username);
        if (userExists) {
            return res.status(400).json({ message: 'Kullanıcı adı zaten var!' });
        }

        // E-posta adresinin zaten var olup olmadığını kontrol et
        const emailExists = await User.getUserByEmail(email);
        if (emailExists) {
            return res.status(400).json({ message: 'E-posta zaten var!' });
        }

        // Yeni kullanıcı oluştur
        const newUser = await User.createUser(username, email, password);
        // Kullanıcı için token oluştur
        const token = generateToken(newUser);

        // Başarılı kayıt yanıtı gönder
        res.status(201).json({ message: 'Kayıt başarılı!', token });
    } catch (error) {
        // Hata durumunda yanıt gönder
        res.status(500).json({ message: 'Kayıt başarısız! ' + error.message });
    }
};

// Kullanıcı giriş işlemi
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    // Tüm alanların doldurulup doldurulmadığını kontrol et
    if (!email || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun!' });
    }

    try {
        // Kullanıcının var olup olmadığını kontrol et
        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı!' });
        }

        // Şifrenin doğru olup olmadığını kontrol et
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Hatalı şifre!' });
        }

        // Kullanıcı için token oluştur
        const token = generateToken(user);

        // Başarılı giriş yanıtı gönder
        res.status(200).json({ message: 'Giriş başarılı!', token });
    } catch (error) {
        // Hata durumunda yanıt gönder
        res.status(500).json({ message: 'Giriş başarısız! ' + error.message });
    }
};