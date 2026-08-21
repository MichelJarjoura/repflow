export type WorkoutExercise = {
  id: string;
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
};

export type Workout = {
  id: string;
  title: string;
  duration: number;
  createdAt: string;
  exercises: WorkoutExercise[];
};

export type WorkoutPersonalRecord = {
  exercise: string;
  weight: number;
};

export type WorkoutStatistics = {
  totalSessions: number;
  totalVolume: number;
  totalMinutes: number;
  averageDuration: number;
  streak: number;
  personalRecords: WorkoutPersonalRecord[];
};
