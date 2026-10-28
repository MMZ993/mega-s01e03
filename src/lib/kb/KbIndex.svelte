<script>
  // Index this delivery's two pages from their compiled frontmatter metadata.
  // No props, network or mutations. Explicit imports replace the export's Vite
  // glob because this small delivery uses a standalone SSR build, not Vite.
  import { metadata as incident } from '../../routes/kb/incidents/4471-review/+page.svx';
  import { metadata as decision } from '../../routes/kb/decisions/0002-dedupe-by-cause/+page.svx';
  import { daysSince, isoDay, STALE_AFTER_DAYS } from './staleness';
  const rows = [
    { href: './incidents/4471-review/index.html', ...incident },
    { href: './decisions/0002-dedupe-by-cause/index.html', ...decision },
  ];
</script>

<table>
  <thead><tr><th>Page</th><th>Owner</th><th>Status</th><th>Reviewed</th></tr></thead>
  <tbody>{#each rows as row (row.href)}
    <tr><td><a href={row.href}>{row.title}</a></td><td>{row.owner}</td><td>{row.status}</td>
      <td class:stale={daysSince(row.reviewed) > STALE_AFTER_DAYS}>{isoDay(row.reviewed)}</td></tr>
  {/each}</tbody>
</table>

<style>.stale { color: var(--warn); font-weight: 600; }</style>
