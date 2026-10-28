// Render the checked-in SVX through mdsvex and Svelte SSR. Reads only this
// delivery tree, writes ignored compiled modules and rendered route HTML;
// compiler errors and warnings fail the build. No network or credential access.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, relative, dirname, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { compile, preprocess } from 'svelte/compiler';
import { mdsvex } from 'mdsvex';
import { render } from 'svelte/server';

const root = process.cwd();
const output = resolve('.compiled');
const processor = mdsvex({ layout: { runbook: resolve('src/lib/layouts/runbook.svelte') } });

// List source files recursively; input is a local directory, output is paths.
// Only the supplied delivery source tree is traversed; read errors propagate.
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }))).flat();
}

// Map an authored import to its compiled equivalent. Accepts only delivery-local
// paths or package imports; package imports remain unchanged. No I/O or mutation.
function compiledImport(specifier, source) {
  let target;
  if (specifier.startsWith('#lib/')) target = resolve('src/lib', specifier.slice(5));
  else if (specifier.startsWith('.')) target = resolve(dirname(source), specifier);
  else if (specifier.startsWith(root + '/')) target = specifier;
  else return specifier;
  if (!extname(target)) target += '.ts';
  const destination = resolve(output, relative(root, target)).replace(/\.(svelte|svx)$/, '.js');
  const current = resolve(output, relative(root, source));
  const path = relative(dirname(current), destination);
  return path.startsWith('.') ? path : './' + path;
}

for (const source of await files(resolve('src'))) {
  const path = relative(root, source);
  let code = await readFile(source, 'utf8');
  if (/\.(svelte|svx)$/.test(source)) {
    if (source.endsWith('.svx')) code = (await preprocess(code, processor, { filename: source })).code;
    const result = compile(code, { filename: path, generate: 'server', css: 'injected' });
    if (result.warnings.length) throw new Error(JSON.stringify(result.warnings));
    code = result.js.code;
  }
  code = code.replace(/(from\s+|import\s*)(['"])([^'"]+)\2/g,
    (_, prefix, quote, specifier) => prefix + quote + compiledImport(specifier, source) + quote);
  const destination = resolve(output, path).replace(/\.(svelte|svx)$/, '.js');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, code);
}
for (const source of (await files(resolve('src/routes'))).filter(path => path.endsWith('/+page.svx'))) {
  const modulePath = resolve(output, relative(root, source)).replace(/\.svx$/, '.js');
  const { default: Page } = await import(pathToFileURL(modulePath));
  const { head, body } = render(Page);
  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + head + '</head><body>' + body + '</body></html>\n';
  const destination = resolve('rendered', relative(resolve('src/routes'), dirname(source)), 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
}
console.log('Rendered SVX pages through mdsvex and Svelte SSR.');
