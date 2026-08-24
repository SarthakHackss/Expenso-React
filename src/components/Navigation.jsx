import React from 'react';
import { PlusCircle, History, PieChart, FileSpreadsheet, CreditCard } from 'lucide-react';

export const Navigation = ({ activeTab, onChangeTab, unsyncedCount, activeEmiCount }) => {
  const tabs = [
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History, badge: unsyncedCount > 0 ? unsyncedCount : null },
    { id: 'emi', label: 'EMI / Cards', icon: CreditCard, badge: activeEmiCount > 0 ? activeEmiCount : null },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Sheets', icon: FileSpreadsheet }
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(168, 85, 247, 0.2)',
        padding: '10px 16px',
        zIndex: 50,
        boxShadow: '0 -10px 25px rgba(0,0,0,0.8)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? '#c084fc' : '#71717a',
                cursor: 'pointer',
                position: 'relative',
                padding: '6px 12px',
                borderRadius: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    width: '24px',
                    height: '3px',
                    borderRadius: '9999px',
                    backgroundColor: '#a855f7',
                    boxShadow: '0 0 10px #a855f7'
                  }}
                />
              )}

              <div style={{ position: 'relative' }}>
                <IconComp
                  style={{
                    width: '20px',
                    height: '20px',
                    color: isActive ? '#a855f7' : '#71717a',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s ease'
                  }}
                />
                {tab.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-8px',
                      backgroundColor: '#f59e0b',
                      color: '#000000',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: isActive ? 700 : 500
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
