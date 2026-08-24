const KEYS = {
  EXPENSES: 'expenso_expenses',
  SCRIPT_URL: 'expenso_script_url',
  BUDGET: 'expenso_monthly_budget',
  CURRENCY: 'expenso_currency_symbol',
  EMIS: 'expenso_emis_data',
  CARDS: 'expenso_credit_cards_data'
};

const INITIAL_EXPENSES = [];
const INITIAL_EMIS = [];
const INITIAL_CARDS = [];

export const getExpenses = () => {
  try {
    const data = localStorage.getItem(KEYS.EXPENSES);
    if (!data) {
      localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading expenses from storage:', error);
    return [];
  }
};

export const saveExpenses = (expenses) => {
  try {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses to storage:', error);
  }
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    amount: Number(expense.amount),
    category: expense.category,
    remark: expense.remark ? expense.remark.trim() : '',
    date: expense.date || new Date().toISOString(),
    synced: !!expense.synced,
    createdAt: Date.now()
  };
  
  const updated = [newExpense, ...expenses];
  saveExpenses(updated);
  return newExpense;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const updated = expenses.filter(e => e.id !== id);
  saveExpenses(updated);
  return updated;
};

export const markExpenseSynced = (id, status = true) => {
  const expenses = getExpenses();
  const updated = expenses.map(e => e.id === id ? { ...e, synced: status } : e);
  saveExpenses(updated);
  return updated;
};

export const getScriptUrl = () => {
  return localStorage.getItem(KEYS.SCRIPT_URL) || '';
};

export const saveScriptUrl = (url) => {
  localStorage.setItem(KEYS.SCRIPT_URL, url.trim());
};

export const getMonthlyBudget = () => {
  const val = localStorage.getItem(KEYS.BUDGET);
  return val ? Number(val) : 35000;
};

export const saveMonthlyBudget = (budget) => {
  localStorage.setItem(KEYS.BUDGET, budget);
};

export const getCurrencySymbol = () => {
  return localStorage.getItem(KEYS.CURRENCY) || '₹';
};

export const saveCurrencySymbol = (symbol) => {
  localStorage.setItem(KEYS.CURRENCY, symbol);
};

/* EMI Storage Methods */
export const getEmis = () => {
  try {
    const data = localStorage.getItem(KEYS.EMIS);
    if (!data) {
      localStorage.setItem(KEYS.EMIS, JSON.stringify(INITIAL_EMIS));
      return INITIAL_EMIS;
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveEmis = (emis) => {
  localStorage.setItem(KEYS.EMIS, JSON.stringify(emis));
};

export const addEmi = (emi) => {
  const emis = getEmis();
  const newEmi = {
    id: `emi_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: emi.title,
    monthlyAmount: Number(emi.monthlyAmount),
    totalMonths: Number(emi.totalMonths),
    paidMonths: Number(emi.paidMonths || 0),
    dueDate: emi.dueDate || '5',
    category: emi.category || 'shopping',
    createdAt: Date.now()
  };
  const updated = [newEmi, ...emis];
  saveEmis(updated);
  return updated;
};

export const deleteEmi = (id) => {
  const emis = getEmis();
  const updated = emis.filter(e => e.id !== id);
  saveEmis(updated);
  return updated;
};

export const payEmiInstallment = (id) => {
  const emis = getEmis();
  const updated = emis.map(e => {
    if (e.id === id && e.paidMonths < e.totalMonths) {
      return { ...e, paidMonths: e.paidMonths + 1 };
    }
    return e;
  });
  saveEmis(updated);
  return updated;
};

/* Credit Card Storage Methods */
export const getCreditCards = () => {
  try {
    const data = localStorage.getItem(KEYS.CARDS);
    if (!data) {
      localStorage.setItem(KEYS.CARDS, JSON.stringify(INITIAL_CARDS));
      return INITIAL_CARDS;
    }
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const saveCreditCards = (cards) => {
  localStorage.setItem(KEYS.CARDS, JSON.stringify(cards));
};

export const addCreditCard = (card) => {
  const cards = getCreditCards();
  const newCard = {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    cardName: card.cardName,
    bank: card.bank || 'Bank',
    last4: card.last4 || '0000',
    totalLimit: Number(card.totalLimit),
    usedAmount: Number(card.usedAmount || 0),
    billDate: card.billDate || '15',
    dueDate: card.dueDate || '5',
    cardNetwork: card.cardNetwork || 'Visa',
    createdAt: Date.now()
  };
  const updated = [newCard, ...cards];
  saveCreditCards(updated);
  return updated;
};

export const deleteCreditCard = (id) => {
  const cards = getCreditCards();
  const updated = cards.filter(c => c.id !== id);
  saveCreditCards(updated);
  return updated;
};

export const updateCreditCardBalance = (id, newUsedAmount) => {
  const cards = getCreditCards();
  const updated = cards.map(c => c.id === id ? { ...c, usedAmount: Math.max(0, Number(newUsedAmount)) } : c);
  saveCreditCards(updated);
  return updated;
};

export const clearAllData = () => {
  localStorage.removeItem(KEYS.EXPENSES);
  localStorage.removeItem(KEYS.SCRIPT_URL);
  localStorage.removeItem(KEYS.EMIS);
  localStorage.removeItem(KEYS.CARDS);
};

