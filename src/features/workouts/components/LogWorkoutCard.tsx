import { Plus, Play, History } from "lucide-react";

export function LogWorkoutCard() {
  return (
    <div className="bg-card border border-brand/30 rounded-xl overflow-hidden shadow-[0_0_40px_-15px_rgba(223,255,0,0.1)]">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="font-display text-2xl tracking-tight mb-1">LOG WORKOUT</h2>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Select a template or start from scratch
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-brand/5 border border-brand/20 rounded-xl hover:bg-brand/10 transition-colors group">
            <div className="size-12 rounded-full bg-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
              <Play fill="currentColor" size={24} />
            </div>
            <span className="font-display text-lg tracking-tight">EMPTY WORKOUT</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-surface/40 border border-border rounded-xl hover:bg-surface/60 transition-colors group">
            <div className="size-12 rounded-full bg-elevated flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
              <History size={24} />
            </div>
            <span className="font-display text-lg tracking-tight">USE TEMPLATE</span>
          </button>
        </div>
      </div>

      <div className="bg-surface/40 px-6 py-3 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <span>Quick Actions</span>
        <button className="text-brand hover:underline font-bold">Manage Templates →</button>
      </div>
    </div>
  );
}
