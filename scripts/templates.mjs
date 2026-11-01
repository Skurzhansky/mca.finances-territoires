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

// Texte éditable avec mise en forme légère : tout est échappé, puis seuls
// **gras**, *italique*, les liens [libellé](url) et les retours à la ligne
// sont convertis en HTML. Les URL relatives sont résolues depuis `base`
// (racine du site depuis la page courante).
export function richText(str, base = '../') {
  return escapeHtml(str)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const url = /^(https?:|mailto:|tel:|#|\/)/.test(href) ? href : `${base}${href}`;
      return `<a href="${url}">${label}</a>`;
    })
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)([^*\n]*[^*\s])\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/\r?\n/g, '<br>');
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
  { label: 'Détection des opportunités', href: 'detections-des-opportunites/', children: [
    { label: 'Veille continue', href: 'veille-personnalisee/' },
    { label: "Note d'opportunité", href: 'optimaides-subventions/' },
  ] },
  { label: 'Mobilisation des aides', href: 'mobilisation-des-aides/', children: [
    { label: 'Montage des dossiers', href: 'montage-des-dossiers/' },
  ] },
  { label: 'Pilotage des aides', href: 'gestion-des-aides/', children: [
    { label: 'Gestion des aides obtenues', href: 'gestion-des-aides/' },
  ] },
  { label: 'Fonds privés / Mécénat', href: 'fonds-de-dotation-mecenat-local/', children: [
    { label: 'Fonds de dotation & Mécénat local', href: 'fonds-de-dotation-mecenat-local/' },
    { label: 'Recherche de mécènes', href: 'fundraising/' },
    { label: 'AAP de fondations', href: 'recherche-de-fondations/' },
  ] },
  { label: 'Formations', href: 'nos-formations/' },
];

export const QUI_SOMMES_NOUS_MENU = [
  { label: 'BPCE Finances & Territoires', href: 'finances-et-territoires/' },
  { label: 'Profil de nos clients', href: 'secteurs-dactivite/', children: [
    { label: 'Collectivité & EPCI', href: 'collectivites-epci/' },
    { label: 'Santé (non lucratif)', href: 'etablissements-de-sante-publics-non-lucratifs/' },
    { label: 'Médico-Social & Social', href: 'structures-medico-sociales/' },
    { label: 'Entreprise Publique Locale', href: 'entreprises-publiques-locales-epl/' },
    { label: 'Bailleurs sociaux', href: 'logement-social/' },
    { label: 'SDIS & Service de secours', href: 'sdis-service-de-secours/' },
    { label: 'Entreprise privée', href: 'entreprise/' },
  ] },
  { label: 'Événements', href: 'evenements/' },
  { label: 'Guide', href: 'guide/' },
];

// Rangée « picto cibles » sous le bandeau d'accueil : ordre et libellés de la
// maquette ; l'icône est fixée par slug (CLIENT_TYPE_ICONS).
export const DEFAULT_HOMEPAGE_CLIENT_TYPES = [
  { slug: 'collectivites-epci', label: 'Collectivité\n& EPCI' },
  { slug: 'etablissements-de-sante-publics-non-lucratifs', label: 'Santé\n(non lucratif)' },
  { slug: 'structures-medico-sociales', label: 'Médico-Social\n& Social' },
  { slug: 'entreprises-publiques-locales-epl', label: 'Entreprise\nPublique Locale' },
  { slug: 'logement-social', label: 'Bailleurs\nsociaux' },
  { slug: 'sdis-service-de-secours', label: 'SDIS & Service\nde secours' },
  { slug: 'entreprise', label: 'Entreprise\nprivée' },
];

// Bandeau d'accueil (hero) : mosaïque de 4 photos pleine largeur, dégradé
// violet qui s'estompe vers la droite, badge, titre avec mots en couleur
// d'accent (entre **doubles astérisques**) et deux appels à l'action.
export const DEFAULT_HERO = {
  badge: 'Filiale du Groupe BPCE',
  title: 'Mobilisez les **aides et subventions** pour vos projets',
  text: "BPCE Finances & Territoires accompagne collectivités, organismes de santé, acteurs du médico-social, bailleurs sociaux et entreprises dans la détection, le montage et la gestion des financements externes.",
  primaryLabel: '→ Découvrir nos solutions',
  primaryHref: 'detections-des-opportunites/',
  secondaryLabel: '→ Nous contacter',
  secondaryHref: 'contact/',
  photos: {
    big: 'images/hero-bibliotheque.jpg',
    top: 'images/hero-poignee-de-main.jpg',
    bottom: 'images/hero-sante-numerique.jpg',
    right: 'images/hero-maison.jpg',
  },
};

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
    ctaLabel: 'Contactez-nous ›',
    ctaHref: 'contact/',
  },
  footer: {
    brand: 'FINANCES & TERRITOIRES',
    text: 'Expertise en financement public et privé — collectivités, santé, médico-social, bailleurs sociaux et entreprises.',
    subsidiary: 'Une filiale du Groupe BPCE',
    tagline: 'Filiale du Groupe BPCE',
    badge: 'Groupe BPCE',
    linkedin: '',
    youtube: '',
    phone: '04 69 96 61 60',
    email: 'info@finances-territoires.fr',
    address: "L'Amiral — 2B rue Simone Veil\n73000 Bassens (Savoie)",
    columns: [
      { title: 'Expertises', links: [
        { label: 'Détection des opportunités', href: 'detections-des-opportunites/' },
        { label: 'Mobilisation des aides', href: 'mobilisation-des-aides/' },
        { label: 'Pilotage des aides', href: 'gestion-des-aides/' },
        { label: 'Fonds privés / Mécénat', href: 'fonds-de-dotation-mecenat-local/' },
        { label: 'Formations', href: 'nos-formations/' },
      ] },
      { title: 'Profil de nos clients', links: [
        { label: 'Collectivités & EPCI', href: 'collectivites-epci/' },
        { label: 'Santé (non lucratif)', href: 'etablissements-de-sante-publics-non-lucratifs/' },
        { label: 'Médico-Social & Social', href: 'structures-medico-sociales/' },
        { label: 'Entreprise Publique Locale', href: 'entreprises-publiques-locales-epl/' },
        { label: 'Bailleurs sociaux', href: 'logement-social/' },
        { label: 'SDIS & Service de secours', href: 'sdis-service-de-secours/' },
        { label: 'Entreprise privée', href: 'entreprise/' },
      ] },
      { title: 'Nous contacter', links: [
        { label: 'Réussites', href: 'les-reussites-de-nos-clients/' },
        { label: 'Qui sommes-nous ?', href: 'finances-et-territoires/' },
        { label: 'Événements', href: 'evenements/' },
        { label: 'Nous contacter', href: 'contact/' },
      ] },
    ],
    legal: [
      { label: 'Mentions réglementaires', href: 'mentions-legales/' },
      { label: 'Données personnelles', href: 'donnees-personnelles/' },
      { label: 'Gestion des cookies', href: 'cookies/' },
      { label: 'Vigilance fraude', href: 'vigilance-fraude/' },
      { label: 'Accessibilité : partiellement conforme', href: 'https://www.groupebpce.com/mentions-legales/accessibilite/' },
    ],
    bottom: '© 2026 BPCE Finances & Territoires — Filiale du Groupe BPCE. Tous droits réservés.',
  },
};

