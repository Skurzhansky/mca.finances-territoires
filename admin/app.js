import { config } from './config.js';
import { buildPages, page, homepagePage } from '../scripts/templates.mjs';

let state = null;

const RESOURCE_KINDS = {
  expertises: { key: 'expertises', section: 'expertise', type: 'expertise', itemNoun: 'cette page' },
  secteurs: { key: 'secteurs', section: 'secteur', type: 'secteur', itemNoun: 'cette page' },
};

function slugify(str) {
  return String(str || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Icônes (SVG inline, aucune dépendance externe) ----------

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H9.5a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-9"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="11" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="10" height="18"/><rect x="14" y="9" width="6" height="12"/><path d="M7 7h1M7 11h1M7 15h1M11 7h1M11 11h1M11 15h1M17 12h1M17 16h1"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 5.5 4 4L8 20H4v-4z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.5-5 3.5 4 2.5-3 4.5 5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
};

function setStatus(el, text, kind) {
  el.className = 'admin-status' + (kind ? ` admin-status--${kind}` : '');
  const icon = kind === 'ok' ? ICONS.check : kind === 'error' ? ICONS.alert : kind === 'progress' ? ICONS.info : '';
  el.innerHTML = text ? `${icon}<span>${escapeHtml(text)}</span>` : '';
}

function thumbHtml(image) {
  if (!image) return `<div class="admin-card__thumb-wrap"><div class="admin-card__thumb admin-card__thumb--placeholder">${ICONS.image}</div></div>`;
  return `<div class="admin-card__thumb-wrap">
    <div class="admin-card__thumb admin-card__thumb--placeholder">${ICONS.image}</div>
    <img class="admin-card__thumb" src="${escapeHtml(`${config.siteUrl}/${image}`)}" alt="" onerror="this.remove()">
  </div>`;
}

async function fetchJSON(path) {
  const res = await fetch(`${config.siteUrl}/${path}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Impossible de charger ${path} (${res.status})`);
  return res.json();
}

// ---------- Upload de photos ----------
// Les fichiers choisis ne sont envoyés à S3 qu'au moment de « Publier » —
// on les garde ici en mémoire, prêts à être uploadés.
const pendingUploads = new Map(); // clé S3 -> File

function extOf(file) {
  const m = /\.([a-zA-Z0-9]+)$/.exec(file.name);
  return m ? m[1].toLowerCase() : 'jpg';
}

function previewUrlFor(key) {
  if (!key) return '';
  if (pendingUploads.has(key)) return URL.createObjectURL(pendingUploads.get(key));
  return `${config.siteUrl}/${key}`;
}

// id : préfixe unique pour les éléments DOM de ce champ.
// label : texte affiché à côté de l'aperçu.
// key : clé S3 actuelle de la photo (peut être vide/absente).
function photoFieldHtml(id, label, key) {
  return `<div class="admin-photo-field">
    <img id="${id}-preview" src="${escapeHtml(previewUrlFor(key))}" alt="" onerror="this.style.visibility='hidden'">
    <div class="admin-photo-field__info">
      <span>${escapeHtml(label)}</span>
      <input type="file" id="${id}-input" accept="image/*">
    </div>
  </div>`;
}

// computeKey(ext) : calcule la clé S3 définitive pour le fichier choisi.
// onSelected(key) : appelé après sélection, pour que l'appelant mette à
// jour son brouillon avec la nouvelle clé.
function wirePhotoField(id, computeKey, onSelected) {
  const input = document.getElementById(`${id}-input`);
  if (!input) return;
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const key = computeKey(extOf(file));
    pendingUploads.set(key, file);
    const preview = document.getElementById(`${id}-preview`);
    preview.src = URL.createObjectURL(file);
    preview.style.visibility = '';
    onSelected(key);
  });
}

// ---------- Point d'entrée ----------

export async function mountAdmin(root, { user, credentials, signOut }) {
  state = {
    user, credentials,
    guideArticles: [], events: [], expertises: [], secteurs: [], homepage: {},
    originalPageSlugs: new Set(),
    view: { tab: 'accueil' },
    dirty: false,
  };

  root.innerHTML = `<div class="admin-login"><p>Chargement des données…</p></div>`;

  try {
    const [guideArticles, events, expertises, secteurs, homepage] = await Promise.all([
      fetchJSON('data/guide-articles.json'),
      fetchJSON('data/evenements.json'),
      fetchJSON('data/expertises.json'),
      fetchJSON('data/secteurs.json'),
      fetchJSON('data/homepage.json'),
    ]);
    state.guideArticles = guideArticles;
    state.events = events;
    state.expertises = expertises;
    state.secteurs = secteurs;
    state.homepage = homepage;
    state.originalPageSlugs = new Set([...guideArticles, ...expertises, ...secteurs].map(x => x.slug));
    state.originalPartnerImages = new Set((homepage.partners || []).map(p => p.image).filter(Boolean));
  } catch (err) {
    root.innerHTML = `<div class="admin-login"><p class="admin-error">Erreur de chargement : ${escapeHtml(err.message)}</p></div>`;
    return;
  }

  render(root, signOut);
}

