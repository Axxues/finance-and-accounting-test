import { useMemo } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Download } from 'lucide-react';

export const IncomeStatement = () => {
  const { journalEntries, chartOfAccounts } = useAccounting();

  const reportData = useMemo(() => {
    let totalRevenue = 0;
    let totalExpense = 0;
    const revenues: { name: string, amount: number }[] = [];
    const expenses: { name: string, amount: number }[] = [];

    // Initialize all revenue and expense accounts to 0
    chartOfAccounts.forEach(account => {
      if (account.type === 'Revenue') {
        revenues.push({ name: account.name, amount: 0 });
      } else if (account.type === 'Expense') {
        expenses.push({ name: account.name, amount: 0 });
      }
    });

    // Calculate balances from posted journal entries
    journalEntries.filter(je => je.status === 'Posted').forEach(je => {
      je.lines.forEach(line => {
        const account = chartOfAccounts.find(a => a.id === line.accountId);
        if (account?.type === 'Revenue') {
          const amount = line.credit - line.debit; // Normal balance for Revenue is Credit
          const target = revenues.find(r => r.name === account.name);
          if (target) target.amount += amount;
          totalRevenue += amount;
        } else if (account?.type === 'Expense') {
          const amount = line.debit - line.credit; // Normal balance for Expense is Debit
          const target = expenses.find(e => e.name === account.name);
          if (target) target.amount += amount;
          totalExpense += amount;
        }
      });
    });

    return { revenues, expenses, totalRevenue, totalExpense, netIncome: totalRevenue - totalExpense };
  }, [journalEntries, chartOfAccounts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profit & Loss Statement</h1>
          <p className="text-slate-500 mt-1">For the period ending Today</p>
        </div>
        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm">
          <Download size={18} />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="text-center mb-8 pb-8 border-b border-slate-100">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">Likha ERP Test</h2>
          <h3 className="text-md text-slate-500 uppercase tracking-widest">Income Statement</h3>
        </div>

        {/* Revenues */}
        <div className="mb-8">
          <h4 className="font-bold text-slate-800 text-lg mb-4 border-b border-slate-200 pb-2">Revenues</h4>
          <div className="space-y-3">
            {reportData.revenues.map((rev, idx) => (
              <div key={idx} className="flex justify-between text-slate-700">
                <span>{rev.name}</span>
                <span>{rev.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-slate-900 mt-4 pt-4 border-t border-slate-100">
            <span>Total Revenues</span>
            <span>${reportData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="mb-8">
          <h4 className="font-bold text-slate-800 text-lg mb-4 border-b border-slate-200 pb-2">Expenses</h4>
          <div className="space-y-3">
            {reportData.expenses.map((exp, idx) => (
              <div key={idx} className="flex justify-between text-slate-700">
                <span>{exp.name}</span>
                <span>{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-slate-900 mt-4 pt-4 border-t border-slate-100">
            <span>Total Expenses</span>
            <span>${reportData.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Net Income */}
        <div className="flex justify-between font-bold text-xl mt-8 pt-6 border-t-4 border-slate-800 text-slate-900">
          <span>Net Income</span>
          <span className={reportData.netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
            ${reportData.netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
