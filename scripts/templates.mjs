// Gabarits du site — module pur, sans dépendance Node (fs/path).
// Importable tel quel depuis generate-pages.mjs (build statique) ET depuis
// l'admin dans le navigateur (régénération à la publication), pour éviter
// toute divergence entre les deux.

// Les titres/textes des articles Guide et des Événements viennent de l'admin
// (saisie libre) et sont interpolés tels quels dans le HTML publié — échapper
// systématiquement pour éviter à la fois une page cassée (ex. un titre
// contenant "</title>") et une injection de script stockée.
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Texte éditable pouvant contenir des liens au format [libellé](url) : tout est
// échappé, seuls ces liens sont convertis en <a>. Les URL relatives sont
// résolues depuis `base` (racine du site depuis la page courante).
export function richText(str, base = '../') {
  return escapeHtml(str).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    const url = /^(https?:|mailto:|tel:|#|\/)/.test(href) ? href : `${base}${href}`;
    return `<a href="${url}">${label}</a>`;
  });
}

export const SECTIONS = {
  main:      { label: null },
  expertise: { label: 'Expertises et Solutions' },
  secteur:   { label: "Secteurs d'activité", hub: '../secteurs-dactivite/' },
  guide:     { label: 'Guide', hub: '../guide/' },
};

// --- Pages statiques protégées (non éditables depuis l'admin) ---
// Les articles Guide, Expertises, Secteurs et Événements sont gérés
// séparément (voir buildPages), éditables depuis l'admin. 'entreprise' et
// 'secteurs-dactivite' ont un rendu sur mesure (voir renderCustom) et
// restent ici plutôt que dans data/secteurs.json.

export const BASE_PAGES = [
  { slug: 'finances-et-territoires', title: 'Qui sommes-nous ?', section: 'main', type: 'custom' },
  { slug: 'les-reussites-de-nos-clients', title: 'Les réussites de nos clients', section: 'main', type: 'custom' },
  { slug: 'contact', title: 'Contact', section: 'main', type: 'custom' },
  { slug: 'guide', title: 'Guide', section: 'main', type: 'custom' },
  { slug: 'evenements', title: 'Événements', section: 'main', type: 'custom' },
  { slug: 'entreprise', title: 'Entreprise', section: 'secteur', type: 'custom', image: 'images/carte-calculatrice.jpg' },
  { slug: 'secteurs-dactivite', title: "Secteurs d'activité", section: 'secteur', type: 'secteur', isHub: true, image: 'images/paris-eiffel.jpg',
    lead: "Une expertise territoriale et sectorielle : nous adaptons notre accompagnement aux enjeux propres à chaque type de structure.",
    features: [] },
];

// --- Gabarits partagés ---

// Structure de navigation reprise du site réel : menus en cascade
// (un item avec "children" ouvre un sous-menu flottant à droite au survol/clic).
export const EXPERTISES_MENU = [
  { label: 'Détections des opportunités', href: 'detections-des-opportunites/', children: [
    { label: 'Optim Aides & Subventions', href: 'optimaides-subventions/' },
    { label: 'Veille personnalisée', href: 'veille-personnalisee/' },
  ] },
  { label: 'Mobilisation des aides', href: 'mobilisation-des-aides/', children: [
    { label: 'Montage des dossiers', href: 'montage-des-dossiers/' },
    { label: 'Gestion des aides', href: 'gestion-des-aides/' },
  ] },
  { label: 'Mécénat et Fundraising', children: [
    { label: 'Fonds de dotation & Mécénat local', href: 'fonds-de-dotation-mecenat-local/' },
    { label: 'Recherche de fondations', href: 'recherche-de-fondations/' },
    { label: 'Fundraising', href: 'fundraising/' },
  ] },
  { label: 'Formations', href: 'nos-formations/' },
];

export const QUI_SOMMES_NOUS_MENU = [
  { label: 'Finances & Territoires', href: 'finances-et-territoires/' },
  { label: 'Événements', href: 'evenements/' },
  { label: 'Guide', href: 'guide/' },
];

