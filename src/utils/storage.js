const KEYS = {
  ACCESS: 'fx_access_token',
  REFRESH: 'fx_refresh_token',
  USER: 'fx_user',
  PENDING_VERIF: 'fx_pending_verification', // { phoneNumber, verificationId, expiresAt }
};

export const storage = {
  saveTokens({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(KEYS.ACCESS, accessToken);
    if (refreshToken) localStorage.setItem(KEYS.REFRESH, refreshToken);
  },
  getAccess() {
    return localStorage.getItem(KEYS.ACCESS);
  },
  getRefresh() {
    return localStorage.getItem(KEYS.REFRESH);
  },
  clearTokens() {
    localStorage.removeItem(KEYS.ACCESS);
    localStorage.removeItem(KEYS.REFRESH);
  },
  saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user || null));
  },
  getUser() {
    const raw = localStorage.getItem(KEYS.USER);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  clearUser() {
    localStorage.removeItem(KEYS.USER);
  },
  setPendingVerification(obj) {
    localStorage.setItem(KEYS.PENDING_VERIF, JSON.stringify(obj || null));
  },
  getPendingVerification() {
    const raw = localStorage.getItem(KEYS.PENDING_VERIF);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  clearPendingVerification() {
    localStorage.removeItem(KEYS.PENDING_VERIF);
  },
};
