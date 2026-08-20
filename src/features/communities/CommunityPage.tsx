import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  Award,
  ChevronRight,
  Dumbbell,
  LockKeyhole,
  Plus,
  Search,
  Send,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/core/auth/useAuth";
import { AuthModal } from "@/core/auth/components/AuthModal";
import { useCommunityData } from "./communityQueries";

type CommunityTone = "brand" | "violet" | "amber";

type Community = {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  tone: CommunityTone;
  initials: string;
  joined?: boolean;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  unit: string;
  participants: number;
  daysLeft: number;
  accent: string;
};

type CommunityPost = {
  id: string;
  author: string;
  handle: string;
  body: string;
  createdAt: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function relativeTime(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

function toneClasses(tone: CommunityTone) {
  const tones = {
    brand: "bg-brand/15 text-brand border-brand/20",
    violet: "bg-violet-400/15 text-violet-300 border-violet-400/20",
    amber: "bg-amber-400/15 text-amber-300 border-amber-400/20",
  };
  return tones[tone];
}

export function CommunityPage() {
  const { isAuthenticated } = useAuth();
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const {
    communities,
    posts,
    challenges,
    createCommunity,
    joinCommunity: joinCommunityMutation,
    joinChallenge: joinChallengeMutation,
    updateParticipation: updateParticipationMutation,
    publishPost: publishPostMutation,
  } = useCommunityData(selectedCommunityId, isAuthenticated);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [postBody, setPostBody] = useState("");
  const [contribution, setContribution] = useState<Record<string, string>>({});

  const selectedCommunity =
    communities.find((community) => community.id === selectedCommunityId) ?? null;
  const visibleCommunities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return communities;
    return communities.filter((community) =>
      `${community.name} ${community.description} ${community.category}`
        .toLowerCase()
        .includes(query),
    );
  }, [communities, search]);

  const requireAuthentication = (action: () => void) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }
    action();
  };

  const joinCommunity = (id: string) => {
    requireAuthentication(() => {
      void joinCommunityMutation(id);
      setSelectedCommunityId(id);
    });
  };

  const toggleChallenge = (challengeId: string) => {
    requireAuthentication(() => {
      void joinChallengeMutation(challengeId);
    });
  };

  const addContribution = (challengeId: string, target: number) => {
    const amount = Number(contribution[challengeId]);
    if (!Number.isFinite(amount) || amount <= 0) return;
    void updateParticipationMutation({ challengeId, amount: Math.min(amount, target) });
    setContribution((current) => ({ ...current, [challengeId]: "" }));
  };

  const publishPost = () => {
    const body = postBody.trim();
    if (!body || !selectedCommunity) return;
    void publishPostMutation({ communityId: selectedCommunity.id, content: body });
    setPostBody("");
  };

  if (selectedCommunity) {
    return (
      <CommunityDetail
        community={selectedCommunity}
        posts={posts}
        challenges={challenges}
        joinedChallenges={challenges
          .filter((challenge) => challenge.isJoined)
          .map((challenge) => challenge.id)}
        progress={{}}
        contribution={contribution}
        postBody={postBody}
        isAuthenticated={isAuthenticated}
        onBack={() => setSelectedCommunityId(null)}
        onPostBodyChange={setPostBody}
        onPublishPost={() => requireAuthentication(publishPost)}
        onToggleChallenge={toggleChallenge}
        onContributionChange={(id, value) =>
          setContribution((current) => ({ ...current, [id]: value }))
        }
        onAddContribution={addContribution}
      />
    );
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-10 space-y-10">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-[0.24em] text-brand mb-3">
              Train with people who show up
            </p>
            <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-[0.9]">
              COMMUNITIES
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Find your crew, build challenges together, and share the sessions that move your
              training forward.
            </p>
          </div>
          <button
            type="button"
            onClick={() => requireAuthentication(() => setIsCreateOpen(true))}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-brand-foreground transition-transform hover:opacity-90 active:scale-[0.97]"
          >
            <Plus size={19} />
            Create community
          </button>
        </section>

        <section className="rounded-3xl border border-border bg-surface/30 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={19}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search communities, goals, or training styles"
              className="w-full rounded-2xl border border-border bg-background py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/15"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground px-2">
            <Users size={15} className="text-brand" />
            {formatNumber(
              communities.reduce((total, community) => total + community.members, 0),
            )}{" "}
            athletes training together
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl tracking-tight">YOUR SPACES</h2>
              <p className="mt-1 text-sm text-muted-foreground">The communities you have joined.</p>
            </div>
            <span className="rounded-full border border-border bg-elevated px-3 py-1 text-xs font-mono text-muted-foreground">
              {communities.filter((community) => community.joined).length} joined
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {communities
              .filter((community) => community.joined)
              .map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onOpen={() => setSelectedCommunityId(community.id)}
                  onJoin={() => joinCommunity(community.id)}
                />
              ))}
          </div>
        </section>

        <section className="space-y-5 pb-8">
          <div>
            <h2 className="font-display text-3xl tracking-tight">DISCOVER A CREW</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Join spaces built around the work you want to do next.
            </p>
          </div>
          {visibleCommunities.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  onOpen={() => setSelectedCommunityId(community.id)}
                  onJoin={() => joinCommunity(community.id)}
                />
              ))}
            </div>
          ) : (
            <EmptySearch onCreate={() => requireAuthentication(() => setIsCreateOpen(true))} />
          )}
        </section>
      </main>
      <CreateCommunityDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={(community) => {
          void createCommunity({
            name: community.name,
            description: community.description,
            isPrivate: false,
          }).then((created) => setSelectedCommunityId(created.id));
        }}
      />
      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} defaultView="signup" />
    </>
  );
}

