# S01E03 — what it shows

Public deliverables for the MEGA.dev support-desk exercise. The reports and tenants are course-provided scenario data. Only privacy-minimized aggregates and reviewed analysis are published here.

## Deliverables

- [Incident review SVX](src/routes/kb/incidents/4471-review/+page.svx)
- [Rendered incident page](rendered/kb/incidents/4471-review/index.html)
- [Proposed replacement decision SVX](src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx)
- [Rendered decision page](rendered/kb/decisions/0002-dedupe-by-cause/index.html)
- [Parser issue](https://github.com/MMZ993/mega-s01e03/issues/1): 379 reports
- [Hint issue](https://github.com/MMZ993/mega-s01e03/issues/2): 33 reports

Download the repository and open the rendered HTML files in a browser to see the actual compiled pages, including tables, chart, layout and derived desk reference. GitHub's HTML source preview is not the rendered page. No hosting or deployment is implied.

## Evidence boundaries

The source KB export is dated 2026-10-04. This review does not claim live queue access or deployed fixes. The export contains 427 rows but 412 unique reports: two computed causes, not one. Five reports read by the desk as one-day moves remain included in the parser count; this is not proof of a third defect.

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
