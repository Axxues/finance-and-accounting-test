import { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Plus, Search, X } from 'lucide-react';

export const CustomersList = () => {
  const { customers, addCustomer } = useAccounting();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('Student');

  const handleSave = () => {
    if (!name) return;
    addCustomer({ name, type });
    setShowForm(false);
    setName('');
    setType('Student');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">Manage students, parents, and corporate clients</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showForm ? 'Cancel' : 'New Customer'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Create New Customer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="Corporate">Corporate</option>
                <option value="Government">Government</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">
              Save Customer
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
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{customer.name}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800">
                    {customer.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3 transition-colors">Edit</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