const NAV_ITEMS = [
  { id: 'accueil', icon: 'home', label: 'Page d’accueil', count: () => null },
  { id: 'expertises', icon: 'briefcase', label: 'Expertises', count: () => state.expertises.length },
  { id: 'secteurs', icon: 'building', label: 'Secteurs', count: () => state.secteurs.length },
  { id: 'guide', icon: 'book', label: 'Guide', count: () => state.guideArticles.length },
  { id: 'evenements', icon: 'calendar', label: 'Événements', count: () => state.events.length },
];

function render(root, signOut) {
  root.innerHTML = `
    <div class="admin-app">
      <header class="admin-topbar">
        <div class="admin-topbar__brand">
          <span class="admin-topbar__brand-mark">FT</span>
          <span>Administration du site</span>
        </div>
        <div class="admin-topbar__actions">
          <span class="admin-topbar__user">${escapeHtml(state.user.profile?.email || '')}</span>
          <span id="dirty-badge" class="admin-badge" hidden>Modifications non publiées</span>
          <button id="publish-btn" class="btn btn--site btn-primary">Publier</button>
          <button id="signOut" class="btn">Se déconnecter</button>
        </div>
      </header>
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <nav class="admin-sidebar-nav">
            ${NAV_ITEMS.map(t => {
              const count = t.count();
              return `<button class="admin-nav-item${state.view.tab === t.id ? ' is-active' : ''}" data-tab="${t.id}">
                ${ICONS[t.icon]}<span>${escapeHtml(t.label)}</span>${count !== null ? `<span class="admin-nav-item__count">${count}</span>` : ''}
              </button>`;
            }).join('')}
          </nav>
        </aside>
        <main class="admin-main">
          <p id="publish-status" class="admin-status"></p>
          <div id="tab-content"></div>
        </main>
      </div>
    </div>`;

  document.getElementById('signOut').addEventListener('click', () => signOut());
  document.getElementById('publish-btn').addEventListener('click', () => publish(root, signOut));
  root.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      state.view = { tab: btn.dataset.tab };
      render(root, signOut);
    });
  });
  updateDirtyBadge();

  const content = document.getElementById('tab-content');
  if (state.view.tab === 'accueil') renderHomepageForm(content);
  else if (state.view.tab === 'expertises') renderResourceList(RESOURCE_KINDS.expertises, content, root, signOut);
  else if (state.view.tab === 'secteurs') renderResourceList(RESOURCE_KINDS.secteurs, content, root, signOut);
  else if (state.view.tab === 'guide') renderGuideList(content, root, signOut);
  else renderEventsList(content, root, signOut);
}

function updateDirtyBadge() {
  const badge = document.getElementById('dirty-badge');
  if (badge) badge.hidden = !state.dirty;
}

// ---------- Onglet Accueil ----------
// Un seul grand formulaire, organisé en sections repliables (<details>) pour
// rester lisible malgré le nombre de champs — chaque section correspond à
// un bloc visible de la page d'accueil, dans l'ordre où il apparaît.

