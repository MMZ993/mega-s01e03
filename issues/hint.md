## Problem

**33 unique reports** in merged ticket **#4471** belong to the `hint` cause, across three tenants in the course-provided 2026-10-04 KB export. Received dates: 2026-04-17 through 2026-09-22. This is a snapshot count, not live queue state or a measured affected-user count.

The booking-v3 form displays `MM/DD/YYYY` to day-first tenants, while interpreting their input day-first. Its hint causes users to enter a different format from the one the form reads. This is distinct from the shared parser defect; the supplied cause table marks this group as having no engineering ticket of its own.

## Reproduce and expected behavior

Synthetic example: a day-first tenant's booking-v3 form tells a user to enter `MM/DD/YYYY`. A user intending 4 March enters `03/04/2026`, but day-first interpretation yields 3 April. The displayed hint must agree with the format actually accepted and interpreted.

Scope: tenant is day-first, form is booking-v3, report channel is `form`. Booking-v3 app/email reports belong to the separate parser cause. This is source-based analysis, not a live product reproduction or implemented fix.

## Count and evidence

Deduplicate report IDs with `uniqueById`, filter `mergedInto === 4471`, resolve tenant through `tenantOf`, then apply `causeOf`/`groupByCause`. The group contains 18 hint-tagged and 15 parser-tagged reports; intake labels alone give the wrong count.

Evidence: supplied `DATE_HINT` and `causeOf` in `causes.ts`, `locales.ts`, report/tenant exports, and `CauseTable.svelte`. Public deliverables retain aggregate evidence only, not raw reports or tenant identities.

## Acceptance criteria

- Align the booking-v3 hint and actual date interpretation for day-first tenants.
- Add a regression test covering the displayed format, entered value and interpreted date together.
- Keep these reports separate from the shared parser issue and verify this path before closing it.

KB analysis: [SVX source](https://github.com/MMZ993/mega-s01e03/blob/main/src/routes/kb/incidents/4471-review/+page.svx). Rendered page: `rendered/kb/incidents/4471-review/index.html`.
