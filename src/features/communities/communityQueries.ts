import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CommunityTone = "brand" | "violet" | "amber";

export type CommunityRecord = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  tone: CommunityTone;
  initials: string;
  joined?: boolean;
};

export type CommunityPostRecord = {
  id: string;
  author: string;
  handle: string;
  body: string;
  createdAt: string;
};

export type CommunityData = {
  communities: CommunityRecord[];
  posts: Record<string, CommunityPostRecord[]>;
  joinedChallenges: string[];
  challengeProgress: Record<string, number>;
};

export const communityQueryKeys = {
  all: ["communities"] as const,
  collection: () => [...communityQueryKeys.all, "collection"] as const,
  posts: () => [...communityQueryKeys.all, "posts"] as const,
  joinedChallenges: () => [...communityQueryKeys.all, "joined-challenges"] as const,
  challengeProgress: () => [...communityQueryKeys.all, "challenge-progress"] as const,
};

const communityStoreKey = "repflow_communities";
const postStoreKey = "repflow_community_posts";
const challengeStoreKey = "repflow_joined_challenges";
const progressStoreKey = "repflow_challenge_progress";

const starterCommunities: CommunityRecord[] = [
  {
    id: "iron-collective",
    name: "Iron Collective",
    description:
      "A focused space for lifters who show up, track the work, and build strength together.",
    members: 1284,
    category: "Strength training",
    tone: "brand",
    initials: "IC",
    joined: true,
  },
  {
    id: "barbell-club",
    name: "The Barbell Club",
    description:
      "Technique, training blocks, and hard-earned personal records for serious barbell athletes.",
    members: 846,
    category: "Powerlifting",
    tone: "violet",
    initials: "BC",
  },
  {
    id: "weekend-warriors",
    name: "Weekend Warriors",
    description: "A supportive crew for building consistency around a busy schedule.",
    members: 2196,
    category: "General fitness",
    tone: "amber",
    initials: "WW",
  },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function readStorage<T>(key: string, fallback: T) {
  if (!canUseStorage()) return fallback;
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (canUseStorage()) localStorage.setItem(key, JSON.stringify(value));
  return value;
}

const communityAdapter = {
  getCommunities: async () => readStorage(communityStoreKey, starterCommunities),
  getPosts: async () => readStorage<Record<string, CommunityPostRecord[]>>(postStoreKey, {}),
  getJoinedChallenges: async () => readStorage<string[]>(challengeStoreKey, []),
  getChallengeProgress: async () => readStorage<Record<string, number>>(progressStoreKey, {}),
  createCommunity: async (community: CommunityRecord) => {
    const communities = readStorage(communityStoreKey, starterCommunities);
    return writeStorage(communityStoreKey, [community, ...communities]);
  },
  joinCommunity: async (id: string) => {
    const communities = readStorage(communityStoreKey, starterCommunities).map((community) =>
      community.id === id && !community.joined
        ? { ...community, joined: true, members: community.members + 1 }
        : community,
    );
    return writeStorage(communityStoreKey, communities);
  },
  toggleChallenge: async (challengeId: string) => {
    const current = readStorage<string[]>(challengeStoreKey, []);
    const updated = current.includes(challengeId)
      ? current.filter((id) => id !== challengeId)
      : [...current, challengeId];
    return writeStorage(challengeStoreKey, updated);
  },
  addContribution: async ({
    challengeId,
    amount,
    target,
  }: {
    challengeId: string;
    amount: number;
    target: number;
  }) => {
    const current = readStorage<Record<string, number>>(progressStoreKey, {});
    const updated = {
      ...current,
      [challengeId]: Math.min(target, (current[challengeId] ?? 0) + amount),
    };
    return writeStorage(progressStoreKey, updated);
  },
  publishPost: async ({
    communityId,
    post,
  }: {
    communityId: string;
    post: CommunityPostRecord;
  }) => {
    const posts = readStorage<Record<string, CommunityPostRecord[]>>(postStoreKey, {});
    const updated = {
      ...posts,
      [communityId]: [post, ...(posts[communityId] ?? [])],
    };
    return writeStorage(postStoreKey, updated);
  },
};

export function useCommunityData() {
  const queryClient = useQueryClient();
  const enabled = canUseStorage();
  const communitiesQuery = useQuery({
    queryKey: communityQueryKeys.collection(),
    queryFn: communityAdapter.getCommunities,
    enabled,
    initialData: starterCommunities,
    staleTime: Infinity,
  });
  const postsQuery = useQuery({
    queryKey: communityQueryKeys.posts(),
    queryFn: communityAdapter.getPosts,
    enabled,
    initialData: {},
    staleTime: Infinity,
  });
  const joinedChallengesQuery = useQuery({
    queryKey: communityQueryKeys.joinedChallenges(),
    queryFn: communityAdapter.getJoinedChallenges,
    enabled,
    initialData: [],
    staleTime: Infinity,
  });
  const challengeProgressQuery = useQuery({
    queryKey: communityQueryKeys.challengeProgress(),
    queryFn: communityAdapter.getChallengeProgress,
    enabled,
    initialData: {},
    staleTime: Infinity,
  });

  const createCommunityMutation = useMutation({
    mutationFn: communityAdapter.createCommunity,
    onSuccess: (communities) =>
      queryClient.setQueryData(communityQueryKeys.collection(), communities),
  });
  const joinCommunityMutation = useMutation({
    mutationFn: communityAdapter.joinCommunity,
    onSuccess: (communities) =>
      queryClient.setQueryData(communityQueryKeys.collection(), communities),
  });
  const toggleChallengeMutation = useMutation({
    mutationFn: communityAdapter.toggleChallenge,
    onSuccess: (challengeIds) =>
      queryClient.setQueryData(communityQueryKeys.joinedChallenges(), challengeIds),
  });
  const addContributionMutation = useMutation({
    mutationFn: communityAdapter.addContribution,
    onSuccess: (progress) =>
      queryClient.setQueryData(communityQueryKeys.challengeProgress(), progress),
  });
  const publishPostMutation = useMutation({
    mutationFn: communityAdapter.publishPost,
    onSuccess: (posts) => queryClient.setQueryData(communityQueryKeys.posts(), posts),
  });

  return {
    communities: communitiesQuery.data,
    posts: postsQuery.data,
    joinedChallenges: joinedChallengesQuery.data,
    challengeProgress: challengeProgressQuery.data,
    isLoading:
      communitiesQuery.isLoading || postsQuery.isLoading || joinedChallengesQuery.isLoading,
    createCommunity: createCommunityMutation.mutateAsync,
    joinCommunity: joinCommunityMutation.mutateAsync,
    toggleChallenge: toggleChallengeMutation.mutateAsync,
    addContribution: addContributionMutation.mutateAsync,
    publishPost: publishPostMutation.mutateAsync,
  };
}
