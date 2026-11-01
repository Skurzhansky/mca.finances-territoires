// Carrousel « Réussites » de la page d'accueil : défilement d'une carte à la
// fois, 3 / 2 / 1 cartes visibles selon la largeur, rotation auto 5 s.
(function () {
  var root = document.getElementById('ru-carousel');
  if (!root) return;
  var track = root.querySelector('.ru-track');
  var cards = track.children;
  var dotsBox = root.querySelector('.ru-dots');
  var idx = 0, timer = null;

  function visible() {
    var w = window.innerWidth;
    return w <= 640 ? 1 : w <= 1000 ? 2 : 3;
  }
  function pages() { return Math.max(1, cards.length - visible() + 1); }

  function render() {
    var n = pages();
    if (idx > n - 1) idx = n - 1;
    if (idx < 0) idx = 0;
    var card = cards[0];
    if (!card) return;
    var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    track.style.transform = 'translateX(-' + idx * (card.getBoundingClientRect().width + gap) + 'px)';
    var dots = '';
    for (var i = 0; i < n; i++) dots += '<button type="button" class="ru-dot' + (i === idx ? ' is-on' : '') + '" data-i="' + i + '" aria-label="Diapositive ' + (i + 1) + ' sur ' + n + '"></button>';
    dotsBox.innerHTML = dots;
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { idx = idx + 1 > pages() - 1 ? 0 : idx + 1; render(); }, 5000);
  }

  root.querySelector('.ru-prev').addEventListener('click', function () { idx -= 1; render(); restart(); });
  root.querySelector('.ru-next').addEventListener('click', function () { idx = idx + 1 > pages() - 1 ? 0 : idx + 1; render(); restart(); });
  dotsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.ru-dot');
    if (!b) return;
    idx = Number(b.dataset.i); render(); restart();
  });
  window.addEventListener('resize', render);
  render();
  restart();
})();
