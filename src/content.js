/* DRAWER_STYLES is embedded by scripts/build.mjs. No network or page styles needed. */
if (!document.getElementById('chrome-note-drawer')) {
  const PREFIX = 'snippet:';
  const POSITION = 'drawer.position';
  const VIEW = 'drawer.view';
  const AUTO_CLOSE_DELAY = 100;
  const host = document.createElement('div');
  host.id = 'chrome-note-drawer';
  // Inline !important protects the outer shell from broad styles on host pages.
  const shell = {
    all: 'initial', position: 'fixed', right: '0', width: 'min(390px, 100vw)',
    'z-index': '2147483647', display: 'block', direction: 'ltr',
    transform: 'translateX(calc(100% - 32px))',
    transition: 'transform 240ms cubic-bezier(.2,.8,.2,1)',
    'pointer-events': 'none', 'color-scheme': 'light',
    'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    'font-size': '14px', 'line-height': '1.5', color: '#273d52',
    '-webkit-font-smoothing': 'antialiased',
  };
  for (const [name, value] of Object.entries(shell)) host.style.setProperty(name, value, 'important');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) host.style.setProperty('transition', 'none', 'important');
  const root = host.attachShadow({ mode: 'open' });
  host.dataset.open = 'false';
  const icons = {
    arrow: '<path d="m9 5 7 7-7 7"/>',
    note: '<rect x="5" y="3" width="14" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    edit: '<path d="m14 5 5 5M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    back: '<path d="m14 6-6 6 6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18"/>',
    close: '<path d="m7 7 10 10M7 17 17 7"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  root.innerHTML = `
    <style>${DRAWER_STYLES}</style>
    <button class="handle" type="button" aria-label="展开随手记抽屉；上下拖动调整位置" aria-expanded="false" aria-controls="drawer-panel" title="悬停展开 · 上下拖动">${icon('arrow')}<span class="grip"></span></button>
    <section class="panel" id="drawer-panel" aria-label="随手记抽屉" aria-hidden="true" inert>
      <header class="header">
        <div class="topline">
          <span class="brand-icon">${icon('note')}</span>
          <div><h1>随手记</h1><div class="brand-caption">LITTLE NOTES</div></div>
          <span class="spacer"></span>
          <button class="icon-button collapse" type="button" aria-label="收起抽屉" title="收起抽屉 · Esc">${icon('arrow')}</button>
        </div>
        <p class="tagline">常用的话，常去的地方，都在手边。</p>
      </header>
      <nav class="view-switch" aria-label="抽屉内容">
        <button class="view-button" type="button" data-view="notes" aria-pressed="true">${icon('note')} 我的文本</button>
        <button class="view-button" type="button" data-view="sites" aria-pressed="false">${icon('globe')} 常用网页</button>
      </nav>
      <div class="list-view">
        <div class="toolbar">
          <label class="search">${icon('search')}<input type="search" aria-label="搜索文本" placeholder="搜索标题或内容" maxlength="200" autocomplete="off"></label>
          <button class="primary add" type="button">${icon('plus')} 新建</button>
        </div>
        <div class="list-heading"><span>我的文本 <span class="count">00</span></span><span>点击卡片即可复制</span></div>
        <div class="list" aria-label="已保存的文本"></div>
      </div>
      <div class="sites-view" hidden>
        <div class="toolbar"><label class="search site-search">${icon('search')}<input type="search" aria-label="搜索网页" placeholder="搜索网页标题或网址" maxlength="200" autocomplete="off"></label></div>
        <div class="list-heading"><span>近期常用 <span class="site-count">00</span></span><button class="clear-sites" type="button">清空记录</button></div>
        <p class="sites-hint">每次切换到网页计一次，久未使用会慢慢降温。</p>
        <div class="clear-sites-confirm" hidden><p>清空所有网页访问记录？之后切换到网页会重新记录。</p><button class="secondary keep-sites" type="button">保留</button><button class="danger confirm-clear-sites" type="button">确定清空</button></div>
        <div class="site-list" aria-label="按近期热度排序的网页"></div>
      </div>
      <form class="editor" hidden>
        <h2 class="editor-heading"><button class="icon-button cancel" type="button" aria-label="返回文本列表">${icon('back')}</button><span class="editor-title">新建文本</span></h2>
        <label>标题<input name="title" aria-label="标题" placeholder="例如：工作邮箱、常用回复" maxlength="80" required autocomplete="off"></label>
        <label>文本内容<textarea name="text" aria-label="文本内容" placeholder="写下需要经常复制的内容…" maxlength="20000" required></textarea></label>
        <p class="editor-hint">保留换行与空格 · Ctrl / ⌘ + Enter 保存</p>
        <div class="editor-actions">
          <button type="button" class="danger delete" hidden>删除这条文本</button>
          <span class="spacer"></span>
          <button type="button" class="secondary cancel">取消</button>
          <button type="submit" class="primary save">保存文本</button>
        </div>
        <div class="delete-confirm" hidden>
          <p>确定删除这条文本吗？删除后无法恢复。</p>
          <div class="editor-actions"><button type="button" class="secondary keep">保留</button><button type="button" class="danger confirm-delete">确定删除</button></div>
        </div>
      </form>
      <div class="status" role="status" aria-live="polite"></div>
      <footer class="footer"><span class="privacy">${icon('lock')} 仅存于此浏览器</span><span class="close-hint">移开 100ms，自动收起</span></footer>
    </section>`;

  const $ = (selector) => root.querySelector(selector);
  const panel = $('.panel');
  const handle = $('.handle');
  const list = $('.list');
  const form = $('.editor');
  const titleInput = form.elements.title;
  const textInput = form.elements.text;
  let snippets = [];
  let sites = [];
  let activeView = 'notes';
  let sitesLoaded = false;
  let sitesRequest = 0;
  let anchor = 0.48;
  let opened = false;
  let closeTimer;
  let statusTimer;
  let copiedTimer;
  let copiedId = null;
  let editingId = null;
  let editingCreatedAt = null;
  let loaded = false;
  let busy = false;
  let drag = null;
  let suppressClick = false;

  function layout() {
    const height = Math.max(120, Math.min(620, innerHeight - 32));
    const top = Math.max(8, Math.min(innerHeight - height - 8, anchor * innerHeight - height / 2));
    host.style.setProperty('top', `${top}px`, 'important');
    host.style.setProperty('height', `${height}px`, 'important');
    handle.style.top = `${Math.max(8, Math.min(height - 72, anchor * innerHeight - top - 32))}px`;
  }

  function setOpen(value, keyboard = false) {
    const wasOpened = opened;
    clearTimeout(closeTimer);
    opened = value;
    host.dataset.open = String(value);
    host.style.setProperty('transform', value ? 'translateX(0)' : 'translateX(calc(100% - 32px))', 'important');
    handle.setAttribute('aria-expanded', String(value));
    panel.setAttribute('aria-hidden', String(!value));
    panel.inert = !value;
    if (value && !wasOpened && activeView === 'sites') loadSites();
    if (value && keyboard) (form.hidden ? $(activeView === 'sites' ? '.site-search input' : '.search input') : titleInput).focus({ preventScroll: true });
    if (!value && panel.contains(root.activeElement)) handle.focus({ preventScroll: true });
  }

  function canAutoClose() {
    return opened && !drag && form.hidden && !root.activeElement?.matches('input, textarea');
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    if (canAutoClose()) closeTimer = setTimeout(() => {
      // Re-check: editing may have started since the pointer left the drawer.
      if (canAutoClose()) setOpen(false);
    }, AUTO_CLOSE_DELAY);
  }

  function status(message, error = false) {
    clearTimeout(statusTimer);
    $('.status').textContent = message;
    $('.status').dataset.error = String(error);
    if (!error) statusTimer = setTimeout(() => { $('.status').textContent = ''; }, 2400);
  }

  function validSnippet(item) {
    return item && typeof item.id === 'string' && typeof item.title === 'string'
      && typeof item.text === 'string' && Number.isFinite(item.createdAt);
  }

  async function load() {
    try {
      const all = await chrome.storage.local.get(null);
      snippets = Object.entries(all)
        .filter(([key, value]) => key.startsWith(PREFIX) && validSnippet(value) && key === PREFIX + value.id)
        .map(([, value]) => value)
        .sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id));
      if (!drag && Number.isFinite(all[POSITION])) {
        anchor = Math.max(0.04, Math.min(0.96, all[POSITION]));
        layout();
      }
      if (!loaded && all[VIEW] === 'sites') switchView('sites', false);
      loaded = true;
      renderList();
    } catch {
      status('无法读取本地文本，请刷新网页后重试。', true);
    }
  }

  function switchView(view, persist = true) {
    activeView = view;
    $('.list-view').hidden = view !== 'notes';
    $('.sites-view').hidden = view !== 'sites';
    root.querySelectorAll('.view-button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    $('.status').textContent = '';
    if (view === 'sites') loadSites();
    if (persist) chrome.storage.local.set({ [VIEW]: view }).catch(() => status('未能记住当前页签。', true));
  }

  async function loadSites() {
    const request = ++sitesRequest;
    if (!sitesLoaded) $('.site-list').textContent = '正在读取网页记录…';
    try {
      const response = await chrome.runtime.sendMessage({ type: 'chrome-note:sites' });
      if (!response?.ok) throw new Error('Cannot read visits');
      if (request !== sitesRequest) return;
      sites = response.sites;
      sitesLoaded = true;
      renderSites();
    } catch {
      if (request !== sitesRequest) return;
      if (!sitesLoaded) $('.site-list').textContent = '网页记录暂时无法读取。';
      status('无法读取网页记录，请重新加载扩展并刷新网页。', true);
    }
  }

  function renderSites() {
    const query = $('.site-search input').value.trim().toLocaleLowerCase();
    const visible = sites.filter((site) => `${site.title}\n${site.url}`.toLocaleLowerCase().includes(query));
    $('.site-count').textContent = String(sites.length).padStart(2, '0');
    $('.clear-sites').disabled = !sites.length;
    const list = $('.site-list');
    const focused = root.activeElement;
    const focusedUrl = focused?.closest('.site-card')?.dataset.url;
    const focusedRemove = focused?.classList.contains('forget-site');
    list.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.innerHTML = `<div class="empty-art">${icon(query ? 'search' : 'globe')}</div><h2>${query ? '没有找到这个网页' : '常去的地方，会出现在这里'}</h2><p>${query ? '试试网页标题或网址中的关键词。' : '从其他标签切换到网页，就会记一次。<br>切换越频繁，常用网页越靠前。'}</p>`;
      list.append(empty);
      return;
    }
    for (const site of visible) {
      const card = document.createElement('article');
      card.className = 'card site-card';
      card.dataset.url = site.url;
      const link = document.createElement('a');
      link.className = 'site-link';
      link.href = site.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = `${site.title}\n${site.url}\n在新标签页打开`;
      const title = document.createElement('span');
      title.className = 'card-title';
      title.textContent = site.title;
      const address = document.createElement('span');
      address.className = 'site-address';
      address.textContent = site.url.replace(/^https?:\/\//, '');
      const meta = document.createElement('span');
      meta.className = 'site-meta';
      const days = Math.max(0, Math.floor((Date.now() - site.lastVisited) / 86400000));
      meta.textContent = `切入 ${site.count} 次 · ${days === 0 ? '最近 24 小时内' : `${days} 天前`}使用`;
      link.append(title, address, meta);
      const remove = document.createElement('button');
      remove.className = 'icon-button forget-site';
      remove.type = 'button';
      remove.title = '移除此记录；下次切入会重新记录';
      remove.setAttribute('aria-label', `移除网页记录：${site.title}`);
      remove.innerHTML = icon('close');
      remove.addEventListener('click', () => changeSites('chrome-note:forget-site', site.url));
      card.append(link, remove);
      list.append(card);
      if (focusedUrl === site.url) (focusedRemove ? remove : link).focus({ preventScroll: true });
    }
  }

  async function changeSites(type, url) {
    try {
      const response = await chrome.runtime.sendMessage({ type, url });
      if (!response?.ok) throw new Error('Cannot update visits');
      $('.clear-sites-confirm').hidden = true;
      await loadSites();
      status(type === 'chrome-note:clear-sites' ? '已清空网页记录' : '已移除，下次切入会重新记录');
    } catch { status('操作失败，请刷新网页后重试。', true); }
  }

  function renderList() {
    const query = $('.search input').value.trim().toLocaleLowerCase();
    const visible = snippets.filter((s) => `${s.title}\n${s.text}`.toLocaleLowerCase().includes(query));
    $('.count').textContent = String(snippets.length).padStart(2, '0');
    list.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.innerHTML = `<div class="empty-art">${icon(query ? 'search' : 'note')}</div><h2>${query ? '没有找到这条文本' : '常用的话，不必重复输入'}</h2><p>${query ? '换个关键词，再找找看。' : '邮箱、地址、一句常用回复…<br>记在这里，需要时轻轻一点。'}</p>`;
      if (!query) {
        const button = document.createElement('button');
        button.className = 'primary';
        button.type = 'button';
        button.innerHTML = `${icon('plus')} 添加第一条文本`;
        button.addEventListener('click', () => edit());
        empty.append(button);
      }
      list.append(empty);
      return;
    }
    for (const snippet of visible) {
      const card = document.createElement('article');
      card.className = `card${snippet.id === copiedId ? ' copied' : ''}`;
      card.dataset.id = snippet.id;
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'copy-card';
      copy.title = '点击复制完整文本';
      copy.setAttribute('aria-label', `复制：${snippet.title}`);
      const title = document.createElement('span');
      title.className = 'card-title';
      title.textContent = snippet.title;
      const body = document.createElement('span');
      body.className = 'card-body';
      body.textContent = snippet.text;
      copy.append(title, body);
      copy.addEventListener('click', () => copyText(snippet, card));
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const indicator = document.createElement('span');
      indicator.className = 'icon-button copy-indicator';
      indicator.innerHTML = icon(snippet.id === copiedId ? 'check' : 'copy');
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'icon-button edit';
      editButton.setAttribute('aria-label', `编辑：${snippet.title}`);
      editButton.title = '编辑文本';
      editButton.innerHTML = icon('edit');
      editButton.addEventListener('click', () => edit(snippet));
      actions.append(indicator, editButton);
      card.append(copy, actions);
      list.append(card);
    }
  }

  async function copyText(snippet, card) {
    try {
      try {
        await navigator.clipboard.writeText(snippet.text);
      } catch {
        // Fallback for HTTP pages / pages that block the asynchronous clipboard API.
        const active = root.activeElement;
        const temp = document.createElement('textarea');
        temp.value = snippet.text;
        temp.style.cssText = 'position:fixed;top:0;left:0;opacity:0;width:1px;height:1px;';
        root.append(temp);
        temp.focus({ preventScroll: true });
        temp.select();
        let copied = false;
        try { copied = document.execCommand('copy'); } finally {
          temp.remove();
          active?.focus({ preventScroll: true });
        }
        if (!copied) throw new Error('Clipboard unavailable');
      }
      clearTimeout(copiedTimer);
      copiedId = snippet.id;
      root.querySelectorAll('.card.copied').forEach((el) => {
        el.classList.remove('copied');
        el.querySelector('.copy-indicator').innerHTML = icon('copy');
      });
      card.classList.add('copied');
      card.querySelector('.copy-indicator').innerHTML = icon('check');
      status('已复制，可以去粘贴了');
      copiedTimer = setTimeout(() => {
        copiedId = null;
        card.classList.remove('copied');
        card.querySelector('.copy-indicator').innerHTML = icon('copy');
      }, 2000);
    } catch {
      status('复制失败，请在编辑中选择文本手动复制。', true);
    }
  }

  function edit(snippet = null) {
    if (!loaded) return status('尚未读到本地数据，请刷新网页后重试。', true);
    clearTimeout(closeTimer);
    editingId = snippet?.id ?? crypto.randomUUID();
    editingCreatedAt = snippet?.createdAt ?? Date.now();
    form.reset();
    titleInput.value = snippet?.title ?? '';
    textInput.value = snippet?.text ?? '';
    $('.editor-title').textContent = snippet ? '编辑文本' : '新建文本';
    $('.delete').hidden = !snippet;
    $('.delete-confirm').hidden = true;
    $('.list-view').hidden = true;
    $('.view-switch').hidden = true;
    form.hidden = false;
    $('.close-hint').textContent = '编辑中，保持展开';
    $('.status').textContent = '';
    titleInput.focus({ preventScroll: true });
  }

  function showList() {
    form.hidden = true;
    $('.list-view').hidden = false;
    $('.view-switch').hidden = false;
    editingId = null;
    $('.delete-confirm').hidden = true;
    $('.close-hint').textContent = '移开 100ms，自动收起';
    renderList();
    $('.add').focus({ preventScroll: true });
    if (!host.matches(':hover')) scheduleClose();
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    if (!titleInput.value.trim() || !textInput.value.trim()) {
      return status('请填写标题和文本内容，不能只有空格。', true);
    }
    busy = true;
    $('.save').disabled = true;
    const snippet = {
      id: editingId, title: titleInput.value.trim(), text: textInput.value,
      createdAt: editingCreatedAt, updatedAt: Date.now(),
    };
    try {
      await chrome.storage.local.set({ [PREFIX + snippet.id]: snippet });
      await load();
      $('.search input').value = '';
      showList();
      status('已保存到此浏览器');
    } catch {
      status('保存失败，内容仍保留在编辑框中。请检查扩展或存储空间。', true);
    } finally {
      busy = false;
      $('.save').disabled = false;
    }
  }

  async function savePosition() {
    try { await chrome.storage.local.set({ [POSITION]: anchor }); }
    catch { status('位置未能保存，请刷新网页后重试。', true); }
  }

  host.addEventListener('pointerenter', () => { if (!drag) setOpen(true); });
  host.addEventListener('pointerleave', scheduleClose);
  root.addEventListener('focusin', () => clearTimeout(closeTimer));
  root.addEventListener('focusout', () => {
    queueMicrotask(() => { if (!root.activeElement && !host.matches(':hover')) scheduleClose(); });
  });
  $('.collapse').addEventListener('click', () => setOpen(false));
  handle.addEventListener('click', (event) => {
    if (suppressClick) { suppressClick = false; return; }
    setOpen(true, event.detail === 0);
  });
  handle.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      anchor = Math.max(0.04, Math.min(0.96, anchor + (event.key === 'ArrowUp' ? -0.03 : 0.03)));
      layout();
      savePosition();
    }
  });
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    drag = { id: event.pointerId, y: event.clientY, anchor, moved: false };
    clearTimeout(closeTimer);
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const delta = event.clientY - drag.y;
    if (!drag.moved && Math.abs(delta) < 5) return;
    drag.moved = true;
    setOpen(false);
    anchor = Math.max(0.04, Math.min(0.96, drag.anchor + delta / innerHeight));
    layout();
  });
  function endDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    const moved = drag.moved;
    drag = null;
    suppressClick = moved;
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    if (moved) savePosition();
    // Browsers emit click after pointerup; do not suppress a later independent click.
    setTimeout(() => { suppressClick = false; }, 0);
    if (!host.matches(':hover')) scheduleClose();
  }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      setOpen(false);
    }
    if (!form.hidden && event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  $('.add').addEventListener('click', () => edit());
  root.querySelectorAll('.view-button').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.view)));
  $('.site-search input').addEventListener('input', renderSites);
  $('.clear-sites').addEventListener('click', () => { $('.clear-sites-confirm').hidden = false; $('.keep-sites').focus(); });
  $('.keep-sites').addEventListener('click', () => { $('.clear-sites-confirm').hidden = true; $('.clear-sites').focus(); });
  $('.confirm-clear-sites').addEventListener('click', () => changeSites('chrome-note:clear-sites'));
  $('.search input').addEventListener('input', renderList);
  root.querySelectorAll('.cancel').forEach((button) => button.addEventListener('click', showList));
  form.addEventListener('submit', save);
  $('.delete').addEventListener('click', () => { $('.delete-confirm').hidden = false; $('.keep').focus(); });
  $('.keep').addEventListener('click', () => { $('.delete-confirm').hidden = true; $('.delete').focus(); });
  $('.confirm-delete').addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    try {
      await chrome.storage.local.remove(PREFIX + editingId);
      await load();
      showList();
      status('已删除文本');
    } catch { status('删除失败，请刷新网页后重试。', true); }
    finally { busy = false; }
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && Object.keys(changes).some((key) => key.startsWith(PREFIX) || key === POSITION)) load();
    if (area === 'local' && changes['visits.entries'] && activeView === 'sites') loadSites();
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'chrome-note:open') setOpen(true, true);
  });
  window.addEventListener('resize', layout);
  layout();
  document.documentElement.append(host);
  load();
}
