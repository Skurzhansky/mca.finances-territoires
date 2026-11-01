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

const clone = v => JSON.parse(JSON.stringify(v));

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
