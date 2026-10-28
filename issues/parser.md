## Problem

**379 unique reports** in merged ticket **#4471** belong to the `parser` cause, across 11 tenants in the course-provided 2026-10-04 KB export. Received dates: 2026-04-01 through 2026-10-04. This is a snapshot count, not live queue state or a measured affected-user count.

The shared parser reads every date month-first, but these tenants use day-first dates. The original incident's one-fix narrative hides a separate booking-v3 hint defect, which needs its own issue.

## Reproduce and expected behavior

Synthetic example: a day-first tenant enters `03/04/2026` meaning 3 April. A month-first parser instead reads 4 March. Parsing should follow an explicit agreed date-format contract, not silently swap day and month.

The supplied classifier assigns this cause to day-first tenant reports except booking-v3 form-channel reports. Day-first app/email paths and booking-v2 forms need regression coverage. This is source-based analysis; no live product execution or implemented fix is claimed.

## Count and evidence

Count each ID once using the export's `uniqueById`, filter `mergedInto === 4471`, resolve tenant through `tenantOf`, then apply `causeOf`/`groupByCause`. Do not count intake labels: this group contains 356 parser-tagged and 23 hint-tagged reports.

The desk read five of these reports as a one-day move; they remain within 379 under the supplied classifier. Investigate their expected/actual dates separately rather than declaring a proven timezone defect or adding them again.

Evidence: supplied `causes.ts`, `locales.ts`, tenant/report exports, `CauseTable.svelte`, and `desk-notes.json`. Raw reports and tenant records are intentionally not published.

## Acceptance criteria

- Verify and fix the shared parser's contract for day-first input across relevant channels.
- Add regression coverage for ambiguous dates and documented invalid-input handling.
- Keep the booking-v3 hint cause separate; do not close it solely because this parser fix ships.
- Reconcile any one-day symptoms with direct reproduction evidence before changing classification.

KB analysis: [SVX source](https://github.com/MMZ993/mega-s01e03/blob/main/src/routes/kb/incidents/4471-review/+page.svx). Rendered page: `rendered/kb/incidents/4471-review/index.html`.
