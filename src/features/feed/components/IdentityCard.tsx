export function IdentityCard() {
  const lifts = [
    { label: "Bench Press", value: 125 },
    { label: "Back Squat", value: 160 },
    { label: "Deadlift", value: 210 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-6">
        <h2 className="font-display text-xs tracking-[0.2em] text-muted-foreground mb-4">
          IDENTITY
        </h2>
        <div className="space-y-4">
          {lifts.map((l) => (
            <div key={l.label}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {l.label}
              </p>
              <p className="text-2xl font-display text-foreground">
                {l.value}
                <span className="text-sm text-muted-foreground ml-1">KG</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Streak
            </p>
            <p className="text-xl font-display text-brand">12 DAYS</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Vol/Wk
            </p>
            <p className="text-xl font-display text-foreground">42.5T</p>
          </div>
        </div>
      </div>
    </div>
  );
}