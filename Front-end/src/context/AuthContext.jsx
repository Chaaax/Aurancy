import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <- novo estado

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);

      fetch('http://localhost:3000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          } else {
            console.warn('Token inválido. Logout automático.');
            logout();
          }
          setLoading(false); // <- marca como carregado após a verificação
        })
        .catch((err) => {
          console.error('Erro ao obter utilizador:', err);
          logout();
          setLoading(false); // <- mesmo em erro
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false); // <- sem token, mas já carregado
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}


