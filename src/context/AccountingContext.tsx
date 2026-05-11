import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// --- Types ---
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
export type Role = 'CFO' | 'ACCOUNTANT' | 'AR_CLERK' | 'AP_CLERK';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  isActive: boolean;
}

export interface JournalLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  status: 'Draft' | 'Posted' | 'Void';
  lines: JournalLine[];
}

export interface Customer {
  id: string;
  name: string;
  type: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: 'Unpaid' | 'Partially Paid' | 'Paid';
  journalId?: string;
}

export interface Receipt {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: string;
  journalId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
}

export interface Bill {
  id: string;
  vendorId: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  expenseAccountId: string;
  status: 'Pending' | 'Approved' | 'Paid';
  journalId?: string;
}

export interface Voucher {
  id: string;
  billId: string;
  date: string;
  amount: number;
  method: string;
  journalId?: string;
}

export interface AccountingState {
  activeRole: Role;
  chartOfAccounts: Account[];
  journalEntries: JournalEntry[];
  customers: Customer[];
  arInvoices: Invoice[];
  arReceipts: Receipt[];
  vendors: Vendor[];
  apBills: Bill[];
  apVouchers: Voucher[];
}

interface AccountingContextType extends AccountingState {
  setActiveRole: (role: Role) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  postJournalEntry: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  addReceipt: (receipt: Omit<Receipt, 'id'>) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  addVoucher: (voucher: Omit<Voucher, 'id'>) => void;
  exportData: () => void;
}

