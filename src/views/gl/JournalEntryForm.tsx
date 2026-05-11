import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounting } from '../../context/AccountingContext';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const JournalEntryForm = () => {
  const navigate = useNavigate();
  const { chartOfAccounts, addJournalEntry } = useAccounting();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  
  const [lines, setLines] = useState([
    { id: uuidv4(), accountId: '', debit: 0, credit: 0 },
    { id: uuidv4(), accountId: '', debit: 0, credit: 0 }
  ]);

  const addLine = () => {
    setLines([...lines, { id: uuidv4(), accountId: '', debit: 0, credit: 0 }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter(l => l.id !== id));
    }
  };

  const updateLine = (id: string, field: string, value: string | number) => {
    setLines(lines.map(l => {
      if (l.id !== id) return l;
      
      const updated = { ...l, [field]: value };
      
      // Auto-zero the other column if one is set > 0
      if (field === 'debit' && Number(value) > 0) updated.credit = 0;
      if (field === 'credit' && Number(value) > 0) updated.debit = 0;
      
      return updated;
    }));
  };

  const totalDebit = useMemo(() => lines.reduce((sum, l) => sum + Number(l.debit || 0), 0), [lines]);
  const totalCredit = useMemo(() => lines.reduce((sum, l) => sum + Number(l.credit || 0), 0), [lines]);
  
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;
  const isValid = isBalanced && lines.every(l => l.accountId !== '') && date && reference;

  const handleSave = (status: 'Draft' | 'Posted') => {
    if (!isValid) return;

    addJournalEntry({
      date,
      reference,
      description,
      status,
      lines: lines.map(l => ({
        id: uuidv4(),
        accountId: l.accountId,
        debit: Number(l.debit),
        credit: Number(l.credit)
      }))
    });

    navigate('/gl/journals');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={() => navigate('/gl/journals')}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Journal Entry</h1>
          <p className="text-slate-500 mt-1">Manually record a transaction in the general ledger</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reference No.</label>
              <input 
                type="text" 
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. ADJ-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description / Memo</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description of the transaction"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-600">
                <th className="pb-3 font-semibold w-1/2">Account</th>
                <th className="pb-3 font-semibold text-right w-1/5">Debit</th>
                <th className="pb-3 font-semibold text-right w-1/5">Credit</th>
                <th className="pb-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-slate-100 last:border-0 group">
                  <td className="py-3 pr-4">
                    <select 
                      value={line.accountId}
                      onChange={(e) => updateLine(line.id, 'accountId', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="">Select Account...</option>
                      {chartOfAccounts.filter(a => a.isActive).map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input 
                        type="number" 
                        min="0" step="0.01"
                        value={line.debit || ''}
                        onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 text-right border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input 
                        type="number" 
                        min="0" step="0.01"
                        value={line.credit || ''}
                        onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 text-right border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3 pl-2 text-right">
                    <button 
                      onClick={() => removeLine(line.id)}
                      disabled={lines.length <= 2}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-4">
                  <button 
                    onClick={addLine}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Add Line</span>
                  </button>
                </td>
                <td className="pt-4 px-2 text-right">
                  <div className={`text-lg font-bold ${isBalanced ? 'text-slate-900' : 'text-rose-600'}`}>
                    ${totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="pt-4 px-2 text-right">
                  <div className={`text-lg font-bold ${isBalanced ? 'text-slate-900' : 'text-rose-600'}`}>
                    ${totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td></td>
              </tr>
              {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
                <tr>
                  <td colSpan={4} className="pt-2 text-right text-rose-500 text-sm font-medium">
                    Out of balance by ${Math.abs(totalDebit - totalCredit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-4">
          <button 
            onClick={() => navigate('/gl/journals')}
            className="px-6 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => handleSave('Draft')}
            disabled={!isValid}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave('Posted')}
            disabled={!isValid}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Save size={18} />
            <span>Post Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
