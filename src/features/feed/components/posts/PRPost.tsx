import { Heart, MessageCircle, Send } from "lucide-react";
import { PostHeader } from "../PostHeader";
import { IconButton, LikeButton } from "../IconButton";

type Props = {
  avatar: string;
  name: string;
  meta: string;
  lift: string;
  value: string;
  likes: number;
};

export function PRPost({ avatar, name, meta, lift, value, likes }: Props) {
  return (
    <article className="bg-card border border-brand/30 rounded-xl overflow-hidden shadow-[0_0_40px_-15px_rgba(223,255,0,0.15)]">
      <PostHeader avatar={avatar} name={name} meta={meta} badge="New PR" />
      <div className="p-6 text-center bg-linear-to-b from-brand/5 to-transparent">
        <h3 className="text-5xl font-display tracking-tighter mb-2 italic underline decoration-brand/50 decoration-4">
          {value}
        </h3>
        <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px]">{lift}</p>
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
