import { useMemo } from 'react';
import { useAccounting } from '../context/AccountingContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';

export const Dashboard = () => {
  const { journalEntries, arInvoices, arReceipts, apBills, apVouchers, chartOfAccounts, activeRole } = useAccounting();

  const calculateBalance = (accountCodes: string[]) => {
    let balance = 0;
    const accountIds = chartOfAccounts
      .filter(a => accountCodes.includes(a.code))
      .map(a => a.id);

    journalEntries.filter(je => je.status === 'Posted').forEach(je => {
      je.lines.forEach(line => {
        if (accountIds.includes(line.accountId)) {
          const account = chartOfAccounts.find(a => a.id === line.accountId);
          if (account?.type === 'Asset' || account?.type === 'Expense') {
            balance += (line.debit - line.credit);
          } else {
            balance += (line.credit - line.debit);
          }
        }
      });
    });
    return balance;
  };

  const cashBalance = useMemo(() => calculateBalance(['1010']), [journalEntries, chartOfAccounts]);
  const revenue = useMemo(() => calculateBalance(['4010']), [journalEntries, chartOfAccounts]);
  const expenses = useMemo(() => calculateBalance(['5010']), [journalEntries, chartOfAccounts]);
  const netIncome = revenue - expenses;

  const totalOutstandingAR = useMemo(() => {
    return arInvoices
      .filter(inv => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
  }, [arInvoices]);

  const upcomingBills = useMemo(() => {
    return apBills
      .filter(bill => bill.status !== 'Paid')
      .reduce((sum, bill) => sum + bill.totalAmount, 0);
  }, [apBills]);

  // New Metrics
  const unpostedEntriesCount = journalEntries.filter(je => je.status === 'Draft').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  const receiptsToday = useMemo(() => {
    return arReceipts
      .filter(r => r.date === todayStr)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [arReceipts, todayStr]);

  const disbursementsToday = useMemo(() => {
    return apVouchers
      .filter(v => v.date === todayStr)
      .reduce((sum, v) => sum + v.amount, 0);
  }, [apVouchers, todayStr]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {activeRole === 'CFO' && 'CFO Command Center'}
          {activeRole === 'ACCOUNTANT' && 'General Ledger Dashboard'}
          {activeRole === 'AR_CLERK' && 'Accounts Receivable Dashboard'}
          {activeRole === 'AP_CLERK' && 'Accounts Payable Dashboard'}
        </h1>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(activeRole === 'CFO' || activeRole === 'ACCOUNTANT') && (
          <>
            <StatCard 
              title="Cash Balance" 
              amount={cashBalance} 
              icon={<DollarSign className="text-emerald-500" size={24} />}
              trend="+2.5% from last month"
              trendUp={true}
            />
            <StatCard 
              title="Net Income" 
              amount={netIncome} 
              icon={<TrendingUp className="text-blue-500" size={24} />}
              trend="+12% from last month"
              trendUp={true}
            />
            {activeRole === 'ACCOUNTANT' && (
              <StatCard 
                title="Unposted JEs" 
                amount={unpostedEntriesCount} 
                icon={<AlertCircle className="text-amber-500" size={24} />}
                subtitle="Requires your review"
                isCurrency={false}
              />
            )}
          </>
        )}
        {(activeRole === 'CFO' || activeRole === 'AR_CLERK') && (
          <>
            <StatCard 
              title="Total Outstanding AR" 
              amount={totalOutstandingAR} 
              icon={<AlertCircle className="text-amber-500" size={24} />}
              subtitle="Money owed to you"
            />
            {activeRole === 'AR_CLERK' && (
              <StatCard 
                title="Receipts Today" 
                amount={receiptsToday} 
                icon={<TrendingUp className="text-emerald-500" size={24} />}
                subtitle="Collected today"
              />
            )}
          </>
        )}
        {(activeRole === 'CFO' || activeRole === 'AP_CLERK') && (
          <>
            <StatCard 
              title="Upcoming AP Bills" 
              amount={upcomingBills} 
              icon={<TrendingDown className="text-rose-500" size={24} />}
              subtitle="Money you owe"
            />
            {activeRole === 'AP_CLERK' && (
              <StatCard 
                title="Disbursements Today" 
                amount={disbursementsToday} 
                icon={<TrendingDown className="text-purple-500" size={24} />}
                subtitle="Paid out today"
              />
            )}
          </>
        )}
      </div>

      {/* Secondary Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AR Aging Component */}
        {(activeRole === 'CFO' || activeRole === 'AR_CLERK') && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">AR Aging Summary (Mock)</h3>
            <div className="space-y-4">
              <ProgressBar label="Current" value={60} color="bg-emerald-500" />
              <ProgressBar label="1-30 Days" value={25} color="bg-blue-500" />
              <ProgressBar label="31-60 Days" value={10} color="bg-amber-500" />
              <ProgressBar label="> 60 Days" value={5} color="bg-rose-500" />
            </div>
          </div>
        )}

        {/* Recent Journal Entries Component */}
        {(activeRole === 'CFO' || activeRole === 'ACCOUNTANT') && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Journal Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Date</th>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {journalEntries.slice(-5).reverse().map(je => (
                    <tr key={je.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-900">{je.date}</td>
                      <td className="px-4 py-3 text-slate-600">{je.reference}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          je.status === 'Posted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {je.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {journalEntries.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No recent entries</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Invoices for AR Clerk */}
        {activeRole === 'AR_CLERK' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Invoice #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {arInvoices.slice(-5).reverse().map(inv => (
                    <tr key={inv.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-900">INV-{inv.id.slice(0,4)}</td>
                      <td className="px-4 py-3 text-slate-600">{inv.issueDate}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        ${inv.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  ))}
                  {arInvoices.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No recent invoices</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Bills for AP Clerk */}
        {activeRole === 'AP_CLERK' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Bills</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Bill #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {apBills.slice(-5).reverse().map(bill => (
                    <tr key={bill.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-900">BILL-{bill.id.slice(0,4)}</td>
                      <td className="px-4 py-3 text-slate-600">{bill.date}</td>
                      <td className="px-4 py-3 text-right font-medium text-rose-600">
                        ${bill.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  ))}
                  {apBills.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No recent bills</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, icon, trend, trendUp, subtitle, isCurrency = true }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">
          {isCurrency ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : amount}
        </h3>
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </p>
        )}
        {subtitle && (
          <p className="text-xs mt-2 font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="text-slate-500">{value}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);
