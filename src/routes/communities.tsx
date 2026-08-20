import { createFileRoute } from "@tanstack/react-router";
import { CommunityPage } from "@/features/communities";

export const Route = createFileRoute("/communities")({
  head: () => ({
    meta: [
      { title: "REPFLOW — Communities" },
      {
        name: "description",
        content:
          "Train with your crew, build collective challenges, and share progress in REPFLOW communities.",
      },
      { property: "og:title", content: "REPFLOW — Communities" },
      {
        property: "og:description",
        content: "Train with your crew and take on collective challenges.",
      },
    ],
  }),
  component: CommunityPage,
});
