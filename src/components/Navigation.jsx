import React from 'react';
import { PlusCircle, History, PieChart, FileSpreadsheet, CreditCard } from 'lucide-react';

export const Navigation = ({ activeTab, onChangeTab, unsyncedCount, activeEmiCount }) => {
  const tabs = [
    { id: 'add', label: 'Add', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History, badge: unsyncedCount > 0 ? unsyncedCount : null },
    { id: 'emi', label: 'EMI', icon: CreditCard, badge: activeEmiCount > 0 ? activeEmiCount : null },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Sheets', icon: FileSpreadsheet }
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {tabs.map((tab, idx) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              style={{ animation: `fadeInUp 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) ${0.05 * idx}s both` }}
              aria-label={tab.label}
              title={tab.label}
            >
              <IconComp
                style={{
                  width: 21,
                  height: 21,
                  strokeWidth: isActive ? 2.4 : 2
                }}
              />
              {tab.badge && <span className="nav-badge">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
