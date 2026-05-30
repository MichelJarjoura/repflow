import { MessageCircle, Send } from "lucide-react";
import { IconButton, LikeButton } from "../IconButton";
import { PostHeader } from "../PostHeader";
import routeImg from "@/assets/run-route.jpg";

type Props = {
  avatar: string;
  name: string;
  meta: string;
  distance: string;
  pace: string;
  likes: number;
};

export function RunPost({ avatar, name, meta, distance, pace, likes }: Props) {
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
      <div className="p-4 bg-surface/40 flex items-center gap-4">
        <LikeButton likes={likes} />

        <IconButton>
          <MessageCircle size={20} />
        </IconButton>

        <IconButton>
          <Send size={20} />
        </IconButton>
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
