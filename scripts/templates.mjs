// Gabarits du site — module pur, sans dépendance Node (fs/path).
// Importable tel quel depuis generate-pages.mjs (build statique) ET depuis
// l'admin dans le navigateur (régénération à la publication), pour éviter
// toute divergence entre les deux.

export const SECTIONS = {
  main:      { label: null },
  expertise: { label: 'Expertises et Solutions' },
  secteur:   { label: "Secteurs d'activité", hub: '../secteurs-dactivite/' },
  guide:     { label: 'Guide', hub: '../guide/' },
};

// --- Pages statiques (principales, expertises, secteurs) ---
// Les articles Guide et les Événements sont gérés séparément (voir buildPages)
// car ce sont les deux contenus édités depuis l'admin.

export const BASE_PAGES = [
  // === Pages principales (rendu sur mesure, voir renderCustom) ===
  { slug: 'finances-et-territoires', title: 'Qui sommes-nous ?', section: 'main', type: 'custom' },
  { slug: 'les-reussites-de-nos-clients', title: 'Les réussites de nos clients', section: 'main', type: 'custom' },
  { slug: 'contact', title: 'Contact', section: 'main', type: 'custom' },
  { slug: 'guide', title: 'Guide', section: 'main', type: 'custom' },
  { slug: 'evenements', title: 'Événements', section: 'main', type: 'custom' },

  // === Expertises et solutions ===
  { slug: 'detections-des-opportunites', title: 'Détection des opportunités', section: 'expertise', type: 'expertise',
    lead: "Nous identifions, en amont de vos projets, les dispositifs de financement — publics et privés — auxquels vous êtes éligible, pour ne laisser aucune opportunité de côté.",
    features: [
      { title: 'Veille active', text: 'Suivi de plus de 18 600 dispositifs (aides, subventions, appels à projets) en métropole et DROM-COM.' },
      { title: "Analyse d'éligibilité", text: 'Croisement avec votre projet, votre secteur et votre territoire pour ne cibler que le pertinent.' },
      { title: 'Alertes ciblées', text: "Notification dès l'ouverture d'un dispositif correspondant à votre structure." },
    ] },
  { slug: 'mobilisation-des-aides', title: 'Mobilisation des aides', section: 'expertise', type: 'expertise',
    lead: "Une fois les dispositifs identifiés, nous vous accompagnons pour les mobiliser efficacement et sécuriser leur obtention.",
    features: [
      { title: 'Dépôt des dossiers', text: 'Constitution et dépôt des demandes dans le respect des exigences de chaque financeur.' },
      { title: 'Coordination', text: 'Interface avec les financeurs : État, Europe, collectivités, fondations.' },
      { title: 'Suivi jusqu’au versement', text: "Suivi administratif jusqu'au versement effectif des fonds." },
    ] },
  { slug: 'montage-des-dossiers', title: 'Montage des dossiers', section: 'expertise', type: 'expertise',
    lead: "De la définition du plan de financement au dépôt final, nous prenons en charge le montage technique et administratif de vos dossiers.",
    features: [
      { title: 'Cadrage du projet', text: 'Construction du plan de financement adapté à votre projet.' },
      { title: 'Rédaction des dossiers', text: 'Conformité avec les attentes de chaque financeur sollicité.' },
      { title: 'Interface avec vos équipes', text: 'Coordination fluide à chaque étape du montage.' },
    ] },
  { slug: 'veille-personnalisee', title: 'Veille personnalisée', section: 'expertise', type: 'expertise',
    lead: "Recevez uniquement les opportunités de financement qui correspondent réellement à vos projets et à votre secteur.",
    features: [
      { title: 'Profil sur mesure', text: 'Veille configurée selon vos priorités et votre territoire.' },
      { title: 'Notifications ciblées', text: "Alerte dès la publication d'un appel à projets pertinent." },
      { title: 'Veille réglementaire', text: 'Suivi des évolutions impactant vos financements.' },
    ] },
  { slug: 'gestion-des-aides', title: 'Gestion des aides', section: 'expertise', type: 'expertise',
    lead: "Après l'obtention d'un financement, nous vous aidons à en piloter le suivi jusqu'au solde final, pour sécuriser son versement.",
    features: [
      { title: 'Suivi des échéances', text: 'Justificatifs et conditions de versement suivis pas à pas.' },
      { title: 'Reporting financeurs', text: 'Gestion du reporting exigé par chaque dispositif.' },
      { title: 'Réduction du risque', text: 'Moins de risque de reversement ou de perte de la subvention.' },
    ] },
  { slug: 'fundraising', title: 'Fundraising', section: 'expertise', type: 'expertise',
    lead: "Nous vous aidons à diversifier vos sources de financement en mobilisant le mécénat et les partenariats privés.",
    features: [
      { title: 'Stratégie de collecte', text: 'Structuration adaptée à votre projet et à votre territoire.' },
      { title: 'Approche des mécènes', text: 'Identification et sollicitation des entreprises partenaires.' },
      { title: 'Mise en œuvre', text: 'Accompagnement de vos campagnes de collecte.' },
    ] },
  { slug: 'fonds-de-dotation-mecenat-local', title: 'Fonds de dotation & mécénat local', section: 'expertise', type: 'expertise',
    lead: "Nous vous accompagnons dans la création ou la relance d'un fonds de dotation pour mobiliser durablement le mécénat local.",
    features: [
      { title: "Étude d'opportunité", text: 'Cadrage juridique et statutaire du fonds de dotation.' },
      { title: 'Gouvernance', text: 'Mise en œuvre des statuts et de la gouvernance.' },
      { title: 'Club de mécènes', text: 'Mobilisation des entreprises du territoire.' },
    ] },
  { slug: 'recherche-de-fondations', title: 'Recherche de fondations', section: 'expertise', type: 'expertise',
    lead: "Nous identifions les fondations privées susceptibles de soutenir votre projet et vous accompagnons dans leur sollicitation.",
    features: [
      { title: 'Cartographie', text: 'Fondations alignées avec votre thématique et votre territoire.' },
      { title: 'Dossiers dédiés', text: 'Rédaction adaptée à chaque fondation sollicitée.' },
      { title: 'Relation durable', text: 'Mise en relation et suivi dans la durée.' },
    ] },
  { slug: 'nos-formations', title: 'Nos formations', section: 'expertise', type: 'expertise',
    lead: "Nous formons vos équipes aux méthodes et outils du financement de projets, pour gagner en autonomie.",
    features: [
      { title: 'Modules pratiques', text: 'Recherche de financements, montage de dossiers, gestion des aides.' },
      { title: 'Formats adaptés', text: 'Présentiel, distanciel ou sur mesure selon vos besoins.' },
      { title: '20 ans de pratique', text: 'Intervenants issus du financement territorial.' },
    ] },
  { slug: 'optimaides-subventions', title: 'Optim Aides & Subventions', section: 'expertise', type: 'expertise',
    lead: "Notre outil SaaS pour piloter en autonomie la détection et le suivi de vos aides et subventions.",
    features: [
      { title: 'Base de dispositifs', text: 'Plus de 18 600 dispositifs, mise à jour en continu.' },
      { title: 'Tableau de bord', text: 'Suivi des dossiers en cours, versés et des échéances à venir.' },
      { title: 'Alertes personnalisées', text: 'Selon votre secteur et votre territoire.' },
    ] },

  // === Secteurs d'activité ===
  { slug: 'secteurs-dactivite', title: "Secteurs d'activité", section: 'secteur', type: 'secteur', isHub: true,
    lead: "Une expertise territoriale et sectorielle : nous adaptons notre accompagnement aux enjeux propres à chaque type de structure.",
    features: [] },
  { slug: 'collectivites-epci', title: 'Collectivité & EPCI', section: 'secteur', type: 'secteur',
    lead: "Communes, intercommunalités, départements, régions : nous sécurisons le financement de vos projets d'investissement et de transition.",
    features: [
      { title: 'Transition écologique', text: "Rénovation énergétique et projets d'aménagement durable." },
      { title: 'Équipements publics', text: "Aménagement urbain et équipements de proximité." },
      { title: 'Financements croisés', text: 'Europe, État, région : construction de plans de financement multi-partenaires.' },
    ] },
  { slug: 'etablissements-de-sante-publics-non-lucratifs', title: 'Santé non lucratif', section: 'secteur', type: 'secteur',
    lead: "Établissements de santé à but non lucratif : nous vous aidons à financer vos projets d'investissement et de modernisation.",
    features: [
      { title: 'Modernisation', text: 'Équipements et infrastructures de soin.' },
      { title: 'Financements dédiés', text: "Agence régionale de santé (ARS) et fonds spécialisés." },
      { title: 'Mécénat santé', text: 'Fondations et mécènes sensibles aux enjeux de santé.' },
    ] },
  { slug: 'structures-medico-sociales', title: 'Médico-social & Social', section: 'secteur', type: 'secteur',
    lead: "EHPAD, établissements médico-sociaux, structures sociales : nous mobilisons les financements adaptés à vos projets.",
    features: [
      { title: 'Autonomie et grand âge', text: 'Dispositifs dédiés au vieillissement et au handicap.' },
      { title: 'Mise aux normes', text: 'Rénovation et mise en conformité des établissements.' },
      { title: 'Financeurs sociaux', text: 'Conseils départementaux et ARS.' },
    ] },
  { slug: 'logement-social', title: 'Logement social', section: 'secteur', type: 'secteur',
    lead: "Bailleurs sociaux : nous vous accompagnons dans le financement de vos opérations de construction et de rénovation.",
    features: [
      { title: 'Rénovation énergétique', text: 'Financement de la rénovation du parc social.' },
      { title: 'Action Logement', text: 'Éco-prêts et dispositifs dédiés au logement social.' },
      { title: 'Plans multi-partenaires', text: 'Montage de plans de financement combinant plusieurs financeurs.' },
    ] },
  { slug: 'sdis-service-de-secours', title: 'SDIS & Service de secours', section: 'secteur', type: 'secteur',
    lead: "Services départementaux d'incendie et de secours : nous identifions les financements adaptés à vos équipements et infrastructures.",
    features: [
      { title: 'Casernes et équipements', text: 'Financement des infrastructures opérationnelles.' },
      { title: 'Sécurité civile', text: 'Fonds dédiés à la sécurité civile.' },
      { title: 'Montage de dossiers', text: 'Auprès des financeurs publics compétents.' },
    ] },
  { slug: 'entreprise', title: 'Entreprise', section: 'secteur', type: 'custom' },
  { slug: 'immobilier', title: 'Immobilier', section: 'secteur', type: 'secteur',
    lead: "Promoteurs et opérateurs immobiliers : nous identifions les aides mobilisables sur vos opérations.",
    features: [
      { title: 'Rénovation énergétique', text: "Financement de la performance énergétique des bâtiments." },
      { title: 'Aides à la construction', text: "Dispositifs d'aménagement et de construction." },
      { title: 'Partenaires dédiés', text: 'Collectivités et ANAH.' },
    ] },
  { slug: 'entreprises-publiques-locales-epl', title: 'Entreprises publiques locales (EPL)', section: 'secteur', type: 'secteur',
    lead: "SEM, SPL, SEMOP : nous accompagnons les entreprises publiques locales dans le financement de leurs projets d'intérêt général.",
    features: [
      { title: 'Financements adaptés', text: 'Dispositifs non bancaires adaptés au statut EPL.' },
      { title: 'Partenaires publics et privés', text: 'Montage de dossiers auprès de financeurs mixtes.' },
      { title: 'Plans pluriannuels', text: 'Sécurisation des plans de financement dans la durée.' },
    ] },
  { slug: 'acteurs-public-institutions', title: 'Acteurs publics & institutions', section: 'secteur', type: 'secteur',
    lead: "Établissements publics et institutions : nous vous aidons à mobiliser les financements adaptés à vos missions.",
    features: [
      { title: 'Dispositifs dédiés', text: 'Identification des aides propres au secteur public.' },
      { title: 'Montage et suivi', text: 'Accompagnement de bout en bout des dossiers.' },
      { title: 'Veille réglementaire', text: "Suivi des appels à projets et de leurs évolutions." },
    ] },
  { slug: 'secteur-public', title: 'Secteur public', section: 'secteur', type: 'secteur',
    lead: "Une expertise transverse au service de l'ensemble des acteurs du secteur public, de la collectivité à l'établissement public.",
    features: [
      { title: 'Vision transverse', text: 'Collectivités, EPCI et établissements publics.' },
      { title: 'Ingénierie financière', text: 'Adaptée aux règles de la commande publique.' },
      { title: '20 ans d’expérience', text: 'Une pratique éprouvée du financement territorial.' },
    ] },
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
        ? `<a href="${base}${item.href}">${item.label}</a>`
        : `<span class="nav-menu-item__text">${item.label}</span>`;
      return `<div class="nav-menu-item">
          <span class="nav-menu-item__label">${labelInner}<button type="button" class="nav-menu-item__arrow" aria-label="Afficher le sous-menu">›</button></span>
          <div class="nav-submenu">
            ${item.children.map(c => `<a href="${base}${c.href}">${c.label}</a>`).join('\n            ')}
          </div>
        </div>`;
    }
    return `<a href="${base}${item.href}" class="nav-menu-item__leaf">${item.label}</a>`;
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

