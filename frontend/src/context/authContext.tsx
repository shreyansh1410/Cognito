import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; firstName: string; userId: string } | null;
  login: (
    email: string,
    token: string,
    firstName: string,
    userId: string
  ) => void;
  logout: () => void;
  updateUserInContext: (updatedUser: {
    email: string;
    firstName: string;
    userId: string;
  }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    userId: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    const firstName = localStorage.getItem("firstName");
    const userId = localStorage.getItem("userId");
    if (token && userEmail) {
      setIsAuthenticated(true);
      setUser({ email: userEmail, firstName: firstName!, userId: userId! });
    }
  }, []);

  const login = (
    email: string,
    token: string,
    firstName: string,
    userId: string
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);
    setUser({ email, firstName, userId });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("firstName");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserInContext = (updatedUser: {
    email: string;
    firstName: string;
    userId: string;
  }) => {
    localStorage.setItem("userEmail", updatedUser.email);
    localStorage.setItem("firstName", updatedUser.firstName);
    localStorage.setItem("userId", updatedUser.userId);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, updateUserInContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
