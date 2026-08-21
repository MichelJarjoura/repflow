import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, LoaderCircle, Send, X } from "lucide-react";
import { feedActions } from "../application/postActions";
import { feedQueryKeys } from "../application/useFeed";

type PostComposerProps = { onPublished?: () => void };

export function PostComposer({ onPublished }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const publish = useMutation({
    mutationFn: async () => {
      const trimmedContent = content.trim();
      if (!trimmedContent) throw new Error("Write a short update before publishing your post.");
      const mediaUrls = files.length ? await feedActions.uploadMedia(files) : undefined;
      return feedActions.createPost({
        content: trimmedContent,
        communityId: undefined,
        mediaUrls,
      });
    },
    onSuccess: () => {
      setContent("");
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      void queryClient.invalidateQueries({ queryKey: feedQueryKeys.posts() });
      onPublished?.();
    },
  });

  return (
    <section className="rounded-3xl border border-brand/25 bg-card p-5 shadow-[0_0_40px_-22px_rgba(223,255,0,0.25)]">
      <div className="flex gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/15 font-display text-lg text-brand">
          +
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="post-content" className="sr-only">
            Share an update
          </label>
          <textarea
            id="post-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={2000}
            placeholder="Share a training win, a question, or your progress…"
            className="min-h-28 w-full resize-none bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground"
          />
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <span
                  key={`${file.name}-${index}`}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((current) => current.filter((_, position) => position !== index))
                    }
                    aria-label={`Remove ${file.name}`}
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand">
          <ImagePlus size={17} /> Add photo or video
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>
        <button
          type="button"
          onClick={() => publish.mutate()}
          disabled={!content.trim() || publish.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {publish.isPending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}{" "}
          Publish
        </button>
      </div>
      {publish.error && (
        <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {publish.error.message} If this says “not found”, the backend process currently running
          does not expose the public Posts route yet.
        </p>
      )}
    </section>
  );
}
