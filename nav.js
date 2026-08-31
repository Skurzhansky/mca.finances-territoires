// Navigation en cascade : ouverture au clic (fonctionne au tactile et au clavier),
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
  function closeSubmenus(except) {
    document.querySelectorAll('.nav-menu-item.is-open').forEach(function (m) {
      if (m !== except) m.classList.remove('is-open');
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
      if (isOpen) closeSubmenus();
    });
  });

  document.querySelectorAll('.nav-menu-item__arrow').forEach(function (arrow) {
    arrow.addEventListener('click', function (e) {
      e.stopPropagation();
      var item = arrow.closest('.nav-menu-item');
      if (!item) return;
      var isOpen = item.classList.contains('is-open');
      closeSubmenus(item);
      item.classList.toggle('is-open', !isOpen);
    });
  });

  var siteHeader = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle && siteHeader) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = siteHeader.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) { closeAll(); closeSubmenus(); }
    });
  }

  document.addEventListener('click', function () {
    closeAll();
    closeSubmenus();
    if (siteHeader) siteHeader.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
      closeSubmenus();
      if (siteHeader) siteHeader.classList.remove('nav-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
