import React, { useState } from 'react';
import { X, Target, DollarSign, Check } from 'lucide-react';

export const BudgetModal = ({
  isOpen,
  onClose,
  currentBudget,
  currentCurrency,
  onSaveBudget,
  onSaveCurrency
}) => {
  const [budgetVal, setBudgetVal] = useState(currentBudget || 35000);
  const [currencyVal, setCurrencyVal] = useState(currentCurrency || '₹');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBudget(Number(budgetVal));
    onSaveCurrency(currencyVal);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '24px',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(168, 85, 247, 0.2)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Target style={{ width: '20px', height: '20px', color: '#a855f7' }} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Budget & Preferences</h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              padding: '6px',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '6px' }}>
              CURRENCY SYMBOL
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['₹', '$', '€', '£', 'AED', '¥'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setCurrencyVal(sym)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '10px',
                    border: currencyVal === sym ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                    background: currencyVal === sym ? 'rgba(168, 85, 247, 0.25)' : 'rgba(18, 17, 26, 0.6)',
                    color: currencyVal === sym ? '#ffffff' : '#a1a1aa',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '6px' }}>
              MONTHLY SPENDING LIMIT ({currencyVal})
            </label>
            <input
              type="number"
              min="1"
              required
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            <Check style={{ width: '18px', height: '18px' }} /> Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};
