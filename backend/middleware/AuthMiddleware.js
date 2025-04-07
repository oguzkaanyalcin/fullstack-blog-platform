const jwt = require('jsonwebtoken');

// Kullanıcı için token oluşturma
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token geçerlilik süresi 1 saat
    );
};

// Token doğrulama
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Authorization header kontrolü
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Token bulunamadı!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Token doğrulama
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Kullanıcı bilgilerini req içine koy
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token geçersiz veya süresi dolmuş!" });
    }
};

// Token geçerliliğini kontrol etme
const validateToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    // Authorization header kontrolü
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, message: 'Token bulunamadı' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Token doğrulama
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Geçersiz token' });
    }
};

// Admin yetkisini doğrulama
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Yetkisiz erişim.' });
    }
};

module.exports = { generateToken, verifyToken, validateToken, verifyAdmin };