import React, { useEffect, useState } from 'react';
import { RefreshCw, FileSpreadsheet } from 'lucide-react';

export const Header = ({
  hasScriptUrl,
  isSyncing,
  unsyncedCount,
  onOpenSettings,
  onManualSync
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        padding: scrolled ? '12px 20px 10px' : '20px 20px 8px',
        background: scrolled ? 'rgba(10, 10, 12, 0.96)' : 'rgba(10, 10, 12, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255, 255, 255, 0.07)' : 'transparent'}`,
        boxShadow: scrolled ? '0 8px 24px rgba(0, 0, 0, 0.45)' : '0 0 0 rgba(0, 0, 0, 0)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'padding 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease'
      }}
    >
      {/* Brand Wordmark */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: scrolled ? '1.25rem' : '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: '#ffffff',
          lineHeight: 1,
          transition: 'font-size 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        athanni<span style={{ color: 'rgba(255,255,255,0.45)' }}>.</span>
      </h1>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Sync Status Button */}
        {hasScriptUrl ? (
          <button
            onClick={onManualSync}
            disabled={isSyncing}
            style={{
              padding: '7px 12px',
              borderRadius: '9999px',
              border: 'none',
              background: unsyncedCount > 0 ? 'rgba(245, 158, 11, 0.14)' : 'rgba(16, 185, 129, 0.14)',
              color: unsyncedCount > 0 ? '#fbbf24' : '#34d399',
              fontSize: '0.75rem',
              fontWeight: 700,
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
              padding: '7px 12px',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
              color: '#f0abfc',
              fontSize: '0.75rem',
              fontWeight: 700,
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
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: 'none',
            color: '#a1a1aa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Google Sheets Settings"
        >
          <FileSpreadsheet style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </header>
  );
};