// Navigation par défaut — reprise telle quelle dans data/navigation.json, que
// l'admin édite (libellés, liens, sous-menus, colonnes du footer).
export const DEFAULT_NAVIGATION = {
  header: {
    expertisesLabel: 'Expertises et Solutions',
    expertisesMenu: EXPERTISES_MENU,
    aboutLabel: 'Qui sommes-nous ?',
    aboutMenu: QUI_SOMMES_NOUS_MENU,
    reussitesLabel: 'Réussites',
    reussitesHref: 'les-reussites-de-nos-clients/',
    ctaLabel: 'Contactez-nous',
    ctaHref: 'contact/',
  },
  footer: {
    brand: 'FINANCES & TERRITOIRES',
    text: 'Expert des financements publics et du développement des territoires.',
    subsidiary: 'Une filiale du Groupe BPCE',
    columns: [
      { title: 'Expertises', links: [
        { label: 'Détection', href: 'detections-des-opportunites/' },
        { label: 'Mobilisation', href: 'mobilisation-des-aides/' },
        { label: 'Mécénat & Fundraising', href: 'fonds-de-dotation-mecenat-local/' },
        { label: 'Formations', href: 'nos-formations/' },
        { label: 'Optim Aides & Subventions', href: 'optimaides-subventions/' },
      ] },
      { title: 'Secteurs', links: [
        { label: 'Collectivité & EPCI', href: 'collectivites-epci/' },
        { label: 'Santé non lucratif', href: 'etablissements-de-sante-publics-non-lucratifs/' },
        { label: 'Médico-Social & Social', href: 'structures-medico-sociales/' },
        { label: 'Logement social', href: 'logement-social/' },
        { label: 'SDIS & Secours', href: 'sdis-service-de-secours/' },
      ] },
      { title: 'À propos', links: [
        { label: 'Finances & Territoires', href: 'finances-et-territoires/' },
        { label: 'Réussites clients', href: 'les-reussites-de-nos-clients/' },
        { label: 'Événements', href: 'evenements/' },
        { label: 'Guide pratique', href: 'guide/' },
        { label: 'Contact', href: 'contact/' },
      ] },
    ],
    bottom: '© 2020 BPCE Finances & Territoires — Filiale du Groupe BPCE. Tous droits réservés.',
  },
};

// Contenu par défaut des pages de base (reprise dans data/pages.json, éditable
// depuis l'admin). `title` alimente la navigation et le fil d'Ariane,
// `headline` le <h1> quand il diffère du titre court.
export const DEFAULT_CONTENT = {
  cta: {
    title: 'Vous souhaitez mieux comprendre les aides possibles pour votre projet ?',
    text: 'Contactez-nous pour un échange personnalisé sur vos besoins en financement.',
    label: 'Contactez-nous →',
  },
  pages: {
    'finances-et-territoires': {
      title: 'Qui sommes-nous ?',
      lead: "Finances & Territoires est une filiale du Groupe BPCE, experte du financement public et privé des projets d'investissement des territoires depuis 20 ans.",
      stats: [
        { value: '1,2 Md€', label: 'mobilisés pour nos clients' },
        { value: '18 600', label: 'dispositifs référencés' },
        { value: '20 ans', label: "d'expertise territoriale" },
      ],
      features: [
        { title: 'Engagement humain', text: "Un accompagnement sur mesure avec un consultant dédié, à l'écoute de vos besoins." },
        { title: 'Impact et résultats', text: 'La concrétisation de vos projets dans une approche responsable et durable.' },
        { title: 'Excellence et fiabilité', text: 'Une veille rigoureuse et une méthodologie éprouvée, au service de la qualité.' },
      ],
    },
    'les-reussites-de-nos-clients': {
      title: 'Les réussites de nos clients',
      bannerImage: 'images/handshake-reunion.webp',
      bannerCtaLabel: 'En savoir plus →',
      bannerCtaHref: 'les-reussites-de-nos-clients/',
      lead: 'Collectivités, associations et entreprises que nous accompagnons dans la sécurisation de leurs financements.',
      testimonial: {
        meta: 'Témoignages',
        quote: "« Votre expertise et votre engagement ont été déterminants dans l'obtention des subventions accordées par l'Agence de l'eau et le Fonds Vert pour le réaménagement du parc Charles-de-Gaulle et de la Place Michelet. »",
        cite: 'Julien Chambon — Maire',
        footnote: 'Commune de Ricailles · 33 617 habitants (Insee 2022)',
      },
      stats: [
        { value: '18 600', label: 'aides pour nos clients' },
        { value: '10 000', label: 'aides publiques' },
        { value: '8 600', label: 'aides privées' },
      ],
    },
    contact: {
      title: 'Contact',
      lead: 'Un projet à financer ? Parlons-en. Décrivez-nous votre besoin, un consultant vous recontacte pour un premier échange.',
      email: 'A-REMPLACER@exemple.fr',
      infoTitle: 'Finances & Territoires',
      infoParagraphs: [
        'Filiale du Groupe BPCE, nous accompagnons les collectivités, associations et entreprises dans la sécurisation de leurs financements depuis 20 ans.',
        'Retrouvez également nos solutions dans le menu « Expertises et Solutions », ou explorez le [Guide](guide/) pour en savoir plus sur les dispositifs de financement.',
      ],
    },
    guide: {
      title: 'Guide',
      lead: 'Comprendre, anticiper et agir face aux évolutions du financement.',
    },
    evenements: {
      title: 'Événements',
      lead: 'Webinaires, rencontres et temps forts autour du financement des projets territoriaux.',
      emptyTitle: 'Aucun événement programmé pour le moment',
      emptyText: 'Revenez bientôt ou [contactez-nous](contact/) pour être informé des prochaines dates.',
    },
    entreprise: {
      title: 'Entreprise',
      eyebrow: 'Engagées pour un territoire durable',
      headline: 'Activez des leviers de financement et de partenariat pour vos projets à impact',
      lead: "Qu'il s'agisse de PME, d'ETI ou de grandes entreprises, de plus en plus d'acteurs économiques s'engagent sur leur territoire : transition écologique, innovation sociale, revitalisation des centres-bourgs, mécénat ou développement de projets collaboratifs. Ces initiatives peuvent bénéficier de financements publics, de soutiens privés, ou s'inscrire dans des partenariats stratégiques avec les collectivités.",
      ctaLabel: 'Contactez-nous →',
      sections: [
        { type: 'list', title: 'Vos enjeux', items: [
          'Identifier les aides et dispositifs mobilisables pour vos projets à visée sociale ou environnementale',
          'Structurer des collaborations efficaces avec le secteur public',
          'Valoriser votre impact RSE et territorial auprès de vos parties prenantes',
        ] },
        { type: 'blocks', title: 'Ce que nous vous proposons', blocks: [
          { title: 'Identification des dispositifs publics et privés adaptés', text: "Nous analysons vos projets pour repérer les aides disponibles : subventions à l'innovation ou à la transition énergétique, dispositifs territoriaux, soutien à l'investissement, mécénat, fonds européens…" },
          { title: 'Structuration de projets en co-développement avec le public', text: 'Nous vous accompagnons dans la construction de projets conjoints avec les collectivités (bailleurs sociaux, EPL, établissements de santé…), en intégrant les enjeux réglementaires, financiers et opérationnels.' },
          { title: 'Déploiement de démarches RSE territorialisées', text: 'Nous vous aidons à traduire vos engagements RSE en projets concrets et visibles, à identifier les bons leviers de financement, et à communiquer efficacement votre impact auprès de vos partenaires institutionnels, clients ou investisseurs.' },
          { title: "Mobilisation du mécénat et des clubs d'entreprises", text: "Nous accompagnons les entreprises désireuses de s'impliquer localement dans des initiatives d'intérêt général : constitution de clubs de mécènes, mécénat de compétence ou en nature, partenariats avec des structures non lucratives locales." },
        ] },
        { type: 'list', title: 'Ce que vous y gagnez', items: [
          'Une stratégie claire pour accéder à des aides souvent méconnues',
          'Des projets structurés en cohérence avec vos valeurs et votre stratégie RSE',
          'Une reconnaissance accrue auprès des acteurs publics et de vos partenaires économiques',
        ] },
      ],
      cta: {
        title: 'Vous développez un projet stratégique à fort impact territorial ?',
        text: 'Contactez-nous pour concevoir une solution de financement alignée sur vos ambitions économiques et sociales.',
        label: 'Contactez-nous →',
      },
    },
    'secteurs-dactivite': {
      title: "Secteurs d'activité",
      lead: "Une expertise territoriale et sectorielle : nous adaptons notre accompagnement aux enjeux propres à chaque type de structure.",
    },
  },
};

