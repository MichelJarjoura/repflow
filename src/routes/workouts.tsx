import { createFileRoute } from "@tanstack/react-router";
import { WorkoutsPage } from "@/features/workouts";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "REPFLOW — Workouts" },
      {
        name: "description",
        content: "Browse training splits and templates to copy into your program.",
      },
      { property: "og:title", content: "REPFLOW — Workouts" },
      { property: "og:description", content: "Browse training splits and templates." },
    ],
  }),
  component: WorkoutsPage,
});
