import type { CommunityRepository } from "@/application/ports/repositories";
import type {
  Community,
  CommunityChallenge,
  CommunityMember,
  CreateCommunityCommand,
} from "@/domain/community/community";
import { apiRequest } from "@/infrastructure/http/apiClient";

type CommunityDto = {
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

type ChallengeDto = {
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

function mapCommunity(dto: CommunityDto): Community {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    imageUrl: dto.imageUrl,
    isPrivate: dto.isPrivate,
    ownerId: dto.ownerId,
    isOwner: dto.isOwner,
    isAdmin: dto.isAdmin,
    isMember: dto.isMember,
    adminIds: dto.adminIds ?? [],
    memberCount: dto.memberCount,
  };
}

function mapChallenge(dto: ChallengeDto): CommunityChallenge {
  return {
    id: dto.id ?? `${dto.communityId}-${dto.name}`,
    creatorId: dto.creatorId,
    communityId: dto.communityId,
    name: dto.name,
    description: dto.description ?? "",
    startDate: dto.startDate,
    endDate: dto.endDate,
    goal: dto.goal,
    progress: dto.progress,
  };
}

export const communityRepository: CommunityRepository & {
  listJoinedChallenges(): Promise<CommunityChallenge[]>;
} = {
  async listMine() {
    return (await apiRequest<CommunityDto[]>("Community/user/communities")).map(mapCommunity);
  },
  listMembers(communityId) {
    return apiRequest<CommunityMember[]>(`Community/${communityId}/members`);
  },
  async create(command: CreateCommunityCommand) {
    return mapCommunity(
      await apiRequest<CommunityDto>("Community", { method: "POST", body: command }),
    );
  },
  async join(communityId) {
    await apiRequest<unknown>(`Community/${communityId}/join`, { method: "POST" });
  },
  async leave(communityId) {
    await apiRequest<unknown>(`Community/${communityId}/leave`, { method: "DELETE" });
  },
  async listActiveChallenges(communityId) {
    return (await apiRequest<ChallengeDto[]>(`Challenge/community/${communityId}/active`)).map(
      mapChallenge,
    );
  },
  async listJoinedChallenges() {
    return (await apiRequest<ChallengeDto[]>("Challenge/user")).map(mapChallenge);
  },
  async joinChallenge(challengeId) {
    await apiRequest<unknown>(`Challenge/${challengeId}/join`, { method: "POST" });
  },
  async updateChallengeParticipation(challengeId, amount) {
    await apiRequest<unknown>(`Challenge/${challengeId}/update-participant`, {
      method: "PUT",
      body: amount,
    });
  },
  async promoteAdmin(communityId, athleteId) {
    await apiRequest<unknown>(`Community/${communityId}/make-admin/${athleteId}`, {
      method: "PATCH",
    });
  },
  async demoteAdmin(communityId, athleteId) {
    await apiRequest<unknown>(`Community/${communityId}/remove-admin/${athleteId}`, {
      method: "PATCH",
    });
  },
  async removeMember(communityId, athleteId) {
    await apiRequest<unknown>(`Community/${communityId}/remove-member/${athleteId}`, {
      method: "DELETE",
    });
  },
};