const initialState: AccountingState = {
  activeRole: 'CFO',
  chartOfAccounts: [
    { id: 'acc-1', code: '1010', name: 'Cash in Bank', type: 'Asset', isActive: true },
    { id: 'acc-2', code: '1200', name: 'Accounts Receivable', type: 'Asset', isActive: true },
    { id: 'acc-3', code: '2010', name: 'Accounts Payable', type: 'Liability', isActive: true },
    { id: 'acc-4', code: '4010', name: 'Tuition Revenue', type: 'Revenue', isActive: true },
    { id: 'acc-5', code: '5010', name: 'Office Supplies Expense', type: 'Expense', isActive: true },
  ],
  journalEntries: [],
  customers: [
    { id: 'cus-1', name: 'John Doe', type: 'Student' }
  ],
  arInvoices: [],
  arReceipts: [],
  vendors: [
    { id: 'ven-1', name: 'Office Supplies Co.', type: 'Supplier' }
  ],
  apBills: [],
  apVouchers: [],
};

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccountingState>(() => {
    const saved = localStorage.getItem('accounting_state');
    if (saved) return JSON.parse(saved);
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('accounting_state', JSON.stringify(state));
  }, [state]);

  const setActiveRole = (role: Role) => {
    setState(s => ({ ...s, activeRole: role }));
  };

  const addAccount = (account: Omit<Account, 'id'>) => {
    setState(s => ({ ...s, chartOfAccounts: [...s.chartOfAccounts, { ...account, id: uuidv4() }] }));
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setState(s => ({
      ...s,
      chartOfAccounts: s.chartOfAccounts.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setState(s => ({ ...s, customers: [...s.customers, { ...customer, id: uuidv4() }] }));
  };

  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    setState(s => ({ ...s, vendors: [...s.vendors, { ...vendor, id: uuidv4() }] }));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { ...entry, id: uuidv4() };
    setState(s => ({ ...s, journalEntries: [...s.journalEntries, newEntry] }));
  };

  const postJournalEntry = (id: string) => {
    setState(s => ({
      ...s,
      journalEntries: s.journalEntries.map(je => je.id === id ? { ...je, status: 'Posted' } : je)
    }));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = { ...invoice, id: uuidv4() };
    // Auto-post to GL
    const arAccountId = state.chartOfAccounts.find(a => a.code === '1200')?.id;
    const revAccountId = state.chartOfAccounts.find(a => a.code === '4010')?.id;
    
    let journalId = '';
    if (arAccountId && revAccountId) {
      journalId = uuidv4();
      const je: JournalEntry = {
        id: journalId,
        date: invoice.issueDate,
        reference: `INV-${newInvoice.id.slice(0,4)}`,
        description: 'Auto-post AR Invoice',
        status: 'Posted',
        lines: [
          { id: uuidv4(), accountId: arAccountId, debit: invoice.totalAmount, credit: 0 },
          { id: uuidv4(), accountId: revAccountId, debit: 0, credit: invoice.totalAmount },
        ]
      };
      setState(s => ({ ...s, journalEntries: [...s.journalEntries, je] }));
    }
    
    newInvoice.journalId = journalId;
    setState(s => ({ ...s, arInvoices: [...s.arInvoices, newInvoice] }));
  };

  const addReceipt = (receipt: Omit<Receipt, 'id'>) => {
    const newReceipt = { ...receipt, id: uuidv4() };
    // Auto-post to GL
    const cashAccountId = state.chartOfAccounts.find(a => a.code === '1010')?.id;
    const arAccountId = state.chartOfAccounts.find(a => a.code === '1200')?.id;
    
    let journalId = '';
    if (cashAccountId && arAccountId) {
      journalId = uuidv4();
      const je: JournalEntry = {
        id: journalId,
        date: receipt.date,
        reference: `RCP-${newReceipt.id.slice(0,4)}`,
        description: 'Auto-post AR Receipt',
        status: 'Posted',
        lines: [
          { id: uuidv4(), accountId: cashAccountId, debit: receipt.amount, credit: 0 },
          { id: uuidv4(), accountId: arAccountId, debit: 0, credit: receipt.amount },
        ]
      };
      setState(s => ({ ...s, journalEntries: [...s.journalEntries, je] }));
    }

    newReceipt.journalId = journalId;
    setState(s => ({ 
      ...s, 
      arReceipts: [...s.arReceipts, newReceipt],
      arInvoices: s.arInvoices.map(inv => 
        inv.id === receipt.invoiceId ? { ...inv, status: 'Paid' } : inv
      )
    }));
  };

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill = { ...bill, id: uuidv4() };
    // Auto-post to GL
    const apAccountId = state.chartOfAccounts.find(a => a.code === '2010')?.id;
    
    let journalId = '';
    if (apAccountId && bill.expenseAccountId) {
      journalId = uuidv4();
      const je: JournalEntry = {
        id: journalId,
        date: bill.date,
        reference: `BILL-${newBill.id.slice(0,4)}`,
        description: 'Auto-post AP Bill',
        status: 'Posted',
        lines: [
          { id: uuidv4(), accountId: bill.expenseAccountId, debit: bill.totalAmount, credit: 0 },
          { id: uuidv4(), accountId: apAccountId, debit: 0, credit: bill.totalAmount },
        ]
      };
      setState(s => ({ ...s, journalEntries: [...s.journalEntries, je] }));
    }

    newBill.journalId = journalId;
    setState(s => ({ ...s, apBills: [...s.apBills, newBill] }));
  };

  const addVoucher = (voucher: Omit<Voucher, 'id'>) => {
    const newVoucher = { ...voucher, id: uuidv4() };
    // Auto-post to GL
    const apAccountId = state.chartOfAccounts.find(a => a.code === '2010')?.id;
    const cashAccountId = state.chartOfAccounts.find(a => a.code === '1010')?.id;
    
    let journalId = '';
    if (apAccountId && cashAccountId) {
      journalId = uuidv4();
      const je: JournalEntry = {
        id: journalId,
        date: voucher.date,
        reference: `VOU-${newVoucher.id.slice(0,4)}`,
        description: 'Auto-post AP Voucher',
        status: 'Posted',
        lines: [
          { id: uuidv4(), accountId: apAccountId, debit: voucher.amount, credit: 0 },
          { id: uuidv4(), accountId: cashAccountId, debit: 0, credit: voucher.amount },
        ]
      };
      setState(s => ({ ...s, journalEntries: [...s.journalEntries, je] }));
    }

    newVoucher.journalId = journalId;
    setState(s => ({ 
      ...s, 
      apVouchers: [...s.apVouchers, newVoucher],
      apBills: s.apBills.map(bill => 
        bill.id === voucher.billId ? { ...bill, status: 'Paid' } : bill
      )
    }));
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "accounting_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <AccountingContext.Provider value={{
      ...state,
      setActiveRole, addAccount, updateAccount, addCustomer, addVendor, addJournalEntry, postJournalEntry, addInvoice, addReceipt, addBill, addVoucher, exportData
    }}>
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  return context;
};
