import type { Workout } from "@/domain/workout/workout";

const workoutChangedEvent = "repflow:workout-changed";

function storageKey(userId: string | undefined) {
  return `repflow_local_workouts_${userId ?? "guest"}`;
}

function notifyWorkoutChange() {
  window.dispatchEvent(new CustomEvent(workoutChangedEvent));
}

export const localWorkoutStore = {
  eventName: workoutChangedEvent,
  list(userId: string | undefined): Workout[] {
    if (typeof window === "undefined") return [];
    try {
      const value = localStorage.getItem(storageKey(userId));
      const workouts = value ? (JSON.parse(value) as Workout[]) : [];
      return workouts.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    } catch {
      return [];
    }
  },
  save(userId: string | undefined, workout: Workout) {
    const workouts = [workout, ...this.list(userId)].slice(0, 100);
    localStorage.setItem(storageKey(userId), JSON.stringify(workouts));
    notifyWorkoutChange();
  },
  remove(userId: string | undefined, workoutId: string) {
    const workouts = this.list(userId);
    const remaining = workouts.filter((workout) => workout.id !== workoutId);
    if (remaining.length === workouts.length) return false;
    localStorage.setItem(storageKey(userId), JSON.stringify(remaining));
    notifyWorkoutChange();
    return true;
  },
};
