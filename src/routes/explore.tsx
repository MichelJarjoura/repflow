import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "@/features/explore";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "REPFLOW — Explore" },
      { name: "description", content: "Find athletes and discover training shared on Repflow." },
      { property: "og:title", content: "REPFLOW — Explore" },
      { property: "og:description", content: "Find athletes and discover training." },
    ],
  }),
  component: ExplorePage,
});
