import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postRegister } from '../../Api/api';
import Footer from '../Footer/Footer';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Kayıt işlemi
  const handleRegister = async (e) => {
    e.preventDefault();

    // Şifrelerin uyuşup uyuşmadığını kontrol et
    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor!');
      return;
    }

    // Kullanıcı adı, email ve şifre kontrolü
    if (!username || !email || !password) {
      setError('Email, kullanıcı adı ve şifre boş olamaz.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await postRegister(username, email, password);

      // Kayıt başarılıysa
      if (result.status === 201) {
        setIsRegistered(true);
        setError(result.message);
        localStorage.setItem('token', result.token); // Token'ı yerel depolama'da sakla
      } else {
        setError('Bilinmeyen bir hata oluştu');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Kayıt sırasında bir hata oluştu';
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
                      <h3 className="text-center mb-3 mb-md-4">Create Account</h3>
                      <p className="text-center text-muted mb-4">Please fill in the details to register</p>

                      <form onSubmit={handleRegister}>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="name@example.com"
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            placeholder="Username"
                            required
                          />
                        </div>
                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="form-control"
                              placeholder="Password"
                              required
                            />
                          </div>

                          <div className="col-12 col-md-6 mb-3">
                            <label htmlFor="confirm_password" className="form-label">Confirm Password <span className="text-danger">*</span></label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="form-control"
                              placeholder="Confirm Password"
                              required
                            />
                          </div>
                        </div>

                        {error && <p className='text-danger mb-3'>{error}</p>}

                        <div className="d-grid mb-3">
                          <button type="submit" disabled={loading || isRegistered} className="btn btn-primary py-2">
                            {loading ? 'Registering...' : isRegistered ? 'Registered' : 'Register'}
                          </button>
                        </div>
                      </form>

                      <hr className="my-4" />

                      <div className="text-center">
                        <p>Already a member? <Link to="/login" className="link-secondary">Login now</Link></p>
                      </div>

                      <div className="text-center mt-4">
                        <p>Or sign up with</p>
                        <div className="d-flex flex-column flex-md-row justify-content-center gap-2 gap-md-3">
                          <a href="#!" className="btn btn-outline-primary mb-2 mb-md-0">
                            <i className="bi bi-google me-2"></i> Google
                          </a>
                          <a href="#!" className="btn btn-outline-primary mb-2 mb-md-0">
                            <i className="bi bi-facebook me-2"></i> Facebook
                          </a>
                          <a href="#!" className="btn btn-outline-primary">
                            <i className="bi bi-twitter me-2"></i> Twitter
                          </a>
                        </div>
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

export default RegisterPage;