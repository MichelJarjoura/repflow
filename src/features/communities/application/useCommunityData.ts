import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Community as DomainCommunity,
  CommunityChallenge,
  CommunityMember,
} from "@/domain/community/community";
import type { SocialPost } from "@/domain/social/social";
import { ApiError } from "@/infrastructure/http/apiClient";
import { communityRepository } from "@/infrastructure/repositories/communityRepository";
import { socialRepository } from "@/infrastructure/repositories/socialRepository";

type CommunityTone = "brand" | "violet" | "amber";

export type CommunityRecord = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  tone: CommunityTone;
  initials: string;
  joined: boolean;
  isPrivate: boolean;
  ownerId: string;
  isOwner: boolean;
  isAdmin: boolean;
  adminIds: string[];
};

export type CommunityPostRecord = {
  id: string;
  author: string;
  handle: string;
  body: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
};

export type CommunityChallengeRecord = {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  unit: string;
  participants: number;
  daysLeft: number;
  accent: string;
  isJoined: boolean;
};

export function isOwnerCommunityDeletionCompletion(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

export const communityQueryKeys = {
  all: ["communities"] as const,
  mine: () => [...communityQueryKeys.all, "mine"] as const,
  posts: (communityId: string) => [...communityQueryKeys.all, "posts", communityId] as const,
  challenges: (communityId: string) =>
    [...communityQueryKeys.all, "challenges", communityId] as const,
  joinedChallenges: () => [...communityQueryKeys.all, "joined-challenges"] as const,
  members: (communityId: string) => [...communityQueryKeys.all, "members", communityId] as const,
};

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "RC"
  );
}

function toneFor(value: string): CommunityTone {
  const tones: CommunityTone[] = ["brand", "violet", "amber"];
  return tones[
    Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0) %
      tones.length
  ];
}

function mapCommunity(community: DomainCommunity): CommunityRecord {
  return {
    id: community.id,
    name: community.name,
    description: community.description || "A community building consistent training together.",
    members: community.memberCount,
    category: community.isPrivate ? "Private community" : "Training community",
    tone: toneFor(community.id),
    initials: initials(community.name),
    joined: community.isMember,
    isPrivate: community.isPrivate,
    ownerId: community.ownerId,
    isOwner: community.isOwner,
    isAdmin: community.isAdmin,
    adminIds: community.adminIds,
  };
}

function mapPost(post: SocialPost): CommunityPostRecord {
  return {
    id: post.id,
    author: "Repflow member",
    handle: `@${post.authorId.slice(0, 8)}`,
    body: post.content,
    createdAt: post.createdAt,
    likes: post.likesCount,
    comments: post.commentsCount,
    isLiked: post.isLikedByCurrentUser,
  };
}

function mapChallenge(challenge: CommunityChallenge, isJoined: boolean): CommunityChallengeRecord {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / 86_400_000),
  );
  return {
    id: challenge.id,
    title: challenge.name,
    description: challenge.description || "Work with your community to complete this shared goal.",
    target: challenge.goal,
    progress: challenge.progress,
    unit: "progress",
    participants: 0,
    daysLeft,
    accent: "bg-brand",
    isJoined,
  };
}

