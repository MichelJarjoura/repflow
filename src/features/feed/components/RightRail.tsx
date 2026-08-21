import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Dumbbell, Users } from "lucide-react";
import { communityApi } from "@/core/api/repflow";
import { useAuth } from "@/core/auth/useAuth";
import { useLocalWorkouts } from "@/features/workouts/useLocalWorkouts";

function volumeForWorkout(exercises: { sets: string; reps: string; weight: string }[]) {
  return exercises.reduce(
    (total, exercise) =>
      total +
      Number(exercise.sets || 0) * Number(exercise.reps || 0) * Number(exercise.weight || 0),
    0,
  );
}

export function RightRail() {
  const { user, isAuthenticated } = useAuth();
  const { workouts, stats } = useLocalWorkouts(user?.id);
  const communities = useQuery({
    queryKey: ["communities", "mine"],
    queryFn: communityApi.getMine,
    enabled: isAuthenticated,
  });
  const weeklyVolume = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return workouts
      .filter((workout) => new Date(workout.createdAt) >= start)
      .reduce((total, workout) => total + volumeForWorkout(workout.exercises), 0);
  }, [workouts]);
  const target = 50_000;
  const progress = Math.min(100, Math.round((weeklyVolume / target) * 100));

  return (
    <aside className="space-y-6">
      <section className="rounded-xl border border-brand/20 bg-brand/10 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xs tracking-[0.2em] text-brand uppercase">This week</h2>
          <Calendar size={17} className="text-brand" />
        </div>
        <p className="font-display text-2xl tracking-tight">YOUR TRAINING VOLUME</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          A personal 50-ton weekly marker, calculated from your saved workouts.
        </p>
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>{(weeklyVolume / 1000).toFixed(1)}T logged</span>
          <span>50.0T marker</span>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
            My communities
          </h2>
          <Users size={16} className="text-brand" />
        </div>
        {communities.isLoading ? (
          <p className="text-xs text-muted-foreground">Loading your communities…</p>
        ) : communities.data?.length ? (
          <div className="space-y-3">
            {communities.data.slice(0, 4).map((community) => (
              <div
                key={community.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface/30 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{community.name}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {community.memberCount} member{community.memberCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="size-2 shrink-0 rounded-full bg-brand" title="Joined community" />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-surface/20 p-4 text-xs leading-5 text-muted-foreground">
            Join a community to see it here and follow its challenges.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Recent training
          </h2>
          <Dumbbell size={16} className="text-brand" />
        </div>
        {workouts.length ? (
          <div className="space-y-3">
            {workouts.slice(0, 3).map((workout) => (
              <div key={workout.id} className="flex items-start gap-3">
                <div className="mt-1 size-2 shrink-0 rounded-full bg-brand" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{workout.title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {workout.exercises.length} exercise{workout.exercises.length === 1 ? "" : "s"} ·{" "}
                    {workout.duration} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-surface/20 p-4 text-xs leading-5 text-muted-foreground">
            Your saved workout activity will appear here.
          </p>
        )}
        {stats.totalSessions > 0 && (
          <p className="mt-4 border-t border-border pt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {stats.totalSessions} saved session{stats.totalSessions === 1 ? "" : "s"}
          </p>
        )}
      </section>
    </aside>
  );
}
