const filters = ["All", "PRs", "Workouts", "Runs", "Following"] as const;

export function FeedFilter() {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
      <div className="flex gap-1 flex-wrap">
        {filters.map((f, i) => (
          <button
            key={f}
            type="button"
            className={
              i === 0
                ? "px-3 py-1.5 rounded-full bg-brand text-brand-foreground text-[11px] font-bold uppercase tracking-widest"
                : "px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground text-[11px] font-bold uppercase tracking-widest transition-colors"
            }
          >
            {f}
          </button>
        ))}
      </div>
      <span className="hidden md:inline text-[10px] font-mono text-muted-foreground">
        SORT // PROGRESS
      </span>
    </div>
  );
}