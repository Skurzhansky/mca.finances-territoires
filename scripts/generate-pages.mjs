#!/usr/bin/env node
// Génère les pages du site à partir des gabarits partagés (scripts/templates.mjs)
// et des données éditables depuis l'admin (data/*.json).
// Usage : node scripts/generate-pages.mjs

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPages, page } from './templates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const guideArticles = JSON.parse(readFileSync(join(ROOT, 'data/guide-articles.json'), 'utf8'));
const events = JSON.parse(readFileSync(join(ROOT, 'data/evenements.json'), 'utf8'));

const PAGES = buildPages(guideArticles);

for (const p of PAGES) {
  const dir = join(ROOT, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p, PAGES, events));
}

console.log(`Généré ${PAGES.length} pages.`);
