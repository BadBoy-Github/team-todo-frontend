import { createContext, useState, useEffect, useRef, type ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  userId: string;
  role: 'admin' | 'member';
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

/** Decode JWT payload without a library — returns null if malformed */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns true if the token is still valid (has an exp in the future) */
function isTokenValid(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return false;
  // exp is in seconds, Date.now() in ms
  return payload.exp * 1000 > Date.now();
}

/** Returns ms until the token expires (0 if already expired) */
function msUntilExpiry(token: string): number {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearExpiryTimer = () => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  };

  const logout = () => {
    clearExpiryTimer();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    // Navigate to login — use hard redirect so interceptors don't fire
    window.location.href = '/login';
  };

  /** Schedule an auto-logout exactly when the token expires */
  const scheduleAutoLogout = (tok: string) => {
    clearExpiryTimer();
    const ms = msUntilExpiry(tok);
    if (ms <= 0) {
      logout();
      return;
    }
    expiryTimerRef.current = setTimeout(() => {
      logout();
    }, ms);
  };

  // On mount — restore session only if token is still valid
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (storedToken && storedUser && isTokenValid(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      scheduleAutoLogout(storedToken);
    } else if (storedToken) {
      // Token found but it has expired — clean up silently
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }

    setLoading(false);

    // Register global axios interceptor — auto-logout on 401 from the server
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token rejected by the server — force logout
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
      clearExpiryTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newToken: string, newUser: User) => {
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    scheduleAutoLogout(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