// Contenu d'une page de base : valeurs par défaut du gabarit, écrasées par
// data/pages.json (fusion champ par champ, un champ absent garde sa valeur).
export function pageContent(slug, content) {
  return { ...(DEFAULT_CONTENT.pages[slug] || {}), ...((content?.pages || {})[slug] || {}) };
}

export function navMenuItems(items, base) {
  return items.map(item => {
    if (item.children) {
      const labelInner = item.href
        ? `<a href="${base}${item.href}">${escapeHtml(item.label)}</a>`
        : `<span class="nav-menu-item__text">${escapeHtml(item.label)}</span>`;
      return `<div class="nav-menu-item">
          <span class="nav-menu-item__label">${labelInner}<button type="button" class="nav-menu-item__arrow" aria-label="Afficher le sous-menu">›</button></span>
          <div class="nav-submenu">
            ${item.children.map(c => `<a href="${base}${c.href}">${escapeHtml(c.label)}</a>`).join('\n            ')}
          </div>
        </div>`;
    }
    return `<a href="${base}${item.href}" class="nav-menu-item__leaf">${escapeHtml(item.label)}</a>`;
  }).join('\n        ');
}

export function navDropdown(triggerLabel, items, base) {
  return `
    <div class="nav-dropdown">
      <button class="nav-dropdown__trigger" type="button" aria-expanded="false">${triggerLabel}</button>
      <div class="nav-dropdown__panel">
        <div class="nav-dropdown__panel-inner">
        ${navMenuItems(items, base)}
        </div>
      </div>
    </div>`;
}

function slugFromHref(href) {
  return href ? href.replace(/\/$/, '') : null;
}

// Filtre un menu (1 ou 2 niveaux) selon le champ `hidden` des pages
// correspondantes. Un groupe sans enfant visible disparaît ; si seul le lien
// du déclencheur d'un groupe est masqué, le groupe devient un simple libellé
// (ses enfants visibles restent accessibles). Un lien vers une page externe
// ou non gérée ici est toujours conservé.
function filterMenu(menu, pages) {
  const hidden = new Set((pages || []).filter(p => p.hidden).map(p => p.slug));
  return (menu || [])
    .map(item => {
      if (item.children && item.children.length) {
        const children = item.children.filter(c => !hidden.has(slugFromHref(c.href)));
        if (!children.length) return null;
        if (item.href && hidden.has(slugFromHref(item.href))) {
          return { label: item.label, children };
        }
        return { ...item, children };
      }
      if (!item.href || hidden.has(slugFromHref(item.href))) return null;
      return { label: item.label, href: item.href };
    })
    .filter(Boolean);
}

