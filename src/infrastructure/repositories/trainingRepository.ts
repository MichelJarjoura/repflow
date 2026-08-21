import { apiRequest } from "@/infrastructure/http/apiClient";

export type RemoteWorkoutSession = {
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

export const trainingRepository = {
  listSessions: () => apiRequest<RemoteWorkoutSession[]>("UserSessions"),
};
