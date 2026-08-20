import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiError,
  authApi,
  clearSessionToken,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
  type VerifyEmailInput,
} from "@/core/api/auth";
import { AuthContext, type AuthContextType, type User } from "./AuthContextDefinition";

function messageFromError(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function isUnauthenticated(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const authenticatedUser = await authApi.me();
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (refreshError) {
      setUser(null);
      if (isUnauthenticated(refreshError)) clearSessionToken();
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const authenticatedUser = await authApi.me();
        if (active) setUser(authenticatedUser);
      } catch (initializeError) {
        if (isUnauthenticated(initializeError)) clearSessionToken();
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void initialize();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const authenticatedUser = await authApi.login(input);
      setUser(authenticatedUser);
    } catch (loginError) {
      const message = messageFromError(loginError);
      setError(message);
      throw loginError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const authenticatedUser = await authApi.register(input);
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (registerError) {
      const message = messageFromError(registerError);
      setError(message);
      throw registerError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(
    async (input: VerifyEmailInput) => {
      setIsLoading(true);
      setError(null);
      try {
        await authApi.verifyEmail(input);
        await refreshUser();
      } catch (verifyError) {
        const message = messageFromError(verifyError);
        setError(message);
        throw verifyError;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshUser],
  );

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(email);
    } catch (forgotError) {
      const message = messageFromError(forgotError);
      setError(message);
      throw forgotError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (input: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.resetPassword(input);
    } catch (resetError) {
      const message = messageFromError(resetError);
      setError(message);
      throw resetError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.logout();
    } catch (logoutError) {
      const message = messageFromError(logoutError);
      setError(message);
    } finally {
      clearSessionToken();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      register,
      verifyEmail,
      forgotPassword,
      resetPassword,
      logout,
      refreshUser,
      clearError: () => setError(null),
    }),
    [
      error,
      forgotPassword,
      isLoading,
      login,
      logout,
      refreshUser,
      register,
      resetPassword,
      user,
      verifyEmail,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
