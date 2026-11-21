/* Comportements communs à toutes les pages : fenêtres,
   petites aides « ? », menu téléphone. Aucune fenêtre ne s’ouvre toute seule. */
(function () {
  "use strict";

  var menuBouton = document.querySelector("[data-menu-bouton]");
  var menuVoile = document.querySelector("[data-menu-voile]");

  /* ---------- Menu téléphone ---------- */
  function menuOuvert() {
    return menuBouton && menuBouton.getAttribute("aria-expanded") === "true";
  }
  function basculerMenu(ouvrir) {
    if (!menuBouton || !menuVoile) return;
    menuBouton.setAttribute("aria-expanded", ouvrir ? "true" : "false");
    menuBouton.setAttribute("aria-label", ouvrir ? "Fermer le menu" : "Ouvrir le menu");
    menuVoile.hidden = !ouvrir;
  }
  if (menuBouton) {
    menuBouton.addEventListener("click", function () { basculerMenu(!menuOuvert()); });
  }
  if (menuVoile) {
    // Toucher le voile, en dehors du panneau, ferme le menu.
    menuVoile.addEventListener("click", function (e) {
      if (e.target === menuVoile) basculerMenu(false);
    });
  }

  /* ---------- Fenêtres ---------- */
  function ouvrirFenetre(id) {
    var f = document.getElementById(id);
    if (!f || typeof f.showModal !== "function") return;
    basculerMenu(false);
    if (!f.open) {
      f.showModal();
      // Le lecteur d’écran annonce le titre ; aucun bouton n’est encadré d’office,
      // sauf si la fenêtre désigne elle-même un élément (attribut autofocus).
      if (!f.querySelector("[autofocus]")) f.focus();
    }
  }
  function fermerFenetre(f) {
    if (f && f.open) f.close();
  }

  document.addEventListener("click", function (e) {
    var cible = e.target.closest("[data-ouvrir]");
    if (cible) {
      var avant = cible.getAttribute("data-fermer-avant");
      if (avant) fermerFenetre(document.getElementById(avant));
      ouvrirFenetre(cible.getAttribute("data-ouvrir"));
      return;
    }
    var fermer = e.target.closest("[data-fermer]");
    if (fermer) {
      fermerFenetre(fermer.closest("dialog"));
      return;
    }
    // Clic sur le voile d’une fenêtre (hors de son contenu) : fermeture.
    if (e.target.tagName === "DIALOG" && e.target.open) {
      var r = e.target.getBoundingClientRect();
      var dedans = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!dedans) fermerFenetre(e.target);
    }
  });

  /* ---------- Petites aides « ? » à côté des titres ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-bascule]");
    if (!b) return;
    var zone = document.getElementById(b.getAttribute("aria-controls"));
    if (!zone) return;
    var ouvrir = zone.hidden;
    zone.hidden = !ouvrir;
    b.setAttribute("aria-expanded", ouvrir ? "true" : "false");
  });

  /* ---------- Touche Échap : ferme le menu téléphone ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOuvert()) {
      basculerMenu(false);
      menuBouton.focus();
    }
  });

  /* ---------- Liens externes : nouvelle fenêtre ---------- */
  document.querySelectorAll('a[href^="http"]').forEach(function (a) {
    if (a.host === location.host) return;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (!a.querySelector(".visuellement-cache")) {
      var s = document.createElement("span");
      s.className = "visuellement-cache";
      s.textContent = " (nouvelle fenêtre)";
      a.appendChild(s);
    }
  });

  window.Interface = { ouvrirFenetre: ouvrirFenetre, fermerFenetre: fermerFenetre };

  /* Retour en haut de la page : visible après un écran de défilement. */
  (function () {
    var haut = document.querySelector("[data-haut-page]");
    if (!haut) return;
    var maj = function () { haut.hidden = window.scrollY < window.innerHeight * 0.8; };
    window.addEventListener("scroll", maj, { passive: true });
    maj();
    haut.addEventListener("click", function (e) {
      e.preventDefault();
      var doux = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      window.scrollTo({ top: 0, behavior: doux ? "smooth" : "auto" });
      var principal = document.getElementById("contenu");
      if (principal) principal.focus({ preventScroll: true });
    });
  })();

  /* Barre « Mon suivi » : une phrase d'humour au hasard, précédée de « J-45 » si la date d'examen est renseignée. */
  (function () {
    var zone = document.querySelector("[data-barre-suivi]");
    if (!zone) return;
    var phrases = [];
    try { phrases = JSON.parse(zone.getAttribute("data-phrases")) || []; } catch (e) { /* phrase par défaut */ }
    var texte = phrases.length ? phrases[Math.floor(Math.random() * phrases.length)] : zone.textContent;
    try {
      var examen = localStorage.getItem("ptmf1:examen");
      if (examen && /^\d{4}-\d{2}-\d{2}$/.test(examen)) {
        var d = new Date(), p = examen.split("-");
        var n = Math.round((new Date(+p[0], p[1] - 1, +p[2]) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
        if (n > 0) texte = "J-" + n + " · " + texte;
        else if (n === 0) texte = "Jour J · " + texte;
      }
    } catch (e) { /* stockage indisponible */ }
    zone.textContent = texte;
  })();

  /* Avis « version mobile » : sur téléphone (600 px au plus), une seule fois, à la première visite. */
  (function () {
    var avis = document.getElementById("fenetre-avis-mobile");
    if (!avis || !window.matchMedia || !window.matchMedia("(max-width: 600px)").matches) return;
    try {
      if (localStorage.getItem("ptmf1-avis-mobile")) return;
      localStorage.setItem("ptmf1-avis-mobile", "1");
    } catch (e) { return; } // stockage indisponible : on n'insiste pas
    ouvrirFenetre("fenetre-avis-mobile");
  })();
})();
