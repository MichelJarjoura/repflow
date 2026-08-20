import { apiRequest } from "./client";

export type BackendUser = {
  id: string;
  username: string;
  email: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
};

export type BackendPost = {
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

export type BackendComment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string | null;
  createdAt: string;
};

export type BackendCommunity = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isPrivate: boolean;
  ownerId: string;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  adminIds?: string[] | null;
  memberCount: number;
};

export type BackendChallenge = {
  id?: string | null;
  creatorId: string;
  communityId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  progress: number;
};

export type BackendUserSession = {
  id: string;
  userId: string;
  description?: string | null;
  muscles: string[];
  date: string;
  totalDuration: number;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight: number;
    isPersonalRecord: boolean;
  }>;
};

export type PhysicalData = {
  heightCm?: number | null;
  weightHistory: Array<{ weightKg: number; addedAt: string }>;
  sex?: string | null;
  birthday?: string | null;
  personalRecords: Array<{
    exerciseId: string;
    exerciseName: string;
    maxWeightKg: number;
    date: string;
  }>;
};

export const postApi = {
  getFeed: () => apiRequest<BackendPost[]>("Posts/feed"),
  getAll: () => apiRequest<BackendPost[]>("Posts"),
  getById: (id: string) => apiRequest<BackendPost>(`Posts/${id}`),
  getByCommunity: (communityId: string) =>
    apiRequest<BackendPost[]>(`Posts/community/${communityId}`),
  getByUser: (userId: string) => apiRequest<BackendPost[]>(`Posts/user/${userId}`),
  create: (input: { content: string; communityId?: string; mediaUrls?: string[] }) =>
    apiRequest<BackendPost>("Posts", { method: "POST", body: input }),
  createWithSession: (input: {
    content: string;
    userSessionId: string;
    communityId?: string;
    mediaUrls?: string[];
  }) => apiRequest<BackendPost>("Posts/session", { method: "POST", body: input }),
  toggleLike: (id: string) =>
    apiRequest<{ isLiked: boolean }>(`Posts/${id}/like`, { method: "POST" }),
  addComment: (id: string, content: string, parentCommentId?: string) =>
    apiRequest<BackendComment>(`Posts/${id}/comments`, {
      method: "POST",
      body: { content, parentCommentId },
    }),
  remove: (id: string) => apiRequest<unknown>(`Posts/${id}`, { method: "DELETE" }),
};

export const communityApi = {
  getMine: () => apiRequest<BackendCommunity[]>("Community/user/communities"),
  getById: (id: string) => apiRequest<BackendCommunity>(`Community/${id}`),
  create: (input: { name: string; description?: string; imageUrl?: string; isPrivate: boolean }) =>
    apiRequest<BackendCommunity>("Community", { method: "POST", body: input }),
  join: (id: string) => apiRequest<unknown>(`Community/${id}/join`, { method: "POST" }),
  leave: (id: string) => apiRequest<unknown>(`Community/${id}/leave`, { method: "DELETE" }),
  getMembers: (id: string) =>
    apiRequest<Array<{ userId: string; userName: string; isAdmin: boolean }>>(
      `Community/${id}/members`,
    ),
};

export const challengeApi = {
  getForCommunity: (communityId: string) =>
    apiRequest<BackendChallenge[]>(`Challenge/community/${communityId}`),
  getActiveForCommunity: (communityId: string) =>
    apiRequest<BackendChallenge[]>(`Challenge/community/${communityId}/active`),
  getMine: () => apiRequest<BackendChallenge[]>("Challenge/user"),
  getJoinable: () => apiRequest<BackendChallenge[]>("Challenge/user/joinable"),
  create: (
    communityId: string,
    input: { name: string; description?: string; startDate: string; endDate: string; goal: number },
  ) =>
    apiRequest<BackendChallenge>(`Challenge/${communityId}/create`, {
      method: "POST",
      body: input,
    }),
  join: (challengeId: string) =>
    apiRequest<unknown>(`Challenge/${challengeId}/join`, { method: "POST" }),
  updateParticipation: (challengeId: string, goalParticipation: number) =>
    apiRequest<unknown>(`Challenge/${challengeId}/update-participant`, {
      method: "PUT",
      body: goalParticipation,
    }),
};

export const userApi = {
  getById: (id: string) => apiRequest<BackendUser>(`Users/${id}`),
  getByUsername: (username: string) =>
    apiRequest<BackendUser>(`Users/by-username/${encodeURIComponent(username)}`),
  updateProfile: (input: { bio?: string; profilePictureUrl?: string }) =>
    apiRequest<BackendUser>("Users/profile", { method: "PUT", body: input }),
  updatePrivacy: (isPrivate: boolean) =>
    apiRequest<unknown>("Users/privacy", { method: "PUT", body: { isPrivate } }),
};

export const sessionApi = {
  getAll: () => apiRequest<BackendUserSession[]>("UserSessions"),
  getByMonth: (year: number, month: number) =>
    apiRequest<BackendUserSession[]>(`UserSessions/month/${year}/${month}`),
  getByDay: (date: string) => apiRequest<BackendUserSession[]>(`UserSessions/day/${date}`),
};

export const physicalDataApi = {
  get: (userId: string) => apiRequest<PhysicalData>(`users/${userId}/physical-data`),
};
