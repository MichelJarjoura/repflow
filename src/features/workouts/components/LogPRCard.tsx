import { Trophy, ArrowUpRight, ChevronDown, Dumbbell, Weight } from "lucide-react";
import { useState } from "react";

export function LogPRCard() {
  const [exercise, setExercise] = useState("Back Squat");
  const [weight, setWeight] = useState("");

  const exercises = [
    "Back Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Weighted Pull-up",
    "Front Squat",
    "Incline Bench",
  ];

  return (
    <div className="bg-card border border-brand/20 rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(223,255,0,0.1)]">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono text-brand uppercase tracking-[0.3em] mb-1 block">
              Achievement
            </span>
            <h2 className="font-display text-3xl tracking-tight">LOG NEW PR</h2>
          </div>
          <div className="size-12 rounded-full bg-brand/10 flex items-center justify-center text-brand ring-1 ring-brand/20">
            <Trophy size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Exercise Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Dumbbell size={12} /> Select Movement
            </label>
            <div className="relative group">
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-5 py-4 text-base font-medium appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand/30 transition-all cursor-pointer group-hover:border-brand/40"
              >
                {exercises.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-brand transition-colors"
                size={20}
              />
            </div>
          </div>

          {/* Weight Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Weight size={12} /> Load Amount (KG)
            </label>
            <div className="relative group">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="000"
                className="no-spinner w-full bg-surface border border-border rounded-xl px-5 py-4 text-3xl font-display tracking-tight focus:outline-hidden focus:ring-2 focus:ring-brand/30 transition-all group-hover:border-brand/40 placeholder:text-muted/30"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-display text-xl group-focus-within:text-brand transition-colors">
                KG
              </span>
            </div>
          </div>
        </div>

        <button className="w-full bg-brand text-brand-foreground font-display text-xl py-5 rounded-xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(223,255,0,0.3)]">
          VERIFY & RECORD PERFORMANCE
          <ArrowUpRight size={22} />
        </button>
      </div>

      <div className="bg-linear-to-r from-brand/5 to-transparent px-8 py-3 border-t border-border/50">
        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em]">
          All PRs are added to your global identity and verified by training volume.
        </p>
      </div>
    </div>
  );
}
