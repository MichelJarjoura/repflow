import { createFileRoute } from "@tanstack/react-router";
import { AppNav, FloatingLogButton } from "@/components/AppNav";
import { RunPost } from "@/components/feed/RunPost";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";

export const Route = createFileRoute("/runs")({
  head: () => ({
    meta: [
      { title: "IRONGRAPH — Runs" },
      { name: "description", content: "Recent runs with route, distance, and pace. Lifestyle, not leaderboard." },
      { property: "og:title", content: "IRONGRAPH — Runs" },
      { property: "og:description", content: "Recent runs with route, distance, and pace." },
    ],
  }),
  component: RunsPage,
});

function RunsPage() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <AppNav />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        <header className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <h1 className="font-display text-5xl tracking-tighter">RUNS</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Lightweight GPS tracking. No segments. No rankings.
            </p>
          </div>
          <button
            type="button"
            className="bg-brand text-brand-foreground px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-95"
          >
            Start Run
          </button>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="This Week" value="22.4" unit="KM" />
          <Stat label="Avg Pace" value="5:08" unit="/KM" />
          <Stat label="Runs" value="04" unit="SESSIONS" />
          <Stat label="Streak" value="03" unit="WEEKS" highlight />
        </section>

        <section className="space-y-6">
          <RunPost
            avatar={avatar1}
            name="Marcus Thorne"
            meta="Today • Easy Recovery"
            distance="5.0 KM"
            pace="5:22 /KM"
          />
          <RunPost
            avatar={avatar3}
            name="David Vane"
            meta="Yesterday • Morning Tempo"
            distance="8.2 KM"
            pace="4:48 /KM"
          />
          <RunPost
            avatar={avatar2}
            name="Sarah Jenkins"
            meta="Sun • Long Slow"
            distance="12.4 KM"
            pace="5:35 /KM"
          />
        </section>
      </main>
      <FloatingLogButton />
    </div>
  );
}

function Stat({
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
    <div className="bg-card border border-border rounded-xl p-5">
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