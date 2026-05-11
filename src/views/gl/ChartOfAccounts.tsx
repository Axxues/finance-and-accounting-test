import { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import type { AccountType } from '../../context/AccountingContext';
import { Plus, Search, X } from 'lucide-react';

export const ChartOfAccounts = () => {
  const { chartOfAccounts, addAccount, updateAccount } = useAccounting();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('Asset');
  const [isActive, setIsActive] = useState(true);

  const handleEdit = (acc: any) => {
    setEditingId(acc.id);
    setCode(acc.code);
    setName(acc.name);
    setType(acc.type);
    setIsActive(acc.isActive);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!code || !name) return;
    
    if (editingId) {
      updateAccount(editingId, { code, name, type, isActive });
    } else {
      addAccount({ code, name, type, isActive });
    }
    
    setShowForm(false);
    setEditingId(null);
    setCode(''); setName(''); setType('Asset'); setIsActive(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chart of Accounts</h1>
          <p className="text-slate-500 mt-1">Manage your general ledger accounts</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setCode(''); setName(''); setType('Asset'); setIsActive(true);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showForm ? 'Cancel' : 'New Account'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">{editingId ? 'Edit Account' : 'Create New Account'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. 1010" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. Cash" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as AccountType)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-slate-700">Active Account</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
              {editingId ? 'Update Account' : 'Save Account'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search accounts..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Code</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chartOfAccounts.map(account => (
              <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-mono text-sm text-slate-600">{account.code}</td>
                <td className="py-4 px-6 font-medium text-slate-900">{account.name}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full
                    ${account.type === 'Asset' ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${account.type === 'Liability' ? 'bg-rose-100 text-rose-800' : ''}
                    ${account.type === 'Equity' ? 'bg-purple-100 text-purple-800' : ''}
                    ${account.type === 'Revenue' ? 'bg-blue-100 text-blue-800' : ''}
                    ${account.type === 'Expense' ? 'bg-amber-100 text-amber-800' : ''}
                  `}>
                    {account.type}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {account.isActive ? (
                    <span className="flex items-center text-sm text-emerald-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Active
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-slate-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-slate-300 mr-2"></span> Inactive
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => handleEdit(account)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3 transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
