import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Check, ImagePlus, LoaderCircle, Play, Plus, Trash2, X } from "lucide-react";
import {
  optionalBackendFeaturesEnabled,
  optionalBackendFeaturesMessage,
} from "@/core/api/capabilities";
import { ApiError } from "@/core/api/client";
import { exerciseApi, mediaApi, postApi, userSessionApi } from "@/core/api/repflow";
import { profileQueryKeys } from "@/features/profile/useProfile";

type ExerciseEntry = { exerciseId: string; sets: string; reps: string; weight: string };

const newEntry = (): ExerciseEntry => ({ exerciseId: "", sets: "3", reps: "8", weight: "0" });

export function LogWorkoutCard() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [entries, setEntries] = useState<ExerciseEntry[]>([newEntry()]);
  const [postCaption, setPostCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const exercisesQuery = useQuery({
    queryKey: ["exercises"],
    queryFn: exerciseApi.getAll,
    enabled: open && optionalBackendFeaturesEnabled,
  });
  const saveMutation = useMutation({
    mutationFn: async () => {
      const selected = entries.map((entry) => ({
        exerciseId: entry.exerciseId,
        sets: Number(entry.sets),
        reps: Number(entry.reps),
        weight: Number(entry.weight),
      }));
      if (
        !selected.length ||
        selected.some(
          (entry) => !entry.exerciseId || entry.sets < 1 || entry.reps < 1 || entry.weight <= 0,
        )
      ) {
        throw new Error("Add at least one exercise with valid sets, reps, and weight.");
      }
      const exerciseMap = new Map(
        (exercisesQuery.data ?? []).map((exercise) => [exercise.id, exercise]),
      );
      const muscles = Array.from(
        new Set(
          selected.flatMap((entry) => {
            const exercise = exerciseMap.get(entry.exerciseId);
            return exercise ? [exercise.mainMuscle, ...exercise.secondaryMuscles] : [];
          }),
        ),
      );
      let session;
      try {
        session = await userSessionApi.create({
          description: description.trim() || undefined,
          muscles,
          totalDurationMinutes: Number(duration),
          exercises: selected,
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          throw new Error(
            "Workout logging is unavailable because the running backend does not expose the UserSessions endpoint. You can still share a standard progress post from the Feed.",
          );
        }
        throw error;
      }
      let mediaUrls: string[] | undefined;
      if (files.length) mediaUrls = (await mediaApi.uploadPostMedia(files)).urls;
      if (postCaption.trim()) {
        await postApi.createWithSession({
          content: postCaption.trim(),
          userSessionId: session.id,
          mediaUrls,
        });
      }
      return session;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileQueryKeys.sessions() });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      setNotice("Workout saved to your training history.");
      setEntries([newEntry()]);
      setDescription("");
      setPostCaption("");
      setFiles([]);
    },
  });

  const updateEntry = (index: number, patch: Partial<ExerciseEntry>) =>
    setEntries((current) =>
      current.map((entry, position) => (position === index ? { ...entry, ...patch } : entry)),
    );

  return (
    <>
      <div className="bg-card border border-brand/30 rounded-xl overflow-hidden shadow-[0_0_40px_-15px_rgba(223,255,0,0.1)]">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="font-display text-2xl tracking-tight mb-1">LOG WORKOUT</h2>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Record sessions, build records, and publish progress
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-brand/5 border border-brand/20 rounded-xl hover:bg-brand/10 transition-colors group"
            >
              <div className="size-12 rounded-full bg-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                <Play fill="currentColor" size={24} />
              </div>
              <span className="font-display text-lg tracking-tight">EMPTY WORKOUT</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-surface/40 border border-border rounded-xl hover:bg-surface/60 transition-colors group"
            >
              <div className="size-12 rounded-full bg-elevated flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <span className="font-display text-lg tracking-tight">BUILD SESSION</span>
            </button>
          </div>
          {notice && (
            <p className="rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand">
              {notice}
            </p>
          )}
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-x-4 top-1/2 z-[101] mx-auto max-h-[90vh] w-auto max-w-3xl -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-elevated p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Dialog.Title className="font-display text-3xl tracking-tight">
                  BUILD WORKOUT
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                  Select exercises and save a real session to the backend.
                </Dialog.Description>
              </div>
              <Dialog.Close className="rounded-full p-2 hover:bg-surface" aria-label="Close">
                <X size={18} />
              </Dialog.Close>
            </div>
            <form
              className="mt-7 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setNotice(null);
                saveMutation.mutate();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                <label className="space-y-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Session note
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="e.g. Heavy push day"
                    className="auth-input mt-1 w-full"
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">EXERCISES</h3>
                  <button
                    type="button"
                    onClick={() => setEntries((current) => [...current, newEntry()])}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
                  >
                    <Plus size={14} /> Add exercise
                  </button>
                </div>
                {exercisesQuery.isLoading && (
                  <p className="text-sm text-muted-foreground">Loading exercises…</p>
                )}
                {!optionalBackendFeaturesEnabled && (
                  <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
                    {optionalBackendFeaturesMessage}
                  </p>
                )}
                {exercisesQuery.error && (
                  <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    The running backend did not provide the exercise catalog needed for workout
                    logging. Use the Feed composer to share an update until that endpoint is
                    deployed.
                  </p>
                )}
                {entries.map((entry, index) => (
                  <div
                    key={index}
                    className="grid gap-2 rounded-2xl border border-border bg-card p-3 sm:grid-cols-[1fr_5rem_5rem_6rem_auto]"
                  >
                    <select
                      value={entry.exerciseId}
                      onChange={(event) => updateEntry(index, { exerciseId: event.target.value })}
                      className="auth-input"
                    >
                      <option value="">Choose exercise</option>
                      {(exercisesQuery.data ?? []).map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                    <input
                      aria-label="Sets"
                      type="number"
                      min="1"
                      value={entry.sets}
                      onChange={(event) => updateEntry(index, { sets: event.target.value })}
                      className="auth-input"
                      placeholder="Sets"
                    />
                    <input
                      aria-label="Reps"
                      type="number"
                      min="1"
                      value={entry.reps}
                      onChange={(event) => updateEntry(index, { reps: event.target.value })}
                      className="auth-input"
                      placeholder="Reps"
                    />
                    <input
                      aria-label="Weight in kilograms"
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={entry.weight}
                      onChange={(event) => updateEntry(index, { weight: event.target.value })}
                      className="auth-input"
                      placeholder="KG"
                    />
                    <button
                      type="button"
                      disabled={entries.length === 1}
                      onClick={() =>
                        setEntries((current) => current.filter((_, position) => position !== index))
                      }
                      className="grid place-items-center rounded-xl px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_auto]">
                <label className="space-y-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Share caption{" "}
                  <textarea
                    value={postCaption}
                    onChange={(event) => setPostCaption(event.target.value)}
                    placeholder="Optional: publish this session to your feed"
                    className="auth-input mt-1 min-h-20 w-full resize-none"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 text-sm text-muted-foreground hover:text-brand">
                  <ImagePlus size={18} /> Media
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                  />
                </label>
              </div>
              {files.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {files.length} media file{files.length === 1 ? "" : "s"} ready to upload.
                </p>
              )}
              {saveMutation.error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <p>{saveMutation.error.message}</p>
                  <Link
                    to="/feed"
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-block text-xs font-bold text-brand hover:underline"
                  >
                    Open Feed composer →
                  </Link>
                </div>
              )}
              <button
                type="submit"
                disabled={
                  saveMutation.isPending ||
                  exercisesQuery.isLoading ||
                  Boolean(exercisesQuery.error) ||
                  !optionalBackendFeaturesEnabled
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 font-bold text-brand-foreground disabled:opacity-60"
              >
                {saveMutation.isPending ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <Check size={18} />
                )}{" "}
                Save workout
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
