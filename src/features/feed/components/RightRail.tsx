export function RightRail() {
  return (
    <aside className="space-y-6">
      <div className="bg-brand/10 border border-brand/20 rounded-xl p-5">
        <h2 className="font-display text-xs tracking-[0.2em] text-brand mb-4 uppercase">
          Weekly Challenge
        </h2>
        <p className="text-lg font-display mb-1 tracking-tight italic">THE 50-TON CLUB</p>
        <p className="text-xs text-muted-foreground mb-4">
          Lift 50,000kg cumulative volume this week.
        </p>
        <div className="w-full bg-elevated h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand h-full w-[65%]" />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>32.5T</span>
          <span>50.0T</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4 uppercase">
          Live Spotters
        </h2>
        <div className="space-y-4">
          <LiveItem text="Alex is training Heavy Back" />
          <LiveItem text="Leo is running 5k" />
          <LiveItem text="Mia hit a PR on squats" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4 uppercase">
          Suggested Templates
        </h2>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between items-center">
            <span className="italic">PPL — 6 day split</span>
            <span className="text-[10px] font-mono text-muted-foreground">2.4K</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="italic">5/3/1 Forever</span>
            <span className="text-[10px] font-mono text-muted-foreground">1.8K</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="italic">Upper / Lower</span>
            <span className="text-[10px] font-mono text-muted-foreground">980</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

function LiveItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-2 bg-brand rounded-full animate-pulse" />
      <span className="text-xs text-foreground/80">{text}</span>
    </div>
  );
}