export function useCommunityData(selectedCommunityId: string | null, enabled: boolean) {
  const queryClient = useQueryClient();
  const communitiesQuery = useQuery({
    queryKey: communityQueryKeys.mine(),
    queryFn: communityRepository.listMine,
    enabled,
    select: (communities) => communities.map(mapCommunity),
  });
  const postsQuery = useQuery({
    queryKey: communityQueryKeys.posts(selectedCommunityId ?? "none"),
    queryFn: () => socialRepository.listByCommunity(selectedCommunityId!),
    enabled: enabled && Boolean(selectedCommunityId),
  });
  const challengesQuery = useQuery({
    queryKey: communityQueryKeys.challenges(selectedCommunityId ?? "none"),
    queryFn: () => communityRepository.listActiveChallenges(selectedCommunityId!),
    enabled: enabled && Boolean(selectedCommunityId),
  });
  const joinedChallengesQuery = useQuery({
    queryKey: communityQueryKeys.joinedChallenges(),
    queryFn: communityRepository.listJoinedChallenges,
    enabled,
  });
  const membersQuery = useQuery({
    queryKey: communityQueryKeys.members(selectedCommunityId ?? "none"),
    queryFn: () => communityRepository.listMembers(selectedCommunityId!),
    enabled: enabled && Boolean(selectedCommunityId),
  });

  const joinedChallengeIds = new Set(
    (joinedChallengesQuery.data ?? []).map((challenge) => challenge.id),
  );
  const challenges = (challengesQuery.data ?? []).map((challenge) =>
    mapChallenge(challenge, joinedChallengeIds.has(challenge.id)),
  );
  const invalidateMine = () =>
    void queryClient.invalidateQueries({ queryKey: communityQueryKeys.mine() });
  const invalidateSelected = () => {
    if (!selectedCommunityId) return;
    void queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts(selectedCommunityId) });
    void queryClient.invalidateQueries({
      queryKey: communityQueryKeys.challenges(selectedCommunityId),
    });
    void queryClient.invalidateQueries({
      queryKey: communityQueryKeys.members(selectedCommunityId),
    });
    void queryClient.invalidateQueries({ queryKey: communityQueryKeys.joinedChallenges() });
    invalidateMine();
  };

  const createCommunityMutation = useMutation({
    mutationFn: communityRepository.create,
    onSuccess: invalidateMine,
  });
  const joinCommunityMutation = useMutation({
    mutationFn: communityRepository.join,
    onSuccess: invalidateMine,
  });
  const joinChallengeMutation = useMutation({
    mutationFn: communityRepository.joinChallenge,
    onSuccess: invalidateSelected,
  });
  const updateParticipationMutation = useMutation({
    mutationFn: ({ challengeId, amount }: { challengeId: string; amount: number }) =>
      communityRepository.updateChallengeParticipation(challengeId, amount),
    onSuccess: invalidateSelected,
  });
  const leaveCommunityMutation = useMutation({
    mutationFn: communityRepository.leave,
    onSettled: invalidateMine,
  });
  const makeAdminMutation = useMutation({
    mutationFn: ({ communityId, userId }: { communityId: string; userId: string }) =>
      communityRepository.promoteAdmin(communityId, userId),
    onSuccess: invalidateSelected,
  });
  const removeAdminMutation = useMutation({
    mutationFn: ({ communityId, userId }: { communityId: string; userId: string }) =>
      communityRepository.demoteAdmin(communityId, userId),
    onSuccess: invalidateSelected,
  });
  const removeMemberMutation = useMutation({
    mutationFn: ({ communityId, userId }: { communityId: string; userId: string }) =>
      communityRepository.removeMember(communityId, userId),
    onSuccess: invalidateSelected,
  });
  const publishPostMutation = useMutation({
    mutationFn: ({ communityId, content }: { communityId: string; content: string }) =>
      socialRepository.create({ content, communityId }),
    onSuccess: (post) => {
      if (!selectedCommunityId) return;
      queryClient.setQueryData<SocialPost[]>(
        communityQueryKeys.posts(selectedCommunityId),
        (current = []) => [post, ...current.filter((item) => item.id !== post.id)],
      );
      invalidateSelected();
    },
  });

  return {
    communities: communitiesQuery.data ?? [],
    posts: (postsQuery.data ?? []).map(mapPost),
    challenges,
    members: (membersQuery.data ?? []) as CommunityMember[],
    isLoading: communitiesQuery.isLoading || postsQuery.isLoading || challengesQuery.isLoading,
    error: communitiesQuery.error ?? postsQuery.error ?? challengesQuery.error,
    createCommunity: createCommunityMutation.mutateAsync,
    joinCommunity: joinCommunityMutation.mutateAsync,
    joinChallenge: joinChallengeMutation.mutateAsync,
    updateParticipation: updateParticipationMutation.mutateAsync,
    leaveCommunity: leaveCommunityMutation.mutateAsync,
    makeAdmin: makeAdminMutation.mutateAsync,
    removeAdmin: removeAdminMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
    publishPost: publishPostMutation.mutateAsync,
  };
}
