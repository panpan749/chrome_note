import { VISITS_KEY, normalizeUrl, validVisits, recordVisit, rankVisits } from './visits.js';

// One writer prevents simultaneous tab events from overwriting each other.
let visitsQueue = Promise.resolve();
function withVisits(task) {
  const result = visitsQueue.then(async () => {
    const stored = await chrome.storage.local.get(VISITS_KEY);
    return task(validVisits(stored[VISITS_KEY]));
  });
  visitsQueue = result.catch(() => {});
  return result;
}

function trackTab(tab, metadataOnly = false) {
  if (!tab || tab.incognito || !normalizeUrl(tab.url)) return;
  const now = Date.now();
  withVisits(async (sites) => {
    const updated = recordVisit(sites, tab.url, tab.title, now, metadataOnly);
    if (updated !== sites) await chrome.storage.local.set({ [VISITS_KEY]: updated });
  }).catch((error) => console.warn('随手记：无法保存网页访问记录', error));
}

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
  if (change.status === 'complete' || (change.url && tab.status === 'complete')) trackTab(tab);
  else if (change.title) trackTab(tab, true);
});
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.status === 'complete') trackTab(tab);
  } catch { /* A tab can close before its activation event is handled. */ }
});

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id || !sender.tab || sender.frameId !== 0) return;
  // The first page can finish before a newly installed worker registers tab
  // listeners. A content-script handshake covers that race; storage deduplicates it.
  if (message?.type === 'chrome-note:visit') {
    trackTab({ ...sender.tab, title: message.title });
    respond({ ok: true });
    return;
  }
  if (!['chrome-note:sites', 'chrome-note:forget-site', 'chrome-note:clear-sites'].includes(message?.type)) return;
  if (sender.tab.incognito) { respond({ ok: true, sites: [] }); return; }
  withVisits(async (sites) => {
    if (message.type === 'chrome-note:forget-site') {
      sites = sites.filter((site) => site.url !== message.url);
      await chrome.storage.local.set({ [VISITS_KEY]: sites });
    } else if (message.type === 'chrome-note:clear-sites') {
      sites = [];
      await chrome.storage.local.set({ [VISITS_KEY]: sites });
    }
    return { ok: true, sites: rankVisits(sites) };
  }).then(respond, () => respond({ ok: false }));
  return true;
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'chrome-note:open' });
    await chrome.action.setBadgeText({ tabId: tab.id, text: '' });
  } catch {
    // Chrome's internal pages, the web store, and tabs opened before installation
    // cannot host content scripts. The action tooltip explains how to proceed.
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#5389ba' });
    await chrome.action.setBadgeText({ tabId: tab.id, text: '!' });
    await chrome.action.setTitle({
      tabId: tab.id,
      title: '请在普通网页使用随手记；已打开的网页请先刷新。',
    });
  }
});
