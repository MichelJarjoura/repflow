import { createFileRoute } from "@tanstack/react-router";
import { AppNav, FloatingLogButton } from "@/components/AppNav";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "IRONGRAPH — Workouts" },
      { name: "description", content: "Browse training splits and templates to copy into your program." },
      { property: "og:title", content: "IRONGRAPH — Workouts" },
      { property: "og:description", content: "Browse training splits and templates." },
    ],
  }),
  component: WorkoutsPage,
});

const templates = [
  {
    name: "PPL — 6 Day Split",
    author: "Marcus Thorne",
    sessions: 6,
    copies: "2.4K",
    tag: "Hypertrophy",
  },
  {
    name: "5/3/1 Forever",
    author: "Jim W.",
    sessions: 4,
    copies: "1.8K",
    tag: "Strength",
  },
  {
    name: "Upper / Lower",
    author: "Sarah Jenkins",
    sessions: 4,
    copies: "980",
    tag: "Hybrid",
  },
  {
    name: "Powerbuilding 4d",
    author: "Leo Park",
    sessions: 4,
    copies: "612",
    tag: "Powerbuilding",
  },
  {
    name: "GZCLP",
    author: "Cody L.",
    sessions: 4,
    copies: "540",
    tag: "Linear",
  },
  {
    name: "Bro Split Classic",
    author: "Alex M.",
    sessions: 5,
    copies: "488",
    tag: "Hypertrophy",
  },
];

function WorkoutsPage() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <AppNav />
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        <header className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <h1 className="font-display text-5xl tracking-tighter">WORKOUTS</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Public training templates. Copy any program into your library.
            </p>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {templates.length} TEMPLATES
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t) => (
            <article
              key={t.name}
              className="bg-card border border-border rounded-xl p-6 group hover:border-brand/40 transition-colors flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-brand uppercase tracking-widest">
                  {t.tag}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {t.sessions}d / WK
                </span>
              </div>
              <h2 className="font-display text-2xl tracking-tight leading-none">
                {t.name}
              </h2>
              <p className="text-xs text-muted-foreground">by {t.author}</p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {t.copies} copies
                </span>
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-widest text-brand group-hover:underline"
                >
                  Copy →
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <FloatingLogButton />
    </div>
  );
}