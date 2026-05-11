import React, { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Plus, Filter, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JournalEntriesList = () => {
  const { journalEntries, chartOfAccounts, postJournalEntry } = useAccounting();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getAccountInfo = (id: string) => {
    const acc = chartOfAccounts.find(a => a.id === id);
    return acc ? `${acc.code} - ${acc.name}` : 'Unknown Account';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Journal Entries</h1>
          <p className="text-slate-500 mt-1">View and manage general ledger transactions</p>
        </div>
        <Link 
          to="/gl/journals/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={18} />
          <span>New Journal Entry</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider w-10"></th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="py-3 px-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {journalEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No journal entries found. Create one to get started.
                </td>
              </tr>
            ) : (
              [...journalEntries].reverse().map(entry => {
                const totalAmount = entry.lines.reduce((sum, line) => sum + line.debit, 0);
                const isExpanded = expandedId === entry.id;
                
                return (
                  <React.Fragment key={entry.id}>
                    <tr className={`hover:bg-slate-50 transition-colors group ${isExpanded ? 'bg-slate-50' : ''}`}>
                      <td className="py-4 pl-4 pr-2">
                        <button onClick={() => setExpandedId(isExpanded ? null : entry.id)} className="text-slate-400 hover:text-blue-600 transition-colors">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 font-medium">{entry.date}</td>
                      <td className="py-4 px-6 font-mono text-sm text-blue-600">{entry.reference}</td>
                      <td className="py-4 px-6 text-sm text-slate-800">{entry.description}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-900 text-right">
                        ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full
                          ${entry.status === 'Posted' ? 'bg-emerald-100 text-emerald-800' : ''}
                          ${entry.status === 'Draft' ? 'bg-amber-100 text-amber-800' : ''}
                          ${entry.status === 'Void' ? 'bg-slate-100 text-slate-800' : ''}
                        `}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        {entry.status === 'Draft' && (
                          <button 
                            onClick={() => postJournalEntry(entry.id)}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
                            title="Post Entry"
                          >
                            <CheckCircle size={18} className="inline mr-1" />
                            Post
                          </button>
                        )}
                        <button onClick={() => setExpandedId(isExpanded ? null : entry.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">View</button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50">
                        <td colSpan={7} className="p-0 border-t border-slate-200">
                          <div className="p-6 bg-slate-50">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Journal Lines</h4>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                  <th className="pb-2 font-medium text-left">Account</th>
                                  <th className="pb-2 font-medium text-right w-32">Debit</th>
                                  <th className="pb-2 font-medium text-right w-32">Credit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entry.lines.map((line, idx) => (
                                  <tr key={idx} className="border-b border-slate-100 last:border-0">
                                    <td className="py-2 text-slate-700">{getAccountInfo(line.accountId)}</td>
                                    <td className="py-2 text-right text-slate-900 font-mono">
                                      {line.debit > 0 ? `$${line.debit.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '-'}
                                    </td>
                                    <td className="py-2 text-right text-slate-900 font-mono">
                                      {line.credit > 0 ? `$${line.credit.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
