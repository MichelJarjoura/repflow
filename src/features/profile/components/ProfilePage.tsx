import avatar from "@/assets/avatar-1.jpg";
import { WorkoutStats } from "@/features/workouts/components/WorkoutStats";
import { PRPost } from "@/features/feed/components/posts/views/PRPost";
import { WorkoutPost } from "@/features/feed/components/posts/views/WorkoutPost";
import { RunPost } from "@/features/feed/components/posts/views/RunPost";
import avatar1 from "@/assets/avatar-1.jpg";

const prs = [
  { lift: "Bench Press", value: 125 },
  { lift: "Back Squat", value: 160 },
  { lift: "Deadlift", value: 210 },
  { lift: "Overhead Press", value: 72.5 },
  { lift: "Front Squat", value: 130 },
  { lift: "Power Clean", value: 95 },
];

export function ProfilePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8 space-y-12">
      {/* Identity header */}
      <header className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-border">
          <img
            src={avatar}
            alt="Marcus Thorne"
            width={120}
            height={120}
            className="size-28 rounded-full object-cover outline outline-brand/40"
          />
          <div className="flex-1">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Tier 03 Athlete · Berlin, DE
            </p>
            <h1 className="font-display text-5xl md:text-6xl tracking-tighter">MARCUS THORNE</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Powerbuilding. 4× per week. PPL split. Slow progress, no excuses.
            </p>
          </div>
          <button
            type="button"
            className="bg-brand text-brand-foreground px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-95 transition-all shadow-[0_0_20px_-5px_rgba(223,255,0,0.4)]"
          >
            Follow
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          <Metric label="SBD Total" value="495" unit="KG" />
          <Metric label="Streak" value="12" unit="DAYS" highlight />
          <Metric label="Vol / Wk" value="42.5" unit="TONS" />
          <Metric label="Sessions" value="183" unit="ALL-TIME" />
        </div>
      </header>

      {/* Stats Section */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl tracking-tight">GYM PERFORMANCE</h2>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Data Verified
          </span>
        </div>

        <WorkoutStats />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
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

      {/* Shared Posts Section */}
      <section className="space-y-8">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <h2 className="font-display text-3xl tracking-tight">SHARED POSTS</h2>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Activity Feed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <PRPost
              avatar={avatar1}
              name="Marcus Thorne"
              meta="2 hours ago"
              lift="Overhead Press"
              value="140 KG"
            />

            <WorkoutPost
              avatar={avatar1}
              name="Marcus Thorne"
              meta="Yesterday • Heavy Pull"
              volume="11,240 KG"
              duration="1H 28M"
              exercises={[
                { name: "Deadlift", detail: "5 × 3 @ 180kg" },
                { name: "Pendlay Row", detail: "4 × 8 @ 90kg" },
                { name: "Weighted Pull-ups", detail: "4 × 6 @ BW+25" },
                { name: "Hammer Curls", detail: "3 × 12 @ 18kg" },
              ]}
            />
          </div>

          <div className="space-y-8">
            <RunPost
              avatar={avatar1}
              name="Marcus Thorne"
              meta="3 days ago • Morning Recovery"
              distance="8.2 KM"
              pace="4:58 /KM"
            />

            <WorkoutPost
              avatar={avatar1}
              name="Marcus Thorne"
              meta="5 days ago • Leg Day"
              volume="14,800 KG"
              duration="1H 42M"
              exercises={[
                { name: "Back Squat", detail: "4 × 8 @ 140kg" },
                { name: "Leg Press", detail: "3 × 12 @ 280kg" },
                { name: "RDL", detail: "3 × 10 @ 100kg" },
                { name: "Calf Raises", detail: "4 × 15 @ 120kg" },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
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
