import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, LogIn, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "../AuthContext";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: "login" | "signup";
}

export function AuthModal({ open, onOpenChange, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "signup">(defaultView);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const { login, signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "login") {
      await login(username);
    } else {
      await signup(name, username);
    }
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-elevated border border-border p-8 rounded-2xl shadow-2xl z-[101] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Dialog.Title className="font-display text-3xl tracking-tight text-foreground uppercase">
                {view === "login" ? "Welcome Back" : "Join the Flow"}
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground text-sm mt-1">
                {view === "login" 
                  ? "Enter your details to access your fitness identity." 
                  : "Create an account to start logging your progress."}
              </Dialog.Description>
            </div>
            <Dialog.Close className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
              <X size={20} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === "signup" && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand text-brand-foreground font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {view === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {view === "login" ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setView(view === "login" ? "signup" : "login")}
              className="flex items-center gap-2 text-white font-bold hover:text-brand transition-colors"
            >
              {view === "login" ? (
                <>
                  <UserPlus size={18} />
                  Join RepFlow
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
