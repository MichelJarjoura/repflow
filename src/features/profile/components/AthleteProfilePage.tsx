import { LoaderCircle, UserPlus, UsersRound } from "lucide-react";
import { useAuth } from "@/app/auth/useAuth";
import { useAthleteProfile } from "../application/profileActions";
import { useFeed } from "@/features/feed/application/useFeed";

type AthleteProfilePageProps = { userId: string };

export function AthleteProfilePage({ userId }: AthleteProfilePageProps) {
  const { user: viewer, isAuthenticated } = useAuth();
  const { athlete, following, toggleFollow } = useAthleteProfile(
    userId,
    isAuthenticated,
    viewer?.id,
  );
  const { posts, isLoading: isPostsLoading } = useFeed(isAuthenticated);

  if (athlete.isLoading)
    return (
      <main className="grid min-h-80 place-items-center">
        <LoaderCircle className="animate-spin text-brand" size={28} />
      </main>
    );
  if (!athlete.data)
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-10 text-center text-muted-foreground">
          This athlete profile is not available.
        </div>
      </main>
    );

  const profile = athlete.data;
  const athletePosts = posts.filter((post) => post.authorId === userId);
  const isFollowing = following.data?.includes(userId) ?? false;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 pb-24 sm:px-6 md:pb-10">
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <div className="h-36 bg-[radial-gradient(circle_at_80%_20%,rgba(223,255,0,0.26),transparent_30%),linear-gradient(135deg,rgba(139,92,246,0.24),transparent_70%)]" />
        <div className="relative px-6 pb-7 sm:px-10">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 items-end gap-4">
              <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-card bg-brand/10 font-display text-4xl text-brand">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="size-full object-cover" />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 pb-1">
                <h1 className="truncate font-display text-4xl tracking-tighter sm:text-5xl">
                  {profile.username}
                </h1>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-brand">
                  @{profile.username}
                </p>
              </div>
            </div>
            {viewer?.id !== userId && (
              <button
                type="button"
                onClick={() => toggleFollow.mutate()}
                disabled={toggleFollow.isPending}
                className={`inline-flex w-fit items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-opacity disabled:opacity-50 ${isFollowing ? "border border-brand/30 bg-brand/10 text-brand" : "bg-brand text-brand-foreground hover:opacity-90"}`}
              >
                {toggleFollow.isPending ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <UserPlus size={17} />
                )}
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
          {profile.bio && (
            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground">{profile.bio}</p>
          )}
          {toggleFollow.error && (
            <p className="mt-4 text-sm text-destructive">{toggleFollow.error.message}</p>
          )}
        </div>
      </section>
      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-brand">
              Training shared
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">POSTS</h2>
          </div>
          <UsersRound className="text-brand" size={22} />
        </div>
        {isPostsLoading ? (
          <div className="grid min-h-40 place-items-center rounded-3xl border border-border bg-card">
            <LoaderCircle className="animate-spin text-brand" size={24} />
          </div>
        ) : athletePosts.length ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {athletePosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7">{post.content}</p>
                </div>
                {post.mediaUrls.length > 0 && (
                  <div className="grid gap-px bg-border sm:grid-cols-2">
                    {post.mediaUrls.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt="Athlete post media"
                        className="h-64 w-full object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
                <div className="flex gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground">
                  <span>{post.likesCount} likes</span>
                  <span>{post.commentsCount} comments</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-10 text-center text-sm text-muted-foreground">
            This athlete has no visible posts yet.
          </div>
        )}
      </section>
    </main>
  );
}
