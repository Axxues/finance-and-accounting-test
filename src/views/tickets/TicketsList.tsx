import React, { useState } from 'react';
import { useTickets } from '../../context/TicketContext';
import type { TicketStatus } from '../../context/TicketContext';
import { Plus, Clock, AlertCircle, CheckCircle2, User, Calendar } from 'lucide-react';

export const TicketsList = () => {
  const { tickets, addTicket, updateTicketStatus } = useTickets();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    steps: '',
    complexity: 'Low' as 'Low' | 'Medium' | 'High',
    assignee: '',
    deadline: '',
    ticketType: '',
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket(formData);
    setShowForm(false);
    setFormData({ description: '', steps: '', complexity: 'Low', assignee: '', deadline: '', ticketType: '', remarks: '' });
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Todo': return 'bg-slate-100 text-slate-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Done': return 'bg-emerald-100 text-emerald-700';
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Active Tickets</h1>
          <p className="text-slate-500 mt-1">Manage and track your ongoing tasks</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>New Ticket</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Ticket</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ticket Type</label>
                <input required type="text" placeholder="e.g. Bug, Feature, Support" value={formData.ticketType} onChange={e => setFormData({...formData, ticketType: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Complexity</label>
                <select value={formData.complexity} onChange={e => setFormData({...formData, complexity: e.target.value as any})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                <input required type="text" value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                <input type="text" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Steps / Details</label>
                <textarea required rows={3} value={formData.steps} onChange={e => setFormData({...formData, steps: e.target.value})} className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">Create Ticket</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-bold text-slate-500">{ticket.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{ticket.ticketType}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{ticket.description}</h3>
                </div>
                <select 
                  value={ticket.status} 
                  onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                  className={`text-sm font-medium rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${getStatusColor(ticket.status)}`}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Mark as Done</option>
                </select>
              </div>
              
              <div className="text-sm text-slate-600 whitespace-pre-line mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700 block mb-1">Steps:</span>
                {ticket.steps}
              </div>

              {ticket.remarks && (
                <div className="text-sm text-slate-500 mb-4 flex items-start space-x-2">
                  <AlertCircle size={16} className="mt-0.5 text-amber-500 shrink-0" />
                  <span>{ticket.remarks}</span>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 p-4 px-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-1.5">
                <User size={16} className="text-slate-400" />
                <span className="font-medium text-slate-700">{ticket.assignee}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-slate-600">Due: <span className="font-medium text-slate-700">{ticket.deadline}</span></span>
              </div>
              <div className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${getComplexityColor(ticket.complexity)}`}>
                {ticket.complexity} Complexity
              </div>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div className="col-span-full py-12 bg-white rounded-xl border border-slate-200 border-dashed text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
            <p className="text-slate-500">There are no active tickets at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
