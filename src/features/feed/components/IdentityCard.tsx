import { useAuth } from "@/core/auth/AuthContext";
import { AuthModal } from "@/core/auth/components/AuthModal";
import { useState } from "react";
import { ArrowRight, Trophy, Zap, Target } from "lucide-react";

export function IdentityCard() {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const lifts = [
    { label: "Bench Press", value: 125 },
    { label: "Back Squat", value: 160 },
    { label: "Deadlift", value: 210 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="bg-elevated border border-brand/20 rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Trophy size={80} className="text-brand rotate-12" />
        </div>

        <h2 className="font-display text-2xl tracking-tight text-foreground mb-2">
          BUILD YOUR <span className="text-brand">IDENTITY</span>
        </h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed relative z-10">
          Track your PRs, join the leaderboard, and turn your progress into social content.
        </p>

        <div className="space-y-3 relative z-10">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-brand text-brand-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Join RepFlow
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="flex flex-col items-center">
              <Zap size={16} className="text-brand mb-1" />
              <span className="text-[10px] text-muted-foreground uppercase font-mono">
                Real-time
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex flex-col items-center">
              <Target size={16} className="text-brand mb-1" />
              <span className="text-[10px] text-muted-foreground uppercase font-mono">Verify</span>
            </div>
          </div>
        </div>

        <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultView="signup" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
            IDENTITY
          </h2>
          <span className="text-[10px] font-mono text-brand bg-brand/10 px-2 py-0.5 rounded-full">
            VERIFIED
          </span>
        </div>
        <div className="space-y-4">
          {lifts.map((l) => (
            <div key={l.label}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {l.label}
              </p>
              <p className="text-2xl font-display text-foreground">
                {l.value}
                <span className="text-sm text-muted-foreground ml-1">KG</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Streak</p>
            <p className="text-xl font-display text-brand">12 DAYS</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Vol/Wk</p>
            <p className="text-xl font-display text-foreground">42.5T</p>
          </div>
        </div>
      </div>
    </div>
  );
}
