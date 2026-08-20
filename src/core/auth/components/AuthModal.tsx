import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LogIn,
  MailCheck,
  UserPlus,
  X,
} from "lucide-react";
import { useAuth } from "../useAuth";

type AuthView = "login" | "signup" | "verify" | "forgot" | "reset";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: "login" | "signup";
}

const content: Record<AuthView, { title: string; description: string }> = {
  login: {
    title: "Welcome back",
    description: "Sign in to continue building your fitness identity.",
  },
  signup: {
    title: "Join the flow",
    description: "Create an account to log progress and train with your community.",
  },
  verify: {
    title: "Verify your email",
    description: "Enter the verification code sent to your inbox.",
  },
  forgot: {
    title: "Reset your password",
    description: "Enter your account email and we will send a reset code.",
  },
  reset: {
    title: "Set a new password",
    description: "Use the reset code from your email to secure your account.",
  },
};

export function AuthModal({ open, onOpenChange, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    isLoading,
    error,
    clearError,
  } = useAuth();

  useEffect(() => {
    if (open) {
      setView(defaultView);
      setNotice(null);
      setFormError(null);
      clearError();
    }
  }, [clearError, defaultView, open]);

  const moveTo = (nextView: AuthView) => {
    setView(nextView);
    setNotice(null);
    setFormError(null);
    clearError();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice(null);
    setFormError(null);

    try {
      if (view === "login") {
        await login({ email, password });
        onOpenChange(false);
        return;
      }

      if (view === "signup") {
        if (password !== confirmPassword) {
          setFormError("Your passwords do not match.");
          return;
        }
        const authenticatedUser = await register({ name, username, email, password });
        if (authenticatedUser) {
          onOpenChange(false);
          return;
        }
        setNotice("Your account was created. Check your inbox for the verification code.");
        setView("verify");
        return;
      }

      if (view === "verify") {
        await verifyEmail({ email, token: code });
        setNotice("Your email is verified. You can now sign in.");
        setView("login");
        return;
      }

      if (view === "forgot") {
        await forgotPassword(email);
        setNotice("If an account exists for that email, a reset code has been sent.");
        setView("reset");
        return;
      }

      if (password !== confirmPassword) {
        setFormError("Your passwords do not match.");
        return;
      }
      await resetPassword({ email, token: code, password });
      setNotice("Your password has been updated. Sign in with your new password.");
      setPassword("");
      setConfirmPassword("");
      setCode("");
      setView("login");
    } catch {
      // The provider captures API errors for accessible display below.
    }
  };

  const current = content[view];
  const activeError = formError ?? error;
  const isPasswordView = view === "login" || view === "signup" || view === "reset";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-elevated p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              {view !== "login" && view !== "signup" && (
                <button
                  type="button"
                  onClick={() => moveTo("login")}
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </button>
              )}
              <Dialog.Title className="font-display text-3xl uppercase tracking-tight text-foreground">
                {current.title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {current.description}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close authentication"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {view === "signup" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthField label="Full name">
                  <input
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Alex Rivera"
                    className="auth-input"
                  />
                </AuthField>
                <AuthField label="Username">
                  <input
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="alexlifts"
                    className="auth-input"
                  />
                </AuthField>
              </div>
            )}

            <AuthField label="Email address">
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="auth-input"
              />
            </AuthField>

            {(view === "verify" || view === "reset") && (
              <AuthField label="Verification code">
                <input
                  required
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Enter the code from your email"
                  className="auth-input"
                />
              </AuthField>
            )}

            {isPasswordView && (
              <AuthField label={view === "reset" ? "New password" : "Password"}>
                <input
                  required
                  type="password"
                  minLength={8}
                  autoComplete={view === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="auth-input"
                />
              </AuthField>
            )}

            {(view === "signup" || view === "reset") && (
              <AuthField label="Confirm password">
                <input
                  required
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  className="auth-input"
                />
              </AuthField>
            )}

            {notice && (
              <div className="flex gap-3 rounded-2xl border border-brand/25 bg-brand/10 px-4 py-3 text-sm leading-relaxed text-foreground">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={17} />
                {notice}
              </div>
            )}
            {activeError && (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive"
              >
                {activeError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 font-bold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="size-5 animate-spin rounded-full border-2 border-brand-foreground/30 border-t-brand-foreground" />
              ) : (
                <SubmitLabel view={view} />
              )}
            </button>
          </form>

          {view === "login" && (
            <div className="mt-6 space-y-4 border-t border-border pt-6 text-center">
              <button
                type="button"
                onClick={() => moveTo("forgot")}
                className="text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                Forgot your password?
              </button>
              <p className="text-sm text-muted-foreground">
                New to REPFLOW?{" "}
                <button
                  type="button"
                  onClick={() => moveTo("signup")}
                  className="font-bold text-foreground transition-colors hover:text-brand"
                >
                  Create your account
                </button>
              </p>
            </div>
          )}

          {view === "signup" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already a member?{" "}
              <button
                type="button"
                onClick={() => moveTo("login")}
                className="font-bold text-foreground transition-colors hover:text-brand"
              >
                Sign in
              </button>
            </p>
          )}
          {view === "verify" && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Need a new code?{" "}
              <button
                type="button"
                onClick={() => moveTo("forgot")}
                className="font-bold text-foreground transition-colors hover:text-brand"
              >
                Request access help
              </button>
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AuthField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function SubmitLabel({ view }: { view: AuthView }) {
  if (view === "login")
    return (
      <>
        <LogIn size={18} /> Sign in
      </>
    );
  if (view === "signup")
    return (
      <>
        <UserPlus size={18} /> Create account
      </>
    );
  if (view === "verify")
    return (
      <>
        <MailCheck size={18} /> Verify email
      </>
    );
  if (view === "forgot")
    return (
      <>
        <KeyRound size={18} /> Send reset code
      </>
    );
  return (
    <>
      <ArrowRight size={18} /> Update password
    </>
  );
}
