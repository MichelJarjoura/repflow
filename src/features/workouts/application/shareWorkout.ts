import { feedActions } from "@/features/feed/application/postActions";

export function shareWorkoutToFeed(content: string) {
  return feedActions.createPost({ content });
}
