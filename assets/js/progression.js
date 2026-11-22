/* Page « Progression » : niveau, compétence, technique, étapes (une seule ouverte à la fois).
   Adresse #<compétence> (ex. #n1-equiper) : arrivée directe sur une compétence. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-progression-page]");
  if (!racine) return;

  function tous(sel, dans) { return Array.prototype.slice.call((dans || racine).querySelectorAll(sel)); }

  /* ---------- Niveaux (onglets accessibles au clavier) ---------- */
  var niveaux = tous("[data-prog-niveau]");
  function choisirNiveau(b, focaliser) {
    var id = b.getAttribute("data-prog-niveau");
    niveaux.forEach(function (x) {
      var actif = x === b;
      x.setAttribute("aria-selected", actif ? "true" : "false");
      x.tabIndex = actif ? 0 : -1;
    });
    tous("[data-prog-panneau]").forEach(function (p) { p.hidden = p.getAttribute("data-prog-panneau") !== id; });
    var panneau = racine.querySelector('[data-prog-panneau="' + id + '"]');
    var choisie = panneau && panneau.querySelector('[data-prog-competence][aria-pressed="true"]');
    if (choisie) majAdresse(choisie.getAttribute("data-prog-competence"));
    if (focaliser) b.focus();
  }
  niveaux.forEach(function (b, i) {
    b.addEventListener("click", function () { choisirNiveau(b); });
    b.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight") j = (i + 1) % niveaux.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + niveaux.length) % niveaux.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = niveaux.length - 1;
      if (j === null) return;
      e.preventDefault();
      choisirNiveau(niveaux[j], true);
    });
  });

  /* ---------- Compétence ---------- */
  function choisirCompetence(cle) {
    var bouton = racine.querySelector('[data-prog-competence="' + cle + '"]');
    if (!bouton) return false;
    var panneau = bouton.closest("[data-prog-panneau]");
    tous("[data-prog-competence]", panneau).forEach(function (x) { x.setAttribute("aria-pressed", x === bouton ? "true" : "false"); });
    tous("[data-prog-detail]", panneau).forEach(function (d) { d.hidden = d.getAttribute("data-prog-detail") !== cle; });
    tous("[data-prog-arrivee]", panneau).forEach(function (d) { d.hidden = d.getAttribute("data-prog-arrivee") !== cle; });
    var detail = panneau.querySelector('[data-prog-detail="' + cle + '"]');
    var tech = detail.querySelector('[data-technique][aria-pressed="true"]') || detail.querySelector("[data-technique]");
    if (tech) choisirTechnique(tech);
    majAdresse(cle);
    return panneau;
  }
  tous("[data-prog-competence]").forEach(function (b) {
    b.addEventListener("click", function () {
      var panneau = choisirCompetence(b.getAttribute("data-prog-competence"));
      // La progression s'affiche sous la liste : on y descend sur téléphone,
      // et sur ordinateur quand elle est hors de l'écran (longue liste du cursus jeunes).
      var d = panneau && panneau.querySelector('[data-prog-detail="' + b.getAttribute("data-prog-competence") + '"]');
      if (d && (window.matchMedia("(max-width: 900px)").matches || d.getBoundingClientRect().top > window.innerHeight - 120)) {
        d.scrollIntoView({ block: "start" });
      }
    });
  });

  /* ---------- Technique ---------- */
  function choisirTechnique(b) {
    var detail = b.closest("[data-prog-detail]");
    var i = b.getAttribute("data-technique");
    tous("[data-technique]", detail).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    tous("[data-frise]", detail).forEach(function (f) { f.hidden = f.getAttribute("data-frise") !== i; });
    tous("[data-curseurs]", detail).forEach(function (u) { u.hidden = u.getAttribute("data-curseurs") !== i; });
    var ul = detail.querySelector('[data-curseurs="' + i + '"]');
    var compte = detail.querySelector("[data-nb-etapes]");
    if (ul && compte) compte.textContent = ul.getAttribute("data-nb") + " étapes";
    ouvrirEtape(detail.querySelector('[data-frise="' + i + '"]'), 0);
  }
  tous("[data-technique]").forEach(function (b) {
    b.addEventListener("click", function () { choisirTechnique(b); });
  });

  /* ---------- Étapes : une seule ouverte à la fois ---------- */
  function ouvrirEtape(frise, rang) {
    if (!frise) return;
    tous("[data-etape]", frise).forEach(function (li, k) {
      var ouvrir = k === rang;
      li.classList.toggle("etape--ouverte", ouvrir);
      li.querySelector("[data-etape-bouton]").setAttribute("aria-expanded", ouvrir ? "true" : "false");
    });
  }
  racine.addEventListener("click", function (e) {
    var b = e.target.closest("[data-etape-bouton]");
    if (!b) return;
    var li = b.closest("[data-etape]");
    var frise = li.closest("[data-frise]");
    if (li.classList.contains("etape--ouverte")) {
      li.classList.remove("etape--ouverte");
      b.setAttribute("aria-expanded", "false");
    } else {
      ouvrirEtape(frise, tous("[data-etape]", frise).indexOf(li));
    }
  });

  /* ---------- Textes longs (point d'arrivée, prérogatives) : replier / déplier ---------- */
  tous("[data-deplier]").forEach(function (b) {
    b.addEventListener("click", function () {
      var texte = document.getElementById(b.getAttribute("aria-controls"));
      var ouvrir = b.getAttribute("aria-expanded") !== "true";
      texte.classList.toggle(b.getAttribute("data-classe-replie") || "cote-bloc__texte--replie", !ouvrir);
      b.setAttribute("aria-expanded", ouvrir ? "true" : "false");
      b.textContent = ouvrir ? "Réduire" : "Lire la suite";
    });
  });

  /* ---------- Adresse ---------- */
  function majAdresse(cle) {
    try { history.replaceState(null, "", "#" + cle); } catch (e) { /* rien */ }
  }
  // Compteur d'étapes de chaque compétence affichée au départ.
  tous("[data-prog-detail]").forEach(function (d) {
    var t = d.querySelector('[data-technique][aria-pressed="true"]');
    var ul = t && d.querySelector('[data-curseurs="' + t.getAttribute("data-technique") + '"]');
    var compte = d.querySelector("[data-nb-etapes]");
    if (ul && compte) compte.textContent = ul.getAttribute("data-nb") + " étapes";
  });
  var demande = (location.hash || "").replace(/^#/, "").toLowerCase();
  if (demande) {
    var panneau = choisirCompetence(demande);
    if (panneau) {
      var b = niveaux.filter(function (x) { return x.getAttribute("data-prog-niveau") === panneau.getAttribute("data-prog-panneau"); })[0];
      if (b) choisirNiveau(b);
    }
  }
})();
