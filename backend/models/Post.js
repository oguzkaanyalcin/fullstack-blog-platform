const pool = require('../config/connection');

class Post {
    // Yeni post oluşturma
    static async createPost(userId, categoryId, title, content, post_image) {
        try {
            const result = await pool.query('INSERT INTO posts (user_id, category_id, title, content, post_image) VALUES ($1, $2, $3, $4, $5) RETURNING *', [userId, categoryId, title, content, post_image]);
            return result.rows[0];
        } catch (error) {
            console.error('Post oluşturulurken hata meydana geldi: ', error);
            throw error;
        }
    }

    // Belirli bir post ID'sine göre post getirme
    static async getPostById(postId) {
        try {
            const result = await pool.query(`SELECT p.id, p.user_id, p.title, p.content, p.post_image, p.created_at, p.category_id, u.id AS user_id, u.username, c.id AS category_id, c.name AS category_name FROM posts p INNER JOIN users u ON p.user_id = u.id INNER JOIN categories c ON p.category_id = c.id WHERE p.id = $1`, [postId]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Post getirilirken hata meydana geldi: ', error);
            throw error;
        }
    }

    // Tüm postları getirme
    static async getAllPosts() {
        try {
            const result = await pool.query(`SELECT p.id, p.user_id, p.title, p.content, p.post_image, p.created_at, p.category_id, u.id AS user_id, u.username, c.id AS category_id, c.name AS category_name FROM posts p INNER JOIN users u ON p.user_id = u.id INNER JOIN categories c ON p.category_id = c.id`);
            return result.rows;
        } catch (error) {
            console.error('Postlar getirilirken bir hata oluştu:', error);
            throw new Error('Postlar getirilirken bir hata oluştu');
        }
    }

    // Post güncelleme
    static async updatePost(user_id, categoryId, title, content, post_image, postId) {
        try {
            const result = await pool.query('UPDATE posts SET user_id = $1, category_id = $2, title = $3, content = $4, post_image = $5 WHERE id = $6 RETURNING *', [user_id, categoryId, title, content, post_image, postId]);

            if (result.rowCount === 0) {
                return null;
            }

            return result.rows[0];
        } catch (error) {
            console.error('Hata ayrıntıları: ', error.stack);
            console.error('Post güncellenirken hata meydana geldi: ', error);
            throw error;
        }
    }

    // Post silme
    static async deletePost(postId) {
        try {
            const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [postId]);

            if (result.rowCount === 0) {
                return null;
            }

            return result.rows[0];
        } catch (error) {
            console.error('Post silinirken bir hata oluştu:', error);
            throw error;
        }
    }
}

module.exports = Post;