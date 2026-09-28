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
  { slug: 'entreprise', title: 'Entreprise', section: 'secteur', type: 'custom' },
  { slug: 'secteurs-dactivite', title: "Secteurs d'activité", section: 'secteur', type: 'secteur', isHub: true,
    lead: "Une expertise territoriale et sectorielle : nous adaptons notre accompagnement aux enjeux propres à chaque type de structure.",
    features: [] },
];

// Photo de couverture par page expertise/secteur (pool limité de photos réelles, réutilisées par thème).
export const PAGE_IMAGE = {
  'detections-des-opportunites': 'graphique-bourse.webp',
  'mobilisation-des-aides': 'remise-billets.webp',
  'montage-des-dossiers': 'conseil-client.jpg',
  'veille-personnalisee': 'banque-digitale-2.webp',
  'gestion-des-aides': 'coffre-fort.jpeg',
  'fundraising': 'handshake-contrat.webp',
  'fonds-de-dotation-mecenat-local': 'handshake-reunion.webp',
  'recherche-de-fondations': 'reserve-or.jpg',
  'nos-formations': 'agence-bancaire.jpg',
  'optimaides-subventions': 'banque-digitale.webp',
  'secteurs-dactivite': 'paris-eiffel.jpg',
  'collectivites-epci': 'banque-de-france.webp',
  'etablissements-de-sante-publics-non-lucratifs': 'conseil-client.jpg',
  'structures-medico-sociales': 'handshake-reunion.webp',
  'logement-social': 'paris-eiffel.jpg',
  'sdis-service-de-secours': 'coffre-fort.jpeg',
  'entreprise': 'carte-calculatrice.jpg',
  'immobilier': 'agence-bancaire.jpg',
  'entreprises-publiques-locales-epl': 'banque-de-france.webp',
  'acteurs-public-institutions': 'banque-digitale.webp',
  'secteur-public': 'reserve-or.jpg',
};

// Photos réutilisées pour les vignettes Guide (cycle, pool limité).
export const GUIDE_PHOTOS = ['paris-eiffel.jpg', 'handshake-contrat.webp', 'banque-de-france.webp', 'handshake-reunion.webp'];

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

// Filtre le menu Expertises (groupé, 2 niveaux) selon le champ `hidden` des
// pages expertise correspondantes. Un groupe sans enfant visible disparaît ;
// si seul le lien du déclencheur d'un groupe est masqué, le groupe devient
// un simple libellé (ses enfants visibles restent accessibles).
function filterExpertisesMenu(expertises) {
  const hidden = new Set((expertises || []).filter(e => e.hidden).map(e => e.slug));
  return EXPERTISES_MENU
    .map(item => {
      if (item.children) {
        const children = item.children.filter(c => !hidden.has(slugFromHref(c.href)));
        if (!children.length) return null;
        if (item.href && hidden.has(slugFromHref(item.href))) {
          return { label: item.label, children };
        }
        return { ...item, children };
      }
      if (item.href && hidden.has(slugFromHref(item.href))) return null;
      return item;
    })
    .filter(Boolean);
}

export function header(pages, base = '../') {
  const expertises = (pages || []).filter(x => x.section === 'expertise');
  const homeHref = base || './';
  return `<header class="site-header">
  <div class="container site-header__inner">
  <a class="brand brand--logo" href="${homeHref}"><img src="${base}images/logo-bpce.jpg" alt="BPCE Finances &amp; Territoires"></a>
  <button type="button" class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <nav class="main-nav">${navDropdown('Expertises et Solutions', filterExpertisesMenu(expertises), base)}
    <a href="${base}les-reussites-de-nos-clients/">Réussites</a>${navDropdown('Qui sommes-nous ?', QUI_SOMMES_NOUS_MENU, base)}
    <a class="btn-nav-cta btn-nav-cta--mobile" href="${base}contact/">Contactez-nous</a>
  </nav>
  <a class="btn-nav-cta" href="${base}contact/">Contactez-nous</a>
  </div>
</header>`;
}

const FOOTER_EXPERTISE_LINKS = [
  ['detections-des-opportunites', 'Détection'],
  ['mobilisation-des-aides', 'Mobilisation'],
  ['fonds-de-dotation-mecenat-local', 'Mécénat &amp; Fundraising'],
  ['nos-formations', 'Formations'],
  ['optimaides-subventions', 'Optim Aides &amp; Subventions'],
];

