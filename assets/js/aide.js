/* Page « Aide » : l’entrée du sommaire de la section visible est surlignée (IntersectionObserver).
   Sans JavaScript, le sommaire reste une simple liste de liens d’ancre. */
(function () {
  "use strict";
  var sommaire = document.querySelector("[data-help-sommaire]");
  if (!sommaire || !("IntersectionObserver" in window)) return;
  var liens = Array.prototype.slice.call(sommaire.querySelectorAll("[data-help-lien]"));
  var sections = liens.map(function (a) { return document.getElementById(a.getAttribute("data-help-lien")); }).filter(Boolean);
  var visibles = {};
  function activer(id) {
    liens.forEach(function (a) {
      var actif = a.getAttribute("data-help-lien") === id;
      a.classList.toggle("help-sommaire--actif", actif);
      if (actif) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) { visibles[e.target.id] = e.isIntersecting; });
    // La première section visible (dans l’ordre de la page) est l’entrée active.
    var premiere = sections.filter(function (s) { return visibles[s.id]; })[0];
    if (premiere) activer(premiere.id);
  }, { rootMargin: "-20% 0px -55% 0px" });
  sections.forEach(function (s) { obs.observe(s); });
  activer((location.hash || "").replace("#", "") || sections[0].id);
})();
