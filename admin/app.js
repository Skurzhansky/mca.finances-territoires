import { config } from './config.js';
import { buildPages, page, homepagePage } from '../scripts/templates.mjs';

let state = null;

const RESOURCE_KINDS = {
  expertises: { key: 'expertises', section: 'expertise', type: 'expertise', tabLabel: 'Expertises', itemNoun: 'cette page' },
  secteurs: { key: 'secteurs', section: 'secteur', type: 'secteur', tabLabel: 'Secteurs', itemNoun: 'cette page' },
};

function slugify(str) {
  return String(str || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function fetchJSON(path) {
  const res = await fetch(`${config.siteUrl}/${path}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Impossible de charger ${path} (${res.status})`);
  return res.json();
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

  root.innerHTML = `<div class="admin-shell"><p>Chargement des données…</p></div>`;

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
  } catch (err) {
    root.innerHTML = `<div class="admin-shell"><p class="admin-error">Erreur de chargement : ${escapeHtml(err.message)}</p></div>`;
    return;
  }

  render(root, signOut);
}

const TABS = [
  { id: 'accueil', label: () => 'Accueil' },
  { id: 'expertises', label: () => `Expertises (${state.expertises.length})` },
  { id: 'secteurs', label: () => `Secteurs (${state.secteurs.length})` },
  { id: 'guide', label: () => `Guide (${state.guideArticles.length})` },
  { id: 'evenements', label: () => `Événements (${state.events.length})` },
];

function render(root, signOut) {
  root.innerHTML = `
    <div class="admin-shell admin-shell--wide">
      <header class="admin-topbar">
        <span>Connecté : ${escapeHtml(state.user.profile?.email || '')}</span>
        <div class="admin-topbar__actions">
          <span id="dirty-badge" class="admin-badge" hidden>Modifications non publiées</span>
          <button id="publish-btn" class="btn btn--site btn-primary">Publier</button>
          <button id="signOut" class="btn">Se déconnecter</button>
        </div>
      </header>
      <p id="publish-status" class="admin-status"></p>
      <nav class="admin-tabs">
        ${TABS.map(t => `<button class="admin-tab${state.view.tab === t.id ? ' is-active' : ''}" data-tab="${t.id}">${t.label()}</button>`).join('')}
      </nav>
      <div id="tab-content"></div>
    </div>`;

  document.getElementById('signOut').addEventListener('click', () => signOut());
  document.getElementById('publish-btn').addEventListener('click', () => publish(root, signOut));
  root.querySelectorAll('.admin-tab').forEach(btn => {
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

function renderHomepageForm(content) {
  const h = state.homepage;
  content.innerHTML = `
    <form class="admin-form" id="homepage-form">
      <h2>Page d'accueil</h2>
      <label>Titre (bandeau principal)
        <input type="text" id="f-hero-title" value="${escapeHtml(h.heroTitle)}" required>
      </label>
      <label>Texte sous le titre
        <textarea id="f-hero-lead" rows="3" required>${escapeHtml(h.heroLead)}</textarea>
      </label>
      <label>Texte du bouton
        <input type="text" id="f-cta-label" value="${escapeHtml(h.ctaLabel)}" required>
      </label>
      <div class="admin-form__actions">
        <button type="submit" class="btn btn--site btn-primary">Enregistrer</button>
      </div>
    </form>`;

  document.getElementById('homepage-form').addEventListener('submit', e => {
    e.preventDefault();
    state.homepage = {
      heroTitle: document.getElementById('f-hero-title').value,
      heroLead: document.getElementById('f-hero-lead').value,
      ctaLabel: document.getElementById('f-cta-label').value,
    };
    state.dirty = true;
    updateDirtyBadge();
  });
}

// ---------- Onglets Expertises / Secteurs (partagés) ----------

function renderResourceList(kind, content, root, signOut) {
  const items = state[kind.key];
  content.innerHTML = `
    <div class="admin-list-header">
      <button id="new-resource" class="btn btn--site btn-primary">+ Nouvelle page</button>
    </div>
    <div class="admin-list">
      ${items.map(x => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHtml(x.title)}</strong>${x.hidden ? ' <span class="admin-badge">Masqué</span>' : ''}
            <div class="admin-list-item__meta">/${escapeHtml(x.slug)}/</div>
          </div>
          <div class="admin-list-item__actions">
            <button class="btn" data-edit="${escapeHtml(x.slug)}">Modifier</button>
            <button class="btn btn--danger" data-delete="${escapeHtml(x.slug)}">Supprimer</button>
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
    : { slug: '', title: '', section: kind.section, type: kind.type, hidden: false, lead: '', features: [{ title: '', text: '' }] };

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
      <button id="new-article" class="btn btn--site btn-primary">+ Nouvel article</button>
    </div>
    <div class="admin-list">
      ${state.guideArticles.map(a => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHtml(a.title)}</strong>
            <div class="admin-list-item__meta">/${escapeHtml(a.slug)}/</div>
          </div>
          <div class="admin-list-item__actions">
            <button class="btn" data-edit="${escapeHtml(a.slug)}">Modifier</button>
            <button class="btn btn--danger" data-delete="${escapeHtml(a.slug)}">Supprimer</button>
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
    : { slug: '', title: '', section: 'guide', type: 'article', intro: '', body: [['', '']] };

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
      <button id="new-event" class="btn btn--site btn-primary">+ Nouvel événement</button>
    </div>
    <div class="admin-list">
      ${state.events.map((e, i) => `
        <div class="admin-list-item">
          <div>
            <strong>${escapeHtml(e.title)}</strong>
            <div class="admin-list-item__meta">${escapeHtml(e.date)}</div>
          </div>
          <div class="admin-list-item__actions">
            <button class="btn" data-edit="${i}">Modifier</button>
            <button class="btn btn--danger" data-delete="${i}">Supprimer</button>
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
  statusEl.className = 'admin-status';
  statusEl.textContent = 'Publication en cours…';

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

    let done = 0;
    const total = pages.length + 1 /* index.html */ + 5 /* fichiers data/*.json */ + deletedSlugs.length;
    const tick = () => { statusEl.textContent = `Publication en cours… (${++done}/${total})`; };

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

    state.originalPageSlugs = currentSlugs;
    state.dirty = false;
    updateDirtyBadge();

    statusEl.textContent = 'Publié. Invalidation du cache CloudFront…';
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
      statusEl.textContent = 'Publié — les changements sont visibles immédiatement.';
    } catch (cfErr) {
      statusEl.textContent = 'Publié — le cache n’a pas pu être vidé automatiquement (droits manquants), les changements apparaîtront d’ici quelques minutes.';
      console.warn(cfErr);
    }
    statusEl.classList.add('admin-status--ok');
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Erreur de publication : ${err.message}`;
    statusEl.classList.add('admin-status--error');
  } finally {
    btn.disabled = false;
  }
}