function renderHomepageForm(content) {
  const draft = JSON.parse(JSON.stringify(state.homepage));
  // Garantit que les tableaux à taille fixe ont bien 3 entrées, même sur
  // d'anciennes données incomplètes.
  const fill3 = (arr, empty) => { arr = arr || []; while (arr.length < 3) arr.push({ ...empty }); return arr.slice(0, 3); };
  draft.introCards = fill3(draft.introCards, { title: '', text: '' });
  draft.stats = fill3(draft.stats, { value: '', label: '' });
  draft.values = fill3(draft.values, { title: '', text: '' });
  draft.testimonial = draft.testimonial || { quote: '', cite: '', footnote: '' };
  draft.heroPhotos = draft.heroPhotos || {};
  draft.clientTypes = draft.clientTypes || [];
  draft.partners = draft.partners || [];
  draft.faq = draft.faq || [];

  function section(id, title, bodyHtml, open) {
    return `<details class="admin-section"${open ? ' open' : ''}>
      <summary>${escapeHtml(title)}</summary>
      <div class="admin-section__body" id="${id}">${bodyHtml}</div>
    </details>`;
  }

  function paint() {
    content.innerHTML = `
      <form class="admin-form" id="homepage-form">
        <h2>Page d'accueil</h2>
        <p class="admin-hint">Modifiez les sections qui vous intéressent, puis « Enregistrer » en bas — la publication effective se fait ensuite avec le bouton « Publier » en haut de page.</p>
        <p id="homepage-save-status" class="admin-status admin-status--ok" style="margin:0;"></p>

        ${section('sec-hero', 'Bandeau principal (hero)', `
          <label>Titre
            <input type="text" id="f-hero-title" value="${escapeHtml(draft.heroTitle)}" required>
          </label>
          <label>Texte sous le titre
            <textarea id="f-hero-lead" rows="2" required>${escapeHtml(draft.heroLead)}</textarea>
          </label>
          <label>Texte du bouton
            <input type="text" id="f-cta-label" value="${escapeHtml(draft.ctaLabel)}" required>
          </label>
          <div class="admin-form-row">
            <label>Chiffre clé
              <input type="text" id="f-hero-stat-value" value="${escapeHtml(draft.heroStatValue)}">
            </label>
            <label>Légende du chiffre
              <input type="text" id="f-hero-stat-label" value="${escapeHtml(draft.heroStatLabel)}">
            </label>
          </div>
          <h3>Photos (6 emplacements du collage)</h3>
          ${photoFieldHtml('hero-big', 'Grande photo (gauche)', draft.heroPhotos.big)}
          ${photoFieldHtml('hero-tr1', 'Photo en haut à droite (1)', draft.heroPhotos.tr1)}
          ${photoFieldHtml('hero-tr2', 'Photo en haut à droite (2)', draft.heroPhotos.tr2)}
          ${photoFieldHtml('hero-bl', 'Photo en bas à gauche', draft.heroPhotos.bl)}
          ${photoFieldHtml('hero-br', 'Photo en bas à droite', draft.heroPhotos.br)}
          ${photoFieldHtml('hero-avatar', 'Photo ronde (médaillon)', draft.heroPhotos.avatar)}
        `, true)}

        ${section('sec-clients', 'Types de clients (rangée d’icônes)', `
          <p class="admin-hint">Libellés courts (l'icône et le lien restent fixes). Un type dont la page correspondante est masquée ou supprimée disparaîtra automatiquement de cette rangée.</p>
          ${draft.clientTypes.map((ct, i) => `<label>${escapeHtml(ct.slug)}
            <input type="text" class="f-ct-label" data-i="${i}" value="${escapeHtml(ct.label)}">
          </label>`).join('')}
        `, false)}

        ${section('sec-intro', 'Bloc « ingénierie financière » (3 cartes)', `
          <label>Titre du bloc
            <input type="text" id="f-intro-title" value="${escapeHtml(draft.introTitle)}">
          </label>
          <label>Texte du bloc
            <textarea id="f-intro-text" rows="3">${escapeHtml(draft.introText)}</textarea>
          </label>
          ${draft.introCards.map((c, i) => `<div class="admin-body-section">
            <input type="text" class="f-card-title" data-i="${i}" placeholder="Titre de la carte" value="${escapeHtml(c.title)}">
            <textarea class="f-card-text" data-i="${i}" rows="2" placeholder="Texte">${escapeHtml(c.text)}</textarea>
          </div>`).join('')}
        `, false)}

        ${section('sec-testimonial', 'Témoignage', `
          <label>Citation
            <textarea id="f-test-quote" rows="3">${escapeHtml(draft.testimonial.quote)}</textarea>
          </label>
          <label>Auteur
            <input type="text" id="f-test-cite" value="${escapeHtml(draft.testimonial.cite)}">
          </label>
          <label>Précision (sous le témoignage)
            <input type="text" id="f-test-footnote" value="${escapeHtml(draft.testimonial.footnote)}">
          </label>
        `, false)}

        ${section('sec-stats', 'Baromètre (statistiques)', `
          <label>Titre du bloc
            <input type="text" id="f-stats-title" value="${escapeHtml(draft.statsTitle)}">
          </label>
          ${draft.stats.map((s, i) => `<div class="admin-form-row">
            <label>Chiffre ${i + 1}
              <input type="text" class="f-stat-value" data-i="${i}" value="${escapeHtml(s.value)}">
            </label>
            <label>Légende ${i + 1}
              <input type="text" class="f-stat-label" data-i="${i}" value="${escapeHtml(s.label)}">
            </label>
          </div>`).join('')}
          <label>Légende générale
            <input type="text" id="f-stats-caption" value="${escapeHtml(draft.statsCaption)}">
          </label>
        `, false)}

        ${section('sec-values', 'Valeurs et engagements (3 items)', `
          <label>Titre du bloc
            <input type="text" id="f-values-title" value="${escapeHtml(draft.valuesTitle)}">
          </label>
          ${draft.values.map((v, i) => `<div class="admin-body-section">
            <input type="text" class="f-value-title" data-i="${i}" placeholder="Titre" value="${escapeHtml(v.title)}">
            <textarea class="f-value-text" data-i="${i}" rows="2" placeholder="Texte">${escapeHtml(v.text)}</textarea>
          </div>`).join('')}
        `, false)}

        ${section('sec-partners', 'Partenaires (logos)', `
          <label>Titre du bloc
            <input type="text" id="f-partners-title" value="${escapeHtml(draft.partnersTitle)}">
          </label>
          <div id="f-partners-list">
            ${draft.partners.map((p, i) => `<div class="admin-body-section" data-i="${i}">
              ${photoFieldHtml(`partner-${i}`, `Logo ${i + 1}`, p.image)}
              <input type="text" class="f-partner-alt" data-i="${i}" placeholder="Nom du partenaire" value="${escapeHtml(p.alt)}">
              <button type="button" class="btn btn--danger" data-remove-partner="${i}">Retirer</button>
            </div>`).join('')}
          </div>
          <button type="button" id="add-partner" class="btn">+ Ajouter un partenaire</button>
        `, false)}

        ${section('sec-faq', 'FAQ (questions)', `
          <label>Titre du bloc
            <input type="text" id="f-faq-title" value="${escapeHtml(draft.faqTitle)}">
          </label>
          <div id="f-faq-list">
            ${draft.faq.map((q, i) => `<div class="admin-body-section" data-i="${i}">
              <input type="text" class="f-faq-item" data-i="${i}" value="${escapeHtml(q)}">
              <button type="button" class="btn btn--danger" data-remove-faq="${i}">Retirer</button>
            </div>`).join('')}
          </div>
          <button type="button" id="add-faq" class="btn">+ Ajouter une question</button>
        `, false)}

        <div class="admin-form__actions">
          <button type="submit" class="btn btn--site btn-primary">Enregistrer</button>
        </div>
      </form>`;

    wirePhotoField('hero-big', ext => `images/uploads/homepage-hero-big.${ext}`, key => { draft.heroPhotos.big = key; });
    wirePhotoField('hero-tr1', ext => `images/uploads/homepage-hero-tr1.${ext}`, key => { draft.heroPhotos.tr1 = key; });
    wirePhotoField('hero-tr2', ext => `images/uploads/homepage-hero-tr2.${ext}`, key => { draft.heroPhotos.tr2 = key; });
    wirePhotoField('hero-bl', ext => `images/uploads/homepage-hero-bl.${ext}`, key => { draft.heroPhotos.bl = key; });
    wirePhotoField('hero-br', ext => `images/uploads/homepage-hero-br.${ext}`, key => { draft.heroPhotos.br = key; });
    wirePhotoField('hero-avatar', ext => `images/uploads/homepage-hero-avatar.${ext}`, key => { draft.heroPhotos.avatar = key; });
    draft.partners.forEach((p, i) => {
      p._uid = p._uid || `p${Math.random().toString(36).slice(2, 8)}`;
      wirePhotoField(`partner-${i}`, ext => `images/uploads/partner-${p._uid}.${ext}`, key => { p.image = key; });
    });

    document.getElementById('add-partner').addEventListener('click', () => {
      syncFormToDraft();
      draft.partners.push({ image: '', alt: '', _uid: `p${Math.random().toString(36).slice(2, 8)}` });
      paint();
    });
    content.querySelectorAll('[data-remove-partner]').forEach(btn => {
      btn.addEventListener('click', () => {
        syncFormToDraft();
        draft.partners.splice(Number(btn.dataset.removePartner), 1);
        paint();
      });
    });
    document.getElementById('add-faq').addEventListener('click', () => {
      syncFormToDraft();
      draft.faq.push('');
      paint();
    });
    content.querySelectorAll('[data-remove-faq]').forEach(btn => {
      btn.addEventListener('click', () => {
        syncFormToDraft();
        draft.faq.splice(Number(btn.dataset.removeFaq), 1);
        paint();
      });
    });

    document.getElementById('homepage-form').addEventListener('submit', e => {
      e.preventDefault();
      syncFormToDraft();
      draft.partners = draft.partners.filter(p => p.image || p.alt.trim());
      draft.faq = draft.faq.filter(q => q.trim());
      state.homepage = draft;
      state.dirty = true;
      updateDirtyBadge();
      setStatus(document.getElementById('homepage-save-status'), 'Enregistré localement — pensez à cliquer « Publier » en haut pour mettre le site à jour.', 'ok');
    });
  }

  function syncFormToDraft() {
    draft.heroTitle = document.getElementById('f-hero-title').value;
    draft.heroLead = document.getElementById('f-hero-lead').value;
    draft.ctaLabel = document.getElementById('f-cta-label').value;
    draft.heroStatValue = document.getElementById('f-hero-stat-value').value;
    draft.heroStatLabel = document.getElementById('f-hero-stat-label').value;
    content.querySelectorAll('.f-ct-label').forEach(el => { draft.clientTypes[Number(el.dataset.i)].label = el.value; });
    draft.introTitle = document.getElementById('f-intro-title').value;
    draft.introText = document.getElementById('f-intro-text').value;
    content.querySelectorAll('.f-card-title').forEach(el => { draft.introCards[Number(el.dataset.i)].title = el.value; });
    content.querySelectorAll('.f-card-text').forEach(el => { draft.introCards[Number(el.dataset.i)].text = el.value; });
    draft.testimonial.quote = document.getElementById('f-test-quote').value;
    draft.testimonial.cite = document.getElementById('f-test-cite').value;
    draft.testimonial.footnote = document.getElementById('f-test-footnote').value;
    draft.statsTitle = document.getElementById('f-stats-title').value;
    content.querySelectorAll('.f-stat-value').forEach(el => { draft.stats[Number(el.dataset.i)].value = el.value; });
    content.querySelectorAll('.f-stat-label').forEach(el => { draft.stats[Number(el.dataset.i)].label = el.value; });
    draft.statsCaption = document.getElementById('f-stats-caption').value;
    draft.valuesTitle = document.getElementById('f-values-title').value;
    content.querySelectorAll('.f-value-title').forEach(el => { draft.values[Number(el.dataset.i)].title = el.value; });
    content.querySelectorAll('.f-value-text').forEach(el => { draft.values[Number(el.dataset.i)].text = el.value; });
    draft.partnersTitle = document.getElementById('f-partners-title').value;
    content.querySelectorAll('.f-partner-alt').forEach(el => { draft.partners[Number(el.dataset.i)].alt = el.value; });
    draft.faqTitle = document.getElementById('f-faq-title').value;
    content.querySelectorAll('.f-faq-item').forEach(el => { draft.faq[Number(el.dataset.i)] = el.value; });
  }

  paint();
}

// ---------- Onglets Expertises / Secteurs (partagés) ----------

function renderResourceList(kind, content, root, signOut) {
  const items = state[kind.key];
  content.innerHTML = `
    <div class="admin-list-header">
      <div>
        <h2 class="admin-section-title">${kind.key === 'expertises' ? 'Expertises' : 'Secteurs'}</h2>
        <p class="admin-section-subtitle" style="margin:0;">${items.length} page${items.length > 1 ? 's' : ''}</p>
      </div>
      <button id="new-resource" class="btn btn--site btn-primary">+ Nouvelle page</button>
    </div>
    <div class="admin-list">
      ${items.map(x => `
        <div class="admin-card">
          ${thumbHtml(x.image)}
          <div class="admin-card__body">
            <div class="admin-card__title">${escapeHtml(x.title)}${x.hidden ? ' <span class="admin-badge">Masqué</span>' : ''}</div>
            <div class="admin-card__meta">/${escapeHtml(x.slug)}/</div>
          </div>
          <div class="admin-card__actions">
            <button class="icon-btn" data-edit="${escapeHtml(x.slug)}" title="Modifier" aria-label="Modifier">${ICONS.pencil}</button>
            <button class="icon-btn icon-btn--danger" data-delete="${escapeHtml(x.slug)}" title="Supprimer" aria-label="Supprimer">${ICONS.trash}</button>
          </div>
        </div>`).join('') || '<p class="admin-empty">Aucune page pour le moment.</p>'}
    </div>`;

  document.getElementById('new-resource').addEventListener('click', () => renderResourceForm(kind, content, root, signOut, null));
  content.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = state[kind.key].find(x => x.slug === btn.dataset.edit);
      renderResourceForm(kind, content, root, signOut, item);
    });
  });
  content.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm(`Supprimer ${kind.itemNoun} (${btn.dataset.delete}) ? La suppression ne sera effective qu'après publication.`)) return;
      state[kind.key] = state[kind.key].filter(x => x.slug !== btn.dataset.delete);
      state.dirty = true;
      render(root, signOut);
    });
  });
}

