import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 35000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const imageUrl = 'http://localhost:5000/uploads/';

// İstek interceptor'ı
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.error('Token bulunamadı');
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Yanıt interceptor'ı
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Tüm postları getirme
export const getPosts = async () => {
    try {
        const response = await api.get('/postsAll');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Belirli bir post ID'sine göre post getirme
export const getPostsById = async (id) => {
    try {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Yeni post oluşturma
export const createPost = async (formData) => {
    try {
        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Post oluşturulurken hata oluştu.');
    }
};

// Post güncelleme
export const updatePost = async (formData, id) => {
    try {
        const response = await api.put(`/posts/${id}`, formData);
        return response.data;
    } catch (error) {
        throw new Error('Post oluşturulurken hata oluştu.');
    }
};

// Post silme
export const deletePost = async (id) => {
    try {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Belirli bir post ID'sine göre yorumları getirme
export const getCommentsByPostId = async (id) => {
    try {
        const response = await api.get(`/comments/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Yeni yorum oluşturma
export const createComment = async ({ userId, postId, comment_text }) => {
    try {
        const response = await api.post('/comments', {
            userId,
            postId,
            comment_text
        });
        return response.data;
    } catch (error) {
        throw new Error('Yorum oluşturulurken hata oluştu.');
    }
};

// Tüm kategorileri getirme
export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Kullanıcı kayıt işlemi
export const postRegister = async (username, email, password) => {
    try {
        const response = await api.post('/register', {
            username,
            email,
            password
        });
        
        return {
            status: response.status,
            message: response.data.message,
            token: response.data.token
        };

    } catch (error) {
        throw error;
    }
};

// Kullanıcı giriş işlemi
export const postLogin = async (email, password) => {
    try {
        const response = await api.post('/login', {
            email,
            password
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
       
        return {
            status: response.status,
            message: response.data.message,
            token: response.data.token
        };
    } catch (error) {
        throw error;
    } 
};

// Token doğrulama
export const validateToken = async (token) => {
    try {
        const response = await api.post('/validate-token', 
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return {
            rValid: response.data.valid,
            rUser: response.data.user
        };
    } catch (error) {
        throw error;
    }
}

// Kategori oluşturma
export const createCategory = async (categoryName) => {
    try {
        const response = await api.post('/categories', { name: categoryName });
        return response.data;  // başarılı ise dönen veriyi döndür
    } catch (error) {
        console.error('createCategory Hatası:', error);  // Daha fazla detay al
        throw new Error('Kategori oluşturulurken hata oluştu');
    }
};


// Kategori silme
export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Kategori silinirken bir hata oluştu');
    }
};

export default api;