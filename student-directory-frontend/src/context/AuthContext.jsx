import { createContext, useCallback, useMemo, useState } from "react";
import { API_URL } from "../config";

export const AuthContext = createContext(null);

const TOKEN_KEY = "token";

// Decode the JWT payload (no signature check: the server does that).
function decodeToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Return the stored token only if it exists and has not expired.
function readStoredToken() {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;

  const payload = decodeToken(stored);
  const expired = !payload || (payload.exp && payload.exp * 1000 < Date.now());
  if (expired) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return stored;
}

export function AuthProvider({ children }) {
  // Lazy initializer: runs once on first load, so a refresh keeps the session
  // and there is no flash of the login page.
  const [token, setToken] = useState(readStoredToken);
  const user = useMemo(() => (token ? decodeToken(token) : null), [token]);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, logout, isAuthenticated: Boolean(token) }),
    [user, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