export function header() {
  return `<header class="site-header">
  <div class="container site-header__inner">
  <a class="brand brand--logo" href="../"><img src="../images/logo-bpce.jpg" alt="BPCE Finances &amp; Territoires"></a>
  <button type="button" class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <nav class="main-nav">${navDropdown('Expertises et Solutions', EXPERTISES_MENU, '../')}
    <a href="../les-reussites-de-nos-clients/">Réussites</a>${navDropdown('Qui sommes-nous ?', QUI_SOMMES_NOUS_MENU, '../')}
    <a class="btn-nav-cta btn-nav-cta--mobile" href="../contact/">Contactez-nous</a>
  </nav>
  <a class="btn-nav-cta" href="../contact/">Contactez-nous</a>
  </div>
</header>`;
}

export function footer() {
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
        <li><a href="../detections-des-opportunites/">Détection</a></li>
        <li><a href="../mobilisation-des-aides/">Mobilisation</a></li>
        <li><a href="../fonds-de-dotation-mecenat-local/">Mécénat &amp; Fundraising</a></li>
        <li><a href="../nos-formations/">Formations</a></li>
        <li><a href="../optimaides-subventions/">Optim Aides &amp; Subventions</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Secteurs</h4>
      <ul>
        <li><a href="../collectivites-epci/">Collectivité &amp; EPCI</a></li>
        <li><a href="../etablissements-de-sante-publics-non-lucratifs/">Santé non lucratif</a></li>
        <li><a href="../structures-medico-sociales/">Médico-Social &amp; Social</a></li>
        <li><a href="../logement-social/">Logement social</a></li>
        <li><a href="../sdis-service-de-secours/">SDIS &amp; Secours</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>À propos</h4>
      <ul>
        <li><a href="../finances-et-territoires/">Finances &amp; Territoires</a></li>
        <li><a href="../les-reussites-de-nos-clients/">Réussites clients</a></li>
        <li><a href="../evenements/">Événements</a></li>
        <li><a href="../guide/">Guide pratique</a></li>
        <li><a href="../contact/">Contact</a></li>
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
  parts.push(`<span class="current">${p.title}</span>`);
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
      <h3>${f.title}</h3>
      <p>${f.text}</p>
    </div>`).join('\n    ')}
  </div>`;
}

