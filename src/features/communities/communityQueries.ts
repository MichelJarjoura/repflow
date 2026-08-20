import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  challengeApi,
  communityApi,
  postApi,
  type BackendChallenge,
  type BackendCommunity,
  type BackendPost,
} from "@/core/api/repflow";

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

export const communityQueryKeys = {
  all: ["communities"] as const,
  mine: () => [...communityQueryKeys.all, "mine"] as const,
  posts: (communityId: string) => [...communityQueryKeys.all, "posts", communityId] as const,
  challenges: (communityId: string) =>
    [...communityQueryKeys.all, "challenges", communityId] as const,
  joinedChallenges: () => [...communityQueryKeys.all, "joined-challenges"] as const,
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
  const index = Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
  return tones[index % tones.length];
}

function mapCommunity(community: BackendCommunity): CommunityRecord {
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
  };
}

function mapPost(post: BackendPost): CommunityPostRecord {
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

function daysLeft(endDate: string) {
  const result = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000);
  return Math.max(0, result);
}

function mapChallenge(challenge: BackendChallenge, joined: boolean): CommunityChallengeRecord {
  return {
    id: challenge.id ?? `${challenge.communityId}-${challenge.name}`,
    title: challenge.name,
    description: challenge.description || "Work with your community to complete this shared goal.",
    target: challenge.goal,
    progress: challenge.progress,
    unit: "progress",
    participants: 0,
    daysLeft: daysLeft(challenge.endDate),
    accent: "bg-brand",
    isJoined: joined,
  };
}

export function useCommunityData(selectedCommunityId: string | null, enabled: boolean) {
  const queryClient = useQueryClient();
  const communitiesQuery = useQuery({
    queryKey: communityQueryKeys.mine(),
    queryFn: communityApi.getMine,
    enabled,
    select: (communities) => communities.map(mapCommunity),
  });
  const postsQuery = useQuery({
    queryKey: communityQueryKeys.posts(selectedCommunityId ?? "none"),
    queryFn: () => postApi.getByCommunity(selectedCommunityId!),
    enabled: enabled && Boolean(selectedCommunityId),
  });
  const challengesQuery = useQuery({
    queryKey: communityQueryKeys.challenges(selectedCommunityId ?? "none"),
    queryFn: () => challengeApi.getActiveForCommunity(selectedCommunityId!),
    enabled: enabled && Boolean(selectedCommunityId),
  });
  const joinedChallengesQuery = useQuery({
    queryKey: communityQueryKeys.joinedChallenges(),
    queryFn: challengeApi.getMine,
    enabled,
  });

  const joinedChallengeIds = new Set(
    (joinedChallengesQuery.data ?? []).map((challenge) => challenge.id).filter(Boolean),
  );
  const challenges = (challengesQuery.data ?? []).map((challenge) =>
    mapChallenge(challenge, joinedChallengeIds.has(challenge.id)),
  );

  const invalidateMine = () =>
    queryClient.invalidateQueries({ queryKey: communityQueryKeys.mine() });
  const invalidateSelected = () => {
    if (!selectedCommunityId) return;
    void queryClient.invalidateQueries({ queryKey: communityQueryKeys.posts(selectedCommunityId) });
    void queryClient.invalidateQueries({
      queryKey: communityQueryKeys.challenges(selectedCommunityId),
    });
    void queryClient.invalidateQueries({ queryKey: communityQueryKeys.joinedChallenges() });
  };

  const createCommunityMutation = useMutation({
    mutationFn: communityApi.create,
    onSuccess: invalidateMine,
  });
  const joinCommunityMutation = useMutation({
    mutationFn: communityApi.join,
    onSuccess: invalidateMine,
  });
  const joinChallengeMutation = useMutation({
    mutationFn: challengeApi.join,
    onSuccess: invalidateSelected,
  });
  const updateParticipationMutation = useMutation({
    mutationFn: ({ challengeId, amount }: { challengeId: string; amount: number }) =>
      challengeApi.updateParticipation(challengeId, amount),
    onSuccess: invalidateSelected,
  });
  const publishPostMutation = useMutation({
    mutationFn: ({ communityId, content }: { communityId: string; content: string }) =>
      postApi.create({ content, communityId }),
    onSuccess: invalidateSelected,
  });

  return {
    communities: communitiesQuery.data ?? [],
    posts: (postsQuery.data ?? []).map(mapPost),
    challenges,
    isLoading: communitiesQuery.isLoading || postsQuery.isLoading || challengesQuery.isLoading,
    error: communitiesQuery.error ?? postsQuery.error ?? challengesQuery.error,
    createCommunity: createCommunityMutation.mutateAsync,
    joinCommunity: joinCommunityMutation.mutateAsync,
    joinChallenge: joinChallengeMutation.mutateAsync,
    updateParticipation: updateParticipationMutation.mutateAsync,
    publishPost: publishPostMutation.mutateAsync,
  };
}
