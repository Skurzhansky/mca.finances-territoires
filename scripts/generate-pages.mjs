#!/usr/bin/env node
// Génère les pages du site à partir des gabarits partagés (scripts/templates.mjs)
// et des données éditables depuis l'admin (data/*.json).
// Usage : node scripts/generate-pages.mjs

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPages, page, homepagePage } from './templates.mjs';
import { migrate } from './migrations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function readJSON(relPath) {
  return JSON.parse(readFileSync(join(ROOT, relPath), 'utf8'));
}

// Navigation et contenu des pages de base sont optionnels : sans ces fichiers,
// les gabarits retombent sur leurs valeurs par défaut.
function readJSONIfExists(relPath) {
  return existsSync(join(ROOT, relPath)) ? readJSON(relPath) : undefined;
}

const guideArticles = readJSON('data/guide-articles.json');
const expertises = readJSON('data/expertises.json');
const secteurs = readJSON('data/secteurs.json');
const events = readJSON('data/evenements.json');

// Les JSON récupérés depuis S3 au déploiement peuvent précéder une refonte :
// on leur applique les migrations et on les réécrit pour que la version
// publiée (et l'admin) les voient à jour.
function readMigrated(relPath, name) {
  const data = readJSONIfExists(relPath);
  if (!data) return undefined;
  const { changed } = migrate(name, data);
  if (changed) {
    writeFileSync(join(ROOT, relPath), JSON.stringify(data, null, 2) + '\n');
    console.log(`Migré ${relPath} → v${data._v}`);
  }
  return data;
}

const homepage = readMigrated('data/homepage.json', 'homepage');
const navigation = readMigrated('data/navigation.json', 'navigation');
const content = readJSONIfExists('data/pages.json');

const site = { navigation, content };
const PAGES = buildPages({ guideArticles, expertises, secteurs, content });

for (const p of PAGES) {
  const dir = join(ROOT, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p, PAGES, events, site));
}

writeFileSync(join(ROOT, 'index.html'), homepagePage(homepage, PAGES, site));

console.log(`Généré ${PAGES.length} pages + la page d'accueil.`);
