const pool = require('../config/connection');

class Comment {
    // Yeni yorum oluşturma
    static async createComment(userId, postId, comment_text) {
        try {
            const query = await pool.query('INSERT INTO comments (user_id, post_id, comment_text) VALUES ($1, $2, $3) RETURNING *', [userId, postId, comment_text]);
            return query.rows[0];
        } catch (error) {
            console.error('Yorum oluşturulurken hata oluştu: ', error);
            throw error;
        }
    }

    // Belirli bir post ID'sine göre yorumları getirme
    static async getCommentsById(postId) {
        try {
            const result = await pool.query('SELECT c.id, c.user_id, c.post_id, c.comment_text, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1', [postId]);
            return result.rows;
        } catch (error) {
            console.error('Yorum getirilirken hata oluştu: ', error);
            throw error;
        }
    }

    // Tüm yorumları getirme
    static async getAllComments() {
        try {
            const result = await pool.query('SELECT id, user_id, post_id, comment_text, created_at FROM comments ORDER BY created_at DESC');
            return result.rows;
        } catch (error) {
            console.error('Yorumlar getirilirken hata oluştu: ', error);
            throw error;
        }
    }

    // Yorum güncelleme
    static async updateComment(commentId, comment_text) {
        try {
            const result = await pool.query('UPDATE comments SET comment_text = $1 WHERE id = $2 RETURNING *', [comment_text, commentId]);

            if (result.rowCount === 0) {
                return null;
            }

            return result.rows[0];
        } catch (error) {
            console.error('Yorum güncellenirken hata oluştu: ', error);
            throw error;
        }
    }
}

module.exports = Comment;