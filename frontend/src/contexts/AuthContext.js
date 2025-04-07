import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateToken } from '../Api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kullanıcıyı çıkış yapma işlemi
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await validateToken(token);

          if (response.rValid) {
            setUser(response.rUser);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [logout]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext'i kullanmak için özel kanca
export const useAuth = () => useContext(AuthContext);