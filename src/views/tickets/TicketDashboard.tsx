import React, { useMemo } from 'react';
import { useTickets } from '../../context/TicketContext';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Activity,
  Users
} from 'lucide-react';

export const TicketDashboard = () => {
  const { tickets, ticketHistory } = useTickets();

  const metrics = useMemo(() => {
    const todo = tickets.filter(t => t.status === 'Todo').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const done = ticketHistory.length;
    const total = todo + inProgress + done;
    
    const highComplexity = tickets.filter(t => t.complexity === 'High').length;
    const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

    return { todo, inProgress, done, total, highComplexity, completionRate };
  }, [tickets, ticketHistory]);

  const assigneeRanking = useMemo(() => {
    const stats: Record<string, { low: number, medium: number, high: number, score: number }> = {};
    
    tickets.forEach(t => {
      if (!stats[t.assignee]) {
        stats[t.assignee] = { low: 0, medium: 0, high: 0, score: 0 };
      }
      if (t.complexity === 'High') { stats[t.assignee].high++; stats[t.assignee].score += 3; }
      if (t.complexity === 'Medium') { stats[t.assignee].medium++; stats[t.assignee].score += 2; }
      if (t.complexity === 'Low') { stats[t.assignee].low++; stats[t.assignee].score += 1; }
    });

    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.score - a.score);
  }, [tickets]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tickets Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of system tasks, bugs, and feature requests</p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="To Do" 
          amount={metrics.todo} 
          icon={<ListTodo className="text-slate-500" size={24} />}
          subtitle="Pending tasks"
        />
        <StatCard 
          title="In Progress" 
          amount={metrics.inProgress} 
          icon={<Clock className="text-blue-500" size={24} />}
          subtitle="Actively being worked on"
        />
        <StatCard 
          title="Completed" 
          amount={metrics.done} 
          icon={<CheckCircle className="text-emerald-500" size={24} />}
          subtitle="Historical tickets"
        />
        <StatCard 
          title="Completion Rate" 
          amount={`${metrics.completionRate}%`} 
          icon={<TrendingUp className="text-purple-500" size={24} />}
          subtitle="Overall progress"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Complexity Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="text-slate-400" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">Active Tickets by Complexity</h3>
          </div>
          <div className="space-y-5">
            <ProgressBar 
              label="High Complexity" 
              value={metrics.highComplexity} 
              total={tickets.length} 
              color="bg-rose-500" 
            />
            <ProgressBar 
              label="Medium Complexity" 
              value={tickets.filter(t => t.complexity === 'Medium').length} 
              total={tickets.length} 
              color="bg-amber-500" 
            />
            <ProgressBar 
              label="Low Complexity" 
              value={tickets.filter(t => t.complexity === 'Low').length} 
              total={tickets.length} 
              color="bg-emerald-500" 
            />
          </div>
          {metrics.highComplexity > 0 && (
            <div className="mt-6 p-4 bg-rose-50 rounded-lg flex items-start space-x-3 border border-rose-100">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-rose-700">
                You have <strong>{metrics.highComplexity}</strong> high complexity ticket(s) currently active. Prioritize these for timely resolution.
              </p>
            </div>
          )}
        </div>

        {/* Recently Completed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle className="text-slate-400" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">Recently Completed</h3>
          </div>
          <div className="space-y-4">
            {ticketHistory.slice(-5).reverse().map(ticket => (
              <div key={ticket.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">{ticket.code}</div>
                  <div className="text-sm text-slate-500 truncate max-w-[200px] sm:max-w-xs">{ticket.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-500 mb-1">{ticket.ticketType}</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mx-auto">
                    {ticket.assignee.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
            {ticketHistory.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No tickets have been completed yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignee Ranking */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
        <div className="flex items-center space-x-2 mb-6">
          <Users className="text-slate-400" size={20} />
          <h3 className="text-lg font-semibold text-slate-800">Assignee Workload Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
              <tr>
                <th className="px-4 py-3 font-medium">Assignee</th>
                <th className="px-4 py-3 font-medium text-center">High</th>
                <th className="px-4 py-3 font-medium text-center">Medium</th>
                <th className="px-4 py-3 font-medium text-center">Low</th>
                <th className="px-4 py-3 font-medium text-right">Workload Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assigneeRanking.map((assignee, index) => (
                <tr key={assignee.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {assignee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{assignee.name}</div>
                        <div className="text-xs text-slate-500">Rank #{index + 1}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {assignee.high > 0 ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-rose-100 text-rose-700">{assignee.high}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {assignee.medium > 0 ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{assignee.medium}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {assignee.low > 0 ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{assignee.low}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-700 text-base">
                    {assignee.score}
                  </td>
                </tr>
              ))}
              {assigneeRanking.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No active assignees.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, icon, subtitle }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{amount}</h3>
        {subtitle && (
          <p className="text-xs mt-2 font-medium text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        {icon}
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, value, total, color }: { label: string, value: number, total: number, color: string }) => {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500 font-medium">{value} ({percentage}%)</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};
