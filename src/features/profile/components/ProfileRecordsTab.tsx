import { Trophy, Dumbbell, Timer, Flame } from "lucide-react";

interface RecordEntry {
  lift: string;
  value: string | number;
  unit: string;
  date: string;
  rank: string;
  trend: string;
}

const records: Record<string, RecordEntry[]> = {
  strength: [
    {
      lift: "Bench Press",
      value: 125,
      unit: "KG",
      date: "2 weeks ago",
      rank: "Top 5%",
      trend: "+2.5",
    },
    {
      lift: "Back Squat",
      value: 160,
      unit: "KG",
      date: "1 month ago",
      rank: "Top 12%",
      trend: "+5",
    },
    { lift: "Deadlift", value: 210, unit: "KG", date: "3 days ago", rank: "Top 2%", trend: "+10" },
  ],
  olympic: [
    {
      lift: "Power Clean",
      value: 95,
      unit: "KG",
      date: "1 week ago",
      rank: "Top 20%",
      trend: "+0",
    },
    { lift: "Snatch", value: 70, unit: "KG", date: "2 months ago", rank: "Top 25%", trend: "+2.5" },
  ],
  endurance: [
    {
      lift: "5KM Run",
      value: "21:45",
      unit: "MIN",
      date: "1 month ago",
      rank: "Top 15%",
      trend: "-0:30",
    },
    {
      lift: "10KM Run",
      value: "46:12",
      unit: "MIN",
      date: "2 weeks ago",
      rank: "Top 18%",
      trend: "-1:15",
    },
  ],
};

export function ProfileRecordsTab() {
  return (
    <div className="space-y-12">
      <RecordSection
        title="Strength (Powerlifting)"
        icon={<Dumbbell size={18} className="text-brand" />}
        data={records.strength}
      />
      <RecordSection
        title="Olympic Weightlifting"
        icon={<Flame size={18} className="text-brand" />}
        data={records.olympic}
      />
      <RecordSection
        title="Endurance & Cardio"
        icon={<Timer size={18} className="text-brand" />}
        data={records.endurance}
      />
    </div>
  );
}

function RecordSection({
  title,
  icon,
  data,
}: {
  title: string;
  icon: React.ReactNode;
  data: RecordEntry[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        {icon}
        <h3 className="font-display text-xl tracking-tight uppercase italic">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((record) => (
          <RecordCard key={record.lift} {...record} />
        ))}
      </div>
    </div>
  );
}

function RecordCard({ lift, value, unit, date, rank, trend }: RecordEntry) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-brand/50 hover:shadow-lg hover:shadow-brand/5">
      <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
        <Trophy size={48} className="text-brand" />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {lift}
          </p>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
              {rank}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="font-display text-4xl tracking-tighter">{value}</p>
          <span className="font-mono text-sm text-muted-foreground">{unit}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4 font-mono text-[10px] uppercase tracking-tighter">
          <span className="text-muted-foreground">{date}</span>
          <div className="flex items-center gap-1">
            <span
              className={
                trend.startsWith("+") || trend.startsWith("-")
                  ? "text-brand"
                  : "text-muted-foreground"
              }
            >
              {trend}
            </span>
            <span className="text-muted-foreground/50">Trend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
