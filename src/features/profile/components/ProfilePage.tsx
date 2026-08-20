import * as Tabs from "@radix-ui/react-tabs";
import {
  Award,
  BarChart3,
  Calendar,
  Grid,
  Settings,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/core/auth/useAuth";
import { useProfile } from "../useProfile";

function relativeTime(value: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { profile, posts, physicalData, sessions, isLoading, error } = useProfile(
    user?.id,
    isAuthenticated,
  );
  const displayName = profile?.username ?? user?.name ?? "Repflow athlete";
  const handle = profile?.username ?? user?.username ?? "@athlete";
  const records = physicalData?.personalRecords ?? [];

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 md:px-8">
      <div className="relative h-48 md:h-64 mt-6 rounded-3xl overflow-hidden bg-linear-to-br from-brand/30 via-surface to-background border border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(223,255,0,0.1),transparent)]" />
      </div>

      <div className="relative -mt-20 md:-mt-24 px-4 md:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="grid size-32 md:size-48 place-items-center rounded-3xl border-4 border-background bg-card overflow-hidden shadow-2xl relative z-10">
            {profile?.profilePictureUrl || user?.avatar ? (
              <img
                src={profile?.profilePictureUrl ?? user?.avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display text-5xl text-brand">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="pb-2 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-4xl md:text-5xl tracking-tighter">{displayName}</h1>
              <span className="bg-brand/10 text-brand text-[10px] font-mono px-2 py-0.5 rounded-full border border-brand/20 uppercase tracking-widest">
                Athlete
              </span>
            </div>
            <p className="text-muted-foreground font-mono text-sm tracking-tight">{handle}</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-bold hover:bg-elevated">
          <Settings size={17} /> Edit profile
        </button>
      </div>

      <div className="flex flex-col lg:grid-cols-12 gap-12 mt-12 px-4 md:px-10">
        <div className="lg:col-span-8 space-y-3">
          <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
            Athletic Bio
          </h2>
          <p className="text-lg text-foreground/90 leading-relaxed font-light">
            {profile?.bio ||
              "Add a training bio to introduce your goals, discipline, and progress to the Repflow community."}
          </p>
        </div>
        <div className="flex flex-row gap-6 justify-center">
          <StatHighlight icon={<Grid size={16} />} label="Posts" value={String(posts.length)} />
          <StatHighlight
            icon={<Calendar size={16} />}
            label="Sessions"
            value={String(sessions.length)}
          />
          <StatHighlight
            icon={<Award size={16} />}
            label="Records"
            value={String(records.length)}
          />
        </div>
      </div>

      {error && (
        <p className="mx-4 md:mx-10 mt-8 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Some profile data could not be loaded from the backend.
        </p>
      )}
      <Tabs.Root defaultValue="posts" className="mt-16">
        <Tabs.List className="flex border-b border-border px-4 md:px-10 overflow-x-auto no-scrollbar gap-2">
          <TabTrigger value="posts" icon={Grid} label="Feed" />
          <TabTrigger value="stats" icon={BarChart3} label="Sessions" />
          <TabTrigger value="prs" icon={Trophy} label="Records" />
        </Tabs.List>
        <div className="px-4 md:px-10 pt-8">
          <Tabs.Content value="posts" className="focus:outline-hidden">
            {isLoading ? (
              <LoadingPanel />
            ) : posts.length === 0 ? (
              <EmptyPanel text="Your published workout and community posts will appear here." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <article key={post.id} className="rounded-3xl border border-border bg-card p-6">
                    <p className="whitespace-pre-wrap text-sm leading-7">{post.content}</p>
                    <div className="mt-5 flex gap-4 text-xs text-muted-foreground">
                      <span>{relativeTime(post.createdAt)}</span>
                      <span>{post.likesCount} likes</span>
                      <span>{post.commentsCount} comments</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Tabs.Content>
          <Tabs.Content value="stats" className="focus:outline-hidden">
            {sessions.length === 0 ? (
              <EmptyPanel text="Logged workouts from the backend will appear here." />
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
                  >
                    <div>
                      <p className="font-bold">{session.description || "Workout session"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {session.muscles.join(" · ") || "General training"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-brand">{session.totalDuration} min</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs.Content>
          <Tabs.Content value="prs" className="focus:outline-hidden">
            {records.length === 0 ? (
              <EmptyPanel text="Personal records from your physical-data profile will appear here." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {records.map((record) => (
                  <div
                    key={`${record.exerciseId}-${record.date}`}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      {record.exerciseName}
                    </p>
                    <p className="mt-2 font-display text-4xl text-brand">{record.maxWeightKg} KG</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}

function TabTrigger({
  value,
  icon: Icon,
  label,
}: {
  value: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="group relative flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-all focus:outline-hidden data-[state=active]:text-brand"
    >
      <Icon size={16} className="group-data-[state=active]:scale-110 transition-transform" />
      <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand scale-x-0 group-data-[state=active]:scale-x-100 transition-transform origin-left" />
    </Tabs.Trigger>
  );
}

function StatHighlight({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-2xl border border-border/50 bg-surface/30 p-4 lg:flex-col lg:items-start lg:gap-1">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </div>
      <p className="ml-auto font-display text-2xl tracking-tight lg:ml-0">{value}</p>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="rounded-3xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
      Loading profile data…
    </div>
  );
}
function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/20 p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
