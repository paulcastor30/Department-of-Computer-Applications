import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const home = await readFile('dist/index.html', 'utf8');
const titles = [];
const descriptions = [];
for (const code of ['bsca', 'msca']) {
  const html = await readFile(`dist/programs/${code}/index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta property="og:description" content="([^"]*)"/)?.[1];
  assert.ok(title && description, 'A crawler must receive title and description before JavaScript runs.');
  assert.notEqual(title, home.match(/<title>(.*?)<\/title>/)?.[1]);
  assert.ok(!/to be (provided|validated)/i.test(description));
  assert.ok(html.includes(`rel="canonical" href="https://msuiit-comapps.vercel.app/programs/${code}"`));
  titles.push(title);
  descriptions.push(description);
}
assert.notEqual(titles[0], titles[1]);
assert.notEqual(descriptions[0], descriptions[1]);
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
for (const route of ['/programs/bsca', '/programs/msca', '/admissions', '/resources', '/research/publications', '/projects', '/thesis-guide', '/sojt-guide']) {
  assert.ok(config.rewrites.some(rewrite => rewrite.source === route && rewrite.destination === `${route}/index.html`));
}
const thesis = await readFile('dist/thesis-guide/index.html', 'utf8');
assert.ok(thesis.includes('Thesis Process Guide'));
assert.ok(thesis.includes('rel="canonical" href="https://msuiit-comapps.vercel.app/thesis-guide"'));
const sojt = await readFile('dist/sojt-guide/index.html', 'utf8');
assert.ok(sojt.includes('SOJT Process Guide'));
assert.ok(sojt.includes('rel="canonical" href="https://msuiit-comapps.vercel.app/sojt-guide"'));
console.log('Crawler metadata and production route mapping checks passed.');
