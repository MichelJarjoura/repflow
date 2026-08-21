import { useCallback, useEffect, useMemo, useState } from "react";

export type LocalWorkoutExercise = {
  id: string;
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
};

export type LocalWorkout = {
  id: string;
  title: string;
  duration: number;
  createdAt: string;
  exercises: LocalWorkoutExercise[];
};

const WORKOUT_EVENT = "repflow:workout-changed";

function storageKey(userId: string | undefined) {
  return `repflow_local_workouts_${userId ?? "guest"}`;
}

export function readLocalWorkouts(userId: string | undefined): LocalWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const value = localStorage.getItem(storageKey(userId));
    const workouts = value ? (JSON.parse(value) as LocalWorkout[]) : [];
    return workouts.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  } catch {
    return [];
  }
}

export function storeLocalWorkout(userId: string | undefined, workout: LocalWorkout) {
  const workouts = [workout, ...readLocalWorkouts(userId)].slice(0, 100);
  localStorage.setItem(storageKey(userId), JSON.stringify(workouts));
  window.dispatchEvent(new CustomEvent(WORKOUT_EVENT));
}

export function removeLocalWorkout(userId: string | undefined, workoutId: string) {
  const workouts = readLocalWorkouts(userId);
  const remaining = workouts.filter((workout) => workout.id !== workoutId);
  if (remaining.length === workouts.length) return false;
  localStorage.setItem(storageKey(userId), JSON.stringify(remaining));
  window.dispatchEvent(new CustomEvent(WORKOUT_EVENT));
  return true;
}

function dateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function currentStreak(workouts: LocalWorkout[]) {
  const days = new Set(workouts.map((workout) => dateKey(workout.createdAt)));
  const cursor = new Date();
  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useLocalWorkouts(userId: string | undefined) {
  const [workouts, setWorkouts] = useState<LocalWorkout[]>([]);
  const refresh = useCallback(() => setWorkouts(readLocalWorkouts(userId)), [userId]);

  useEffect(() => {
    refresh();
    window.addEventListener(WORKOUT_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(WORKOUT_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const stats = useMemo(() => {
    const volume = workouts.reduce(
      (total, workout) =>
        total +
        workout.exercises.reduce(
          (exerciseTotal, exercise) =>
            exerciseTotal +
            Number(exercise.sets || 0) * Number(exercise.reps || 0) * Number(exercise.weight || 0),
          0,
        ),
      0,
    );
    const totalMinutes = workouts.reduce((total, workout) => total + workout.duration, 0);
    const personalRecords = new Map<string, number>();
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const name = exercise.exercise.trim();
        const weight = Number(exercise.weight || 0);
        if (name && weight > (personalRecords.get(name) ?? 0)) personalRecords.set(name, weight);
      });
    });
    return {
      totalSessions: workouts.length,
      totalVolume: volume,
      totalMinutes,
      averageDuration: workouts.length ? Math.round(totalMinutes / workouts.length) : 0,
      streak: currentStreak(workouts),
      personalRecords: Array.from(personalRecords.entries())
        .map(([exercise, weight]) => ({ exercise, weight }))
        .sort((left, right) => right.weight - left.weight),
    };
  }, [workouts]);

  return { workouts, stats, refresh };
}
