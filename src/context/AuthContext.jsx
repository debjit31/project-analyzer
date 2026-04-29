import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const TOKEN_KEY = 'pa_jwt';

/**
 * Decode a JWT and return a user object, or null if invalid/expired.
 */
function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return {
      id: payload.sub,
      name: payload.name ?? '',
      email: payload.email ?? '',
      avatarUrl: payload.avatarUrl ?? '',
      provider: payload.provider ?? 'LOCAL',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => decodeToken(localStorage.getItem(TOKEN_KEY)));

  // Keep user state in sync whenever the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      setUser(decodeToken(token));
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  const saveToken = useCallback((newToken) => {
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
