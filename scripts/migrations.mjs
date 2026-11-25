// Migrations des données éditables (data/*.json).
//
// Le contenu publié depuis l'admin (S3) fait foi au déploiement : un simple
// changement des valeurs par défaut dans templates.mjs n'atteint donc jamais
// le site en ligne pour les clés déjà présentes dans les JSON publiés. Quand
// une refonte impose de remplacer une structure existante (menus, rangée de
// pictos…), on l'exprime ici, une fois, sous forme de migration numérotée :
// elle s'applique au chargement côté admin et à la génération côté déploiement,
// puis le fichier est marqué `_v` pour ne pas la rejouer. Les autres champs
// (textes édités par l'équipe) restent intacts.

import { DEFAULT_NAVIGATION, DEFAULT_HOMEPAGE_CLIENT_TYPES, DEFAULT_REUSSITES } from './templates.mjs';
import { EXPERTISE_BLOCKS, SECTEUR_BLOCKS, PAGE_BLOCKS } from './maquette-content.mjs';

const clone = v => JSON.parse(JSON.stringify(v));

// Pages au format de la maquette : ajoute bandeau coloré + blocs à une page qui
// n'en a pas encore. Les champs déjà présents (ex. un titre retouché) restent.
function applyMaquette(target, build) {
  if (!build || !target || Array.isArray(target.blocks)) return;
  const add = clone(build(target));
  for (const [k, v] of Object.entries(add)) if (!(k in target)) target[k] = v;
}

