import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(storage.getAccess());
  const [refreshToken, setRefreshToken] = useState(storage.getRefresh());
  const [user, setUser] = useState(storage.getUser());

  useEffect(() => {
    // keep localStorage in sync
    if (accessToken) localStorage.setItem('fx_access_token', accessToken);
    if (refreshToken) localStorage.setItem('fx_refresh_token', refreshToken);
    if (user) storage.saveUser(user);
  }, [accessToken, refreshToken, user]);

  const signOut = () => {
    storage.clearTokens();
    storage.clearUser();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    accessToken, refreshToken, user,
    setAccessToken, setRefreshToken, setUser,
    isAuthed: !!accessToken,
    signOut,
  }), [accessToken, refreshToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
