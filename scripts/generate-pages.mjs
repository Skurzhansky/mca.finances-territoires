#!/usr/bin/env node
// Génère les squelettes de pages du site à partir de la structure reprise du sitemap WordPress.
// Usage : node scripts/generate-pages.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const SECTIONS = {
  main:      { label: null },
  expertise: { label: "Expertises et Solutions" },
  secteur:   { label: "Secteurs d'activité", hub: '/secteurs-dactivite/' },
  guide:     { label: 'Guide', hub: '/guide/' },
  other:     { label: null },
};

const PAGES = [
  // --- Pages principales ---
  { slug: 'finances-et-territoires', title: 'Qui sommes-nous ?', section: 'main' },
  { slug: 'les-reussites-de-nos-clients', title: 'Les réussites de nos clients', section: 'main' },
  { slug: 'contact', title: 'Contact', section: 'main' },
  { slug: 'guide', title: 'Guide', section: 'main' },
  { slug: 'evenements', title: 'Événements', section: 'main' },

  // --- Expertises et solutions ---
  { slug: 'detections-des-opportunites', title: 'Détection des opportunités', section: 'expertise' },
  { slug: 'mobilisation-des-aides', title: 'Mobilisation des aides', section: 'expertise' },
  { slug: 'montage-des-dossiers', title: 'Montage des dossiers', section: 'expertise' },
  { slug: 'veille-personnalisee', title: 'Veille personnalisée', section: 'expertise' },
  { slug: 'gestion-des-aides', title: 'Gestion des aides', section: 'expertise' },
  { slug: 'fundraising', title: 'Fundraising', section: 'expertise' },
  { slug: 'fonds-de-dotation-mecenat-local', title: 'Fonds de dotation & mécénat local', section: 'expertise' },
  { slug: 'recherche-de-fondations', title: 'Recherche de fondations', section: 'expertise' },
  { slug: 'nos-formations', title: 'Nos formations', section: 'expertise' },
  { slug: 'optimaides-subventions', title: 'Optim Aides & Subventions', section: 'expertise' },

  // --- Secteurs d'activité ---
  { slug: 'secteurs-dactivite', title: "Secteurs d'activité", section: 'secteur', isHub: true },
  { slug: 'collectivite-epci', title: 'Collectivité & EPCI', section: 'secteur' },
  { slug: 'sante-non-lucratif', title: 'Santé non lucratif', section: 'secteur' },
  { slug: 'social-medico-social', title: 'Médico-social & Social', section: 'secteur' },
  { slug: 'logement-social', title: 'Logement social', section: 'secteur' },
  { slug: 'sdis-service-de-secours', title: 'SDIS & Service de secours', section: 'secteur' },
  { slug: 'entreprise', title: 'Entreprise', section: 'secteur' },
  { slug: 'immobilier', title: 'Immobilier', section: 'secteur' },
  { slug: 'entreprises-publiques-locales-epl', title: 'Entreprises publiques locales (EPL)', section: 'secteur' },
  { slug: 'acteurs-public-institutions', title: 'Acteurs publics & institutions', section: 'secteur' },
  { slug: 'secteur-public', title: 'Secteur public', section: 'secteur' },

  // --- Guide : articles (post-sitemap) ---
  { slug: 'quel-mode-de-financement-pour-quel-type-de-projet-public', title: 'Quel mode de financement pour quel type de projet public ?', section: 'guide' },
  { slug: 'les-differences-entre-mecenat-sponsoring-et-crowdfunding', title: 'Les différences entre mécénat, sponsoring et crowdfunding', section: 'guide' },
  { slug: 'accompagnement-au-montage-de-dossiers-de-financement-pourquoi-externaliser', title: 'Accompagnement au montage de dossiers de financement : pourquoi externaliser ?', section: 'guide' },
  { slug: 'pourquoi-diversifier-vos-sources-de-financement-est-devenu-indispensable', title: 'Pourquoi diversifier vos sources de financement est devenu indispensable', section: 'guide' },
  { slug: 'quest-ce-quun-fonds-de-dotation-et-comment-le-creer', title: "Qu'est-ce qu'un fonds de dotation et comment le créer ?", section: 'guide' },
  { slug: 'comprendre-les-financements-non-bancaires-pour-les-epl-et-collectivites', title: 'Comprendre les financements non bancaires pour les EPL et collectivités', section: 'guide' },
  { slug: 'comment-reussir-votre-dossier-de-demande-de-subvention-regionale', title: 'Comment réussir votre dossier de demande de subvention régionale', section: 'guide' },
  { slug: 'club-de-mecenes-pourquoi-et-comment-mobiliser-les-entreprises-locales', title: 'Club de mécènes : pourquoi et comment mobiliser les entreprises locales ?', section: 'guide' },
  { slug: 'prix-dun-audit-energetique-couts-facteurs-et-rentabilite', title: "Prix d'un audit énergétique : coûts, facteurs et rentabilité", section: 'guide' },
  { slug: 'ipmvp-protocole-de-mesure-et-verification-des-economies-denergie', title: "IPMVP : protocole de mesure et vérification des économies d'énergie", section: 'guide' },
  { slug: 'contrat-de-performance-energetique-cpe-guide-complet-2025', title: 'Contrat de performance énergétique (CPE) : guide complet 2025', section: 'guide' },

  // --- Guide : pages / landings (page-sitemap) ---
  { slug: 'mobiliser-et-securiser-les-subventions-europeennes', title: 'Mobiliser et sécuriser les subventions européennes', section: 'guide' },
  { slug: 'creer-un-fonds-de-dotation-preparation-et-mise-en-oeuvre', title: 'Créer un fonds de dotation : préparation et mise en œuvre', section: 'guide' },
  { slug: 'redynamiser-votre-fonds-de-dotation-et-reactiver-la-philanthropie-locale', title: 'Redynamiser votre fonds de dotation et réactiver la philanthropie locale', section: 'guide' },
  { slug: 'mobiliser-les-aides-subventions-pour-vos-projets-dinvestissement', title: "Mobiliser les aides & subventions pour vos projets d'investissement", section: 'guide' },
  { slug: 'mobiliser-les-aides-subventions-privees-pour-vos-projets-dinvestissement-2', title: "Mobiliser les aides & subventions privées pour vos projets d'investissement", section: 'guide' },
];

