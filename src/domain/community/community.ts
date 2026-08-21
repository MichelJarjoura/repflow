export type Community = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  isPrivate: boolean;
  ownerId: string;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  adminIds: string[];
  memberCount: number;
};

export type CommunityMember = {
  userId: string;
  userName: string;
  isAdmin: boolean;
};

export type CommunityChallenge = {
  id: string;
  creatorId: string;
  communityId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  progress: number;
};

export type CreateCommunityCommand = {
  name: string;
  description?: string;
  imageUrl?: string;
  isPrivate: boolean;
};
