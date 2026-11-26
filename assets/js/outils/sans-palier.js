/* Outil « Courbe de sécurité » (/outils/sans-palier/) : durée maximale sans palier obligatoire.
   1. Tables fédérales MN90 : courbe lue dans les tables officielles (data/outils/mn90-sans-palier.yaml, transmise par la page
      dans data-mn90) ; profondeur lue à la valeur immédiatement supérieure ; nitrox par la profondeur équivalente du mode d’emploi.
   2. Modèle de Bühlmann ZH-L16C (paramètres azote : A. A. Bühlmann, Decompression - Decompression Sickness, 1984,
      tels que tabulés par l’article Wikipédia « Bühlmann decompression algorithm ») : 16 compartiments, plongée unique,
      descente instantanée, tissus saturés à l’air en surface, vapeur d’eau alvéolaire 0,0627 bar, pression en surface 1 bar.
      Le facteur de gradient haut réduit la tension tolérée en surface : Ptol = Psurf + GF × (M − Psurf), M = a + Psurf ÷ b.
   Les calculs sont des fonctions pures, testables hors du navigateur. */
(function () {
  "use strict";
  var EPS = 1e-9;
  var T = [5, 8, 12.5, 18.5, 27, 38.3, 54.3, 77, 109, 146, 187, 239, 305, 390, 498, 635];
  var A = [1.1696, 1.0, 0.8618, 0.7562, 0.62, 0.5043, 0.441, 0.4, 0.375, 0.35, 0.3295, 0.3065, 0.2835, 0.261, 0.248, 0.2327];
  var B = [0.5578, 0.6514, 0.7222, 0.7825, 0.8126, 0.8434, 0.8693, 0.8910, 0.9092, 0.9222, 0.9319, 0.9403, 0.9477, 0.9544, 0.9602, 0.9653];
  var PH2O = 0.0627, PSURF = 1;

  var Calcul = {
    pabs: function (profondeur) { return 1 + profondeur / 10; },
    pe: function (profondeur, fo2) { return (profondeur + 10) * (1 - fo2) / 0.79 - 10; },

    /* Ligne MN90 : la profondeur de la table immédiatement supérieure (ou égale). */
    ligneMN90: function (courbe, profondeur) {
      for (var i = 0; i < courbe.length; i++) { if (courbe[i].profondeur >= profondeur - EPS) return courbe[i]; }
      return null;
    },

    /* Durée sans palier du modèle de Bühlmann, en minutes (Infinity si aucun compartiment n’atteint sa limite). */
    buhlmann: function (profondeur, fo2, gf) {
      var palv = (Calcul.pabs(profondeur) - PH2O) * (1 - fo2);
      var p0 = (PSURF - PH2O) * 0.79;
      var mini = Infinity, directeur = null;
      for (var i = 0; i < T.length; i++) {
        var m = A[i] + PSURF / B[i];
        var tol = PSURF + gf * (m - PSURF);
        if (palv <= tol + EPS) continue;
        if (p0 >= tol - EPS) return { duree: 0, compartiment: i + 1 };
        var t = -T[i] * Math.log((tol - palv) / (p0 - palv)) / Math.LN2;
        if (t < mini) { mini = t; directeur = i + 1; }
      }
      return { duree: mini, compartiment: directeur };
    },

    calculer: function (d, courbe) {
      var e = [];
      if (!(d.profondeur > 0)) e.push("La profondeur doit être supérieure à 0.");
      if (!(d.o2 >= 21 && d.o2 <= 100)) e.push("L’oxygène doit être compris entre 21 et 100 %.");
      if (!(d.gf >= 30 && d.gf <= 100)) e.push("Le facteur de gradient haut doit être compris entre 30 et 100 %.");
      if (e.length) return { erreurs: e };
      var fo2 = d.o2 / 100;
      var r = { fo2: fo2, pabs: Calcul.pabs(d.profondeur), alertes: [] };
      r.ppo2 = r.pabs * fo2;
      if (r.ppo2 > 1.6 + EPS) r.alertes.push("La PpO2 dépasse 1,6 bar : cette profondeur est interdite avec ce mélange (Code du sport).");
      if (d.profondeur > 60 + EPS) r.alertes.push("Au-delà de 60 m, la plongée à l’air et au nitrox est interdite (Code du sport).");
      r.profondeurTable = fo2 > 0.21 + EPS ? Math.max(Calcul.pe(d.profondeur, fo2), 0) : d.profondeur;
      r.ligne = Calcul.ligneMN90(courbe, r.profondeurTable);
      r.buhlmann = Calcul.buhlmann(d.profondeur, fo2, d.gf / 100);
      return r;
    }
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = Calcul; }
  if (typeof document === "undefined") return;

  /* ---------- Affichage ---------- */
  var NB = " ";
  function nombre(n, dec) {
    var arrondi = Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec);
    return arrondi.toLocaleString("fr-FR", { maximumFractionDigits: dec });
  }
  function duree(min) {
    if (min >= 60) { var h = Math.floor(min / 60), m = min % 60; return h + NB + "h" + (m ? NB + (m < 10 ? "0" : "") + m : ""); }
    return min + NB + "min";
  }
  function lire(champ) {
    var t = champ.value.trim().replace(/\s/g, "").replace(",", ".");
    if (t === "") return NaN;
    return /^-?\d*\.?\d+$/.test(t) ? parseFloat(t) : NaN;
  }
  function el(balise, classe, texte) {
    var e = document.createElement(balise);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    return e;
  }

  var racine = document.querySelector('[data-outil="sans-palier"]');
  if (!racine) return;
  var courbe = JSON.parse(racine.getAttribute("data-mn90"));
  var form = racine.querySelector("[data-form]");

  function texteMN90(r) {
    if (!r.ligne) return "hors table";
    if (r.ligne.duree === 0) return "palier dès 5" + NB + "min";
    return (r.ligne.finTable ? "plus de " : "") + duree(r.ligne.duree);
  }
  function texteBuhlmann(b) {
    if (b.duree === Infinity || b.duree > 999) return "plus de 999" + NB + "min";
    return duree(Math.floor(b.duree + EPS));
  }

  function rendre() {
    var d = {};
    Array.prototype.forEach.call(form.querySelectorAll("[data-champ]"), function (c) { d[c.getAttribute("data-champ")] = lire(c); });
    var r = Calcul.calculer(d, courbe);
    var erreur = racine.querySelector("[data-erreur]");
    var alerte = racine.querySelector("[data-alerte]");
    var sortie = function (k) { return racine.querySelector('[data-r="' + k + '"]'); };
    var pasapas = racine.querySelector("[data-pasapas]");
    pasapas.textContent = "";
    alerte.hidden = true;
    if (r.erreurs) {
      erreur.textContent = r.erreurs.join(" ");
      erreur.hidden = false;
      ["mn90", "buhlmann", "ppo2"].forEach(function (k) { sortie(k).textContent = "–"; });
      return;
    }
    erreur.hidden = true;
    if (r.alertes.length) { alerte.textContent = r.alertes.join(" "); alerte.hidden = false; }
    sortie("mn90").textContent = texteMN90(r);
    sortie("buhlmann").textContent = texteBuhlmann(r.buhlmann);
    sortie("ppo2").textContent = nombre(r.ppo2, 2) + NB + "bar";

    function etape(libelle, texte) { var li = el("li"); li.appendChild(el("strong", "", libelle)); li.appendChild(document.createTextNode(NB + ": " + texte)); pasapas.appendChild(li); }
    if (r.fo2 > 0.21 + EPS) etape("Profondeur équivalente pour la table", "(" + nombre(d.profondeur, 1) + " + 10) × " + nombre(1 - r.fo2, 2) + " ÷ 0,79 − 10 ≈ " + nombre(r.profondeurTable, 1) + NB + "m");
    if (!r.ligne) etape("Table MN90", "la profondeur dépasse la dernière ligne de la courbe (60" + NB + "m)");
    else etape("Table MN90", "ligne de " + r.ligne.profondeur + NB + "m" + (Math.abs(r.ligne.profondeur - r.profondeurTable) < EPS ? "" : ", la profondeur immédiatement supérieure") + " ; " +
      (r.ligne.duree === 0 ? "même 5" + NB + "min imposent un palier" :
        r.ligne.finTable ? "aucun palier jusqu’à la dernière ligne de la table, " + duree(r.ligne.duree) :
          "plus longue durée sans palier : " + duree(r.ligne.duree)));
    var b = r.buhlmann;
    etape("Modèle de Bühlmann", "pression d’azote respirée " + nombre((r.pabs - PH2O) * (1 - r.fo2), 2) + NB + "bar ; avec un facteur de gradient haut de " + nombre(d.gf, 0) + NB + "%, " +
      (b.duree === Infinity ? "aucun compartiment n’atteint sa limite de surface" :
        "le premier compartiment à atteindre sa limite de surface est le n°" + NB + b.compartiment + " (période " + nombre(T[b.compartiment - 1], 1) + NB + "min), au bout de " + nombre(b.duree, 1) + NB + "min"));
  }

  form.addEventListener("input", rendre);
  form.addEventListener("submit", function (e) { e.preventDefault(); rendre(); });
  Array.prototype.forEach.call(racine.querySelectorAll("[data-gf]"), function (bt) {
    bt.addEventListener("click", function () { form.querySelector('[data-champ="gf"]').value = bt.getAttribute("data-gf"); rendre(); });
  });
  Array.prototype.forEach.call(racine.querySelectorAll("[data-exemple]"), function (bt) {
    bt.addEventListener("click", function () {
      var v = bt.getAttribute("data-exemple").split(";");
      Array.prototype.forEach.call(form.querySelectorAll("[data-champ]"), function (c, i) { if (v[i] !== undefined) c.value = v[i]; });
      rendre();
    });
  });

  /* Tableau de comparaison (shortcode table-sans-palier) : cellules Bühlmann remplies ici, à l’air. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-buhlmann]"), function (td) {
    td.textContent = texteBuhlmann(Calcul.buhlmann(parseFloat(td.getAttribute("data-buhlmann")), 0.21, parseFloat(td.getAttribute("data-gf-table"))));
  });
  rendre();
}());
