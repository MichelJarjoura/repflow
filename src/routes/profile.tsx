import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProfilePage } from "@/features/profile";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
    // If we're on the client and not authenticated, redirect
    // Note: context.auth is injected in __root.tsx
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
      { title: "REPFLOW — Profile" },
      { name: "description", content: "Your strength identity: PRs, weekly volume, streaks." },
      { property: "og:title", content: "REPFLOW — Profile" },
      { property: "og:description", content: "Your strength identity." },
    ],
  }),
  component: ProfilePage,
});
