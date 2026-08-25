import React, { useState, useMemo } from 'react';
import { CATEGORIES, getCategoryById } from '../constants/categories';
import { Search, Trash2, RefreshCw, CheckCircle, Clock, Filter } from 'lucide-react';
import { Reveal } from './Reveal';

export const TransactionList = ({
  expenses,
  onDeleteExpense,
  onSyncSingle,
  hasScriptUrl,
  currencySymbol = '₹'
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingId, setSyncingId] = useState(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const catObj = getCategoryById(item.category);
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (item.remark && item.remark.toLowerCase().includes(searchLower)) ||
        catObj.name.toLowerCase().includes(searchLower) ||
        item.amount.toString().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchQuery]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  }, [filteredExpenses]);

  const handleSyncClick = async (expense) => {
    setSyncingId(expense.id);
    await onSyncSingle(expense);
    setSyncingId(null);
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      {/* Header & Total Filtered */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Transaction History</h3>
          <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
            Showing {filteredExpenses.length} of {expenses.length} records
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#a1a1aa', uppercase: 'true' }}>TOTAL FILTERED</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#c084fc' }}>
            {currencySymbol}{totalFilteredAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#a855f7'
          }}
        />
        <input
          type="text"
          placeholder="Search by remark, category or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '40px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Filter Category Horizontal Scroll */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '16px',
          scrollbarWidth: 'none'
        }}
      >
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            border: selectedCategory === 'all' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
            background: selectedCategory === 'all' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
            color: selectedCategory === 'all' ? '#ffffff' : '#a1a1aa',
            transition: 'all 0.15s ease'
          }}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: isSelected ? `1px solid ${cat.color}` : '1px solid rgba(255,255,255,0.08)',
                background: isSelected ? cat.bgColor : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#ffffff' : '#a1a1aa',
                transition: 'all 0.15s ease'
              }}
            >
              <IconComp style={{ width: '12px', height: '12px', color: cat.color }} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* List items */}
      {filteredExpenses.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#71717a',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <Filter style={{ width: '32px', height: '32px', color: '#3f3f46', marginBottom: '8px' }} />
          <p style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>No expense records found</p>
          <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Try resetting your filter or search query</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredExpenses.map((expense, idx) => {
            const category = getCategoryById(expense.category);
            const IconComp = category.icon;
            const isSyncingThis = syncingId === expense.id;

            return (
              <Reveal key={expense.id} delay={Math.min(idx, 8) * 55}>
                <div
                  className="pressable"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '18px'
                  }}
                >
                {/* Left: Category Icon & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: category.bgColor,
                      border: `1px solid ${category.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconComp style={{ width: '22px', height: '22px', color: category.color }} />
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                        {category.name}
                      </span>
                      {/* Sync Badge */}
                      {expense.synced ? (
                        <span className="badge badge-synced" title="Synced with Google Sheets">
                          <CheckCircle style={{ width: '10px', height: '10px' }} /> Synced
                        </span>
                      ) : (
                        <span className="badge badge-pending" title="Pending Sync">
                          <Clock style={{ width: '10px', height: '10px' }} /> Pending
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: expense.remark ? '#e4e4e7' : '#71717a',
                        fontStyle: expense.remark ? 'normal' : 'italic',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px'
                      }}
                    >
                      {expense.remark || 'No remark added'}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '2px' }}>
                      {formatDate(expense.date)}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c084fc', fontFamily: 'Outfit, sans-serif' }}>
                      -{currencySymbol}{Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Sync / Delete Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {!expense.synced && hasScriptUrl && (
                      <button
                        onClick={() => handleSyncClick(expense)}
                        disabled={isSyncingThis}
                        style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          color: '#fbbf24',
                          padding: '6px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Sync this expense to Google Sheets now"
                      >
                        <RefreshCw style={{ width: '14px', height: '14px', animation: isSyncingThis ? 'spin 1s linear infinite' : 'none' }} />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        padding: '6px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      title="Delete entry"
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
  );
};
