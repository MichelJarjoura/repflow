import { useQuery } from "@tanstack/react-query";
import { optionalBackendFeaturesEnabled } from "@/app/config/featureCapabilities";
import { athleteRepository } from "@/infrastructure/repositories/athleteRepository";
import { socialRepository } from "@/infrastructure/repositories/socialRepository";
import { trainingRepository } from "@/infrastructure/repositories/trainingRepository";

export const profileQueryKeys = {
  all: ["profile"] as const,
  user: (id: string) => [...profileQueryKeys.all, "user", id] as const,
  posts: (id: string) => [...profileQueryKeys.all, "posts", id] as const,
  physical: (id: string) => [...profileQueryKeys.all, "physical", id] as const,
  sessions: () => [...profileQueryKeys.all, "sessions"] as const,
};

export function useProfile(userId: string | undefined, enabled: boolean) {
  const active = enabled && Boolean(userId);
  const userQuery = useQuery({
    queryKey: profileQueryKeys.user(userId ?? "none"),
    queryFn: () => athleteRepository.findById(userId!),
    enabled: active,
  });
  const postsQuery = useQuery({
    queryKey: profileQueryKeys.posts(userId ?? "none"),
    queryFn: () => socialRepository.listByAuthor(userId!),
    enabled: active && optionalBackendFeaturesEnabled,
  });
  const physicalQuery = useQuery({
    queryKey: profileQueryKeys.physical(userId ?? "none"),
    queryFn: () => athleteRepository.getPhysicalData(userId!),
    enabled: active && optionalBackendFeaturesEnabled,
  });
  const sessionsQuery = useQuery({
    queryKey: profileQueryKeys.sessions(),
    queryFn: trainingRepository.listSessions,
    enabled: active && optionalBackendFeaturesEnabled,
  });
  return {
    profile: userQuery.data,
    posts: postsQuery.data ?? [],
    physicalData: physicalQuery.data,
    sessions: sessionsQuery.data ?? [],
    isLoading: userQuery.isLoading || postsQuery.isLoading,
    error: userQuery.error ?? postsQuery.error ?? physicalQuery.error ?? sessionsQuery.error,
  };
}
