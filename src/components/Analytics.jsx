import React, { useMemo } from 'react';
import { CATEGORIES, getCategoryById } from '../constants/categories';
import { TrendingUp, PieChart, AlertTriangle, Target, Award, ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { AnimatedBar } from './AnimatedBar';
import { useCountUp } from '../hooks/useCountUp';

export const Analytics = ({
  expenses,
  budget = 35000,
  currencySymbol = '₹',
  onEditBudget
}) => {
  // Current Month Expenses
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return expenses.filter(item => {
      const d = new Date(item.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return currentMonthExpenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  }, [currentMonthExpenses]);

  const budgetUsedPercentage = useMemo(() => {
    if (!budget || budget <= 0) return 0;
    return Math.min(Math.round((totalSpent / budget) * 100), 100);
  }, [totalSpent, budget]);

  const remainingBudget = Math.max(0, budget - totalSpent);

  // Smooth count-up numbers
  const animatedTotal = useCountUp(totalSpent);
  const animatedRemaining = useCountUp(remainingBudget);

  // Category breakdown stats
  const categoryBreakdown = useMemo(() => {
    const totals = {};
    currentMonthExpenses.forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + (parseFloat(item.amount) || 0);
    });

    return CATEGORIES.map((cat) => {
      const amount = totals[cat.id] || 0;
      const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
      return {
        ...cat,
        amount,
        percentage
      };
    })
      .filter((cat) => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthExpenses, totalSpent]);

  // Top spending category
  const topCategory = categoryBreakdown[0];

  // Highest single expense
  const maxExpense = useMemo(() => {
    if (currentMonthExpenses.length === 0) return null;
    return [...currentMonthExpenses].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))[0];
  }, [currentMonthExpenses]);

  return (
    <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
      {/* Top Cards: Monthly Total & Budget */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        {/* Total Spending */}
        <Reveal delay={0}>
          <div className="purple-glow-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                right: '-10px',
                top: '-10px',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f0abfc', letterSpacing: '0.05em' }}>
                MONTHLY SPENDING
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingUp style={{ width: '18px', height: '18px', color: '#f0abfc' }} />
              </div>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
              {currencySymbol}{animatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#a1a1aa', marginTop: '8px' }}>
              <span>{currentMonthExpenses.length} transactions recorded this month</span>
            </div>
          </div>
        </Reveal>

        {/* Budget Tracker */}
        <Reveal delay={90}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f0abfc', letterSpacing: '0.05em' }}>
                MONTHLY BUDGET
              </span>
              <button
                onClick={onEditBudget}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ec4899',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Target style={{ width: '14px', height: '14px' }} /> Set Budget
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                {currencySymbol}{Math.round(animatedRemaining).toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 400 }}>left</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: budgetUsedPercentage > 90 ? '#f87171' : '#f0abfc' }}>
                {budgetUsedPercentage}% used
              </span>
            </div>

            {/* Progress Bar */}
            <AnimatedBar
              percent={budgetUsedPercentage}
              height={8}
              background={budgetUsedPercentage > 90
                ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                : 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)'}
            />

            {budgetUsedPercentage >= 90 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f87171', marginTop: '10px' }}>
                <AlertTriangle style={{ width: '12px', height: '12px' }} />
                <span>Warning: You have used over 90% of your budget limit!</span>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Category Breakdown & Highlights */}
      <Reveal delay={140}>
        <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart style={{ width: '20px', height: '20px', color: '#ec4899' }} /> Spending by Category
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Visual distribution of your monthly expenses</p>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#71717a' }}>
              No expense data available for this month yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {categoryBreakdown.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={item.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '9px',
                            backgroundColor: item.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <IconComp style={{ width: '16px', height: '16px', color: item.color }} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>
                          {item.name}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f0abfc', marginRight: '8px' }}>
                          {currencySymbol}{item.amount.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>({item.percentage}%)</span>
                      </div>
                    </div>

                    {/* Horizontal Bar Chart visual */}
                    <AnimatedBar percent={item.percentage} height={6} background={item.color} delay={300 + idx * 90} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Reveal>

      {/* Quick Insights Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {topCategory && (
          <Reveal delay={180}>
            <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award style={{ width: '22px', height: '22px', color: '#f0abfc' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#a1a1aa', uppercase: 'true' }}>TOP SPENDING CATEGORY</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {topCategory.name} ({topCategory.percentage}%)
              </div>
            </div>
            </div>
          </Reveal>
        )}

        {maxExpense && (
          <Reveal delay={240}>
            <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowUpRight style={{ width: '22px', height: '22px', color: '#f87171' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#a1a1aa', uppercase: 'true' }}>HIGHEST SINGLE EXPENSE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                {currencySymbol}{Number(maxExpense.amount).toLocaleString('en-IN')}
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 400 }}> ({getCategoryById(maxExpense.category).name})</span>
              </div>
            </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};
