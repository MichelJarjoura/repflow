import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

function messageFromError(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function isUnauthenticated(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const sessionQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onMutate: () => setActionError(null),
    onSuccess: (user) => queryClient.setQueryData(authKeys.me(), user),
    onError: (error) => setActionError(messageFromError(error)),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onMutate: () => setActionError(null),
    onSuccess: (user) => {
      if (user) queryClient.setQueryData(authKeys.me(), user);
    },
    onError: (error) => setActionError(messageFromError(error)),
  });

  const verifyMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onMutate: () => setActionError(null),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
    onError: (error) => setActionError(messageFromError(error)),
  });

  const forgotMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onMutate: () => setActionError(null),
    onError: (error) => setActionError(messageFromError(error)),
  });

  const resetMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onMutate: () => setActionError(null),
    onError: (error) => setActionError(messageFromError(error)),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onMutate: () => setActionError(null),
    onError: (error) => setActionError(messageFromError(error)),
    onSettled: () => {
      clearSessionToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });

  const refreshUser = useCallback(async () => {
    try {
      return await queryClient.fetchQuery({ queryKey: authKeys.me(), queryFn: authApi.me });
    } catch (error) {
      if (isUnauthenticated(error)) clearSessionToken();
      queryClient.setQueryData<User | null>(authKeys.me(), null);
      return null;
    }
  }, [queryClient]);

  const clearError = useCallback(() => {
    setActionError(null);
    loginMutation.reset();
    registerMutation.reset();
    verifyMutation.reset();
    forgotMutation.reset();
    resetMutation.reset();
    logoutMutation.reset();
  }, [
    forgotMutation,
    loginMutation,
    logoutMutation,
    registerMutation,
    resetMutation,
    verifyMutation,
  ]);

  const isLoading =
    sessionQuery.isLoading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    verifyMutation.isPending ||
    forgotMutation.isPending ||
    resetMutation.isPending ||
    logoutMutation.isPending;
  const user = sessionQuery.data ?? null;

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error: actionError,
      login: async (input: LoginInput) => {
        await loginMutation.mutateAsync(input);
      },
      register: (input: RegisterInput) => registerMutation.mutateAsync(input),
      verifyEmail: async (input: VerifyEmailInput) => {
        await verifyMutation.mutateAsync(input);
        await refreshUser();
      },
      forgotPassword: async (email: string) => {
        await forgotMutation.mutateAsync(email);
      },
      resetPassword: async (input: ResetPasswordInput) => {
        await resetMutation.mutateAsync(input);
      },
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
      refreshUser,
      clearError,
    }),
    [
      actionError,
      clearError,
      forgotMutation,
      isLoading,
      loginMutation,
      logoutMutation,
      refreshUser,
      registerMutation,
      resetMutation,
      user,
      verifyMutation,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