function renderResourceForm(kind, content, root, signOut, item) {
  const isNew = !item;
  const draft = item
    ? JSON.parse(JSON.stringify(item))
    : { slug: '', title: '', section: kind.section, type: kind.type, hidden: false, image: '', lead: '', features: [{ title: '', text: '' }] };

  function paint() {
    content.innerHTML = `
      <form class="admin-form" id="resource-form">
        <h2>${isNew ? 'Nouvelle page' : 'Modifier la page'}</h2>
        <label>Titre
          <input type="text" id="f-title" value="${escapeHtml(draft.title)}" required>
        </label>
        <label>Slug (URL)
          <input type="text" id="f-slug" value="${escapeHtml(draft.slug)}" required pattern="[a-z0-9-]+">
        </label>
        ${photoFieldHtml('resource-photo', 'Photo de bannière', draft.image)}
        <label>Texte d'introduction
          <textarea id="f-lead" rows="3" required>${escapeHtml(draft.lead)}</textarea>
        </label>
        <label style="flex-direction:row;align-items:center;gap:8px;">
          <input type="checkbox" id="f-hidden" ${draft.hidden ? 'checked' : ''} style="width:auto;">
          Masquer dans la navigation (menu, footer, pages liées) — la page reste accessible par son lien direct
        </label>
        <h3>Points clés</h3>
        <div id="f-features">
          ${draft.features.map((f, i) => `
            <div class="admin-body-section" data-i="${i}">
              <input type="text" class="f-feat-title" placeholder="Titre" value="${escapeHtml(f.title)}">
              <textarea class="f-feat-text" rows="3" placeholder="Texte">${escapeHtml(f.text)}</textarea>
              <button type="button" class="btn btn--danger" data-remove-feature="${i}">Retirer</button>
            </div>`).join('')}
        </div>
        <button type="button" id="add-feature" class="btn">+ Ajouter un point</button>
        <div class="admin-form__actions">
          <button type="submit" class="btn btn--site btn-primary">Enregistrer</button>
          <button type="button" id="cancel-form" class="btn">Annuler</button>
        </div>
      </form>`;

    document.getElementById('f-title').addEventListener('input', e => {
      draft.title = e.target.value;
      if (isNew) {
        draft.slug = slugify(draft.title);
        document.getElementById('f-slug').value = draft.slug;
      }
    });
    document.getElementById('f-slug').addEventListener('input', e => { draft.slug = slugify(e.target.value); });
    wirePhotoField('resource-photo', ext => `images/uploads/page-${draft.slug || 'nouvelle'}.${ext}`, key => { draft.image = key; });
    document.getElementById('add-feature').addEventListener('click', () => {
      syncFormToDraft();
      draft.features.push({ title: '', text: '' });
      paint();
    });
    content.querySelectorAll('[data-remove-feature]').forEach(btn => {
      btn.addEventListener('click', () => {
        syncFormToDraft();
        draft.features.splice(Number(btn.dataset.removeFeature), 1);
        if (!draft.features.length) draft.features.push({ title: '', text: '' });
        paint();
      });
    });
    document.getElementById('cancel-form').addEventListener('click', () => renderResourceList(kind, content, root, signOut));
    document.getElementById('resource-form').addEventListener('submit', e => {
      e.preventDefault();
      syncFormToDraft();
      if (!draft.slug) { alert('Le slug est obligatoire.'); return; }
      const clash = state[kind.key].find(x => x.slug === draft.slug && x !== item);
      if (clash) { alert('Ce slug est déjà utilisé par une autre page.'); return; }
      draft.features = draft.features.filter(f => f.title.trim() || f.text.trim());
      if (!draft.features.length) draft.features = [{ title: '', text: '' }];
      if (isNew) state[kind.key].push(draft);
      else Object.assign(item, draft);
      state.dirty = true;
      renderResourceList(kind, content, root, signOut);
      updateDirtyBadge();
    });
  }

  function syncFormToDraft() {
    draft.title = document.getElementById('f-title').value;
    draft.slug = slugify(document.getElementById('f-slug').value);
    draft.lead = document.getElementById('f-lead').value;
    draft.hidden = document.getElementById('f-hidden').checked;
    const titles = content.querySelectorAll('.f-feat-title');
    const texts = content.querySelectorAll('.f-feat-text');
    draft.features = Array.from(titles).map((t, i) => ({ title: t.value, text: texts[i].value }));
  }

  paint();
}

