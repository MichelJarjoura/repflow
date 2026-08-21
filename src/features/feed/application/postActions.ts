import type { Athlete } from "@/domain/athlete/athlete";
import type { CreatePostCommand, SocialComment, SocialPost } from "@/domain/social/social";
import { ApiError } from "@/infrastructure/http/apiClient";
import { athleteRepository } from "@/infrastructure/repositories/athleteRepository";
import { socialRepository } from "@/infrastructure/repositories/socialRepository";

export const feedActions = {
  findAuthor: (authorId: string): Promise<Athlete> => athleteRepository.findById(authorId),
  createPost: (command: CreatePostCommand): Promise<SocialPost> => socialRepository.create(command),
  deletePost: (postId: string) => socialRepository.remove(postId),
  toggleLike: (postId: string) => socialRepository.toggleLike(postId),
  listComments: (postId: string) => socialRepository.listComments(postId),
  addComment: (postId: string, content: string): Promise<SocialComment> =>
    socialRepository.addComment(postId, content),
  uploadMedia: (files: File[]) => socialRepository.uploadPostMedia(files),
};

export function describeFeedError(error: unknown) {
  if (error instanceof ApiError && error.status === 404) {
    return "The running backend does not expose a public Posts route, so community posts can work while the global feed stays unavailable.";
  }
  return "The feed could not be loaded from the backend.";
}
