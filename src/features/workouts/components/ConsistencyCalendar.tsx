import { useMemo } from "react";
import {
  subWeeks,
  startOfWeek,
  addDays,
  format,
  isSameMonth,
  eachDayOfInterval,
  startOfToday,
  subYears,
} from "date-fns";

// Sample logged days (yyyy-MM-dd format)
const loggedDays = new Set<string>([
  format(startOfToday(), "yyyy-MM-dd"),
  format(addDays(startOfToday(), -1), "yyyy-MM-dd"),
  format(addDays(startOfToday(), -2), "yyyy-MM-dd"),
  format(addDays(startOfToday(), -3), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 5), 5), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 4), 2), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 6), 3), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 7), 4), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 9), 1), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 10), 4), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 11), 5), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 10), 6), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 12), 2), "yyyy-MM-dd"),
  format(addDays(subWeeks(startOfToday(), 11), 3), "yyyy-MM-dd"),
]);

export function ConsistencyCalendar() {
  const { weeks, monthLabels, totalSessions } = useMemo(() => {
    const today = startOfToday();
    const startDate = startOfWeek(subWeeks(today, 52));
    const endDate = today;

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weeksData = [];
    let currentWeek: { day: Date; intensity: number }[] = [];
    let total = 0;

    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;
    let lastYear = -1;

    days.forEach((day) => {
      const intensity = Math.floor(Math.random() * 5);
      if (intensity > 0) total++;

      if (currentWeek.length === 0) {
        const month = day.getMonth();
        const year = day.getFullYear();
        if (month !== lastMonth) {
          const label =
            year !== lastYear ? `${format(day, "MMM")} '${format(day, "yy")}` : format(day, "MMM");
          labels.push({ month: label, index: weeksData.length });
          lastMonth = month;
          lastYear = year;
        }
      }
      currentWeek.push({ day, intensity });

      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeksData.push(currentWeek);
    }

    return { weeks: weeksData, monthLabels: labels, totalSessions: total };
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display text-lg tracking-tight">GYM CONSISTENCY</h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Training frequency over the past year
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          {/* Month Labels */}
          <div className="relative mb-2 flex h-3 ml-9 font-mono text-[9px] text-muted-foreground">
            {monthLabels.map((label, i) => (
              <span key={i} className="absolute" style={{ left: `${label.index * 14}px` }}>
                {label.month}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 text-[9px] font-mono text-muted-foreground pr-2 w-8">
              <span className="h-2.5 flex items-center"></span>
              <span className="h-2.5 flex items-center">Mon</span>
              <span className="h-2.5 flex items-center"></span>
              <span className="h-2.5 flex items-center">Wed</span>
              <span className="h-2.5 flex items-center"></span>
              <span className="h-2.5 flex items-center">Fri</span>
              <span className="h-2.5 flex items-center"></span>
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-1">
                  {week.map((dayData, j) => (
                    <div
                      key={j}
                      className={`size-2.5 rounded-sm transition-colors cursor-pointer hover:ring-1 hover:ring-white/20 ${getColorOfDay(dayData.day)}`}
                      title={`${format(dayData.day, "MMM d, yyyy")}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <span>{loggedDays.size} Total Sessions</span>
        <span>Current Streak: 12 Days</span>
      </div>
    </div>
  );
}

function getColorOfDay(day: Date) {
  const dateKey = format(day, "yyyy-MM-dd");
  if (loggedDays.has(dateKey)) {
    return "bg-primary";
  }
  return "bg-elevated";
}