// ---------- Onglet Guide ----------

function renderGuideList(content, root, signOut) {
  content.innerHTML = `
    <div class="admin-list-header">
      <div>
        <h2 class="admin-section-title">Guide</h2>
        <p class="admin-section-subtitle" style="margin:0;">${state.guideArticles.length} article${state.guideArticles.length > 1 ? 's' : ''}</p>
      </div>
      <button id="new-article" class="btn btn--site btn-primary">+ Nouvel article</button>
    </div>
    <div class="admin-list">
      ${state.guideArticles.map(a => `
        <div class="admin-card">
          ${thumbHtml(a.image)}
          <div class="admin-card__body">
            <div class="admin-card__title">${escapeHtml(a.title)}</div>
            <div class="admin-card__meta">/${escapeHtml(a.slug)}/</div>
          </div>
          <div class="admin-card__actions">
            <button class="icon-btn" data-edit="${escapeHtml(a.slug)}" title="Modifier" aria-label="Modifier">${ICONS.pencil}</button>
            <button class="icon-btn icon-btn--danger" data-delete="${escapeHtml(a.slug)}" title="Supprimer" aria-label="Supprimer">${ICONS.trash}</button>
          </div>
        </div>`).join('') || '<p class="admin-empty">Aucun article pour le moment.</p>'}
    </div>`;

  document.getElementById('new-article').addEventListener('click', () => renderArticleForm(content, root, signOut, null));
  content.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const article = state.guideArticles.find(a => a.slug === btn.dataset.edit);
      renderArticleForm(content, root, signOut, article);
    });
  });
  content.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm(`Supprimer l'article « ${btn.dataset.delete} » ? La suppression ne sera effective qu'après publication.`)) return;
      state.guideArticles = state.guideArticles.filter(a => a.slug !== btn.dataset.delete);
      state.dirty = true;
      render(root, signOut);
    });
  });
}

