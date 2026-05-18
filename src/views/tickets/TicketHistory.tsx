
import { useTickets } from '../../context/TicketContext';
import { CheckCircle, Calendar, AlertCircle } from 'lucide-react';

export const TicketHistory = () => {
  const { ticketHistory } = useTickets();

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'text-emerald-600 bg-emerald-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'High': return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ticket History</h1>
        <p className="text-slate-500 mt-1">Review completed tasks and resolved issues</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Assignee</th>
                <th className="px-6 py-4 font-medium">Complexity</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ticketHistory.slice().reverse().map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 mb-1">{ticket.code}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{ticket.ticketType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 mb-1">{ticket.description}</div>
                    <div className="text-xs text-slate-500 flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Due: {ticket.deadline}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {ticket.assignee.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-700">{ticket.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${getComplexityColor(ticket.complexity)}`}>
                      {ticket.complexity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <CheckCircle size={14} />
                      <span>Done</span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {ticketHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <AlertCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p>No completed tickets yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
