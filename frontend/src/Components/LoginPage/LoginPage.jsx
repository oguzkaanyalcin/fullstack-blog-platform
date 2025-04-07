import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postLogin } from '../../Api/api';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../Footer/Footer';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Giriş işlemi
  const handleLogin = async (e) => {
    e.preventDefault();

    // Email ve şifre kontrolü
    if (!email || !password) {
      setError('Email ve şifre boş olamaz.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await postLogin(email, password);

      // Giriş başarılıysa
      if (result.status === 200) {
        setError(null);
        localStorage.setItem('token', result.token);
        setUser(result.user);
        console.log('Başarıyla giriş yapıldı!')
        window.location.href = '/home';
      } else {
        setError('Bilinmeyen bir hata oluştu');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Giriş sırasında bir hata oluştu';
      setError(errorMessage);
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column min-vh-100">
        <div className="container mt-5">
          <section className="p-3 p-md-4 p-xl-5">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-body p-3 p-sm-4 p-md-5">
                      <h3 className="text-center mb-3">Welcome Back!</h3>
                      <p className="text-center text-muted mb-4">Please login to your account</p>

                      <form onSubmit={handleLogin}>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="name@example.com"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Password <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                          />
                        </div>

                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                          <div className="form-check mb-2 mb-md-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="remember_me"
                              id="remember_me"
                            />
                            <label className="form-check-label text-secondary" htmlFor="remember_me">
                              Remember me
                            </label>
                          </div>

                          <Link to="/forgot-password" className="link-secondary text-decoration-none small">
                            Forgot password?
                          </Link>
                        </div>

                        {error && (
                          <div className="alert alert-danger py-2 small" role="alert">
                            {error}
                          </div>
                        )}

                        <div className="d-grid mb-3">
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary py-2"
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Logging in...
                              </>
                            ) : 'Log in'}
                          </button>
                        </div>
                      </form>

                      <div className="position-relative my-3">
                        <hr />
                        <p className="small bg-white px-3 position-absolute top-50 start-50 translate-middle text-muted">
                          Or sign in with
                        </p>
                      </div>

                      <div className="d-flex flex-column flex-md-row justify-content-center gap-2 gap-md-3 mb-3">
                        <a href="#!" className="btn btn-outline-primary btn-sm mb-2 mb-md-0">
                          <i className="bi bi-google me-2"></i> Google
                        </a>
                        <a href="#!" className="btn btn-outline-primary btn-sm mb-2 mb-md-0">
                          <i className="bi bi-facebook me-2"></i> Facebook
                        </a>
                        <a href="#!" className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-twitter me-2"></i> Twitter
                        </a>
                      </div>

                      <div className="text-center">
                        <p className="mb-0 small">Not a member yet? <Link to="/register" className="link-secondary">Register now</Link></p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;