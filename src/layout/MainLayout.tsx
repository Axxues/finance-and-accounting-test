import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Receipt,
  ShoppingCart,
  Briefcase,
  Download,
  Building,
  UserCircle,
  Ticket,
  History,
  Activity
} from 'lucide-react';
import { useAccounting } from '../context/AccountingContext';
import type { Role } from '../context/AccountingContext';

export const MainLayout = () => {
  const { exportData, activeRole, setActiveRole } = useAccounting();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: { id: Role, name: string }[] = [
    { id: 'CFO', name: 'Finance Manager / CFO' },
    { id: 'ACCOUNTANT', name: 'General Accountant' },
    { id: 'AR_CLERK', name: 'AR Clerk' },
    { id: 'AP_CLERK', name: 'AP Clerk' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider">Likha ERP</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Overview</div>
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          
          {(activeRole === 'CFO' || activeRole === 'ACCOUNTANT') && (
            <>
              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">General Ledger</div>
              <NavItem to="/gl/accounts" icon={<BookOpen size={20} />} label="Chart of Accounts" />
              <NavItem to="/gl/journals" icon={<FileText size={20} />} label="Journal Entries" />
            </>
          )}

          {(activeRole === 'CFO' || activeRole === 'AR_CLERK') && (
            <>
              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Accounts Receivable</div>
              <NavItem to="/ar/customers" icon={<Users size={20} />} label="Customers" />
              <NavItem to="/ar/invoices" icon={<Receipt size={20} />} label="Invoices" />
            </>
          )}
          
          {(activeRole === 'CFO' || activeRole === 'AP_CLERK') && (
            <>
              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Accounts Payable</div>
              <NavItem to="/ap/vendors" icon={<Briefcase size={20} />} label="Vendors" />
              <NavItem to="/ap/bills" icon={<ShoppingCart size={20} />} label="Bills" />
            </>
          )}

          {(activeRole === 'CFO' || activeRole === 'ACCOUNTANT') && (
            <>
              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports</div>
              <NavItem to="/reports/income-statement" icon={<FileText size={20} />} label="Profit & Loss" />
              <NavItem to="/reports/balance-sheet" icon={<BookOpen size={20} />} label="Balance Sheet" />
            </>
          )}

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticketing System</div>
          <NavItem to="/tickets/dashboard" icon={<Activity size={20} />} label="Tickets Dashboard" />
          <NavItem to="/tickets/active" icon={<Ticket size={20} />} label="Active Tickets" />
          <NavItem to="/tickets/history" icon={<History size={20} />} label="Ticket History" />
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            {roles.find(r => r.id === activeRole)?.name} View
          </h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={exportData}
              className="flex items-center space-x-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md transition-colors"
            >
              <Download size={16} />
              <span>Export DB</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md transition-colors font-medium border border-blue-200"
              >
                <UserCircle size={18} />
                <span>Switch Role</span>
              </button>
              
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Select Role
                  </div>
                  {roles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => {
                        setActiveRole(role.id);
                        setShowRoleMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        activeRole === role.id 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white border-l-4 border-blue-400' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    {label}
  </NavLink>
);
