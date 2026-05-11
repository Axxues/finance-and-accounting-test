import { useMemo } from 'react';
import { useAccounting } from '../../context/AccountingContext';
import { Download } from 'lucide-react';

export const BalanceSheet = () => {
  const { journalEntries, chartOfAccounts } = useAccounting();

  const reportData = useMemo(() => {
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    
    // Retained earnings will hold Net Income
    let netIncome = 0;

    const assets: { name: string, amount: number }[] = [];
    const liabilities: { name: string, amount: number }[] = [];
    const equity: { name: string, amount: number }[] = [];

    // Initialize accounts
    chartOfAccounts.forEach(account => {
      if (account.type === 'Asset') assets.push({ name: account.name, amount: 0 });
      if (account.type === 'Liability') liabilities.push({ name: account.name, amount: 0 });
      if (account.type === 'Equity') equity.push({ name: account.name, amount: 0 });
    });

    // Calculate balances
    journalEntries.filter(je => je.status === 'Posted').forEach(je => {
      je.lines.forEach(line => {
        const account = chartOfAccounts.find(a => a.id === line.accountId);
        if (account?.type === 'Asset') {
          const amount = line.debit - line.credit;
          const target = assets.find(a => a.name === account.name);
          if (target) target.amount += amount;
          totalAssets += amount;
        } else if (account?.type === 'Liability') {
          const amount = line.credit - line.debit;
          const target = liabilities.find(l => l.name === account.name);
          if (target) target.amount += amount;
          totalLiabilities += amount;
        } else if (account?.type === 'Equity') {
          const amount = line.credit - line.debit;
          const target = equity.find(e => e.name === account.name);
          if (target) target.amount += amount;
          totalEquity += amount;
        } else if (account?.type === 'Revenue') {
          netIncome += (line.credit - line.debit);
        } else if (account?.type === 'Expense') {
          netIncome -= (line.debit - line.credit);
        }
      });
    });

    // Add Net Income to Equity
    totalEquity += netIncome;
    equity.push({ name: 'Retained Earnings (Net Income)', amount: netIncome });

    return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity, totalLiabilitiesAndEquity: totalLiabilities + totalEquity };
  }, [journalEntries, chartOfAccounts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Balance Sheet</h1>
          <p className="text-slate-500 mt-1">As of Today</p>
        </div>
        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm">
          <Download size={18} />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="text-center mb-8 pb-8 border-b border-slate-100">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">Likha ERP Test</h2>
          <h3 className="text-md text-slate-500 uppercase tracking-widest">Balance Sheet</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Assets Side */}
          <div>
            <h4 className="font-bold text-emerald-800 text-lg mb-4 border-b border-emerald-200 pb-2">Assets</h4>
            <div className="space-y-3">
              {reportData.assets.map((asset, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{asset.name}</span>
                  <span>{asset.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-emerald-900 mt-6 pt-4 border-t-2 border-emerald-800">
              <span>Total Assets</span>
              <span>${reportData.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Liabilities & Equity Side */}
          <div>
            <h4 className="font-bold text-rose-800 text-lg mb-4 border-b border-rose-200 pb-2">Liabilities</h4>
            <div className="space-y-3 mb-8">
              {reportData.liabilities.map((liab, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{liab.name}</span>
                  <span>{liab.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-slate-800 mt-2 pt-2 border-t border-slate-200">
                <span>Total Liabilities</span>
                <span>{reportData.totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <h4 className="font-bold text-blue-800 text-lg mb-4 border-b border-blue-200 pb-2">Equity</h4>
            <div className="space-y-3">
              {reportData.equity.map((eq, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{eq.name}</span>
                  <span>{eq.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-slate-800 mt-2 pt-2 border-t border-slate-200">
                <span>Total Equity</span>
                <span>{reportData.totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-slate-900 mt-6 pt-4 border-t-2 border-slate-800">
              <span>Total Liab. & Equity</span>
              <span>${reportData.totalLiabilitiesAndEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Validation Check */}
        {Math.abs(reportData.totalAssets - reportData.totalLiabilitiesAndEquity) > 0.01 && (
          <div className="mt-8 p-4 bg-rose-50 text-rose-800 rounded-lg text-center font-medium">
            Warning: Balance Sheet is out of balance. Check journal entries.
          </div>
        )}
      </div>
    </div>
  );
};
