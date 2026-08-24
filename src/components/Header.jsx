import React from 'react';
import { Wallet, RefreshCw, FileSpreadsheet, Sparkles } from 'lucide-react';

export const Header = ({
  hasScriptUrl,
  isSyncing,
  unsyncedCount,
  onOpenSettings,
  onManualSync
}) => {
  return (
    <header
      style={{
        padding: '16px 20px',
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
          }}
        >
          <Wallet style={{ width: '22px', height: '22px', color: '#ffffff' }} />
        </div>
        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            EXPENSO
            <Sparkles style={{ width: '14px', height: '14px', color: '#a855f7' }} />
          </h1>
          <p style={{ fontSize: '0.7rem', color: '#a1a1aa', marginTop: '-2px' }}>
            Smart Expense Tracker
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Sync Status Button */}
        {hasScriptUrl ? (
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              border: unsyncedCount > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
              background: unsyncedCount > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: unsyncedCount > 0 ? '#fbbf24' : '#34d399',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title={unsyncedCount > 0 ? `${unsyncedCount} pending item(s). Click to sync now!` : 'Google Sheets Synced'}
          >
            <RefreshCw
              style={{
                width: '12px',
                height: '12px',
                animation: isSyncing ? 'spin 1s linear infinite' : 'none'
              }}
            />
            {isSyncing ? 'Syncing...' : unsyncedCount > 0 ? `${unsyncedCount} Pending` : 'Sheets Live'}
          </button>
        ) : (
          <button
            onClick={onOpenSettings}
            className="animate-pulse-glow"
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet style={{ width: '12px', height: '12px' }} />
            Connect Sheets
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            color: '#c084fc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Google Sheets Settings"
        >
          <FileSpreadsheet style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};
