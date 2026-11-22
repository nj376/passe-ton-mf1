/* Module capacitaire : onglets des quatre écrits et auto-évaluation par rubrique
   (« Je maîtrise » = 1, « À revoir » = 0), enregistrée dans ce navigateur (clé ptmf1:capa).
   Sans JavaScript, les quatre écrits restent affichés l’un sous l’autre. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-capa]");
  if (!racine) return;
  var ETATS = { 0: "À revoir", 1: "Je maîtrise" };

  /* ---------- Onglets : les cartes des écrits ---------- */
  var onglets = Array.prototype.slice.call(racine.querySelectorAll("[data-capa-onglet]"));
  var panneaux = Array.prototype.slice.call(racine.querySelectorAll("[data-capa-panneau]"));
  function choisir(id, focus) {
    onglets.forEach(function (o) {
      var actif = o.getAttribute("data-capa-onglet") === id;
      o.setAttribute("aria-selected", actif ? "true" : "false");
      o.tabIndex = actif ? 0 : -1;
      if (actif && focus) o.focus();
    });
    panneaux.forEach(function (p) { p.hidden = p.getAttribute("data-capa-panneau") !== id; });
  }
  onglets.forEach(function (o, i) {
    o.addEventListener("click", function () {
      var id = o.getAttribute("data-capa-onglet");
      choisir(id);
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    });
    o.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var j = (i + (e.key === "ArrowRight" ? 1 : onglets.length - 1)) % onglets.length;
      choisir(onglets[j].getAttribute("data-capa-onglet"), true);
    });
  });
  var depart = location.hash.slice(1);
  choisir(onglets.some(function (o) { return o.getAttribute("data-capa-onglet") === depart; }) ? depart : onglets[0].getAttribute("data-capa-onglet"));

  /* ---------- Auto-évaluation ---------- */
  var suivi = window.Stockage ? window.Stockage.lire("capa", { reponses: {} }) : { reponses: {} };
  if (!suivi || typeof suivi !== "object" || typeof suivi.reponses !== "object") suivi = { reponses: {} };
  function afficher() {
    panneaux.forEach(function (p) {
      var id = p.getAttribute("data-capa-panneau"), fiches = p.querySelectorAll("[data-capa-id]"), ok = 0;
      fiches.forEach(function (f) {
        var r = suivi.reponses[f.getAttribute("data-capa-id")], etat = f.querySelector("[data-capa-etat]");
        if (r === 1) ok++;
        etat.hidden = !(r === 0 || r === 1);
        etat.textContent = r === 0 || r === 1 ? ETATS[r] : "";
        etat.className = "question__etat" + (r === 1 ? " question__etat--sue" : r === 0 ? " question__etat--revoir" : "");
        f.querySelectorAll("[data-capa-repondre]").forEach(function (b) {
          b.setAttribute("aria-pressed", String(+b.getAttribute("data-capa-repondre")) === String(r) ? "true" : "false");
        });
      });
      var total = fiches.length;
      racine.querySelector('[data-capa-avancement="' + id + '"]').textContent = ok + " sur " + total + " maîtrisée" + (ok > 1 ? "s" : "");
      racine.querySelector('[data-capa-barre="' + id + '"]').style.width = (total ? Math.round(ok / total * 100) : 0) + "%";
    });
  }
  racine.querySelectorAll("[data-capa-repondre]").forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.closest("[data-capa-id]").getAttribute("data-capa-id");
      suivi.reponses[id] = b.getAttribute("data-capa-repondre") === "1" ? 1 : 0;
      if (window.Stockage) window.Stockage.ecrire("capa", suivi);
      afficher();
    });
  });
  afficher();
})();
