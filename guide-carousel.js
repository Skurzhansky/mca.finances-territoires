// Carrousel "Guide" de la page d'accueil : rotation automatique toutes les 6s,
// navigation manuelle via les points.
(function () {
  var root = document.getElementById('guide-carousel');
  if (!root) return;

  var slides = root.querySelectorAll('.guide-carousel__slide');
  var dots = root.querySelectorAll('.guide-carousel__dot');
  var current = 0;
  var timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(function () { show(current + 1); }, 6000);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      show(i);
      startAutoplay();
    });
  });

  show(0);
  startAutoplay();
})();
