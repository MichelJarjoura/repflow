import * as Tabs from "@radix-ui/react-tabs";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Share2,
  Settings,
  Grid,
  BarChart3,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import avatar from "@/assets/avatar-1.jpg";
import { WorkoutStats } from "@/features/workouts/components/WorkoutStats";
import { PRPost } from "@/features/feed/components/posts/views/PRPost";
import { WorkoutPost } from "@/features/feed/components/posts/views/WorkoutPost";
import { RunPost } from "@/features/feed/components/posts/views/RunPost";
import avatar1 from "@/assets/avatar-1.jpg";

const prs = [
  { lift: "Bench Press", value: 125, date: "2 weeks ago", rank: "Top 5%" },
  { lift: "Back Squat", value: 160, date: "1 month ago", rank: "Top 12%" },
  { lift: "Deadlift", value: 210, date: "3 days ago", rank: "Top 2%" },
  { lift: "Overhead Press", value: 72.5, date: "2 months ago", rank: "Top 8%" },
  { lift: "Front Squat", value: 130, date: "5 days ago", rank: "Top 15%" },
  { lift: "Power Clean", value: 95, date: "1 week ago", rank: "Top 20%" },
];

export function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Banner / Header Area */}
      <div className="relative h-48 md:h-64 bg-linear-to-br from-brand/20 to-surface border-b border-border">
        <div className="absolute -bottom-16 left-6 md:left-10">
          <div className="size-32 md:size-40 rounded-full border-4 border-background bg-card overflow-hidden shadow-xl">
            <img src={avatar} alt="Marcus Thorne" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 px-6 py-4">
        <button className="p-2 rounded-full border border-border hover:bg-elevated transition-colors">
          <Share2 size={20} className="text-muted-foreground" />
        </button>
        <button className="p-2 rounded-full border border-border hover:bg-elevated transition-colors">
          <Settings size={20} className="text-muted-foreground" />
        </button>
        <button className="bg-foreground text-background px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
          Edit Profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-6 md:px-10 mt-6 space-y-4">
        <div>
          <h1 className="font-display text-4xl tracking-tighter">Marcus Thorne</h1>
          <p className="text-muted-foreground">@m_thorne_lifts</p>
        </div>

        <p className="text-foreground/90 max-w-xl leading-relaxed">
          Powerbuilding. 4× per week. PPL split. Building a high-performance engine through
          data-driven training. Focused on the long game. 🛠️🦾
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} />
            <span>Berlin, Germany</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LinkIcon size={16} />
            <a href="#" className="text-brand hover:underline">
              repflow.com/m_thorne
            </a>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>Joined June 2024</span>
          </div>
        </div>

        <div className="flex gap-6 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground">1.2k</span>
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground">428</span>
            <span className="text-muted-foreground">Following</span>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs.Root defaultValue="posts" className="mt-8">
        <Tabs.List className="flex border-b border-border px-4 overflow-x-auto no-scrollbar">
          <TabTrigger value="posts" icon={Grid} label="Posts" />
          <TabTrigger value="stats" icon={BarChart3} label="Performance" />
          <TabTrigger value="prs" icon={Trophy} label="Records" />
        </Tabs.List>

        <Tabs.Content value="posts" className="p-6 focus:outline-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PRPost
              avatar={avatar1}
              name="Marcus Thorne"
              meta="2 hours ago"
              lift="Overhead Press"
              value="140 KG"
            />
            <WorkoutPost
              avatar={avatar1}
              name="Marcus Thorne"
              meta="Yesterday • Heavy Pull"
              volume="11,240 KG"
              duration="1H 28M"
              exercises={[
                { name: "Deadlift", detail: "5 × 3 @ 180kg" },
                { name: "Pendlay Row", detail: "4 × 8 @ 90kg" },
              ]}
            />
            <RunPost
              avatar={avatar1}
              name="Marcus Thorne"
              meta="3 days ago"
              distance="8.2 KM"
              pace="4:58 /KM"
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="stats" className="p-6 focus:outline-hidden space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Training Streak" value="12" unit="Days" trend="+2" />
            <MetricCard label="Weekly Volume" value="42.5" unit="Tons" trend="-5%" />
            <MetricCard label="Bodyweight" value="92.4" unit="KG" trend="-0.4" />
            <MetricCard label="Total Lifts" value="1,420" unit="Reps" />
          </div>
          <WorkoutStats />
        </Tabs.Content>

        <Tabs.Content value="prs" className="p-6 focus:outline-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prs.map((p) => (
              <div
                key={p.lift}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-brand/50 transition-all hover:shadow-lg hover:shadow-brand/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                    {p.lift}
                  </p>
                  <Trophy
                    size={14}
                    className="text-brand opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-4xl tracking-tighter">{p.value}</p>
                  <span className="text-sm text-muted-foreground font-mono">KG</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center text-[10px] font-mono uppercase tracking-tighter">
                  <span className="text-muted-foreground">{p.date}</span>
                  <span className="text-brand">{p.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </Tabs.Content>
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
      className="group relative flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-hidden data-[state=active]:text-brand"
    >
      <Icon size={18} />
      <span>{label}</span>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand scale-x-0 group-data-[state=active]:scale-x-100 transition-transform" />
    </Tabs.Trigger>
  );
}

function MetricCard({
  label,
  value,
  unit,
  trend,
}: {
  label: string;
  value: string;
  unit: string;
  trend?: string;
}) {
  return (
    <div className="bg-surface/50 border border-border rounded-2xl p-5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-display tracking-tighter">{value}</p>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      {trend && (
        <div className="mt-2 text-[10px] font-mono flex items-center gap-1">
          <span className={trend.startsWith("+") ? "text-brand" : "text-muted-foreground"}>
            {trend}
          </span>
          <span className="text-muted-foreground/50">v. last week</span>
        </div>
      )}
    </div>
  );
}
