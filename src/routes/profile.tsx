import { createFileRoute } from "@tanstack/react-router";
import { AppNav, FloatingLogButton } from "@/components/AppNav";
import avatar from "@/assets/avatar-1.jpg";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "IRONGRAPH — Profile" },
      { name: "description", content: "Your strength identity: PRs, weekly volume, streaks." },
      { property: "og:title", content: "IRONGRAPH — Profile" },
      { property: "og:description", content: "Your strength identity." },
    ],
  }),
  component: ProfilePage,
});

const prs = [
  { lift: "Bench Press", value: 125 },
  { lift: "Back Squat", value: 160 },
  { lift: "Deadlift", value: 210 },
  { lift: "Overhead Press", value: 72.5 },
  { lift: "Front Squat", value: 130 },
  { lift: "Power Clean", value: 95 },
];

const recent = [
  { date: "Today", title: "Heavy Push", volume: "9.2T", duration: "1H 04M" },
  { date: "Yesterday", title: "Heavy Pull", volume: "11.2T", duration: "1H 28M" },
  { date: "Mon", title: "Legs", volume: "12.8T", duration: "1H 32M" },
  { date: "Sun", title: "Recovery 6K", volume: "—", duration: "31:14" },
  { date: "Fri", title: "Push Accessory", volume: "5.4T", duration: "0H 52M" },
];

function ProfilePage() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <AppNav />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* Identity header */}
        <header className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-border">
            <img
              src={avatar}
              alt="Marcus Thorne"
              width={120}
              height={120}
              className="size-28 rounded-full object-cover outline outline-2 outline-brand/40"
            />
            <div className="flex-1">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
                Tier 03 Athlete · Berlin, DE
              </p>
              <h1 className="font-display text-5xl md:text-6xl tracking-tighter">
                MARCUS THORNE
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                Powerbuilding. 4× per week. PPL split. Slow progress, no excuses.
              </p>
            </div>
            <button
              type="button"
              className="bg-brand text-brand-foreground px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-95 transition-all"
            >
              Follow
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-t border-border">
            <Metric label="SBD Total" value="495" unit="KG" />
            <Metric label="Streak" value="12" unit="DAYS" highlight />
            <Metric label="Vol / Wk" value="42.5" unit="TONS" />
            <Metric label="Sessions" value="183" unit="ALL-TIME" />
          </div>
        </header>

        {/* PR grid */}
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl tracking-tight">PERSONAL RECORDS</h2>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              ALL-TIME BESTS
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {prs.map((p) => (
              <div
                key={p.lift}
                className="bg-card border border-border rounded-xl p-6 hover:border-brand/30 transition-colors"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                  {p.lift}
                </p>
                <p className="font-display text-4xl tracking-tighter">
                  {p.value}
                  <span className="text-base text-muted-foreground ml-1">KG</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Volume sparkline */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl tracking-tight">WEEKLY VOLUME</h2>
            <span className="text-[10px] font-mono text-brand uppercase tracking-widest">
              +8.3% MoM
            </span>
          </div>
          <div className="h-32 flex items-end gap-2">
            {[38, 42, 35, 51, 44, 48, 56, 52, 49, 61, 58, 65].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-sm ${
                    i === 11 ? "bg-brand" : "bg-elevated"
                  }`}
                  style={{ height: `${h * 1.5}%` }}
                />
                <span className="text-[9px] font-mono text-muted-foreground">
                  W{i + 1}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent sessions */}
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl tracking-tight">RECENT SESSIONS</h2>
          </div>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {recent.map((r) => (
              <div
                key={r.date + r.title}
                className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-elevated/30 transition-colors cursor-pointer"
              >
                <span className="col-span-2 text-[10px] font-mono uppercase text-muted-foreground tracking-widest">
                  {r.date}
                </span>
                <span className="col-span-5 italic">{r.title}</span>
                <span className="col-span-3 font-mono text-sm text-muted-foreground">
                  {r.volume}
                </span>
                <span className="col-span-2 font-mono text-sm text-right">
                  {r.duration}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <FloatingLogButton />
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-6 text-center">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </p>
      <p
        className={`font-display text-3xl tracking-tighter ${
          highlight ? "text-brand" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
        {unit}
      </p>
    </div>
  );
}