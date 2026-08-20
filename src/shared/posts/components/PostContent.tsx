type WorkoutContentProps = {
  volume?: string;
  duration?: string;
  exercises: { name: string; detail: string }[];
  lift?: string;
  value?: string;
};

export function WorkoutPostContent({ volume, duration, exercises }: WorkoutContentProps) {
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface/60 p-4 rounded-lg">
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Volume</p>

          <p className="text-xl font-display">{volume}</p>
        </div>

        <div className="bg-surface/60 p-4 rounded-lg">
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">
            Duration
          </p>

          <p className="text-xl font-display">{duration}</p>
        </div>
      </div>

      <div className="space-y-2">
        {exercises.map((ex, i) => (
          <div
            key={ex.name}
            className={`flex justify-between text-sm py-2 ${
              i < exercises.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <span className="text-foreground/80 italic">{ex.name}</span>

            <span className="text-muted-foreground font-mono">{ex.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type PRContentProps = {
  lift: string;
  value: string;
};

export function PRPostContent({ lift, value }: PRContentProps) {
  return (
    <div className="p-6 text-center bg-linear-to-b from-brand/5 to-transparent">
      <h3 className="text-5xl font-display tracking-tighter mb-2 italic underline decoration-brand/50 decoration-4">
        {value}
      </h3>
      <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px]">{lift}</p>
    </div>
  );
}
