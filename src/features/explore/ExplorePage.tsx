import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Heart, LoaderCircle, MessageCircle, Search, UserRound, UsersRound, X } from "lucide-react";
import { ApiError } from "@/core/api/client";
import { userApi, type BackendPost } from "@/core/api/repflow";
import { useFeed } from "@/features/feed/useFeed";
import { useAuth } from "@/core/auth/useAuth";

export function ExplorePage() {
  const { user: viewer } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("");
  const [selectedPost, setSelectedPost] = useState<BackendPost | null>(null);
  const userSearch = useQuery({
    queryKey: ["explore", "user", username.toLowerCase()],
    queryFn: async () => {
      try {
        return await userApi.getByUsername(username);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    enabled: username.length >= 2,
    retry: false,
  });
  const { posts, isLoading: isFeedLoading } = useFeed(false);
  const openProfile = (userId: string) => {
    if (viewer?.id === userId) void navigate({ to: "/profile" });
    else void navigate({ to: "/profile/$userId", params: { userId } });
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 pb-24 sm:px-6 md:pb-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-10 sm:px-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(223,255,0,0.16),transparent_26%),radial-gradient(circle_at_10%_100%,rgba(139,92,246,0.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-brand">
            Find your training people
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-tighter sm:text-6xl">EXPLORE</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
            Search for a Repflow athlete by username, then discover the training posts shared across
            the community.
          </p>
          <form
            className="relative mx-auto mt-7 flex max-w-xl gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setUsername(query.trim().replace(/^@/, ""));
            }}
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand" size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the exact username, e.g. @alexlifts"
              className="min-w-0 flex-1 rounded-2xl border border-border bg-background py-4 pl-13 pr-5 text-sm outline-none transition focus:border-brand/70 focus:ring-4 focus:ring-brand/10"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={query.trim().replace(/^@/, "").length < 2}
              className="rounded-2xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-brand">
              Athlete search
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">FIND A MEMBER</h2>
          </div>
          {username && (
            <span className="text-xs text-muted-foreground">Searching for @{username}</span>
          )}
        </div>
        {username.length < 2 ? (
          <SearchHint />
        ) : userSearch.isLoading ? (
          <LoadingCard />
        ) : userSearch.data ? (
          <UserResult
            user={userSearch.data}
            isSelf={viewer?.id === userSearch.data.id}
            onOpenProfile={() => openProfile(userSearch.data.id)}
          />
        ) : (
          <SearchEmpty unavailable={userSearch.isError} username={username} />
        )}
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-brand">
              From the community
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">DISCOVER POSTS</h2>
          </div>
          <UsersRound size={22} className="text-brand" />
        </div>
        {isFeedLoading ? (
          <LoadingCard />
        ) : posts.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {posts.slice(0, 12).map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="group overflow-hidden rounded-3xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-xl hover:shadow-black/15"
                >
                  {post.mediaUrls[0] ? (
                    <img
                      src={post.mediaUrls[0]}
                      alt="Community post media"
                      className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-48 items-end bg-[radial-gradient(circle_at_20%_20%,rgba(223,255,0,0.2),transparent_50%)] p-5">
                      <p className="line-clamp-5 text-sm font-medium leading-6">{post.content}</p>
                    </div>
                  )}
                  <div className="p-5">
                    <p className="line-clamp-3 text-sm leading-6">{post.content}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Heart size={14} /> {post.likesCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle size={14} /> {post.commentsCount}
                      </span>
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-brand">
                        View
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <PostPreviewDialog
              post={selectedPost}
              onOpenChange={(open) => {
                if (!open) setSelectedPost(null);
              }}
            />
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-10 text-center text-sm text-muted-foreground">
            Public posts will appear here as athletes share their training.
          </div>
        )}
      </section>
    </main>
  );
}

function PostPreviewDialog({
  post,
  onOpenChange,
}: {
  post: BackendPost | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={Boolean(post)} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-3 top-1/2 z-[101] mx-auto max-h-[88vh] w-auto max-w-3xl -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-elevated shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-elevated/95 p-5 backdrop-blur">
            <div>
              <Dialog.Title className="font-display text-3xl tracking-tighter">POST</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-muted-foreground">
                Shared with the Repflow community
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-full p-2 text-muted-foreground hover:bg-surface hover:text-foreground"
              aria-label="Close post"
            >
              <X size={19} />
            </Dialog.Close>
          </div>
          {post && (
            <article>
              <div className="p-5 sm:p-7">
                <p className="whitespace-pre-wrap text-sm leading-7">{post.content}</p>
              </div>
              {post.mediaUrls.length > 0 && (
                <div className="grid gap-1 bg-border sm:grid-cols-2">
                  {post.mediaUrls.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="Post media"
                      className="max-h-[60vh] w-full object-cover"
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-5 border-t border-border p-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Heart size={17} /> {post.likesCount} likes
                </span>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={17} /> {post.commentsCount} comments
                </span>
              </div>
            </article>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SearchHint() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-8 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
        <UserRound size={22} />
      </div>
      <p className="mt-4 font-bold">Search by username</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Enter an athlete’s complete username, then select Search. The current backend supports exact
        username lookup, so use the account handle shown on their profile.
      </p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="grid min-h-36 place-items-center rounded-3xl border border-border bg-card">
      <LoaderCircle size={25} className="animate-spin text-brand" />
    </div>
  );
}

function SearchEmpty({ unavailable, username }: { unavailable: boolean; username: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-8 text-center">
      <p className="font-bold">{unavailable ? "Search unavailable" : "No athlete found"}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {unavailable
          ? "The user lookup could not be completed right now. Please try again."
          : `There is no visible account using @${username}. Check the spelling and try the exact username.`}
      </p>
    </div>
  );
}

function UserResult({
  user,
  isSelf,
  onOpenProfile,
}: {
  user: {
    id: string;
    username: string;
    email: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
  };
  isSelf: boolean;
  onOpenProfile: () => void;
}) {
  return (
    <article className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-brand/10 font-display text-2xl text-brand">
          {user.profilePictureUrl ? (
            <img src={user.profilePictureUrl} alt="" className="size-full object-cover" />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-3xl tracking-tight">{user.username}</p>
          <p className="mt-1 text-xs font-mono uppercase tracking-widest text-brand">
            @{user.username}
          </p>
          {user.bio && (
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{user.bio}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenProfile}
        className="w-fit rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground transition-opacity hover:opacity-90"
      >
        {isSelf ? "Open your profile" : "View profile"}
      </button>
    </article>
  );
}