export function relatedGrid(p, pages, { excludeHub = false } = {}) {
  let siblings = pages.filter(x => x.section === p.section && x.slug !== p.slug);
  if (excludeHub) siblings = siblings.filter(x => !x.isHub);
  if (!siblings.length) return '';
  return `
  <div class="container">
    <h2 class="section-title" style="text-align:left;">${SECTIONS[p.section].label}</h2>
    <div class="related-grid">
      ${siblings.map(x => `<a class="related-card" href="../${x.slug}/">${x.title}</a>`).join('\n      ')}
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
    <h1>${p.title}</h1>
    <p class="lead">${p.lead}</p>
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
    <h1>${p.title}</h1>
    <p class="lead">${p.intro}</p>
  </div>
  <div class="article-body">
    ${p.body.map(([h, text]) => `<h2>${h}</h2>\n    <p>${text}</p>`).join('\n    ')}
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
        <h3><a href="../${a.slug}/" style="color:inherit;text-decoration:none;">${a.title}</a></h3>
        <p>${a.intro}</p>
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
      <div class="event-item__date">${formatEventDate(e.date)}</div>
      <h3>${e.title}</h3>
      <p>${e.description || ''}</p>
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
<title>${p.title} — Finances &amp; Territoires</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles/site.css">
</head>
<body>

${header()}

${breadcrumb(p)}

${render(p, pages, events)}

${footer()}

<script src="../nav.js" defer></script>
</body>
</html>
`;
}

// Assemble la liste complète des pages à partir du socle statique + des
// articles Guide (dynamiques, éditables depuis l'admin).
export function buildPages(guideArticles) {
  return [...BASE_PAGES, ...(guideArticles || [])];
}
