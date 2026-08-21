import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Dumbbell,
  User,
  UsersRound,
  PlusSquare,
  Search,
  Bell,
  MoreHorizontal,
  LogIn,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import avatar from "@/assets/avatar-1.jpg";
import { useAuth } from "@/core/auth/useAuth";
import { AuthModal } from "@/core/auth/components/AuthModal";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const links = [
  { to: "/feed", label: "Feed", icon: Home, public: true },
  { to: "/workouts", label: "Workouts", icon: Dumbbell, public: false },
  { to: "/communities", label: "Communities", icon: UsersRound, public: true },
  { to: "/hub", label: "Athlete Hub", icon: LayoutDashboard, public: false },
  { to: "/profile", label: "Profile", icon: User, public: false },
] as const;

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Open sign-in when an authenticated-only action is selected.
  const handleLinkClick = (e: React.MouseEvent, to: string, isPublic: boolean) => {
    if (!isPublic && !isAuthenticated) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  const handleLogWorkout = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      void navigate({ to: "/workouts" });
    }
  };

  return (
    <>
      {/* Mobile Top Bar (Logo Only) */}
      <div className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-14 flex items-center justify-between px-4">
        <Link to="/" className="font-display text-xl tracking-tighter text-brand">
          REP<span className="text-white">FLOW</span>
        </Link>
        {!isAuthenticated && (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-xs font-bold bg-brand text-brand-foreground px-3 py-1.5 rounded-full"
          >
            SIGN IN
          </button>
        )}
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
                onClick={(e) => handleLinkClick(e, l.to, l.public)}
                className={`flex items-center gap-4 p-3 rounded-full transition-colors ${
                  active
                    ? "font-bold text-foreground"
                    : "text-muted-foreground hover:bg-elevated hover:text-foreground"
                }`}
              >
                <Icon size={26} strokeWidth={active ? 2.5 : 2} />
                <span className="text-lg xl:inline hidden">{l.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogWorkout}
            className="mt-4 bg-brand text-brand-foreground rounded-full p-3 xl:px-8 xl:py-4 flex items-center justify-center font-bold text-lg hover:opacity-90 transition-opacity w-full"
          >
            <PlusSquare className="xl:hidden" size={26} />
            <span className="xl:inline hidden">Log Workout</span>
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50">
          {isAuthenticated ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-3 p-3 w-full rounded-full hover:bg-elevated transition-colors outline-none group text-left">
                  <div className="size-10 rounded-full bg-elevated outline outline-white/10 overflow-hidden shrink-0">
                    <img
                      src={user?.avatar || avatar}
                      alt="Your profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden xl:flex flex-col items-start text-sm overflow-hidden">
                    <span className="font-bold text-foreground truncate w-full">{user?.name}</span>
                    <span className="text-muted-foreground truncate w-full">{user?.username}</span>
                  </div>
                  <MoreHorizontal
                    size={20}
                    className="hidden xl:block ml-auto text-muted-foreground group-hover:text-white"
                  />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-56 bg-elevated border border-border rounded-xl p-2 shadow-2xl z-100 animate-in fade-in zoom-in-95 duration-150"
                  side="top"
                  align="start"
                  sideOffset={10}
                >
                  <DropdownMenu.Item className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 outline-none cursor-pointer transition-colors text-muted-foreground hover:text-white">
                    <User size={18} />
                    <span className="font-medium">Profile</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 outline-none cursor-pointer transition-colors text-muted-foreground hover:text-white">
                    <Settings size={18} />
                    <span className="font-medium">Settings</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-border my-1" />
                  <DropdownMenu.Item
                    onClick={() => logout()}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 outline-none cursor-pointer transition-colors text-red-400 hover:text-red-500"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Log out {user?.username}</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-4 p-4 w-full rounded-full bg-elevated hover:bg-white/10 transition-all border border-white/5"
            >
              <LogIn size={24} className="text-brand shrink-0" />
              <div className="hidden xl:flex flex-col items-start text-sm">
                <span className="font-bold text-foreground">Sign In</span>
                <span className="text-muted-foreground">Join the community</span>
              </div>
            </button>
          )}
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
              onClick={(e) => handleLinkClick(e, l.to, l.public)}
              className={`flex flex-col items-center justify-center w-full h-full ${
                active ? "text-brand" : "text-muted-foreground"
              }`}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            </Link>
          );
        })}
        <button
          onClick={handleLogWorkout}
          className="flex flex-col items-center justify-center w-full h-full text-muted-foreground"
        >
          <PlusSquare size={24} />
        </button>
      </nav>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}
