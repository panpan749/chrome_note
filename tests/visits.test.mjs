import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HALF_LIFE, REVISIT_DELAY, MAX_SITES, normalizeUrl, validVisits, heat, rankVisits, recordVisit } from '../src/visits.js';

const now = 1800000000000;
const site = (url, score, lastVisited = now, count = score) => ({ url, title: url, score, lastVisited, count });

test('heat halves every seven days without writing records', () => {
  const old = site('https://old.test/', 16);
  assert.equal(heat(old, now + HALF_LIFE), 8);
  assert.equal(heat(old, now + 4 * HALF_LIFE), 1);
  assert.equal(heat(old, now - HALF_LIFE), 16);
  assert.equal(old.score, 16);
});

test('recent use overtakes an old favorite and new visits add to decayed heat', () => {
  const old = site('https://old.test/', 100, now - 7 * HALF_LIFE);
  const recent = site('https://recent.test/', 2);
  assert.equal(rankVisits([old, recent], now)[0].url, recent.url);
  const updated = recordVisit([old, recent], old.url, 'Old favorite', now);
  const record = updated.find((entry) => entry.url === old.url);
  assert.equal(record.count, 101);
  assert.equal(record.score, 1 + 100 / 128);
  assert.equal(rankVisits(updated, now)[0].url, recent.url);
  const again = recordVisit(updated, old.url, 'Old favorite', now + REVISIT_DELAY);
  assert.equal(rankVisits(again, now + REVISIT_DELAY)[0].url, old.url);
});

test('repeated events are deduplicated across serialized/reloaded storage', () => {
  let records = recordVisit([], 'https://example.test/path', 'First', now);
  records = recordVisit(JSON.parse(JSON.stringify(records)), records[0].url, 'Final title', now + 2000);
  assert.equal(records[0].count, 1);
  assert.equal(records[0].lastVisited, now);
  assert.equal(records[0].title, 'Final title');
  records = recordVisit(records, records[0].url, '', now + REVISIT_DELAY);
  assert.equal(records[0].count, 2);
  assert.equal(records[0].title, 'Final title');
});

test('title updates never create a visit or increase heat', () => {
  assert.deepEqual(recordVisit([], 'https://example.test/', 'Title', now, true), []);
  const records = [site('https://example.test/', 4, now - HALF_LIFE)];
  const updated = recordVisit(records, records[0].url, 'New title', now, true);
  assert.equal(updated[0].lastVisited, records[0].lastVisited);
  assert.equal(updated[0].score, 4);
  assert.equal(updated[0].count, 4);
});

test('URLs keep meaningful paths, queries, and hash routes, while anchors merge', () => {
  assert.equal(normalizeUrl('https://EXAMPLE.test:443/a?q=1#section'), 'https://example.test/a?q=1');
  assert.equal(normalizeUrl('https://example.test/#/inbox'), 'https://example.test/#/inbox');
  assert.equal(normalizeUrl('https://example.test/#!/inbox'), 'https://example.test/#!/inbox');
  for (const url of ['chrome://settings', 'about:blank', 'file:///tmp/a', 'javascript:alert(1)', 'https://user:secret@example.test/', 'bad', null]) {
    assert.equal(normalizeUrl(url), null);
    assert.deepEqual(recordVisit([], url, '', now), []);
  }
});

test('invalid storage entries cannot become unsafe links or break sorting', () => {
  const good = site('https://good.test/', 1);
  assert.deepEqual(validVisits([null, good, { ...good, url: null }, { ...good, url: 'javascript:alert(1)' }, { ...good, score: NaN }, { ...good, count: -1 }]), [good]);
  assert.deepEqual(validVisits({}), []);
});

test('bounded storage evicts the coldest page, preserving useful favorites', () => {
  const records = Array.from({ length: MAX_SITES }, (_, i) => site(`https://example.test/${i}`, i + 1));
  records[0].lastVisited = now - 100 * HALF_LIFE;
  const updated = recordVisit(records, 'https://new.test/', 'New page', now);
  assert.equal(updated.length, MAX_SITES);
  assert.ok(updated.some((entry) => entry.url === 'https://new.test/'));
  assert.ok(!updated.some((entry) => entry.url === records[0].url));
});