// Contenu par défaut des pages de base (reprise dans data/pages.json, éditable
// depuis l'admin). `title` alimente la navigation et le fil d'Ariane,
// `headline` le <h1> quand il diffère du titre court.
export const DEFAULT_FINBOOST = {
  title: 'Nos experts, amplifiés par',
  consultantLabel: 'Le consultant — au cœur de votre accompagnement',
  consultantText: "Votre interlocuteur est avant tout un **expert métier** — ancien instructeur régional, spécialiste des financements européens, en philanthropie ou en ingénierie territoriale. C'est sa connaissance fine des dispositifs, des financeurs et des critères d'attribution qui fait la différence sur chaque dossier.",
  consultantBullets: ['Consultant dédié, votre interlocuteur unique', 'Expertise sectorielle et réglementaire', 'Interface directe avec les financeurs', 'Accompagnement de A à Z'],
  toolLabel: 'FinBoost — notre outil innovant interne',
  toolText: "Votre consultant s'appuie sur **FinBoost**, notre plateforme propriétaire, pour ne laisser passer aucune opportunité.",
  features: [
    { title: '+19 000 dispositifs', text: 'Nationaux et européens, mis à jour en continu' },
    { title: 'Moteur multicritères', text: 'Territoire, statut, +80 thématiques croisées' },
    { title: 'Alertes personnalisées', text: "Notification dès qu'une aide s'ouvre sur vos projets" },
    { title: '~1 500 sources privées', text: 'Fondations et fonds de dotation mis à jour quotidiennement' },
  ],
  panelBadge: 'Plateforme expert — temps réel',
  panelCaption: 'Outil interne de nos consultants',
  panelValue: '19 000+',
  panelValueLabel: 'dispositifs ↑ continu',
  sideLabel: 'Sources privées',
  sideValue: '~1 500',
  sideText: 'fondations & fonds',
  primaryLabel: 'Parler à un expert →',
  primaryHref: 'contact/',
  secondaryLabel: 'Notre approche conseil',
  secondaryHref: 'finances-et-territoires/',
};

export const DEFAULT_PROJECT_CTA = {
  title: 'Analysons vos projets, identifions vos financements',
  text: 'Nos experts évaluent votre situation et identifient les aides accessibles pour votre structure. Échanges gratuits et sans engagement.',
  primaryLabel: 'Nous contacter →',
  primaryHref: 'contact/',
  secondaryLabel: 'Découvrir nos solutions →',
  secondaryHref: 'detections-des-opportunites/',
};

export const DEFAULT_ACCOMPAGNEMENT = {
  eyebrow: 'Notre accompagnement',
  title: 'De la détection au pilotage des aides',
  text: 'Un conseil stratégique expert à chaque étape du cycle de financement.',
  cards: [
    { tag: 'Détection des opportunités', title: "Veille continue & Note d'opportunité", text: 'Identification de toutes les aides mobilisables — en continu ou sur un projet ciblé.', items: ['+19 000 mesures de soutien référencées', 'Alertes et veille personnalisées par secteur', 'Détection des AAP de fondations', 'Cartographie priorisée des financements'], linkLabel: 'En savoir plus', linkHref: 'detections-des-opportunites/' },
    { tag: 'Mobilisation des aides', title: 'Montage des dossiers', text: "Constitution et dépôt des dossiers d'aides françaises et européennes.", items: ['Rédaction des mémoires techniques', 'Recensement des pièces administratives', "Suivi de l'instruction des demandes", 'Principalement rémunéré au succès'], linkLabel: 'En savoir plus', linkHref: 'mobilisation-des-aides/' },
    { tag: 'Pilotage des aides', title: 'Gestion des aides obtenues', text: "Pilotage des demandes de paiement et accompagnement jusqu'au versement final.", items: ['Suivi des échéances et montants à percevoir', 'Alertes personnalisées sur les versements', 'Assistance à la liquidation', "Bilan d'exécution"], linkLabel: 'En savoir plus', linkHref: 'gestion-des-aides/' },
    { tag: 'Fonds privés / Mécénat', title: 'Fonds de dotation & collecte de fonds privés', text: 'De la création de votre fonds de dotation à la mobilisation de mécènes.', items: ['Création et développement de fonds de dotation', 'Stratégie de mécénat et ciblage des mécènes', 'Recherche de mécènes et AAP de fondations', '~1 500 sources de financements privés'], linkLabel: 'En savoir plus', linkHref: 'fonds-de-dotation-mecenat-local/' },
  ],
};

export const DEFAULT_ABOUT = {
  cardTitle: 'Une expertise ancrée dans le terrain',
  cardText: "Fondé en 2019, BPCE Finances & Territoires est né d'un constat de terrain : pour nombre d'acteurs, la recherche de financements constitue un frein majeur — faute de moyens humains, de temps ou de compétences spécifiques, mais aussi face à un paysage d'aides particulièrement vaste et épars, difficile à appréhender sans expertise dédiée.",
  badge: 'Filiale du Groupe BPCE',
  stats: [
    { value: '500', suffix: '+', label: 'Structures accompagnées' },
    { value: '1,2', suffix: 'Md€', label: "D'aides mobilisées" },
    { value: '2019', suffix: '', label: 'Depuis notre création' },
    { value: '100', suffix: '%', label: 'National + DROM-COM' },
  ],
  eyebrow: 'Qui sommes-nous ?',
  title: 'BPCE Finances & Territoires, votre partenaire de confiance',
  text: "Filiale du Groupe BPCE, basée à Bassens en Savoie, nous intervenons sur l'ensemble du territoire national auprès de collectivités, organismes de santé, acteurs du médico-social, bailleurs sociaux et entreprises.\n\nNotre approche allie expertise humaine et environnement de travail propriétaire pour maximiser les chances de succès à chaque étape.",
  values: [
    { title: 'Utilité', text: 'solutions concrètes et efficaces' },
    { title: 'Rigueur', text: 'expertise pointue et méthode' },
    { title: 'Confiance', text: 'écoute, transparence, co-construction' },
    { title: 'Ancrage', text: 'territorial fort, interventions nationales' },
    { title: 'Accompagnement', text: 'de bout en bout' },
    { title: 'Réseau', text: 'Groupe BPCE' },
  ],
  buttonLabel: 'En savoir plus →',
  buttonHref: 'finances-et-territoires/',
};

export const DEFAULT_REUSSITES = {
  eyebrow: 'Réussites clients',
  title: 'Ils nous ont fait confiance',
  text: 'Des résultats concrets, obtenus grâce à notre expertise et notre engagement.',
  linkLabel: 'Voir la réussite →',
  buttonLabel: 'Voir toutes les réussites →',
  buttonHref: 'les-reussites-de-nos-clients/',
  items: [
    { badge: 'Collectivité — Rhône', title: 'Pôle nautique — Financement sécurisé', text: "Une commune du Rhône accompagnée pour la reconstruction de son pôle nautique. 800 000 € mobilisés auprès du Secrétariat d'État chargé de la Mer.", href: 'collectivites-epci/', color: 'violet', icon: 'building' },
    { badge: 'Médico-social — Aisne', title: 'Complexe inclusif — Projet innovant', text: 'Association médico-sociale accompagnée pour un complexe inclusif (restauration + gîtes hôteliers). 250 000 € obtenus via le FNADT.', href: 'structures-medico-sociales/', color: 'turquoise', icon: 'plus' },
    { badge: 'Bailleurs sociaux — Bouches-du-Rhône', title: 'Renaturation résidence — 70 % financé', text: 'Bailleur social accompagné pour un projet de renaturation ambitieux. Reste à charge réduit à seulement 30 % grâce aux financements obtenus.', href: 'logement-social/', color: 'magenta', icon: 'house' },
    { badge: 'Collectivité — Île-de-France', title: 'Rénovation énergétique — 2,5 M€', text: 'Commune de 25 000 hab. accompagnée 3 ans sur son programme de rénovation énergétique des groupes scolaires. 6 montages gagnants.', href: 'collectivites-epci/', color: 'indigo', icon: 'school' },
    { badge: 'Médico-social — Nouvelle-Aquitaine', title: 'Résidence intergénérationnelle — 900 000 €', text: "Association médico-sociale accompagnée 2 ans pour la création d'une résidence intergénérationnelle innovante. 6 montages aboutis.", href: 'structures-medico-sociales/', color: 'prune', icon: 'person' },
  ],
};

export const REUSSITE_COLORS = {
  violet: 'linear-gradient(135deg,#581D74,#9176B4)',
  turquoise: 'linear-gradient(135deg,#01A193,#00749D)',
  magenta: 'linear-gradient(135deg,#B34A8C,#8A5599)',
  indigo: 'linear-gradient(135deg,#55579E,#6694CE)',
  prune: 'linear-gradient(135deg,#8A5599,#B34A8C)',
  orange: 'linear-gradient(135deg,#F08050,#D676AD)',
  vert: 'linear-gradient(135deg,#8AB973,#01A193)',
};

