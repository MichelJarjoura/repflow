import { Calendar, Clock3, Dumbbell, TrendingUp, Zap } from "lucide-react";
import { useAuth } from "@/core/auth/useAuth";
import { ConsistencyCalendar } from "./ConsistencyCalendar";
import { LogWorkoutCard } from "./LogWorkoutCard";
import { useLocalWorkouts } from "../useLocalWorkouts";

export function WorkoutsPage() {
  const { user } = useAuth();
  const { workouts, stats } = useLocalWorkouts(user?.id);
  const topLifts = stats.personalRecords.slice(0, 4);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-6">
      <header className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.24em] text-brand">
            Your training data
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-tighter">PERFORMANCE</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Every saved workout updates this dashboard instantly. Your data stays on this device
            until a full workout-sync API is available.
          </p>
        </div>
        <p className="rounded-2xl border border-border bg-card px-4 py-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Local-first training log
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={Calendar}
          label="Sessions"
          value={String(stats.totalSessions)}
          detail="All saved workouts"
        />
        <Metric
          icon={Zap}
          label="Total volume"
          value={stats.totalVolume ? `${Math.round(stats.totalVolume).toLocaleString()} kg` : "—"}
          detail="Sets × reps × weight"
        />
        <Metric
          icon={Clock3}
          label="Avg. session"
          value={stats.averageDuration ? `${stats.averageDuration} min` : "—"}
          detail="Training time"
        />
        <Metric
          icon={TrendingUp}
          label="Top lifts"
          value={String(topLifts.length)}
          detail="Personal bests"
        />
      </section>

      <ConsistencyCalendar workouts={workouts} streak={stats.streak} />

      <div className="grid gap-8 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-7">
          <LogWorkoutCard />
        </section>
        <aside className="space-y-6 lg:col-span-5">
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-brand">
                  Strength board
                </p>
                <h2 className="mt-2 font-display text-3xl tracking-tight">TOP LIFTS</h2>
              </div>
              <Dumbbell className="text-brand" size={25} />
            </div>
            {topLifts.length ? (
              <div className="mt-6 space-y-4">
                {topLifts.map((lift, index) => (
                  <div
                    key={lift.exercise}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-surface/25 p-4"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-brand/10 font-display text-lg text-brand">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{lift.exercise}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Best recorded load</p>
                    </div>
                    <p className="font-display text-2xl text-brand">
                      {lift.weight} <span className="text-sm">kg</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Log weighted exercises to build your strength board." />
            )}
          </section>
          <section className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-brand">
              Recent training
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">WORKOUT HISTORY</h2>
            {workouts.length ? (
              <div className="mt-6 space-y-3">
                {workouts.slice(0, 4).map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/25 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold">{workout.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {workout.exercises.length} exercise
                        {workout.exercises.length === 1 ? "" : "s"} ·{" "}
                        {new Date(workout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-sm text-brand">{workout.duration} min</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Your saved workouts will appear here." />
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon size={18} className="text-brand" />
      <p className="mt-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface/20 p-5 text-sm leading-6 text-muted-foreground">
      {text}
    </p>
  );
}