function renderArticleForm(content, root, signOut, article) {
  const isNew = !article;
  const draft = article
    ? JSON.parse(JSON.stringify(article))
    : { slug: '', title: '', section: 'guide', type: 'article', image: '', intro: '', body: [['', '']] };

  function paint() {
    content.innerHTML = `
      <form class="admin-form" id="article-form">
        <h2>${isNew ? 'Nouvel article' : 'Modifier l’article'}</h2>
        <label>Titre
          <input type="text" id="f-title" value="${escapeHtml(draft.title)}" required>
        </label>
        <label>Slug (URL)
          <input type="text" id="f-slug" value="${escapeHtml(draft.slug)}" required pattern="[a-z0-9-]+">
        </label>
        ${photoFieldHtml('article-photo', 'Photo de l’article', draft.image)}
        <label>Introduction (chapô)
          <textarea id="f-intro" rows="3" required>${escapeHtml(draft.intro)}</textarea>
        </label>
        <h3>Sections</h3>
        <div id="f-body">
          ${draft.body.map((sec, i) => `
            <div class="admin-body-section" data-i="${i}">
              <input type="text" class="f-body-h" placeholder="Titre de section" value="${escapeHtml(sec[0])}">
              <textarea class="f-body-t" rows="3" placeholder="Texte">${escapeHtml(sec[1])}</textarea>
              <button type="button" class="btn btn--danger" data-remove-section="${i}">Retirer</button>
            </div>`).join('')}
        </div>
        <button type="button" id="add-section" class="btn">+ Ajouter une section</button>
        <div class="admin-form__actions">
          <button type="submit" class="btn btn--site btn-primary">Enregistrer</button>
          <button type="button" id="cancel-form" class="btn">Annuler</button>
        </div>
      </form>`;

    document.getElementById('f-title').addEventListener('input', e => {
      draft.title = e.target.value;
      if (isNew) {
        draft.slug = slugify(draft.title);
        document.getElementById('f-slug').value = draft.slug;
      }
    });
    document.getElementById('f-slug').addEventListener('input', e => { draft.slug = slugify(e.target.value); });
    wirePhotoField('article-photo', ext => `images/uploads/page-${draft.slug || 'nouvel-article'}.${ext}`, key => { draft.image = key; });
    document.getElementById('add-section').addEventListener('click', () => {
      syncFormToDraft();
      draft.body.push(['', '']);
      paint();
    });
    content.querySelectorAll('[data-remove-section]').forEach(btn => {
      btn.addEventListener('click', () => {
        syncFormToDraft();
        draft.body.splice(Number(btn.dataset.removeSection), 1);
        if (!draft.body.length) draft.body.push(['', '']);
        paint();
      });
    });
    document.getElementById('cancel-form').addEventListener('click', () => renderGuideList(content, root, signOut));
    document.getElementById('article-form').addEventListener('submit', e => {
      e.preventDefault();
      syncFormToDraft();
      if (!draft.slug) { alert('Le slug est obligatoire.'); return; }
      const clash = state.guideArticles.find(a => a.slug === draft.slug && a !== article);
      if (clash) { alert('Ce slug est déjà utilisé par un autre article.'); return; }
      draft.body = draft.body.filter(([h, t]) => h.trim() || t.trim());
      if (!draft.body.length) draft.body = [['', '']];
      if (isNew) state.guideArticles.push(draft);
      else Object.assign(article, draft);
      state.dirty = true;
      renderGuideList(content, root, signOut);
      updateDirtyBadge();
    });
  }

  function syncFormToDraft() {
    draft.title = document.getElementById('f-title').value;
    draft.slug = slugify(document.getElementById('f-slug').value);
    draft.intro = document.getElementById('f-intro').value;
    const heads = content.querySelectorAll('.f-body-h');
    const texts = content.querySelectorAll('.f-body-t');
    draft.body = Array.from(heads).map((h, i) => [h.value, texts[i].value]);
  }

  paint();
}