const REUSSITE_ICONS = {
  building: '<rect x="20" y="30" width="60" height="50"/><rect x="30" y="15" width="40" height="15"/><line x1="50" y1="15" x2="50" y2="8"/>',
  plus: '<circle cx="50" cy="50" r="35"/><line x1="50" y1="30" x2="50" y2="70"/><line x1="30" y1="50" x2="70" y2="50"/>',
  house: '<path d="M15 60L50 25l35 35"/><rect x="25" y="60" width="50" height="30"/>',
  school: '<rect x="10" y="40" width="80" height="50"/><rect x="30" y="20" width="40" height="20"/>',
  person: '<path d="M20 70c0-16 13-28 30-28s30 12 30 28"/><circle cx="50" cy="30" r="14"/>',
};

export const DEFAULT_COVERAGE = {
  eyebrow: 'Baromètre des aides et subventions en France',
  title: 'Une couverture nationale exhaustive',
  text: "Survolez un département pour découvrir le nombre de dispositifs disponibles — nos consultants veillent sur l'ensemble du territoire national, y compris les DROM-COM.",
  cards: [
    { value: '19 000', suffix: '+', text: 'dispositifs référencés\nà l’échelle nationale' },
    { value: '100', suffix: '%', text: 'du territoire couvert\nDROM-COM inclus' },
    { value: '~1 500', suffix: '', text: 'sources de financements privés\nfondations & fonds de dotation' },
  ],
  hqLabel: 'Notre siège — Savoie',
  hqValue: '2 753',
  hqText: 'dispositifs disponibles\nsur le département',
  hqRegion: 'd-73',
  regions: [
    { id: 'd-01', name: "Ain (01)", count: '' },
    { id: 'd-02', name: "Aisne (02)", count: '' },
    { id: 'd-03', name: "Allier (03)", count: '' },
    { id: 'd-04', name: "Alpes-de-Haute-Provence (04)", count: '' },
    { id: 'd-05', name: "Hautes-Alpes (05)", count: '' },
    { id: 'd-06', name: "Alpes-Maritimes (06)", count: '' },
    { id: 'd-07', name: "Ardèche (07)", count: '' },
    { id: 'd-08', name: "Ardennes (08)", count: '' },
    { id: 'd-09', name: "Ariège (09)", count: '' },
    { id: 'd-10', name: "Aube (10)", count: '' },
    { id: 'd-11', name: "Aude (11)", count: '' },
    { id: 'd-12', name: "Aveyron (12)", count: '' },
    { id: 'd-13', name: "Bouches-du-Rhône (13)", count: '' },
    { id: 'd-14', name: "Calvados (14)", count: '' },
    { id: 'd-15', name: "Cantal (15)", count: '' },
    { id: 'd-16', name: "Charente (16)", count: '' },
    { id: 'd-17', name: "Charente-Maritime (17)", count: '' },
    { id: 'd-18', name: "Cher (18)", count: '' },
    { id: 'd-19', name: "Corrèze (19)", count: '' },
    { id: 'd-21', name: "Côte-d'Or (21)", count: '' },
    { id: 'd-22', name: "Côtes-d'Armor (22)", count: '' },
    { id: 'd-23', name: "Creuse (23)", count: '' },
    { id: 'd-24', name: "Dordogne (24)", count: '' },
    { id: 'd-25', name: "Doubs (25)", count: '' },
    { id: 'd-26', name: "Drôme (26)", count: '' },
    { id: 'd-27', name: "Eure (27)", count: '' },
    { id: 'd-28', name: "Eure-et-Loir (28)", count: '' },
    { id: 'd-29', name: "Finistère (29)", count: '' },
    { id: 'd-2A', name: "Corse-du-Sud (2A)", count: '' },
    { id: 'd-2B', name: "Haute-Corse (2B)", count: '' },
    { id: 'd-30', name: "Gard (30)", count: '' },
    { id: 'd-31', name: "Haute-Garonne (31)", count: '' },
    { id: 'd-32', name: "Gers (32)", count: '' },
    { id: 'd-33', name: "Gironde (33)", count: '' },
    { id: 'd-34', name: "Hérault (34)", count: '' },
    { id: 'd-35', name: "Ille-et-Vilaine (35)", count: '' },
    { id: 'd-36', name: "Indre (36)", count: '' },
    { id: 'd-37', name: "Indre-et-Loire (37)", count: '' },
    { id: 'd-38', name: "Isère (38)", count: '' },
    { id: 'd-39', name: "Jura (39)", count: '' },
    { id: 'd-40', name: "Landes (40)", count: '' },
    { id: 'd-41', name: "Loir-et-Cher (41)", count: '' },
    { id: 'd-42', name: "Loire (42)", count: '' },
    { id: 'd-43', name: "Haute-Loire (43)", count: '' },
    { id: 'd-44', name: "Loire-Atlantique (44)", count: '' },
    { id: 'd-45', name: "Loiret (45)", count: '' },
    { id: 'd-46', name: "Lot (46)", count: '' },
    { id: 'd-47', name: "Lot-et-Garonne (47)", count: '' },
    { id: 'd-48', name: "Lozère (48)", count: '' },
    { id: 'd-49', name: "Maine-et-Loire (49)", count: '' },
    { id: 'd-50', name: "Manche (50)", count: '' },
    { id: 'd-51', name: "Marne (51)", count: '' },
    { id: 'd-52', name: "Haute-Marne (52)", count: '' },
    { id: 'd-53', name: "Mayenne (53)", count: '' },
    { id: 'd-54', name: "Meurthe-et-Moselle (54)", count: '' },
    { id: 'd-55', name: "Meuse (55)", count: '' },
    { id: 'd-56', name: "Morbihan (56)", count: '' },
    { id: 'd-57', name: "Moselle (57)", count: '' },
    { id: 'd-58', name: "Nièvre (58)", count: '' },
    { id: 'd-59', name: "Nord (59)", count: '' },
    { id: 'd-60', name: "Oise (60)", count: '' },
    { id: 'd-61', name: "Orne (61)", count: '' },
    { id: 'd-62', name: "Pas-de-Calais (62)", count: '' },
    { id: 'd-63', name: "Puy-de-Dôme (63)", count: '' },
    { id: 'd-64', name: "Pyrénées-Atlantiques (64)", count: '' },
    { id: 'd-65', name: "Hautes-Pyrénées (65)", count: '' },
    { id: 'd-66', name: "Pyrénées-Orientales (66)", count: '' },
    { id: 'd-67', name: "Bas-Rhin (67)", count: '' },
    { id: 'd-68', name: "Haut-Rhin (68)", count: '' },
    { id: 'd-69', name: "Rhône (69)", count: '' },
    { id: 'd-70', name: "Haute-Saône (70)", count: '' },
    { id: 'd-71', name: "Saône-et-Loire (71)", count: '' },
    { id: 'd-72', name: "Sarthe (72)", count: '' },
    { id: 'd-73', name: "Savoie (73)", count: '' },
    { id: 'd-74', name: "Haute-Savoie (74)", count: '' },
    { id: 'd-75', name: "Paris (75)", count: '' },
    { id: 'd-76', name: "Seine-Maritime (76)", count: '' },
    { id: 'd-77', name: "Seine-et-Marne (77)", count: '' },
    { id: 'd-78', name: "Yvelines (78)", count: '' },
    { id: 'd-79', name: "Deux-Sèvres (79)", count: '' },
    { id: 'd-80', name: "Somme (80)", count: '' },
    { id: 'd-81', name: "Tarn (81)", count: '' },
    { id: 'd-82', name: "Tarn-et-Garonne (82)", count: '' },
    { id: 'd-83', name: "Var (83)", count: '' },
    { id: 'd-84', name: "Vaucluse (84)", count: '' },
    { id: 'd-85', name: "Vendée (85)", count: '' },
    { id: 'd-86', name: "Vienne (86)", count: '' },
    { id: 'd-87', name: "Haute-Vienne (87)", count: '' },
    { id: 'd-88', name: "Vosges (88)", count: '' },
    { id: 'd-89', name: "Yonne (89)", count: '' },
    { id: 'd-90', name: "Territoire de Belfort (90)", count: '' },
    { id: 'd-91', name: "Essonne (91)", count: '' },
    { id: 'd-92', name: "Hauts-de-Seine (92)", count: '' },
    { id: 'd-93', name: "Seine-Saint-Denis (93)", count: '' },
    { id: 'd-94', name: "Val-de-Marne (94)", count: '' },
    { id: 'd-95', name: "Val-d'Oise (95)", count: '' },
    { id: 'd-971', name: "Guadeloupe (971)", count: '' },
    { id: 'd-972', name: "Martinique (972)", count: '' },
    { id: 'd-973', name: "Guyane (973)", count: '' },
    { id: 'd-974', name: "La Réunion (974)", count: '' },
    { id: 'd-976', name: "Mayotte (976)", count: '' },
  ],
};

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
      title: 'Réussites',
      headline: 'Ils nous ont fait confiance',
      eyebrow: 'Réussites clients',
      bannerImage: 'images/handshake-reunion.webp',
      lead: 'Des résultats concrets, obtenus grâce à notre expertise et notre engagement aux côtés de chaque client.',
      sectionEyebrow: 'Réussites',
      sectionTitle: 'Des projets financés, des territoires transformés',
      cases: [
        { badge: 'Collectivité — Île-de-France', title: 'Rénovation énergétique de groupes scolaires', text: 'Commune de 25 000 hab. accompagnée 3 ans. 6 dossiers montés avec succès sur son programme de rénovation.', amount: '2,5 M€', caption: 'mobilisés — 6 montages gagnants sur 3 ans', href: 'collectivites-epci/', color: 'violet' },
        { badge: 'Collectivité — Île-de-France', title: 'Gymnase, îlots de fraîcheur & espace culturel', text: "Commune de 11 000 hab. — 4 ans d'accompagnement. 20 dossiers sur projets variés.", amount: '2,8 M€', caption: 'mobilisés — 20 montages gagnants sur 4 ans', href: 'collectivites-epci/', color: 'indigo' },
        { badge: 'Collectivité — PACA', title: "Restauration d'une église & groupe scolaire", text: 'Commune de 2 000 hab. — 3 ans. Restauration du patrimoine local et rénovation du groupe scolaire.', amount: '2,2 M€', caption: 'mobilisés — 6 montages gagnants sur 3 ans', href: 'collectivites-epci/', color: 'turquoise' },
        { badge: 'Association sociale — Bourgogne-Franche-Comté', title: 'Friche industrielle & récupération de chaleur fatale', text: "Accompagnée 1 an sur la reconversion d'une friche et un dispositif de chaleur fatale.", amount: '555 000 €', caption: 'mobilisés — 5 montages gagnants en 1 an', href: 'structures-medico-sociales/', color: 'prune' },
        { badge: 'Association médico-sociale — Nouvelle-Aquitaine', title: 'Résidence intergénérationnelle', text: "Accompagnée 2 ans dans la structuration financière d'un projet de résidence intergénérationnelle innovante.", amount: '900 000 €', caption: 'mobilisés — 6 montages gagnants sur 2 ans', href: 'structures-medico-sociales/', color: 'magenta' },
        { badge: 'Bailleur social — Île-de-France', title: 'Projet de friche', text: "Bailleur social accompagné 1 an pour le financement d'une ambitieuse opération de reconversion de friche.", amount: '2 M€', caption: 'mobilisés — 1 montage gagnant en 1 an', href: 'logement-social/', color: 'violet' },
      ],
      cta: { title: 'Votre projet peut être notre prochaine réussite', text: 'Échanges gratuits et sans engagement. Nos experts analysent votre situation.', label: '→ Nous contacter' },
      testimonial: { meta: 'Témoignages', quote: '', cite: '', footnote: '' },
      stats: [],
    },
    contact: {
      title: 'Contact',
      lead: 'Un projet à financer ? Parlons-en. Décrivez-nous votre besoin, un consultant vous recontacte pour un premier échange.',
      email: 'A-REMPLACER@exemple.fr',
      eyebrow: 'Contact',
      headline: 'Contactez-nous',
      image: 'images/contact-hero.jpg',
      formTitle: 'Parlons de vos projets',
      formText: 'Remplissez ce formulaire pour nous présenter votre structure et vos besoins. Un de nos consultants vous recontactera dans les 48h ouvrées.',
      profiles: ['Collectivité & EPCI', 'Santé (non lucratif)', 'Médico-Social & Social', 'Entreprise Publique Locale (EPL)', 'Bailleur social', 'SDIS & Service de secours', 'Entreprise privée', 'Autre'],
      subjects: ["Détection d'opportunités — Veille continue", "Note d'opportunité — étude de faisabilité", 'Montage de dossiers de subvention', 'Pilotage et gestion des aides obtenues', 'Fonds de dotation & mécénat', 'Formation', 'Autre demande'],
      privacy: "En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter dans le cadre de votre demande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant [info@finances-territoires.fr](mailto:info@finances-territoires.fr).",
      submitLabel: 'Envoyer ma demande →',
      coordsTitle: 'Coordonnées',
      faqTitle: 'Questions fréquentes',
      faq: [
        { title: 'Le premier échange est-il gratuit ?', text: 'Oui, tous nos échanges exploratoires sont gratuits et sans engagement. Nous vous orientons avant toute mission.' },
        { title: "Quelle est votre zone d'intervention ?", text: 'Tout le territoire national, y compris les DROM-COM. Notre équipe peut intervenir sur place ou à distance.' },
        { title: 'Combien de temps dure une première étude ?', text: "Une Note d'opportunité est remise en quelques jours après l'échange initial. Pour une Veille continue, la mise en route est rapide." },
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
  const lastCol = columns.length - 1;
  const hasContact = f.phone || f.email || f.address;
  const telHref = String(f.phone || '').replace(/[^\d+]/g, '');
  const social = [
    f.linkedin ? `<a class="footer-social" href="${escapeHtml(f.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zm7 0h3.8v1.6h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12v5.33h-4v-4.73c0-1.13-.02-2.58-1.57-2.58-1.58 0-1.82 1.23-1.82 2.5v4.81H10z"/></svg></a>` : '',
    f.youtube ? `<a class="footer-social" href="${escapeHtml(f.youtube)}" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg></a>` : '',
  ].filter(Boolean).join('');
  const contactCard = hasContact ? `<div class="footer-contact">
        ${f.phone ? `<a href="tel:${telHref}">${escapeHtml(f.phone)}</a>` : ''}
        ${f.email ? `<a href="mailto:${escapeHtml(f.email)}">${escapeHtml(f.email)}</a>` : ''}
        ${f.address ? `<p>${escapeHtml(f.address).replace(/\r?\n/g, '<br>')}</p>` : ''}
      </div>` : '';
  return `<footer class="site-footer">
  <div class="container footer-top">
    <div class="footer-about">
      <div class="footer-brand">${escapeHtml(f.brand)}</div>
      ${f.tagline ? `<div class="footer-tagline">${escapeHtml(f.tagline)}</div>` : ''}
      <p>${richText(f.text, base)}</p>
      ${f.badge ? `<span class="footer-subsidiary">${escapeHtml(f.badge)}</span>` : ''}
      ${social ? `<div class="footer-socials">${social}</div>` : ''}
    </div>
    ${columns.map((col, ci) => `<div class="footer-col">
      <h4>${escapeHtml(col.title)}</h4>
      <ul>
        ${col.links.map(l => `<li><a href="${base}${l.href}">${escapeHtml(l.label)}</a></li>`).join('\n        ')}
      </ul>
      ${ci === lastCol ? contactCard : ''}
    </div>`).join('\n    ')}
    ${columns.length ? '' : contactCard}
  </div>
  <div class="footer-bottom container">
    <div class="footer-copy">${escapeHtml(f.bottom)}</div>
    ${(f.legal || []).filter(l => l.label).length ? `<nav class="footer-legal" aria-label="Liens légaux">
      ${(f.legal || []).filter(l => l.label).map(l => /^https?:/.test(l.href || '') ? `<a href="${escapeHtml(l.href)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>` : `<a href="${base}${escapeHtml(l.href || '')}">${escapeHtml(l.label)}</a>`).join('\n      ')}
    </nav>` : ''}
  </div>
</footer>`;
}

// Bandeau photo des pages internes (maquette « .ph ») : photo assombrie,
// dégradé violet à gauche, pastille, H1 et chapô. Précédé du fil d'Ariane.
export function photoHero(p, { eyebrow, title, lead, image } = {}) {
  return `<div class="ph">
  ${image ? `<div class="ph-img"><img src="../${escapeHtml(image)}" alt="" onerror="this.parentElement.remove()"></div>` : ''}
  <div class="ph-over"></div>
  <div class="ph-content container">
    ${eyebrow ? `<div class="ph-pill"><em>★</em> ${escapeHtml(eyebrow)}</div>` : ''}
    <h1>${escapeHtml(title)}</h1>
    ${lead ? `<p>${richText(lead)}</p>` : ''}
  </div>
</div>`;
}

export function breadcrumb(p) {
  const section = SECTIONS[p.section];
  const parts = [`<a href="../">Accueil</a>`];
  if (section.label && !p.isHub) {
    if (section.hub) parts.push(`<a href="${section.hub}">${section.label}</a>`);
    else parts.push(`<span>${section.label}</span>`);
  }
  parts.push(`<span class="current">${escapeHtml(p.title)}</span>`);
  return `<div class="bc-bar"><nav class="breadcrumb container" aria-label="Fil d'Ariane">${parts.join(' <span class="bc-sep">›</span> ')}</nav></div>`;
}

export function ctaBand(content, base = '../') {
  const c = { ...DEFAULT_CONTENT.cta, ...(content?.cta || {}) };
  return `
  <section>
    <div class="cta-band">
      <div>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${richText(c.text, base)}</p>
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
      <p>${richText(f.text)}</p>
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
  <div class="page-banner"><img src="../${escapeHtml(p.image)}" alt="" loading="lazy" onerror="this.parentElement.remove()"></div>`;
}

export function renderExpertiseOrSecteur(p, pages, content) {
  return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(p.title)}</h1>
    <p class="lead">${richText(p.lead)}</p>
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
    <p class="lead">${richText(p.intro)}</p>
  </div>
  <div class="article-body">
    ${p.body.map(([h, text]) => `<h2>${escapeHtml(h)}</h2>\n    <p>${richText(text)}</p>`).join('\n    ')}
  </div>
</main>
${ctaBand(content)}`;
}

export function renderGuideHub(articles, c = {}) {
  return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(c.title ?? 'Guide')}</h1>
    <p class="lead">${richText(c.lead ?? '')}</p>
  </div>${pageBanner(c)}
  <div class="cards-grid" style="grid-template-columns:repeat(3,1fr); margin-bottom:64px;">
    ${articles.map((a, i) => `<article class="feature-card feature-card--guide">
      <div class="feature-card__banner"><img src="../${a.image || 'images/paris-eiffel.jpg'}" alt="" loading="lazy" onerror="this.remove()"></div>
      <div class="feature-card__body">
        <h3><a href="../${a.slug}/" style="color:inherit;text-decoration:none;">${escapeHtml(a.title)}</a></h3>
        <p>${richText(a.intro)}</p>
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
    ${list.map(e => `<div class="event-item${e.image ? ' event-item--photo' : ''}">
      ${e.image ? `<img class="event-item__photo" src="../${escapeHtml(e.image)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
      <div class="event-item__date">${escapeHtml(formatEventDate(e.date))}</div>
      <h3>${escapeHtml(e.title)}</h3>
      <p>${richText(e.description || '')}</p>
    </div>`).join('\n    ')}
  </div>`
    : `<div class="empty-state">
    <strong>${escapeHtml(c.emptyTitle ?? '')}</strong>
    ${richText(c.emptyText ?? '')}
  </div>`;
  return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(c.title ?? 'Événements')}</h1>
    <p class="lead">${richText(c.lead ?? '')}</p>
  </div>${pageBanner(c)}
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
      ${(s.items || []).map(i => `<li>${richText(i)}</li>`).join('\n      ')}
    </ul>`;
    }
    return `<h2>${escapeHtml(s.title)}</h2>
    ${(s.blocks || []).map(b => `<div class="content-block">
      <h3>${escapeHtml(b.title)}</h3>
      <p>${richText(b.text)}</p>
    </div>`).join('\n    ')}`;
  }).join('\n\n    ');
}

export function renderCustom(p, pages, events, content, navigation) {
  const c = pageContent(p.slug, content);
  switch (p.slug) {
    case 'entreprise': {
      const cta = { ...(DEFAULT_CONTENT.pages.entreprise.cta), ...(c.cta || {}) };
      return `<main class="container">
  <div class="page-hero">
    <span class="page-hero__eyebrow">${escapeHtml(c.eyebrow)}</span>
    <h1>${escapeHtml(c.headline || c.title)}</h1>
    <p class="lead">${richText(c.lead)}</p>
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
      <p>${richText(cta.text)}</p>
    </div>
    <a class="btn-cta-pill" href="../contact/">${escapeHtml(cta.label)}</a>
  </div>
</section>`;
    }

    case 'finances-et-territoires':
      return `<main class="container">
  <div class="page-hero">
    <h1>${escapeHtml(c.headline || c.title)}</h1>
    <p class="lead">${richText(c.lead)}</p>
  </div>${pageBanner(c)}

  <div class="stats-row" style="margin-top:40px; margin-bottom:56px;">
    ${(c.stats || []).map(s => `<div><div class="stat-value">${escapeHtml(s.value)}</div><div class="stat-label">${escapeHtml(s.label)}</div></div>`).join('\n    ')}
  </div>

  <div class="feature-list">
    ${(c.features || []).map((f, i) => `<div class="feature-list__item">
      <span class="feature-list__bullet">${i + 1}</span>
      <h3>${escapeHtml(f.title)}</h3>
      <p>${richText(f.text)}</p>
    </div>`).join('\n    ')}
  </div>
</main>
${ctaBand(content)}`;

    case 'les-reussites-de-nos-clients': {
      const d = DEFAULT_CONTENT.pages['les-reussites-de-nos-clients'];
      const cases = (c.cases || d.cases).filter(x => x.title || x.text);
      const cta = { ...d.cta, ...(c.cta || {}) };
      return `${photoHero(p, { eyebrow: c.eyebrow ?? d.eyebrow, title: c.headline || c.title, lead: c.lead, image: c.bannerImage })}
<main>
  <section class="rs-section">
    <div class="container">
      <div class="section-intro">
        ${c.sectionEyebrow ?? d.sectionEyebrow ? `<span class="section-eyebrow">${escapeHtml(c.sectionEyebrow ?? d.sectionEyebrow)}</span>` : ''}
        <h2 class="section-title">${escapeHtml(c.sectionTitle ?? d.sectionTitle)}</h2>
      </div>
      <div class="rs-grid">
        ${cases.map(x => {
          const bg = REUSSITE_COLORS[x.color] || REUSSITE_COLORS.violet;
          const inner = `<span class="rs-bar" style="background:${bg}"></span>
          ${x.badge ? `<span class="rs-badge">${escapeHtml(x.badge)}</span>` : ''}
          <h3 class="rs-title">${escapeHtml(x.title)}</h3>
          <p class="rs-text">${richText(x.text)}</p>
          ${x.amount ? `<div class="rs-amount">${escapeHtml(x.amount)}</div>` : ''}
          ${x.caption ? `<div class="rs-caption">${escapeHtml(x.caption)}</div>` : ''}`;
          return x.href ? `<a class="rs-card" href="../${escapeHtml(x.href)}">${inner}</a>` : `<div class="rs-card">${inner}</div>`;
        }).join('\n        ')}
      </div>
    </div>
  </section>
</main>
${cta.title ? `<section class="project-cta project-cta--page">
  <div class="project-cta__inner">
    <h2 class="project-cta__title">${escapeHtml(cta.title)}</h2>
    ${cta.text ? `<p class="project-cta__text">${richText(cta.text)}</p>` : ''}
    <div class="project-cta__actions"><a class="btn-cta-pill" href="../contact/">${escapeHtml(cta.label || 'Nous contacter →')}</a></div>
  </div>
</section>` : ''}`;
    }

    case 'contact': {
      const d = DEFAULT_CONTENT.pages.contact;
      // Adresse interpolée dans un littéral JS : on la restreint aux caractères
      // valides d'un e-mail pour qu'aucune saisie admin ne casse le script.
      const email = String(c.email || '').replace(/[^\w.@+-]/g, '');
      const f = { ...DEFAULT_NAVIGATION.footer, ...(navigation?.footer || {}) };
      const telHref = String(f.phone || '').replace(/[^\d+]/g, '');
      const profiles = (c.profiles || d.profiles).filter(Boolean);
      const subjects = (c.subjects || d.subjects).filter(Boolean);
      const faq = (c.faq || d.faq).filter(x => x.title || x.text);
      const field = (id, label, type, placeholder, required) => `<div class="f-grp">
          <label class="f-label" for="${id}">${label}${required ? '<span class="req">*</span>' : ''}</label>
          <input class="f-inp" id="${id}" name="${id}" type="${type}" placeholder="${escapeHtml(placeholder)}"${required ? ' required' : ''}>
        </div>`;
      return `${photoHero(p, { eyebrow: c.eyebrow ?? d.eyebrow, title: c.headline || c.title, lead: c.lead, image: c.image })}
<main>
  <section class="contact-section">
    <div class="container contact-grid">
      <div>
        <h2 class="contact-title">${escapeHtml(c.formTitle ?? d.formTitle)}</h2>
        ${(c.formText ?? d.formText) ? `<p class="contact-text">${richText(c.formText ?? d.formText)}</p>` : ''}
        <form class="f-grid" id="contact-form" novalidate>
          ${field('prenom', 'Prénom', 'text', 'Jean', true)}
          ${field('nom', 'Nom', 'text', 'Dupont', true)}
          ${field('fonction', 'Fonction', 'text', 'Directeur général', true)}
          ${field('structure', 'Structure', 'text', 'Commune de...', true)}
          ${field('email', 'E-mail', 'email', 'jean.dupont@mairie.fr', true)}
          ${field('telephone', 'Téléphone', 'tel', '+33 6 00 00 00 00', false)}
          <div class="f-grp full">
            <label class="f-label" for="profil">Profil de structure<span class="req">*</span></label>
            <select class="f-sel" id="profil" name="profil" required><option value="">Sélectionnez votre profil</option>${profiles.map(x => `<option>${escapeHtml(x)}</option>`).join('')}</select>
          </div>
          <div class="f-grp full">
            <label class="f-label" for="sujet">Sujet de votre demande<span class="req">*</span></label>
            <select class="f-sel" id="sujet" name="sujet" required><option value="">Sélectionnez</option>${subjects.map(x => `<option>${escapeHtml(x)}</option>`).join('')}</select>
          </div>
          <div class="f-grp full">
            <label class="f-label" for="message">Votre message<span class="req">*</span></label>
            <textarea class="f-ta" id="message" name="message" placeholder="Décrivez brièvement votre projet, vos besoins et votre calendrier…" required></textarea>
          </div>
          ${(c.privacy ?? d.privacy) ? `<div class="f-grp full"><div class="f-privacy"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>${richText(c.privacy ?? d.privacy)}</span></div></div>` : ''}
          <div class="f-grp full"><button class="f-submit" type="submit">${escapeHtml(c.submitLabel ?? d.submitLabel)}</button></div>
        </form>
        <script>
          document.getElementById('contact-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var form = e.target;
            if (!form.checkValidity()) { form.reportValidity(); return; }
            var v = function (id) { return form.querySelector('#' + id).value; };
            var name = v('prenom') + ' ' + v('nom');
            var subject = 'Demande de contact — ' + name + (v('structure') ? ' (' + v('structure') + ')' : '');
            var body = 'Nom : ' + name + '\\n' +
              'Fonction : ' + v('fonction') + '\\n' +
              'Structure : ' + v('structure') + '\\n' +
              'E-mail : ' + v('email') + '\\n' +
              'Téléphone : ' + v('telephone') + '\\n' +
              'Profil : ' + v('profil') + '\\n' +
              'Sujet : ' + v('sujet') + '\\n\\n' +
              v('message');
            window.location.href = 'mailto:${email}?subject=' +
              encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          });
        </script>
      </div>
      <aside>
        <div class="ci-box">
          <div class="ci-title">${escapeHtml(c.coordsTitle ?? d.coordsTitle)}</div>
          ${f.address ? `<div class="ci-item"><div class="ci-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div><div class="ci-lbl">Adresse</div><div class="ci-val">${escapeHtml(f.address).replace(/\r?\n/g, '<br>')}</div></div></div>` : ''}
          ${f.phone ? `<div class="ci-item"><div class="ci-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.9 2z"/></svg></div><div><div class="ci-lbl">Téléphone</div><div class="ci-val"><a href="tel:${telHref}">${escapeHtml(f.phone)}</a></div></div></div>` : ''}
          ${f.email ? `<div class="ci-item"><div class="ci-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg></div><div><div class="ci-lbl">E-mail</div><div class="ci-val"><a href="mailto:${escapeHtml(f.email)}">${escapeHtml(f.email)}</a></div></div></div>` : ''}
        </div>
        ${faq.length ? `<div class="ci-faq">
          <div class="ci-faq__title">${escapeHtml(c.faqTitle ?? d.faqTitle)}</div>
          ${faq.map(x => `<div class="ci-faq__item"><div class="ci-faq__q">${escapeHtml(x.title)}</div><p>${richText(x.text)}</p></div>`).join('\n          ')}
        </div>` : ''}
      </aside>
    </div>
  </section>
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
  return renderCustom(p, pages, events, site.content, site.navigation);
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
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="viewport" content="width=device-width, initial-scale=1">
${seoTags(p, site.content)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles/site.css?v=20261101b">
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
  'collectivites-epci': '<svg viewBox="0 0 56 56"><rect x="8" y="22" width="40" height="28"/><rect x="20" y="10" width="16" height="12"/><line x1="28" y1="10" x2="28" y2="4"/><rect x="16" y="32" width="8" height="10"/><rect x="32" y="32" width="8" height="10"/><rect x="22" y="36" width="12" height="14"/></svg>',
  'etablissements-de-sante-publics-non-lucratifs': '<svg viewBox="0 0 56 56"><path d="M28 44C28 44 8 32 8 20c0-6 5-10 12-8 4 1 7 4 8 6 1-2 4-5 8-6 7-2 12 2 12 8 0 12-20 24-20 24Z"/><line x1="28" y1="18" x2="28" y2="30"/><line x1="22" y1="24" x2="34" y2="24"/></svg>',
  'structures-medico-sociales': '<svg viewBox="0 0 56 56"><circle cx="28" cy="18" r="8"/><path d="M12 46c0-10 8-16 16-16s16 6 16 16"/><path d="M36 24c4-4 10-2 10 4"/><path d="M20 24c-4-4-10-2-10 4"/></svg>',
  'entreprises-publiques-locales-epl': '<svg viewBox="0 0 56 56"><rect x="8" y="14" width="40" height="32" rx="2"/><line x1="8" y1="24" x2="48" y2="24"/><line x1="24" y1="14" x2="24" y2="46"/></svg>',
  'logement-social': '<svg viewBox="0 0 56 56"><path d="M10 28L28 12l18 16"/><rect x="16" y="28" width="24" height="18"/><rect x="24" y="36" width="8" height="10"/></svg>',
  'sdis-service-de-secours': '<svg viewBox="0 0 56 56"><rect x="8" y="26" width="40" height="20" rx="3"/><rect x="8" y="20" width="28" height="8"/><circle cx="16" cy="46" r="5"/><circle cx="40" cy="46" r="5"/><line x1="32" y1="26" x2="32" y2="20"/></svg>',
  'entreprise': '<svg viewBox="0 0 56 56"><rect x="16" y="8" width="24" height="40"/><rect x="6" y="20" width="10" height="28"/><rect x="40" y="20" width="10" height="28"/><rect x="22" y="16" width="12" height="10"/></svg>',
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
    .map(ct => `<a class="sect-item" href="${ct.slug}/"><span class="sect-ico">${CLIENT_TYPE_ICONS[ct.slug] || ''}</span><span class="sect-lbl">${escapeHtml(ct.label).replace(/\r?\n/g, '<br>')}</span></a>`)
    .join('\n    ');
}

const INTRO_CARD_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12.5l2 2 4-4.5"/></svg>',
];

