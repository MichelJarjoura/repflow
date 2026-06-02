import { PostHeader } from "../post-components/PostHeader";
import PostFooter from "../post-components/PostFooter";

type Exercise = {
  name: string;
  detail: string;
};

type Props = {
  avatar: string;
  name: string;
  meta: string;
  volume: string;
  duration: string;
  exercises: Exercise[];
};

export function WorkoutPost({ avatar, name, meta, volume, duration, exercises }: Props) {
  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden">
      <PostHeader avatar={avatar} name={name} meta={meta} />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface/60 p-4 rounded-lg">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">
              Volume
            </p>

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
      <PostFooter/>
    </article>
  );
}