// ---------- Onglet Événements ----------

function renderEventsList(content, root, signOut) {
  content.innerHTML = `
    <div class="admin-list-header">
      <div>
        <h2 class="admin-section-title">Événements</h2>
        <p class="admin-section-subtitle" style="margin:0;">${state.events.length} événement${state.events.length > 1 ? 's' : ''}</p>
      </div>
      <button id="new-event" class="btn btn--site btn-primary">+ Nouvel événement</button>
    </div>
    <div class="admin-list">
      ${state.events.map((e, i) => `
        <div class="admin-card">
          <div class="admin-card__thumb-wrap"><div class="admin-card__thumb admin-card__thumb--placeholder">${ICONS.calendar}</div></div>
          <div class="admin-card__body">
            <div class="admin-card__title">${escapeHtml(e.title)}</div>
            <div class="admin-card__meta">${escapeHtml(e.date)}</div>
          </div>
          <div class="admin-card__actions">
            <button class="icon-btn" data-edit="${i}" title="Modifier" aria-label="Modifier">${ICONS.pencil}</button>
            <button class="icon-btn icon-btn--danger" data-delete="${i}" title="Supprimer" aria-label="Supprimer">${ICONS.trash}</button>
          </div>
        </div>`).join('') || '<p class="admin-empty">Aucun événement programmé.</p>'}
    </div>`;

  document.getElementById('new-event').addEventListener('click', () => renderEventForm(content, root, signOut, null));
  content.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => renderEventForm(content, root, signOut, state.events[Number(btn.dataset.edit)]));
  });
  content.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Supprimer cet événement ? La suppression ne sera effective qu’après publication.')) return;
      state.events.splice(Number(btn.dataset.delete), 1);
      state.dirty = true;
      render(root, signOut);
    });
  });
}