export function header(pages, base = '../', navigation) {
  const h = { ...DEFAULT_NAVIGATION.header, ...(navigation?.header || {}) };
  const homeHref = base || './';
  return `<header class="site-header">
  <div class="container site-header__inner">
  <a class="brand brand--logo" href="${homeHref}"><img src="${base}images/logo-bpce.jpg" alt="BPCE Finances &amp; Territoires"></a>
  <button type="button" class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <nav class="main-nav">${navDropdown(escapeHtml(h.expertisesLabel), filterMenu(h.expertisesMenu, pages), base)}
    <a href="${base}${h.reussitesHref}">${escapeHtml(h.reussitesLabel)}</a>${navDropdown(escapeHtml(h.aboutLabel), filterMenu(h.aboutMenu, pages), base)}
    <a class="btn-nav-cta btn-nav-cta--mobile" href="${base}${h.ctaHref}">${escapeHtml(h.ctaLabel)}</a>
  </nav>
  <a class="btn-nav-cta" href="${base}${h.ctaHref}">${escapeHtml(h.ctaLabel)}</a>
  </div>
</header>`;
}

export function footer(pages, base = '../', navigation) {
  const f = { ...DEFAULT_NAVIGATION.footer, ...(navigation?.footer || {}) };
  const hiddenSlugs = new Set((pages || []).filter(x => x.hidden).map(x => x.slug));
  const columns = (f.columns || []).map(col => ({
    ...col,
    links: (col.links || []).filter(l => !hiddenSlugs.has(slugFromHref(l.href))),
  }));
  return `<footer class="site-footer">
  <div class="container footer-top">
    <div class="footer-about">
      <div class="brand"><span class="brand__dot"></span> ${escapeHtml(f.brand)}</div>
      <p>${escapeHtml(f.text)}</p>
      <span class="footer-subsidiary">${escapeHtml(f.subsidiary)}</span>
    </div>
    ${columns.map(col => `<div class="footer-col">
      <h4>${escapeHtml(col.title)}</h4>
      <ul>
        ${col.links.map(l => `<li><a href="${base}${l.href}">${escapeHtml(l.label)}</a></li>`).join('\n        ')}
      </ul>
    </div>`).join('\n    ')}
  </div>
  <div class="footer-bottom">${escapeHtml(f.bottom)}</div>
</footer>`;
}

export function breadcrumb(p) {
  const section = SECTIONS[p.section];
  const parts = [`<a href="../">Accueil</a>`];
  if (section.label && !p.isHub) {
    if (section.hub) parts.push(`<a href="${section.hub}">${section.label}</a>`);
    else parts.push(`<span>${section.label}</span>`);
  }
  parts.push(`<span class="current">${escapeHtml(p.title)}</span>`);
  return `<nav class="breadcrumb container">${parts.join(' <span>/</span> ')}</nav>`;
}

export function ctaBand(content, base = '../') {
  const c = { ...DEFAULT_CONTENT.cta, ...(content?.cta || {}) };
  return `
  <section>
    <div class="cta-band">
      <div>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.text)}</p>
      </div>
      <a class="btn-cta-pill" href="${base}contact/">${escapeHtml(c.label)}</a>
    </div>
  </section>`;
}

export function featureList(features) {
  if (!features || !features.length) return '';
  return `
  <div class="feature-list">
    ${features.map((f, i) => `<div class="feature-list__item">
      <span class="feature-list__bullet">${i + 1}</span>
      <h3>${escapeHtml(f.title)}</h3>
      <p>${escapeHtml(f.text)}</p>
    </div>`).join('\n    ')}
  </div>`;
}

export function relatedGrid(p, pages, { excludeHub = false } = {}) {
  let siblings = pages.filter(x => x.section === p.section && x.slug !== p.slug && !x.hidden);
  if (excludeHub) siblings = siblings.filter(x => !x.isHub);
  if (!siblings.length) return '';
  return `
  <div class="container">
    <h2 class="section-title" style="text-align:left;">${SECTIONS[p.section].label}</h2>
    <div class="related-grid">
      ${siblings.map(x => `<a class="related-card" href="../${x.slug}/">${escapeHtml(x.title)}</a>`).join('\n      ')}
    </div>
  </div>`;
}

// --- Rendu par type de page ---

export function pageBanner(p) {
  if (!p.image) return '';
  return `
  <div class="page-banner"><img src="../${p.image}" alt="" loading="lazy" onerror="this.parentElement.remove()"></div>`;
}

export function renderExpertiseOrSecteur(p, pages, content) {
  return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(p.title)}</h1>
    <p class="lead">${escapeHtml(p.lead)}</p>
    <a class="btn btn--site btn-primary" href="../contact/">Contactez-nous →</a>
  </div>${pageBanner(p)}
  ${featureList(p.features)}