const ACC_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M11 8.5v5M8.5 11h5"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2.5-6 5 12 2.5-6h4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>',
];

function renderAccompagnement(data) {
  const a = { ...DEFAULT_ACCOMPAGNEMENT, ...(data || {}) };
  const cards = (a.cards || []).filter(c => c.title || c.text);
  return `<section id="expertises">
    <div class="section-intro">
      ${a.eyebrow ? `<span class="section-eyebrow">${escapeHtml(a.eyebrow)}</span>` : ''}
      <h2 class="section-title">${escapeHtml(a.title)}</h2>
      ${a.text ? `<p class="section-intro__text">${richText(a.text, '')}</p>` : ''}
    </div>
    <div class="cards-grid cards-grid--${Math.min(cards.length, 4) || 1}">
      ${cards.map((c, i) => `<article class="icon-card">
        <span class="icon-card__badge">${ACC_ICONS[i % ACC_ICONS.length]}</span>
        ${c.tag ? `<span class="icon-card__tag">${escapeHtml(c.tag)}</span>` : ''}
        <h3>${c.linkHref ? `<a href="${escapeHtml(c.linkHref)}">${escapeHtml(c.title)}</a>` : escapeHtml(c.title)}</h3>
        <p>${richText(c.text, '')}</p>
        ${(c.items || []).length ? `<ul class="icon-card__list">${c.items.map(it => `<li>${richText(it, '')}</li>`).join('')}</ul>` : ''}
        ${c.linkLabel && c.linkHref ? `<a class="icon-card__link" href="${escapeHtml(c.linkHref)}">${escapeHtml(c.linkLabel)} →</a>` : ''}
      </article>`).join('\n      ')}
    </div>
  </section>`;
}

