const pool = require('../config/connection');

class Category {
    // Yeni kategori oluşturma
    static async createCategory(name) {
        try {
            const query = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
            return query.rows[0];
        } catch (error) {
            console.error('Kategori oluşturulurken hata oluştu: ', error);
            throw error;
        }
    }

    // Belirli bir kategori ID'sine göre kategori getirme
    static async getCategoryById(categoryId) {
        try {
            const result = await pool.query('SELECT id, name FROM categories WHERE id = $1', [categoryId]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Kategori getirilirken hata oluştu: ', error);
            throw error;
        }
    }

    // Tüm kategorileri getirme
    static async getAllCategories() {
        try {
            const result = await pool.query('SELECT id, name FROM categories ORDER BY name ASC');
            return result.rows;
        } catch (error) {
            console.error('Kategoriler getirilirken hata oluştu: ', error);
            throw error;
        }
    }

    // Kategori silme
    static async deleteCategory(categoryId) {
        try {
            const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [categoryId]);

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

module.exports = Category;