const FOOTER_SECTEUR_LINKS = [
  ['collectivites-epci', 'Collectivité &amp; EPCI'],
  ['etablissements-de-sante-publics-non-lucratifs', 'Santé non lucratif'],
  ['structures-medico-sociales', 'Médico-Social &amp; Social'],
  ['logement-social', 'Logement social'],
  ['sdis-service-de-secours', 'SDIS &amp; Secours'],
];

export function footer(pages, base = '../') {
  const hiddenSlugs = new Set((pages || []).filter(x => x.hidden).map(x => x.slug));
  const expertiseItems = FOOTER_EXPERTISE_LINKS.filter(([slug]) => !hiddenSlugs.has(slug));
  const secteurItems = FOOTER_SECTEUR_LINKS.filter(([slug]) => !hiddenSlugs.has(slug));
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
        ${expertiseItems.map(([slug, label]) => `<li><a href="${base}${slug}/">${label}</a></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Secteurs</h4>
      <ul>
        ${secteurItems.map(([slug, label]) => `<li><a href="${base}${slug}/">${label}</a></li>`).join('\n        ')}
      </ul>
    </div>
    <div class="footer-col">
      <h4>À propos</h4>
      <ul>
        <li><a href="${base}finances-et-territoires/">Finances &amp; Territoires</a></li>
        <li><a href="${base}les-reussites-de-nos-clients/">Réussites clients</a></li>
        <li><a href="${base}evenements/">Événements</a></li>
        <li><a href="${base}guide/">Guide pratique</a></li>
        <li><a href="${base}contact/">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">© 2020 BPCE Finances &amp; Territoires — Filiale du Groupe BPCE. Tous droits réservés.</div>
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

export function ctaBand() {
  return `
  <section>
    <div class="cta-band">
      <div>
        <h3>Vous souhaitez mieux comprendre les aides possibles pour votre projet ?</h3>
        <p>Contactez-nous pour un échange personnalisé sur vos besoins en financement.</p>
      </div>
      <a class="btn-cta-pill" href="../contact/">Contactez-nous →</a>
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

export function pageBanner(slug) {
  const img = PAGE_IMAGE[slug];
  if (!img) return '';
  return `
  <div class="page-banner"><img src="../images/${img}" alt="" loading="lazy" onerror="this.parentElement.remove()"></div>`;
}

export function renderExpertiseOrSecteur(p, pages) {
  return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(p.title)}</h1>
    <p class="lead">${escapeHtml(p.lead)}</p>
    <a class="btn btn--site btn-primary" href="../contact/">Contactez-nous →</a>
  </div>${pageBanner(p.slug)}
  ${featureList(p.features)}
</main>
${p.section === 'expertise' ? relatedGrid(p, pages, { excludeHub: true }) : ''}
${ctaBand()}`;
}

export function renderArticle(p) {
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
${ctaBand()}`;
}

export function renderGuideHub(articles) {
  return `<main class="container">
  <div class="page-hero">
    <h1>Guide</h1>
    <p class="lead">Comprendre, anticiper et agir face aux évolutions du financement.</p>
  </div>
  <div class="cards-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom:64px;">
    ${articles.map((a, i) => `<article class="feature-card feature-card--guide">
      <div class="feature-card__banner"><img src="../images/${GUIDE_PHOTOS[i % GUIDE_PHOTOS.length]}" alt="" loading="lazy" onerror="this.remove()"></div>
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

export function renderEvenements(events) {
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
    <strong>Aucun événement programmé pour le moment</strong>
    Revenez bientôt ou <a href="../contact/" style="color:var(--purple-700);">contactez-nous</a> pour être informé des prochaines dates.
  </div>`;
  return `<main class="container">
  <div class="page-hero">
    <h1>Événements</h1>
    <p class="lead">Webinaires, rencontres et temps forts autour du financement des projets territoriaux.</p>
  </div>
  ${body}
</main>`;
}

export function renderCustom(p, pages, events) {
  switch (p.slug) {
    case 'entreprise':
      return `<main class="container">
  <div class="page-hero">
    <span class="page-hero__eyebrow">Engagées pour un territoire durable</span>
    <h1>Activez des leviers de financement et de partenariat pour vos projets à impact</h1>
    <p class="lead">Qu'il s'agisse de PME, d'ETI ou de grandes entreprises, de plus en plus d'acteurs économiques s'engagent sur leur territoire : transition écologique, innovation sociale, revitalisation des centres-bourgs, mécénat ou développement de projets collaboratifs. Ces initiatives peuvent bénéficier de financements publics, de soutiens privés, ou s'inscrire dans des partenariats stratégiques avec les collectivités.</p>
    <a class="btn btn--site btn-primary" href="../contact/">Contactez-nous →</a>
  </div>${pageBanner(p.slug)}

  <div class="article-body" style="max-width:none;">
    <h2>Vos enjeux</h2>
    <ul class="content-list">
      <li>Identifier les aides et dispositifs mobilisables pour vos projets à visée sociale ou environnementale</li>
      <li>Structurer des collaborations efficaces avec le secteur public</li>
      <li>Valoriser votre impact RSE et territorial auprès de vos parties prenantes</li>
    </ul>

    <h2>Ce que nous vous proposons</h2>
    <div class="content-block">
      <h3>Identification des dispositifs publics et privés adaptés</h3>
      <p>Nous analysons vos projets pour repérer les aides disponibles : subventions à l'innovation ou à la transition énergétique, dispositifs territoriaux, soutien à l'investissement, mécénat, fonds européens…</p>
    </div>
    <div class="content-block">
      <h3>Structuration de projets en co-développement avec le public</h3>
      <p>Nous vous accompagnons dans la construction de projets conjoints avec les collectivités (bailleurs sociaux, EPL, établissements de santé…), en intégrant les enjeux réglementaires, financiers et opérationnels.</p>
    </div>
    <div class="content-block">
      <h3>Déploiement de démarches RSE territorialisées</h3>
      <p>Nous vous aidons à traduire vos engagements RSE en projets concrets et visibles, à identifier les bons leviers de financement, et à communiquer efficacement votre impact auprès de vos partenaires institutionnels, clients ou investisseurs.</p>
    </div>
    <div class="content-block">
      <h3>Mobilisation du mécénat et des clubs d'entreprises</h3>
      <p>Nous accompagnons les entreprises désireuses de s'impliquer localement dans des initiatives d'intérêt général : constitution de clubs de mécènes, mécénat de compétence ou en nature, partenariats avec des structures non lucratives locales.</p>
    </div>

    <h2>Ce que vous y gagnez</h2>
    <ul class="content-list">
      <li>Une stratégie claire pour accéder à des aides souvent méconnues</li>
      <li>Des projets structurés en cohérence avec vos valeurs et votre stratégie RSE</li>
      <li>Une reconnaissance accrue auprès des acteurs publics et de vos partenaires économiques</li>
    </ul>
  </div>
</main>
<section>
  <div class="cta-band">
    <div>
      <h3>Vous développez un projet stratégique à fort impact territorial ?</h3>
      <p>Contactez-nous pour concevoir une solution de financement alignée sur vos ambitions économiques et sociales.</p>
    </div>
    <a class="btn-cta-pill" href="../contact/">Contactez-nous →</a>
  </div>
</section>`;

    case 'finances-et-territoires':
      return `<main class="container">
  <div class="page-hero">
    <h1>Qui sommes-nous ?</h1>
    <p class="lead">Finances &amp; Territoires est une filiale du Groupe BPCE, experte du financement public et privé des projets d'investissement des territoires depuis 20 ans.</p>
  </div>

  <div class="stats-row" style="margin-top:40px; margin-bottom:56px;">
    <div><div class="stat-value">1,2 Md€</div><div class="stat-label">mobilisés pour nos clients</div></div>
    <div><div class="stat-value">18 600</div><div class="stat-label">dispositifs référencés</div></div>
    <div><div class="stat-value">20 ans</div><div class="stat-label">d'expertise territoriale</div></div>
  </div>

  <div class="feature-list">
    <div class="feature-list__item">
      <span class="feature-list__bullet">1</span>
      <h3>Engagement humain</h3>
      <p>Un accompagnement sur mesure avec un consultant dédié, à l'écoute de vos besoins.</p>
    </div>
    <div class="feature-list__item">
      <span class="feature-list__bullet">2</span>
      <h3>Impact et résultats</h3>
      <p>La concrétisation de vos projets dans une approche responsable et durable.</p>
    </div>
    <div class="feature-list__item">
      <span class="feature-list__bullet">3</span>
      <h3>Excellence et fiabilité</h3>
      <p>Une veille rigoureuse et une méthodologie éprouvée, au service de la qualité.</p>
    </div>
  </div>
</main>
${ctaBand()}`;

    case 'les-reussites-de-nos-clients':
      return `<div class="hero-photo-banner">
  <img src="../images/handshake-reunion.webp" alt="" loading="lazy" onerror="this.parentElement.remove()">
  <div class="hero-photo-banner__content container">
    <h1>Les réussites de nos clients</h1>
    <a class="btn btn--site btn-primary" href="../les-reussites-de-nos-clients/">En savoir plus →</a>
  </div>
</div>
<main class="container">
  <div class="page-hero">
    <p class="lead">Collectivités, associations et entreprises que nous accompagnons dans la sécurisation de leurs financements.</p>
  </div>

  <div class="testimonial-band" style="border-radius:16px; margin-bottom:56px;">
    <div class="testimonial-inner" style="padding:0 32px;">
      <span class="testimonial-quote-mark">"</span>
      <div class="testimonial-card">
        <span class="meta">Témoignages</span>
        <blockquote>« Votre expertise et votre engagement ont été déterminants dans l'obtention des subventions accordées par l'Agence de l'eau et le Fonds Vert pour le réaménagement du parc Charles-de-Gaulle et de la Place Michelet. »</blockquote>
        <cite>Julien Chambon — Maire</cite>
      </div>
    </div>
    <div class="testimonial-footnote" style="padding-left:114px;">Commune de Ricailles · 33 617 habitants (Insee 2022)</div>
  </div>

  <div class="stats-row" style="margin-bottom:56px;">
    <div><div class="stat-value">18 600</div><div class="stat-label">aides pour nos clients</div></div>
    <div><div class="stat-value">10 000</div><div class="stat-label">aides publiques</div></div>
    <div><div class="stat-value">8 600</div><div class="stat-label">aides privées</div></div>
  </div>
</main>
${ctaBand()}`;

    case 'contact':
      return `<main class="container">
  <div class="page-hero">
    <h1>Contact</h1>
    <p class="lead">Un projet à financer ? Parlons-en. Décrivez-nous votre besoin, un consultant vous recontacte pour un premier échange.</p>
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
        window.location.href = 'mailto:A-REMPLACER@exemple.fr?subject=' +
          encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      });
    </script>
    <div class="contact-info">
      <h3>Finances &amp; Territoires</h3>
      <p>Filiale du Groupe BPCE, nous accompagnons les collectivités, associations et entreprises dans la sécurisation de leurs financements depuis 20 ans.</p>
      <p>Retrouvez également nos solutions dans le menu « Expertises et Solutions », ou explorez le <a href="../guide/" style="color:#fff;">Guide</a> pour en savoir plus sur les dispositifs de financement.</p>
    </div>
  </div>
</main>`;

    case 'guide':
      return renderGuideHub(pages.filter(x => x.section === 'guide'));

    case 'evenements':
      return renderEvenements(events);

    default:
      return `<main class="container"><div class="page-placeholder">Contenu de la page « ${p.title} » à intégrer.</div></main>`;
  }
}

export function render(p, pages, events) {
  if (p.type === 'expertise' || p.type === 'secteur') return renderExpertiseOrSecteur(p, pages);
  if (p.type === 'article') return renderArticle(p);
  return renderCustom(p, pages, events);
}

export function page(p, pages, events) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(p.title)} — Finances &amp; Territoires</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles/site.css">
</head>
<body>

${header(pages)}

${breadcrumb(p)}

${render(p, pages, events)}

${footer(pages)}

<script src="../nav.js" defer></script>
</body>
</html>
`;
}

// --- Page d'accueil ---
// Comme les autres pages, la maquette elle-même reste statique (elle a été
// dessinée en dur, pas générée à partir d'un pool de contenu) — seuls les
// trois champs de la section hero (titre, texte, bouton) sont éditables
// depuis l'admin, échappés comme tout contenu venant de la saisie libre.

export function renderHomepage(homepage, pages) {
  const heroTitle = escapeHtml(homepage?.heroTitle || '');
  const heroLead = escapeHtml(homepage?.heroLead || '');
  const ctaLabel = escapeHtml(homepage?.ctaLabel || '');
  return `<main>

  <div class="hero-band">
  <div class="container">
  <section class="hero">
    <div class="hero-card">
      <span class="hero-card__mark"></span>
      <h1>${heroTitle}</h1>
      <p>${heroLead}</p>
      <div>
        <div class="hero-stat__value">1,2 Md€</div>
        <div class="hero-stat__label">mobilisés pour nos clients</div>
      </div>
      <a class="btn btn--site btn-primary" href="finances-et-territoires/">${ctaLabel}</a>
    </div>
    <div class="photo-grid">
      <div class="photo-tile photo-tile--big"><img src="images/banque-de-france.webp" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--tr1"><img src="images/reserve-or.jpg" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--tr2"><img src="images/conseil-client.jpg" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--bl"><img src="images/agence-bancaire.jpg" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="photo-tile photo-tile--br"><img src="images/paris-eiffel.jpg" alt="" loading="lazy" onerror="this.remove()"></div>
      <img class="photo-grid__avatar" src="images/handshake-contrat.webp" alt="" loading="lazy" onerror="this.remove()">
    </div>
  </section>
  </div>
  </div>

  <section class="client-types-section">
    <div class="container">
    <div class="client-types">
    <a class="client-type" href="entreprise/"><span class="client-type__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg></span>Entreprise</a>
    <a class="client-type" href="collectivites-epci/"><span class="client-type__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5H3l9-5z"/><path d="M4 10h16"/><path d="M6 10v9M10 10v9M14 10v9M18 10v9"/><path d="M3 21h18"/></svg></span>Collectivité &amp; EPCI</a>
    <a class="client-type" href="etablissements-de-sante-publics-non-lucratifs/"><span class="client-type__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg></span>Santé non lucratif</a>
    <a class="client-type" href="structures-medico-sociales/"><span class="client-type__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.35-9.33-8.94C1.4 8.94 2.9 5.5 6.2 5.02 8.4 4.7 10.6 5.9 12 7.8c1.4-1.9 3.6-3.1 5.8-2.78 3.3.48 4.8 3.92 3.53 7.04C19 16.65 12 21 12 21z"/></svg></span>Médico-social</a>
    <a class="client-type" href="entreprises-publiques-locales-epl/"><span class="client-type__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/><path d="M4 21h16"/></svg></span>Établ. Public Local</a>
    <a class="client-type" href="logement-social/"><span class="client-type__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/></svg></span>Logement social</a>
    <a class="client-type" href="sdis-service-de-secours/"><span class="client-type__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s-5 5.5-5 10a5 5 0 0 0 10 0c0-2-1-3.5-2-4.5.3 1.5-.5 2.5-1.5 2.5-1.2 0-1.8-1-1.5-2.5A7 7 0 0 1 12 3z"/></svg></span>SDIS</a>
    </div>
    </div>
  </section>

  <div class="container">
  <section id="expertises">
    <div class="section-intro">
      <h2 class="section-title">L'ingénierie financière pour mener à bien vos projets</h2>
      <p class="section-intro__text">BPCE Finances &amp; Territoires vous accompagne dans <strong>l'identification</strong> et la <strong>mobilisation</strong> sécurisée des financements nécessaires à la réussite de vos projets, en alliant expertise, stratégie et efficacité opérationnelle. Dans un contexte où les <strong>financements publics et privés non-bancaires</strong> évoluent rapidement, il est essentiel de pouvoir compter sur un partenaire :</p>
    </div>
    <div class="cards-grid">
      <article class="icon-card">
        <span class="icon-card__badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg></span>
        <h3>Expertise</h3>
        <p>Des consultants alliant expertise territoriale et sectorielle, rompus à l'exercice de recherche de financement qui capitalisent sur des centaines de dossiers de demande montés.</p>
      </article>
      <article class="icon-card">
        <span class="icon-card__badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3h-4l-.3 2.4a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.97 7.97 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1L9 21h4l.3-2.4a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6z"/></svg></span>
        <h3>Adaptation</h3>
        <p>Une approche sur mesure, adaptée à vos besoins et enjeux.</p>
      </article>
      <article class="icon-card">
        <span class="icon-card__badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12.5l2 2 4-4.5"/></svg></span>
        <h3>Sécurisation</h3>
        <p>20 ans d'expertise dans la mobilisation de financements pour des projets à vocation publique, privée et associative. Un accompagnement complet, de la veille au suivi des financements obtenus.</p>
      </article>
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
            <blockquote>« Votre expertise et votre engagement ont été déterminants dans l'obtention des subventions accordées par l'Agence de l'eau et le Fonds Vert pour le réaménagement du parc Charles-de-Gaulle et de la Place Michelet. »</blockquote>
            <cite>Julien Chambon — Maire</cite>
          </div>
        </div>
        <div class="testimonial-footnote">Commune de Ricailles · 33 617 habitants (Insee 2022)</div>
      </div>
    </div>
  </section>

  <div class="container">
  <section>
    <h2 class="section-title">Baromètre des aides &amp; subventions</h2>
    <div class="stats-row">
      <div><div class="stat-value">18 600</div><div class="stat-label">aides pour nos clients</div></div>
      <div><div class="stat-value">10 000</div><div class="stat-label">aides publiques</div></div>
      <div><div class="stat-value">8 600</div><div class="stat-label">aides privées</div></div>
    </div>
    <p class="stats-caption">Notre base référence plus de 18 600 dispositifs en métropole et DROM-COM, suivis par 20 experts.</p>
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
    <h2 class="section-title">Valeurs et engagements</h2>
    <div class="values-grid">
      <div class="value-item">
        <span class="value-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="16" cy="9" r="2.6"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M14 20c.3-2.3 2-4 4.5-4"/></svg></span>
        <h3>Engagement humain</h3>
        <p>Un accompagnement sur mesure avec un consultant dédié, à l'écoute de vos besoins.</p>
      </div>
      <div class="value-item">
        <span class="value-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg></span>
        <h3>Impact et résultats</h3>
        <p>La concrétisation de vos projets dans une approche responsable et durable.</p>
      </div>
      <div class="value-item">
        <span class="value-item__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12.5l2 2 4-4.5"/></svg></span>
        <h3>Excellence et fiabilité</h3>
        <p>Une veille rigoureuse et une méthodologie éprouvée, au service de la qualité.</p>
      </div>
    </div>
  </section>
  </div>

  <section class="section--muted">
    <div class="container">
    <h2 class="section-title">Partenaires</h2>
    <div class="partners-row">
      <img class="partner-logo" src="images/grant-thornton.png" alt="Grant Thornton" loading="lazy">
      <img class="partner-logo" src="images/ecofinance-groupe.png" alt="Eco Finance Groupe" loading="lazy">
      <img class="partner-logo" src="images/andsis.png" alt="ANDSIS" loading="lazy">
    </div>
    </div>
  </section>

  <section id="contact">
    <div class="cta-band">
      <div>
        <h3>Vous souhaitez mieux comprendre les aides possibles pour votre projet ?</h3>
        <p>Contactez-nous pour un échange personnalisé sur vos besoins en financement.</p>
      </div>
      <a class="btn-cta-pill" href="contact/">Contactez-nous →</a>
    </div>
  </section>

  <div class="container">
  <section>
    <h2 class="section-title">FAQ</h2>
    <div class="faq-grid">
      <div class="faq-item">Qu'est-ce que le financement public ?<span>›</span></div>
      <div class="faq-item">Quelle est votre couverture géographique ?<span>›</span></div>
      <div class="faq-item">Qu'entend-on par financement non bancaire ?<span>›</span></div>
      <div class="faq-item">Comment se déroule le montage des dossiers ?<span>›</span></div>
      <div class="faq-item">Comment fonctionne Optim Aides &amp; Subventions ?<span>›</span></div>
      <div class="faq-item">Qu'est-ce qu'un outil SaaS ?<span>›</span></div>
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
          ${slide.map((a, i) => `<article class="feature-card feature-card--guide">
            <div class="feature-card__banner">
              <img src="images/${GUIDE_PHOTOS[(si * 3 + i) % GUIDE_PHOTOS.length]}" alt="" loading="lazy" onerror="this.remove()">
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

export function homepagePage(homepage, pages) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Finances &amp; Territoires — ${escapeHtml(homepage?.heroTitle || '')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles/site.css">
</head>
<body>

${header(pages, '')}

${renderHomepage(homepage, pages)}

${footer(pages, '')}
<script src="nav.js" defer></script>
<script src="guide-carousel.js" defer></script>
</body>
</html>
`;
}

// Assemble la liste complète des pages à partir du socle statique protégé +
// des trois contenus éditables depuis l'admin (Expertises, Secteurs, Guide).
export function buildPages({ guideArticles, expertises, secteurs } = {}) {
  return [...BASE_PAGES, ...(expertises || []), ...(secteurs || []), ...(guideArticles || [])];
}
