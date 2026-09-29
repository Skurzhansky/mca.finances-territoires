import { config } from './config.js';
import { buildPages, page, homepagePage, BASE_PAGES, DEFAULT_NAVIGATION, DEFAULT_CONTENT, DEFAULT_FINBOOST, DEFAULT_COVERAGE } from '../scripts/templates.mjs';

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
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>',
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

// navigation.json / pages.json peuvent ne pas encore exister en ligne (première
// publication après cette mise à jour) : on repart alors des valeurs par défaut
// des gabarits, identiques au site actuel.
async function fetchJSONOrDefault(path, fallback) {
  try {
    return await fetchJSON(path);
  } catch {
    return JSON.parse(JSON.stringify(fallback));
  }
}

// ---------- Brouillon courant ----------

function site() {
  return { navigation: state.navigation, content: state.content };
}

function currentPages() {
  return buildPages({
    guideArticles: state.guideArticles,
    expertises: state.expertises,
    secteurs: state.secteurs,
    content: state.content,
  });
}

// Aperçu : le HTML est généré avec les mêmes gabarits que la publication, puis
// ouvert dans un onglet. Une balise <base> fait pointer CSS, images et liens
// vers le site en ligne ; les photos choisies mais pas encore publiées sont
// remplacées par leur aperçu local.
function openPreview(slug) {
  const pages = currentPages();
  let html = slug
    ? page(pages.find(p => p.slug === slug) || pages[0], pages, state.events, site())
    : homepagePage(state.homepage, pages, site());
  const baseHref = `${config.siteUrl}/${slug ? `${slug}/` : ''}`;
  html = html.replace('<head>', `<head>\n<base href="${baseHref}">`);
  for (const [key, file] of pendingUploads) {
    html = html.split(key).join(URL.createObjectURL(file));
  }
  const win = window.open('', '_blank');
  if (!win) { alert('Le navigateur a bloqué l’ouverture de l’aperçu. Autorisez les fenêtres pop-up pour ce site.'); return; }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function previewButton(slug, label = 'Aperçu') {
  return `<button type="button" class="btn" data-preview="${escapeHtml(slug || '')}">${escapeHtml(label)}</button>`;
}

function wirePreviewButtons(container, beforePreview) {
  container.querySelectorAll('[data-preview]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (beforePreview) beforePreview();
      openPreview(btn.dataset.preview || null);
    });
  });
}

// ---------- Champs pilotés par chemin (data-path) ----------
// Chaque champ porte le chemin de la valeur qu'il édite dans le brouillon
// (ex. "footer.columns.0.links.2.label"), ce qui évite d'écrire un
// synchroniseur spécifique par formulaire.

function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setByPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] == null) cur[parts[i]] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

function syncPaths(container, draft) {
  container.querySelectorAll('[data-path]').forEach(el => setByPath(draft, el.dataset.path, el.value));
}

function pathField(label, path, value, { rows, hint } = {}) {
  const input = rows
    ? `<textarea rows="${rows}" data-path="${escapeHtml(path)}">${escapeHtml(value ?? '')}</textarea>`
    : `<input type="text" data-path="${escapeHtml(path)}" value="${escapeHtml(value ?? '')}">`;
  return `<label>${escapeHtml(label)}
    ${input}
  </label>${hint ? `<p class="admin-hint">${escapeHtml(hint)}</p>` : ''}`;
}

function itemToolbar(path, index, length) {
  return `<div class="admin-item-toolbar">
    <button type="button" class="btn" data-move="${escapeHtml(path)}.${index}" data-dir="-1" ${index === 0 ? 'disabled' : ''} title="Monter">↑</button>
    <button type="button" class="btn" data-move="${escapeHtml(path)}.${index}" data-dir="1" ${index === length - 1 ? 'disabled' : ''} title="Descendre">↓</button>
    <button type="button" class="btn btn--danger" data-remove="${escapeHtml(path)}.${index}">Retirer</button>
  </div>`;
}

// Boutons génériques d'édition de listes : ajout (data-add + data-template),
// suppression (data-remove) et réordonnancement (data-move + data-dir).
function wireArrayButtons(container, draft, paint, templates) {
  container.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      syncPaths(container, draft);
      const arr = getByPath(draft, btn.dataset.add) || [];
      arr.push(JSON.parse(JSON.stringify(templates[btn.dataset.template])));
      setByPath(draft, btn.dataset.add, arr);
      paint();
    });
  });
  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      syncPaths(container, draft);
      const parts = btn.dataset.remove.split('.');
      const index = Number(parts.pop());
      getByPath(draft, parts.join('.')).splice(index, 1);
      paint();
    });
  });
  container.querySelectorAll('[data-move]').forEach(btn => {
    btn.addEventListener('click', () => {
      syncPaths(container, draft);
      const parts = btn.dataset.move.split('.');
      const index = Number(parts.pop());
      const arr = getByPath(draft, parts.join('.'));
      const target = index + Number(btn.dataset.dir);
      if (target < 0 || target >= arr.length) return;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      paint();
    });
  });
}

