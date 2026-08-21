import type { Athlete } from "@/domain/athlete/athlete";
import type {
  Community,
  CommunityChallenge,
  CommunityMember,
  CreateCommunityCommand,
} from "@/domain/community/community";
import type { CreatePostCommand, SocialComment, SocialPost } from "@/domain/social/social";

export interface AthleteRepository {
  findById(id: string): Promise<Athlete>;
  findByUsername(username: string): Promise<Athlete>;
}

export interface FollowRepository {
  toggle(athleteId: string): Promise<{ isFollowing: boolean; message: string }>;
  listFollowingIds(): Promise<string[]>;
}

export interface PostRepository {
  listFeed(): Promise<SocialPost[]>;
  listByCommunity(communityId: string): Promise<SocialPost[]>;
  create(command: CreatePostCommand): Promise<SocialPost>;
  remove(postId: string): Promise<void>;
  toggleLike(postId: string): Promise<{ isLiked: boolean }>;
  addComment(postId: string, content: string, parentCommentId?: string): Promise<SocialComment>;
  listComments(
    postId: string,
    page?: number,
    pageSize?: number,
  ): Promise<{ page: number; pageSize: number; count: number; data: SocialComment[] }>;
}

export interface CommunityRepository {
  listMine(): Promise<Community[]>;
  listMembers(communityId: string): Promise<CommunityMember[]>;
  create(command: CreateCommunityCommand): Promise<Community>;
  join(communityId: string): Promise<void>;
  leave(communityId: string): Promise<void>;
  listActiveChallenges(communityId: string): Promise<CommunityChallenge[]>;
  joinChallenge(challengeId: string): Promise<void>;
  updateChallengeParticipation(challengeId: string, amount: number): Promise<void>;
  promoteAdmin(communityId: string, athleteId: string): Promise<void>;
  demoteAdmin(communityId: string, athleteId: string): Promise<void>;
  removeMember(communityId: string, athleteId: string): Promise<void>;
}
