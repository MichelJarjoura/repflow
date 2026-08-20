import { createContext } from "react";
import type {
  AuthenticatedUser,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "@/core/api/auth";

export type User = AuthenticatedUser;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<User | null>;
  verifyEmail: (input: VerifyEmailInput) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (input: ResetPasswordInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
