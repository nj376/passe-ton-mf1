/* Stockage du suivi personnel : uniquement dans ce navigateur (localStorage).
   Chaque lecture et écriture est protégée : si le stockage est refusé
   (navigation privée, réglages du navigateur), le site fonctionne quand même,
   le suivi n’est simplement pas conservé. */
(function () {
  "use strict";
  var PREFIXE = "ptmf1:";
  var memoire = {}; // repli si localStorage est indisponible

  function disponible() {
    try {
      var cle = PREFIXE + "test";
      window.localStorage.setItem(cle, "1");
      window.localStorage.removeItem(cle);
      return true;
    } catch (e) {
      return false;
    }
  }
  var actif = disponible();
  // Ménage : clé de l'ancien bandeau d'accueil (supprimé), devenue inutile.
  try { window.localStorage.removeItem("ptmf1-entree"); } catch (e) { /* rien */ }

  function lire(nom, defaut) {
    var brut = null;
    try {
      brut = actif ? window.localStorage.getItem(PREFIXE + nom) : memoire[nom];
    } catch (e) {
      brut = memoire[nom];
    }
    if (brut === null || brut === undefined) return defaut;
    try {
      return JSON.parse(brut);
    } catch (e) {
      return defaut;
    }
  }

  function ecrire(nom, valeur) {
    var brut;
    try {
      brut = JSON.stringify(valeur);
    } catch (e) {
      return false;
    }
    memoire[nom] = brut;
    if (!actif) return false;
    try {
      window.localStorage.setItem(PREFIXE + nom, brut);
      return true;
    } catch (e) {
      return false;
    }
  }

  function toutEffacer() {
    memoire = {};
    if (!actif) return;
    try {
      var cles = [];
      for (var i = 0; i < window.localStorage.length; i++) {
        var cle = window.localStorage.key(i);
        if (cle && cle.indexOf(PREFIXE) === 0) cles.push(cle);
      }
      cles.forEach(function (c) { window.localStorage.removeItem(c); });
    } catch (e) { /* rien à faire */ }
  }

  window.Stockage = { lire: lire, ecrire: ecrire, toutEffacer: toutEffacer };
})();