const MIGRATIONS = {
  navigation: [
    // v1 → v2 : arborescence validée par BPCE F&T (maquette octobre 2026).
    data => {
      data.header = data.header || {};
      data.header.expertisesMenu = clone(DEFAULT_NAVIGATION.header.expertisesMenu);
      data.header.aboutMenu = clone(DEFAULT_NAVIGATION.header.aboutMenu);
      data.header.ctaLabel = DEFAULT_NAVIGATION.header.ctaLabel;
    },
    // v3 : pied de page de la maquette (colonnes, liens légaux, texte, année).
    data => {
      const f = DEFAULT_NAVIGATION.footer;
      data.footer = data.footer || {};
      data.footer.columns = clone(f.columns);
      data.footer.legal = clone(f.legal);
      data.footer.text = f.text;
      data.footer.bottom = f.bottom;
    },
    // v4 : page d'entrée « Fonds privés / Mécénat » et libellés alignés sur la
    // relecture de contenu (novembre 2026). Ne touche que les valeurs d'origine.
    data => {
      const header = data.header || {};
      for (const g of header.expertisesMenu || []) {
        if (g.label === 'Fonds privés / Mécénat' && g.href === 'fonds-de-dotation-mecenat-local/') g.href = 'fonds-prives-mecenat/';
        for (const c of g.children || []) if (c.label === 'Fonds de dotation & Mécénat local') c.label = 'Fonds de dotation & collecte de fonds privés';
      }
      for (const g of header.aboutMenu || []) {
        for (const c of g.children || []) if (c.label === 'Collectivité & EPCI') c.label = 'Collectivités & EPCI';
      }
      for (const col of (data.footer || {}).columns || []) {
        for (const l of col.links || []) if (l.label === 'Fonds privés / Mécénat' && l.href === 'fonds-de-dotation-mecenat-local/') l.href = 'fonds-prives-mecenat/';
      }
    },
  ],
  homepage: [
    // v1 → v2 : rangée « picto cibles » (7 profils de clients) de la maquette.
    data => {
      data.clientTypes = clone(DEFAULT_HOMEPAGE_CLIENT_TYPES);
    },
    // v3 : bloc « Réussites » (carrousel) à la place du témoignage + Guide.
    data => {
      if (!data.reussites) data.reussites = clone(DEFAULT_REUSSITES);
      if (data.projectCta && data.projectCta.secondaryHref === 'finances-et-territoires/') data.projectCta.secondaryHref = 'detections-des-opportunites/';
    },
    // v4 : relecture de contenu (novembre 2026). Les blocs absents du JSON
    // prennent déjà les nouveaux défauts du gabarit ; ici on ne corrige que les
    // copies publiées qui ont encore exactement l'ancien texte.
    data => {
      const swap = (obj, key, from, to) => { if (obj && obj[key] === from) obj[key] = to; };
      for (const c of (data.accompagnement || {}).cards || []) {
        swap(c, 'text', 'Identification de toutes les aides mobilisables — en continu ou sur un projet ciblé.', 'Identification de toutes les aides mobilisables, pilotée par un consultant — en continu ou sur un projet ciblé.');
        swap(c, 'text', "Constitution et dépôt des dossiers d'aides françaises et européennes.", "Constitution et dépôt des dossiers d'aides françaises et européennes, par un consultant expérimenté.");
        if (Array.isArray(c.items)) {
          c.items = c.items.map(i => i === 'Alertes personnalisées sur les versements' ? 'Alertes personnalisées sur les échéances administratives et financières'
            : i === "Bilan d'exécution" ? "Appui aux bilans d'exécution (export et restitution projet par projet)" : i);
        }
        if (c.tag === 'Fonds privés / Mécénat') swap(c, 'linkHref', 'fonds-de-dotation-mecenat-local/', 'fonds-prives-mecenat/');
      }
      for (const f of (data.finboost || {}).features || []) {
        swap(f, 'text', 'Nationaux et européens, mis à jour en continu', "Nationaux et européens, mis à jour en continu par une équipe d'une vingtaine de personnes appuyée par l'IA");
      }
      const cv = data.coverage;
      if (cv && cv.hqLabel === 'Notre siège — Savoie' && cv.hqValue === '2 753') {
        cv.hqLabel = 'Moyenne nationale';
        cv.hqValue = '3 000';
        cv.hqText = 'dispositifs disponibles\npar département, en moyenne';
      }
      swap(data.projectCta, 'text', 'Nos experts évaluent votre situation et identifient les aides accessibles pour votre structure. Échanges gratuits et sans engagement.',
        'Décrivez-nous votre projet pour un premier échange gratuit et sans engagement avec nos équipes. Nos experts identifient ensuite précisément les aides accessibles à votre structure.');
    },
  ],
  pages: [
    // v1 → v2 : relecture de contenu (novembre 2026), sur les seules valeurs d'origine.
    data => {
      const p = data.pages || {};
      const fet = p['finances-et-territoires'];
      if (fet) {
        if (typeof fet.lead === 'string') fet.lead = fet.lead.replace('territoires depuis 20 ans.', 'territoires depuis 13 ans.');
        for (const st of fet.stats || []) if (st.value === '20 ans' && st.label === "d'expertise territoriale") st.value = '13 ans';
      }
      const ct = p.contact;
      if (ct) {
        if (typeof ct.lead === 'string') ct.lead = ct.lead.replace('un consultant vous recontacte pour un premier échange', 'notre équipe vous recontacte pour un premier échange');
        if (ct.formText === 'Remplissez ce formulaire pour nous présenter votre structure et vos besoins. Un de nos consultants vous recontactera dans les 48h ouvrées.') {
          ct.formText = 'Remplissez ce formulaire pour nous présenter votre structure et vos besoins. Nous vous recontacterons sous 48h ouvrées.';
        }
        for (const f of ct.faq || []) {
          if (f.text === "Une Note d'opportunité est remise en quelques jours après l'échange initial. Pour une Veille continue, la mise en route est rapide.") {
            f.text = "Une Note d'opportunité s'inscrit sur une échéance courte, généralement de quelques semaines selon la complexité du projet, après l'échange initial. Pour une Veille continue, la mise en route est rapide.";
          }
        }
      }
    },
    // v3 : pages au format de la maquette (bandeau coloré + blocs éditables).
    data => {
      data.pages = data.pages || {};
      for (const [slug, build] of Object.entries(PAGE_BLOCKS)) {
        const c = data.pages[slug] = data.pages[slug] || {};
        if (slug === 'secteurs-dactivite' && c.title === "Secteurs d'activité") delete c.title;
        applyMaquette(c, build);
      }
    },
  ],
};

export function currentVersion(name) {
  return (MIGRATIONS[name] || []).length + 1;
}

