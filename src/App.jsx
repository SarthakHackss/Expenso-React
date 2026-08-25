import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ExpenseForm } from './components/ExpenseForm';
import { TransactionList } from './components/TransactionList';
import { Analytics } from './components/Analytics';
import { EmiCreditCard } from './components/EmiCreditCard';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { BudgetModal } from './components/BudgetModal';
import { Toast } from './components/Toast';
import { Splash } from './components/Splash';
import {
  getExpenses,
  addExpense,
  deleteExpense,
  markExpenseSynced,
  getScriptUrl,
  saveScriptUrl,
  getMonthlyBudget,
  saveMonthlyBudget,
  getCurrencySymbol,
  saveCurrencySymbol,
  getEmis,
  addEmi,
  deleteEmi,
  payEmiInstallment,
  getCreditCards,
  addCreditCard,
  deleteCreditCard,
  updateCreditCardBalance,
  clearAllData
} from './services/storage';
import {
  syncExpenseToGoogleSheets,
  batchSyncExpensesToGoogleSheets,
  deleteExpenseFromGoogleSheets
} from './services/googleSheets';
import { Download, Trash2, FileSpreadsheet } from 'lucide-react';

export const TAB_ORDER = ['add', 'history', 'emi', 'analytics', 'settings'];

export const App = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [tabDir, setTabDir] = useState('fwd');
  const [expenses, setExpenses] = useState([]);
  const [emis, setEmis] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  const [scriptUrl, setScriptUrlState] = useState('');
  const [budget, setBudget] = useState(35000);
  const [currency, setCurrency] = useState('₹');

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Initial Data Load
  useEffect(() => {
    setExpenses(getExpenses());
    setEmis(getEmis());
    setCreditCards(getCreditCards());
    setScriptUrlState(getScriptUrl());
    setBudget(getMonthlyBudget());
    setCurrency(getCurrencySymbol());
  }, []);

  const unsyncedExpenses = useMemo(() => {
    return expenses.filter(e => !e.synced);
  }, [expenses]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Direction-aware tab switching animation
  const changeTab = (tab) => {
    if (tab === activeTab) return;
    setTabDir(TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(activeTab) ? 'fwd' : 'back');
    setActiveTab(tab);
  };

  // Add Expense Handler (with automatic cloud sync)
  const handleAddExpense = async (data) => {
    // 1. Create local entry
    const newEntry = addExpense({
      ...data,
      synced: false
    });

    // Update local state immediately
    setExpenses(prev => [newEntry, ...prev]);

    // 2. Auto-sync if Google Apps Script URL is configured
    if (scriptUrl) {
      setIsSyncing(true);
      try {
        await syncExpenseToGoogleSheets(newEntry, scriptUrl);
        const updatedList = markExpenseSynced(newEntry.id, true);
        setExpenses(updatedList);
        showToast('Expense recorded & synced to Google Sheets! 🚀', 'success');
      } catch (err) {
        console.warn('Auto-sync failed, kept locally as pending:', err);
        showToast('Recorded locally. Sync pending (check internet or script URL).', 'info');
      } finally {
        setIsSyncing(false);
      }
    } else {
      showToast('Expense recorded locally. Connect Google Sheets to auto-sync!', 'info');
    }

    return true;
  };

  // Delete Expense Handler
  const handleDeleteExpense = async (id) => {
    // 1. Delete locally
    const updated = deleteExpense(id);
    setExpenses(updated);

    // 2. Delete from Google Sheets if scriptUrl exists
    if (scriptUrl) {
      try {
        await deleteExpenseFromGoogleSheets(id, scriptUrl);
        showToast('Expense entry deleted from App & Google Sheets 🗑️', 'info');
      } catch (err) {
        showToast('Deleted locally (failed to sync delete with Google Sheets)', 'info');
      }
    } else {
      showToast('Expense entry deleted', 'info');
    }
  };

  // Sync single item
  const handleSyncSingle = async (expense) => {
    if (!scriptUrl) {
      setIsSettingsOpen(true);
      showToast('Please configure Google Apps Script URL first', 'error');
      return;
    }

    try {
      await syncExpenseToGoogleSheets(expense, scriptUrl);
      const updated = markExpenseSynced(expense.id, true);
      setExpenses(updated);
      showToast('Expense synced to Google Sheets!', 'success');
    } catch (err) {
      showToast(`Sync failed: ${err.message}`, 'error');
    }
  };

  // Sync all pending items
  const handleManualSync = async () => {
    if (!scriptUrl) {
      setIsSettingsOpen(true);
      showToast('Please set your Google Apps Script Web App URL', 'error');
      return;
    }

    if (unsyncedExpenses.length === 0) {
      showToast('All items are already synced!', 'info');
      return;
    }

    setIsSyncing(true);
    try {
      await batchSyncExpensesToGoogleSheets(unsyncedExpenses, scriptUrl);
      const updated = expenses.map(e => ({ ...e, synced: true }));
      localStorage.setItem('expenso_expenses', JSON.stringify(updated));
      setExpenses(updated);
      showToast(`Successfully synced ${unsyncedExpenses.length} entries to Google Sheets! 🎉`, 'success');
    } catch (err) {
      showToast(`Batch sync failed: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveScriptUrl = (url) => {
    saveScriptUrl(url);
    setScriptUrlState(url);
  };

  const handleSaveBudget = (val) => {
    saveMonthlyBudget(val);
    setBudget(val);
    showToast('Monthly budget updated', 'success');
  };

  const handleSaveCurrency = (val) => {
    saveCurrencySymbol(val);
    setCurrency(val);
  };

  // EMI Handlers
  const handleAddEmi = (emiData) => {
    const updated = addEmi(emiData);
    setEmis(updated);
    showToast('EMI Installment record created', 'success');
  };

  const handleDeleteEmi = (id) => {
    const updated = deleteEmi(id);
    setEmis(updated);
    showToast('EMI record removed', 'info');
  };

  const handlePayEmi = async (emi) => {
    // 1. Update EMI paid counter
    const updatedEmis = payEmiInstallment(emi.id);
    setEmis(updatedEmis);

    // 2. Automatically log expense entry
    await handleAddExpense({
      amount: emi.monthlyAmount,
      category: emi.category || 'shopping',
      remark: `EMI Payment: ${emi.title} (${emi.paidMonths + 1}/${emi.totalMonths})`,
      date: new Date().toISOString()
    });
  };

  // Credit Card Handlers
  const handleAddCard = (cardData) => {
    const updated = addCreditCard(cardData);
    setCreditCards(updated);
    showToast('Credit Card added to tracker', 'success');
  };

  const handleDeleteCard = (id) => {
    const updated = deleteCreditCard(id);
    setCreditCards(updated);
    showToast('Credit Card removed', 'info');
  };

  const handleUpdateCardBalance = (id, newBalance) => {
    const updated = updateCreditCardBalance(id, newBalance);
    setCreditCards(updated);
    showToast('Credit Card balance updated', 'success');
  };

  const handlePayCardBill = async (card) => {
    const billAmount = card.usedAmount;
    if (billAmount <= 0) return;

    // 1. Clear card outstanding balance
    const updatedCards = updateCreditCardBalance(card.id, 0);
    setCreditCards(updatedCards);

    // 2. Automatically log expense entry
    await handleAddExpense({
      amount: billAmount,
      category: 'bills',
      remark: `Credit Card Bill Payment: ${card.cardName}`,
      date: new Date().toISOString()
    });
  };

  const handleClearAllLocalData = () => {
    if (window.confirm('Are you sure you want to reset all local transactions, EMIs, and credit card data?')) {
      clearAllData();
      setExpenses([]);
      setEmis([]);
      setCreditCards([]);
      showToast('All local app data cleared successfully!', 'info');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showToast('No expenses to export', 'error');
      return;
    }
    const headers = ['ID', 'Date', 'Category', 'Amount', 'Remark', 'Synced'];
    const rows = expenses.map(e => [
      e.id,
      `"${e.date}"`,
      `"${e.category}"`,
      e.amount,
      `"${(e.remark || '').replace(/"/g, '""')}"`,
      e.synced ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ATHANNI_Expenses_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Expenses exported to CSV!', 'success');
  };

  return (
    <div className="app-container">
      {/* Opening Animation */}
      <Splash />

      {/* Ambient floating glow orbs */}
      <div className="ambient-orb" style={{ width: 260, height: 260, top: -70, right: -70, background: 'rgba(168, 85, 247, 0.14)' }} />
      <div className="ambient-orb" style={{ width: 230, height: 230, bottom: '28%', left: -90, background: 'rgba(236, 72, 153, 0.1)', animationDelay: '-7s' }} />

      {/* App Header */}
      <Header
        hasScriptUrl={!!scriptUrl}
        isSyncing={isSyncing}
        unsyncedCount={unsyncedExpenses.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onManualSync={handleManualSync}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, padding: '8px 20px 30px' }}>
        {/* Page Title Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            margin: '10px 0 22px'
          }}
        >
          <h2 className="page-title title-in" key={activeTab}>
            {activeTab === 'add' && 'Add Expense'}
            {activeTab === 'history' && 'Activity'}
            {activeTab === 'emi' && 'EMI & Cards'}
            {activeTab === 'analytics' && 'Analytics'}
            {activeTab === 'settings' && 'Sheets'}
          </h2>

          <button
            onClick={() => setIsBudgetOpen(true)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              color: '#f0abfc',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Budget: {currency}{budget.toLocaleString()}
          </button>
        </div>

        {/* Tab Content (direction-aware slide transition) */}
        <div key={activeTab} className={tabDir === 'fwd' ? 'tab-enter-fwd' : 'tab-enter-back'}>
          {/* Tab 1: Add Expense */}
          {activeTab === 'add' && (
            <div>
            <ExpenseForm
              onAddExpense={handleAddExpense}
              currencySymbol={currency}
              hasScriptUrl={!!scriptUrl}
            />

            {/* Quick Recent Transactions Preview */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Recent Activity</h3>
                <button
                  onClick={() => setActiveTab('history')}
                  style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  View All ({expenses.length}) →
                </button>
              </div>
              <TransactionList
                expenses={expenses.slice(0, 3)}
                onDeleteExpense={handleDeleteExpense}
                onSyncSingle={handleSyncSingle}
                hasScriptUrl={!!scriptUrl}
                currencySymbol={currency}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Transaction History */}
        {activeTab === 'history' && (
          <TransactionList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onSyncSingle={handleSyncSingle}
            hasScriptUrl={!!scriptUrl}
            currencySymbol={currency}
          />
        )}

        {/* Tab 3: EMI / Credit Cards */}
        {activeTab === 'emi' && (
          <EmiCreditCard
            emis={emis}
            creditCards={creditCards}
            onAddEmi={handleAddEmi}
            onDeleteEmi={handleDeleteEmi}
            onPayEmi={handlePayEmi}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onPayCardBill={handlePayCardBill}
            onUpdateCardBalance={handleUpdateCardBalance}
            currencySymbol={currency}
          />
        )}

        {/* Tab 4: Analytics */}
        {activeTab === 'analytics' && (
          <Analytics
            expenses={expenses}
            budget={budget}
            currencySymbol={currency}
            onEditBudget={() => setIsBudgetOpen(true)}
          />
        )}

        {/* Tab 4: Settings & Integrations */}
        {activeTab === 'settings' && (
          <div className="glass-card animate-fade-in" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
              Settings & Cloud Backup
            </h3>

            {/* Google Sheets Integration Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '22px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileSpreadsheet style={{ width: '24px', height: '24px', color: '#34d399' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Google Sheets Apps Script</div>
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                      {scriptUrl ? 'Connected and ready to log' : 'Not configured yet'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                >
                  Configure
                </button>
              </div>

              {scriptUrl && (
                <div style={{ wordBreak: 'break-all', fontSize: '0.75rem', color: '#f0abfc', background: '#0f0f11', padding: '10px 12px', borderRadius: '10px' }}>
                  {scriptUrl}
                </div>
              )}
            </div>

            {/* CSV Backup & Export */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <button
                onClick={handleExportCSV}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download style={{ width: '16px', height: '16px' }} /> Export Expenses to CSV
              </button>

              <button
                onClick={handleClearAllLocalData}
                style={{
                  width: '100%',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  borderRadius: '9999px',
                  padding: '12px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Trash2 style={{ width: '16px', height: '16px' }} /> Reset / Clear All App Data
              </button>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Touch-Friendly Bottom Bar Navigation */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={changeTab}
        unsyncedCount={unsyncedExpenses.length}
        activeEmiCount={emis.filter(e => e.paidMonths < e.totalMonths).length}
      />

      {/* Google Sheets Config Modal */}
      <GoogleSheetModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        scriptUrl={scriptUrl}
        onSaveScriptUrl={handleSaveScriptUrl}
        onShowToast={showToast}
      />

      {/* Budget Config Modal */}
      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        currentBudget={budget}
        currentCurrency={currency}
        onSaveBudget={handleSaveBudget}
        onSaveCurrency={handleSaveCurrency}
      />

      {/* Floating Notification Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
};
