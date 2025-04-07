import React, { useEffect, useState } from 'react';
import { getPosts, createPost, updatePost, deletePost, getCategories, createCategory, deleteCategory, imageUrl } from '../../Api/api';
import { useAuth } from '../../contexts/AuthContext';

function AdminPage() {
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [posts, setPosts] = useState([]);
    const [editPostId, setEditPostId] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const { user } = useAuth();
    const userId = user ? user.id : null;

    // Tüm postları çekme
    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Postlar çekilirken hata oluştu:', error);
        }
    };

    // Tüm kategorileri çekme
    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Kategoriler çekilirken hata oluştu:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    // Resim dosyası değiştiğinde çağrılır
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size < 10 * 1024 * 1024) {
            setImage(file);
        } else {
            alert("Resim boyutu 10MB'dan küçük olmalıdır.");
        }
    };

    // Yeni post oluşturma
    const handleCreatePost = async () => {
        if (title && content && category && image) {
            try {
                const formData = new FormData();
                formData.append('userId', userId);
                formData.append('categoryId', category);
                formData.append('title', title);
                formData.append('content', content);
                formData.append('post_image', image);

                await createPost(formData);
                fetchPosts();
                setCategory('');
                setTitle('');
                setContent('');
                setImage('');
            } catch (error) {
                alert(`Post oluşturulurken hata oluştu: ${error.message}`);
                console.error('Post oluşturulurken hata oluştu:', error);
            }
        } else {
            alert("Title, Content, Category ve Image alanları boş olamaz.");
        }
    };

    // Post güncelleme
    const handleUpdatePost = async (id) => {
        if (title && content && category && userId) {
            try {
                const formData = new FormData();
                formData.append('user_id', userId);
                formData.append('categoryId', category);
                formData.append('title', title);
                formData.append('content', content);
                formData.append('postImage', image || posts.find(post => post.id === id)?.post_image);

                const updatedPost = await updatePost(formData, id);

                if (!updatedPost) {
                    alert("Post güncellenirken bir hata oluştu.");
                } else {
                    fetchPosts();
                    setCategory('');
                    setTitle('');
                    setContent('');
                    setImage('');
                    setEditPostId(null);
                }
            } catch (error) {
                alert(`Post güncellenirken hata oluştu: ${error.message}`);
                console.error('Post güncellenirken hata oluştu:', error);
            }
        } else {
            alert("Title, Content, Category alanları boş olamaz.");
        }
    };

    // Post silme
    const handleDeletePost = async (id) => {
        try {
            await deletePost(id);
            fetchPosts();
        } catch (error) {
            console.error('Post silinirken hata oluştu:', error);
        }
    };

    // Post düzenleme
    const handleEditPost = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category_id);
        setImage(post.post_image);
        setEditPostId(post.id);
    };

    const handleCreateCategory = async () => {
        if (newCategory.trim()) {
            try {
                await createCategory(newCategory);
    
                setCategories(prevCategories => [...prevCategories, { id: newCategory.id, name: newCategory }]);
    
                setNewCategory('');
            } catch (error) {
                console.error('Kategori oluşturulurken hata oluştu:', error);
            }
        }
    };
    
    // Kategori silme
    const handleDeleteCategory = async (id) => {
        console.log("id: " + id)
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (error) {
            console.error('Kategori silinirken hata oluştu:', error);
        }
    };   

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Admin Paneli</h1>

            <div className="card shadow-lg mb-4">
                <div className="card-body">
                    <h2 className="card-title mb-4">{editPostId ? 'Post Düzenle' : 'Yeni Post Oluştur'}</h2>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Başlık</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            placeholder="Başlık"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Kategori</label>
                        <select
                            id="category"
                            className="form-select"
                            value={category}
                            onChange={(e) => {
                                const selectedCategory = parseInt(e.target.value);
                                setCategory(selectedCategory);
                            }}
                        >
                            <option value="">Kategori Seçin</option>
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Henüz kategori eklenmemiş</option>
                            )}
                        </select>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">İçerik</label>
                        <textarea
                            id="content"
                            className="form-control"
                            placeholder="İçerik"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Resim Yükle</label>
                        <input
                            type="file"
                            id="image"
                            className="form-control"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100"
                        onClick={editPostId ? () => handleUpdatePost(editPostId) : handleCreatePost}
                    >
                        {editPostId ? 'Postu Güncelle' : 'Post Oluştur'}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#categoriesModal">
                    Kategoriler
                </button>
            </div>

            <div className="modal fade" id="categoriesModal" tabIndex="-1" aria-labelledby="categoriesModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="categoriesModalLabel">Kategoriler</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="newCategory" className="form-label">Yeni Kategori</label>
                                <input
                                    type="text"
                                    id="newCategory"
                                    className="form-control"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder='Kategori Adı'
                                />
                                <button className="btn btn-primary mt-2" onClick={handleCreateCategory}>Kategori Ekle</button>
                            </div>
                            <ul className="list-group">
                                {categories && categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {cat.name}
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(cat.id)}>Sil</button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item">Henüz kategori eklenmemiş.</li>
                                )}
                            </ul>

                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="mb-4">Tüm Postlar</h2>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {posts.map((post) => (
                        <div key={post.id} className="col">
                            <div className="card h-100 shadow-sm border-0">
                                <img
                                    src={imageUrl + post.post_image || "https://via.placeholder.com/150"}
                                    className="card-img-top"
                                    alt={post.title}
                                    style={{ objectFit: 'cover', height: '200px' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className={`card-text text-muted ${post.content.length <= 100 ? "mb-5" : "mb-4"}`}>
                                        {post.content.length <= 100 ? post.content : post.content.substring(0, 100) + "..."}
                                    </p>
                                    <p className="card-text"><strong>Kategori:</strong> {post.category_name || "Bilinmiyor"}</p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-warning" onClick={() => handleEditPost(post)}>Düzenle</button>
                                        <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Sil</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;