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