</main>
${p.section === 'expertise' ? relatedGrid(p, pages, { excludeHub: true }) : ''}
${ctaBand(content)}`;
}

export function renderArticle(p, content) {
  return `<main class="container">
  <div class="page-hero">
    <span class="article-meta">Guide</span>
    <h1>${escapeHtml(p.title)}</h1>
    <p class="lead">${escapeHtml(p.intro)}</p>
  </div>
  <div class="article-body">
    ${p.body.map(([h, text]) => `<h2>${escapeHtml(h)}</h2>\n    <p>${escapeHtml(text)}</p>`).join('\n    ')}
  </div>
</main>
${ctaBand(content)}`;
}

export function renderGuideHub(articles, c = {}) {
  return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(c.title ?? 'Guide')}</h1>
    <p class="lead">${escapeHtml(c.lead ?? '')}</p>
  </div>
  <div class="cards-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom:64px;">
    ${articles.map((a, i) => `<article class="feature-card feature-card--guide">
      <div class="feature-card__banner"><img src="../${a.image || 'images/paris-eiffel.jpg'}" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="feature-card__body">
        <h3><a href="../${a.slug}/" style="color:inherit;text-decoration:none;">${escapeHtml(a.title)}</a></h3>
        <p>${escapeHtml(a.intro)}</p>
      </div>
    </article>`).join('\n    ')}
  </div>
</main>`;
}

function formatEventDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function renderEvenements(events, c = {}) {
  const list = events || [];
  const body = list.length
    ? `<div class="events-list">
    ${list.map(e => `<div class="event-item">
      <div class="event-item__date">${escapeHtml(formatEventDate(e.date))}</div>
      <h3>${escapeHtml(e.title)}</h3>
      <p>${escapeHtml(e.description || '')}</p>
    </div>`).join('\n    ')}
  </div>`
    : `<div class="empty-state">
    <strong>${escapeHtml(c.emptyTitle ?? '')}</strong>
    ${richText(c.emptyText ?? '')}
  </div>`;
  return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(c.title ?? 'Événements')}</h1>
    <p class="lead">${escapeHtml(c.lead ?? '')}</p>
  </div>
  ${body}
</main>`;
}

// Sections libres des pages de base « riches » (type liste à puces ou blocs
// titre + texte), éditables depuis l'admin.
export function renderPageSections(sections) {
  return (sections || []).map(s => {
    if (s.type === 'list') {
      return `<h2>${escapeHtml(s.title)}</h2>
    <ul class="content-list">
      ${(s.items || []).map(i => `<li>${escapeHtml(i)}</li>`).join('\n      ')}
    </ul>`;
    }
    return `<h2>${escapeHtml(s.title)}</h2>
    ${(s.blocks || []).map(b => `<div class="content-block">
      <h3>${escapeHtml(b.title)}</h3>
      <p>${escapeHtml(b.text)}</p>
    </div>`).join('\n    ')}`;
  }).join('\n\n    ');
}

export function renderCustom(p, pages, events, content) {
  const c = pageContent(p.slug, content);
  switch (p.slug) {
    case 'entreprise': {
      const cta = { ...(DEFAULT_CONTENT.pages.entreprise.cta), ...(c.cta || {}) };
      return `<main class="container">
  <div class="page-hero">
    <span class="page-hero__eyebrow">${escapeHtml(c.eyebrow)}</span>
    <h1>${escapeHtml(c.headline || c.title)}</h1>
    <p class="lead">${escapeHtml(c.lead)}</p>
    <a class="btn btn--site btn-primary" href="../contact/">${escapeHtml(c.ctaLabel)}</a>
  </div>${pageBanner({ ...p, image: c.image || p.image })}

  <div class="article-body" style="max-width:none;">
    ${renderPageSections(c.sections)}
  </div>
</main>
<section>
  <div class="cta-band">
    <div>
      <h3>${escapeHtml(cta.title)}</h3>
      <p>${escapeHtml(cta.text)}</p>
    </div>
    <a class="btn-cta-pill" href="../contact/">${escapeHtml(cta.label)}</a>
  </div>
