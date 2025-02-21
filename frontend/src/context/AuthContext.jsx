import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Ajout du loading state

  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        if (!base64Url) throw new Error("Token mal formé");
        
        const decoded = JSON.parse(atob(base64Url));
        console.log("🔍 Token décodé :", decoded);

        setUser({
          email: decoded.email,
          username: decoded.username,
          id: decoded.id,
          role: decoded.role
        });
      } catch (e) {
        console.error("❌ Erreur lors du décodage du token :", e);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token'); // ✅ Supprime le token invalide
      }
    } else {
      setUser(null);
    }
    setLoading(false); // ✅ Fin du chargement
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
