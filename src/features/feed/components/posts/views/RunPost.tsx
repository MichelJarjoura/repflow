import { PostHeader } from "../post-components/PostHeader";
import routeImg from "@/assets/run-route.jpg";
import PostFooter from "../post-components/PostFooter";

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
      <div className="relative aspect-video bg-elevated">
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
      <PostFooter/>
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