const VALUE_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="16" cy="9" r="2.6"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M14 20c.3-2.3 2-4 4.5-4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"/><path d="M9 12.5l2 2 4-4.5"/></svg>',
];

const FB_ICON = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
  features: [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
  ],
};

const multiline = str => escapeHtml(str).replace(/\r?\n/g, '<br>');

function renderFinboost(data) {
  const f = { ...DEFAULT_FINBOOST, ...(data || {}) };
  const bars = [38, 52, 34, 70, 60, 46, 78];
  return `<section class="finboost" id="finboost">
    <div class="container finboost__grid">
      <div class="finboost__main">
        <h2 class="finboost__title">${escapeHtml(f.title)} <span class="finboost__brand">Fin<em>Boost</em></span></h2>
        <div class="fb-card">
          <div class="fb-card__head"><span class="fb-card__icon">${FB_ICON.user}</span><span class="fb-card__label">${escapeHtml(f.consultantLabel)}</span></div>
          <p>${richText(f.consultantText, '')}</p>
          <ul class="fb-checks">${(f.consultantBullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
        </div>
        <div class="fb-card fb-card--tool">
          <div class="fb-card__head"><span class="fb-card__icon fb-card__icon--gold">${FB_ICON.pulse}</span><span class="fb-card__label fb-card__label--gold">${escapeHtml(f.toolLabel)}</span></div>
          <p>${richText(f.toolText, '')}</p>
          <div class="fb-features">${(f.features || []).map((x, i) => `<div class="fb-feature">
            <span class="fb-feature__icon">${FB_ICON.features[i % FB_ICON.features.length]}</span>
            <strong>${escapeHtml(x.title)}</strong>
            <span>${escapeHtml(x.text)}</span>
          </div>`).join('')}</div>
        </div>
        <div class="finboost__ctas">
          ${f.primaryLabel ? `<a class="fb-btn fb-btn--gold" href="${escapeHtml(f.primaryHref)}">${escapeHtml(f.primaryLabel)}</a>` : ''}
          ${f.secondaryLabel ? `<a class="fb-btn fb-btn--ghost" href="${escapeHtml(f.secondaryHref)}">${escapeHtml(f.secondaryLabel)}</a>` : ''}
        </div>
      </div>
      <div class="finboost__aside" aria-hidden="true">
        <div class="fb-panel">
          <span class="fb-panel__badge">● ${escapeHtml(f.panelBadge)}</span>
          <div class="fb-panel__brand">Fin<em>Boost</em></div>
          <div class="fb-panel__caption">${escapeHtml(f.panelCaption)}</div>
          <div class="fb-bars">${bars.map((h, i) => `<span style="height:${h}%"${i === 3 || i === 6 ? ' class="is-gold"' : ''}></span>`).join('')}</div>
          <div class="fb-panel__stat"><strong>${escapeHtml(f.panelValue)}</strong> <span>${escapeHtml(f.panelValueLabel)}</span></div>
        </div>
        <div class="fb-side">
          <span>${escapeHtml(f.sideLabel)}</span>
          <strong>${escapeHtml(f.sideValue)}</strong>
          <span>${escapeHtml(f.sideText)}</span>
        </div>
      </div>
    </div>
  </section>`;
}

