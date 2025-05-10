
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from '../api/axiosConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        setUser({
          email: res.data.email,
          username: res.data.username,
          
          profileImage: res.data.profileImage || null
        });
      }).catch(() => {
        setUser(null);
        localStorage.removeItem('token'); // clean up if invalid
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    axios.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setUser({
        email: res.data.email,
        username: res.data.username,
        
        profileImage: res.data.profileImage || null
      });
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
