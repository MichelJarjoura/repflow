import { useMemo } from "react";

export function ConsistencyCalendar() {
  // Generate mock data for the last 52 weeks
  const weeks = useMemo(() => {
    const data = [];
    for (let i = 0; i < 53; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        // Random intensity for mock purposes (0 to 4)
        const intensity = Math.floor(Math.random() * 5);
        week.push(intensity);
      }
      data.push(week);
    }
    return data;
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Less
            </span>
            <div className="flex gap-1">
              <div className="size-2.5 rounded-sm bg-elevated" />
              <div className="size-2.5 rounded-sm bg-brand/20" />
              <div className="size-2.5 rounded-sm bg-brand/50" />
              <div className="size-2.5 rounded-sm bg-brand/80" />
              <div className="size-2.5 rounded-sm bg-brand" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              More
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-1">
              {week.map((day, j) => (
                <div
                  key={j}
                  className={`size-2.5 rounded-sm transition-colors cursor-pointer hover:ring-1 hover:ring-white/20 ${getIntensityClass(day)}`}
                  title={`Level ${day}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <span>342 Total Sessions</span>
        <span>Current Streak: 12 Days</span>
      </div>
    </div>
  );
}

function getIntensityClass(level: number) {
  switch (level) {
    case 0:
      return "bg-elevated";
    case 1:
      return "bg-brand/20";
    case 2:
      return "bg-brand/50";
    case 3:
      return "bg-brand/80";
    case 4:
      return "bg-brand";
    default:
      return "bg-elevated";
  }
}
