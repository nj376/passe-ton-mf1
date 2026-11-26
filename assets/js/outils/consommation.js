/* Outil « Consommation et autonomie » (/outils/consommation/).
   Conventions de l’écrit 2 du site : pression absolue = 1 + profondeur ÷ 10 (bar), loi de Mariotte.
   Les calculs sont des fonctions pures (Calcul.mesurer, Calcul.prevoir), testables hors du navigateur. */
(function (racineGlobale) {
  "use strict";

  /* ---------- Calculs ---------- */
  var Calcul = {
    pabs: function (profondeur) { return 1 + profondeur / 10; },

    /* Après la plongée : consommation ramenée à la surface. */
    mesurer: function (d) {
      var erreurs = [];
      if (!(d.volume > 0)) erreurs.push("Le volume du bloc doit être supérieur à 0.");
      if (!(d.depart > 0)) erreurs.push("La pression au départ doit être supérieure à 0.");
      if (!(d.fin >= 0)) erreurs.push("La pression à la fin ne peut pas être négative.");
      if (d.depart > 0 && d.fin >= 0 && !(d.fin < d.depart)) erreurs.push("La pression à la fin doit être inférieure à la pression au départ.");
      if (!(d.profondeur >= 0)) erreurs.push("La profondeur moyenne ne peut pas être négative.");
      if (!(d.duree > 0)) erreurs.push("La durée doit être supérieure à 0.");
      if (!(d.reserve >= 0)) erreurs.push("La réserve doit être un nombre positif ou nul.");
      if (erreurs.length) return { erreurs: erreurs };
      var pabs = Calcul.pabs(d.profondeur);
      var air = d.volume * (d.depart - d.fin);
      var fond = air / d.duree;
      /* Air qui restait au-dessus de la réserve à la fin, et le temps qu’il aurait donné à la profondeur moyenne. */
      var marge = d.volume * (d.fin - d.reserve);
      return { pabs: pabs, air: air, fond: fond, surface: fond / pabs, barmin: (d.depart - d.fin) / d.duree,
               marge: marge, restant: marge > 0 ? marge / fond : 0, sousReserve: d.fin < d.reserve };
    },

    /* Avant la plongée : autonomie à la profondeur prévue, avant d’entamer la réserve. */
    prevoir: function (d) {
      var erreurs = [];
      if (!(d.surface > 0)) erreurs.push("La consommation en surface doit être supérieure à 0.");
      if (!(d.volume > 0)) erreurs.push("Le volume du bloc doit être supérieur à 0.");
      if (!(d.depart > 0)) erreurs.push("La pression au départ doit être supérieure à 0.");
      if (!(d.reserve >= 0)) erreurs.push("La réserve doit être un nombre positif ou nul.");
      if (d.depart > 0 && d.reserve >= 0 && !(d.reserve < d.depart)) erreurs.push("La réserve doit être inférieure à la pression au départ.");
      if (!(d.profondeur >= 0)) erreurs.push("La profondeur prévue ne peut pas être négative.");
      if (erreurs.length) return { erreurs: erreurs };
      var pabs = Calcul.pabs(d.profondeur);
      var dispo = d.volume * (d.depart - d.reserve);
      var fond = d.surface * pabs;
      var palier = d.surface * Calcul.pabs(3);
      return { pabs: pabs, dispo: dispo, fond: fond, autonomie: dispo / fond, barmin: fond / d.volume, palier: palier, barminPalier: palier / d.volume };
    }
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = Calcul; }
  if (typeof document === "undefined") return;

  /* ---------- Affichage ---------- */
  var NB = " ";
  /* Nombre à la française : virgule, espace fine entre les milliers, au plus « dec » décimales. */
  function nombre(n, dec) {
    var arrondi = Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec);
    return arrondi.toLocaleString("fr-FR", { maximumFractionDigits: dec });
  }
  function egal(n, dec) { return Math.abs(n - Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)) < 1e-9; }
  function val(n, dec, unite) { return nombre(n, dec) + NB + unite; }
  /* « = » si la valeur affichée est exacte, « ≈ » si elle est arrondie. */
  function eg(n, dec) { return egal(n, dec) ? "=" : "≈"; }
  function lire(champ) {
    var t = champ.value.trim().replace(/\s/g, "").replace(",", ".");
    if (t === "") return NaN;
    return /^-?\d*\.?\d+$/.test(t) ? parseFloat(t) : NaN;
  }

  var racine = document.querySelector('[data-outil="consommation"]');
  if (!racine) return;

  function etape(liste, libelle, calcul) {
    var li = document.createElement("li");
    var b = document.createElement("strong");
    b.textContent = libelle;
    li.appendChild(b);
    li.appendChild(document.createTextNode(NB + ": " + calcul));
    liste.appendChild(li);
  }

  function rendre(panneau, nom) {
    var champs = {};
    Array.prototype.forEach.call(panneau.querySelectorAll("[data-champ]"), function (c) { champs[c.getAttribute("data-champ")] = lire(c); });
    var r = nom === "mesurer" ? Calcul.mesurer(champs) : Calcul.prevoir(champs);
    var erreur = panneau.querySelector("[data-erreur]");
    var liste = panneau.querySelector("[data-pasapas]");
    var sorties = {};
    Array.prototype.forEach.call(panneau.querySelectorAll("[data-r]"), function (s) { sorties[s.getAttribute("data-r")] = s; });
    liste.textContent = "";
    if (r.erreurs) {
      erreur.textContent = r.erreurs.join(" ");
      erreur.hidden = false;
      Object.keys(sorties).forEach(function (k) { sorties[k].textContent = "–"; });
      return;
    }
    erreur.hidden = true;
    var d = champs;
    if (nom === "mesurer") {
      sorties.surface.textContent = val(r.surface, 1, "L/min");
      sorties.air.textContent = val(r.air, 0, "L");
      sorties.fond.textContent = val(r.fond, 1, "L/min");
      sorties.barmin.textContent = val(r.barmin, 1, "bar/min");
      etape(liste, "Air consommé", "volume × (pression au départ − pression à la fin) = " + nombre(d.volume, 1) + " × (" + nombre(d.depart, 1) + " − " + nombre(d.fin, 1) + ") " + eg(r.air, 0) + " " + val(r.air, 0, "L"));
      etape(liste, "Pression absolue à la profondeur moyenne", "1 + " + nombre(d.profondeur, 1) + " ÷ 10 " + eg(r.pabs, 2) + " " + val(r.pabs, 2, "bar"));
      etape(liste, "Consommation à la profondeur", "air consommé ÷ durée = " + nombre(r.air, 0) + " ÷ " + nombre(d.duree, 1) + " " + eg(r.fond, 1) + " " + val(r.fond, 1, "L/min"));
      etape(liste, "Consommation en surface", "consommation à la profondeur ÷ pression absolue = " + nombre(r.fond, 1) + " ÷ " + nombre(r.pabs, 2) + " " + eg(r.surface, 1) + " " + val(r.surface, 1, "L/min"));
      etape(liste, "Au manomètre", "(" + nombre(d.depart, 1) + " − " + nombre(d.fin, 1) + ") ÷ " + nombre(d.duree, 1) + " " + eg(r.barmin, 1) + " " + val(r.barmin, 1, "bar/min") + " en moyenne sur la plongée");
      if (r.sousReserve) {
        sorties.restant.textContent = "réserve entamée";
        etape(liste, "Réserve", "la pression à la fin (" + val(d.fin, 1, "bar") + ") est inférieure à la réserve (" + val(d.reserve, 1, "bar") + ") : la réserve a été entamée");
      } else {
        var mr = Math.floor(r.restant + 1e-9);
        sorties.restant.textContent = val(mr, 0, "min");
        etape(liste, "Ce qu’il restait avant la réserve", nombre(d.volume, 1) + " × (" + nombre(d.fin, 1) + " − " + nombre(d.reserve, 1) + ") " + eg(r.marge, 0) + " " + val(r.marge, 0, "L") + ", soit " + nombre(r.marge, 0) + " ÷ " + nombre(r.fond, 1) + " " + eg(r.restant, 1) + " " + val(r.restant, 1, "min") + " à la profondeur moyenne");
      }
    } else {
      var minutes = Math.floor(r.autonomie + 1e-9);
      sorties.autonomie.textContent = val(minutes, 0, "min");
      sorties.dispo.textContent = val(r.dispo, 0, "L");
      sorties.fond.textContent = val(r.fond, 1, "L/min") + ", " + val(r.barmin, 1, "bar/min");
      sorties.palier.textContent = val(r.palier, 1, "L/min") + ", " + val(r.barminPalier, 1, "bar/min");
      etape(liste, "Air disponible", "volume × (pression au départ − réserve) = " + nombre(d.volume, 1) + " × (" + nombre(d.depart, 1) + " − " + nombre(d.reserve, 1) + ") " + eg(r.dispo, 0) + " " + val(r.dispo, 0, "L"));
      etape(liste, "Pression absolue à la profondeur prévue", "1 + " + nombre(d.profondeur, 1) + " ÷ 10 " + eg(r.pabs, 2) + " " + val(r.pabs, 2, "bar"));
      etape(liste, "Consommation à la profondeur", "consommation en surface × pression absolue = " + nombre(d.surface, 1) + " × " + nombre(r.pabs, 2) + " " + eg(r.fond, 1) + " " + val(r.fond, 1, "L/min"));
      etape(liste, "Autonomie", "air disponible ÷ consommation à la profondeur = " + nombre(r.dispo, 0) + " ÷ " + nombre(r.fond, 1) + " " + eg(r.autonomie, 1) + " " + val(r.autonomie, 1, "min") + ", soit " + val(minutes, 0, "minutes") + " entières");
      etape(liste, "Au manomètre", nombre(r.fond, 1) + " ÷ " + nombre(d.volume, 1) + " " + eg(r.barmin, 1) + " " + val(r.barmin, 1, "bar/min") + " à la profondeur");
      etape(liste, "Au palier de 3 m", nombre(d.surface, 1) + " × 1,3 " + eg(r.palier, 1) + " " + val(r.palier, 1, "L/min") + ", soit " + nombre(r.palier, 1) + " ÷ " + nombre(d.volume, 1) + " " + eg(r.barminPalier, 1) + " " + val(r.barminPalier, 1, "bar/min"));
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

  /* ---------- Saisie et exemples ---------- */
  Object.keys(panneaux).forEach(function (nom) {
    var p = panneaux[nom];
    var form = p.querySelector("[data-form]");
    form.addEventListener("input", function () { rendre(p, nom); });
    form.addEventListener("submit", function (e) { e.preventDefault(); rendre(p, nom); });
    Array.prototype.forEach.call(p.querySelectorAll("[data-exemple]"), function (b) {
      b.addEventListener("click", function () {
        var valeurs = b.getAttribute("data-exemple").split(";");
        var champs = p.querySelectorAll("[data-champ]");
        Array.prototype.forEach.call(champs, function (c, i) { if (valeurs[i] !== undefined) c.value = valeurs[i].replace(".", ","); });
        rendre(p, nom);
      });
    });
    rendre(p, nom);
  });
}(this));
