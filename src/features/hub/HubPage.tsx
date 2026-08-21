import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  ClipboardList,
  MessageCircle,
  Send,
  Star,
  UserPlus,
  UsersRound,
} from "lucide-react";
import {
  optionalBackendFeaturesEnabled,
  optionalBackendFeaturesMessage,
} from "@/core/api/capabilities";
import {
  chatApi,
  coachApi,
  followApi,
  notificationApi,
  workoutPlanningApi,
} from "@/core/api/repflow";

const hubKeys = {
  notifications: ["hub", "notifications"] as const,
  following: ["hub", "following"] as const,
  followers: ["hub", "followers"] as const,
  coaches: ["hub", "coaches"] as const,
  templates: ["hub", "templates"] as const,
  plans: ["hub", "plans"] as const,
  messages: (id: string) => ["hub", "messages", id] as const,
};

export function HubPage() {
  const queryClient = useQueryClient();
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [followTarget, setFollowTarget] = useState("");
  const [coachMessage, setCoachMessage] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateDays, setTemplateDays] = useState("7");
  const [planName, setPlanName] = useState("");
  const [planTemplateId, setPlanTemplateId] = useState("");

  const notifications = useQuery({
    queryKey: hubKeys.notifications,
    queryFn: notificationApi.getAll,
    enabled: optionalBackendFeaturesEnabled,
  });
  const following = useQuery({ queryKey: hubKeys.following, queryFn: followApi.getFollowing });
  const followers = useQuery({ queryKey: hubKeys.followers, queryFn: followApi.getFollowers });
  const coaches = useQuery({
    queryKey: hubKeys.coaches,
    queryFn: coachApi.getAll,
    enabled: optionalBackendFeaturesEnabled,
  });
  const templates = useQuery({
    queryKey: hubKeys.templates,
    queryFn: workoutPlanningApi.getTemplates,
    enabled: optionalBackendFeaturesEnabled,
  });
  const plans = useQuery({
    queryKey: hubKeys.plans,
    queryFn: workoutPlanningApi.getPlans,
    enabled: optionalBackendFeaturesEnabled,
  });
  const messages = useQuery({
    queryKey: hubKeys.messages(recipientId || "none"),
    queryFn: () => chatApi.getHistory(recipientId),
    enabled: Boolean(recipientId),
  });

  const markRead = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: hubKeys.notifications }),
  });
  const follow = useMutation({
    mutationFn: followApi.toggle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: hubKeys.following });
      void queryClient.invalidateQueries({ queryKey: hubKeys.followers });
      setFollowTarget("");
    },
  });
  const sendMessage = useMutation({
    mutationFn: () => chatApi.send(recipientId, message.trim()),
    onSuccess: () => {
      setMessage("");
      void queryClient.invalidateQueries({ queryKey: hubKeys.messages(recipientId) });
    },
  });
  const requestTraining = useMutation({
    mutationFn: () => coachApi.requestTraining(selectedCoachId, coachMessage.trim() || undefined),
    onSuccess: () => setCoachMessage(""),
  });
  const createTemplate = useMutation({
    mutationFn: () =>
      workoutPlanningApi.createTemplate({
        name: templateName.trim(),
        durationDays: Number(templateDays),
        isGeneral: false,
        days: [{ name: "Day 1", isRestDay: true }],
      }),
    onSuccess: () => {
      setTemplateName("");
      void queryClient.invalidateQueries({ queryKey: hubKeys.templates });
    },
  });

  const createPlan = useMutation({
    mutationFn: () =>
      workoutPlanningApi.createPlan({
        name: planName.trim(),
        durationDays: Number(templateDays),
        templateIds: planTemplateId ? [planTemplateId] : undefined,
        days: planTemplateId ? undefined : [{ name: "Day 1", isRestDay: true }],
      }),
    onSuccess: () => {
      setPlanName("");
      setPlanTemplateId("");
      void queryClient.invalidateQueries({ queryKey: hubKeys.plans });
    },
  });

  const unread = useMemo(
    () => (notifications.data ?? []).filter((item) => !item.isRead),
    [notifications.data],
  );

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <header className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.24em] text-brand">
            Connected operations
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-tighter">ATHLETE HUB</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage the backend-connected relationship, messaging, coaching, and program tools in one
            place.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-5 py-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Unread updates
          </p>
          <p className="mt-1 font-display text-3xl text-brand">{unread.length}</p>
        </div>
      </header>

      {!optionalBackendFeaturesEnabled && (
        <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {optionalBackendFeaturesMessage}
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-2">
        <HubPanel
          icon={Bell}
          title="Notifications"
          subtitle="Updates delivered through the backend notification service"
        >
          {notifications.isLoading ? (
            <LoadingLine />
          ) : notifications.data?.length ? (
            <div className="space-y-3">
              {notifications.data.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 rounded-2xl border p-4 ${notification.isRead ? "border-border bg-surface/20" : "border-brand/30 bg-brand/5"}`}
                >
                  <Bell className="mt-0.5 shrink-0 text-brand" size={18} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{notification.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => markRead.mutate(notification.id)}
                      className="self-start rounded-lg p-2 text-brand hover:bg-brand/10"
                      aria-label="Mark notification as read"
                    >
                      <Check size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyText text="No notifications yet." />
          )}
        </HubPanel>

        <HubPanel
          icon={UsersRound}
          title="Athlete network"
          subtitle="Follow athletes and review your current network"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (followTarget.trim()) follow.mutate(followTarget.trim());
            }}
            className="flex gap-2"
          >
            <input
              value={followTarget}
              onChange={(event) => setFollowTarget(event.target.value)}
              placeholder="Athlete user ID"
              className="auth-input flex-1"
            />
            <button
              type="submit"
              disabled={follow.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground"
            >
              <UserPlus size={16} /> Follow
            </button>
          </form>
          {follow.error && <ErrorText error={follow.error} />}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <IdList title="Following" ids={following.data ?? []} />
            <IdList title="Followers" ids={followers.data ?? []} />
          </div>
        </HubPanel>

        <HubPanel
          icon={MessageCircle}
          title="Messages"
          subtitle="Load a conversation using an athlete ID and send a direct message"
        >
          <div className="flex gap-2">
            <input
              value={recipientId}
              onChange={(event) => setRecipientId(event.target.value)}
              placeholder="Recipient user ID"
              className="auth-input flex-1"
            />
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto rounded-2xl border border-border bg-surface/20 p-3">
            {!recipientId ? (
              <EmptyText text="Enter a recipient ID to open a conversation." />
            ) : messages.isLoading ? (
              <LoadingLine />
            ) : messages.data?.length ? (
              messages.data.map((item) => (
                <div key={item.id} className="rounded-xl bg-card p-3">
                  <p className="text-sm">{item.content}</p>
                  <p className="mt-1 text-[10px] font-mono text-muted-foreground">
                    {new Date(item.sentAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <EmptyText text="No messages in this conversation yet." />
            )}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (recipientId && message.trim()) sendMessage.mutate();
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={!recipientId}
              placeholder="Write a message"
              className="auth-input flex-1"
            />
            <button
              type="submit"
              disabled={!recipientId || !message.trim() || sendMessage.isPending}
              className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground"
            >
              <Send size={17} />
            </button>
          </form>
          {sendMessage.error && <ErrorText error={sendMessage.error} />}
        </HubPanel>

        <HubPanel
          icon={Star}
          title="Coaching"
          subtitle="Browse coaches, request training, and rate completed coaching relationships"
        >
          {coaches.isLoading ? (
            <LoadingLine />
          ) : coaches.data?.length ? (
            <div className="space-y-3">
              {coaches.data.map((coach) => (
                <div
                  key={coach.userId}
                  className="rounded-2xl border border-border bg-surface/20 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{coach.username}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {coach.bio || "Verified Repflow coach"}
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-1 text-sm font-bold text-brand">
                      <Star size={14} fill="currentColor" /> {coach.averageRating.toFixed(1)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCoachId(coach.userId)}
                    className="mt-3 text-xs font-bold text-brand hover:underline"
                  >
                    Request training
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyText text="No approved coaches are available yet." />
          )}
          {selectedCoachId && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                requestTraining.mutate();
              }}
              className="mt-4 rounded-2xl border border-brand/30 bg-brand/5 p-4"
            >
              <p className="text-sm font-bold">Training request</p>
              <textarea
                value={coachMessage}
                onChange={(event) => setCoachMessage(event.target.value)}
                placeholder="Tell the coach about your goals"
                className="auth-input mt-3 min-h-20 w-full resize-none"
              />
              <button
                type="submit"
                className="mt-3 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-brand-foreground"
              >
                Send request
              </button>
            </form>
          )}
        </HubPanel>

        <HubPanel
          icon={ClipboardList}
          title="Workout planning"
          subtitle="Create lightweight templates and review the plans assigned to you"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (templateName.trim()) createTemplate.mutate();
            }}
            className="grid gap-2 sm:grid-cols-[1fr_7rem_auto]"
          >
            <input
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="Template name"
              className="auth-input"
            />
            <input
              type="number"
              min="1"
              max="365"
              value={templateDays}
              onChange={(event) => setTemplateDays(event.target.value)}
              className="auth-input"
            />
            <button
              type="submit"
              className="rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground"
            >
              Create
            </button>
          </form>
          {createTemplate.error && <ErrorText error={createTemplate.error} />}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (planName.trim()) createPlan.mutate();
            }}
            className="mt-4 grid gap-2 rounded-2xl border border-border bg-surface/20 p-4 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input
              value={planName}
              onChange={(event) => setPlanName(event.target.value)}
              placeholder="New plan name"
              className="auth-input"
            />
            <select
              value={planTemplateId}
              onChange={(event) => setPlanTemplateId(event.target.value)}
              className="auth-input"
            >
              <option value="">Manual one-day plan</option>
              {(templates.data ?? []).map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={createPlan.isPending}
              className="rounded-xl border border-brand/30 px-4 text-sm font-bold text-brand hover:bg-brand/10"
            >
              Build plan
            </button>
          </form>
          {createPlan.error && <ErrorText error={createPlan.error} />}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <PlanList title="Templates" names={(templates.data ?? []).map((item) => item.name)} />
            <PlanList
              title="Plans"
              names={(plans.data ?? []).map((item, index) => `Plan ${index + 1}`)}
            />
          </div>
        </HubPanel>
      </div>
    </main>
  );
}

function HubPanel({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Bell;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-tight">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
function IdList({ title, ids }: { title: string; ids: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/20 p-4">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {title} · {ids.length}
      </p>
      {ids.length ? (
        <div className="mt-3 space-y-2">
          {ids.slice(0, 5).map((id) => (
            <p key={id} className="truncate text-sm">
              @{id.slice(0, 12)}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">None yet.</p>
      )}
    </div>
  );
}
function PlanList({ title, names }: { title: string; names: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/20 p-4">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {names.length ? (
        <div className="mt-3 space-y-2">
          {names.slice(0, 5).map((name) => (
            <p key={name} className="truncate text-sm">
              {name}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">None yet.</p>
      )}
    </div>
  );
}
function LoadingLine() {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">Loading from the backend…</p>
  );
}
function EmptyText({ text }: { text: string }) {
  return <p className="py-5 text-center text-sm text-muted-foreground">{text}</p>;
}
function ErrorText({ error }: { error: Error }) {
  return <p className="mt-3 text-sm text-destructive">{error.message}</p>;
}
