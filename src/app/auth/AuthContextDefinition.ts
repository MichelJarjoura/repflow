import { createContext } from "react";
import type {
  AuthenticatedUser,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCommand,
  VerifyEmailCommand,
} from "@/domain/athlete/authenticatedUser";

export type User = AuthenticatedUser;

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (input: LoginCredentials) => Promise<void>;
  register: (input: RegisterCredentials) => Promise<User | null>;
  verifyEmail: (input: VerifyEmailCommand) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (input: ResetPasswordCommand) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