function seoFieldsHtml(draft, prefix = '') {
  const p = prefix ? `${prefix}.` : '';
  return `<p class="admin-hint">Laissés vides, ces champs reprennent le titre et le chapô de la page.</p>
    ${pathField('Titre SEO (balise <title>)', `${p}seoTitle`, getByPath(draft, `${p}seoTitle`))}
    ${pathField('Méta description', `${p}seoDescription`, getByPath(draft, `${p}seoDescription`), { rows: 2 })}`;
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
    <img id="${id}-preview" src="${escapeHtml(previewUrlFor(key))}" alt="" ${key ? '' : 'style="visibility:hidden"'} onerror="this.style.visibility='hidden'">
    <div class="admin-photo-field__info">
      <span>${escapeHtml(label)}</span>
      <div class="admin-photo-field__actions">
        <label class="btn btn--small">${ICONS.upload}<span>Téléverser</span><input type="file" id="${id}-input" accept="image/*" hidden></label>
        <button type="button" class="btn btn--small" id="${id}-pick">${ICONS.image}<span>Médiathèque</span></button>
        <button type="button" class="btn btn--small btn--danger" id="${id}-clear">Retirer</button>
      </div>
    </div>
  </div>`;
}

// computeKey(ext) : calcule la clé S3 définitive pour le fichier choisi.
// onSelected(key) : appelé après sélection (téléversement, choix dans la
// médiathèque ou retrait — clé vide), pour que l'appelant mette à jour son
// brouillon.
function wirePhotoField(id, computeKey, onSelected) {
  const input = document.getElementById(`${id}-input`);
  if (!input) return;
  const preview = document.getElementById(`${id}-preview`);
  const show = key => {
    preview.src = previewUrlFor(key);
    preview.style.visibility = key ? '' : 'hidden';
    onSelected(key);
  };
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const key = computeKey(extOf(file));
    pendingUploads.set(key, file);
    pendingDeletes.delete(key);
    show(key);
  });
  document.getElementById(`${id}-pick`).addEventListener('click', () => openMediaPicker(show));
  document.getElementById(`${id}-clear`).addEventListener('click', () => {
    input.value = '';
    show('');
  });
}

// ---------- Éditeur de texte (mise en forme légère) ----------
// Les zones de texte longues reçoivent une barre d'outils qui insère la
// syntaxe comprise par richText() dans les gabarits : **gras**, *italique*,
// [lien](url). Les retours à la ligne sont conservés à l'affichage.

const PLAIN_TEXTAREA = el => /seo/i.test(el.id) || /seoDescription$/.test(el.dataset.path || '');

function wrapSelection(ta, before, after, placeholder) {
  const { selectionStart: start, selectionEnd: end, value } = ta;
  const selected = value.slice(start, end) || placeholder;
  ta.value = value.slice(0, start) + before + selected + after + value.slice(end);
  ta.focus();
  ta.setSelectionRange(start + before.length, start + before.length + selected.length);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}

function enhanceTextarea(ta) {
  if (ta.dataset.rte || PLAIN_TEXTAREA(ta)) return;
  ta.dataset.rte = '1';
  const bar = document.createElement('div');
  bar.className = 'admin-rte-toolbar';
  bar.innerHTML = `
    <button type="button" data-rte="bold" title="Gras (Ctrl+B)"><strong>G</strong></button>
    <button type="button" data-rte="italic" title="Italique (Ctrl+I)"><em>I</em></button>
    <button type="button" data-rte="link" title="Lien (Ctrl+K)">Lien</button>
    <span class="admin-rte-toolbar__hint">Entrée = retour à la ligne</span>`;
  const actions = {
    bold: () => wrapSelection(ta, '**', '**', 'texte en gras'),
    italic: () => wrapSelection(ta, '*', '*', 'texte en italique'),
    link: () => {
      const url = prompt('Adresse du lien (ex. contact/ ou https://…)');
      if (url) wrapSelection(ta, '[', `](${url.trim()})`, 'libellé du lien');
    },
  };
  bar.querySelectorAll('[data-rte]').forEach(btn => {
    btn.addEventListener('mousedown', e => e.preventDefault());
    btn.addEventListener('click', e => { e.preventDefault(); actions[btn.dataset.rte](); });
  });
  ta.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = { b: 'bold', i: 'italic', k: 'link' }[e.key.toLowerCase()];
    if (k) { e.preventDefault(); actions[k](); }
  });
  ta.classList.add('admin-rte-textarea');
  ta.parentNode.insertBefore(bar, ta);
}

// Les listes de pages reçoivent un champ de recherche instantanée.
function enhanceList(list) {
  if (list.dataset.search || list.querySelectorAll('.admin-card').length < 4) return;
  list.dataset.search = '1';
  const box = document.createElement('label');
  box.className = 'admin-search';
  box.innerHTML = `${ICONS.search}<input type="search" placeholder="Rechercher…" aria-label="Rechercher">`;
  const input = box.querySelector('input');
  const empty = document.createElement('p');
  empty.className = 'admin-empty';
  empty.textContent = 'Aucun résultat.';
  empty.hidden = true;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    list.querySelectorAll('.admin-card').forEach(card => {
      const match = !q || card.textContent.toLowerCase().includes(q);
      card.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown > 0;
  });
  list.parentNode.insertBefore(box, list);
  list.appendChild(empty);
}

function enhanceAll(root) {
  root.querySelectorAll('textarea:not([data-rte])').forEach(enhanceTextarea);
  root.querySelectorAll('.admin-list:not([data-search])').forEach(enhanceList);
}

let textareaObserver = null;
function enhanceTextareas(root) {
  enhanceAll(root);
  if (textareaObserver) textareaObserver.disconnect();
  textareaObserver = new MutationObserver(() => enhanceAll(root));
  textareaObserver.observe(root, { childList: true, subtree: true });
}

// ---------- Médiathèque ----------
// Liste des images du bucket (préfixe images/), complétée par les fichiers
// en attente de publication. Les suppressions ne sont appliquées sur S3
// qu'au moment de « Publier », comme les téléversements.

const pendingDeletes = new Set(); // clés S3 à supprimer à la publication
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|avif)$/i;

async function loadMedia() {
  const referenced = [...new Set(allDataText().match(/images\/[^"'\s)]+/g) || [])];
  let items;
  let listError = null;
  try {
    const { S3Client, ListObjectsV2Command } = await import('https://cdn.jsdelivr.net/npm/@aws-sdk/client-s3@3/+esm');
    const s3 = new S3Client({ region: config.region, credentials: state.credentials });
    items = [];
    let token;
    do {
      const res = await s3.send(new ListObjectsV2Command({ Bucket: config.bucket, Prefix: 'images/', ContinuationToken: token }));
      for (const o of res.Contents || []) {
        if (IMAGE_EXT.test(o.Key)) items.push({ key: o.Key, size: o.Size, date: o.LastModified });
      }
      token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
  } catch (err) {
    console.warn(err);
    listError = err;
    items = referenced.filter(k => IMAGE_EXT.test(k)).map(key => ({ key }));
  }
  let staticText = '';
  try {
    const texts = await Promise.all(['scripts/templates.mjs', 'styles/site.css'].map(f =>
      fetch(`${config.siteUrl}/${f}`, { cache: 'no-store' }).then(r => (r.ok ? r.text() : ''))));
    staticText = texts.join('\n');
  } catch { /* ignoré : seules les données JSON servent alors au calcul d'usage */ }
  state.media = { items, listError, staticText };
}

function allDataText() {
  return JSON.stringify([state.homepage, state.navigation, state.content, state.expertises, state.secteurs, state.guideArticles, state.events]);
}

function mediaItems() {
  const known = new Set(state.media.items.map(i => i.key));
  const pending = [...pendingUploads.keys()].filter(k => !known.has(k)).map(key => ({ key, size: pendingUploads.get(key).size, pending: true }));
  return [...pending, ...state.media.items.map(i => ({ ...i, pending: pendingUploads.has(i.key) }))]
    .filter(i => !pendingDeletes.has(i.key));
}

function mediaUsage(key) {
  const data = allDataText();
  const inData = data.split(`"${key}"`).length - 1;
  const inStatic = state.media?.staticText.includes(key) ? 1 : 0;
  return inData + inStatic;
}

function formatSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

function uploadKeyFor(file) {
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'photo';
  return `images/uploads/${base}-${Math.random().toString(36).slice(2, 7)}.${extOf(file)}`;
}

function addMediaFiles(files) {
  const keys = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const key = uploadKeyFor(file);
    pendingUploads.set(key, file);
    keys.push(key);
  }
  if (keys.length) { state.dirty = true; updateDirtyBadge(); }
  return keys;
}

function mediaGridHtml(items, { picker = false } = {}) {
  if (!items.length) return '<p class="admin-hint">Aucune photo trouvée.</p>';
  return `<div class="admin-media-grid">${items.map(i => {
    const used = mediaUsage(i.key);
    const name = i.key.split('/').pop();
    return `<figure class="admin-media-card" data-key="${escapeHtml(i.key)}">
      <button type="button" class="admin-media-card__thumb" ${picker ? `data-choose="${escapeHtml(i.key)}"` : `data-open="${escapeHtml(i.key)}"`} title="${escapeHtml(i.key)}">
        <img src="${escapeHtml(previewUrlFor(i.key))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      </button>
      <figcaption>
        <span class="admin-media-card__name" title="${escapeHtml(i.key)}">${escapeHtml(name)}</span>
        <span class="admin-media-card__meta">
          ${i.pending ? '<span class="admin-chip admin-chip--warn">À publier</span>' : ''}
          ${used ? `<span class="admin-chip">Utilisée${used > 1 ? ` ×${used}` : ''}</span>` : '<span class="admin-chip admin-chip--muted">Non utilisée</span>'}
          <span>${formatSize(i.size)}</span>
        </span>
        ${picker ? '' : `<span class="admin-media-card__actions">
          <button type="button" class="icon-btn" data-copy="${escapeHtml(i.key)}" title="Copier le chemin">${ICONS.file}</button>
          <button type="button" class="icon-btn icon-btn--danger" data-delete="${escapeHtml(i.key)}" title="Supprimer">${ICONS.trash}</button>
        </span>`}
      </figcaption>
    </figure>`;
  }).join('')}</div>`;
}

function filterMedia(items, query) {
  const q = query.trim().toLowerCase();
  return q ? items.filter(i => i.key.toLowerCase().includes(q)) : items;
}

function dropZoneHtml(id) {
  return `<label class="admin-dropzone" id="${id}">
    ${ICONS.upload}
    <span><strong>Glissez-déposez vos photos ici</strong> ou cliquez pour les choisir</span>
    <input type="file" accept="image/*" multiple hidden>
  </label>`;
}

function wireDropZone(zone, onFiles) {
  const input = zone.querySelector('input');
  input.addEventListener('change', () => { onFiles([...input.files]); input.value = ''; });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('is-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('is-over');
    onFiles([...e.dataTransfer.files]);
  });
}

async function renderMediaLibrary(content) {
  if (!state.media) {
    content.innerHTML = '<p class="admin-hint">Chargement de la médiathèque…</p>';
    await loadMedia();
    if (state.view.tab !== 'medias') return;
  }
  let query = '';

  function paint() {
    const items = filterMedia(mediaItems(), query);
    content.innerHTML = `
      <h2 class="admin-section-title">Médiathèque</h2>
      <p class="admin-hint">Toutes les photos du site. Ajoutez-en, supprimez celles qui ne servent plus, puis cliquez « Publier » en haut pour appliquer les changements.</p>
      ${state.media.listError ? '<p class="admin-status admin-status--error">Liste complète du stockage indisponible (droit « ListBucket » manquant) — seules les photos utilisées par le site sont affichées.</p>' : ''}
      <p id="media-status" class="admin-status"></p>
      ${dropZoneHtml('media-drop')}
      <input type="search" id="media-search" class="admin-media-search" placeholder="Rechercher une photo…" value="${escapeHtml(query)}">
      <p class="admin-hint">${items.length} photo(s)</p>
      ${mediaGridHtml(items)}`;

    const search = document.getElementById('media-search');
    search.addEventListener('input', () => {
      query = search.value;
      const pos = search.selectionStart;
      paint();
      const s2 = document.getElementById('media-search');
      s2.focus();
      s2.setSelectionRange(pos, pos);
    });
    wireDropZone(document.getElementById('media-drop'), files => {
      const keys = addMediaFiles(files);
      paint();
      if (keys.length) setStatus(document.getElementById('media-status'), `${keys.length} photo(s) ajoutée(s) — cliquez « Publier » pour les mettre en ligne.`, 'ok');
    });
    content.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => window.open(previewUrlFor(btn.dataset.open), '_blank')));
    content.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        setStatus(document.getElementById('media-status'), `Chemin copié : ${btn.dataset.copy}`, 'ok');
      } catch {
        prompt('Chemin de la photo :', btn.dataset.copy);
      }
    }));
    content.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => {
      const key = btn.dataset.delete;
      const statusEl = document.getElementById('media-status');
      if (mediaUsage(key)) {
        setStatus(statusEl, 'Cette photo est utilisée sur le site : remplacez-la ou retirez-la de la page concernée avant de la supprimer.', 'error');
        return;
      }
      if (!confirm(`Supprimer définitivement « ${key.split('/').pop()} » ?`)) return;
      if (pendingUploads.has(key) && !state.media.items.some(i => i.key === key)) {
        pendingUploads.delete(key);
      } else {
        pendingUploads.delete(key);
        pendingDeletes.add(key);
        state.dirty = true;
        updateDirtyBadge();
      }
      paint();
      setStatus(document.getElementById('media-status'), 'Photo supprimée — cliquez « Publier » pour appliquer.', 'ok');
    }));
    const countEl = document.querySelector('[data-tab="medias"] .admin-nav-item__count');
    if (countEl) countEl.textContent = mediaItems().length;
  }
  paint();
}

async function openMediaPicker(onChoose) {
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal';
  overlay.innerHTML = `<div class="admin-modal__dialog" role="dialog" aria-modal="true" aria-label="Choisir une photo">
    <div class="admin-modal__header">
      <h3>Choisir une photo</h3>
      <button type="button" class="icon-btn" data-close title="Fermer">✕</button>
    </div>
    <div class="admin-modal__body"><p class="admin-hint">Chargement…</p></div>
  </div>`;
  document.body.appendChild(overlay);
  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('[data-close]')) close(); });
  if (!state.media) await loadMedia();
  const body = overlay.querySelector('.admin-modal__body');
  let query = '';

  function paint() {
    body.innerHTML = `${dropZoneHtml('picker-drop')}
      <input type="search" class="admin-media-search" placeholder="Rechercher une photo…" value="${escapeHtml(query)}">
      ${mediaGridHtml(filterMedia(mediaItems(), query), { picker: true })}`;
    const search = body.querySelector('input[type="search"]');
    search.addEventListener('input', () => {
      query = search.value;
      const pos = search.selectionStart;
      paint();
      const s2 = body.querySelector('input[type="search"]');
      s2.focus();
      s2.setSelectionRange(pos, pos);
    });
    wireDropZone(body.querySelector('#picker-drop'), files => {
      const [key] = addMediaFiles(files);
      if (key) { close(); onChoose(key); }
    });
    body.querySelectorAll('[data-choose]').forEach(btn => btn.addEventListener('click', () => {
      close();
      onChoose(btn.dataset.choose);
    }));
  }
  paint();
}

// ---------- Point d'entrée ----------

export async function mountAdmin(root, { user, credentials, signOut }) {
  state = {
    user, credentials,
    guideArticles: [], events: [], expertises: [], secteurs: [], homepage: {},
    navigation: null, content: null,
    originalPageSlugs: new Set(),
    view: { tab: 'accueil' },
    dirty: false,
    media: null,
  };

  root.innerHTML = `<div class="admin-login"><p>Chargement des données…</p></div>`;

  try {
    const [guideArticles, events, expertises, secteurs, homepage, navigation, content] = await Promise.all([
      fetchJSON('data/guide-articles.json'),
      fetchJSON('data/evenements.json'),
      fetchJSON('data/expertises.json'),
      fetchJSON('data/secteurs.json'),
      fetchJSON('data/homepage.json'),
      fetchJSONOrDefault('data/navigation.json', DEFAULT_NAVIGATION),
      fetchJSONOrDefault('data/pages.json', DEFAULT_CONTENT),
    ]);
    state.navigation = navigation;
    state.content = content;
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
  { id: 'accueil', group: 'Pages', icon: 'home', label: 'Page d’accueil', count: () => null },
  { id: 'pages', group: 'Pages', icon: 'file', label: 'Pages de base', count: () => BASE_PAGES.length },
  { id: 'expertises', group: 'Pages', icon: 'briefcase', label: 'Expertises', count: () => state.expertises.length },
  { id: 'secteurs', group: 'Pages', icon: 'building', label: 'Secteurs', count: () => state.secteurs.length },
  { id: 'guide', group: 'Contenus', icon: 'book', label: 'Guide', count: () => state.guideArticles.length },
  { id: 'evenements', group: 'Contenus', icon: 'calendar', label: 'Événements', count: () => state.events.length },
  { id: 'medias', group: 'Contenus', icon: 'image', label: 'Médiathèque', count: () => (state.media ? mediaItems().length : null) },
  { id: 'structure', group: 'Site', icon: 'menu', label: 'Menu et pied de page', count: () => null },
];

function render(root, signOut) {
  const email = state.user.profile?.email || '';
  const current = NAV_ITEMS.find(t => t.id === state.view.tab) || NAV_ITEMS[0];
  const groups = [...new Set(NAV_ITEMS.map(t => t.group))];
  root.innerHTML = `
    <div class="admin-app">
      <aside class="admin-sidebar">
        <div class="admin-sidebar__brand">
          <span class="admin-sidebar__brand-mark">FT</span>
          <span><strong>Finances &amp; Territoires</strong><small>Administration</small></span>
        </div>
        <nav class="admin-sidebar-nav">
          ${groups.map(g => `<div class="admin-nav-group">
            <div class="admin-nav-group__label">${escapeHtml(g)}</div>
            ${NAV_ITEMS.filter(t => t.group === g).map(t => {
              const count = t.count();
              return `<button class="admin-nav-item${state.view.tab === t.id ? ' is-active' : ''}" data-tab="${t.id}">
                ${ICONS[t.icon]}<span>${escapeHtml(t.label)}</span>${count !== null ? `<span class="admin-nav-item__count">${count}</span>` : ''}
              </button>`;
            }).join('')}
          </div>`).join('')}
        </nav>
        <div class="admin-sidebar__footer">
          <a class="admin-sidebar__site-link" href="${escapeHtml(config.siteUrl)}/" target="_blank" rel="noopener">${ICONS.external}<span>Voir le site</span></a>
          <div class="admin-user">
            <span class="admin-user__avatar">${escapeHtml((email[0] || '?').toUpperCase())}</span>
            <span class="admin-user__email" title="${escapeHtml(email)}">${escapeHtml(email)}</span>
            <button id="signOut" class="icon-btn" title="Se déconnecter" aria-label="Se déconnecter">${ICONS.logout}</button>
          </div>
        </div>
      </aside>
      <div class="admin-shell">
        <header class="admin-topbar">
          <div class="admin-topbar__title">
            <span class="admin-topbar__crumb">${escapeHtml(current.group)}</span>
            <span class="admin-topbar__sep">/</span>
            <span>${escapeHtml(current.label)}</span>
          </div>
          <div class="admin-topbar__actions">
            <span id="dirty-badge" class="admin-badge" hidden><span class="admin-badge__dot"></span>Modifications non publiées</span>
            <button id="preview-btn" class="btn">${ICONS.eye}<span>Aperçu</span></button>
            <button id="publish-btn" class="btn btn-primary">${ICONS.upload}<span>Publier</span></button>
          </div>
        </header>
        <main class="admin-main">
          <p id="publish-status" class="admin-status"></p>
          <div id="tab-content"></div>
        </main>
      </div>
    </div>`;

  document.getElementById('signOut').addEventListener('click', () => signOut());
  document.getElementById('publish-btn').addEventListener('click', () => publish(root, signOut));
  document.getElementById('preview-btn').addEventListener('click', () => openPreview(null));
  enhanceTextareas(root);
  root.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      state.view = { tab: btn.dataset.tab };
      render(root, signOut);
    });
  });
  updateDirtyBadge();

  const content = document.getElementById('tab-content');
  if (state.view.tab === 'accueil') renderHomepageForm(content);
  else if (state.view.tab === 'structure') renderNavigationForm(content);
  else if (state.view.tab === 'pages') renderBasePagesList(content, root, signOut);
  else if (state.view.tab === 'expertises') renderResourceList(RESOURCE_KINDS.expertises, content, root, signOut);
  else if (state.view.tab === 'secteurs') renderResourceList(RESOURCE_KINDS.secteurs, content, root, signOut);
  else if (state.view.tab === 'guide') renderGuideList(content, root, signOut);
  else if (state.view.tab === 'medias') renderMediaLibrary(content);
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
  draft.finboost = { ...JSON.parse(JSON.stringify(DEFAULT_FINBOOST)), ...(draft.finboost || {}) };
  draft.coverage = { ...JSON.parse(JSON.stringify(DEFAULT_COVERAGE)), ...(draft.coverage || {}) };
  const fb = draft.finboost;
  const cv = draft.coverage;
  const txt = (cls, label, value) => `<label>${label}<input type="text" class="${cls}" value="${escapeHtml(value || '')}"></label>`;
  const area = (cls, label, value, rows = 3) => `<label>${label}<textarea class="${cls}" rows="${rows}">${escapeHtml(value || '')}</textarea></label>`;
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
          <p class="admin-hint">Libellés courts (l'icône et le lien restent fixes). Passez à la ligne pour afficher le libellé sur deux lignes. Un type dont la page correspondante est masquée ou supprimée disparaîtra automatiquement de cette rangée.</p>
          ${draft.clientTypes.map((ct, i) => `<label>${escapeHtml(ct.slug)}
            <textarea class="f-ct-label" data-i="${i}" rows="2">${escapeHtml(ct.label)}</textarea>
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
            <label>Étiquette (optionnelle)
              <input type="text" class="f-card-tag" data-i="${i}" placeholder="Ex. Détection des opportunités" value="${escapeHtml(c.tag || '')}">
            </label>
            <textarea class="f-card-text" data-i="${i}" rows="2" placeholder="Texte">${escapeHtml(c.text)}</textarea>
            <label>Liste à puces (un élément par ligne, optionnelle)
              <textarea class="f-card-items" data-i="${i}" rows="3">${escapeHtml((c.items || []).join('\n'))}</textarea>
            </label>
            <label>Lien — libellé (optionnel)
              <input type="text" class="f-card-link-label" data-i="${i}" placeholder="En savoir plus" value="${escapeHtml(c.linkLabel || '')}">
            </label>
            <label>Lien — adresse (ex. detections-des-opportunites/)
              <input type="text" class="f-card-link-href" data-i="${i}" value="${escapeHtml(c.linkHref || '')}">
            </label>
          </div>`).join('')}
        `, false)}

        ${section('sec-finboost', 'Bloc « FinBoost »', `
          ${txt('f-fb', 'Titre (suivi de « FinBoost »)', fb.title).replace('class="f-fb"', 'class="f-fb" data-k="title"')}
          <h4 class="admin-subhead">Carte « Le consultant »</h4>
          ${txt('f-fb', 'Étiquette', fb.consultantLabel).replace('class="f-fb"', 'class="f-fb" data-k="consultantLabel"')}
          ${area('f-fb', 'Texte', fb.consultantText).replace('class="f-fb"', 'class="f-fb" data-k="consultantText"')}
          ${area('f-fb-bullets', 'Points (un par ligne)', (fb.consultantBullets || []).join('\n'), 4)}
          <h4 class="admin-subhead">Carte « Outil FinBoost »</h4>
          ${txt('f-fb', 'Étiquette', fb.toolLabel).replace('class="f-fb"', 'class="f-fb" data-k="toolLabel"')}
          ${area('f-fb', 'Texte', fb.toolText, 2).replace('class="f-fb"', 'class="f-fb" data-k="toolText"')}
          ${(fb.features || []).map((x, i) => `<div class="admin-form-row">
            <label>Atout ${i + 1} — titre<input type="text" class="f-fb-feat-title" data-i="${i}" value="${escapeHtml(x.title)}"></label>
            <label>Atout ${i + 1} — texte<input type="text" class="f-fb-feat-text" data-i="${i}" value="${escapeHtml(x.text)}"></label>
          </div>`).join('')}
          <h4 class="admin-subhead">Panneau de droite</h4>
          ${[['panelBadge', 'Badge'], ['panelCaption', 'Sous-titre'], ['panelValue', 'Chiffre'], ['panelValueLabel', 'Légende du chiffre'], ['sideLabel', 'Encart — titre'], ['sideValue', 'Encart — chiffre'], ['sideText', 'Encart — texte']]
            .map(([k, l]) => `<label>${l}<input type="text" class="f-fb" data-k="${k}" value="${escapeHtml(fb[k] || '')}"></label>`).join('')}
          <h4 class="admin-subhead">Boutons</h4>
          ${[['primaryLabel', 'Bouton principal — libellé'], ['primaryHref', 'Bouton principal — lien'], ['secondaryLabel', 'Bouton secondaire — libellé'], ['secondaryHref', 'Bouton secondaire — lien']]
            .map(([k, l]) => `<label>${l}<input type="text" class="f-fb" data-k="${k}" value="${escapeHtml(fb[k] || '')}"></label>`).join('')}
        `, false)}

        ${section('sec-coverage', 'Bloc « Couverture nationale » (carte)', `
          ${[['eyebrow', 'Surtitre'], ['title', 'Titre']].map(([k, l]) => `<label>${l}<input type="text" class="f-cv" data-k="${k}" value="${escapeHtml(cv[k] || '')}"></label>`).join('')}
          <label>Texte<textarea class="f-cv" data-k="text" rows="2">${escapeHtml(cv.text || '')}</textarea></label>
          <h4 class="admin-subhead">Chiffres clés</h4>
          ${(cv.cards || []).map((k, i) => `<div class="admin-form-row">
            <label>Chiffre ${i + 1}<input type="text" class="f-cv-card" data-i="${i}" data-k="value" value="${escapeHtml(k.value)}"></label>
            <label>Suffixe<input type="text" class="f-cv-card" data-i="${i}" data-k="suffix" value="${escapeHtml(k.suffix)}"></label>
            <label>Texte<textarea class="f-cv-card" data-i="${i}" data-k="text" rows="2">${escapeHtml(k.text)}</textarea></label>
          </div>`).join('')}
          <h4 class="admin-subhead">Siège</h4>
          ${[['hqLabel', 'Étiquette'], ['hqValue', 'Chiffre']].map(([k, l]) => `<label>${l}<input type="text" class="f-cv" data-k="${k}" value="${escapeHtml(cv[k] || '')}"></label>`).join('')}
          <label>Texte<textarea class="f-cv" data-k="hqText" rows="2">${escapeHtml(cv.hqText || '')}</textarea></label>
          <label>Région du siège (surlignée en rose)
            <select class="f-cv" data-k="hqRegion">${(cv.regions || []).map(r => `<option value="${escapeHtml(r.id)}"${r.id === cv.hqRegion ? ' selected' : ''}>${escapeHtml(r.name)}</option>`).join('')}</select>
          </label>
          <h4 class="admin-subhead">Dispositifs par région (affichés au survol de la carte)</h4>
          ${(cv.regions || []).map((r, i) => `<label>${escapeHtml(r.name)}<input type="text" class="f-cv-region" data-i="${i}" placeholder="ex. 2 753" value="${escapeHtml(r.count || '')}"></label>`).join('')}
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

        ${section('sec-seo', 'Référencement (SEO)', `
          <p class="admin-hint">Laissés vides, ces champs reprennent le titre et le texte du bandeau principal.</p>
          <label>Titre SEO (balise &lt;title&gt;)
            <input type="text" id="f-seo-title" value="${escapeHtml(draft.seoTitle || '')}">
          </label>
          <label>Méta description
            <textarea id="f-seo-description" rows="2">${escapeHtml(draft.seoDescription || '')}</textarea>
          </label>
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
          ${previewButton('')}
        </div>
      </form>`;

    wirePreviewButtons(content, () => {
      syncFormToDraft();
      state.homepage = JSON.parse(JSON.stringify(draft));
    });
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
    content.querySelectorAll('.f-card-tag').forEach(el => { draft.introCards[Number(el.dataset.i)].tag = el.value.trim(); });
    content.querySelectorAll('.f-card-items').forEach(el => { draft.introCards[Number(el.dataset.i)].items = el.value.split('\n').map(x => x.trim()).filter(Boolean); });
    content.querySelectorAll('.f-card-link-label').forEach(el => { draft.introCards[Number(el.dataset.i)].linkLabel = el.value.trim(); });
    content.querySelectorAll('.f-card-link-href').forEach(el => { draft.introCards[Number(el.dataset.i)].linkHref = el.value.trim(); });
    content.querySelectorAll('.f-fb').forEach(el => { draft.finboost[el.dataset.k] = el.value; });
    content.querySelectorAll('.f-fb-bullets').forEach(el => { draft.finboost.consultantBullets = el.value.split('\n').map(x => x.trim()).filter(Boolean); });
    content.querySelectorAll('.f-fb-feat-title').forEach(el => { draft.finboost.features[Number(el.dataset.i)].title = el.value; });
    content.querySelectorAll('.f-fb-feat-text').forEach(el => { draft.finboost.features[Number(el.dataset.i)].text = el.value; });
    content.querySelectorAll('.f-cv').forEach(el => { draft.coverage[el.dataset.k] = el.value; });
    content.querySelectorAll('.f-cv-card').forEach(el => { draft.coverage.cards[Number(el.dataset.i)][el.dataset.k] = el.value; });
    content.querySelectorAll('.f-cv-region').forEach(el => { draft.coverage.regions[Number(el.dataset.i)].count = el.value.trim(); });
    draft.testimonial.quote = document.getElementById('f-test-quote').value;
    draft.testimonial.cite = document.getElementById('f-test-cite').value;
    draft.testimonial.footnote = document.getElementById('f-test-footnote').value;
    draft.valuesTitle = document.getElementById('f-values-title').value;
    content.querySelectorAll('.f-value-title').forEach(el => { draft.values[Number(el.dataset.i)].title = el.value; });
    content.querySelectorAll('.f-value-text').forEach(el => { draft.values[Number(el.dataset.i)].text = el.value; });
    draft.partnersTitle = document.getElementById('f-partners-title').value;
    content.querySelectorAll('.f-partner-alt').forEach(el => { draft.partners[Number(el.dataset.i)].alt = el.value; });
    draft.faqTitle = document.getElementById('f-faq-title').value;
    draft.seoTitle = document.getElementById('f-seo-title').value;
    draft.seoDescription = document.getElementById('f-seo-description').value;
    content.querySelectorAll('.f-faq-item').forEach(el => { draft.faq[Number(el.dataset.i)] = el.value; });
  }

  paint();
}

// ---------- Onglet Menu et pied de page ----------
// Toute la structure de navigation (menus déroulants, sous-menus, colonnes du
// footer) vient de data/navigation.json : libellés, liens et ordre sont
// modifiables ici, sans toucher aux gabarits.

const NAV_TEMPLATES = {
  link: { label: '', href: '' },
  group: { label: '', href: '', children: [] },
  column: { title: '', links: [] },
};

function linkFieldsHtml(path, item, index, length, { withChildren = false } = {}) {
  const base = `${path}.${index}`;
  return `<div class="admin-body-section">
    <div class="admin-form-row">
      ${pathField('Libellé', `${base}.label`, item.label)}
      ${pathField('Lien (ex. contact/)', `${base}.href`, item.href)}
    </div>
    ${withChildren ? `<div class="admin-subitems">
      ${(item.children || []).map((child, ci) => `<div class="admin-body-section">
        <div class="admin-form-row">
          ${pathField('Libellé', `${base}.children.${ci}.label`, child.label)}
          ${pathField('Lien', `${base}.children.${ci}.href`, child.href)}
        </div>
        ${itemToolbar(`${base}.children`, ci, (item.children || []).length)}
      </div>`).join('')}
      <button type="button" class="btn" data-add="${base}.children" data-template="link">+ Ajouter un sous-élément</button>
    </div>` : ''}
    ${itemToolbar(path, index, length)}
  </div>`;
}

function renderNavigationForm(content) {
  const draft = JSON.parse(JSON.stringify(state.navigation || DEFAULT_NAVIGATION));
  draft.header = { ...DEFAULT_NAVIGATION.header, ...(draft.header || {}) };
  draft.footer = { ...DEFAULT_NAVIGATION.footer, ...(draft.footer || {}) };

  function section(title, bodyHtml, open) {
    return `<details class="admin-section"${open ? ' open' : ''}>
      <summary>${escapeHtml(title)}</summary>
      <div class="admin-section__body">${bodyHtml}</div>
    </details>`;
  }

  function paint() {
    const h = draft.header;
    const f = draft.footer;
    content.innerHTML = `
      <form class="admin-form" id="navigation-form">
        <h2>Menu et pied de page</h2>
        <p class="admin-hint">Les liens sont relatifs à la racine du site (ex. <code>contact/</code>). Une page masquée disparaît automatiquement du menu et du pied de page.</p>
        <p id="navigation-save-status" class="admin-status admin-status--ok" style="margin:0;"></p>

        ${section('Barre de navigation', `
          <div class="admin-form-row">
            ${pathField('Libellé du menu « Expertises »', 'header.expertisesLabel', h.expertisesLabel)}
            ${pathField('Libellé du menu « Qui sommes-nous »', 'header.aboutLabel', h.aboutLabel)}
          </div>
          <div class="admin-form-row">
            ${pathField('Libellé du lien direct', 'header.reussitesLabel', h.reussitesLabel)}
            ${pathField('Lien direct', 'header.reussitesHref', h.reussitesHref)}
          </div>
          <div class="admin-form-row">
            ${pathField('Libellé du bouton', 'header.ctaLabel', h.ctaLabel)}
            ${pathField('Lien du bouton', 'header.ctaHref', h.ctaHref)}
          </div>
        `, true)}

        ${section('Menu « Expertises » (groupes et sous-menus)', `
          ${(h.expertisesMenu || []).map((item, i) => linkFieldsHtml('header.expertisesMenu', item, i, h.expertisesMenu.length, { withChildren: true })).join('')}
          <button type="button" class="btn" data-add="header.expertisesMenu" data-template="group">+ Ajouter un groupe</button>
        `, false)}

        ${section('Menu « Qui sommes-nous »', `
          ${(h.aboutMenu || []).map((item, i) => linkFieldsHtml('header.aboutMenu', item, i, h.aboutMenu.length)).join('')}
          <button type="button" class="btn" data-add="header.aboutMenu" data-template="link">+ Ajouter un lien</button>
        `, false)}

        ${section('Pied de page — présentation', `
          ${pathField('Nom affiché', 'footer.brand', f.brand)}
          ${pathField('Texte de présentation', 'footer.text', f.text, { rows: 2 })}
          ${pathField('Mention sous le texte', 'footer.subsidiary', f.subsidiary)}
          ${pathField('Mention légale (bas de page)', 'footer.bottom', f.bottom)}
        `, false)}

        ${section('Pied de page — colonnes de liens', `
          ${(f.columns || []).map((col, ci) => `<div class="admin-body-section">
            ${pathField('Titre de la colonne', `footer.columns.${ci}.title`, col.title)}
            ${(col.links || []).map((l, li) => `<div class="admin-body-section">
              <div class="admin-form-row">
                ${pathField('Libellé', `footer.columns.${ci}.links.${li}.label`, l.label)}
                ${pathField('Lien', `footer.columns.${ci}.links.${li}.href`, l.href)}
              </div>
              ${itemToolbar(`footer.columns.${ci}.links`, li, (col.links || []).length)}
            </div>`).join('')}
            <button type="button" class="btn" data-add="footer.columns.${ci}.links" data-template="link">+ Ajouter un lien</button>
            ${itemToolbar('footer.columns', ci, (f.columns || []).length)}
          </div>`).join('')}
          <button type="button" class="btn" data-add="footer.columns" data-template="column">+ Ajouter une colonne</button>
        `, false)}

        <div class="admin-form__actions">
          <button type="submit" class="btn btn--site btn-primary">Enregistrer</button>
          ${previewButton('', 'Aperçu de la page d’accueil')}
        </div>
      </form>`;

    wireArrayButtons(content, draft, paint, NAV_TEMPLATES);
    wirePreviewButtons(content, () => {
      syncPaths(content, draft);
      state.navigation = draft;
    });
    document.getElementById('navigation-form').addEventListener('submit', e => {
      e.preventDefault();
      syncPaths(content, draft);
      state.navigation = JSON.parse(JSON.stringify(draft));
      state.dirty = true;
      updateDirtyBadge();
      setStatus(document.getElementById('navigation-save-status'), 'Enregistré localement — cliquez « Publier » en haut pour mettre le site à jour.', 'ok');
    });
  }

  paint();
}

// ---------- Onglet Pages de base ----------
// Contenu des pages du socle (Qui sommes-nous, Réussites, Contact, hubs…),
// décrit champ par champ ci-dessous et stocké dans data/pages.json.

const PAGE_FIELDS = {
  'finances-et-territoires': [
    { k: 'title', l: 'Titre (menu et fil d’Ariane)' },
    { k: 'headline', l: 'Titre affiché (H1) — vide = titre ci-dessus' },
    { k: 'lead', l: 'Chapô', rows: 3 },
    { k: 'stats', l: 'Chiffres clés', type: 'items', template: { value: '', label: '' }, fields: [{ k: 'value', l: 'Chiffre' }, { k: 'label', l: 'Légende' }] },
    { k: 'features', l: 'Points clés', type: 'items', template: { title: '', text: '' }, fields: [{ k: 'title', l: 'Titre' }, { k: 'text', l: 'Texte', rows: 2 }] },
  ],
  'les-reussites-de-nos-clients': [
    { k: 'title', l: 'Titre (menu et fil d’Ariane)' },
    { k: 'headline', l: 'Titre affiché sur la photo — vide = titre ci-dessus' },
    { k: 'bannerImage', l: 'Photo de bandeau', type: 'photo' },
    { k: 'bannerCtaLabel', l: 'Libellé du bouton du bandeau' },
    { k: 'bannerCtaHref', l: 'Lien du bouton du bandeau' },
    { k: 'lead', l: 'Chapô', rows: 3 },
    { k: 'testimonial', l: 'Témoignage', type: 'group', fields: [
      { k: 'meta', l: 'Surtitre' }, { k: 'quote', l: 'Citation', rows: 3 }, { k: 'cite', l: 'Auteur' }, { k: 'footnote', l: 'Précision' },
    ] },
    { k: 'stats', l: 'Chiffres clés', type: 'items', template: { value: '', label: '' }, fields: [{ k: 'value', l: 'Chiffre' }, { k: 'label', l: 'Légende' }] },
  ],
  contact: [
    { k: 'title', l: 'Titre (menu et fil d’Ariane)' },
    { k: 'headline', l: 'Titre affiché (H1) — vide = titre ci-dessus' },
    { k: 'lead', l: 'Chapô', rows: 3 },
    { k: 'email', l: 'Adresse e-mail destinataire du formulaire' },
    { k: 'infoTitle', l: 'Titre de l’encart' },
    { k: 'infoParagraphs', l: 'Paragraphes de l’encart', type: 'strings', rows: 3, hint: 'Un lien s’écrit [libellé](guide/).' },
  ],
  guide: [
    { k: 'title', l: 'Titre' },
    { k: 'lead', l: 'Chapô', rows: 2 },
  ],
  evenements: [
    { k: 'title', l: 'Titre' },
    { k: 'lead', l: 'Chapô', rows: 2 },
    { k: 'emptyTitle', l: 'Titre affiché sans événement' },
    { k: 'emptyText', l: 'Texte affiché sans événement', rows: 2, hint: 'Un lien s’écrit [libellé](contact/).' },
  ],
  entreprise: [
    { k: 'title', l: 'Titre (menu et fil d’Ariane)' },
    { k: 'eyebrow', l: 'Surtitre' },
    { k: 'headline', l: 'Titre affiché (H1)' },
    { k: 'lead', l: 'Chapô', rows: 4 },
    { k: 'ctaLabel', l: 'Libellé du bouton' },
    { k: 'image', l: 'Photo de bandeau', type: 'photo' },
    { k: 'sections', l: 'Sections de contenu', type: 'sections' },
    { k: 'cta', l: 'Bandeau d’appel à l’action', type: 'group', fields: [
      { k: 'title', l: 'Titre' }, { k: 'text', l: 'Texte', rows: 2 }, { k: 'label', l: 'Libellé du bouton' },
    ] },
  ],
  'secteurs-dactivite': [
    { k: 'title', l: 'Titre' },
    { k: 'lead', l: 'Chapô', rows: 3 },
  ],
};

const PAGE_TEMPLATES = {
  string: '',
  listSection: { type: 'list', title: '', items: [''] },
  blocksSection: { type: 'blocks', title: '', blocks: [{ title: '', text: '' }] },
  block: { title: '', text: '' },
};

function sectionsEditorHtml(path, sections) {
  return `${(sections || []).map((s, i) => `<div class="admin-body-section">
    ${pathField('Titre de la section', `${path}.${i}.title`, s.title)}
    ${s.type === 'list'
      ? `${(s.items || []).map((item, ii) => `<div class="admin-body-section">
          ${pathField(`Puce ${ii + 1}`, `${path}.${i}.items.${ii}`, item, { rows: 2 })}
          ${itemToolbar(`${path}.${i}.items`, ii, (s.items || []).length)}
        </div>`).join('')}
        <button type="button" class="btn" data-add="${path}.${i}.items" data-template="string">+ Ajouter une puce</button>`
      : `${(s.blocks || []).map((b, bi) => `<div class="admin-body-section">
          ${pathField('Titre', `${path}.${i}.blocks.${bi}.title`, b.title)}
          ${pathField('Texte', `${path}.${i}.blocks.${bi}.text`, b.text, { rows: 3 })}
          ${itemToolbar(`${path}.${i}.blocks`, bi, (s.blocks || []).length)}
        </div>`).join('')}
        <button type="button" class="btn" data-add="${path}.${i}.blocks" data-template="block">+ Ajouter un bloc</button>`}
    ${itemToolbar(path, i, (sections || []).length)}
  </div>`).join('')}
  <div class="admin-form-row">
    <button type="button" class="btn" data-add="${path}" data-template="listSection">+ Ajouter une liste à puces</button>
    <button type="button" class="btn" data-add="${path}" data-template="blocksSection">+ Ajouter des blocs titre/texte</button>
  </div>`;
}

function pageFieldHtml(field, draft, slug) {
  const value = draft[field.k];
  if (field.type === 'photo') {
    return `<div class="admin-body-section">${photoFieldHtml(`page-${slug}-${field.k}`, field.l, value)}</div>`;
  }
  if (field.type === 'group') {
    return `<div class="admin-body-section">
      <h3>${escapeHtml(field.l)}</h3>
      ${field.fields.map(f => pathField(f.l, `${field.k}.${f.k}`, (value || {})[f.k], { rows: f.rows })).join('')}
    </div>`;
  }
  if (field.type === 'strings') {
    return `<h3>${escapeHtml(field.l)}</h3>
      ${field.hint ? `<p class="admin-hint">${escapeHtml(field.hint)}</p>` : ''}
      ${(value || []).map((v, i) => `<div class="admin-body-section">
        ${pathField(`Paragraphe ${i + 1}`, `${field.k}.${i}`, v, { rows: field.rows || 2 })}
        ${itemToolbar(field.k, i, (value || []).length)}
      </div>`).join('')}
      <button type="button" class="btn" data-add="${field.k}" data-template="string">+ Ajouter</button>`;
  }
  if (field.type === 'items') {
    return `<h3>${escapeHtml(field.l)}</h3>
      ${(value || []).map((item, i) => `<div class="admin-body-section">
        ${field.fields.map(f => pathField(f.l, `${field.k}.${i}.${f.k}`, item[f.k], { rows: f.rows })).join('')}
        ${itemToolbar(field.k, i, (value || []).length)}
      </div>`).join('')}
      <button type="button" class="btn" data-add="${field.k}" data-template="${field.k}">+ Ajouter</button>`;
  }
  if (field.type === 'sections') {
    return `<h3>${escapeHtml(field.l)}</h3>${sectionsEditorHtml(field.k, value)}`;
  }
  return pathField(field.l, field.k, value, { rows: field.rows, hint: field.hint });
}

function renderBasePagesList(content, root, signOut) {
  content.innerHTML = `
    <div class="admin-list-header">
      <div>
        <h2 class="admin-section-title">Pages de base</h2>
        <p class="admin-section-subtitle" style="margin:0;">Contenu des pages du socle du site</p>
      </div>
    </div>
    <div class="admin-list">
      ${BASE_PAGES.filter(p => PAGE_FIELDS[p.slug]).map(p => {
        const c = { ...(DEFAULT_CONTENT.pages[p.slug] || {}), ...((state.content?.pages || {})[p.slug] || {}) };
        return `<div class="admin-card">
          ${thumbHtml(c.image || c.bannerImage || p.image)}
          <div class="admin-card__body">
            <div class="admin-card__title">${escapeHtml(c.title || p.title)}</div>
            <div class="admin-card__meta">/${escapeHtml(p.slug)}/</div>
          </div>
          <div class="admin-card__actions">
            <button class="icon-btn" data-edit="${escapeHtml(p.slug)}" title="Modifier" aria-label="Modifier">${ICONS.pencil}</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  content.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => renderBasePageForm(btn.dataset.edit, content, root, signOut));
  });
}

function renderBasePageForm(slug, content, root, signOut) {
  const fields = PAGE_FIELDS[slug];
  const draft = JSON.parse(JSON.stringify({
    ...(DEFAULT_CONTENT.pages[slug] || {}),
    ...((state.content?.pages || {})[slug] || {}),
  }));
  const templates = { ...PAGE_TEMPLATES };
  for (const f of fields) if (f.type === 'items') templates[f.k] = f.template;

  function paint() {
    content.innerHTML = `
      <form class="admin-form" id="base-page-form">
        <h2>${escapeHtml(draft.title || slug)}</h2>
        <p class="admin-hint">Page /${escapeHtml(slug)}/ — modifiez le contenu, prévisualisez, puis publiez.</p>
        <p id="base-page-save-status" class="admin-status admin-status--ok" style="margin:0;"></p>
        ${fields.map(f => pageFieldHtml(f, draft, slug)).join('')}
        <details class="admin-section">
          <summary>Référencement (SEO)</summary>
          <div class="admin-section__body">${seoFieldsHtml(draft)}</div>
        </details>
        <div class="admin-form__actions">
          <button type="submit" class="btn btn--site btn-primary">Enregistrer</button>
          ${previewButton(slug)}
          <button type="button" id="cancel-form" class="btn">Retour</button>
        </div>
      </form>`;

    for (const f of fields) {
      if (f.type !== 'photo') continue;
      wirePhotoField(`page-${slug}-${f.k}`, ext => `images/uploads/page-${slug}-${f.k}.${ext}`, key => { draft[f.k] = key; });
    }
    wireArrayButtons(content, draft, paint, templates);
    wirePreviewButtons(content, () => {
      syncPaths(content, draft);
      applyPageDraft(slug, draft);
    });
    document.getElementById('cancel-form').addEventListener('click', () => renderBasePagesList(content, root, signOut));
    document.getElementById('base-page-form').addEventListener('submit', e => {
      e.preventDefault();
      syncPaths(content, draft);
      applyPageDraft(slug, draft);
      state.dirty = true;
      updateDirtyBadge();
      setStatus(document.getElementById('base-page-save-status'), 'Enregistré localement — cliquez « Publier » en haut pour mettre le site à jour.', 'ok');
    });
  }

  paint();
}

function applyPageDraft(slug, draft) {
  state.content = state.content || JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  state.content.pages = state.content.pages || {};
  state.content.pages[slug] = JSON.parse(JSON.stringify(draft));
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
        <details class="admin-section">
          <summary>Référencement (SEO)</summary>
          <div class="admin-section__body">
            <p class="admin-hint">Laissés vides, ces champs reprennent le titre et le texte d'introduction.</p>
            <label>Titre SEO (balise &lt;title&gt;)
              <input type="text" id="f-seo-title" value="${escapeHtml(draft.seoTitle || '')}">
            </label>
            <label>Méta description
              <textarea id="f-seo-description" rows="2">${escapeHtml(draft.seoDescription || '')}</textarea>
            </label>
          </div>
        </details>
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
          ${isNew ? '' : previewButton(draft.slug)}
          <button type="button" id="cancel-form" class="btn">Annuler</button>
        </div>
      </form>`;

    wirePreviewButtons(content, () => {
      syncFormToDraft();
      if (item) Object.assign(item, draft);
    });
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
    draft.seoTitle = document.getElementById('f-seo-title').value;
    draft.seoDescription = document.getElementById('f-seo-description').value;
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
        <details class="admin-section">
          <summary>Référencement (SEO)</summary>
          <div class="admin-section__body">
            <p class="admin-hint">Laissés vides, ces champs reprennent le titre et le chapô de l'article.</p>
            <label>Titre SEO (balise &lt;title&gt;)
              <input type="text" id="f-seo-title" value="${escapeHtml(draft.seoTitle || '')}">
            </label>
            <label>Méta description
              <textarea id="f-seo-description" rows="2">${escapeHtml(draft.seoDescription || '')}</textarea>
            </label>
          </div>
        </details>
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
          ${isNew ? '' : previewButton(draft.slug)}
          <button type="button" id="cancel-form" class="btn">Annuler</button>
        </div>
      </form>`;

    wirePreviewButtons(content, () => {
      syncFormToDraft();
      if (article) Object.assign(article, draft);
    });
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
    draft.seoTitle = document.getElementById('f-seo-title').value;
    draft.seoDescription = document.getElementById('f-seo-description').value;
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
  const openForm = document.querySelector('#tab-content form.admin-form');
  if (openForm) {
    if (!openForm.reportValidity()) return;
    openForm.requestSubmit();
  }
  const statusEl = document.getElementById('publish-status');
  const btn = document.getElementById('publish-btn');
  btn.disabled = true;
  setStatus(statusEl, 'Publication en cours…', 'progress');

  try {
    const { S3Client, PutObjectCommand, DeleteObjectCommand } = await import('https://cdn.jsdelivr.net/npm/@aws-sdk/client-s3@3/+esm');
    const s3 = new S3Client({
      region: config.region,
      credentials: state.credentials,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });

    const pages = currentPages();
    const currentSlugs = new Set([...state.guideArticles, ...state.expertises, ...state.secteurs].map(x => x.slug));
    const deletedSlugs = [...state.originalPageSlugs].filter(s => !currentSlugs.has(s));

    const currentPartnerImages = new Set((state.homepage.partners || []).map(p => p.image).filter(Boolean));
    const usedElsewhere = allDataText();
    const deletedPartnerImages = [...state.originalPartnerImages]
      .filter(k => !currentPartnerImages.has(k) && !usedElsewhere.includes(`"${k}"`) && !pendingDeletes.has(k));
    const mediaDeletes = [...pendingDeletes];

    let done = 0;
    const total = pages.length + 1 /* index.html */ + 7 /* fichiers data/*.json */
      + deletedSlugs.length + pendingUploads.size + deletedPartnerImages.length + mediaDeletes.length;
    const tick = () => { setStatus(statusEl, `Publication en cours… (${++done}/${total})`, 'progress'); };

    for (const [key, file] of pendingUploads) {
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: new Uint8Array(await file.arrayBuffer()),
        ContentType: file.type || 'application/octet-stream',
      }));
      tick();
    }

    for (const p of pages) {
      const html = page(p, pages, state.events, site());
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
      Body: homepagePage(state.homepage, pages, site()),
      ContentType: 'text/html; charset=utf-8',
    }));
    tick();

    const dataFiles = {
      'data/guide-articles.json': state.guideArticles,
      'data/expertises.json': state.expertises,
      'data/secteurs.json': state.secteurs,
      'data/evenements.json': state.events,
      'data/homepage.json': state.homepage,
      'data/navigation.json': state.navigation,
      'data/pages.json': state.content,
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

    for (const key of [...deletedPartnerImages, ...mediaDeletes]) {
      await s3.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
      tick();
    }

    if (state.media) {
      const removed = new Set([...deletedPartnerImages, ...mediaDeletes]);
      const known = new Set(state.media.items.map(i => i.key));
      state.media.items = state.media.items.filter(i => !removed.has(i.key));
      for (const [key, file] of pendingUploads) {
        if (!known.has(key)) state.media.items.push({ key, size: file.size });
      }
    }
    pendingUploads.clear();
    pendingDeletes.clear();
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
