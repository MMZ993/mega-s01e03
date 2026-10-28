// Check the public snapshot's accounting and rendered deliverables. Reads only
// delivery files; no external I/O, writes or credentials. Failures throw assertions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { deskRef } from './src/lib/kb/desk-ref.ts';
const summary = JSON.parse(readFileSync('src/lib/kb/summary.json'));
const weeks = JSON.parse(readFileSync('src/lib/kb/weeks.json'));
const incident = readFileSync('rendered/kb/incidents/4471-review/index.html', 'utf8');
const decision = readFileSync('rendered/kb/decisions/0002-dedupe-by-cause/index.html', 'utf8');

test('root entrypoints expose the same signed incident with local navigation', () => {
  const source = readFileSync('incident-review.svx', 'utf8');
  const canonical = readFileSync('src/routes/kb/incidents/4471-review/+page.svx', 'utf8');
  assert.equal(source, canonical.replace("signature: 'MMZ993'", "homeHref: './index.html'\nsignature: 'MMZ993'")
    .replace('../../decisions/0002-dedupe-by-cause/index.html', './rendered/kb/decisions/0002-dedupe-by-cause/index.html'));
  const html = readFileSync('index.html', 'utf8');
  for (const marker of ['DR-0Y1V-P5HT', '379', '33', '5 read as a one-day move', '<svg']) assert.ok(html.includes(marker));
  assert.ok(html.includes('href="./index.html"'));
  assert.ok(html.includes('href="./rendered/kb/decisions/0002-dedupe-by-cause/index.html"'));
  assert.ok(html.includes('href="./incident-review.svx"'));
  assert.ok(!html.includes('href="/kb"'));
  assert.ok(!html.includes('../../decisions/'));
});

test('distinct causes reconcile with independently verified source counts', () => {
  assert.equal(summary.exportRows, 427);
  assert.equal(summary.uniqueReports, 412);
  assert.deepEqual(summary.groups.map(g => [g.cause, g.reports]), [['parser', 379], ['hint', 33]]);
  assert.equal(summary.groups.reduce((n, g) => n + g.reports, 0), summary.uniqueReports);
  for (const group of summary.groups) {
    assert.equal(Object.values(group.taggedAs).reduce((a, b) => a + b), group.reports);
  }
  assert.deepEqual(summary.groups.map(g => g.readAsOneDay), [5, 0]);
});

test('received and merged histories reconcile but do not conflate consolidation', () => {
  assert.equal(weeks.reduce((n, w) => n + w.received, 0), 412);
  assert.equal(weeks.reduce((n, w) => n + w.merged, 0), 412);
  assert.deepEqual(weeks.find(w => w.week === '2026-06-29'), { week: '2026-06-29', received: 15, merged: 189 });
  assert.equal(weeks.filter(w => w.week < '2026-06-29').reduce((n, w) => n + w.merged, 0), 0);
});

test('genuine server rendering includes evidence, layout and derived signature', () => {
  const reference = deskRef('MMZ993');
  assert.equal(reference, 'DR-0Y1V-P5HT');
  for (const html of [incident, decision]) {
    assert.ok(html.startsWith('<!doctype html>'));
    assert.ok(html.includes(reference));
    assert.ok(html.includes('support desk'));
    assert.ok(!html.includes('<RenderStamp'));
    assert.ok(!html.includes('no desk ref'));
  }
  assert.ok(incident.includes('<svg'));
  assert.ok(incident.includes('379'));
  assert.ok(incident.includes('33'));
  assert.ok(incident.includes('5 read as a one-day move'));
  assert.ok(decision.includes('proposed'));
});
