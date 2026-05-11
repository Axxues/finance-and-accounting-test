import { useState } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Plus, FileText } from 'lucide-react';

export const InvoicesList = () => {
  const { arInvoices, customers, addInvoice, addReceipt } = useAccounting();
  const [showForm, setShowForm] = useState(false);
  
  const [customerId, setCustomerId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const [payingInvoice, setPayingInvoice] = useState<any>(null);
  const [payDate, setPayDate] = useState('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('Bank Transfer');

  const handlePayment = () => {
    if (!payingInvoice || !payDate || payAmount <= 0) return;
    addReceipt({
      invoiceId: payingInvoice.id,
      date: payDate,
      amount: payAmount,
      method: payMethod
    });
    setPayingInvoice(null);
  };

  const handleCreate = () => {
    if (!customerId || !issueDate || !dueDate || !amount) return;
    addInvoice({
      customerId,
      issueDate,
      dueDate,
      totalAmount: Number(amount),
      status: 'Unpaid'
    });
    setShowForm(false);
    setCustomerId(''); setIssueDate(''); setDueDate(''); setAmount('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AR Invoices</h1>
          <p className="text-slate-500 mt-1">Manage billing and tuition receivables</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={18} />
          <span>New Invoice</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Create New Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
              <select 
                value={customerId} onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select Customer...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount ($)</label>
              <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium transition-colors">Create & Auto-Post</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice ID</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Issue Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
              <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="py-3 px-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {arInvoices.map(inv => {
              const customer = customers.find(c => c.id === inv.customerId);
              return (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm text-blue-600 flex items-center gap-2">
                    <FileText size={16} /> INV-{inv.id.slice(0, 4)}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-900">{customer?.name || 'Unknown'}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{inv.issueDate}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{inv.dueDate}</td>
                  <td className="py-4 px-6 text-sm font-semibold text-slate-900 text-right">
                    ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full
                      ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${inv.status === 'Unpaid' ? 'bg-rose-100 text-rose-800' : ''}
                      ${inv.status === 'Partially Paid' ? 'bg-amber-100 text-amber-800' : ''}
                    `}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {inv.status !== 'Paid' && (
                      <button 
                        onClick={() => {
                          setPayingInvoice(inv);
                          setPayDate(new Date().toISOString().split('T')[0]);
                          setPayAmount(inv.totalAmount);
                        }}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors"
                      >
                        Receive Payment
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {arInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {payingInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Receive Payment</h3>
            <p className="text-sm text-slate-500 mb-6">
              Recording payment for Invoice INV-{payingInvoice.id.slice(0, 4)}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input type="number" min="0" step="0.01" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                <select value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button onClick={() => setPayingInvoice(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={handlePayment} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-medium transition-colors shadow-sm">
                Confirm & Auto-Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