const NAV_DROPDOWN = `
    <div class="nav-dropdown">
      <button class="nav-dropdown__trigger" type="button">Expertises et Solutions</button>
      <div class="nav-dropdown__panel">
        <div class="nav-dropdown__col">
          <h5>Expertises</h5>
          <a href="/detections-des-opportunites/">Détection des opportunités</a>
          <a href="/mobilisation-des-aides/">Mobilisation des aides</a>
          <a href="/montage-des-dossiers/">Montage des dossiers</a>
          <a href="/veille-personnalisee/">Veille personnalisée</a>
          <a href="/gestion-des-aides/">Gestion des aides</a>
          <a href="/fundraising/">Fundraising</a>
          <a href="/fonds-de-dotation-mecenat-local/">Fonds de dotation &amp; mécénat local</a>
          <a href="/recherche-de-fondations/">Recherche de fondations</a>
          <a href="/nos-formations/">Nos formations</a>
          <a href="/optimaides-subventions/">Optim Aides &amp; Subventions</a>
        </div>
        <div class="nav-dropdown__col">
          <h5>Secteurs d'activité</h5>
          <a href="/secteurs-dactivite/">Tous les secteurs</a>
          <a href="/collectivite-epci/">Collectivité &amp; EPCI</a>
          <a href="/sante-non-lucratif/">Santé non lucratif</a>
          <a href="/social-medico-social/">Médico-social &amp; Social</a>
          <a href="/logement-social/">Logement social</a>
          <a href="/sdis-service-de-secours/">SDIS &amp; Secours</a>
          <a href="/entreprise/">Entreprise</a>
          <a href="/immobilier/">Immobilier</a>
          <a href="/entreprises-publiques-locales-epl/">Entreprises publiques locales</a>
          <a href="/acteurs-public-institutions/">Acteurs publics &amp; institutions</a>
          <a href="/secteur-public/">Secteur public</a>
        </div>
      </div>
    </div>`;