</section>`;
    }

    case 'finances-et-territoires':
      return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(c.headline || c.title)}</h1>
    <p class="lead">${escapeHtml(c.lead)}</p>
  </div>

  <div class="stats-row" style="margin-top:40px; margin-bottom:56px;">
    ${(c.stats || []).map(s => `<div><div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div></div>`).join('\n    ')}
  </div>

  <div class="feature-list">
    ${(c.features || []).map((f, i) => `<div class="feature-list__item">
      <span class="feature-list__bullet">${i + 1}</span>
      <h3>${escapeHtml(f.title)}</h3>
      <p>${escapeHtml(f.text)}</p>
    </div>`).join('\n    ')}
  </div>
</main>
${ctaBand(content)}`;

    case 'les-reussites-de-nos-clients': {
      const t = { ...(DEFAULT_CONTENT.pages['les-reussites-de-nos-clients'].testimonial), ...(c.testimonial || {}) };
      return `${c.bannerImage ? `<div class="hero-photo-banner">
  <img src="../${escapeHtml(c.bannerImage)}" alt="" loading="lazy" onerror="this.parentElement.remove()">
  <div class="hero-photo-banner__content container">
    <h1>${escapeHtml(c.headline || c.title)}</h1>
    <a class="btn btn--site btn-primary" href="../${c.bannerCtaHref}">${escapeHtml(c.bannerCtaLabel)}</a>
  </div>
</div>
` : ''}<main class="container">
  <div class="page-hero">
    <p class="lead">${escapeHtml(c.lead)}</p>
  </div>

  <div class="testimonial-band" style="border-radius:16px; margin-bottom:56px;">
    <div class="testimonial-inner" style="padding:0 32px;">
      <span class="testimonial-quote-mark">"</span>
      <div class="testimonial-card">
        <span class="meta">${escapeHtml(t.meta)}</span>
        <blockquote>${escapeHtml(t.quote)}</blockquote>
        <cite>${escapeHtml(t.cite)}</cite>
      </div>
    </div>
    <div class="testimonial-footnote" style="padding-left:114px;">${escapeHtml(t.footnote)}</div>
  </div>

  <div class="stats-row" style="margin-bottom:56px;">
    ${(c.stats || []).map(s => `<div><div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div></div>`).join('\n    ')}
  </div>
</main>
${ctaBand(content)}`;
    }

    case 'contact': {
      // Adresse interpolée dans un littéral JS : on la restreint aux caractères
      // valides d'un e-mail pour qu'aucune saisie admin ne casse le script.
      const email = String(c.email || '').replace(/[^\w.@+-]/g, '');
      return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(c.headline || c.title)}</h1>
    <p class="lead">${escapeHtml(c.lead)}</p>
  </div>

  <div class="contact-layout">
    <form class="contact-form" id="contact-form">
      <div class="form-field">
        <label for="name">Nom et prénom</label>
        <input id="name" type="text" name="name" placeholder="Jean Dupont" required>
      </div>
      <div class="form-field">
        <label for="org">Structure</label>
        <input id="org" type="text" name="org" placeholder="Commune, association, entreprise…">
      </div>
      <div class="form-field">
        <label for="email">E-mail</label>
        <input id="email" type="email" name="email" placeholder="vous@exemple.fr" required>
      </div>
      <div class="form-field">
        <label for="message">Votre message</label>
        <textarea id="message" name="message" placeholder="Décrivez votre projet et vos besoins en financement…" required></textarea>
      </div>
      <button class="btn btn--site btn-primary" type="submit" style="align-self:flex-start;">Envoyer →</button>
    </form>
    <script>
      document.getElementById('contact-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('name').value;
        var org = document.getElementById('org').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;
        var subject = 'Demande de contact — ' + name;
        var body = 'Nom et prénom : ' + name + '\\n' +
          'Structure : ' + org + '\\n' +
          'E-mail : ' + email + '\\n\\n' +
          message;
        window.location.href = 'mailto:${email}?subject=' +
          encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      });
    </script>
    <div class="contact-info">
      <h3>${escapeHtml(c.infoTitle)}</h3>
      ${(c.infoParagraphs || []).map(t => `<p>${richText(t)}</p>`).join('\n      ')}
    </div>
  </div>
</main>`;
    }

    case 'guide':
      return renderGuideHub(pages.filter(x => x.section === 'guide'), c);

    case 'evenements':
      return renderEvenements(events, c);

    default:
      return `<main class="container"><div class="page-placeholder">Contenu de la page « ${escapeHtml(p.title)} » à intégrer.</div></main>`;
  }
}

export function render(p, pages, events, site = {}) {
  if (p.type === 'expertise' || p.type === 'secteur') return renderExpertiseOrSecteur(p, pages, site.content);
  if (p.type === 'article') return renderArticle(p, site.content);
  return renderCustom(p, pages, events, site.content);
}

// Balises SEO : les champs saisis dans l'admin priment, sinon on retombe sur
// le titre de la page et son chapô/introduction.
export function seoTags(p, content) {
  const c = pageContent(p.slug, content);
  const title = p.seoTitle || c.seoTitle || `${p.title} — Finances & Territoires`;
  const description = p.seoDescription || c.seoDescription || p.lead || p.intro || c.lead || '';
  return metaTags(title, description);
}

function metaTags(title, description) {
  return `<title>${escapeHtml(title)}</title>${description ? `
<meta name="description" content="${escapeHtml(description)}">` : ''}
<meta property="og:title" content="${escapeHtml(title)}">${description ? `
<meta property="og:description" content="${escapeHtml(description)}">` : ''}`;
}

export function page(p, pages, events, site = {}) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${seoTags(p, site.content)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles/site.css">
</head>
<body>

${header(pages, '../', site.navigation)}

${breadcrumb(p)}

${render(p, pages, events, site)}

${footer(pages, '../', site.navigation)}

<script src="../nav.js" defer></script>
</body>
</html>
`;
}

// --- Page d'accueil ---
// Entièrement pilotée par data/homepage.json — texte, chiffres et photos.
// Seules les icônes SVG dessinées à la main (types de clients, cartes
// « Expertise/Adaptation/Sécurisation », valeurs) restent fixes dans le
// gabarit : remplacer une icône vectorielle par une photo n'aurait pas de
// sens visuel. Le libellé de chaque type de client est lu directement sur
// la page secteur/entreprise correspondante (une seule source de vérité
// pour ce nom, au lieu de le dupliquer ici) ; une entrée dont la page est
// masquée ou supprimée disparaît simplement de la rangée.

