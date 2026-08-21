import { useMemo } from "react";
import { addDays, eachDayOfInterval, format, startOfToday, startOfWeek, subWeeks } from "date-fns";
import type { LocalWorkout } from "../application/useWorkoutHistory";

type ConsistencyCalendarProps = {
  workouts: LocalWorkout[];
  streak: number;
};

function workoutVolume(workout: LocalWorkout) {
  return workout.exercises.reduce(
    (total, exercise) =>
      total +
      Number(exercise.sets || 0) * Number(exercise.reps || 0) * Number(exercise.weight || 0),
    0,
  );
}

export function ConsistencyCalendar({ workouts, streak }: ConsistencyCalendarProps) {
  const { weeks, monthLabels, totalSessions, volumeByDay, maxVolume } = useMemo(() => {
    const today = startOfToday();
    const startDate = startOfWeek(subWeeks(today, 52));
    const days = eachDayOfInterval({ start: startDate, end: today });
    const volumeMap = new Map<string, number>();
    workouts.forEach((workout) => {
      const key = format(new Date(workout.createdAt), "yyyy-MM-dd");
      volumeMap.set(key, (volumeMap.get(key) ?? 0) + workoutVolume(workout));
    });

    const weeksData: Date[][] = [];
    let currentWeek: Date[] = [];
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;
    let lastYear = -1;
    days.forEach((day) => {
      if (!currentWeek.length) {
        const month = day.getMonth();
        const year = day.getFullYear();
        if (month !== lastMonth) {
          labels.push({
            month:
              year !== lastYear
                ? `${format(day, "MMM")} '${format(day, "yy")}`
                : format(day, "MMM"),
            index: weeksData.length,
          });
          lastMonth = month;
          lastYear = year;
        }
      }
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length) weeksData.push(currentWeek);
    return {
      weeks: weeksData,
      monthLabels: labels,
      totalSessions: workouts.length,
      volumeByDay: volumeMap,
      maxVolume: Math.max(...volumeMap.values(), 0),
    };
  }, [workouts]);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-2xl tracking-tight">GYM CONSISTENCY</h3>
          <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Your logged training over the past year
          </p>
        </div>
        <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-2 text-right">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Current streak
          </p>
          <p className="font-display text-2xl text-brand">
            {streak} day{streak === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          <div className="relative mb-2 ml-9 flex h-3 font-mono text-[9px] text-muted-foreground">
            {monthLabels.map((label) => (
              <span
                key={`${label.month}-${label.index}`}
                className="absolute"
                style={{ left: `${label.index * 14}px` }}
              >
                {label.month}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <div className="flex w-8 flex-col gap-1 pr-2 text-[9px] font-mono text-muted-foreground">
              <span className="flex h-2.5 items-center" />
              <span className="flex h-2.5 items-center">Mon</span>
              <span className="flex h-2.5 items-center" />
              <span className="flex h-2.5 items-center">Wed</span>
              <span className="flex h-2.5 items-center" />
              <span className="flex h-2.5 items-center">Fri</span>
              <span className="flex h-2.5 items-center" />
            </div>
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const volume = volumeByDay.get(key) ?? 0;
                    const ratio = maxVolume ? volume / maxVolume : 0;
                    const color = !volume
                      ? "bg-elevated"
                      : ratio > 0.72
                        ? "bg-brand"
                        : ratio > 0.35
                          ? "bg-brand/65"
                          : "bg-brand/30";
                    return (
                      <div
                        key={key}
                        className={`size-2.5 rounded-sm transition-colors hover:ring-1 hover:ring-white/30 ${color}`}
                        title={`${format(day, "MMM d, yyyy")}${volume ? ` · ${Math.round(volume).toLocaleString()} kg volume` : " · Rest day"}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <span>
          {totalSessions} total session{totalSessions === 1 ? "" : "s"}
        </span>
        <span>Hover a day for volume</span>
      </div>
    </section>
  );
}
