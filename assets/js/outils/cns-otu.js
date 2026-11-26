/* Outil « Exposition à l’oxygène : CNS et OTU » (/outils/cns-otu/).
   Source : R. W. Hamilton, « Tolerating oxygen exposure », SPUMS Journal 27(1), 1997, p. 43-47, qui reproduit
   la table 15-1 du NOAA Diving Manual (1991) et donne la formule des OTU (Lambertsen) et la table Repex.
   - CNS : durée ÷ limite NOAA pour une exposition unique ; limite interpolée linéairement entre les lignes de la table ;
     pas de limite sous 0,6 bar ; au-dessus de 1,6 bar, le Code du sport interdit l’exposition (pas d’extrapolation).
   - Même calcul avec la limite NOAA sur 24 heures, pour la part de la limite journalière.
   - OTU = durée × ((PpO2 − 0,5) ÷ 0,5) ^ 0,83, nul sous 0,5 bar.
   Pression absolue = 1 + profondeur ÷ 10. Les calculs sont des fonctions pures, testables hors du navigateur. */
(function () {
  "use strict";

  /* PpO2 (bar), limite pour une exposition unique (min), limite sur 24 heures (min). */
  var NOAA = [
    [0.6, 720, 720], [0.7, 570, 570], [0.8, 450, 450], [0.9, 360, 360], [1.0, 300, 300], [1.1, 240, 270],
    [1.2, 210, 240], [1.3, 180, 210], [1.4, 150, 180], [1.5, 120, 180], [1.6, 45, 150]
  ];
  var EPS = 1e-9;

  var Calcul = {
    NOAA: NOAA,
    pabs: function (profondeur) { return 1 + profondeur / 10; },
    /* Limite NOAA (colonne 1 : exposition unique, 2 : 24 heures) pour une PpO2, interpolée ; null sous 0,6 bar. */
    limite: function (ppo2, colonne) {
      if (ppo2 < NOAA[0][0] - EPS) return null;
      if (ppo2 > 1.6 + EPS) return undefined;
      for (var i = 0; i < NOAA.length - 1; i++) {
        var a = NOAA[i], b = NOAA[i + 1];
        if (ppo2 <= b[0] + EPS) {
          var x = (ppo2 - a[0]) / (b[0] - a[0]);
          return a[colonne] + x * (b[colonne] - a[colonne]);
        }
      }
      return NOAA[NOAA.length - 1][colonne];
    },
    otu: function (ppo2, duree) { return ppo2 <= 0.5 ? 0 : duree * Math.pow((ppo2 - 0.5) / 0.5, 0.83); },

    segment: function (s) {
      var e = [];
      if (!(s.profondeur >= 0)) e.push("la profondeur ne peut pas être négative");
      if (!(s.duree > 0)) e.push("la durée doit être supérieure à 0");
      if (!(s.o2 >= 21 && s.o2 <= 100)) e.push("l’oxygène doit être compris entre 21 et 100 %");
      if (e.length) return { erreurs: e };
      var ppo2 = Calcul.pabs(s.profondeur) * s.o2 / 100;
      var r = { ppo2: ppo2, duree: s.duree };
      if (ppo2 > 1.6 + EPS) { r.interdit = true; return r; }
      r.limite = Calcul.limite(ppo2, 1);
      r.limite24 = Calcul.limite(ppo2, 2);
      r.cns = r.limite ? 100 * s.duree / r.limite : 0;
      r.cns24 = r.limite24 ? 100 * s.duree / r.limite24 : 0;
      r.otu = Calcul.otu(ppo2, s.duree);
      return r;
    },

    plongee: function (segments) {
      var res = { segments: [], cns: 0, cns24: 0, otu: 0, duree: 0, erreurs: [], interdit: false };
      segments.forEach(function (s, i) {
        var r = Calcul.segment(s);
        res.segments.push(r);
        if (r.erreurs) { res.erreurs.push("Segment " + (i + 1) + " : " + r.erreurs.join(", ") + "."); return; }
        if (r.interdit) { res.interdit = true; return; }
        res.cns += r.cns; res.cns24 += r.cns24; res.otu += r.otu; res.duree += r.duree;
      });
      return res;
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
  function egal(n, dec) { return Math.abs(n - Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)) < 1e-9; }
  function eg(n, dec) { return egal(n, dec) ? "=" : "≈"; }
  function val(n, dec, unite) { return nombre(n, dec) + NB + unite; }
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

  var racine = document.querySelector('[data-outil="cns-otu"]');
  if (!racine) return;
  var liste = racine.querySelector("[data-segments]");
  var modele = racine.querySelector("[data-modele]");
  var MAX = 8;

  function renumeroter() {
    var lignes = liste.querySelectorAll("[data-segment]");
    Array.prototype.forEach.call(lignes, function (l, i) {
      l.querySelector("[data-numero]").textContent = "Segment " + (i + 1);
      l.querySelector("[data-retirer]").hidden = lignes.length === 1;
      Array.prototype.forEach.call(l.querySelectorAll("input"), function (c) { c.setAttribute("aria-label", c.getAttribute("data-libelle") + ", segment " + (i + 1)); });
    });
    racine.querySelector("[data-ajouter]").disabled = lignes.length >= MAX;
  }
  function ajouter(valeurs) {
    var l = modele.content.firstElementChild.cloneNode(true);
    var champs = l.querySelectorAll("[data-champ]");
    if (valeurs) Array.prototype.forEach.call(champs, function (c, i) { if (valeurs[i] !== undefined) c.value = String(valeurs[i]).replace(".", ","); });
    l.querySelector("[data-retirer]").addEventListener("click", function () { l.remove(); renumeroter(); rendre(); });
    liste.appendChild(l);
    renumeroter();
    return l;
  }

  function rendre() {
    var segments = [];
    Array.prototype.forEach.call(liste.querySelectorAll("[data-segment]"), function (l) {
      var s = {};
      Array.prototype.forEach.call(l.querySelectorAll("[data-champ]"), function (c) { s[c.getAttribute("data-champ")] = lire(c); });
      segments.push(s);
    });
    var r = Calcul.plongee(segments);
    var erreur = racine.querySelector("[data-erreur]");
    var alerte = racine.querySelector("[data-alerte]");
    var sortie = function (k) { return racine.querySelector('[data-r="' + k + '"]'); };
    var pasapas = racine.querySelector("[data-pasapas]");
    pasapas.textContent = "";
    alerte.hidden = true;
    if (r.erreurs.length) {
      erreur.textContent = r.erreurs.join(" ");
      erreur.hidden = false;
      ["cns", "cns24", "otu"].forEach(function (k) { sortie(k).textContent = "–"; });
      return;
    }
    erreur.hidden = true;
    var alertes = [];
    if (r.interdit) alertes.push("Un segment dépasse une PpO2 de 1,6 bar : c’est interdit par le Code du sport, et la table NOAA ne va pas au-delà. Ce segment n’est pas compté.");
    if (r.cns >= 100 - EPS) alertes.push("La limite NOAA d’exposition unique est atteinte ou dépassée.");
    if (r.cns24 >= 100 - EPS) alertes.push("La limite NOAA sur 24 heures est atteinte ou dépassée.");
    if (r.otu > 850 + EPS) alertes.push("Les OTU dépassent 850, la dose admise pour un jour isolé dans la méthode Repex.");
    if (alertes.length) { alerte.textContent = alertes.join(" "); alerte.hidden = false; }
    sortie("cns").textContent = val(r.cns, 1, "%");
    sortie("cns24").textContent = val(r.cns24, 1, "%");
    sortie("otu").textContent = nombre(r.otu, 0) + " OTU";

    r.segments.forEach(function (s, i) {
      var li = el("li");
      li.appendChild(el("strong", "", "Segment " + (i + 1)));
      if (s.interdit) {
        li.appendChild(document.createTextNode(NB + ": PpO2 " + eg(s.ppo2, 2) + " " + val(s.ppo2, 2, "bar") + ", au-delà de 1,6" + NB + "bar : non compté."));
        pasapas.appendChild(li); return;
      }
      var seg = segments[i];
      var txt = NB + ": PpO2 = " + nombre(Calcul.pabs(seg.profondeur), 2) + " × " + nombre(seg.o2 / 100, 2) + " " + eg(s.ppo2, 2) + " " + val(s.ppo2, 2, "bar") + ". ";
      if (s.limite) {
        var surLigne = NOAA.some(function (l) { return Math.abs(l[0] - s.ppo2) < 1e-6; });
        txt += "Limite NOAA" + (surLigne ? " " : ", interpolée entre deux lignes de la table, ") + eg(s.limite, 0) + " " + val(s.limite, 0, "min") + " (24" + NB + "h" + NB + ": " + val(s.limite24, 0, "min") + "), donc CNS = " + nombre(seg.duree, 1) + " ÷ " + nombre(s.limite, 0) + " " + eg(s.cns, 1) + " " + val(s.cns, 1, "%") + ". ";
      } else {
        txt += "Sous 0,6" + NB + "bar, la table NOAA ne fixe pas de limite : CNS = 0" + NB + "%. ";
      }
      if (s.ppo2 > 0.5) txt += "OTU = " + nombre(seg.duree, 1) + " × ((" + nombre(s.ppo2, 2) + " − 0,5) ÷ 0,5)^0,83 " + eg(s.otu, 1) + " " + nombre(s.otu, 1) + ".";
      else txt += "Sous 0,5" + NB + "bar, pas d’OTU.";
      li.appendChild(document.createTextNode(txt));
      pasapas.appendChild(li);
    });
    var tot = el("li");
    tot.appendChild(el("strong", "", "Total"));
    tot.appendChild(document.createTextNode(NB + ": on additionne les segments, soit " + val(r.cns, 1, "%") + " de la limite d’exposition unique, " + val(r.cns24, 1, "%") + " de la limite sur 24" + NB + "h, et " + nombre(r.otu, 0) + " OTU."));
    pasapas.appendChild(tot);
  }

  racine.querySelector("[data-ajouter]").addEventListener("click", function () {
    var l = ajouter(["6", "5", "32"]);
    l.querySelector("input").focus();
    rendre();
  });
  racine.querySelector("[data-form]").addEventListener("input", rendre);
  racine.querySelector("[data-form]").addEventListener("submit", function (e) { e.preventDefault(); rendre(); });
  Array.prototype.forEach.call(racine.querySelectorAll("[data-exemple]"), function (b) {
    b.addEventListener("click", function () {
      liste.textContent = "";
      b.getAttribute("data-exemple").split("|").forEach(function (seg) { ajouter(seg.split(";")); });
      rendre();
    });
  });
  var depart = racine.querySelector("[data-exemple]");
  depart.getAttribute("data-exemple").split("|").forEach(function (seg) { ajouter(seg.split(";")); });
  rendre();
}());
