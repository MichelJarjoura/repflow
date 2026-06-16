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
  Award,
  Users,
  type LucideIcon,
} from "lucide-react";
import avatar from "@/assets/avatar-1.jpg";
import { ProfilePerformanceTab } from "./ProfilePerformanceTab";
import { ProfileRecordsTab } from "./ProfileRecordsTab";
import { PRPost } from "@/shared/posts/views/PRPost";
import { WorkoutPost } from "@/shared/posts/views/WorkoutPost";
import { RunPost } from "@/shared/posts/views/RunPost";
import avatar1 from "@/assets/avatar-1.jpg";

export function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 md:px-8">
      {/* Banner / Header Area */}
      <div className="relative h-48 md:h-64 mt-6 rounded-3xl overflow-hidden bg-linear-to-br from-brand/30 via-surface to-background border border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(223,255,0,0.1),transparent)]" />
      </div>

      {/* Main Profile Content */}
      <div className="relative -mt-20 md:-mt-24 px-4 md:px-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="size-32 md:size-48 rounded-3xl border-4 border-background bg-card overflow-hidden shadow-2xl relative z-10">
            <img src={avatar} alt="Marcus Thorne" className="w-full h-full object-cover" />
          </div>

          <div className="pb-2 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-4xl md:text-5xl tracking-tighter">Marcus Thorne</h1>
              <span className="bg-brand/10 text-brand text-[10px] font-mono px-2 py-0.5 rounded-full border border-brand/20 uppercase tracking-widest">
                Verified Pro
              </span>
            </div>
            <p className="text-muted-foreground font-mono text-sm tracking-tight">
              @m_thorne_lifts • Hybrid Athlete
            </p>
          </div>
        </div>

        <div className="flex gap-3 pb-2">
          <button className="p-2.5 rounded-xl border border-border hover:bg-elevated transition-colors">
            <Share2 size={18} className="text-muted-foreground" />
          </button>
          <button className="p-2.5 rounded-xl border border-border hover:bg-elevated transition-colors">
            <Settings size={18} className="text-muted-foreground" />
          </button>
          <button className="bg-foreground text-background px-8 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-foreground/10">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Bio & Professional Info */}
      <div className="flex flex-col lg:grid-cols-12 gap-12 mt-12 px-4 md:px-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
              Atheletic Bio
            </h2>
            <p className="text-lg text-foreground/90 leading-relaxed font-light">
              Powerbuilding specialist with a focus on functional hypertrophy and cardiovascular
              endurance. Currently following a data-driven PPL split, 4× per week. Building a
              high-performance engine through precision training and scientific recovery protocols.
              🛠️🦾
            </p>
          </div>

        </div>

        <div className="flex flex-row gap-6 justify-center">
          <StatHighlight icon={<Users size={16} />} label="Followers" value="1,248" />
          <StatHighlight icon={<Award size={16} />} label="PRs Verified" value="42" />
          <StatHighlight icon={<BarChart3 size={16} />} label="Global Rank" value="Top 4%" />
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs.Root defaultValue="posts" className="mt-16">
        <Tabs.List className="flex border-b border-border px-4 md:px-10 overflow-x-auto no-scrollbar gap-2">
          <TabTrigger value="posts" icon={Grid} label="Feed" />
          <TabTrigger value="stats" icon={BarChart3} label="Performance" />
          <TabTrigger value="prs" icon={Trophy} label="Records" />
        </Tabs.List>

        <div className="px-4 md:px-10 pt-8">
          <Tabs.Content value="posts" className="focus:outline-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PRPost
                avatar={avatar1}
                name="Marcus Thorne"
                meta="2 hours ago"
                lift="Overhead Press"
                value="140 KG"
                likes={128}
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

          <Tabs.Content value="stats" className="focus:outline-hidden">
            <ProfilePerformanceTab />
          </Tabs.Content>

          <Tabs.Content value="prs" className="focus:outline-hidden">
            <ProfileRecordsTab />
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

function InfoItem({
  icon,
  label,
  value,
  isLink,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">{icon}</span>
        {isLink ? (
          <a href="#" className="font-medium text-brand hover:underline">
            {value}
          </a>
        ) : (
          <span className="font-medium text-foreground/80">{value}</span>
        )}
      </div>
    </div>
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
