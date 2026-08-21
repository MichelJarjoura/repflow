import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi, type BackendPost } from "@/core/api/repflow";

export const feedQueryKeys = {
  all: ["feed"] as const,
  posts: () => [...feedQueryKeys.all, "posts"] as const,
};

export function useFeed(enabled: boolean) {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: feedQueryKeys.posts(),
    queryFn: postApi.getAll,
    enabled,
  });

  const toggleLikeMutation = useMutation({
    mutationFn: postApi.toggleLike,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedQueryKeys.posts() });
      const previous = queryClient.getQueryData<BackendPost[]>(feedQueryKeys.posts());
      queryClient.setQueryData<BackendPost[]>(feedQueryKeys.posts(), (current = []) =>
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: feedQueryKeys.posts() }),
  });

  return {
    posts: postsQuery.data ?? [],
    isLoading: postsQuery.isLoading,
    error: postsQuery.error,
    refetch: postsQuery.refetch,
    toggleLike: toggleLikeMutation.mutate,
  };
}
