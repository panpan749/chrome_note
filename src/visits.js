export const VISITS_KEY = 'visits.entries';
export const HALF_LIFE = 7 * 24 * 60 * 60 * 1000;
export const MAX_SITES = 1000;

export function normalizeUrl(raw) {
  try {
    if (typeof raw !== 'string' || raw.length > 4096) return null;
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    // Ordinary in-page anchors share a record; hash-based app routes stay distinct.
    if (!/^#(?:\/|!)/.test(url.hash)) url.hash = '';
    return url.href;
  } catch { return null; }
}

export function validVisits(value) {
  return Array.isArray(value) ? value.filter((site) => site && typeof site.url === 'string' && normalizeUrl(site.url) === site.url
    && typeof site.title === 'string' && site.title.length <= 200
    && Number.isFinite(site.score) && site.score > 0
    && Number.isSafeInteger(site.count) && site.count > 0
    && Number.isFinite(site.lastVisited) && site.lastVisited >= 0) : [];
}

export function heat(site, now = Date.now()) {
  return site.score * Math.pow(0.5, Math.max(0, now - site.lastVisited) / HALF_LIFE);
}

export function rankVisits(sites, now = Date.now()) {
  return sites.map((site) => ({ ...site, heat: heat(site, now) }))
    .sort((a, b) => b.heat - a.heat || b.lastVisited - a.lastVisited || a.url.localeCompare(b.url));
}

export function recordVisit(sites, rawUrl, title, now = Date.now(), metadataOnly = false) {
  const url = normalizeUrl(rawUrl);
  if (!url) return sites;
  const previous = sites.find((site) => site.url === url);
  if (metadataOnly && !previous) return sites;
  const label = (typeof title === 'string' ? title.trim().slice(0, 200) : '')
    || previous?.title || new URL(url).hostname;
  if (metadataOnly && previous.title === label) return sites;
  const next = metadataOnly ? { ...previous, title: label } : {
    url, title: label, count: (previous?.count || 0) + 1,
    score: (previous ? heat(previous, now) : 0) + 1, lastVisited: now,
  };
  const updated = [...sites.filter((site) => site.url !== url), next];
  if (updated.length <= MAX_SITES) return updated;
  return rankVisits(updated, now).slice(0, MAX_SITES).map(({ heat: currentHeat, ...site }) => site);
}
