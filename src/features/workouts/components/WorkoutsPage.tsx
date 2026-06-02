import { WorkoutStats } from "./WorkoutStats";
import { LogWorkoutCard } from "./LogWorkoutCard";
import { LogPRCard } from "./LogPRCard";
import { ConsistencyCalendar } from "./ConsistencyCalendar";
import { Calendar, TrendingUp, Zap, Target } from "lucide-react";

export function WorkoutsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="font-display text-5xl tracking-tighter">PERFORMANCE TRACKER</h1>
          <p className="text-sm text-muted-foreground mt-2 uppercase tracking-[0.2em] font-mono">
            Precision Training &middot; Data Verified
          </p>
        </div>
        <div className="flex items-center gap-6">
          <StatMini label="Consistency" value="92%" icon={<Calendar size={14} />} />
          <StatMini label="Intensity" value="+4.2%" icon={<TrendingUp size={14} />} trend="up" />
          <StatMini label="Rank" value="A+" icon={<Zap size={14} />} />
        </div>
      </header>

      {/* Consistency Calendar */}
      <ConsistencyCalendar />

      {/* Main Stats Grid */}
      <WorkoutStats />

      {/* Logging & Deep Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Logging */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-2xl tracking-tight">ACTION CENTER</h2>
          </div>
          <LogWorkoutCard />
          <LogPRCard />
        </div>

        {/* Right Column: Heavy Lifting & PR Stats */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-2xl tracking-tight">LIFTING PERFORMANCE</h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-8">
            {/* PR Progress Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Target size={12} className="text-brand" /> 1RM Progression
                </span>
                <span className="text-[10px] font-mono text-brand">TOP 3 LIFTS</span>
              </div>

              <div className="space-y-6">
                <LiftProgress
                  label="Conventional Deadlift"
                  current={210}
                  previous={205}
                  color="brand"
                />
                <LiftProgress label="Back Squat" current={165} previous={160} color="brand" />
                <LiftProgress label="Bench Press" current={125} previous={125} color="muted" />
              </div>
            </div>

            {/* Heavy Volume Intensity */}
            <div className="pt-8 border-t border-border">
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
                Strength Intensity
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      Avg. Intensity
                    </p>
                    <p className="text-3xl font-display">84%</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      PR Frequency
                    </p>
                    <p className="text-xl font-display text-brand">2.4 / MO</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-surface/60 p-4 rounded-xl border border-white/5 group hover:border-brand/30 transition-colors">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                      Total PRs
                    </p>
                    <p className="text-2xl font-display">48</p>
                  </div>
                  <div className="bg-surface/60 p-4 rounded-xl border border-white/5 group hover:border-brand/30 transition-colors">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                      Max Load
                    </p>
                    <p className="text-2xl font-display text-brand">
                      210<span className="text-sm ml-1">KG</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent PR Activity Log */}
            <div className="pt-6 border-t border-border">
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
                Milestones
              </h4>
              <div className="space-y-3">
                <MilestoneItem lift="Deadlift" weight="210kg" date="2 days ago" />
                <MilestoneItem lift="Back Squat" weight="165kg" date="1 week ago" />
                <MilestoneItem lift="Overhead Press" weight="85kg" date="3 weeks ago" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function LiftProgress({
  label,
  current,
  previous,
  color,
}: {
  label: string;
  current: number;
  previous: number;
  color: "brand" | "muted";
}) {
  const diff = current - previous;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-foreground/80 mb-0.5">{label}</p>
          <p className="text-2xl font-display tracking-tight">{current} KG</p>
        </div>
        {diff > 0 && <span className="text-[10px] font-mono text-brand mb-1">+{diff} KG</span>}
      </div>
      <div className="h-1.5 w-full bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${color === "brand" ? "bg-brand" : "bg-muted-foreground/30"}`}
          style={{ width: `${(current / 250) * 100}%` }}
        />
      </div>
    </div>
  );
}

function MilestoneItem({ lift, weight, date }: { lift: string; weight: string; date: string }) {
  return (
    <div className="flex justify-between items-center bg-surface/40 p-3 rounded-lg border border-white/5">
      <div className="flex items-center gap-3">
        <div className="size-2 rounded-full bg-brand" />
        <span className="text-sm italic">{lift}</span>
      </div>
      <div className="text-right">
        <span className="text-sm font-display block leading-none">{weight}</span>
        <span className="text-[8px] font-mono text-muted-foreground uppercase">{date}</span>
      </div>
    </div>
  );
}

function StatMini({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-display tracking-tight">{value}</span>
        {trend === "up" && <span className="size-1.5 rounded-full bg-brand animate-pulse" />}
      </div>
    </div>
  );
}

function RecoveryItem({ label, progress }: { label: string; progress: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-foreground/80">{label}</span>
        <span className={progress < 30 ? "text-destructive" : "text-muted-foreground"}>
          {progress}%
        </span>
      </div>
      <div className="h-1 w-full bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${progress < 30 ? "bg-destructive" : "bg-brand"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
