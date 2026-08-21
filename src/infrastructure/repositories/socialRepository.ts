import type { PostRepository } from "@/application/ports/repositories";
import type { CreatePostCommand, SocialComment, SocialPost } from "@/domain/social/social";
import { ApiError, apiRequest } from "@/infrastructure/http/apiClient";

type PostDto = SocialPost;
type CommentDto = SocialComment;

function mapPost(dto: PostDto): SocialPost {
  return {
    id: dto.id,
    authorId: dto.authorId,
    communityId: dto.communityId,
    content: dto.content,
    mediaUrls: dto.mediaUrls ?? [],
    likesCount: dto.likesCount,
    commentsCount: dto.commentsCount,
    isLikedByCurrentUser: dto.isLikedByCurrentUser,
    createdAt: dto.createdAt,
  };
}

export const socialRepository: PostRepository & {
  listFeedFallback(): Promise<SocialPost[]>;
  listByAuthor(authorId: string): Promise<SocialPost[]>;
  uploadPostMedia(files: File[]): Promise<string[]>;
} = {
  async listFeed() {
    try {
      return (await apiRequest<PostDto[]>("Posts")).map(mapPost);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return this.listFeedFallback();
      throw error;
    }
  },
  async listFeedFallback() {
    return (await apiRequest<PostDto[]>("Posts/feed")).map(mapPost);
  },
  async listByCommunity(communityId) {
    return (await apiRequest<PostDto[]>(`Posts/community/${communityId}`)).map(mapPost);
  },
  async listByAuthor(authorId) {
    return (await apiRequest<PostDto[]>(`Posts/user/${authorId}`)).map(mapPost);
  },
  async create(command: CreatePostCommand) {
    return mapPost(await apiRequest<PostDto>("Posts", { method: "POST", body: command }));
  },
  async remove(postId) {
    await apiRequest<unknown>(`Posts/${postId}`, { method: "DELETE" });
  },
  toggleLike(postId) {
    return apiRequest<{ isLiked: boolean }>(`Posts/${postId}/like`, { method: "POST" });
  },
  async addComment(postId, content, parentCommentId) {
    return apiRequest<CommentDto>(`Posts/${postId}/comments`, {
      method: "POST",
      body: { content, parentCommentId },
    });
  },
  listComments(postId, page = 1, pageSize = 20) {
    return apiRequest<{ page: number; pageSize: number; count: number; data: CommentDto[] }>(
      `Comments?postId=${encodeURIComponent(postId)}&page=${page}&pageSize=${pageSize}`,
    );
  },
  async uploadPostMedia(files) {
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    const result = await apiRequest<{ count: number; urls: string[] }>("Media/upload-post-media", {
      method: "POST",
      body,
    });
    return result.urls;
  },
};
