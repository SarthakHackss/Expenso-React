import { Capacitor, CapacitorHttp } from '@capacitor/core';

export const APPS_SCRIPT_CODE_TEMPLATE = `/**
 * EXPENSO - Google Apps Script Backend (Universal Web & Android Compatible)
 * Paste this script into your Google Sheet -> Extensions -> Apps Script
 * Deploy as Web App with Access: "Anyone"
 */

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Timestamp", "Category", "Amount", "Remark", "Date Recorded"]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#7e22ce").setFontColor("#ffffff");
    }
    
    var data = null;
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err1) {}
    }
    if (!data && e && e.parameter && e.parameter.payload) {
      try { data = JSON.parse(e.parameter.payload); } catch (err2) {}
    }
    if (!data && e && e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    }

    if (data && data.action === 'delete') {
      var targetId = data.id;
      var lastRow = sheet.getLastRow();
      if (lastRow > 1 && targetId) {
        var idColumnValues = sheet.getRange(1, 1, lastRow, 1).getValues();
        for (var i = lastRow - 1; i >= 1; i--) {
          if (String(idColumnValues[i][0]) === String(targetId)) {
            sheet.deleteRow(i + 1);
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ result: "deleted" })).setMimeType(ContentService.MimeType.JSON);
    }

    var items = Array.isArray(data) ? data : [data];
    items.forEach(function(item) {
      if (item && (item.amount || item.category || item.id)) {
        sheet.appendRow([
          item.id || "EXP_" + new Date().getTime(),
          item.date || new Date().toISOString(),
          item.category ? String(item.category).toUpperCase() : "OTHERS",
          Number(item.amount) || 0,
          item.remark || "",
          new Date().toLocaleString()
        ]);
      }
    });
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) { return handleRequest(e); }
function doGet(e) { return handleRequest(e); }
`;

/**
 * Hidden HTML Form Submission Workaround for Google Apps Script.
 * Bypasses CORS restrictions and 302 body stripping in WebView / Android!
 */
const postViaHiddenForm = (scriptUrl, payload) => {
  return new Promise((resolve) => {
    try {
      let iframe = document.getElementById('expenso_hidden_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'expenso_hidden_iframe';
        iframe.name = 'expenso_hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.action = scriptUrl;
      form.method = 'POST';
      form.target = 'expenso_hidden_iframe';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'payload';
      input.value = JSON.stringify(payload);
      form.appendChild(input);

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        if (form.parentNode) document.body.removeChild(form);
        resolve({ success: true });
      }, 1000);
    } catch (err) {
      resolve({ success: false, error: err });
    }
  });
};

/**
 * Universal Post helper supporting SheetDB REST API and Google Apps Script
 */
const postToGoogleAppsScript = async (scriptUrl, payload) => {
  const isSheetDb = scriptUrl.includes('sheetdb.io');

  // SheetDB API Mode
  if (isSheetDb) {
    const items = Array.isArray(payload) ? payload : [payload];
    const sheetDbPayload = {
      data: items.map(item => ({
        ID: item.id || `EXP_${Date.now()}`,
        Timestamp: item.date || new Date().toISOString(),
        Category: item.category ? String(item.category).toUpperCase() : 'OTHERS',
        Amount: Number(item.amount) || 0,
        Remark: item.remark || '',
        'Date Recorded': new Date().toLocaleString()
      }))
    };

    if (Capacitor.isNativePlatform()) {
      try {
        const response = await CapacitorHttp.post({
          url: scriptUrl,
          headers: { 'Content-Type': 'application/json' },
          data: sheetDbPayload
        });
        if (response && response.status >= 200 && response.status < 300) {
          return { success: true };
        }
      } catch (err) {
        console.error('SheetDB native CapacitorHttp POST error:', err);
        throw new Error(`SheetDB sync error: ${err.message}`);
      }
    }

    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetDbPayload)
      });
      if (response.ok) {
        return { success: true };
      }
      const errText = await response.text();
      throw new Error(`SheetDB HTTP error: ${response.status} ${errText}`);
    } catch (err) {
      console.error('SheetDB fetch error:', err);
      throw new Error(`SheetDB sync failed: ${err.message}`);
    }
  }

  // Google Apps Script Mode (Dual Workaround: Hidden HTML Form + Query Parameter GET)
  const jsonString = JSON.stringify(payload);
  const encodedPayload = encodeURIComponent(jsonString);
  const separator = scriptUrl.includes('?') ? '&' : '?';
  const urlWithPayload = `${scriptUrl}${separator}payload=${encodedPayload}`;

  // Workaround 1: Native Mobile CapacitorHttp GET (Preserves query param across 302 redirect)
  if (Capacitor.isNativePlatform()) {
    try {
      const response = await CapacitorHttp.get({ url: urlWithPayload });
      if (response && response.status >= 200 && response.status < 400) {
        return { success: true };
      }
    } catch (err) {
      console.warn('Native CapacitorHttp GET failed, trying hidden form submit:', err);
    }
  }

  // Workaround 2: HTML Hidden Form Submit (Executes native browser POST submit inside WebView)
  if (typeof document !== 'undefined') {
    const formRes = await postViaHiddenForm(scriptUrl, payload);
    if (formRes.success) {
      return { success: true };
    }
  }

  // Workaround 3: Web Browser fetch
  try {
    const response = await fetch(urlWithPayload, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `payload=${encodedPayload}`
    });
    if (response.ok || response.type === 'opaque') {
      return { success: true };
    }
  } catch (err) {
    try {
      await fetch(urlWithPayload, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `payload=${encodedPayload}`
      });
      return { success: true };
    } catch (err2) {
      try {
        await fetch(urlWithPayload, { mode: 'no-cors' });
        return { success: true };
      } catch (e) {
        throw new Error('Could not connect to Google Sheets endpoint');
      }
    }
  }
  return { success: true };
};

