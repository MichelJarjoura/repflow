import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/features/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "REPFLOW — Profile" },
      { name: "description", content: "Your strength identity: PRs, weekly volume, streaks." },
      { property: "og:title", content: "REPFLOW — Profile" },
      { property: "og:description", content: "Your strength identity." },
    ],
  }),
  component: ProfilePage,
});
