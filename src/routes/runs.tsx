import { createFileRoute, redirect } from "@tanstack/react-router";
import { RunsPage } from "@/features/runs";

export const Route = createFileRoute("/runs")({
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
      { title: "REPFLOW — Runs" },
      {
        name: "description",
        content: "Recent runs with route, distance, and pace. Lifestyle, not leaderboard.",
      },
      { property: "og:title", content: "REPFLOW — Runs" },
      { property: "og:description", content: "Recent runs with route, distance, and pace." },
    ],
  }),
  component: RunsPage,
});
