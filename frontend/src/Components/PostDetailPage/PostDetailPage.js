import React, { useEffect, useState } from "react";
import { getPostsById, getCommentsByPostId, createComment, imageUrl } from "../../Api/api";
import { useParams } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import Footer from "../Footer/Footer";

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [commenting, setCommenting] = useState(false);
    const { user } = useAuth();
    const userId = user ? user.id : null;

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const postData = await getPostsById(id);
                setPost(postData);

                const commentsData = await getCommentsByPostId(id);
                setComments(commentsData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id]);

    // Yorum metni değiştiğinde çağrılır
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    // Yorum gönderme işlemi
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            setCommenting(true);
            try {
                await createComment({ userId: userId, postId: id, comment_text: newComment });
                setNewComment("");
                const updatedComments = await getCommentsByPostId(id);
                setComments(updatedComments);
            } catch (error) {
                setError("Yorum eklenirken bir hata oluştu.");
            } finally {
                setCommenting(false);
            }
        }
    };

    if (loading) {
        return <p className="text-center mt-4">Yükleniyor...</p>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-4">Hata: {error}</div>;
    }

    if (!post) {
        return <p className="text-center mt-4">Yazı bulunamadı.</p>;
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <img
                                src={post.post_image ? imageUrl + post.post_image : "https://via.placeholder.com/800x400"}
                                alt={post.title}
                                className="card-img-top"
                                style={{ height: "400px", objectFit: "cover", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
                            />
                            <div className="card-body p-5">
                                <h1 className="card-title text-dark fw-bold mb-3">{post.title}</h1>
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center me-2"
                                            style={{ width: "40px", height: "40px", fontSize: "18px" }}
                                        >
                                            {post.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-muted">{post.username}</span>
                                    </div>
                                    <span className="text-muted">{new Date(post.created_at).toLocaleDateString("tr-TR")}</span>
                                </div>
                                <p className="card-text text-dark">{post.content}</p>
                            </div>
                        </div>

                        <div className="social-buttons d-flex justify-content-center mt-4">
                            <a href="#" className="btn btn-outline-dark mx-2">
                                <i className="bi bi-facebook"></i> Facebook
                            </a>
                            <a href="#" className="btn btn-outline-dark mx-2">
                                <i className="bi bi-twitter"></i> Twitter
                            </a>
                            <a href="#" className="btn btn-outline-dark mx-2">
                                <i className="bi bi-linkedin"></i> LinkedIn
                            </a>
                        </div>

{/* Yorumlar */}
<div className="card border-0 shadow-lg rounded-4 overflow-hidden mt-5">
    <div className="card-body p-5">
        <h3 className="card-title text-dark fw-bold mb-4">Yorumlar ({comments.length})</h3>

        {/* Yorum Formu */}
        {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="mb-3">
                    <textarea
                        className="form-control border-0 bg-light rounded-3"
                        rows="4"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Düşüncelerinizi paylaşın..."
                        required
                        style={{ resize: 'none' }}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="btn btn-dark px-4 rounded-3"
                    disabled={commenting}
                >
                    {commenting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Gönderiliyor...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-send me-2"></i>
                            Yorum Yap
                        </>
                    )}
                </button>
            </form>
        ) : (
            <div className="alert alert-dark bg-light border-0 rounded-3">
                <i className="bi bi-info-circle me-2"></i>
                Yorum yapabilmek için giriş yapmalısınız.
            </div>
        )}

        {/* Yorum Listesi */}
        <div className="comments-list">
            {comments.length === 0 ? (
                <p className="text-muted text-center my-4">
                    <i className="bi bi-chat-dots me-2"></i>
                    Henüz yorum yapılmamış. İlk yorumu siz yapın!
                </p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} className="comment-item border-bottom py-4">
                        <div className="d-flex">
                            <div
                                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center me-3"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    fontSize: "18px"
                                }}
                            >
                                {comment.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 fw-bold text-dark">{comment.username}</h6>
                                    <small className="text-muted">
                                        {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                                    </small>
                                </div>
                                <p className="mb-0 text-dark">{comment.comment_text}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
</div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PostDetail;