// Retourne { data, changed } : `data` est l'objet migré (muté en place).
export function migrate(name, data) {
  const steps = MIGRATIONS[name] || [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { data, changed: false };
  let v = Number(data._v) || 1;
  let changed = false;
  while (v - 1 < steps.length) {
    steps[v - 1](data);
    v += 1;
    changed = true;
  }
  if (changed) data._v = v;
  return { data, changed };
}

// --- Listes de pages (data/expertises.json, data/secteurs.json) ---
// Un tableau JSON ne peut pas porter de `_v` : chaque page porte le sien. Une
// étape reçoit (page, liste), ne vise que ses propres slugs, ne réécrit un
// champ que s'il a encore sa valeur d'origine et n'ajoute un bloc que s'il est
// absent — une saisie faite depuis l'admin n'est donc jamais écrasée, et un
// bloc supprimé volontairement ne réapparaît pas (la page est déjà à jour).

const ADDITIONS = {
  "nos-formations": {
    "headline": "Formations : développez vos compétences sur les Aides & Subventions",
    "lead": "Animées par des spécialistes du financement non bancaire, nos formations allient vision stratégique, méthodologie, retours d'expérience et outils opérationnels, afin de favoriser une mise en œuvre rapide et efficace.",
    "qualiopi": {
      "badgeText": "[À COMPLÉTER — texte et logo de certification Qualiopi de l'ancien site]",
      "certLink": "",
      "chiffresTitle": "Nos formations en chiffres",
      "chiffres": [
        {
          "value": "[?]",
          "label": "[À COMPLÉTER — chiffre clé 1]"
        },
        {
          "value": "[?]",
          "label": "[À COMPLÉTER — chiffre clé 2]"
        },
        {
          "value": "[?]",
          "label": "[À COMPLÉTER — chiffre clé 3]"
        }
      ],
      "appreciation": "[À COMPLÉTER — « Nos clients ont particulièrement apprécié... », texte réel de l'ancien site]",
      "moreInfoTitle": "Souhaitez-vous en savoir plus ?",
      "moreInfoText": "[À COMPLÉTER — texte réel de l'ancien site]",
      "outremerTitle": "Formations Outre-mer",
      "outremerText": "[À COMPLÉTER — texte réel de l'ancien site]",
      "pshTitle": "Accessibilité aux personnes en situation de handicap",
      "pshText": "[À COMPLÉTER — texte réel de l'ancien site]"
    },
    "coursesTitle": "Formations disponibles",
    "courses": [
      {
        "title": "Financements privés et fonds de dotation",
        "teaser": "Possibilité de formation en intra — nous consulter.",
        "level": "",
        "days": "",
        "modes": "Intra"
      },
      {
        "title": "[À COMPLÉTER — reprendre les formations secteur public de l'ancien site : titre, niveau, phrase d'accroche, Intra/Inter, Distanciel, nombre de jours, lien vers le programme]",
        "teaser": "",
        "level": "",
        "days": "",
        "modes": ""
      },
      {
        "title": "[À COMPLÉTER — formation « Entreprise », programme 2027 à intégrer]",
        "teaser": "",
        "level": "",
        "days": "",
        "modes": ""
      }
    ]
  },
  "optimaides-subventions": {
    "title": "Note d'opportunité",
    "lead": "Une étude ponctuelle, sur une échéance courte, pour identifier les dispositifs de financement mobilisables sur un projet ciblé.",
    "switchOffer": "Besoin d'un suivi continu plutôt que d'une étude ponctuelle ? Découvrez notre [Veille continue](veille-personnalisee/).",
    "features": [
      {
        "title": "Étude ciblée",
        "text": "Une analyse dédiée à votre projet, sans engagement dans la durée."
      },
      {
        "title": "Restitution détaillée",
        "text": "Une note présentant les dispositifs identifiés, leurs conditions et nos recommandations."
      },
      {
        "title": "Bascule possible",
        "text": "Si vos besoins évoluent, possibilité de basculer vers une Veille continue."
      }
    ],
    "stepsTitle": "Notre méthode",
    "steps": [
      {
        "title": "Prise de connaissance de votre projet",
        "text": "Nous échangeons avec vous sur votre projet, son calendrier et son plan de financement prévisionnel."
      },
      {
        "title": "Analyse d'éligibilité",
        "text": "Nous croisons votre projet avec l'ensemble des dispositifs disponibles via FinBoost pour identifier les financements mobilisables."
      },
      {
        "title": "Restitution et recommandations",
        "text": "Nous vous remettons une note détaillant les dispositifs identifiés, leurs conditions et nos recommandations pour la suite."
      }
    ]
  },
  "veille-personnalisee": {
    "switchOffer": "Besoin d'une réponse ponctuelle plutôt que d'un suivi continu ? Découvrez notre [Note d'opportunité](optimaides-subventions/).",
    "stepsTitle": "Notre méthode",
    "steps": [
      {
        "title": "Cadrage de votre périmètre",
        "text": "Nous définissons avec vous le ou les projets concernés, votre territoire et votre secteur d'activité, pour calibrer précisément la veille."
      },
      {
        "title": "Croisement avec l'ensemble des dispositifs",
        "text": "Via FinBoost, nous croisons votre périmètre avec l'ensemble des dispositifs disponibles : fonds européens, aides nationales, aides régionales, aides départementales, aides locales, AAP privés et fondations."
      },
      {
        "title": "Alertes et points réguliers",
        "text": "Vous êtes notifié dès qu'un dispositif pertinent s'ouvre, avec un point régulier de votre consultant pour prioriser les opportunités."
      }
    ]
  },
  "montage-des-dossiers": {
    "stepsTitle": "Notre processus",
    "steps": [
      {
        "title": "Cadrage du plan de financement",
        "text": "Nous construisons avec vous le plan de financement adapté à votre projet et identifions les financeurs à solliciter."
      },
      {
        "title": "Rédaction et dépôt des dossiers",
        "text": "Nous rédigeons les dossiers dans le respect des exigences de chaque financeur et assurons leur dépôt dans les délais."
      },
      {
        "title": "Suivi de l'instruction",
        "text": "Nous assurons l'interface avec les financeurs jusqu'à la décision, et vous tenons informé à chaque étape."
      }
    ],
    "testimonial": {
      "meta": "Témoignage client",
      "quote": "[À COMPLÉTER — témoignage client réel à ajouter ici]",
      "cite": "[Nom, fonction — à compléter]"
    },
    "faq": [
      {
        "title": "Quels types d'aides accompagnez-vous ?",
        "text": "Nous intervenons sur tous types d'aides : subventions d'État, fonds européens (FEDER, FSE+, FEADER...), aides régionales et départementales, dotations d'État (DETR, DSIL...), fonds ANAH, agences appels à projets ADEME, et bien d'autres selon votre secteur."
      }
    ]
  },
  "gestion-des-aides": {
    "outil": {
      "title": "Notre outil",
      "text": "Un tableau de bord dédié pour suivre en temps réel l'état de vos dossiers, vos échéances et les montants à percevoir, projet par projet."
    }
  },
  "fonds-de-dotation-mecenat-local": {
    "lead": "Nous connectons les projets porteurs d'intérêt général — collectivités, structures publiques, structures du médico-social ou associations — aux mécènes du territoire, principalement des PME et ETI, et vous accompagnons dans la création ou la relance d'un fonds de dotation pour mobiliser durablement le mécénat local.",
    "duree": {
      "title": "Accompagnement dans la durée",
      "text": "Présents avant, pendant et après le lancement de votre campagne de collecte, sur une période qui dure en moyenne 18 mois."
    }
  }
};

const FONDS_PRIVES_HUB = {
  slug: 'fonds-prives-mecenat',
  title: 'Fonds privés / Mécénat',
  section: 'expertise',
  type: 'expertise',
  hidden: false,
  image: 'images/handshake-contrat.webp',
  lead: 'Diversifiez vos financements grâce aux ressources privées : de la création de votre fonds de dotation à la mobilisation des mécènes et des fondations.',
  features: [
    { title: 'Fonds de dotation & collecte de fonds privés', text: 'Création ou relance de votre fonds de dotation et accompagnement de vos campagnes de collecte. [En savoir plus](fonds-de-dotation-mecenat-local/)' },
    { title: 'Recherche de mécènes', text: 'Identification et sollicitation des entreprises du territoire susceptibles de soutenir votre projet. [En savoir plus](fundraising/)' },
    { title: 'AAP de fondations', text: 'Repérage des appels à projets des fondations privées et accompagnement dans leur sollicitation. [En savoir plus](recherche-de-fondations/)' },
  ],
};

const LIST_MIGRATIONS = {
  expertises: [
    // v1 → v2 : pages des sous-menus (relecture de contenu, novembre 2026).
    (item, list) => {
      const A = ADDITIONS;
      const swap = (key, from, to) => { if (item[key] === from) item[key] = to; };
      const addMissing = (key, value) => { if (!(key in item)) item[key] = clone(value); };
      switch (item.slug) {
        case 'nos-formations':
          addMissing('headline', A['nos-formations'].headline);
          swap('lead', 'Nous formons vos équipes aux méthodes et outils du financement de projets, pour gagner en autonomie.', A['nos-formations'].lead);
          for (const f of item.features || []) if (f.title === '20 ans de pratique') f.title = '13 ans de pratique';
          addMissing('qualiopi', A['nos-formations'].qualiopi);
          addMissing('coursesTitle', A['nos-formations'].coursesTitle);
          addMissing('courses', A['nos-formations'].courses);
          break;
        case 'optimaides-subventions':
          // La page portait l'ancien outil « Optim Aides & Subventions » alors
          // que le menu l'annonce comme « Note d'opportunité ».
          if (item.title === 'Optim Aides & Subventions') {
            item.title = A['optimaides-subventions'].title;
            item.lead = A['optimaides-subventions'].lead;
            item.features = clone(A['optimaides-subventions'].features);
          }
          addMissing('switchOffer', A['optimaides-subventions'].switchOffer);
          addMissing('stepsTitle', A['optimaides-subventions'].stepsTitle);
          addMissing('steps', A['optimaides-subventions'].steps);
          break;
        case 'veille-personnalisee':
          swap('title', 'Veille personnalisée', 'Veille continue');
          addMissing('switchOffer', A['veille-personnalisee'].switchOffer);
          addMissing('stepsTitle', A['veille-personnalisee'].stepsTitle);
          addMissing('steps', A['veille-personnalisee'].steps);
          break;
        case 'montage-des-dossiers':
          for (const k of ['stepsTitle', 'steps', 'testimonial', 'faq']) addMissing(k, A['montage-des-dossiers'][k]);
          break;
        case 'gestion-des-aides':
          swap('title', 'Gestion des aides', 'Gestion des aides obtenues');
          if (Array.isArray(item.features) && !item.features.some(f => f.title === A['gestion-des-aides'].outil.title)) item.features.push(clone(A['gestion-des-aides'].outil));
          break;
        case 'fonds-de-dotation-mecenat-local':
          swap('title', 'Fonds de dotation & mécénat local', 'Fonds de dotation & collecte de fonds privés');
          swap('lead', "Nous vous accompagnons dans la création ou la relance d'un fonds de dotation pour mobiliser durablement le mécénat local.", A['fonds-de-dotation-mecenat-local'].lead);
          if (Array.isArray(item.features) && !item.features.some(f => f.title === A['fonds-de-dotation-mecenat-local'].duree.title)) item.features.push(clone(A['fonds-de-dotation-mecenat-local'].duree));
          if (!list.some(x => x.slug === FONDS_PRIVES_HUB.slug)) {
            list.splice(list.indexOf(item), 0, { ...clone(FONDS_PRIVES_HUB), _v: 2 }); // a déjà le contenu de l'étape 1, reçoit les suivantes
          }
          break;
        case 'fundraising':
          swap('title', 'Fundraising', 'Recherche de mécènes');
          break;
        case 'recherche-de-fondations':
          swap('title', 'Recherche de fondations', 'AAP de fondations');
          break;
      }
    },
    // v3 : pages au format de la maquette (bandeau coloré + blocs éditables).
    item => applyMaquette(item, EXPERTISE_BLOCKS[item.slug]),
  ],
  secteurs: [
    // v1 → v2 : intitulés des profils de clients alignés sur l'arborescence validée.
    item => {
      const titles = {
        'collectivites-epci': ['Collectivité & EPCI', 'Collectivités & EPCI'],
        'etablissements-de-sante-publics-non-lucratifs': ['Santé non lucratif', 'Santé (non lucratif)'],
        'logement-social': ['Logement social', 'Bailleurs sociaux'],
        'entreprises-publiques-locales-epl': ['Entreprises publiques locales (EPL)', 'Entreprise Publique Locale'],
      };
      const t = titles[item.slug];
      if (t && item.title === t[0]) item.title = t[1];
    },
    // v3 : pages au format de la maquette (bandeau coloré + blocs éditables).
    item => applyMaquette(item, SECTEUR_BLOCKS[item.slug]),
  ],
};

export function currentListVersion(name) {
  return (LIST_MIGRATIONS[name] || []).length + 1;
}

// Retourne { data, changed } : la liste est migrée en place, page par page.
export function migrateList(name, list) {
  const steps = LIST_MIGRATIONS[name] || [];
  if (!Array.isArray(list)) return { data: list, changed: false };
  let changed = false;
  // Une étape peut insérer une page (ex. page d'entrée) : on reboucle pour
  // qu'elle reçoive aussi les étapes suivantes.
  const seen = new Set();
  let pending = list.filter(i => !seen.has(i));
  while (pending.length) {
  for (const item of pending) {
    seen.add(item);
    if (!item || typeof item !== 'object') continue;
    let v = Number(item._v) || 1;
    if (v - 1 >= steps.length) continue;
    while (v - 1 < steps.length) {
      steps[v - 1](item, list);
      v += 1;
    }
    item._v = v;
    changed = true;
  }
  pending = list.filter(i => !seen.has(i));
  }
  return { data: list, changed };
}