function renderReussites(data) {
  const r = { ...DEFAULT_REUSSITES, ...(data || {}) };
  const items = (r.items || []).filter(x => x.title || x.text);
  if (!items.length) return '';
  return `<section class="reussites section--muted" id="reussites">
    <div class="container">
      <div class="section-intro">
        ${r.eyebrow ? `<span class="section-eyebrow">${escapeHtml(r.eyebrow)}</span>` : ''}
        <h2 class="section-title">${escapeHtml(r.title)}</h2>
        ${r.text ? `<p class="section-intro__text">${richText(r.text, '')}</p>` : ''}
      </div>
      <div class="ru-carousel" id="ru-carousel">
        <div class="ru-outer">
          <div class="ru-track">
            ${items.map(it => {
              const bg = REUSSITE_COLORS[it.color] || REUSSITE_COLORS.violet;
              const ico = REUSSITE_ICONS[it.icon] || REUSSITE_ICONS.building;
              const inner = `<div class="ru-visual" style="background:${bg}"><svg viewBox="0 0 100 100" aria-hidden="true">${ico}</svg>${it.badge ? `<span class="ru-badge">${escapeHtml(it.badge)}</span>` : ''}</div>
              <div class="ru-body"><h3 class="ru-title">${escapeHtml(it.title)}</h3><p class="ru-desc">${richText(it.text, '')}</p>${it.href && r.linkLabel ? `<span class="ru-lnk">${escapeHtml(r.linkLabel)}</span>` : ''}</div>`;
              return it.href ? `<a class="ru-card" href="${escapeHtml(it.href)}">${inner}</a>` : `<div class="ru-card">${inner}</div>`;
            }).join('\n            ')}
          </div>
        </div>
        <div class="ru-nav">
          <button type="button" class="ru-btn ru-prev" aria-label="Précédent"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <div class="ru-dots"></div>
          <button type="button" class="ru-btn ru-next" aria-label="Suivant"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
        </div>
      </div>
      ${r.buttonLabel ? `<div class="ru-more"><a class="btn-ap" href="${escapeHtml(r.buttonHref || 'les-reussites-de-nos-clients/')}">${escapeHtml(r.buttonLabel)}</a></div>` : ''}
    </div>
  </section>`;
}

