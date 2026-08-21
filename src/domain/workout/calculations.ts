import type { Workout, WorkoutStatistics } from "./workout";

export function calculateWorkoutVolume(workout: Workout) {
  return workout.exercises.reduce(
    (total, exercise) =>
      total +
      Number(exercise.sets || 0) * Number(exercise.reps || 0) * Number(exercise.weight || 0),
    0,
  );
}

function dateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

export function calculateCurrentWorkoutStreak(workouts: Workout[]) {
  const days = new Set(workouts.map((workout) => dateKey(workout.createdAt)));
  const cursor = new Date();
  let streak = 0;
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function calculateWorkoutStatistics(workouts: Workout[]): WorkoutStatistics {
  const totalVolume = workouts.reduce(
    (total, workout) => total + calculateWorkoutVolume(workout),
    0,
  );
  const totalMinutes = workouts.reduce((total, workout) => total + workout.duration, 0);
  const records = new Map<string, number>();
  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const name = exercise.exercise.trim();
      const weight = Number(exercise.weight || 0);
      if (name && weight > (records.get(name) ?? 0)) records.set(name, weight);
    });
  });
  return {
    totalSessions: workouts.length,
    totalVolume,
    totalMinutes,
    averageDuration: workouts.length ? Math.round(totalMinutes / workouts.length) : 0,
    streak: calculateCurrentWorkoutStreak(workouts),
    personalRecords: Array.from(records.entries())
      .map(([exercise, weight]) => ({ exercise, weight }))
      .sort((left, right) => right.weight - left.weight),
  };
}
