import { createFileRoute } from "@tanstack/react-router";
import { AppNav, FloatingLogButton } from "@/components/AppNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REPFLOW" },
      {
        name: "description",
        content:
          "The progress-first feed for lifters. PRs, workouts, runs from the athletes you follow.",
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
      
      <FloatingLogButton />
    </div>
  );
}
