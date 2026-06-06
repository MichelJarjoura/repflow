import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Dumbbell,
  Activity,
  User,
  PlusSquare,
  Search,
  Bell,
  MoreHorizontal,
} from "lucide-react";
import avatar from "@/assets/avatar-1.jpg";
import { LogWorkoutModal } from "./LogWorkoutModal";

const links = [
  { to: "/feed", label: "Feed", icon: Home },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/runs", label: "Runs", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar (Logo Only) */}
      <div className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-14 flex items-center px-4">
        <Link to="/" className="font-display text-xl tracking-tighter text-brand">
          REP<span className="text-white">FLOW</span>
        </Link>
      </div>

      {/* Sidebar (Desktop) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-20 xl:w-64 border-r border-border bg-background p-4 z-50">
        <div className="mb-8 px-2 xl:px-4">
          <Link to="/" className="font-display text-2xl tracking-tighter text-brand">
            REP<span className="text-white xl:inline hidden">FLOW</span>
            <span className="text-white xl:hidden">F</span>
          </Link>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {links.map((l) => {
            const active = pathname === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-4 p-3 rounded-full transition-colors ${
                  active
                    ? "font-bold text-foreground"
                    : "text-stone-400 hover:bg-elevated hover:text-foreground"
                }`}
              >
                <Icon size={26} strokeWidth={active ? 2.5 : 2} />
                <span className="text-lg xl:inline hidden">{l.label}</span>
              </Link>
            );
          })}

          <button className="flex items-center gap-4 p-3 rounded-full text-stone-400 hover:bg-elevated hover:text-foreground transition-colors mt-2">
            <Search size={26} />
            <span className="text-lg xl:inline hidden">Search</span>
          </button>

          <button className="flex items-center gap-4 p-3 rounded-full text-stone-400 hover:bg-elevated hover:text-foreground transition-colors">
            <Bell size={26} />
            <span className="text-lg xl:inline hidden">Notifications</span>
          </button>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="mt-4 bg-brand text-brand-foreground rounded-full p-3 xl:px-8 xl:py-4 flex items-center justify-center font-bold text-lg hover:opacity-90 transition-opacity w-full"
          >
            <PlusSquare className="xl:hidden" size={26} />
            <span className="xl:inline hidden">Log Workout</span>
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50">
          <button className="flex items-center gap-3 p-3 w-full rounded-full hover:bg-elevated transition-colors">
            <div className="size-10 rounded-full bg-elevated outline outline-white/10 overflow-hidden shrink-0">
              <img src={avatar} alt="Your profile" className="w-full h-full object-cover" />
            </div>
            <div className="hidden xl:flex flex-col items-start text-sm overflow-hidden">
              <span className="font-bold text-foreground truncate w-full text-left">
                Alex Rivera
              </span>
              <span className="text-stone-500 truncate w-full text-left">@arivera_lifts</span>
            </div>
            <MoreHorizontal size={20} className="hidden xl:block ml-auto text-stone-500" />
          </button>
        </div>
      </nav>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 z-50">
        {links.map((l) => {
          const active = pathname === l.to;
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex flex-col items-center justify-center w-full h-full ${
                active ? "text-brand" : "text-stone-500"
              }`}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            </Link>
          );
        })}
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full text-stone-500"
        >
          <PlusSquare size={24} />
        </button>
      </nav>

      <LogWorkoutModal open={isLogModalOpen} onOpenChange={setIsLogModalOpen} />
    </>
  );
}

