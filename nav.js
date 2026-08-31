// Dropdown "Expertises et Solutions" : ouverture au clic (fonctionne au tactile et au clavier),
// le survol en CSS reste un simple bonus desktop.
(function () {
  function closeAll(except) {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (d) {
      if (d !== except) {
        d.classList.remove('is-open');
        var t = d.querySelector('.nav-dropdown__trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
    var trigger = dropdown.querySelector('.nav-dropdown__trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('is-open');
      closeAll(dropdown);
      dropdown.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();
