#!/usr/bin/env node
// Génère les pages du site à partir des gabarits partagés (scripts/templates.mjs)
// et des données éditables depuis l'admin (data/*.json).
// Usage : node scripts/generate-pages.mjs

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPages, page, homepagePage } from './templates.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function readJSON(relPath) {
  return JSON.parse(readFileSync(join(ROOT, relPath), 'utf8'));
}

const guideArticles = readJSON('data/guide-articles.json');
const expertises = readJSON('data/expertises.json');
const secteurs = readJSON('data/secteurs.json');
const homepage = readJSON('data/homepage.json');
const events = readJSON('data/evenements.json');

const PAGES = buildPages({ guideArticles, expertises, secteurs });

for (const p of PAGES) {
  const dir = join(ROOT, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p, PAGES, events));
}

writeFileSync(join(ROOT, 'index.html'), homepagePage(homepage, PAGES));

console.log(`Généré ${PAGES.length} pages + la page d'accueil.`);
