import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Flame, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/app/auth/useAuth";
import { AuthModal } from "@/app/auth/components/AuthModal";
import { useWorkoutHistory } from "@/features/workouts/application/useWorkoutHistory";

export function IdentityCard() {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { workouts, stats } = useWorkoutHistory(user?.id);
  const weeklyVolume = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return workouts
      .filter((workout) => new Date(workout.createdAt) >= start)
      .reduce(
        (total, workout) =>
          total +
          workout.exercises.reduce(
            (exerciseTotal, exercise) =>
              exerciseTotal +
              Number(exercise.sets || 0) *
                Number(exercise.reps || 0) *
                Number(exercise.weight || 0),
            0,
          ),
        0,
      );
  }, [workouts]);

  if (!isAuthenticated) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-elevated p-6 group">
        <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
          <Trophy size={80} className="rotate-12 text-brand" />
        </div>
        <h2 className="mb-2 font-display text-2xl tracking-tight text-foreground">
          BUILD YOUR <span className="text-brand">IDENTITY</span>
        </h2>
        <p className="relative z-10 mb-6 text-sm leading-relaxed text-muted-foreground">
          Track your workouts, show your progress, and turn training into social content.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="relative z-10 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-bold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Join Repflow <ArrowRight size={18} />
        </button>
        <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultView="signup" />
      </div>
    );
  }

  const topLifts = stats.personalRecords.slice(0, 3);
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
        <div className="grid size-10 place-items-center overflow-hidden rounded-xl bg-brand/10 text-sm font-bold text-brand">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="size-full object-cover" />
          ) : (
            (user?.name ?? "R").charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{user?.name ?? "Repflow athlete"}</p>
          <p className="mt-0.5 truncate text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Your training identity
          </p>
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Top lifts
          </h2>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-mono text-brand">
            LIVE DATA
          </span>
        </div>
        {topLifts.length ? (
          <div className="space-y-3">
            {topLifts.map((lift) => (
              <div key={lift.exercise} className="flex items-end justify-between gap-3">
                <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                  {lift.exercise}
                </p>
                <p className="shrink-0 font-display text-xl">
                  {lift.weight}
                  <span className="ml-1 text-xs text-muted-foreground">KG</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-surface/20 p-3 text-xs leading-5 text-muted-foreground">
            Save a weighted workout to show your top lifts here.
          </p>
        )}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
        <IdentityMetric icon={Calendar} label="Sessions" value={String(stats.totalSessions)} />
        <IdentityMetric icon={Flame} label="Streak" value={`${stats.streak}d`} />
        <IdentityMetric
          icon={Zap}
          label="This week"
          value={weeklyVolume ? `${(weeklyVolume / 1000).toFixed(1)}t` : "—"}
        />
      </div>
    </section>
  );
}

function IdentityMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-surface/35 p-2.5">
      <Icon size={14} className="text-brand" />
      <p className="mt-2 text-[9px] font-mono uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate font-display text-lg">{value}</p>
    </div>
  );
}