const CLIENT_TYPE_ICONS = {
  'entreprise': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>',
  'collectivites-epci': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5H3l9-5z"/><path d="M4 10h16"/><path d="M6 10v9M10 10v9M14 10v9M18 10v9"/><path d="M3 21h18"/></svg>',
  'etablissements-de-sante-publics-non-lucratifs': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',
  'structures-medico-sociales': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.35-9.33-8.94C1.4 8.94 2.9 5.5 6.2 5.02 8.4 4.7 10.6 5.9 12 7.8c1.4-1.9 3.6-3.1 5.8-2.78 3.3.48 4.8 3.92 3.53 7.04C19 16.65 12 21 12 21z"/></svg>',
  'entreprises-publiques-locales-epl': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M4 21h16"/></svg>',
  'logement-social': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/></svg>',
  'sdis-service-de-secours': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s-5 5.5-5 10a5 5 0 0 0 10 0c0-2-1-3.5-2-4.5.3 1.5-.5 2.5-1.5 2.5-1.2 0-1.8-1-1.5-2.5A7 7 0 0 1 12 3z"/></svg>',
};

// Le libellé (court, choisi pour ce rang étroit) et l'ordre viennent de
// homepage.clientTypes ; l'icône reste fixe par slug ; une entrée dont la
// page cible est masquée ou supprimée disparaît de la rangée.
function renderClientTypes(homepage, pages) {
  return (homepage?.clientTypes || [])
    .filter(ct => {
      const page = (pages || []).find(p => p.slug === ct.slug);
      return page && !page.hidden;
    })
    .map(ct => `<a class="client-type" href="${ct.slug}/"><span class="client-type__icon">${CLIENT_TYPE_ICONS[ct.slug] || ''}</span>${escapeHtml(ct.label)}</a>`)
    .join('\n    ');
}

const INTRO_CARD_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3h-4l-.3 2.4a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.97 7.97 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1L9 21h4l.3-2.4a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12.5l2 2 4-4.5"/></svg>',
];

const VALUE_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="16" cy="9" r="2.6"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M14 20c.3-2.3 2-4 4.5-4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12.5l2 2 4-4.5"/></svg>',
];

export function renderHomepage(homepage, pages, content) {
  const h = homepage || {};
  const cta = { ...DEFAULT_CONTENT.cta, ...(content?.cta || {}) };
  const photos = h.heroPhotos || {};
  return `<main>

  <div class="hero-band">
  <div class="container">
  <section class="hero">
    <div class="hero-card">
      <span class="hero-card__mark"></span>
      <h1>${escapeHtml(h.heroTitle)}</h1>
      <p>${escapeHtml(h.heroLead)}</p>
      <div>
        <div class="hero-stat__value">${escapeHtml(h.heroStatValue)}</div>
        <div class="hero-stat__label">${escapeHtml(h.heroStatLabel)}</div>
      </div>
      <a class="btn btn--site btn-primary" href="finances-et-territoires/">${escapeHtml(h.ctaLabel)}</a>
    </div>
    <div class="photo-grid">
      <div class="photo-tile photo-tile--big"><img src="${escapeHtml(photos.big)}" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--tr1"><img src="${escapeHtml(photos.tr1)}" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--tr2"><img src="${escapeHtml(photos.tr2)}" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--bl"><img src="${escapeHtml(photos.bl)}" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--br"><img src="${escapeHtml(photos.br)}" alt="" loading="lazy" onerror="this.remove()"></div>
      <img class="photo-grid__avatar" src="${escapeHtml(photos.avatar)}" alt="" loading="lazy" onerror="this.remove()">
    </div>
  </section>
  </div>
  </div>

  <section class="client-types-section">
    <div class="container">
    <div class="client-types">
    ${renderClientTypes(h, pages)}
    </div>
    </div>
  </section>

  <div class="container">
  <section id="expertises">
    <div class="section-intro">
      <h2 class="section-title">${escapeHtml(h.introTitle)}</h2>
      <p class="section-intro__text">${escapeHtml(h.introText)}</p>
    </div>
    <div class="cards-grid">
      ${(h.introCards || []).map((c, i) => `<article class="icon-card">
        <span class="icon-card__badge">${INTRO_CARD_ICONS[i % INTRO_CARD_ICONS.length]}</span>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.text)}</p>
      </article>`).join('\n      ')}
    </div>
  </section>
  </div>

  <section class="section--muted" id="reussites">
    <div class="testimonial-band">
      <div class="container">
        <div class="testimonial-inner">
          <span class="testimonial-quote-mark">"</span>
          <div class="testimonial-card">
            <span class="meta">Témoignages</span>
            <blockquote>${escapeHtml(h.testimonial?.quote)}</blockquote>
            <cite>${escapeHtml(h.testimonial?.cite)}</cite>
          </div>
        </div>
        <div class="testimonial-footnote">${escapeHtml(h.testimonial?.footnote)}</div>
      </div>
    </div>
  </section>

  <div class="container">
  <section>
    <h2 class="section-title">${escapeHtml(h.statsTitle)}</h2>
    <div class="stats-row">
      ${(h.stats || []).map(s => `<div><div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div></div>`).join('\n      ')}
    </div>
    <p class="stats-caption">${escapeHtml(h.statsCaption)}</p>
  </section>
  </div>

  <section class="section--muted">
    <div class="container">
    <div class="section-header-row">
      <div>
        <h2 class="section-title">Guide</h2>
        <p class="section-subtitle">Comprendre, anticiper et agir face aux évolutions du financement</p>
      </div>
      <a class="link-arrow" href="guide/">Voir le guide →</a>
    </div>
    ${renderHomepageGuideCarousel(pages)}
    </div>
  </section>

  <div class="container">
  <section id="qui-sommes-nous">
    <h2 class="section-title">${escapeHtml(h.valuesTitle)}</h2>
    <div class="values-grid">
      ${(h.values || []).map((v, i) => `<div class="value-item">
        <span class="value-item__icon">${VALUE_ICONS[i % VALUE_ICONS.length]}</span>
        <h3>${escapeHtml(v.title)}</h3>
        <p>${escapeHtml(v.text)}</p>
      </div>`).join('\n      ')}
    </div>
  </section>
  </div>

  <section class="section--muted">
    <div class="container">
    <h2 class="section-title">${escapeHtml(h.partnersTitle)}</h2>
    <div class="partners-row">
      ${(h.partners || []).map(p => `<img class="partner-logo" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.alt)}" loading="lazy">`).join('\n      ')}
    </div>
    </div>
  </section>

  <section id="contact">
    <div class="cta-band">
      <div>
        <h3>${escapeHtml(cta.title)}</h3>
        <p>${escapeHtml(cta.text)}</p>
      </div>
      <a class="btn-cta-pill" href="contact/">${escapeHtml(cta.label)}</a>
    </div>
  </section>

  <div class="container">
  <section>
    <h2 class="section-title">${escapeHtml(h.faqTitle)}</h2>
    <div class="faq-grid">
      ${(h.faq || []).map(q => `<div class="faq-item">${escapeHtml(q)}<span>›</span></div>`).join('\n      ')}
    </div>
  </section>
  </div>

