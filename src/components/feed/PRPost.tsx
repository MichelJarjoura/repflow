import { PostHeader } from "./PostHeader";

type Props = {
  avatar: string;
  name: string;
  meta: string;
  lift: string;
  value: string;
};

export function PRPost({ avatar, name, meta, lift, value }: Props) {
  return (
    <article className="bg-card border border-brand/30 rounded-xl overflow-hidden shadow-[0_0_40px_-15px_rgba(223,255,0,0.15)]">
      <PostHeader avatar={avatar} name={name} meta={meta} badge="New PR" />
      <div className="p-6 text-center bg-gradient-to-b from-brand/5 to-transparent">
        <h3 className="text-5xl font-display tracking-tighter mb-2 italic underline decoration-brand/50 decoration-4">
          {value}
        </h3>
        <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px]">
          {lift}
        </p>
      </div>
      <div className="p-4 flex gap-2 border-t border-border">
        <ReactionButton label="Respect" />
        <ReactionButton label="Spot" />
      </div>
    </article>
  );
}

function ReactionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex-1 bg-elevated hover:bg-elevated/70 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
    >
      {label}
    </button>
  );
}