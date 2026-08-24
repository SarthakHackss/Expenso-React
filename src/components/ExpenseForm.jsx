import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { PlusCircle, Calendar, FileText, Check, Sparkles } from 'lucide-react';

export const ExpenseForm = ({ onAddExpense, currencySymbol = '₹', hasScriptUrl }) => {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [remark, setRemark] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    const success = await onAddExpense({
      amount: parseFloat(amount),
      category: selectedCategory,
      remark: remark.trim(),
      date: new Date(date).toISOString(),
    });

    if (success) {
      setAmount('');
      setRemark('');
      setDate(new Date().toISOString().substring(0, 10));
    }
    setIsSubmitting(false);
  };

  const handleQuickAdd = (value) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + value).toString());
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Add New Expense</h2>
          <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Enter transaction details to track and sync</p>
        </div>
        {hasScriptUrl && (
          <span
            style={{
              fontSize: '0.7rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '3px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles className="w-3 h-3" /> Auto-Sync Active
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Amount Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '8px' }}>
            AMOUNT ({currencySymbol}) *
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#a855f7'
              }}
            >
              {currencySymbol}
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(9, 9, 11, 0.9)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '16px',
                padding: '16px 16px 16px 44px',
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 700,
                outline: 'none',
                fontFamily: 'Outfit, sans-serif'
              }}
            />
          </div>

          {/* Quick Amount Chips */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {[100, 500, 1000, 2000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickAdd(preset)}
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                +{currencySymbol}{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection Grid */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '10px' }}>
            EXPENSE TYPE / CATEGORY *
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}
          >
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 8px',
                    borderRadius: '16px',
                    border: isSelected
                      ? `2px solid ${cat.color}`
                      : '1px solid rgba(168, 85, 247, 0.12)',
                    background: isSelected
                      ? `linear-gradient(135deg, ${cat.bgColor} 0%, rgba(24, 21, 36, 0.95) 100%)`
                      : 'rgba(18, 17, 26, 0.6)',
                    boxShadow: isSelected ? `0 0 15px ${cat.bgColor}` : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check style={{ width: '10px', height: '10px', color: '#ffffff' }} />
                    </div>
                  )}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: cat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '6px'
                    }}
                  >
                    <IconComp style={{ width: '20px', height: '20px', color: cat.color }} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#ffffff' : '#a1a1aa'
                    }}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selector & Remark Input */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '6px' }}>
              TRANSACTION DATE
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#a855f7'
                }}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(9, 9, 11, 0.8)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 14px 12px 42px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  colorScheme: 'dark'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '6px' }}>
              REMARK / NOTE <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 400 }}>(Optional)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FileText
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  color: '#a855f7'
                }}
              />
              <input
                type="text"
                maxLength={100}
                placeholder="e.g., Dinner with team, Petrol refill, Netflix..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(9, 9, 11, 0.8)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 14px 12px 42px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
          className="btn-primary"
          style={{
            width: '100%',
            opacity: (!amount || parseFloat(amount) <= 0) ? 0.6 : 1,
            cursor: (!amount || parseFloat(amount) <= 0) ? 'not-allowed' : 'pointer'
          }}
        >
          <PlusCircle style={{ width: '20px', height: '20px' }} />
          {isSubmitting ? 'Saving Expense...' : 'Record Expense'}
        </button>
      </form>
    </div>
  );
};
