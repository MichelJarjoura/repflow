import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/features/hub";
import { RequireAuth } from "@/shared/RequireAuth";

export const Route = createFileRoute("/hub")({
  head: () => ({
    meta: [
      { title: "REPFLOW — Athlete Hub" },
      {
        name: "description",
        content: "Messages, coaching, planning, notifications, and athlete network tools.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <HubPage />
    </RequireAuth>
  ),
});
