import { createFileRoute } from "@tanstack/react-router";
import { FeedPage } from "@/features/feed";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});
