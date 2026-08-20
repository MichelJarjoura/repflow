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

export type BackendExercise = {
  id: string;
  name: string;
  description: string;
  mainMuscle: string;
  secondaryMuscles: string[];
};

export type NotificationItem = {
  id: string;
  triggeredById: string;
  type: string;
  targetId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  sentAt: string;
};

export type Coach = {
  userId: string;
  username: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
  certificationUrl: string;
  approvedAt: string;
  averageRating: number;
  totalParticipants: number;
};

export type TrainingRequest = {
  id?: string | null;
  athleteId: string;
  coachId: string;
  message?: string | null;
  status: string;
  createdAt: string;
  reviewedAt?: string | null;
};

export type WorkoutTemplate = {
  id: string;
  userId: string;
  name: string;
  durationDays: number;
  isGeneral: boolean;
  days: unknown[];
};

export type WorkoutPlan = { plan: unknown; days: unknown[] };

export const exerciseApi = {
  getAll: () => apiRequest<BackendExercise[]>("Exercises"),
  getMuscles: () => apiRequest<string[]>("Exercises/muscles"),
  getByMainMuscle: (muscle: string) =>
    apiRequest<BackendExercise[]>(`Exercises/main-muscle/${encodeURIComponent(muscle)}`),
};

export const userSessionApi = {
  create: (input: {
    description?: string;
    muscles: string[];
    totalDurationMinutes: number;
    exercises: Array<{ exerciseId: string; reps: number; sets: number; weight: number }>;
  }) => apiRequest<BackendUserSession>("UserSessions", { method: "POST", body: input }),
  update: (
    id: string,
    input: {
      description?: string;
      muscles: string[];
      totalDurationMinutes: number;
      exercises: Array<{ exerciseId: string; reps: number; sets: number; weight: number }>;
    },
  ) => apiRequest<BackendUserSession>(`UserSessions/${id}`, { method: "PUT", body: input }),
};

export const mediaApi = {
  uploadProfilePicture: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiRequest<{ url: string; fileName: string }>("Media/upload-profile-picture", {
      method: "POST",
      body,
    });
  },
  uploadPostMedia: (files: File[]) => {
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    return apiRequest<{ count: number; urls: string[] }>("Media/upload-post-media", {
      method: "POST",
      body,
    });
  },
};

export const commentsApi = {
  getForPost: (postId: string, page = 1, pageSize = 20) =>
    apiRequest<{ page: number; pageSize: number; count: number; data: BackendComment[] }>(
      `Comments?postId=${encodeURIComponent(postId)}&page=${page}&pageSize=${pageSize}`,
    ),
};

export const followApi = {
  toggle: (targetUserId: string) =>
    apiRequest<{ isFollowing: boolean; message: string }>(`Follows/${targetUserId}`, {
      method: "POST",
    }),
  getFollowing: () => apiRequest<string[]>("Follows/following"),
  getFollowers: () => apiRequest<string[]>("Follows/followers"),
  accept: (followerId: string) =>
    apiRequest<unknown>(`Follows/accept/${followerId}`, { method: "POST" }),
};

export const notificationApi = {
  getAll: () => apiRequest<NotificationItem[]>("Notifications"),
  markRead: (id: string) => apiRequest<unknown>(`Notifications/read/${id}`, { method: "PUT" }),
};

export const chatApi = {
  getHistory: (otherUserId: string) => apiRequest<ChatMessage[]>(`Chat/history/${otherUserId}`),
  send: (receiverId: string, content: string) =>
    apiRequest<ChatMessage>("Chat/send", { method: "POST", body: { receiverId, content } }),
  markRead: (messageId: string) => apiRequest<unknown>(`Chat/read/${messageId}`, { method: "PUT" }),
};

export const coachApi = {
  getAll: () => apiRequest<Coach[]>("coach"),
  getTopRated: () => apiRequest<Coach[]>("coach/top-rated"),
  rate: (coachId: string, rating: number) =>
    apiRequest<Coach>(`coach/${coachId}/rate`, { method: "POST", body: { rating } }),
  apply: (certificationUrl: string) =>
    apiRequest<unknown>("coach/applications", { method: "POST", body: { certificationUrl } }),
  getMyApplication: () => apiRequest<unknown>("coach/applications/me"),
  requestTraining: (coachId: string, message?: string) =>
    apiRequest<TrainingRequest>("coach/training-requests", {
      method: "POST",
      body: { coachId, message },
    }),
  getTrainingRequests: () => apiRequest<TrainingRequest[]>("coach/training-requests"),
  reviewTrainingRequest: (requestId: string, approved: boolean) =>
    apiRequest<TrainingRequest>(`coach/training-requests/${requestId}`, {
      method: "PATCH",
      body: { approved },
    }),
};

export const workoutPlanningApi = {
  getTemplates: () => apiRequest<WorkoutTemplate[]>("workout-planning/templates"),
  createTemplate: (input: {
    name: string;
    durationDays: number;
    isGeneral: boolean;
    days: Array<{
      name: string;
      isRestDay: boolean;
      exercises?: Array<{
        exerciseId: string;
        plannedSets: number;
        plannedReps: number;
        plannedWeight: number;
      }>;
    }>;
  }) => apiRequest<WorkoutTemplate>("workout-planning/templates", { method: "POST", body: input }),
  archiveTemplate: (id: string) =>
    apiRequest<unknown>(`workout-planning/templates/${id}`, { method: "DELETE" }),
  getPlans: () => apiRequest<WorkoutPlan[]>("workout-planning/plans"),
  createPlan: (input: {
    name: string;
    durationDays: number;
    ownerUserId?: string;
    templateIds?: string[];
    days?: Array<{
      name: string;
      isRestDay: boolean;
      exercises?: Array<{
        exerciseId: string;
        plannedSets: number;
        plannedReps: number;
        plannedWeight: number;
      }>;
    }>;
  }) => apiRequest<WorkoutPlan>("workout-planning/plans", { method: "POST", body: input }),
  startPlan: (id: string, startDate: string) =>
    apiRequest<unknown>(`workout-planning/plans/${id}/start`, {
      method: "POST",
      body: { startDate },
    }),
  acceptPlan: (id: string) =>
    apiRequest<unknown>(`workout-planning/plans/${id}/accept`, { method: "POST" }),
  rejectPlan: (id: string) =>
    apiRequest<unknown>(`workout-planning/plans/${id}/reject`, { method: "POST" }),
};
