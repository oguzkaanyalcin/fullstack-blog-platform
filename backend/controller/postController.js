const Posts = require('../models/Post');

// Yeni post oluşturma işlemi
exports.createPost = async (req, res) => {
    // Resim dosyasının yüklenip yüklenmediğini kontrol et
    if (!req.file) {
        return res.status(400).json({ error: 'Resim dosyası yüklenmedi.' });
    }

    const { userId, categoryId, title, content } = req.body;

    // Eksik veri kontrolü
    if (!userId || !categoryId || !title || !content) {
        return res.status(400).json({ error: 'Eksik veri girildiğinden dolayı post oluşturulamadı.' });
    }

    const postImage = req.file.filename;
    try {
        // Yeni post oluşturma
        const newPost = await Posts.createPost(userId, categoryId, title, content, postImage);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Post oluşturulamadı' });
    }
};

// Belirli bir post ID'sine göre post getirme işlemi
exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        // Postu veritabanından çekme
        const post = await Posts.getPostById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post bulunamadı' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Post getirilirken bir hata oluştu: ', error);
        res.status(500).json({ error: 'Sunucu hatası: Post getirilirken bir hata oluştu' });
    }
};

// Tüm postları getirme işlemi
exports.getAllPosts = async (req, res) => {
    try {
        // Tüm postları veritabanından çekme
        const getAllPost = await Posts.getAllPosts();
        
        if (!getAllPost || getAllPost.length === 0) {
            return res.status(404).json({ error: 'Postlar bulunamadı.' });
        }

        res.status(200).json(getAllPost);
    } catch (error) {
        console.error('Post getirilirken bir hata oluştu: ', error);
        res.status(500).json({ error: 'Sunucu hatası: Post getirilirken bir hata oluştu' });
    }
};

// Post güncelleme işlemi
exports.updatePost = async (req, res) => {
    const { id } = req.params; 
    const { user_id, categoryId, title, content, postImage } = req.body;

    try {
        // Eksik veya geçersiz parametre kontrolü
        if (!user_id || !categoryId || !title || !content) {
            return res.status(400).json({ error: 'Eksik veya geçersiz parametreler.' });
        }

        // Post güncelleme
        const updatePost = await Posts.updatePost(user_id, categoryId, title, content, postImage, id);
        if (!updatePost) {
            return res.status(404).json({ error: 'Post bulunamadı' });
        }

        res.status(200).json(updatePost);
    } catch (error) {
        console.error('Post güncellenirken bir hata oluştu: ', error);
        res.status(500).json({ error: 'Sunucu hatası: Post güncellenirken bir hata oluştu' });
    }
};

// Post silme işlemi
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        // Post silme
        const deletedPost = await Posts.deletePost(id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post bulunamadı' });
        }

        res.status(200).json({ message: 'Post başarıyla silindi' });
    } catch (error) {
        console.error('Post silinirken bir hata oluştu: ', error);
        res.status(500).json({ error: 'Sunucu hatası: Post silinirken bir hata oluştu' });
    }
};