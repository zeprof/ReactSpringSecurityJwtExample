import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import fetcher from "../utils/fetcher.js";

const AuthContext = createContext(null);

// Adds isLoggedIn flag to user object for easier auth checks
const normalizeUser = (userData) => ({
  ...userData,
  isLoggedIn: true,
});

// Provider component that wraps the app and provides auth context to all children.
// On mount, it restores user from localStorage and validates the JWT token.
export function AuthProvider({ children }) {
  // Load persisted user from localStorage on app startup
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("auth-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  // true while checking token validity on app startup
  const [isLoading, setIsLoading] = useState(true);

  // Saves user to localStorage and state. Clears if nextUser is null.
  // This ensures user stays logged in after page refresh.
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

  // Validates JWT token on app startup by requesting /user/me.
  // If token is valid, backend returns user data. If expired/invalid, token is cleared.
  // This is called in App.jsx useEffect to restore user session after page refresh.
  const hydrateUserFromToken = useCallback(async () => {
    const token = localStorage.getItem("token");

    // No token = not logged in
    if (!token) {
      persistUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Ask backend to validate token and return user data
      const response = await fetcher("user/me", {});
      if (!response.ok) {
        // Token was invalid/expired. Clear it and logout.
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

  // Authenticates user with email/password.
  // Returns JWT token from backend, validates it, then fetches user profile.
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

    // Backend returns JWT token. Store it for future API requests.
    const data = await response.json();
    localStorage.setItem("token", data.accessToken);

    // Use token to fetch user details
    const userResponse = await fetcher("user/me", {});
    if (!userResponse.ok) {
      localStorage.removeItem("token");
      throw new Error("Failed to fetch user profile");
    }

    const userData = await userResponse.json();
    persistUser(userData);
    return userData;
  }, [persistUser]);

  // Clears JWT token and user state. User will be logged out on next page load.
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

// Custom hook to access authentication state and methods.
// Usage: const { user, login, logout } = useAuth()
// Must be called inside a component wrapped by AuthProvider.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Route guard: Redirects to login if user is not authenticated.
// Usage: <RequireAuth><Dashboard /></RequireAuth>
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

// Route guard: Checks both authentication AND user role.
// Redirects to login if not authenticated, or to home if user lacks required role.
// Usage: <RequireRole allowedRoles={["ROLE_ADMIN", "ROLE_STAFF"]}><AdminPanel /></RequireRole>
export function RequireRole({ allowedRoles, children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but lacks required role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
