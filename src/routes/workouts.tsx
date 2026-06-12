import { createFileRoute, redirect } from "@tanstack/react-router";
import { WorkoutsPage } from "@/features/workouts";

export const Route = createFileRoute("/workouts")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("repflow_user");
      if (!storedUser) {
        throw redirect({
          to: "/feed",
        });
      }
    }
  },
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
