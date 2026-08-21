import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Send, X } from "lucide-react";
import { feedActions } from "../application/postActions";
import type { SocialPost } from "@/domain/social/social";

type CommentDialogProps = {
  post: SocialPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function relativeTime(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

export function CommentDialog({ post, open, onOpenChange }: CommentDialogProps) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const comments = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => feedActions.listComments(post.id),
    enabled: open,
  });
  const addComment = useMutation({
    mutationFn: () => feedActions.addComment(post.id, comment.trim()),
    onSuccess: () => {
      setComment("");
      void queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-3 top-1/2 z-[101] mx-auto flex max-h-[82vh] w-auto max-w-xl -translate-y-1/2 flex-col rounded-3xl border border-border bg-elevated shadow-2xl">
          <header className="flex items-start justify-between gap-5 border-b border-border p-5 sm:p-6">
            <div className="min-w-0">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-brand">
                Conversation
              </p>
              <Dialog.Title className="mt-1 font-display text-3xl tracking-tighter">
                COMMENTS
              </Dialog.Title>
              <Dialog.Description className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {post.content}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-full p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
              aria-label="Close comments"
            >
              <X size={19} />
            </Dialog.Close>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            {comments.isLoading ? (
              <div className="grid min-h-36 place-items-center">
                <LoaderCircle className="animate-spin text-brand" size={23} />
              </div>
            ) : comments.data?.data.length ? (
              <div className="space-y-3">
                {comments.data.data.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm leading-6">{item.content}</p>
                    <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      @{item.authorId.slice(0, 8)} · {relativeTime(item.createdAt)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface/20 p-8 text-center text-sm text-muted-foreground">
                Start the conversation with the first comment.
              </div>
            )}
          </div>
          <form
            className="border-t border-border p-4 sm:p-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (comment.trim()) addComment.mutate();
            }}
          >
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Write a thoughtful comment"
                className="auth-input min-w-0 flex-1"
              />
              <button
                type="submit"
                disabled={!comment.trim() || addComment.isPending}
                className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground disabled:opacity-50"
                aria-label="Post comment"
              >
                {addComment.isPending ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Send size={17} />
                )}
              </button>
            </div>
            {addComment.error && (
              <p className="mt-2 text-xs text-destructive">{addComment.error.message}</p>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
