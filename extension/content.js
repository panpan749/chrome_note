(() => {
const DRAWER_STYLES = ":host {\n  all: initial;\n  color-scheme: light;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif;\n  font-size: 14px;\n  color: #273d52;\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n}\n*, *::before, *::after { box-sizing: border-box; }\nbutton, input, textarea { font: inherit; color: inherit; }\nbutton { cursor: pointer; }\nbutton, input, textarea { -webkit-tap-highlight-color: transparent; }\nbutton:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid #83b7e8; outline-offset: 3px; }\nbutton { border: 0; }\nsvg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }\n[hidden] { display: none !important; }\n.handle {\n  pointer-events: auto;\n  position: absolute; left: 0; width: 32px; height: 64px; padding: 0;\n  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;\n  border: 1px solid #c8def2; border-right: 0; border-radius: 14px 0 0 14px;\n  background: #eaf4ff; color: #5185b3; box-shadow: -3px 3px 14px #365a8012;\n  touch-action: none; user-select: none; cursor: grab;\n  transition: background .18s, color .18s;\n}\n.handle:hover { background: #dceeff; color: #2469a4; }\n.handle:active { cursor: grabbing; }\n.grip { width: 10px; height: 7px; background-image: radial-gradient(circle, #89aaca 1px, transparent 1px); background-size: 5px 4px; }\n.panel {\n  pointer-events: auto;\n  margin-left: 32px; width: calc(100% - 32px); height: 100%;\n  background: #f8fbff; border: 1px solid #dce8f3; border-right: 0;\n  border-radius: 22px 0 0 22px; box-shadow: -12px 8px 48px #294f741a;\n  display: flex; flex-direction: column; overflow: hidden;\n}\n:host([data-open=\"false\"]) .panel { box-shadow: none; }\n.header { padding: 26px 24px 18px; background: linear-gradient(145deg, #eef6ff, #f8fbff 85%); }\n.topline { display: flex; align-items: center; gap: 10px; }\n.brand-icon { width: 36px; height: 36px; border: 1px solid #ccdef1; background: #e1efff; border-radius: 11px; display: grid; place-items: center; color: #4c82b3; }\n.brand-icon svg { width: 20px; height: 20px; }\nh1 { font-size: 19px; font-weight: 650; letter-spacing: 1px; margin: 0; }\n.brand-caption { color: #8b9db0; font-size: 10px; letter-spacing: 2px; line-height: 1.2; margin-top: 2px; }\n.spacer { flex: 1; }\n.icon-button { width: 30px; height: 30px; border-radius: 8px; background: transparent; color: #8198ae; display: inline-flex; align-items: center; justify-content: center; }\n.icon-button:hover { color: #3c78af; background: #e5f0fc; }\n.tagline { margin: 18px 0 0; font-size: 12px; color: #8395a8; letter-spacing: .3px; }\n.toolbar { padding: 0 24px 18px; display: flex; gap: 9px; }\n.search { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; padding: 0 11px; height: 39px; background: white; border: 1px solid #e0e9f3; border-radius: 10px; color: #9aafc2; }\n.search:focus-within { border-color: #94bee5; box-shadow: 0 0 0 3px #d9eafd77; }\n.search svg { width: 16px; height: 16px; }\n.search input { background: transparent; border: 0; outline: none; width: 100%; min-width: 0; font-size: 12px; }\n.search input::placeholder { color: #9aaabb; }\n.primary { background: #5f96c9; color: white; border: 1px solid #548cc0; border-radius: 10px; padding: 9px 14px; font-size: 12px; font-weight: 550; display: inline-flex; justify-content: center; align-items: center; gap: 5px; box-shadow: 0 2px 3px #467bad14; }\n.primary:hover { background: #4b84b8; }\n.primary:disabled { cursor: wait; opacity: .6; }\n.primary svg { width: 15px; height: 15px; }\n.list-view { flex: 1; min-height: 0; display: flex; flex-direction: column; }\n.list-heading { display: flex; justify-content: space-between; padding: 0 25px 10px; color: #8b9caf; font-size: 10px; letter-spacing: 1px; }\n.list-heading span:last-child { letter-spacing: 0; }\n.list { flex: 1; min-height: 0; overflow-y: auto; padding: 2px 17px 18px 24px; scrollbar-width: thin; scrollbar-color: #caddec transparent; overscroll-behavior: contain; }\n.card { position: relative; margin-bottom: 10px; border: 1px solid #e1eaf4; border-radius: 12px; background: #fff; transition: border-color .16s, box-shadow .16s, transform .16s; }\n.card:hover, .card:focus-within { border-color: #9ec4e6; box-shadow: 0 4px 13px #457eb40c; transform: translateY(-1px); }\n.copy-card { background: transparent; display: block; width: 100%; text-align: left; border-radius: 12px; padding: 17px 41px 16px 16px; }\n.card-title { display: block; font-size: 13px; font-weight: 600; color: #3c5269; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.card-body { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 12px; color: #8696a7; line-height: 1.85; margin-top: 7px; }\n.card:hover .card-title { color: #3979b3; }\n.card-actions { position: absolute; right: 8px; top: 10px; display: flex; flex-direction: column; gap: 3px; }\n.card-actions .icon-button { width: 26px; height: 26px; }\n.card-actions svg { width: 14px; height: 14px; }\n.card-actions .edit { opacity: 0; }\n.card:hover .edit, .card:focus-within .edit { opacity: 1; }\n@media (hover: none) { .card-actions .edit { opacity: 1; } }\n.copy-indicator { pointer-events: none; }\n.card.copied { border-color: #8dbfae; background: #f5fbf8; }\n.card.copied .copy-indicator { color: #539b7e; }\n.empty { padding: 52px 7px 28px; text-align: center; }\n.empty-art { width: 70px; height: 70px; background: #edf5fe; border: 1px solid #dceafa; border-radius: 23px; color: #8bb4d9; display: grid; place-items: center; margin: 0 auto 22px; transform: rotate(-5deg); }\n.empty-art svg { width: 30px; height: 30px; }\n.empty h2 { margin: 0 0 8px; color: #59738c; font-size: 14px; font-weight: 550; }\n.empty p { color: #95a5b5; font-size: 12px; line-height: 1.9; margin: 0 0 20px; }\n.footer { padding: 13px 24px; border-top: 1px solid #e6edf5; display: flex; align-items: center; justify-content: space-between; color: #9cabb9; font-size: 10px; background: #f3f8fe; }\n.privacy { display: inline-flex; align-items: center; gap: 5px; }\n.privacy svg { width: 12px; height: 12px; }\n.status { flex-shrink: 0; min-height: 0; margin: 0 24px; border-radius: 8px; font-size: 12px; color: #427c64; background: #eaf5ef; }\n.status:not(:empty) { padding: 8px 10px; margin-bottom: 12px; }\n.status[data-error=\"true\"] { color: #a05252; background: #fff0ed; }\n.editor { flex: 1; min-height: 0; overflow-y: auto; padding: 0 24px 20px; }\n.editor-heading { display: flex; align-items: center; gap: 6px; margin: 0 0 16px; font-size: 14px; font-weight: 600; }\n.editor label { display: block; margin-bottom: 16px; font-size: 12px; color: #6c8299; }\n.editor input, .editor textarea { margin-top: 7px; display: block; width: 100%; border: 1px solid #d9e5f1; border-radius: 9px; padding: 11px 12px; background: #fff; font-size: 13px; }\n.editor textarea { resize: vertical; min-height: 130px; height: 175px; line-height: 1.8; }\n.editor input::placeholder, .editor textarea::placeholder { color: #a8b5c3; }\n.editor-hint { font-size: 10px; color: #96a6b6; margin: -6px 0 16px; }\n.editor-actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; }\n.secondary { background: #e9f1f9; border: 1px solid #dae5f0; color: #6c859d; border-radius: 9px; padding: 9px 14px; font-size: 12px; }\n.secondary:hover { background: #deeaf7; }\n.danger { color: #b47c7c; background: transparent; padding: 9px 0; font-size: 12px; }\n.danger:hover { color: #aa4646; }\n.delete-confirm { padding: 14px; border: 1px solid #eddad7; background: #fff8f6; border-radius: 10px; margin-top: 18px; font-size: 12px; color: #9a6760; }\n.delete-confirm p { margin: 0 0 12px; }\n.delete-confirm .editor-actions { justify-content: flex-end; }\n.delete-confirm .danger { padding: 8px; }\n@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }\n";
/* DRAWER_STYLES is embedded by scripts/build.mjs. No network or page styles needed. */
if (!document.getElementById('chrome-note-drawer')) {
  const PREFIX = 'snippet:';
  const POSITION = 'drawer.position';
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
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  root.innerHTML = `
    <style>${DRAWER_STYLES}</style>
    <button class="handle" type="button" aria-label="展开文本抽屉；上下拖动调整位置" aria-expanded="false" aria-controls="drawer-panel" title="悬停展开 · 上下拖动">${icon('arrow')}<span class="grip"></span></button>
    <section class="panel" id="drawer-panel" aria-label="随手记文本抽屉" aria-hidden="true" inert>
      <header class="header">
        <div class="topline">
          <span class="brand-icon">${icon('note')}</span>
          <div><h1>随手记</h1><div class="brand-caption">LITTLE NOTES</div></div>
          <span class="spacer"></span>
          <button class="icon-button collapse" type="button" aria-label="收起抽屉" title="收起抽屉 · Esc">${icon('arrow')}</button>
        </div>
        <p class="tagline">把常用的话，放在手边。</p>
      </header>
      <div class="list-view">
        <div class="toolbar">
          <label class="search">${icon('search')}<input type="search" aria-label="搜索文本" placeholder="搜索标题或内容" maxlength="200" autocomplete="off"></label>
          <button class="primary add" type="button">${icon('plus')} 新建</button>
        </div>
        <div class="list-heading"><span>我的文本 <span class="count">00</span></span><span>点击卡片即可复制</span></div>
        <div class="list" aria-label="已保存的文本"></div>
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
      <footer class="footer"><span class="privacy">${icon('lock')} 仅存于此浏览器</span><span>移开 1 秒，自动收起</span></footer>
    </section>`;

  const $ = (selector) => root.querySelector(selector);
  const panel = $('.panel');
  const handle = $('.handle');
  const list = $('.list');
  const form = $('.editor');
  const titleInput = form.elements.title;
  const textInput = form.elements.text;
  let snippets = [];
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
    clearTimeout(closeTimer);
    opened = value;
    host.dataset.open = String(value);
    host.style.setProperty('transform', value ? 'translateX(0)' : 'translateX(calc(100% - 32px))', 'important');
    handle.setAttribute('aria-expanded', String(value));
    panel.setAttribute('aria-hidden', String(!value));
    panel.inert = !value;
    if (value && keyboard) (form.hidden ? $('.search input') : titleInput).focus({ preventScroll: true });
    if (!value && panel.contains(root.activeElement)) handle.focus({ preventScroll: true });
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    if (opened && !drag) closeTimer = setTimeout(() => setOpen(false), 1000);
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
      loaded = true;
      renderList();
    } catch {
      status('无法读取本地文本，请刷新网页后重试。', true);
    }
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
    editingId = snippet?.id ?? crypto.randomUUID();
    editingCreatedAt = snippet?.createdAt ?? Date.now();
    form.reset();
    titleInput.value = snippet?.title ?? '';
    textInput.value = snippet?.text ?? '';
    $('.editor-title').textContent = snippet ? '编辑文本' : '新建文本';
    $('.delete').hidden = !snippet;
    $('.delete-confirm').hidden = true;
    $('.list-view').hidden = true;
    form.hidden = false;
    $('.status').textContent = '';
    titleInput.focus({ preventScroll: true });
  }

  function showList() {
    form.hidden = true;
    $('.list-view').hidden = false;
    editingId = null;
    $('.delete-confirm').hidden = true;
    renderList();
    $('.add').focus({ preventScroll: true });
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
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'chrome-note:open') setOpen(true, true);
  });
  window.addEventListener('resize', layout);
  layout();
  document.documentElement.append(host);
  load();
}

})();
