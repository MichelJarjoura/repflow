import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/app/auth/useAuth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-6">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
          <span className="size-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
          Checking your session
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/feed" replace />;
  return <>{children}</>;
}
