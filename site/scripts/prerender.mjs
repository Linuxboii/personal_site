/* Post-build step.
   Vite emits one dist/index.html whose <head> only describes the homepage.
   This writes a copy per route with that route's title, description, canonical
   and social tags baked in, plus a sitemap. Crawlers that do not execute JS
   (LinkedIn, Slack, X, WhatsApp) read these; the SPA still hydrates normally. */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const { site, routes, notFound } = await import(
  new URL('../src/seo.js', import.meta.url).href
);

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const template = await readFile(join(dist, 'index.html'), 'utf8');

function rewriteHead(html, meta) {
  const canonical = site.url + (meta.path === '/' ? '/' : meta.path);
  const title = esc(meta.title);
  const desc = esc(meta.description);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${desc}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${desc}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/>/,
      `<meta name="twitter:description" content="${desc}" />`,
    );

  if (meta.noindex) {
    out = out.replace('</head>', '  <meta name="robots" content="noindex, follow" />\n  </head>');
  }

  // Give the no-JS fallback the heading that belongs to this URL.
  out = out.replace(
    /(<noscript>\s*<h1>)[\s\S]*?(<\/h1>)/,
    (_, a, b) => `${a}${esc(meta.heading || meta.title)}${b}`,
  );

  return out;
}

async function emit(meta, dir) {
  const target = join(dist, dir);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, 'index.html'), rewriteHead(template, meta), 'utf8');
}

const pages = [...routes, notFound];
for (const meta of pages) {
  await emit(meta, meta.path === '/' ? '.' : meta.path.slice(1));
}

// Cloudflare Pages / Netlify serve this for unmatched paths with a real 404.
await writeFile(join(dist, '404.html'), rewriteHead(template, notFound), 'utf8');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${site.url}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');

console.log(`prerender: ${pages.length} pages + sitemap.xml (${routes.length} urls)`);
