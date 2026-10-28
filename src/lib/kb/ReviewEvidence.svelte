<script>
  // Present privacy-minimized aggregates computed from the original classifier.
  // No props or external I/O; totals and shares are derived at render time.
  import summary from './summary.json' with { type: 'json' };
  import weeks from './weeks.json' with { type: 'json' };
  const total = summary.groups.reduce((n, group) => n + group.reports, 0);
  const maximum = Math.max(...weeks.flatMap(week => [week.received, week.merged]));
</script>

<p><strong>{total}</strong> unique reports; {summary.exportRows} export rows;
  {summary.exportRows - total} duplicate extra rows; {summary.groups.length} computed causes.</p>
<p>{summary.source}.</p>
<table>
  <thead><tr><th>Cause</th><th>Reports</th><th>Share</th><th>Tenants</th><th>Received</th><th>Desk note</th></tr></thead>
  <tbody>
    {#each summary.groups as group}
      <tr><td>{group.cause}</td><td>{group.reports}</td><td>{(100 * group.reports / total).toFixed(1)}%</td>
        <td>{group.tenants}</td><td>{group.firstSeen} to {group.lastSeen}</td>
        <td>{group.readAsOneDay} read as a one-day move</td></tr>
    {/each}
  </tbody>
</table>
<h3>Intake labels are not root causes</h3>
<table>
  <thead><tr><th>Computed cause</th><th>Intake parser tag</th><th>Intake hint tag</th></tr></thead>
  <tbody>{#each summary.groups as group}
    <tr><td>{group.cause}</td><td>{group.taggedAs.parser ?? 0}</td><td>{group.taggedAs.hint ?? 0}</td></tr>
  {/each}</tbody>
</table>
<h3>Reports received versus reports merged</h3>
<figure>
  <svg viewBox="0 0 648 145" role="img" aria-label="Weekly reports received and merged into ticket 4471; full values in the following table">
    {#each weeks as week, i}
      <rect fill="#b4501f" x={i * 24 + 2} y={110 - week.received / maximum * 100} width="9" height={week.received / maximum * 100} />
      <rect fill="#2f6f5e" x={i * 24 + 12} y={110 - week.merged / maximum * 100} width="9" height={week.merged / maximum * 100} />
      {#if i % 4 === 0}<text x={i * 24 + 2} y="132" font-size="9">{week.week.slice(5)}</text>{/if}
    {/each}
  </svg>
  <figcaption>Orange: received. Green: merged. Monday–Sunday weeks using the source calendar-date strings, not UTC conversion.</figcaption>
</figure>
<details><summary>Accessible weekly values</summary>
  <table><thead><tr><th>Week beginning</th><th>Received</th><th>Merged</th></tr></thead>
    <tbody>{#each weeks as week}<tr><td>{week.week}</td><td>{week.received}</td><td>{week.merged}</td></tr>{/each}</tbody>
  </table>
</details>