function renderEventForm(content, root, signOut, evt) {
  const isNew = !evt;
  const draft = evt ? { ...evt } : { date: '', title: '', description: '' };

  content.innerHTML = `
    <form class="admin-form" id="event-form">
      <h2>${isNew ? 'Nouvel événement' : 'Modifier l’événement'}</h2>
      <label>Date
        <input type="date" id="f-date" value="${escapeHtml(draft.date)}" required>
      </label>
      <label>Titre
        <input type="text" id="f-title" value="${escapeHtml(draft.title)}" required>
      </label>
      <label>Description
        <textarea id="f-description" rows="4">${escapeHtml(draft.description || '')}</textarea>
      </label>
      <div class="admin-form__actions">
        <button type="submit" class="btn btn--site btn-primary">Enregistrer</button>
        <button type="button" id="cancel-form" class="btn">Annuler</button>
      </div>
    </form>`;

  document.getElementById('cancel-form').addEventListener('click', () => renderEventsList(content, root, signOut));
  document.getElementById('event-form').addEventListener('submit', e => {
    e.preventDefault();
    draft.date = document.getElementById('f-date').value;
    draft.title = document.getElementById('f-title').value;
    draft.description = document.getElementById('f-description').value;
    if (isNew) state.events.push(draft);
    else Object.assign(evt, draft);
    state.events.sort((a, b) => a.date.localeCompare(b.date));
    state.dirty = true;
    renderEventsList(content, root, signOut);
    updateDirtyBadge();
  });
}

// ---------- Publication ----------

async function publish(root, signOut) {
  const statusEl = document.getElementById('publish-status');
  const btn = document.getElementById('publish-btn');
  btn.disabled = true;
  setStatus(statusEl, 'Publication en cours…', 'progress');

  try {
    const { S3Client, PutObjectCommand, DeleteObjectCommand } = await import('https://cdn.jsdelivr.net/npm/@aws-sdk/client-s3@3/+esm');
    const s3 = new S3Client({ region: config.region, credentials: state.credentials });

    const pages = buildPages({
      guideArticles: state.guideArticles,
      expertises: state.expertises,
      secteurs: state.secteurs,
    });
    const currentSlugs = new Set([...state.guideArticles, ...state.expertises, ...state.secteurs].map(x => x.slug));
    const deletedSlugs = [...state.originalPageSlugs].filter(s => !currentSlugs.has(s));

    const currentPartnerImages = new Set((state.homepage.partners || []).map(p => p.image).filter(Boolean));
    const deletedPartnerImages = [...state.originalPartnerImages].filter(k => !currentPartnerImages.has(k));

    let done = 0;
    const total = pages.length + 1 /* index.html */ + 5 /* fichiers data/*.json */
      + deletedSlugs.length + pendingUploads.size + deletedPartnerImages.length;
    const tick = () => { setStatus(statusEl, `Publication en cours… (${++done}/${total})`, 'progress'); };

    for (const [key, file] of pendingUploads) {
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: file,
        ContentType: file.type || 'application/octet-stream',
      }));
      tick();
    }

    for (const p of pages) {
      const html = page(p, pages, state.events);
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: `${p.slug}/index.html`,
        Body: html,
        ContentType: 'text/html; charset=utf-8',
      }));
      tick();
    }

    await s3.send(new PutObjectCommand({
      Bucket: config.bucket,
      Key: 'index.html',
      Body: homepagePage(state.homepage, pages),
      ContentType: 'text/html; charset=utf-8',
    }));
    tick();

    const dataFiles = {
      'data/guide-articles.json': state.guideArticles,
      'data/expertises.json': state.expertises,
      'data/secteurs.json': state.secteurs,
      'data/evenements.json': state.events,
      'data/homepage.json': state.homepage,
    };
    for (const [key, value] of Object.entries(dataFiles)) {
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: JSON.stringify(value, null, 2),
        ContentType: 'application/json',
      }));
      tick();
    }

    for (const slug of deletedSlugs) {
      await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: `${slug}/index.html` }));
      tick();
    }

    for (const key of deletedPartnerImages) {
      await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
      tick();
    }

    pendingUploads.clear();
    state.originalPageSlugs = currentSlugs;
    state.originalPartnerImages = currentPartnerImages;
    state.dirty = false;
    updateDirtyBadge();

    setStatus(statusEl, 'Publié. Invalidation du cache CloudFront…', 'progress');
    try {
      const { CloudFrontClient, CreateInvalidationCommand } = await import('https://cdn.jsdelivr.net/npm/@aws-sdk/client-cloudfront@3/+esm');
      const cf = new CloudFrontClient({ region: config.region, credentials: state.credentials });
      await cf.send(new CreateInvalidationCommand({
        DistributionId: config.cloudfrontDistributionId,
        InvalidationBatch: {
          CallerReference: String(Date.now()),
          Paths: { Quantity: 1, Items: ['/*'] },
        },
      }));
      setStatus(statusEl, 'Publié — les changements sont visibles immédiatement.', 'ok');
    } catch (cfErr) {
      setStatus(statusEl, 'Publié — le cache n’a pas pu être vidé automatiquement (droits manquants), les changements apparaîtront d’ici quelques minutes.', 'ok');
      console.warn(cfErr);
    }
  } catch (err) {
    console.error(err);
    setStatus(statusEl, `Erreur de publication : ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
  }
}