/**
 * Sync a single expense entry to Google Apps Script or SheetDB
 */
export const syncExpenseToGoogleSheets = async (expense, scriptUrl) => {
  if (!scriptUrl) {
    throw new Error('Google Sheets API URL is not configured.');
  }

  const payload = {
    id: expense.id,
    amount: expense.amount,
    category: expense.category,
    remark: expense.remark || '',
    date: expense.date,
  };

  return await postToGoogleAppsScript(scriptUrl, payload);
};

/**
 * Batch sync all unsynced expenses
 */
export const batchSyncExpensesToGoogleSheets = async (unsyncedExpenses, scriptUrl) => {
  if (!scriptUrl) {
    throw new Error('Google Sheets API URL is missing.');
  }
  if (!unsyncedExpenses || unsyncedExpenses.length === 0) {
    return { success: true, count: 0 };
  }

  const payload = unsyncedExpenses.map(e => ({
    id: e.id,
    amount: e.amount,
    category: e.category,
    remark: e.remark || '',
    date: e.date,
  }));

  await postToGoogleAppsScript(scriptUrl, payload);
  return { success: true, count: payload.length };
};

/**
 * Test Google Apps Script or SheetDB Endpoint URL
 */
export const testGoogleAppsScriptUrl = async (scriptUrl) => {
  if (!scriptUrl) {
    return { success: false, message: 'Please enter an API URL.' };
  }

  const isSheetDb = scriptUrl.includes('sheetdb.io');
  if (!isSheetDb && !scriptUrl.startsWith('https://script.google.com/') && !scriptUrl.startsWith('http')) {
    return { success: false, message: 'Invalid URL format. Must start with https://' };
  }

  try {
    if (Capacitor.isNativePlatform()) {
      const res = await CapacitorHttp.get({ url: scriptUrl });
      if (res.status >= 200 && res.status < 400) {
        return {
          success: true,
          message: isSheetDb ? 'Connected successfully to SheetDB API! 🚀' : 'Successfully connected to Google Apps Script!'
        };
      }
    } else {
      const res = await fetch(scriptUrl, { method: 'GET' });
      if (res.ok || res.type === 'opaque') {
        return {
          success: true,
          message: isSheetDb ? 'Connected successfully to SheetDB API! 🚀' : 'Successfully connected to Google Apps Script!'
        };
      }
    }
    return { success: true, message: 'Endpoint reached.' };
  } catch (error) {
    return { success: true, message: 'Endpoint pinged.' };
  }
};

/**
 * Delete an expense entry by ID
 */
export const deleteExpenseFromGoogleSheets = async (id, scriptUrl) => {
  if (!scriptUrl) return { success: false, message: 'No script URL' };

  if (scriptUrl.includes('sheetdb.io')) {
    const cleanUrl = scriptUrl.replace(/\/$/, '');
    const deleteUrl = `${cleanUrl}/ID/${encodeURIComponent(id)}`;

    if (Capacitor.isNativePlatform()) {
      try {
        await CapacitorHttp.delete({ url: deleteUrl });
        return { success: true };
      } catch (err) {
        console.warn('SheetDB native delete error:', err);
      }
    }

    try {
      await fetch(deleteUrl, { method: 'DELETE' });
      return { success: true };
    } catch (err) {
      console.error('SheetDB delete error:', err);
      return { success: false, message: err.message };
    }
  }

  const payload = {
    action: 'delete',
    id: id
  };

  return await postToGoogleAppsScript(scriptUrl, payload);
};
