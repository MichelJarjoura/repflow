type Props = {
  avatar: string;
  name: string;
  meta: string;
  badge?: string;
  bordered?: boolean;
};

export function PostHeader({ avatar, name, meta, badge, bordered = true }: Props) {
  return (
    <div
      className={`p-4 flex items-center justify-between ${
        bordered ? "border-b border-border" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-elevated overflow-hidden">
          <img
            src={avatar}
            alt={name}
            width={40}
            height={40}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">{meta}</p>
        </div>
      </div>
      {badge && (
        <span className="px-2 py-1 bg-brand text-brand-foreground text-[10px] font-bold uppercase tracking-wider rounded">
          {badge}
        </span>
      )}
    </div>
  );
}