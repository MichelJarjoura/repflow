import { createFileRoute } from "@tanstack/react-router";
import { RunsPage } from "@/features/runs";
import { RequireAuth } from "@/shared/RequireAuth";

export const Route = createFileRoute("/runs")({
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
  component: () => (
    <RequireAuth>
      <RunsPage />
    </RequireAuth>
  ),
});
