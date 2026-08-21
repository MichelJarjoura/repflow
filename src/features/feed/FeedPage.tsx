import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  LoaderCircle,
  MessageCircle,
  PlusCircle,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";
import { IdentityCard } from "./components/IdentityCard";
import { RightRail } from "./components/RightRail";
import { FeedFilter } from "./components/FeedFilter";
import { PostComposer } from "./components/PostComposer";
import { useFeed } from "./useFeed";
import { useAuth } from "@/core/auth/useAuth";
import { AuthModal } from "@/core/auth/components/AuthModal";
import { ApiError } from "@/core/api/client";
import { commentsApi, postApi, userApi, type BackendPost } from "@/core/api/repflow";
import type { AuthenticatedUser } from "@/core/api/auth";

function relativeTime(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

export function FeedPage() {
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { posts, isLoading, error, refetch, toggleLike } = useFeed(isAuthenticated);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8 space-y-6">
        <div className="hidden lg:block">
          <h1 className="font-display text-4xl tracking-tight mb-1">FEED</h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Progress &middot; Not Entertainment
          </p>
        </div>
        {!isAuthenticated ? (
          <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-brand/20 flex items-center justify-center text-brand shrink-0">
                <PlusCircle size={28} />
              </div>
              <div>
                <h3 className="font-display text-xl tracking-tight text-foreground uppercase">
                  Share your progress
                </h3>
                <p className="text-muted-foreground text-sm">
                  Sign in to view your personalized training feed and join the conversation.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-brand text-brand-foreground font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        ) : (
          <>
            <PostComposer onPublished={() => void refetch()} />
            <FeedFilter />
            {isLoading && <FeedLoading />}
            {error && <FeedError error={error} onRetry={() => void refetch()} />}
            {!isLoading && !error && posts.length === 0 && <FeedEmpty />}
            {posts.map((post) => (
              <BackendFeedPost key={post.id} post={post} viewer={user} onToggleLike={toggleLike} />
            ))}
          </>
        )}
      </section>
      <div className="lg:col-span-4 hidden lg:block">
        <div className="sticky top-8 space-y-6">
          <IdentityCard />
          <RightRail />
        </div>
      </div>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} defaultView="signup" />
    </div>
  );
}

function BackendFeedPost({
  post,
  onToggleLike,
  viewer,
}: {
  post: BackendPost;
  onToggleLike: (id: string) => void;
  viewer: AuthenticatedUser | null;
}) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const isViewer = viewer?.id === post.authorId;
  const authorQuery = useQuery({
    queryKey: ["post-author", post.authorId],
    queryFn: () => userApi.getById(post.authorId),
    enabled: !isViewer,
  });
  const authorName = isViewer ? viewer.name : (authorQuery.data?.username ?? "Repflow athlete");
  const authorHandle = isViewer ? viewer.username : `@${post.authorId.slice(0, 8)}`;
  const authorAvatar = isViewer ? viewer.avatar : authorQuery.data?.profilePictureUrl;
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const comments = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => commentsApi.getForPost(post.id),
    enabled: commentsOpen,
  });
  const addComment = useMutation({
    mutationFn: () => postApi.addComment(post.id, comment.trim()),
    onSuccess: () => {
      setComment("");
      void queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
  const deletePost = useMutation({
    mutationFn: () => postApi.remove(post.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
  return (
    <article className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center overflow-hidden rounded-full bg-brand/15 font-display text-lg text-brand">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="size-full object-cover" />
          ) : (
            authorName.slice(0, 1).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">{authorName}</p>
          <p className="text-xs text-muted-foreground">
            {authorHandle} · {relativeTime(post.createdAt)}
          </p>
        </div>
        {isViewer && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Delete this post? This action cannot be undone."))
                deletePost.mutate();
            }}
            disabled={deletePost.isPending}
            aria-label="Delete your post"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            {deletePost.isPending ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}
          </button>
        )}
      </div>
      <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-foreground/90">
        {post.content}
      </p>
      {post.mediaUrls.length > 0 && (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {post.mediaUrls.map((url) => (
            <img
              key={url}
              src={url}
              alt="Post media"
              className="h-44 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center gap-5 border-t border-border pt-4 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className={`inline-flex items-center gap-2 transition-colors hover:text-brand ${post.isLikedByCurrentUser ? "text-brand" : ""}`}
          aria-label={post.isLikedByCurrentUser ? "Unlike post" : "Like post"}
        >
          <Heart size={18} fill={post.isLikedByCurrentUser ? "currentColor" : "none"} />{" "}
          {post.likesCount}
        </button>
        <button
          type="button"
          onClick={() => setCommentsOpen((current) => !current)}
          className="inline-flex items-center gap-2 transition-colors hover:text-brand"
        >
          <MessageCircle size={18} /> {post.commentsCount}
        </button>
      </div>
      {deletePost.error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {deletePost.error.message}
        </p>
      )}
      {commentsOpen && (
        <div className="mt-5 border-t border-border pt-4">
          <div className="space-y-3">
            {comments.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading comments…</p>
            ) : comments.data?.data.length ? (
              comments.data.data.map((item) => (
                <div key={item.id} className="rounded-xl bg-surface/30 p-3">
                  <p className="text-sm">{item.content}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    @{item.authorId.slice(0, 8)} · {relativeTime(item.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Be the first to comment.</p>
            )}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (comment.trim()) addComment.mutate();
            }}
          >
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a comment"
              className="auth-input flex-1"
            />
            <button
              type="submit"
              disabled={!comment.trim() || addComment.isPending}
              className="grid size-10 place-items-center rounded-xl bg-brand text-brand-foreground"
            >
              <Send size={16} />
            </button>
          </form>
          {addComment.error && (
            <p className="mt-2 text-xs text-destructive">{addComment.error.message}</p>
          )}
        </div>
      )}
    </article>
  );
}

function FeedLoading() {
  return (
    <div className="grid min-h-56 place-items-center rounded-3xl border border-border bg-card">
      <LoaderCircle className="animate-spin text-brand" size={26} />
    </div>
  );
}
function FeedError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const message =
    error instanceof ApiError && error.status === 404
      ? "The running backend does not expose a public Posts route, so community posts can work while the global feed stays unavailable."
      : "The feed could not be loaded from the backend.";
  return (
    <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-center">
      <p className="text-sm text-destructive">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground hover:text-brand"
      >
        <RefreshCw size={15} /> Try again
      </button>
    </div>
  );
}
function FeedEmpty() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-9 text-center">
      <h3 className="font-display text-2xl tracking-tight">YOUR FEED IS READY</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Follow athletes or join communities to see shared training progress here.
      </p>
    </div>
  );
}
