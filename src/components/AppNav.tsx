import { Link, useRouterState } from "@tanstack/react-router";
import avatar from "@/assets/avatar-1.jpg";

const links = [
  { to: "/feed", label: "FEED" },
  { to: "/workouts", label: "WORKOUTS" },
  { to: "/runs", label: "RUNS" },
  { to: "/profile", label: "PROFILE" },
] as const;

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-2xl tracking-tighter text-brand">
            REP<span style={{color: "white"}}>FLOW</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide text-stone-400">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    active
                      ? "text-brand"
                      : "hover:text-foreground transition-colors"
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="size-8 rounded-full bg-elevated outline outline-1 outline-white/10 overflow-hidden">
            <img
              src={avatar}
              alt="Your profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function FloatingLogButton() {
  return (
    <button
      type="button"
      aria-label="Log a workout"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 size-14 rounded-full bg-brand text-brand-foreground flex items-center justify-center shadow-2xl shadow-brand/20 hover:scale-105 active:scale-95 transition-transform z-40"
    >
      <span className="font-bold text-2xl leading-none">+</span>
    </button>
  );
}