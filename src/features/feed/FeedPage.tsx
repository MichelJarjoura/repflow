import { IdentityCard } from "./components/IdentityCard";
import { PRPost } from "../../shared/posts/views/PRPost";
import { WorkoutPost } from "../../shared/posts/views/WorkoutPost";
import { RunPost } from "../../shared/posts/views/RunPost";
import { RightRail } from "./components/RightRail";
import { FeedFilter } from "./components/FeedFilter";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import { useAuth } from "@/core/auth/AuthContext";
import { AuthModal } from "@/core/auth/components/AuthModal";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export function FeedPage() {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8 space-y-6">
        <div className="hidden lg:block">
          <h1 className="font-display text-4xl tracking-tight mb-1">FEED</h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Progress &middot; Not Entertainment
          </p>
        </div>

        {!isAuthenticated && (
          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-brand/20 flex items-center justify-center text-brand shrink-0">
                <PlusCircle size={28} />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tight text-foreground uppercase">Share your progress</h3>
                <p className="text-muted-foreground text-sm">Join the community to log your own workouts and PRs.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-brand text-brand-foreground font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        )}

        <FeedFilter />

        <PRPost
          avatar={avatar1}
          name="Marcus Thorne"
          meta="2 hours ago"
          lift="Overhead Press"
          value="140 KG"
        />

        <WorkoutPost
          avatar={avatar2}
          name="Sarah Jenkins"
          meta="4 hours ago • Late Night Push"
          volume="8,420 KG"
          duration="1H 12M"
          exercises={[
            { name: "Incline DB Bench", detail: "3 × 10 @ 32kg" },
            { name: "Weighted Dips", detail: "4 × 12 @ BW+15" },
            { name: "Lateral Raises", detail: "3 × 15 @ 12kg" },
          ]}
        />

        <RunPost
          avatar={avatar3}
          name="David Vane"
          meta="6 hours ago • Morning Recovery"
          distance="6.4 KM"
          pace="5:12 /KM"
        />

        <PRPost
          avatar={avatar2}
          name="Sarah Jenkins"
          meta="Yesterday"
          lift="Conventional Deadlift"
          value="172.5 KG"
        />

        <WorkoutPost
          avatar={avatar1}
          name="Marcus Thorne"
          meta="Yesterday • Heavy Pull"
          volume="11,240 KG"
          duration="1H 28M"
          exercises={[
            { name: "Deadlift", detail: "5 × 3 @ 180kg" },
            { name: "Pendlay Row", detail: "4 × 8 @ 90kg" },
            { name: "Weighted Pull-ups", detail: "4 × 6 @ BW+25" },
            { name: "Hammer Curls", detail: "3 × 12 @ 18kg" },
          ]}
        />
      </section>

      <div className="lg:col-span-4 hidden lg:block">
        <div className="sticky top-8 space-y-6">
          <IdentityCard />
          <RightRail />
        </div>
      </div>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultView="signup" />
    </div>
  );
}
