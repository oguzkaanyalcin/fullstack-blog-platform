const Comment = require('../models/Comments');

// Yeni yorum oluşturma işlemi
exports.createComment = async (req, res) => {
    const { userId, postId, comment_text } = req.body;

    // Eksik veri kontrolü
    if (!userId || !postId || !comment_text) {
        return res.status(400).json({ error: 'Eksik veri girildiğinden dolayı yorum oluşturulamadı.' });
    }

    try {
        // Yeni yorum oluşturma
        const newComment = await Comment.createComment(userId, postId, comment_text);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Yorum oluşturulamadı.' });
    }
};

// Belirli bir yorum ID'sine göre yorum getirme işlemi
exports.getCommentById = async (req, res) => {
    const { id } = req.params;

    try {
        // Yorumları veritabanından çekme
        const getComment = await Comment.getCommentsById(id);

        // Yorum bulunamadıysa boş dizi döndürme
        if (!getComment || getComment.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(getComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Yorum getirilirken bir hata oluştu.' });
    }
};

// Tüm yorumları getirme işlemi
exports.getAllComments = async (req, res) => {
    try {
        // Tüm yorumları veritabanından çekme
        const comments = await Comment.getAllComments();

        // Yorum bulunamadıysa hata döndürme
        if (!comments || comments.length === 0) {
            return res.status(404).json({ error: 'Yorum bulunamadı' });
        }

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Yorumlar getirilemedi.' });
    }
};

// Yorum güncelleme işlemi
exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    // Eksik veri kontrolü
    if (!content) {
        return res.status(400).json({ error: 'Eksik veri girişi yapıldığı için yorum güncellenemedi.' });
    }

    try {
        // Yorum güncelleme
        const updateComment = await Comment.updateComment(id, content);

        // Yorum bulunamadıysa hata döndürme
        if (!updateComment) {
            return res.status(404).json({ error: 'Yorum bulunamadı.' });
        }

        res.status(200).json(updateComment);
    } catch (error) {
        res.status(500).json({ error: 'Yorum güncellenirken hata oluştu.' });
    }
};