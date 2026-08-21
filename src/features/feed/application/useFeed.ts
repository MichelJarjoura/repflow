import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SocialPost } from "@/domain/social/social";
import { socialRepository } from "@/infrastructure/repositories/socialRepository";

export const feedQueryKeys = {
  all: ["feed"] as const,
  posts: () => [...feedQueryKeys.all, "posts"] as const,
};

export function useFeed(enabled: boolean) {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: feedQueryKeys.posts(),
    queryFn: () => socialRepository.listFeed(),
    enabled,
  });
  const toggleLikeMutation = useMutation({
    mutationFn: socialRepository.toggleLike,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.posts() });
      const previous = queryClient.getQueryData<SocialPost[]>(feedQueryKeys.posts());
      queryClient.setQueryData<SocialPost[]>(feedQueryKeys.posts(), (current = []) =>
        current.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLikedByCurrentUser: !post.isLikedByCurrentUser,
                likesCount: Math.max(0, post.likesCount + (post.isLikedByCurrentUser ? -1 : 1)),
              }
            : post,
        ),
      );
      return { previous };
    },
    onError: (_error, _postId, context) => {
      if (context?.previous) queryClient.setQueryData(feedQueryKeys.posts(), context.previous);
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: feedQueryKeys.posts() }),
  });

  return {
    posts: postsQuery.data ?? [],
    isLoading: postsQuery.isLoading,
    error: postsQuery.error,
    refetch: postsQuery.refetch,
    toggleLike: toggleLikeMutation.mutate,
  };
}
