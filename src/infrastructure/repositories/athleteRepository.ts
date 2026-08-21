import type { Athlete, FollowState } from "@/domain/athlete/athlete";
import { apiRequest } from "@/infrastructure/http/apiClient";

type AthleteDto = {
  id: string;
  username: string;
  email: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
};

type PhysicalDataDto = {
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

function mapAthlete(dto: AthleteDto): Athlete {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    bio: dto.bio,
    avatarUrl: dto.profilePictureUrl,
  };
}

export const athleteRepository = {
  async findById(id: string): Promise<Athlete> {
    return mapAthlete(await apiRequest<AthleteDto>(`Users/${id}`));
  },
  async findByUsername(username: string): Promise<Athlete> {
    return mapAthlete(
      await apiRequest<AthleteDto>(`Users/by-username/${encodeURIComponent(username)}`),
    );
  },
  async updateProfile(input: { bio?: string; avatarUrl?: string }): Promise<Athlete> {
    return mapAthlete(
      await apiRequest<AthleteDto>("Users/profile", {
        method: "PUT",
        body: { bio: input.bio, profilePictureUrl: input.avatarUrl },
      }),
    );
  },
  getPhysicalData(userId: string) {
    return apiRequest<PhysicalDataDto>(`users/${userId}/physical-data`);
  },
};

export const followRepository = {
  async toggle(athleteId: string): Promise<FollowState & { message: string }> {
    const response = await apiRequest<{ isFollowing: boolean; message: string }>(
      `Follows/${athleteId}`,
      {
        method: "POST",
      },
    );
    return { athleteId, ...response };
  },
  listFollowingIds: () => apiRequest<string[]>("Follows/following"),
  listFollowerIds: () => apiRequest<string[]>("Follows/followers"),
};
