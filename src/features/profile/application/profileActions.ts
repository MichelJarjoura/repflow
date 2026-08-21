import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedActions } from "@/features/feed/application/postActions";
import {
  athleteRepository,
  followRepository,
} from "@/infrastructure/repositories/athleteRepository";

export const profileActions = {
  deletePost: feedActions.deletePost,
  findAthlete: athleteRepository.findById,
  listFollowing: followRepository.listFollowingIds,
  toggleFollow: followRepository.toggle,
};

export function useAthleteProfile(userId: string, isAuthenticated: boolean, viewerId?: string) {
  const queryClient = useQueryClient();
  const athlete = useQuery({
    queryKey: ["athlete", userId],
    queryFn: () => profileActions.findAthlete(userId),
  });
  const following = useQuery({
    queryKey: ["follows", "following"],
    queryFn: profileActions.listFollowing,
    enabled: isAuthenticated && viewerId !== userId,
  });
  const toggleFollow = useMutation({
    mutationFn: () => profileActions.toggleFollow(userId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["follows", "following"] }),
  });
  return { athlete, following, toggleFollow };
}
