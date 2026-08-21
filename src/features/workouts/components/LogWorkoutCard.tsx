import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronRight, Clock3, Dumbbell, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { shareWorkoutToFeed } from "../application/shareWorkout";
import { useAuth } from "@/app/auth/useAuth";
import {
  readLocalWorkouts,
  storeLocalWorkout,
  type LocalWorkout,
  type LocalWorkoutExercise,
} from "../application/useWorkoutHistory";

type WorkoutSet = LocalWorkoutExercise;

const newSet = (): WorkoutSet => ({
  id: crypto.randomUUID(),
  exercise: "",
  sets: "3",
  reps: "8",
  weight: "",
});

export function LogWorkoutCard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Strength session");
  const [duration, setDuration] = useState("60");
  const [exercises, setExercises] = useState<WorkoutSet[]>([newSet()]);
  const [shareToFeed, setShareToFeed] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(() => readLocalWorkouts(user?.id).length);
  const queryClient = useQueryClient();

  const estimatedVolume = useMemo(
    () =>
      exercises.reduce(
        (total, exercise) =>
          total +
          Number(exercise.sets || 0) * Number(exercise.reps || 0) * Number(exercise.weight || 0),
        0,
      ),
    [exercises],
  );

  const saveWorkout = useMutation({
    mutationFn: async () => {
      const completedExercises = exercises.filter((exercise) => exercise.exercise.trim());
      if (!completedExercises.length)
        throw new Error("Add at least one exercise to save your workout.");
      if (
        completedExercises.some(
          (exercise) => Number(exercise.sets) < 1 || Number(exercise.reps) < 1,
        )
      ) {
        throw new Error("Each exercise needs at least one set and one rep.");
      }

      const workout: LocalWorkout = {
        id: crypto.randomUUID(),
        title: title.trim() || "Strength session",
        duration: Math.max(1, Number(duration) || 60),
        createdAt: new Date().toISOString(),
        exercises: completedExercises,
      };
      storeLocalWorkout(user?.id, workout);

      let published = false;
      if (shareToFeed) {
        const lines = completedExercises.map(
          (exercise) =>
            `• ${exercise.exercise}: ${exercise.sets} × ${exercise.reps}${exercise.weight ? ` @ ${exercise.weight} kg` : ""}`,
        );
        const summary = `${workout.title}\n${workout.duration} min · ${Math.round(estimatedVolume).toLocaleString()} kg volume\n\n${lines.join("\n")}`;
        try {
          await shareWorkoutToFeed(summary);
          published = true;
        } catch {
          // The workout remains safely stored in the browser if the active backend does not publish posts.
        }
      }
      return { workout, published };
    },
    onSuccess: ({ published }) => {
      setSavedCount(readLocalWorkouts(user?.id).length);
      setNotice(
        published ? "Workout saved and shared to your feed." : "Workout saved on this device.",
      );
      setExercises([newSet()]);
      setTitle("Strength session");
      setDuration("60");
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const updateExercise = (id: string, patch: Partial<WorkoutSet>) =>
    setExercises((current) =>
      current.map((exercise) => (exercise.id === id ? { ...exercise, ...patch } : exercise)),
    );

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-brand/25 bg-card shadow-[0_20px_60px_-35px_rgba(223,255,0,0.45)]">
        <div className="bg-[radial-gradient(circle_at_90%_0%,rgba(223,255,0,0.18),transparent_42%)] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-lg">
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-brand">
                Training log
              </p>
              <h2 className="mt-2 font-display text-4xl tracking-tighter">LOG YOUR WORKOUT</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A quick, distraction-free place to capture your work. Your log is saved to this
                device and can be shared as a feed post in one step.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3.5 font-bold text-brand-foreground transition-transform hover:opacity-90 active:scale-[0.97]"
            >
              Start logging <ChevronRight size={18} />
            </button>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Metric icon={Dumbbell} label="Saved logs" value={String(savedCount)} />
            <Metric icon={Clock3} label="Default time" value="60 min" />
            <Metric icon={Check} label="Sharing" value="Optional" />
          </div>
          {notice && (
            <p className="mt-5 rounded-2xl border border-brand/25 bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
              {notice}
            </p>
          )}
        </div>
      </section>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/85 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-x-3 top-1/2 z-[101] mx-auto max-h-[92vh] w-auto max-w-3xl -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-elevated p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-brand">
                  Quick log
                </p>
                <Dialog.Title className="mt-1 font-display text-4xl tracking-tighter">
                  What did you train?
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                  Add your exercises, then choose whether to share the completed session.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close workout logger"
                className="rounded-full p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X size={20} />
              </Dialog.Close>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setNotice(null);
                saveWorkout.mutate();
              }}
              className="mt-7 space-y-6"
            >
              <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
                <label className="space-y-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Workout name
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="auth-input mt-1 w-full"
                    placeholder="e.g. Upper body"
                  />
                </label>
                <label className="space-y-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Minutes
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    className="auth-input mt-1 w-full"
                  />
                </label>
              </div>

              <div className="rounded-3xl border border-border bg-card/60 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl">Exercises</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Keep it simple: name, sets, reps, weight.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExercises((current) => [...current, newSet()])}
                    className="inline-flex items-center gap-1 rounded-xl border border-brand/30 px-3 py-2 text-xs font-bold text-brand hover:bg-brand/10"
                  >
                    <Plus size={15} /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="hidden grid-cols-[1fr_4.5rem_4.5rem_5.5rem_auto] gap-2 px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground sm:grid">
                    <span>Exercise</span>
                    <span>Sets</span>
                    <span>Reps</span>
                    <span>Weight (kg)</span>
                    <span aria-hidden="true" />
                  </div>
                  {exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="grid gap-2 rounded-2xl border border-border bg-surface/30 p-3 sm:grid-cols-[1fr_4.5rem_4.5rem_5.5rem_auto]"
                    >
                      <label className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground sm:hidden">
                          Exercise
                        </span>
                        <input
                          value={exercise.exercise}
                          onChange={(event) =>
                            updateExercise(exercise.id, { exercise: event.target.value })
                          }
                          placeholder={index === 0 ? "e.g. Barbell squat" : "Exercise name"}
                          className="auth-input w-full"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground sm:hidden">
                          Sets
                        </span>
                        <input
                          aria-label="Sets"
                          type="number"
                          min="1"
                          value={exercise.sets}
                          onChange={(event) =>
                            updateExercise(exercise.id, { sets: event.target.value })
                          }
                          className="auth-input w-full"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground sm:hidden">
                          Reps
                        </span>
                        <input
                          aria-label="Reps"
                          type="number"
                          min="1"
                          value={exercise.reps}
                          onChange={(event) =>
                            updateExercise(exercise.id, { reps: event.target.value })
                          }
                          className="auth-input w-full"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground sm:hidden">
                          Weight (kg)
                        </span>
                        <input
                          aria-label="Weight in kilograms"
                          type="number"
                          min="0"
                          step="0.5"
                          value={exercise.weight}
                          onChange={(event) =>
                            updateExercise(exercise.id, { weight: event.target.value })
                          }
                          placeholder="0"
                          className="auth-input w-full"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={exercises.length === 1}
                        onClick={() =>
                          setExercises((current) =>
                            current.filter((item) => item.id !== exercise.id),
                          )
                        }
                        className="grid place-items-center rounded-xl px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                        aria-label="Remove exercise"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface/25 p-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={shareToFeed}
                    onChange={(event) => setShareToFeed(event.target.checked)}
                    className="size-4 accent-[var(--color-brand)]"
                  />
                  <span>
                    <strong className="block text-sm">Share to your feed</strong>
                    <span className="text-xs text-muted-foreground">
                      Creates a simple progress post after this log is saved.
                    </span>
                  </span>
                </label>
                <p className="text-sm font-mono text-brand">
                  {Math.round(estimatedVolume).toLocaleString()} KG volume
                </p>
              </div>
              {saveWorkout.error && (
                <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {saveWorkout.error.message}
                </p>
              )}
              <button
                type="submit"
                disabled={saveWorkout.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 font-bold text-brand-foreground transition-transform hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {saveWorkout.isPending ? (
                  <LoaderCircle className="animate-spin" size={19} />
                ) : (
                  <Check size={19} />
                )}{" "}
                Save workout{shareToFeed ? " & share" : ""}
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Dumbbell;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
      <Icon size={17} className="text-brand" />
      <p className="mt-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl tracking-tight">{value}</p>
    </div>
  );
}