function header() {
  return `<header class="container site-header">
  <div class="brand"><a href="/" style="color:inherit;text-decoration:none;display:flex;align-items:center;gap:10px;"><span class="brand__dot"></span> FINANCES &amp; TERRITOIRES</a></div>
  <nav class="main-nav">${NAV_DROPDOWN}
    <a href="/les-reussites-de-nos-clients/">Réussites</a>
    <a href="/finances-et-territoires/">Qui sommes-nous ?</a>
  </nav>
  <a class="btn-nav-cta" href="/contact/">Contactez-nous</a>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-top">
    <div class="footer-about">
      <div class="brand"><span class="brand__dot"></span> FINANCES &amp; TERRITOIRES</div>
      <p>Expert des financements publics et du développement des territoires.</p>
      <span class="footer-subsidiary">Une filiale du Groupe BPCE</span>
    </div>
    <div class="footer-col">
      <h4>Expertises</h4>
      <ul>
        <li><a href="/detections-des-opportunites/">Détection</a></li>
        <li><a href="/mobilisation-des-aides/">Mobilisation</a></li>
        <li><a href="/fonds-de-dotation-mecenat-local/">Mécénat &amp; Fundraising</a></li>
        <li><a href="/nos-formations/">Formations</a></li>
        <li><a href="/optimaides-subventions/">Optim Aides &amp; Subventions</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Secteurs</h4>
      <ul>
        <li><a href="/collectivite-epci/">Collectivité &amp; EPCI</a></li>
        <li><a href="/sante-non-lucratif/">Santé non lucratif</a></li>
        <li><a href="/social-medico-social/">Médico-Social &amp; Social</a></li>
        <li><a href="/logement-social/">Logement social</a></li>
        <li><a href="/sdis-service-de-secours/">SDIS &amp; Secours</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>À propos</h4>
      <ul>
        <li><a href="/finances-et-territoires/">Finances &amp; Territoires</a></li>
        <li><a href="/les-reussites-de-nos-clients/">Réussites clients</a></li>
        <li><a href="/evenements/">Événements</a></li>
        <li><a href="/guide/">Guide pratique</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">© 2020 BPCE Finances &amp; Territoires — Filiale du Groupe BPCE. Tous droits réservés.</div>
</footer>`;
}

function breadcrumb(page) {
  const section = SECTIONS[page.section];
  const parts = [`<a href="/">Accueil</a>`];
  if (section.label && !page.isHub) {
    if (section.hub) parts.push(`<a href="${section.hub}">${section.label}</a>`);
    else parts.push(`<span>${section.label}</span>`);
  }
  parts.push(`<span class="current">${page.title}</span>`);
  return `<nav class="breadcrumb container">${parts.join(' <span>/</span> ')}</nav>`;
}

function relatedPages(page) {
  const siblings = PAGES.filter(p => p.section === page.section && p.slug !== page.slug && !p.isHub);
  if (!siblings.length || page.section === 'guide') return '';
  return `
  <div class="container">
    <h2 class="section-title" style="text-align:left;">${SECTIONS[page.section].label}</h2>
    <div class="related-grid">
      ${siblings.map(p => `<a class="related-card" href="/${p.slug}/">${p.title}</a>`).join('\n      ')}
    </div>
  </div>`;
}

function page(p) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title} — Finances &amp; Territoires</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles/site.css">
</head>
<body>

${header()}

${breadcrumb(p)}

<main class="container">
  <div class="page-hero">
    <h1>${p.title}</h1>
  </div>

  <div class="page-placeholder">
    Contenu de la page « ${p.title} » à intégrer.
  </div>
</main>
${relatedPages(p)}

${footer()}

</body>
</html>
`;
}

for (const p of PAGES) {
  const dir = join(ROOT, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(p));
}

console.log(`Généré ${PAGES.length} pages.`);
