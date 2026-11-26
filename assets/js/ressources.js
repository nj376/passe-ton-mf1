/* Ressources : commutateur entre les fiches et les outils de calcul.
   Sans JavaScript, le commutateur reste caché et les deux parties s’affichent l’une sous l’autre.
   L’adresse /ressources/#outils (ou l’ancre d’un groupe d’outils) ouvre directement l’onglet Outils ;
   les ancres des sections de fiches (#theorie, #le-cadre…) ouvrent l’onglet Fiches. */
(function () {
  "use strict";
  var commutateur = document.querySelector("[data-commutateur]");
  if (!commutateur) return;
  var onglets = Array.prototype.slice.call(commutateur.querySelectorAll("[data-onglet]"));
  var panneaux = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-panneau]"), function (p) { panneaux[p.getAttribute("data-panneau")] = p; });
  if (!panneaux.fiches || !panneaux.outils) return;

  function afficher(nom, focus) {
    onglets.forEach(function (b) {
      var actif = b.getAttribute("data-onglet") === nom;
      b.setAttribute("aria-selected", actif ? "true" : "false");
      b.tabIndex = actif ? 0 : -1;
      if (actif && focus) b.focus();
    });
    Object.keys(panneaux).forEach(function (k) { panneaux[k].hidden = k !== nom; });
  }

  /* L’onglet à ouvrir d’après l’ancre de l’adresse. */
  function ongletDeAncre() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return "fiches";
    if (id === "outils") return "outils";
    var cible = document.getElementById(id);
    return cible && panneaux.outils.contains(cible) ? "outils" : "fiches";
  }

  function choisir(nom, focus) {
    afficher(nom, focus);
    var adresse = nom === "outils" ? "#outils" : location.pathname + location.search;
    try { history.replaceState(null, "", adresse); } catch (e) { /* adresse inchangée */ }
  }

  onglets.forEach(function (b, i) {
    b.addEventListener("click", function () { choisir(b.getAttribute("data-onglet"), false); });
    b.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight") j = (i + 1) % onglets.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + onglets.length) % onglets.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = onglets.length - 1;
      if (j === null) return;
      e.preventDefault();
      choisir(onglets[j].getAttribute("data-onglet"), true);
    });
  });

  window.addEventListener("hashchange", function () { afficher(ongletDeAncre(), false); });

  commutateur.hidden = false;
  afficher(ongletDeAncre(), false);
  /* L’onglet étant ouvert, ramener la vue sur l’ancre demandée. */
  if (location.hash.length > 1) {
    var cible = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (cible && cible.id !== "outils") cible.scrollIntoView();
  }
}());