function renderProjectCta(data) {
  const c = { ...DEFAULT_PROJECT_CTA, ...(data || {}) };
  if (!c.title) return '';
  return `<section class="project-cta">
    <div class="project-cta__inner">
      <h2 class="project-cta__title">${escapeHtml(c.title)}</h2>
      ${c.text ? `<p class="project-cta__text">${richText(c.text, '')}</p>` : ''}
      <div class="project-cta__actions">
        ${c.primaryLabel ? `<a class="btn-cta-pill" href="${escapeHtml(c.primaryHref || 'contact/')}">${escapeHtml(c.primaryLabel)}</a>` : ''}
        ${c.secondaryLabel ? `<a class="btn-cta-pill btn-cta-pill--ghost" href="${escapeHtml(c.secondaryHref || '')}">${escapeHtml(c.secondaryLabel)}</a>` : ''}
      </div>
    </div>
  </section>`;
}

function renderAbout(data) {
  const a = { ...DEFAULT_ABOUT, ...(data || {}) };
  const paras = String(a.text || '').split(/\n\s*\n/).filter(x => x.trim());
  return `<section class="about-home" id="qui-sommes-nous">
    <div class="container about-home__grid">
      <div class="about-card">
        ${a.cardTitle ? `<h3 class="about-card__title">${escapeHtml(a.cardTitle)}</h3>` : ''}
        ${a.cardText ? `<p class="about-card__text">${richText(a.cardText, '')}</p>` : ''}
        ${a.badge ? `<span class="about-card__badge"><i></i>${escapeHtml(a.badge)}</span>` : ''}
        <div class="about-card__stats">
          ${(a.stats || []).filter(x => x.value || x.label).map(x => `<div class="about-stat">
            <div class="about-stat__value">${escapeHtml(x.value)}${x.suffix ? `<small>${escapeHtml(x.suffix)}</small>` : ''}</div>
            <div class="about-stat__label">${escapeHtml(x.label)}</div>
          </div>`).join('\n          ')}
        </div>
      </div>
      <div class="about-home__content">
        ${a.eyebrow ? `<span class="about-home__eyebrow">${escapeHtml(a.eyebrow)}</span>` : ''}
        <h2 class="about-home__title">${escapeHtml(a.title)}</h2>
        ${paras.map(x => `<p class="about-home__text">${richText(x.trim(), '')}</p>`).join('\n        ')}
        <ul class="about-values">
          ${(a.values || []).filter(v => v.title || v.text).map(v => `<li><strong>${escapeHtml(v.title)}</strong>${v.text ? ` : ${escapeHtml(v.text)}` : ''}</li>`).join('\n          ')}
        </ul>
        ${a.buttonLabel ? `<a class="btn-nav-cta about-home__btn" href="${escapeHtml(a.buttonHref || '')}">${escapeHtml(a.buttonLabel)}</a>` : ''}
      </div>
    </div>
  </section>`;
}

