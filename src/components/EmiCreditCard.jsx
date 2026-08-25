import React, { useState } from 'react';
import {
  CreditCard as CardIcon,
  Calendar,
  PlusCircle,
  Trash2,
  CheckCircle,
  AlertCircle,
  Check,
  DollarSign,
  TrendingDown,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES, getCategoryById } from '../constants/categories';
import { Reveal } from './Reveal';
import { AnimatedBar } from './AnimatedBar';

export const EmiCreditCard = ({
  emis,
  creditCards,
  onAddEmi,
  onDeleteEmi,
  onPayEmi,
  onAddCard,
  onDeleteCard,
  onPayCardBill,
  onUpdateCardBalance,
  currencySymbol = '₹'
}) => {
  const [activeSubTab, setActiveSubTab] = useState('emi'); // 'emi' or 'cards'
  const [showAddEmiForm, setShowAddEmiForm] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editUsedAmount, setEditUsedAmount] = useState('');

  // New EMI Form State
  const [emiTitle, setEmiTitle] = useState('');
  const [emiMonthlyAmount, setEmiMonthlyAmount] = useState('');
  const [emiTotalMonths, setEmiTotalMonths] = useState('12');
  const [emiPaidMonths, setEmiPaidMonths] = useState('0');
  const [emiDueDate, setEmiDueDate] = useState('5');
  const [emiCategory, setEmiCategory] = useState('shopping');

  // New Credit Card Form State
  const [cardName, setCardName] = useState('');
  const [cardBank, setCardBank] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [cardTotalLimit, setCardTotalLimit] = useState('');
  const [cardUsedAmount, setCardUsedAmount] = useState('');
  const [cardBillDate, setCardBillDate] = useState('15');
  const [cardDueDate, setCardDueDate] = useState('5');
  const [cardNetwork, setCardNetwork] = useState('Visa');

  // Total EMI Calculations
  const totalMonthlyEmiCommitment = emis.reduce((acc, e) => {
    return e.paidMonths < e.totalMonths ? acc + (Number(e.monthlyAmount) || 0) : acc;
  }, 0);

  const totalRemainingEmiLiability = emis.reduce((acc, e) => {
    const remainingMonths = Math.max(0, Number(e.totalMonths) - Number(e.paidMonths));
    return acc + (remainingMonths * (Number(e.monthlyAmount) || 0));
  }, 0);

  // Total Credit Card Calculations
  const totalCardLimit = creditCards.reduce((acc, c) => acc + (Number(c.totalLimit) || 0), 0);
  const totalCardUsed = creditCards.reduce((acc, c) => acc + (Number(c.usedAmount) || 0), 0);
  const totalCardAvailable = Math.max(0, totalCardLimit - totalCardUsed);
  const cardUtilizationPercent = totalCardLimit > 0 ? Math.round((totalCardUsed / totalCardLimit) * 100) : 0;

  // Form Handlers
  const handleCreateEmi = (e) => {
    e.preventDefault();
    if (!emiTitle || !emiMonthlyAmount || !emiTotalMonths) return;

    onAddEmi({
      title: emiTitle.trim(),
      monthlyAmount: parseFloat(emiMonthlyAmount),
      totalMonths: parseInt(emiTotalMonths, 10),
      paidMonths: parseInt(emiPaidMonths || 0, 10),
      dueDate: emiDueDate,
      category: emiCategory
    });

    setEmiTitle('');
    setEmiMonthlyAmount('');
    setEmiTotalMonths('12');
    setEmiPaidMonths('0');
    setShowAddEmiForm(false);
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!cardName || !cardTotalLimit) return;

    onAddCard({
      cardName: cardName.trim(),
      bank: cardBank.trim() || 'Bank',
      last4: cardLast4.trim() || '0000',
      totalLimit: parseFloat(cardTotalLimit),
      usedAmount: parseFloat(cardUsedAmount || 0),
      billDate: cardBillDate,
      dueDate: cardDueDate,
      cardNetwork: cardNetwork
    });

    setCardName('');
    setCardBank('');
    setCardLast4('');
    setCardTotalLimit('');
    setCardUsedAmount('');
    setShowAddCardForm(false);
  };

  const handleSaveCardBalanceUpdate = (cardId) => {
    if (editUsedAmount !== '') {
      onUpdateCardBalance(cardId, parseFloat(editUsedAmount));
    }
    setEditingCardId(null);
    setEditUsedAmount('');
  };

  return (
    <div className="animate-fade-in" style={{ marginBottom: '30px' }}>
      {/* Sub Tab Switcher */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(22, 22, 24, 0.9)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '16px',
          padding: '4px',
          marginBottom: '20px'
        }}
      >
        <button
          onClick={() => setActiveSubTab('emi')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: activeSubTab === 'emi' ? 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' : 'transparent',
            color: activeSubTab === 'emi' ? '#ffffff' : '#a1a1aa',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeSubTab === 'emi' ? '0 4px 15px rgba(168, 85, 247, 0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar style={{ width: '18px', height: '18px' }} />
          EMI Installments ({emis.length})
        </button>

        <button
          onClick={() => setActiveSubTab('cards')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: activeSubTab === 'cards' ? 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' : 'transparent',
            color: activeSubTab === 'cards' ? '#ffffff' : '#a1a1aa',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: activeSubTab === 'cards' ? '0 4px 15px rgba(168, 85, 247, 0.4)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <CardIcon style={{ width: '18px', height: '18px' }} />
          Credit Cards ({creditCards.length})
        </button>
      </div>

      {/* Summary Header Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '20px'
        }}
      >
        {activeSubTab === 'emi' ? (
          <>
            <div className="purple-glow-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c084fc', marginBottom: '4px' }}>
                MONTHLY EMI COMMITMENT
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                {currencySymbol}{totalMonthlyEmiCommitment.toLocaleString('en-IN')}<span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 400 }}>/mo</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px' }}>
                Active commitments across {emis.filter(e => e.paidMonths < e.totalMonths).length} ongoing EMIs
              </div>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c084fc', marginBottom: '4px' }}>
                REMAINING EMI OUTSTANDING
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc', fontFamily: 'Outfit, sans-serif' }}>
                {currencySymbol}{totalRemainingEmiLiability.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px' }}>
                Total pending balance liability to pay off
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="purple-glow-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c084fc', marginBottom: '4px' }}>
                TOTAL CREDIT OUTSTANDING
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                {currencySymbol}{totalCardUsed.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px' }}>
                Available credit: {currencySymbol}{totalCardAvailable.toLocaleString('en-IN')} of {currencySymbol}{totalCardLimit.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c084fc' }}>
                  CREDIT UTILIZATION
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: cardUtilizationPercent > 30 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
                    color: cardUtilizationPercent > 30 ? '#f87171' : '#34d399'
                  }}
                >
                  {cardUtilizationPercent}% ({cardUtilizationPercent > 30 ? 'High' : 'Healthy'})
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden', margin: '8px 0' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(cardUtilizationPercent, 100)}%`,
                    backgroundColor: cardUtilizationPercent > 30 ? '#ef4444' : '#a855f7',
                    borderRadius: '9999px'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                Recommended utilization is below 30% for high credit score
              </div>
            </div>
          </>
        )}
      </div>

      {/* SUB-TAB 1: EMIs SECTION */}
      {activeSubTab === 'emi' && (
        <div>
          {/* Add EMI Button & Form */}
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Active EMI Installments</h3>
            <button
              onClick={() => setShowAddEmiForm(!showAddEmiForm)}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <PlusCircle style={{ width: '16px', height: '16px' }} />
              {showAddEmiForm ? 'Cancel' : 'Add New EMI'}
            </button>
          </div>

          {showAddEmiForm && (
            <div className="glass-card animate-fade-in" style={{ padding: '20px', marginBottom: '20px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#c084fc', marginBottom: '14px' }}>
                New EMI Installment Details
              </h4>
              <form onSubmit={handleCreateEmi}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      EMI TITLE / ITEM NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 15 Pro, Car Loan"
                      value={emiTitle}
                      onChange={(e) => setEmiTitle(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      MONTHLY EMI AMOUNT ({currencySymbol}) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="4500"
                      value={emiMonthlyAmount}
                      onChange={(e) => setEmiMonthlyAmount(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      TOTAL DURATION (MONTHS) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={emiTotalMonths}
                      onChange={(e) => setEmiTotalMonths(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      PAID EMIs SO FAR
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={emiTotalMonths}
                      value={emiPaidMonths}
                      onChange={(e) => setEmiPaidMonths(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      PAYMENT DUE DAY OF MONTH
                    </label>
                    <select
                      value={emiDueDate}
                      onChange={(e) => setEmiDueDate(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    >
                      {[1, 5, 10, 15, 20, 25, 28].map(day => (
                        <option key={day} value={day}>{day}th of every month</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      CATEGORY
                    </label>
                    <select
                      value={emiCategory}
                      onChange={(e) => setEmiCategory(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}>
                  <Check style={{ width: '16px', height: '16px' }} /> Save EMI Record
                </button>
              </form>
            </div>
          )}

          {/* EMI Cards List */}
          {emis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#71717a', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px' }}>
              No active EMI records. Click "Add New EMI" to start tracking!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {emis.map((item, idx) => {
                const isCompleted = item.paidMonths >= item.totalMonths;
                const remainingMonths = Math.max(0, item.totalMonths - item.paidMonths);
                const remainingAmount = remainingMonths * item.monthlyAmount;
                const progressPercent = Math.round((item.paidMonths / item.totalMonths) * 100);
                const catObj = getCategoryById(item.category);
                const IconComp = catObj.icon;

                return (
                  <Reveal key={item.id} delay={Math.min(idx, 6) * 70}>
                  <div
                    className="glass-card"
                    style={{
                      padding: '18px',
                      border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(168, 85, 247, 0.2)',
                      background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            backgroundColor: catObj.bgColor,
                            border: `1px solid ${catObj.borderColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <IconComp style={{ width: '20px', height: '20px', color: catObj.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>Due on {item.dueDate}th monthly</span>
                            <span>•</span>
                            <span style={{ color: catObj.color }}>{catObj.name}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc', fontFamily: 'Outfit, sans-serif' }}>
                          {currencySymbol}{item.monthlyAmount.toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 400 }}>/mo</span>
                        </div>
                      </div>
                    </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                          <span style={{ color: '#a1a1aa' }}>
                            {item.paidMonths} of {item.totalMonths} Installments Paid
                          </span>
                          <span style={{ fontWeight: 700, color: isCompleted ? '#34d399' : '#f0abfc' }}>
                            {progressPercent}% Complete
                          </span>
                        </div>
                        <AnimatedBar
                          percent={progressPercent}
                          height={8}
                          background={isCompleted ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #a855f7, #ec4899)'}
                        />
                      </div>

                    {/* Bottom Info & Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                        {isCompleted ? (
                          <span style={{ color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle style={{ width: '14px', height: '14px' }} /> Fully Paid Off!
                          </span>
                        ) : (
                          <span>Remaining Balance: <strong style={{ color: '#ffffff' }}>{currencySymbol}{remainingAmount.toLocaleString('en-IN')}</strong> ({remainingMonths} months)</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isCompleted && (
                          <button
                            onClick={() => onPayEmi(item)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            title="Log monthly EMI payment into main expense history"
                          >
                            <Check style={{ width: '14px', height: '14px' }} /> Record EMI Payment
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteEmi(item.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            padding: '6px 10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete EMI record"
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CREDIT CARDS SECTION */}
      {activeSubTab === 'cards' && (
        <div>
          {/* Add Credit Card Header */}
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Tracked Credit Cards</h3>
            <button
              onClick={() => setShowAddCardForm(!showAddCardForm)}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <PlusCircle style={{ width: '16px', height: '16px' }} />
              {showAddCardForm ? 'Cancel' : 'Add Credit Card'}
            </button>
          </div>

          {showAddCardForm && (
            <div className="glass-card animate-fade-in" style={{ padding: '20px', marginBottom: '20px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#c084fc', marginBottom: '14px' }}>
                New Credit Card Details
              </h4>
              <form onSubmit={handleCreateCard}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      CARD NAME / DISPLAY TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC Millennia, ICICI Amazon"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      BANK NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HDFC Bank, SBI, Axis"
                      value={cardBank}
                      onChange={(e) => setCardBank(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      TOTAL CREDIT LIMIT ({currencySymbol}) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="150000"
                      value={cardTotalLimit}
                      onChange={(e) => setCardTotalLimit(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      CURRENT USED AMOUNT ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={cardUsedAmount}
                      onChange={(e) => setCardUsedAmount(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      BILL GENERATION DAY
                    </label>
                    <select
                      value={cardBillDate}
                      onChange={(e) => setCardBillDate(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    >
                      {[1, 5, 10, 15, 20, 25, 28].map(day => (
                        <option key={day} value={day}>{day}th of month</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      PAYMENT DUE DAY
                    </label>
                    <select
                      value={cardDueDate}
                      onChange={(e) => setCardDueDate(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    >
                      {[1, 5, 10, 15, 20, 25, 28].map(day => (
                        <option key={day} value={day}>{day}th of month</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      LAST 4 DIGITS
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      placeholder="4821"
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '4px' }}>
                      NETWORK
                    </label>
                    <select
                      value={cardNetwork}
                      onChange={(e) => setCardNetwork(e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.85rem', padding: '10px 12px' }}
                    >
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="RuPay">RuPay</option>
                      <option value="Amex">American Express</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}>
                  <Check style={{ width: '16px', height: '16px' }} /> Save Credit Card
                </button>
              </form>
            </div>
          )}

          {/* Cards List */}
          {creditCards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#71717a', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px' }}>
              No credit cards added. Click "Add Credit Card" to start tracking limits & dues!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {creditCards.map((card, idx) => {
                const availableLimit = Math.max(0, card.totalLimit - card.usedAmount);
                const utilization = card.totalLimit > 0 ? Math.round((card.usedAmount / card.totalLimit) * 100) : 0;
                const isEditingThis = editingCardId === card.id;

                return (
                  <Reveal key={card.id} delay={Math.min(idx, 6) * 80}>
                  <div
                    className="pressable"
                    style={{
                      background: 'linear-gradient(150deg, #201a2e 0%, #16121f 60%, #1d1226 100%)',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      borderRadius: '20px',
                      padding: '20px',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Top Card Branding */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', uppercase: 'true', letterSpacing: '0.05em' }}>
                          {card.bank || 'BANK'}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                          {card.cardName}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#c084fc',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        {card.cardNetwork}
                      </div>
                    </div>

                    {/* Masked Card Number */}
                    <div style={{ fontSize: '0.9rem', letterSpacing: '0.15em', color: '#a1a1aa', marginBottom: '16px', fontFamily: 'monospace' }}>
                      •••• •••• •••• {card.last4 || '0000'}
                    </div>

                    {/* Amounts Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '14px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>OUTSTANDING DUE</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: card.usedAmount > 0 ? '#f87171' : '#34d399', fontFamily: 'Outfit, sans-serif' }}>
                          {currencySymbol}{card.usedAmount.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>AVAILABLE LIMIT</div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#c084fc', fontFamily: 'Outfit, sans-serif' }}>
                          {currencySymbol}{availableLimit.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                      {/* Utilization Bar */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#a1a1aa', marginBottom: '4px' }}>
                          <span>Total Limit: {currencySymbol}{card.totalLimit.toLocaleString('en-IN')}</span>
                          <span style={{ color: utilization > 30 ? '#f87171' : '#34d399', fontWeight: 700 }}>{utilization}% Used</span>
                        </div>
                        <AnimatedBar
                          percent={utilization}
                          height={6}
                          track="rgba(255,255,255,0.1)"
                          background={utilization > 30 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #a855f7, #ec4899)'}
                          delay={300 + idx * 90}
                        />
                      </div>

                    {/* Dates Info */}
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span>Bill Date: <strong>{card.billDate}th</strong></span>
                      <span>Payment Due: <strong style={{ color: '#fbbf24' }}>{card.dueDate}th</strong></span>
                    </div>

                    {/* Update Balance Drawer inline */}
                    {isEditingThis ? (
                      <div style={{ background: 'rgba(9,9,11,0.9)', padding: '10px', borderRadius: '12px', marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.72rem', color: '#c084fc', display: 'block', marginBottom: '4px' }}>New Outstanding Amount ({currencySymbol}):</label>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="number"
                            value={editUsedAmount}
                            onChange={(e) => setEditUsedAmount(e.target.value)}
                            className="input-field"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveCardBalanceUpdate(card.id)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {card.usedAmount > 0 && (
                          <button
                            onClick={() => onPayCardBill(card)}
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                            title="Log bill payment transaction into expenses"
                          >
                            <Check style={{ width: '14px', height: '14px' }} /> Pay Card Bill
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingCardId(card.id);
                            setEditUsedAmount(card.usedAmount.toString());
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        >
                          Update Balance
                        </button>
                      </div>

                      <button
                        onClick={() => onDeleteCard(card.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                        title="Delete Card"
                      >
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
