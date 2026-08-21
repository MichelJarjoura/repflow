export type Athlete = {
  id: string;
  username: string;
  email?: string;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type AuthenticatedAthlete = Athlete & {
  displayName: string;
  emailVerified?: boolean;
};

export type FollowState = {
  athleteId: string;
  isFollowing: boolean;
};