function renderCoverage(data) {
  const c = { ...DEFAULT_COVERAGE, ...(data || {}) };
  const regions = JSON.stringify({ regions: c.regions || [], hq: c.hqRegion || '' }).replace(/</g, '\\u003c');
  return `<section class="coverage" id="couverture">
    <div class="container">
      <div class="coverage__intro">
        <span class="coverage__eyebrow">${escapeHtml(c.eyebrow)}</span>
        <h2 class="coverage__title">${escapeHtml(c.title)}</h2>
        <p>${richText(c.text, '')}</p>
      </div>
      <div class="coverage__grid">
        <div class="coverage-map" id="coverage-map">
          <script type="application/json" class="coverage-map__data">${regions}</script>
          <div class="coverage-map__svg"></div>
          <div class="coverage-map__tooltip" hidden></div>
          <div class="coverage-map__legend"><span>Moins</span><i></i><i></i><i></i><i></i><i></i><span>Plus</span><b></b><span class="coverage-map__legend-hq">Siège</span></div>
        </div>
        <div class="coverage-cards">
          ${(c.cards || []).map((k, i) => `<div class="coverage-card${i === 0 ? ' coverage-card--dark' : ''}">
            <div class="coverage-card__value">${escapeHtml(k.value)}${k.suffix ? `<sup>${escapeHtml(k.suffix)}</sup>` : ''}</div>
            <div class="coverage-card__text">${multiline(k.text)}</div>
          </div>`).join('')}
          ${c.hqValue ? `<div class="coverage-card coverage-card--hq">
            <div class="coverage-card__label"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg> ${escapeHtml(c.hqLabel)}</div>
            <div class="coverage-card__value">${escapeHtml(c.hqValue)}</div>
            <div class="coverage-card__text">${multiline(c.hqText)}</div>
          </div>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

export function renderHomepage(homepage, pages, content) {
  const h = homepage || {};
  const cta = { ...DEFAULT_CONTENT.cta, ...(content?.cta || {}) };
  const hero = { ...DEFAULT_HERO, ...(h.hero || {}), photos: { ...DEFAULT_HERO.photos, ...(h.hero?.photos || {}) } };
  return `<main>

  <section class="hero">
    <div class="hero-bg" aria-hidden="true">
      <div><img src="${escapeHtml(hero.photos.big)}" alt="" onerror="this.remove()"></div>
      <div><img src="${escapeHtml(hero.photos.top)}" alt="" onerror="this.remove()"></div>
      <div><img src="${escapeHtml(hero.photos.bottom)}" alt="" onerror="this.remove()"></div>
      <div><img src="${escapeHtml(hero.photos.right)}" alt="" onerror="this.remove()"></div>
    </div>
    <div class="container hero-wrap">
      <div class="hero-content">
        ${hero.badge ? `<div class="hero-pill"><span class="star">★</span> ${escapeHtml(hero.badge)}</div>` : ''}
        <h1>${escapeHtml(hero.title).replace(/\*\*([^*\n]+)\*\*/g, '<em>$1</em>')}</h1>
        ${hero.text ? `<p class="hero-sub">${richText(hero.text, '')}</p>` : ''}
        <div class="hero-ctas">
          ${hero.primaryLabel ? `<a class="btn-hero-p" href="${escapeHtml(hero.primaryHref || '#')}">${escapeHtml(hero.primaryLabel)}</a>` : ''}
          ${hero.secondaryLabel ? `<a class="btn-hero-s" href="${escapeHtml(hero.secondaryHref || '#')}">${escapeHtml(hero.secondaryLabel)}</a>` : ''}
        </div>
      </div>
    </div>
  </section>

  <div class="sect-bar">
    <nav class="sect-grid" aria-label="Profils de clients">
    ${renderClientTypes(h, pages)}
    </nav>
  </div>

  <div class="container">
  ${renderAccompagnement(h.accompagnement)}
  </div>

  ${renderFinboost(h.finboost)}

  ${renderCoverage(h.coverage)}

  ${renderReussites(h.reussites)}

  ${renderProjectCta(h.projectCta)}

  ${renderAbout(h.about)}

</main>`;
}

export function homepagePage(homepage, pages, site = {}) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="viewport" content="width=device-width, initial-scale=1">
${metaTags(homepage?.seoTitle || `BPCE Finances & Territoires — ${String(homepage?.hero?.title || DEFAULT_HERO.title).replace(/\*\*/g, '')}`, homepage?.seoDescription || homepage?.hero?.text || DEFAULT_HERO.text)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles/site.css?v=20261101b">
</head>
<body>

${header(pages, '', site.navigation)}

${renderHomepage(homepage, pages, site.content)}

${footer(pages, '', site.navigation)}
<script src="nav.js" defer></script>
<script src="reussites-carousel.js" defer></script>
<script src="france-map.js?v=20261001b" defer></script>
</body>
</html>
`;
}

// Assemble la liste complète des pages à partir du socle statique protégé +
// des trois contenus éditables depuis l'admin (Expertises, Secteurs, Guide).
export function buildPages({ guideArticles, expertises, secteurs, content } = {}) {
  const basePages = BASE_PAGES.map(p => {
    const c = pageContent(p.slug, content);
    return { ...p, ...(c.title ? { title: c.title } : {}), ...(c.lead ? { lead: c.lead } : {}), ...(c.image !== undefined ? { image: c.image } : {}) };
  });
  return [...basePages, ...(expertises || []), ...(secteurs || []), ...(guideArticles || [])];
}
