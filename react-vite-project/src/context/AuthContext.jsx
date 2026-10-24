import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import fetcher from "../utils/fetcher.js";

const AuthContext = createContext(null);

const normalizeUser = (userData) => ({
  ...userData,
  isLoggedIn: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("auth-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    if (!nextUser) {
      localStorage.removeItem("auth-user");
      setUser(null);
      return;
    }

    const normalizedUser = normalizeUser(nextUser);
    localStorage.setItem("auth-user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  }, []);

  const hydrateUserFromToken = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      persistUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetcher("user/me", {});
      if (!response.ok) {
        localStorage.removeItem("token");
        persistUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await response.json();
      persistUser(userData);
    } catch (error) {
      localStorage.removeItem("token");
      persistUser(null);
      console.error("Failed to hydrate auth user", error);
    } finally {
      setIsLoading(false);
    }
  }, [persistUser]);

  useEffect(() => {
    hydrateUserFromToken();
  }, [hydrateUserFromToken]);

  const login = useCallback(async (credentials) => {
    const response = await fetcher("/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Invalid username or password");
    }

    const data = await response.json();
    localStorage.setItem("token", data.accessToken);

    const userResponse = await fetcher("user/me", {});
    if (!userResponse.ok) {
      localStorage.removeItem("token");
      throw new Error("Failed to fetch user profile");
    }

    const userData = await userResponse.json();
    persistUser(userData);
    return userData;
  }, [persistUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    persistUser(null);
  }, [persistUser]);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user?.isLoggedIn,
    login,
    logout,
    setUser: persistUser,
    refreshUser: hydrateUserFromToken,
  }), [user, isLoading, login, logout, hydrateUserFromToken, persistUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RequireRole({ allowedRoles, children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
