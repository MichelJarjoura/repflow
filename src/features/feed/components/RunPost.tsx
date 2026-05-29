import { PostHeader } from "./PostHeader";
import routeImg from "@/assets/run-route.jpg";

type Props = {
  avatar: string;
  name: string;
  meta: string;
  distance: string;
  pace: string;
};

export function RunPost({ avatar, name, meta, distance, pace }: Props) {
  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden">
      <PostHeader avatar={avatar} name={name} meta={meta} bordered={false} />
      <div className="relative aspect-[16/9] bg-elevated">
        <img
          src={routeImg}
          alt={`Run route — ${distance}`}
          width={1280}
          height={720}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 flex gap-4">
          <Stat label="Distance" value={distance} />
          <Stat label="Pace" value={pace} />
        </div>
      </div>
      <div className="p-4 flex gap-2">
        <button
          type="button"
          className="flex-1 bg-elevated hover:bg-elevated/70 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
        >
          💪 Respect
        </button>
        <button
          type="button"
          className="flex-1 bg-elevated hover:bg-elevated/70 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Share Card
        </button>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface/90 backdrop-blur px-3 py-2 rounded border border-white/10">
      <p className="text-[8px] text-muted-foreground uppercase">{label}</p>
      <p className="font-display text-lg">{value}</p>
    </div>
  );
}