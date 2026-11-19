// Page « Réussites » : filtres par type de porteur et par région, combinés
// (une carte reste visible si elle correspond au type ET à la région choisis).
(function () {
  var box = document.querySelector('[data-rs-filters]');
  var grid = document.querySelector('[data-rs-grid]');
  var empty = document.querySelector('[data-rs-empty]');
  if (!box || !grid) return;
  var cards = grid.querySelectorAll('.rs-card');
  var active = { type: '', region: '' };

  function apply() {
    var shown = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var matchType = !active.type || card.dataset.rsType === active.type;
      var matchRegion = !active.region || card.dataset.rsRegion === active.region;
      var ok = matchType && matchRegion;
      card.hidden = !ok;
      if (ok) shown++;
    }
    if (empty) empty.hidden = shown > 0;
  }

  box.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-rs-filter]');
    if (!chip) return;
    var group = chip.dataset.rsFilter;
    active[group] = chip.dataset.rsValue;
    box.querySelectorAll('[data-rs-filter="' + group + '"]').forEach(function (b) {
      b.classList.toggle('is-active', b === chip);
    });
    apply();
  });
})();
