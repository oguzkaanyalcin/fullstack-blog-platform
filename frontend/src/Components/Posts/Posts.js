import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts, getCategories, imageUrl } from "../../Api/api";
import Footer from "../Footer/Footer";

const styles = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  postCard: {
    transition: 'all 0.3s ease-in-out',
    height: '100%',
  },
  postImage: {
    height: '200px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  categorySection: {
    position: 'sticky',
    top: '1rem',
    zIndex: 1020,
  },
  categoryButton: {
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },
};

function Posts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getPosts(),
          getCategories(),
        ]);
        setPosts(postsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageLoad = (postId) => {
    setImageLoaded((prev) => ({
      ...prev,
      [postId]: true,
    }));
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category_id === selectedCategory)
    : posts;

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <div style={styles.loadingSpinner}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>Bir hata oluştu: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <div className="container py-4">
        <div className="row g-4">
          {/* Kategori Bölümü */}
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div style={styles.categorySection}>
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white py-2">
                  <h5 className="card-title mb-0 fs-6">Kategoriler</h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    <button
                      style={styles.categoryButton}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 ${!selectedCategory ? 'active bg-dark' : ''}`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      <span>Tüm Yazılar</span>
                      <span className="badge bg-primary rounded-pill">{posts.length}</span>
                    </button>

                    {categories.map((category) => {
                      const postCount = posts.filter(
                        (post) => post.category_id === category.id
                      ).length;

                      return (
                        <button
                          key={category.id}
                          style={styles.categoryButton}
                          className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 ${selectedCategory === category.id ? 'active bg-dark' : ''}`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <span>{category.name}</span>
                          <span className="badge bg-primary rounded-pill">{postCount}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedCategory && (
                <div className="alert alert-info mt-3 py-2 d-flex align-items-center mb-0">
                  <small className="me-auto">
                    Filtrelenen: {categories.find((c) => c.id === selectedCategory)?.name}
                  </small>
                  <button
                    className="btn-close ms-2"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => setSelectedCategory(null)}
                    aria-label="Filtreyi kaldır"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Blog Post Kartları */}
          <div className="col-lg-9">
            {/* Öne Çıkan Post */}
            {featuredPost && (
              <div className="mb-4">
                <article className="card shadow-lg border-0">
                  <img
                    src={featuredPost.post_image ? imageUrl + featuredPost.post_image : "https://via.placeholder.com/600x300"}
                    className="card-img-top"
                    alt={featuredPost.title}
                    style={{ height: '300px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x300";
                    }}
                  />
                  <div className="card-body">
                    <h3 className="card-title">{featuredPost.title}</h3>
                    <p className="card-text text-muted">{featuredPost.content.substring(0, 200)}...</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">{formatDate(featuredPost.created_at)}</small>
                      <Link to={`/post/${featuredPost.id}`} className="btn btn-primary btn-sm">
                        Devamını Oku
                      </Link>
                    </div>
                    <div className="mt-2">
                      <span className="badge bg-secondary">{featuredPost.category_name || "Kategorisiz"}</span>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* Kalan Postlar */}
            <div className="row g-4">
              {remainingPosts.map((post) => (
                <div key={post.id} className="col-md-6">
                  <article className="card shadow-sm" style={styles.postCard}>
                    <div className="position-relative" style={{ overflow: 'hidden' }}>
                      {!imageLoaded[post.id] && (
                        <div className="placeholder-glow position-absolute w-100 h-100">
                          <span className="placeholder w-100 h-100"></span>
                        </div>
                      )}
                      <img
                        src={post.post_image ? imageUrl + post.post_image : "https://via.placeholder.com/150"}
                        className="card-img-top"
                        alt={post.title}
                        style={{
                          ...styles.postImage,
                          display: imageLoaded[post.id] ? 'block' : 'none',
                        }}
                        onLoad={() => handleImageLoad(post.id)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                          handleImageLoad(post.id);
                        }}
                      />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title h6 mb-2">{post.title}</h5>
                      <p className="card-text text-muted small flex-grow-1">
                        {post.content.length > 100
                          ? `${post.content.substring(0, 100)}...`
                          : post.content}
                      </p>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{formatDate(post.created_at)}</small>
                          <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
                            Devamını Oku
                          </Link>
                        </div>
                        <div className="mt-2">
                          <span className="badge bg-secondary">
                            {post.category_name || "Kategorisiz"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="alert alert-info py-3 text-center mt-4">
                <i className="bi bi-info-circle me-2"></i>
                <small>
                  {selectedCategory
                    ? "Bu kategoride henüz yazı bulunmuyor."
                    : "Henüz blog yazısı bulunmuyor."}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Posts;
