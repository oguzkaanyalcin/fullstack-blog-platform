const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const rateLimit = require("express-rate-limit");
const authController = require('../controller/authController');
const postController = require('../controller/postController');
const commentController = require('../controller/commentController');
const { verifyToken, validateToken, verifyAdmin } = require('../middleware/AuthMiddleware');
const categoryController = require('../controller/categoryController');

// API isteklerini sınırlama
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 dakikada maksimum 100 istek
    max: 1000000,
    message: "Bu IP'den çok fazla istek gönderildi, lütfen bir saat sonra tekrar deneyin",
    standardHeaders: true, // `RateLimit-*` başlıklarını yanıta ekle
    legacyHeaders: false, // `X-RateLimit-*` başlıklarını yanıttan kaldır
});

// Dosya yükleme ayarları
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Maksimum dosya boyutu 10 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Hatalı dosya türü. Lütfen yalnızca resim yükleyin.'));
    }
});

router.use(apiLimiter);

// Kullanıcı kayıt ve giriş işlemleri
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
router.post('/validate-token', validateToken);

// Post işlemleri
router.get('/postsAll', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.put('/posts/:id', verifyToken, verifyAdmin, postController.updatePost);
router.post('/posts', verifyToken, verifyAdmin, upload.single('post_image'), postController.createPost);
router.delete('/posts/:id', verifyToken, verifyAdmin, postController.deletePost);

// Yorum işlemleri
router.get('/comments', commentController.getAllComments);
router.get('/comments/:id', commentController.getCommentById);
router.post('/comments', verifyToken, commentController.createComment);
router.put('/comments/:id', verifyToken, commentController.updateComment);

// Kategori işlemleri
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', categoryController.createCategory);
router.delete('/categories/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);

module.exports = router;