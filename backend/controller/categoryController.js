const Category = require('../models/Category');

// Yeni kategori oluşturma işlemi
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const query = await Category.createCategory(name);
        return res.status(201).json(query);
    } catch (error) {
        console.error('Kategori oluşturulurken hata oluştu: ', error);
        return res.status(500).json({ message: 'Kategori oluşturulurken hata oluştu', error });
    }
};

// Belirli bir kategori ID'sine göre kategori getirme işlemi
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Category.getCategoryById(id);
        if (!result.rows.length) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Kategori getirilirken hata oluştu: ', error);
        return res.status(500).json({ message: 'Kategori getirilirken hata oluştu', error });
    }
};

// Tüm kategorileri getirme işlemi
exports.getAllCategories = async (req, res) => {
    try {
        const result = await Category.getAllCategories();
        return res.json(result);
    } catch (error) {
        console.error('Kategoriler getirilirken hata oluştu: ', error);
        return res.status(500).json({ message: 'Kategoriler alınırken hata oluştu', error });
    }
};

// Kategori silme işlemi
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.deleteCategory(id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Kategori bulunamadı' });
        }

        return res.json(deletedCategory);
    } catch (error) {
        console.error('Kategori silinirken hata oluştu: ', error);
        return res.status(500).json({ message: 'Kategoriler silinirken hata oluştu', error });
    }
};