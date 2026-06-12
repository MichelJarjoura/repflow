import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {

  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a stored session
    const storedUser = localStorage.getItem("repflow_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: "1",
      name: "Alex Rivera",
      username: username.startsWith("@") ? username : `@${username}`,
      avatar: "/src/assets/avatar-1.jpg",
    };
    
    setUser(mockUser);
    localStorage.setItem("repflow_user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const signup = async (name: string, username: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username: username.startsWith("@") ? username : `@${username}`,
    };
    
    setUser(mockUser);
    localStorage.setItem("repflow_user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("repflow_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
