import { WorkoutStats } from "@/features/workouts/components/WorkoutStats";
import { ConsistencyCalendar } from "@/features/workouts/components/ConsistencyCalendar";
import { TrendingUp, Target, Zap, Activity } from "lucide-react";

export function ProfilePerformanceTab() {
  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Training Streak"
          value="12"
          unit="Days"
          trend="+2"
          icon={<Zap size={14} className="text-brand" />}
        />
        <MetricCard
          label="Weekly Volume"
          value="42.5"
          unit="Tons"
          trend="-5%"
          icon={<Activity size={14} className="text-brand" />}
        />
        <MetricCard
          label="Bodyweight"
          value="92.4"
          unit="KG"
          trend="-0.4"
          icon={<Target size={14} className="text-brand" />}
        />
        <MetricCard
          label="Intensity Score"
          value="84"
          unit="%"
          trend="+1.2"
          icon={<TrendingUp size={14} className="text-brand" />}
        />
      </div>

      {/* Main Visualizations */}
      <div className="grid grid-cols-1 gap-6">
        <ConsistencyCalendar />
        <WorkoutStats />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  trend,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  trend?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-brand/30 transition-colors group">
      <div className="flex justify-between items-start mb-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
          {label}
        </p>
        <div className="p-1.5 rounded-lg bg-surface border border-border group-hover:border-brand/50 transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-display tracking-tighter">{value}</p>
        <span className="text-xs text-muted-foreground font-mono">{unit}</span>
      </div>
      {trend && (
        <div className="mt-2 text-[10px] font-mono flex items-center gap-1">
          <span className={trend.startsWith("+") ? "text-brand" : "text-muted-foreground"}>
            {trend}
          </span>
          <span className="text-muted-foreground/50 italic text-[8px]">v. previous period</span>
        </div>
      )}
    </div>
  );
}
