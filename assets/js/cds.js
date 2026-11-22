/* Explore le Code du Sport (CdS) : onglets exploration / enseignement, réponses masquées à afficher,
   questions dépliables sur téléphone. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-cds]");
  if (!racine) return;

  var types = Array.prototype.slice.call(racine.querySelectorAll("[data-type]"));
  function choisir(b) {
    var t = b.getAttribute("data-type");
    types.forEach(function (x) {
      var actif = x === b;
      x.setAttribute("aria-selected", actif ? "true" : "false");
      x.tabIndex = actif ? 0 : -1;
    });
    racine.querySelectorAll("[data-panneau-type]").forEach(function (p) { p.hidden = p.getAttribute("data-panneau-type") !== t; });
  }
  types.forEach(function (b, i) {
    b.addEventListener("click", function () { choisir(b); });
    b.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var j = (i + (e.key === "ArrowRight" ? 1 : types.length - 1)) % types.length;
      choisir(types[j]); types[j].focus();
    });
  });

  /* Réponse masquée : « Afficher la réponse » la montre, « Masquer la réponse » la cache de nouveau. */
  racine.querySelectorAll("[data-afficher]").forEach(function (b) {
    var libelle = b.querySelector("[data-afficher-libelle]");
    var contenu = document.getElementById(b.getAttribute("aria-controls"));
    b.addEventListener("click", function () {
      var afficher = contenu.hidden;
      contenu.hidden = !afficher;
      b.setAttribute("aria-expanded", afficher ? "true" : "false");
      libelle.textContent = afficher ? "Masquer la réponse" : "Afficher la réponse";
      b.closest("[data-question]").classList.toggle("question--devoilee", afficher);
    });
  });

  /* Auto-évaluation, comme dans Réviser : « Je savais » ou « À revoir », enregistré dans ce navigateur. */
  var ETATS = { 0: "À revoir", 1: "Je savais" };
  var suivi = window.Stockage ? window.Stockage.lire("cds", { reponses: {} }) : { reponses: {} };
  if (!suivi || typeof suivi !== "object" || typeof suivi.reponses !== "object") suivi = { reponses: {} };
  var questions = Array.prototype.slice.call(racine.querySelectorAll("[data-cds-id]"));
  function afficherSuivi() {
    var n = { 0: 0, 1: 0, vide: 0 };
    questions.forEach(function (q) {
      var r = suivi.reponses[q.getAttribute("data-cds-id")];
      if (r === 0 || r === 1) n[r]++; else n.vide++;
      q.querySelectorAll("[data-cds-etat]").forEach(function (e) {
        e.hidden = !(r === 0 || r === 1);
        e.textContent = r === 0 || r === 1 ? ETATS[r] : "";
        e.className = "question__etat" + (r === 1 ? " question__etat--sue" : r === 0 ? " question__etat--revoir" : "");
      });
    });
    ["0", "1", "vide"].forEach(function (k) {
      var c = racine.querySelector('[data-cds-compte="' + k + '"]');
      if (c) c.textContent = String(n[k]);
    });
  }
  afficherSuivi();
  racine.querySelectorAll("[data-cds-repondre]").forEach(function (b) {
    b.addEventListener("click", function () {
      var q = b.closest("[data-cds-id]");
      suivi.reponses[q.getAttribute("data-cds-id")] = b.getAttribute("data-cds-repondre") === "1" ? 1 : 0;
      if (window.Stockage) window.Stockage.ecrire("cds", suivi);
      afficherSuivi();
      // La réponse se referme : la question est prête pour la prochaine révision.
      var afficher = q.querySelector("[data-afficher]");
      if (afficher && afficher.getAttribute("aria-expanded") === "true") afficher.click();
      if (afficher) afficher.focus();
    });
  });

  racine.querySelectorAll("[data-question-bouton]").forEach(function (b) {
    b.addEventListener("click", function () {
      var q = b.closest("[data-question]");
      var ouvrir = !q.classList.contains("question--ouverte");
      q.classList.toggle("question--ouverte", ouvrir);
      b.setAttribute("aria-expanded", ouvrir ? "true" : "false");
    });
  });
})();
