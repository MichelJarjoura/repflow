import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/infrastructure/http/apiClient";
import { athleteRepository } from "@/infrastructure/repositories/athleteRepository";

export function useExactAthleteSearch(username: string) {
  return useQuery({
    queryKey: ["explore", "user", username.toLowerCase()],
    queryFn: async () => {
      try {
        return await athleteRepository.findByUsername(username);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    enabled: username.length >= 2,
    retry: false,
  });
}

export function usePostAuthor(authorId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["post-author", authorId],
    queryFn: () => athleteRepository.findById(authorId),
    enabled,
  });
}