function CommunityCard({
  community,
  onOpen,
  onJoin,
}: {
  community: Community;
  onOpen: () => void;
  onJoin: () => void;
}) {
  return (
    <article className="group rounded-3xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-xl hover:shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={onOpen}
          className={`grid size-12 place-items-center rounded-2xl border font-display text-lg ${toneClasses(community.tone)}`}
          aria-label={`Open ${community.name}`}
        >
          {community.initials}
        </button>
        <span className="rounded-full bg-elevated px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {community.category}
        </span>
      </div>
      <button type="button" onClick={onOpen} className="mt-6 block text-left">
        <h3 className="font-display text-2xl tracking-tight transition-colors group-hover:text-brand">
          {community.name}
        </h3>
        <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">
          {community.description}
        </p>
      </button>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Users size={15} /> {formatNumber(community.members)} members
        </span>
        {community.joined ? (
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand/80"
          >
            Open <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onJoin}
            className="rounded-full border border-brand/35 bg-brand/10 px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
          >
            Join
          </button>
        )}
      </div>
    </article>
  );
}

function CommunityDetail({
  community,
  posts,
  challenges,
  joinedChallenges,
  progress,
  contribution,
  postBody,
  isAuthenticated,
  onBack,
  onPostBodyChange,
  onPublishPost,
  onToggleChallenge,
  onContributionChange,
  onAddContribution,
}: {
  community: Community;
  posts: CommunityPost[];
  challenges: Challenge[];
  joinedChallenges: string[];
  progress: Record<string, number>;
  contribution: Record<string, string>;
  postBody: string;
  isAuthenticated: boolean;
  onBack: () => void;
  onPostBodyChange: (value: string) => void;
  onPublishPost: () => void;
  onToggleChallenge: (id: string) => void;
  onContributionChange: (id: string, value: string) => void;
  onAddContribution: (id: string, target: number) => void;
}) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8 md:py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={17} /> All communities
      </button>
      <section className="overflow-hidden rounded-[2rem] border border-border bg-card">
        <div className="relative min-h-52 bg-gradient-to-br from-brand/30 via-surface to-violet-950/40 p-7 sm:p-10">
          <div
            className={`grid size-16 place-items-center rounded-2xl border font-display text-2xl ${toneClasses(community.tone)}`}
          >
            {community.initials}
          </div>
          <div className="mt-8 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-brand">
              {community.category}
            </p>
            <h1 className="mt-2 font-display text-5xl tracking-tight leading-none">
              {community.name}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {community.description}
            </p>
          </div>
          <div className="absolute right-7 top-7 hidden rounded-full border border-white/10 bg-background/40 px-4 py-2 text-xs font-mono text-muted-foreground backdrop-blur-sm sm:flex sm:items-center sm:gap-2">
            <Users size={15} className="text-brand" /> {formatNumber(community.members)} members
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-brand">
                Community feed
              </p>
              <h2 className="mt-1 font-display text-3xl tracking-tight">SHARE THE WORK</h2>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5">
            <textarea
              value={postBody}
              onChange={(event) => onPostBodyChange(event.target.value)}
              placeholder={
                isAuthenticated
                  ? "Share a session, a win, or a question with the crew."
                  : "Sign in to share with this community."
              }
              disabled={!isAuthenticated}
              rows={4}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
            />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted-foreground">
                Posts are visible to all community members.
              </span>
              <button
                type="button"
                onClick={onPublishPost}
                disabled={!postBody.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} /> Publish
              </button>
            </div>
          </div>
          {posts.length ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <CommunityPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-8 text-center">
              <Sparkles className="mx-auto text-brand" size={24} />
              <h3 className="mt-3 font-display text-xl tracking-tight">START THE CONVERSATION</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Share your latest session or ask the crew for a second opinion on your next training
                block.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-5 lg:col-span-5">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-brand">Crew goals</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">CHALLENGES</h2>
          </div>
          {challenges.map((challenge) => {
            const isJoined = joinedChallenges.includes(challenge.id);
            const displayedProgress = Math.min(
              challenge.target,
              challenge.progress + (progress[challenge.id] ?? 0),
            );
            const percent = Math.round((displayedProgress / challenge.target) * 100);
            return (
              <article key={challenge.id} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-11 place-items-center rounded-2xl bg-elevated text-brand">
                    <Target size={20} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    {challenge.daysLeft} days left
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl tracking-tight">{challenge.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {challenge.description}
                </p>
                <div className="mt-5">
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <span className="font-display text-xl">
                      {formatNumber(displayedProgress)}{" "}
                      <span className="text-sm text-muted-foreground">
                        / {formatNumber(challenge.target)}
                      </span>
                    </span>
                    <span className="text-xs font-mono text-brand">{percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-elevated">
                    <div
                      className={`h-full rounded-full transition-all ${challenge.accent}`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {challenge.unit} · {challenge.participants + (isJoined ? 1 : 0)} participants
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleChallenge(challenge.id)}
                  className={`mt-5 w-full rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${isJoined ? "border border-brand/35 bg-brand/10 text-brand hover:bg-brand/15" : "bg-brand text-brand-foreground hover:opacity-90"}`}
                >
                  {isJoined ? "Joined challenge" : "Join challenge"}
                </button>
                {isJoined && (
                  <div className="mt-4 flex gap-2">
                    <input
                      value={contribution[challenge.id] ?? ""}
                      onChange={(event) => onContributionChange(challenge.id, event.target.value)}
                      type="number"
                      min="1"
                      placeholder={`Add ${challenge.unit}`}
                      className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand/60"
                    />
                    <button
                      type="button"
                      onClick={() => onAddContribution(challenge.id, challenge.target)}
                      className="rounded-xl border border-border bg-elevated px-3 text-sm font-bold transition-colors hover:text-brand"
                    >
                      Add
                    </button>
                  </div>
                )}
              </article>
            );
          })}
          <div className="rounded-3xl border border-brand/20 bg-brand/5 p-5">
            <Award size={21} className="text-brand" />
            <h3 className="mt-3 font-display text-xl tracking-tight">EVERY REP COUNTS</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Challenge totals rise with every contribution from the community. Join a crew goal and
              make your training part of something bigger.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-brand/15 text-sm font-bold text-brand">
          {post.author.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold">{post.author}</p>
          <p className="text-xs text-muted-foreground">
            {post.handle} · {relativeTime(post.createdAt)}
          </p>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/90">{post.body}</p>
    </article>
  );
}

function EmptySearch({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/20 px-6 py-12 text-center">
      <Search className="mx-auto text-muted-foreground" size={25} />
      <h3 className="mt-4 font-display text-2xl tracking-tight">NO CREWS FOUND</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Try a different search, or make space for the crew you want to train with.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-full border border-brand/35 px-5 py-2.5 text-sm font-bold text-brand hover:bg-brand/10"
      >
        Create community
      </button>
    </div>
  );
}

function CreateCommunityDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onCreate: (community: Community) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Strength training");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName) return;
    const initials = normalizedName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.slice(0, 1).toUpperCase())
      .join("");
    onCreate({
      id: `community-${Date.now()}`,
      name: normalizedName,
      description:
        description.trim() || "A new community committed to showing up and improving together.",
      members: 1,
      category,
      tone: "brand",
      initials: initials || "RC",
      joined: true,
    });
    setName("");
    setDescription("");
    setCategory("Strength training");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <Dialog.Title className="font-display text-3xl tracking-tight">
                CREATE A CREW
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                Set the purpose. Invite the people. Build the work together.
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-full p-2 text-muted-foreground hover:bg-elevated hover:text-foreground">
              <X size={19} />
            </Dialog.Close>
          </div>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <FormField label="Community name">
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Early Morning Barbell"
                className="community-input"
              />
            </FormField>
            <FormField label="What is this crew about?">
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Share the training goal, members, or atmosphere you want to create."
                rows={3}
                className="community-input resize-none"
              />
            </FormField>
            <FormField label="Training focus">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="community-input"
              >
                <option>Strength training</option>
                <option>Powerlifting</option>
                <option>Bodybuilding</option>
                <option>Running</option>
                <option>General fitness</option>
              </select>
            </FormField>
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 font-bold text-brand-foreground transition-opacity hover:opacity-90"
            >
              <Users size={18} /> Create community
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="ml-1 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export function CommunitiesAccessNotice() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-elevated px-3 py-1.5 text-xs text-muted-foreground">
      <LockKeyhole size={14} /> Sign in to create, join, and contribute.
    </div>
  );
}
