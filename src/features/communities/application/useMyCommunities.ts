import { useQuery } from "@tanstack/react-query";
import { communityRepository } from "@/infrastructure/repositories/communityRepository";

export function useMyCommunities(enabled: boolean) {
  return useQuery({
    queryKey: ["communities", "mine"],
    queryFn: communityRepository.listMine,
    enabled,
  });
}
