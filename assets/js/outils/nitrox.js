/* Outil « Nitrox et profondeurs maximales » (/outils/nitrox/).
   Conventions : pression absolue = 1 + profondeur ÷ 10 ; air à 21 % d’oxygène et 79 % d’azote.
   Règles du mode d’emploi des tables fédérales MN90 (FFESSM, 2005) : profondeur maximale à PpO2 1,6 bar,
   profondeur équivalente PE = (P + 10) × FN2 ÷ 0,79 − 10, lue dans la table à la profondeur immédiatement supérieure.
   Code du sport : PpO2 entre 0,16 et 1,6 bar (A322-92), nitrox limité à 60 m (A322-76).
   Les calculs sont des fonctions pures (Calcul.melange, Calcul.meilleur), testables hors du navigateur. */
(function () {
  "use strict";

  var PROFONDEURS_MN90 = [6, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 65];
  var PPO2_LEGALE = 1.6;
  var LIMITE_NITROX = 60;

  var Calcul = {
    PROFONDEURS_MN90: PROFONDEURS_MN90,
    pabs: function (profondeur) { return 1 + profondeur / 10; },
    /* Profondeur maximale d’utilisation, arrondie au mètre inférieur. */
    mod: function (fo2, ppo2max) { return Math.floor(10 * (ppo2max / fo2 - 1) + 1e-9); },
    /* Profondeur équivalente air (mode d’emploi MN90). */
    pe: function (profondeur, fo2) { return (profondeur + 10) * (1 - fo2) / 0.79 - 10; },
    /* Profondeur de la table MN90 immédiatement supérieure (ou égale). */
    profondeurTable: function (pe) {
      for (var i = 0; i < PROFONDEURS_MN90.length; i++) { if (PROFONDEURS_MN90[i] >= pe - 1e-9) return PROFONDEURS_MN90[i]; }
      return null;
    },

    controler: function (d, avecProfondeur, avecMelange) {
      var e = [];
      if (avecMelange && !(d.o2 >= 21 && d.o2 <= 100)) e.push("Le pourcentage d’oxygène d’un nitrox est compris entre 21 et 100 %.");
      if (!(d.ppo2max >= 0.16 && d.ppo2max <= PPO2_LEGALE)) e.push("La PpO2 maximale doit être comprise entre 0,16 et 1,6 bar (Code du sport).");
      if (avecProfondeur && !(d.profondeur >= 0)) e.push("La profondeur ne peut pas être négative.");
      return e;
    },

    /* Un mélange à une profondeur. */
    melange: function (d) {
      var erreurs = Calcul.controler(d, true, true);
      if (erreurs.length) return { erreurs: erreurs };
      var fo2 = d.o2 / 100, pabs = Calcul.pabs(d.profondeur);
      var r = { fo2: fo2, pabs: pabs, ppo2: pabs * fo2, ppn2: pabs * (1 - fo2), mod: Calcul.mod(fo2, d.ppo2max), alertes: [] };
      r.modLegale = Math.min(r.mod, LIMITE_NITROX);
      if (fo2 < 1) {
        r.pe = Calcul.pe(d.profondeur, fo2);
        r.table = Calcul.profondeurTable(Math.max(r.pe, 0));
      }
      if (r.ppo2 > PPO2_LEGALE + 1e-9) r.alertes.push("La PpO2 dépasse 1,6 bar, la limite du Code du sport : cette profondeur est interdite avec ce mélange.");
      else if (r.ppo2 > d.ppo2max + 1e-9) r.alertes.push("La PpO2 dépasse la limite que tu as choisie.");
      if (d.profondeur > LIMITE_NITROX) r.alertes.push("Au-delà de 60 m, la plongée au nitrox est interdite (Code du sport).");
      return r;
    },

    /* Le mélange le plus riche utilisable à une profondeur, arrondi au pourcent inférieur. */
    meilleur: function (d) {
      var erreurs = Calcul.controler(d, true, false);
      if (erreurs.length) return { erreurs: erreurs };
      var pabs = Calcul.pabs(d.profondeur);
      var brut = d.ppo2max / pabs;
      var o2 = Math.min(100, Math.floor(brut * 100 + 1e-9));
      var r = { pabs: pabs, brut: brut, o2: o2, alertes: [] };
      if (o2 < 21) r.alertes.push("Même l’air dépasse cette PpO2 à cette profondeur : aucun nitrox ne convient.");
      if (d.profondeur > LIMITE_NITROX) r.alertes.push("Au-delà de 60 m, la plongée au nitrox est interdite (Code du sport).");
      if (o2 >= 21) {
        var fo2 = o2 / 100;
        r.ppo2 = pabs * fo2;
        r.mod = Calcul.mod(fo2, d.ppo2max);
        if (fo2 < 1) { r.pe = Calcul.pe(d.profondeur, fo2); r.table = Calcul.profondeurTable(Math.max(r.pe, 0)); }
      }
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
  function egal(n, dec) { return Math.abs(n - Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)) < 1e-9; }
  function eg(n, dec) { return egal(n, dec) ? "=" : "≈"; }
  function val(n, dec, unite) { return nombre(n, dec) + NB + unite; }
  function lire(champ) {
    var t = champ.value.trim().replace(/\s/g, "").replace(",", ".");
    if (t === "") return NaN;
    return /^-?\d*\.?\d+$/.test(t) ? parseFloat(t) : NaN;
  }

  var racine = document.querySelector('[data-outil="nitrox"]');
  if (!racine) return;

  function etape(liste, libelle, calcul) {
    var li = document.createElement("li");
    var b = document.createElement("strong");
    b.textContent = libelle;
    li.appendChild(b);
    li.appendChild(document.createTextNode(NB + ": " + calcul));
    liste.appendChild(li);
  }
  function lectureTable(r) {
    if (r.table === undefined) return "sans objet (oxygène pur)";
    if (r.table === null) return "au-delà de la table";
    return val(r.table, 0, "m");
  }

  function rendre(panneau, nom) {
    var d = {};
    Array.prototype.forEach.call(panneau.querySelectorAll("[data-champ]"), function (c) { d[c.getAttribute("data-champ")] = lire(c); });
    var r = nom === "melange" ? Calcul.melange(d) : Calcul.meilleur(d);
    var erreur = panneau.querySelector("[data-erreur]");
    var alerte = panneau.querySelector("[data-alerte]");
    var liste = panneau.querySelector("[data-pasapas]");
    var sorties = {};
    Array.prototype.forEach.call(panneau.querySelectorAll("[data-r]"), function (s) { sorties[s.getAttribute("data-r")] = s; });
    liste.textContent = "";
    alerte.hidden = true;
    if (r.erreurs) {
      erreur.textContent = r.erreurs.join(" ");
      erreur.hidden = false;
      Object.keys(sorties).forEach(function (k) { sorties[k].textContent = "–"; });
      return;
    }
    erreur.hidden = true;
    if (r.alertes.length) { alerte.textContent = r.alertes.join(" "); alerte.hidden = false; }

    if (nom === "melange") {
      sorties.ppo2.textContent = val(r.ppo2, 2, "bar");
      sorties.ppn2.textContent = val(r.ppn2, 2, "bar");
      sorties.mod.textContent = r.mod > 60 ? val(r.mod, 0, "m") + ", limitée à 60" + NB + "m" : val(r.mod, 0, "m");
      sorties.pe.textContent = r.pe === undefined ? "–" : lectureTable(r) + " (PE" + NB + eg(Math.max(r.pe, 0), 1) + NB + val(Math.max(r.pe, 0), 1, "m") + ")";
      etape(liste, "Pression absolue", "1 + " + nombre(d.profondeur, 1) + " ÷ 10 " + eg(r.pabs, 2) + " " + val(r.pabs, 2, "bar"));
      etape(liste, "PpO2", "pression absolue × fraction d’oxygène = " + nombre(r.pabs, 2) + " × " + nombre(r.fo2, 2) + " " + eg(r.ppo2, 2) + " " + val(r.ppo2, 2, "bar"));
      etape(liste, "PpN2", nombre(r.pabs, 2) + " × " + nombre(1 - r.fo2, 2) + " " + eg(r.ppn2, 2) + " " + val(r.ppn2, 2, "bar"));
      var pmax = d.ppo2max / r.fo2;
      etape(liste, "Profondeur maximale", "pression maximale = " + nombre(d.ppo2max, 2) + " ÷ " + nombre(r.fo2, 2) + " " + eg(pmax, 2) + " " + val(pmax, 2, "bar") + ", soit (" + nombre(pmax, 2) + " − 1) × 10 " + eg(10 * (pmax - 1), 1) + " " + val(10 * (pmax - 1), 1, "m") + ", arrondie au mètre inférieur : " + val(r.mod, 0, "m") + (r.mod > 60 ? " ; le Code du sport limite le nitrox à 60" + NB + "m" : ""));
      if (r.pe !== undefined) {
        etape(liste, "Profondeur équivalente", "(" + nombre(d.profondeur, 1) + " + 10) × " + nombre(1 - r.fo2, 2) + " ÷ 0,79 − 10 " + eg(r.pe, 1) + " " + val(r.pe, 1, "m") + (r.pe < 0 ? ", c’est-à-dire moins que la surface" : ""));
        etape(liste, "Lecture de la table MN90", "profondeur immédiatement supérieure, " + lectureTable(r));
      }
    } else {
      if (r.o2 < 21) {
        Object.keys(sorties).forEach(function (k) { sorties[k].textContent = "–"; });
        etape(liste, "Mélange le plus riche", nombre(d.ppo2max, 2) + " ÷ " + nombre(r.pabs, 2) + " " + eg(r.brut, 3) + " " + nombre(r.brut, 3) + ", soit moins de 21" + NB + "%");
        return;
      }
      sorties.o2.textContent = "EAN" + r.o2 + " (" + r.o2 + NB + "%)";
      sorties.ppo2.textContent = val(r.ppo2, 2, "bar");
      sorties.mod.textContent = val(r.mod, 0, "m");
      sorties.pe.textContent = r.pe === undefined ? "–" : lectureTable(r) + " (PE" + NB + eg(Math.max(r.pe, 0), 1) + NB + val(Math.max(r.pe, 0), 1, "m") + ")";
      etape(liste, "Pression absolue", "1 + " + nombre(d.profondeur, 1) + " ÷ 10 " + eg(r.pabs, 2) + " " + val(r.pabs, 2, "bar"));
      etape(liste, "Fraction d’oxygène maximale", "PpO2 maximale ÷ pression absolue = " + nombre(d.ppo2max, 2) + " ÷ " + nombre(r.pabs, 2) + " " + eg(r.brut, 3) + " " + nombre(r.brut, 3) + ", arrondie au pourcent inférieur : " + r.o2 + NB + "%");
      etape(liste, "Vérification", nombre(r.pabs, 2) + " × " + nombre(r.o2 / 100, 2) + " " + eg(r.ppo2, 2) + " " + val(r.ppo2, 2, "bar") + ", sous la limite de " + val(d.ppo2max, 2, "bar"));
      if (r.pe !== undefined) etape(liste, "Profondeur équivalente", "(" + nombre(d.profondeur, 1) + " + 10) × " + nombre(1 - r.o2 / 100, 2) + " ÷ 0,79 − 10 " + eg(r.pe, 1) + " " + val(r.pe, 1, "m") + ", table à " + lectureTable(r));
    }
  }

  /* ---------- Onglets ---------- */
  var onglets = Array.prototype.slice.call(racine.querySelectorAll("[data-onglet]"));
  var panneaux = {};
  Array.prototype.forEach.call(racine.querySelectorAll("[data-panneau]"), function (p) { panneaux[p.getAttribute("data-panneau")] = p; });
  function choisir(nom, focus) {
    onglets.forEach(function (b) {
      var actif = b.getAttribute("data-onglet") === nom;
      b.setAttribute("aria-selected", actif ? "true" : "false");
      b.tabIndex = actif ? 0 : -1;
      if (actif && focus) b.focus();
    });
    Object.keys(panneaux).forEach(function (k) { panneaux[k].hidden = k !== nom; });
  }
  onglets.forEach(function (b, i) {
    b.addEventListener("click", function () { choisir(b.getAttribute("data-onglet"), false); });
    b.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight") j = (i + 1) % onglets.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + onglets.length) % onglets.length;
      if (j === null) return;
      e.preventDefault();
      choisir(onglets[j].getAttribute("data-onglet"), true);
    });
  });

  /* ---------- Saisie, PpO2 rapides et exemples ---------- */
  Object.keys(panneaux).forEach(function (nom) {
    var p = panneaux[nom];
    var form = p.querySelector("[data-form]");
    form.addEventListener("input", function () { rendre(p, nom); });
    form.addEventListener("submit", function (e) { e.preventDefault(); rendre(p, nom); });
    Array.prototype.forEach.call(p.querySelectorAll("[data-ppo2]"), function (b) {
      b.addEventListener("click", function () {
        p.querySelector('[data-champ="ppo2max"]').value = b.getAttribute("data-ppo2").replace(".", ",");
        rendre(p, nom);
      });
    });
    Array.prototype.forEach.call(p.querySelectorAll("[data-exemple]"), function (b) {
      b.addEventListener("click", function () {
        var valeurs = b.getAttribute("data-exemple").split(";");
        Array.prototype.forEach.call(p.querySelectorAll("[data-champ]"), function (c, i) { if (valeurs[i] !== undefined) c.value = valeurs[i].replace(".", ","); });
        rendre(p, nom);
      });
    });
    rendre(p, nom);
  });
}());
