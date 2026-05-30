import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const volumeData = [
  { day: 'MON', volume: 4200 },
  { day: 'TUE', volume: 5100 },
  { day: 'WED', volume: 0 },
  { day: 'THU', volume: 6800 },
  { day: 'FRI', volume: 3900 },
  { day: 'SAT', volume: 7200 },
  { day: 'SUN', volume: 2100 },
];

const muscleData = [
  { name: 'Chest', value: 12 },
  { name: 'Back', value: 14 },
  { name: 'Legs', value: 8 },
  { name: 'Shoulders', value: 10 },
  { name: 'Arms', value: 18 },
];

const COLORS = ['#DFFF00', '#A3B300', '#6B7500', '#414700', '#262626'];

export function WorkoutStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg tracking-tight">VOLUME INTENSITY</h3>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Last 7 Days (KG)</span>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#626262', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                itemStyle={{ color: '#DFFF00', fontSize: '12px' }}
                cursor={{ fill: 'rgba(223, 255, 0, 0.05)' }}
              />
              <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                {volumeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.volume > 5000 ? '#DFFF00' : '#414700'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg tracking-tight">MUSCLE FREQUENCY</h3>
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Times Played / Month</span>
        </div>
        <div className="h-[200px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={muscleData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {muscleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px' }}
                itemStyle={{ color: '#DFFF00', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center">
             <span className="text-2xl font-display">62</span>
             <span className="text-[8px] font-mono text-muted-foreground uppercase">Muscle Hits</span>
          </div>
        </div>
      </div>
    </div>
  );
}
