import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AccountingProvider } from './context/AccountingContext';
import { MainLayout } from './layout/MainLayout';
import { Dashboard } from './views/Dashboard';
import { ChartOfAccounts } from './views/gl/ChartOfAccounts';
import { JournalEntriesList } from './views/gl/JournalEntriesList';
import { JournalEntryForm } from './views/gl/JournalEntryForm';
import { CustomersList } from './views/ar/CustomersList';
import { InvoicesList } from './views/ar/InvoicesList';
import { VendorsList } from './views/ap/VendorsList';
import { BillsList } from './views/ap/BillsList';
import { IncomeStatement } from './views/reports/IncomeStatement';
import { BalanceSheet } from './views/reports/BalanceSheet';

function App() {
  return (
    <AccountingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="gl/accounts" element={<ChartOfAccounts />} />
            <Route path="gl/journals" element={<JournalEntriesList />} />
            <Route path="gl/journals/new" element={<JournalEntryForm />} />
            
            <Route path="ar/customers" element={<CustomersList />} />
            <Route path="ar/invoices" element={<InvoicesList />} />
            <Route path="ap/vendors" element={<VendorsList />} />
            <Route path="ap/bills" element={<BillsList />} />
            <Route path="reports/income-statement" element={<IncomeStatement />} />
            <Route path="reports/balance-sheet" element={<BalanceSheet />} />
          </Route>
        </Routes>
      </Router>
    </AccountingProvider>
  );
}

export default App;
