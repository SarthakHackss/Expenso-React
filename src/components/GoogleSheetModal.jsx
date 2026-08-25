import React, { useState } from 'react';
import { APPS_SCRIPT_CODE_TEMPLATE, testGoogleAppsScriptUrl } from '../services/googleSheets';
import { X, Copy, Check, ExternalLink, FileSpreadsheet, Send, HelpCircle, ShieldCheck, Zap, Code } from 'lucide-react';

export const GoogleSheetModal = ({
  isOpen,
  onClose,
  scriptUrl,
  onSaveScriptUrl,
  onShowToast
}) => {
  const [activeMode, setActiveMode] = useState(scriptUrl && scriptUrl.includes('sheetdb.io') ? 'sheetdb' : 'sheetdb');
  const [urlInput, setUrlInput] = useState(scriptUrl || '');
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE_TEMPLATE);
    setCopied(true);
    if (onShowToast) onShowToast('Google Apps Script code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveScriptUrl(urlInput.trim());
    if (onShowToast) onShowToast('Google Sheets Sync URL saved successfully!', 'success');
    onClose();
  };

  const handleTestConnection = async () => {
    if (!urlInput) {
      setTestResult({ success: false, message: 'Please enter a URL first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const res = await testGoogleAppsScriptUrl(urlInput.trim());
    setTestResult(res);
    setIsTesting(false);
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
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(168, 85, 247, 0.2)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileSpreadsheet style={{ width: '22px', height: '22px', color: '#34d399' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>Google Sheets Sync Setup</h2>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Connect Athanni to your Google Sheet</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#a1a1aa',
              padding: '6px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: '#0f0f11',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode('sheetdb')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeMode === 'sheetdb' ? '1px solid #a855f7' : 'none',
              background: activeMode === 'sheetdb' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: activeMode === 'sheetdb' ? '#ffffff' : '#a1a1aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Zap style={{ width: '14px', height: '14px', color: '#c084fc' }} />
            SheetDB (Recommended)
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('appscript')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeMode === 'appscript' ? '1px solid #a855f7' : 'none',
              background: activeMode === 'appscript' ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: activeMode === 'appscript' ? '#ffffff' : '#a1a1aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Code style={{ width: '14px', height: '14px', color: '#a1a1aa' }} />
            Apps Script
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '8px' }}>
            {activeMode === 'sheetdb' ? 'SHEETDB API ENDPOINT URL' : 'GOOGLE APPS SCRIPT WEB APP URL'}
          </label>

          <input
            type="url"
            required
            placeholder={
              activeMode === 'sheetdb'
                ? 'https://sheetdb.io/api/v1/YOUR_API_ID'
                : 'https://script.google.com/macros/s/.../exec'
            }
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="input-field"
            style={{ marginBottom: '12px', fontSize: '0.85rem' }}
          />

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="btn-secondary"
              style={{ flex: 1, fontSize: '0.85rem' }}
            >
              <Send style={{ width: '14px', height: '14px' }} />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>

            <button type="submit" className="btn-primary" style={{ flex: 1, fontSize: '0.85rem' }}>
              <ShieldCheck style={{ width: '16px', height: '16px' }} />
              Save Endpoint URL
            </button>
          </div>

          {testResult && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                backgroundColor: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: testResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                color: testResult.success ? '#34d399' : '#f87171'
              }}
            >
              {testResult.message}
            </div>
          )}
        </form>

        {/* Dynamic Mode Instructions */}
        {activeMode === 'sheetdb' ? (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap style={{ width: '16px', height: '16px', color: '#eab308' }} /> Quick 3-Step SheetDB Setup (100% Android Compatible)
            </div>

            <ol style={{ paddingLeft: '18px', fontSize: '0.78rem', color: '#e4e4e7', lineHeight: '1.6' }}>
              <li style={{ marginBottom: '6px' }}>
                Open{' '}
                <a
                  href="https://sheetdb.io"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#c084fc', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                >
                  sheetdb.io <ExternalLink style={{ width: '10px', height: '10px' }} />
                </a>{' '}
                and sign in with your Google account.
              </li>
              <li style={{ marginBottom: '6px' }}>
                Click <strong>Create new API</strong> and paste your Google Sheet URL (from{' '}
                <a href="https://sheets.new" target="_blank" rel="noreferrer" style={{ color: '#c084fc', textDecoration: 'underline' }}>
                  sheets.new
                </a>
                ).
              </li>
              <li>
                Copy the generated API URL (e.g. <code>https://sheetdb.io/api/v1/58f6...</code>) and paste it into the field above!
              </li>
            </ol>
          </div>
        ) : (
          <>
            {/* 1-Click Code Snippet Copy */}
            <div
              style={{
                backgroundColor: '#0f0f11',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  1. Copy Google Apps Script Backend Code
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                    border: copied ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(168, 85, 247, 0.4)',
                    color: copied ? '#34d399' : '#c084fc',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copied ? <Check style={{ width: '14px', height: '14px' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                  {copied ? 'Copied Code!' : 'Copy Script Code'}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                This code automatically appends expense records into your Google Sheet.
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle style={{ width: '16px', height: '16px' }} /> Apps Script Guide
              </div>
              <ol style={{ paddingLeft: '18px', fontSize: '0.78rem', color: '#e4e4e7', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '6px' }}>Open your Google Sheet $\rightarrow$ <strong>Extensions</strong> $\rightarrow$ <strong>Apps Script</strong>.</li>
                <li style={{ marginBottom: '6px' }}>Paste the code, click Save 💾.</li>
                <li>Click <strong>Deploy</strong> $\rightarrow$ <strong>New deployment</strong> $\rightarrow$ Set access to <strong>Anyone</strong> $\rightarrow$ Copy Web App URL.</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
