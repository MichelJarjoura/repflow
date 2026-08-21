import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateWorkoutStatistics } from "@/domain/workout/calculations";
import type { Workout, WorkoutExercise } from "@/domain/workout/workout";
import { localWorkoutStore } from "@/infrastructure/persistence/localWorkoutStore";

export type LocalWorkoutExercise = WorkoutExercise;
export type LocalWorkout = Workout;

export function readLocalWorkouts(userId: string | undefined) {
  return localWorkoutStore.list(userId);
}

export function storeLocalWorkout(userId: string | undefined, workout: Workout) {
  localWorkoutStore.save(userId, workout);
}

export function removeLocalWorkout(userId: string | undefined, workoutId: string) {
  return localWorkoutStore.remove(userId, workoutId);
}

export function useWorkoutHistory(userId: string | undefined) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const refresh = useCallback(() => setWorkouts(localWorkoutStore.list(userId)), [userId]);

  useEffect(() => {
    refresh();
    window.addEventListener(localWorkoutStore.eventName, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(localWorkoutStore.eventName, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const stats = useMemo(() => calculateWorkoutStatistics(workouts), [workouts]);
  return { workouts, stats, refresh };
}

export const useLocalWorkouts = useWorkoutHistory;