</main>`;
}

// Carousel Guide de la page d'accueil : rendu à partir des mêmes articles
// que la page /guide/ (pas de copie figée), pour éviter tout risque de
// divergence entre les deux quand l'admin ajoute/retire un article.
function renderHomepageGuideCarousel(pages) {
  const articles = (pages || []).filter(x => x.section === 'guide');
  const slides = [];
  for (let i = 0; i < articles.length; i += 3) slides.push(articles.slice(i, i + 3));
  if (!slides.length) return '';
  return `<div class="guide-carousel" id="guide-carousel">
      <div class="guide-carousel__track">
        ${slides.map((slide, si) => `<div class="cards-grid guide-carousel__slide${si === 0 ? ' is-active' : ''}">
          ${slide.map(a => `<article class="feature-card feature-card--guide">
            <div class="feature-card__banner">
              <img src="${escapeHtml(a.image || 'images/paris-eiffel.jpg')}" alt="" loading="lazy" onerror="this.remove()">
            </div>
            <div class="feature-card__body">
              <h3><a href="${a.slug}/" style="color:inherit;text-decoration:none;">${escapeHtml(a.title)}</a></h3>
              <p>${escapeHtml(a.intro)}</p>
            </div>
          </article>`).join('\n          ')}
        </div>`).join('\n        ')}
      </div>
      <div class="guide-carousel__dots">
        ${slides.map((_, si) => `<button type="button" class="guide-carousel__dot${si === 0 ? ' is-active' : ''}" data-index="${si}" aria-label="Diapositive ${si + 1} sur ${slides.length}"></button>`).join('\n        ')}
      </div>
    </div>`;
}

export function homepagePage(homepage, pages, site = {}) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${metaTags(homepage?.seoTitle || `Finances & Territoires — ${homepage?.heroTitle || ''}`, homepage?.seoDescription || homepage?.heroLead || '')}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles/site.css">
</head>
<body>

${header(pages, '', site.navigation)}

${renderHomepage(homepage, pages, site.content)}

${footer(pages, '', site.navigation)}
<script src="nav.js" defer></script>
<script src="guide-carousel.js" defer></script>
</body>
</html>
`;
}

// Assemble la liste complète des pages à partir du socle statique protégé +
// des trois contenus éditables depuis l'admin (Expertises, Secteurs, Guide).
export function buildPages({ guideArticles, expertises, secteurs, content } = {}) {
  const basePages = BASE_PAGES.map(p => {
    const c = pageContent(p.slug, content);
    return { ...p, ...(c.title ? { title: c.title } : {}), ...(c.lead ? { lead: c.lead } : {}), ...(c.image ? { image: c.image } : {}) };
  });
  return [...basePages, ...(expertises || []), ...(secteurs || []), ...(guideArticles || [])];
}
