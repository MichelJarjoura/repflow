export type SocialPost = {
  id: string;
  authorId: string;
  communityId?: string | null;
  content: string;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
};

export type SocialComment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string | null;
  createdAt: string;
};

export type CreatePostCommand = {
  content: string;
  communityId?: string;
  mediaUrls?: string[];
};
