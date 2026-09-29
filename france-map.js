// Carte interactive « Une couverture nationale exhaustive » : charge
// images/france-regions.svg (un <path> par département, avec id et
// data-name), colore chaque département selon son nombre de dispositifs et
// affiche une info-bulle au survol.
(function () {
  function shadeOf(id) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
    return 1 + (h % 4);
  }

  var root = document.getElementById('coverage-map');
  if (!root) return;
  var data = {};
  try { data = JSON.parse(root.querySelector('.coverage-map__data').textContent); } catch (e) {}
  var byId = {};
  (data.regions || []).forEach(function (r) { if (r.id) byId[r.id] = r; });
  var holder = root.querySelector('.coverage-map__svg');
  var tip = root.querySelector('.coverage-map__tooltip');

  fetch('images/france-regions.svg', { cache: 'no-cache' })
    .then(function (res) { return res.ok ? res.text() : ''; })
    .then(function (svg) {
      if (!svg) return;
      holder.innerHTML = svg;
      var shapes = holder.querySelectorAll('svg [id]');
      var counts = [];
      shapes.forEach(function (el) {
        var r = byId[el.id];
        var n = r && parseFloat(String(r.count).replace(/[^\d.]/g, ''));
        if (n) counts.push(n);
      });
      var max = Math.max.apply(null, counts.concat([0]));
      shapes.forEach(function (el) {
        var r = byId[el.id] || {};
        var n = parseFloat(String(r.count || '').replace(/[^\d.]/g, ''));
        var level = max && n ? Math.max(1, Math.ceil((n / max) * 5)) : Number(el.getAttribute('data-level')) || shadeOf(el.id);
        el.classList.add('coverage-map__region', 'is-level-' + level);
        if (el.id === data.hq) el.classList.add('is-hq');
        el.setAttribute('tabindex', '0');
        var name = r.name || el.getAttribute('data-name') || el.id;
        var label = '<strong>' + name + '</strong>' + (r.count ? '<span>' + r.count + ' dispositifs</span>' : '');
        function show(ev) {
          tip.innerHTML = label;
          tip.hidden = false;
          var box = root.getBoundingClientRect();
          var x, y;
          if (ev && ev.clientX) { x = ev.clientX - box.left; y = ev.clientY - box.top; }
          else { var b = el.getBoundingClientRect(); x = b.left - box.left + b.width / 2; y = b.top - box.top + b.height / 2; }
          tip.style.left = x + 'px';
          tip.style.top = y + 'px';
        }
        el.addEventListener('mousemove', show);
        el.addEventListener('focus', show);
        el.addEventListener('mouseleave', function () { tip.hidden = true; });
        el.addEventListener('blur', function () { tip.hidden = true; });
      });
    })
    .catch(function () {});
})();
