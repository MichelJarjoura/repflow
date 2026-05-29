import { createFileRoute } from "@tanstack/react-router";
import { AppNav, FloatingLogButton } from "@/components/AppNav";
import { IdentityCard } from "@/components/feed/IdentityCard";
import { PRPost } from "@/components/feed/PRPost";
import { WorkoutPost } from "@/components/feed/WorkoutPost";
import { RunPost } from "@/components/feed/RunPost";
import { RightRail } from "@/components/feed/RightRail";
import { FeedFilter } from "@/components/feed/FeedFilter";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REPFLOW" },
      {
        name: "description",
        content: "The progress-first feed for lifters. PRs, workouts, runs from the athletes you follow.",
      },
      { property: "og:title", content: "REPFLOW" },
      {
        property: "og:description",
        content: "The progress-first feed for lifters. PRs, workouts, runs.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <AppNav />
      <main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24">
            <IdentityCard />
          </div>
        </div>

        <section className="lg:col-span-6 order-1 lg:order-2 space-y-6">
          <div className="hidden lg:block">
            <h1 className="font-display text-4xl tracking-tight mb-1">FEED</h1>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Progress &middot; Not Entertainment
            </p>
          </div>
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
            likes={24}
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
            likes={41}
            exercises={[
              { name: "Deadlift", detail: "5 × 3 @ 180kg" },
              { name: "Pendlay Row", detail: "4 × 8 @ 90kg" },
              { name: "Weighted Pull-ups", detail: "4 × 6 @ BW+25" },
              { name: "Hammer Curls", detail: "3 × 12 @ 18kg" },
            ]}
          />
        </section>

        <div className="lg:col-span-3 order-3">
          <div className="lg:sticky lg:top-24">
            <RightRail />
          </div>
        </div>
      </main>
      <FloatingLogButton />
    </div>
  );
}
