# S01E03 — what it shows

Public deliverables for the MEGA.dev support-desk exercise. The reports and tenants are course-provided scenario data. Only privacy-minimized aggregates and reviewed analysis are published here.

## Live page

GitHub Pages URL: https://mmz993.github.io/mega-s01e03/

The repository's committed `pages.json` records the publishing source (`main`, root). `.nojekyll` serves the already-generated static files unchanged. No private build environment or raw export is uploaded. Configure the public site using `gh api --method POST repos/MMZ993/mega-s01e03/pages --input pages.json` once; inspect existing Pages settings before changing them. A configured URL alone is not evidence that deployment has completed.

## Direct entrypoints

- [Incident review source](incident-review.svx): root-level signed SVX.
- [Rendered incident page](index.html): root-level complete HTML, not a redirect or a JavaScript-only shell. Its standard alternate link points to the SVX source.

These entrypoints are generated from the canonical incident, retaining evidence and signature while rebasing local navigation. They do not depend on a reader or scraper interpreting this README. No particular course checker filename rule is assumed.

## Canonical deliverables

- [KB index source](src/routes/kb/+page.svx) and [rendered KB index](rendered/kb/index.html), with metadata-driven links to the added pages.
- [Incident review SVX](src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered incident page](rendered/kb/incidents/4471-review/index.html)
- [Proposed replacement decision SVX](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)
- [Rendered decision page](rendered/kb/decisions/0002-dedupe-by-cause/index.html)
- [Parser issue](https://github.com/MMZ993/mega-s01e03/issues/1): 379 reports
- [Hint issue](https://github.com/MMZ993/mega-s01e03/issues/2): 33 reports

Download the repository and open the rendered HTML files in a browser to see the actual compiled pages, including tables, chart, layout and derived desk reference. GitHub's HTML source preview is not the rendered page; use the live GitHub Pages URL above for browser viewing.

## Evidence boundaries

The source KB export is dated 2026-10-04. The incident now also records the later course engineering update (closed 5 October): parser fixed, hint not planned because booking-v3 was retired. These are the desk's reported dispositions, not our implementation or independent production verification. The report counts remain the original snapshot. The export contains 427 rows but 412 unique reports: two computed causes, not one. Five reports read by the desk as one-day moves remain included in the parser count; this is not proof of a third defect.

`summary.json` and `weeks.json` contain aggregate results computed locally from the export's executable logic and unique-ID rules. The raw ZIP, report bodies/IDs, tenant directory, private working notes, credentials, auth/browser state and unrelated project files are not included.

The supplied shared layout, staleness logic and signature component are retained so the page renders under the original conventions. New page frontmatter carries the account holder's MMZ993 signature; `RenderStamp` computes the desk reference from that signature. Decision 0002 is proposed, not accepted; original decision 0001 is not edited.

## Rebuild

Requires Docker. Dependency installation and compilation run inside an unprivileged container with only this delivery directory mounted; no host credentials are mounted.

```sh
docker run --rm --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD:/work" -w /work node:24-bookworm-slim npm ci --ignore-scripts --no-audit --no-fund
docker run --rm --network none --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD:/work" -w /work node:24-bookworm-slim npm run build
node --test test.mjs
```

Dependencies are pinned in `package-lock.json`. The build uses mdsvex and the Svelte compiler/server renderer, not a hand-written HTML approximation. Source data remains a dated aggregate snapshot even when the shared layout computes its review age at render time.
