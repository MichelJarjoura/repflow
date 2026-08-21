import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Search, UserRound, UsersRound } from "lucide-react";
import { ApiError } from "@/core/api/client";
import { userApi } from "@/core/api/repflow";
import { useFeed } from "@/features/feed/useFeed";

function useDebouncedValue(value: string, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);
  return debouncedValue;
}

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const username = useDebouncedValue(query.trim().replace(/^@/, ""));
  const userSearch = useQuery({
    queryKey: ["explore", "user", username.toLowerCase()],
    queryFn: () => userApi.getByUsername(username),
    enabled: username.length >= 2,
    retry: false,
  });
  const { posts, isLoading: isFeedLoading } = useFeed(false);

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
          <label className="relative mx-auto mt-7 block max-w-xl text-left">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand" size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a username, e.g. @alexlifts"
              className="w-full rounded-2xl border border-border bg-background py-4 pl-13 pr-5 text-sm outline-none transition focus:border-brand/70 focus:ring-4 focus:ring-brand/10"
              autoComplete="off"
            />
          </label>
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
          <UserResult user={userSearch.data} />
        ) : (
          <SearchEmpty error={userSearch.error} username={username} />
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {posts.slice(0, 12).map((post) => (
              <article
                key={post.id}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />
                {post.mediaUrls[0] ? (
                  <img
                    src={post.mediaUrls[0]}
                    alt="Community post media"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-full items-end bg-[radial-gradient(circle_at_20%_20%,rgba(223,255,0,0.18),transparent_50%)] p-4">
                    <p className="line-clamp-4 text-sm font-medium leading-6">{post.content}</p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3 text-[10px] font-mono uppercase tracking-widest text-foreground/75">
                  <span>{post.likesCount} likes</span>
                  <span>{post.commentsCount} comments</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-10 text-center text-sm text-muted-foreground">
            Public posts will appear here as athletes share their training.
          </div>
        )}
      </section>
    </main>
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
        Start typing a username to find an athlete. The current backend supports exact username
        lookup, so use the account handle shown on their profile.
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

function SearchEmpty({ error, username }: { error: Error | null; username: string }) {
  const notFound = error instanceof ApiError && error.status === 404;
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-8 text-center">
      <p className="font-bold">{notFound ? "No athlete found" : "Search unavailable"}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {notFound
          ? `There is no visible account using @${username}. Check the spelling and try the exact username.`
          : "The user lookup could not be completed right now. Please try again."}
      </p>
    </div>
  );
}

function UserResult({
  user,
}: {
  user: {
    id: string;
    username: string;
    email: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
  };
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
      <span className="w-fit rounded-full border border-brand/25 bg-brand/10 px-4 py-2 text-xs font-bold text-brand">
        Athlete found
      </span>
    </article>
  );
}
