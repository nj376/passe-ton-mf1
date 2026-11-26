/* Outil « Gestion de l’air » (/outils/gestion-air/).
   Une plongée = des segments dans l’ordre (profondeur moyenne, durée, phase « fond » ou « remontée »).
   Conventions de l’écrit 2 : pression absolue = 1 + profondeur ÷ 10, consommation à la profondeur = consommation en surface × pression absolue.
   Trois façons de fixer la réserve :
   - « fixe » : une pression à garder au début de la remontée (la remontée et les paliers se prennent sur la réserve) ;
   - « tiers » : un tiers de la pression de départ à garder à la sortie (règle des tiers, d’origine anglo-saxonne) ;
   - « deux » : au début de la remontée, l’air pour faire toute la remontée prévue à deux sur un seul bloc.
   Les calculs sont des fonctions pures (Calcul.plongee), testables hors du navigateur. */
(function () {
  "use strict";
  var EPS = 1e-9;

  var Calcul = {
    pabs: function (profondeur) { return 1 + profondeur / 10; },

    /* Instant (en minutes depuis le début) où la pression passe sous « seuil », ou null. */
    instant: function (points, seuil) {
      if (points[0].p <= seuil + EPS) return 0;
      for (var i = 1; i < points.length; i++) {
        var a = points[i - 1], b = points[i];
        if (b.p <= seuil + EPS) return a.t + (a.p - seuil) / (a.p - b.p) * (b.t - a.t);
      }
      return null;
    },

    plongee: function (d) {
      var e = [];
      if (!(d.volume > 0)) e.push("Le volume du bloc doit être supérieur à 0.");
      if (!(d.depart > 0)) e.push("La pression au départ doit être supérieure à 0.");
      if (!(d.surface > 0)) e.push("La consommation en surface doit être supérieure à 0.");
      if (d.methode === "fixe" && !(d.reserve >= 0 && d.reserve < d.depart)) e.push("La réserve doit être positive et inférieure à la pression au départ.");
      if (d.methode === "deux" && !(d.surfaceRemontee > 0)) e.push("La consommation pendant la remontée doit être supérieure à 0.");
      var segs = d.segments || [];
      if (!segs.length) e.push("Ajoute au moins un segment.");
      segs.forEach(function (s, i) {
        if (!(s.profondeur >= 0) || !(s.duree > 0)) e.push("Segment " + (i + 1) + " : la profondeur doit être positive ou nulle et la durée supérieure à 0.");
      });
      var dernierFond = -1;
      segs.forEach(function (s, i) { if (s.phase === "fond") dernierFond = i; });
      if (segs.length && dernierFond < 0) e.push("Indique au moins un segment de fond.");
      segs.forEach(function (s, i) { if (s.phase === "fond" && i > 0 && segs[i - 1].phase === "remontee") e.push("Segment " + (i + 1) + " : un segment de fond ne peut pas suivre un segment de remontée."); });
      if (e.length) return { erreurs: e };

      var r = { dispo: d.volume * d.depart, segments: [], points: [{ t: 0, p: d.depart }], total: 0, airRemontee: 0 };
      var t = 0, p = d.depart;
      segs.forEach(function (s, i) {
        var pabs = Calcul.pabs(s.profondeur);
        var debit = d.surface * pabs;
        var litres = debit * s.duree;
        var bars = litres / d.volume;
        r.segments.push({ pabs: pabs, debit: debit, litres: litres, bars: bars, phase: s.phase });
        r.total += litres;
        t += s.duree; p -= bars;
        r.points.push({ t: t, p: p });
        if (i === dernierFond) { r.tRemontee = t; r.pRemontee = p; }
        if (s.phase === "remontee") r.airRemontee += (d.methode === "deux" ? d.surfaceRemontee : d.surface) * pabs * s.duree;
      });
      r.duree = t;
      r.pSortie = p;
      r.miPression = d.depart / 2;
      r.tMiPression = Calcul.instant(r.points, r.miPression);
      r.panne = p < 0;
      r.tVide = r.panne ? Calcul.instant(r.points, 0) : null;

      if (d.methode === "fixe") {
        r.reserve = d.reserve;
        r.moment = "au début de la remontée";
        r.pControle = r.pRemontee;
      } else if (d.methode === "tiers") {
        r.reserve = d.depart / 3;
        r.moment = "à la sortie";
        r.pControle = r.pSortie;
      } else {
        r.reserve = 2 * r.airRemontee / d.volume;
        r.moment = "au début de la remontée";
        r.pControle = r.pRemontee;
      }
      r.tReserve = Calcul.instant(r.points, r.reserve);
      r.marge = r.pControle - r.reserve;
      r.ok = r.marge >= -EPS && !r.panne;
      return r;
    }
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = Calcul; }
  if (typeof document === "undefined") return;

  /* ---------- Affichage ---------- */
  var NB = " ";
  function nombre(n, dec) {
    var arrondi = Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec);
    if (arrondi === 0) arrondi = 0;
    return arrondi.toLocaleString("fr-FR", { maximumFractionDigits: dec });
  }
  function egal(n, dec) { return Math.abs(n - Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)) < 1e-9; }
  function eg(n, dec) { return egal(n, dec) ? "=" : "≈"; }
  function val(n, dec, unite) { return nombre(n, dec) + NB + unite; }
  function minute(tm) { return tm === null ? "non atteinte" : "vers " + val(Math.floor(tm + EPS), 0, "min"); }
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

  var racine = document.querySelector('[data-outil="gestion-air"]');
  if (!racine) return;
  var form = racine.querySelector("[data-form]");
  var liste = racine.querySelector("[data-segments]");
  var modele = racine.querySelector("[data-modele]");
  var MAX = 8;

  function champ(nom) { return lire(form.querySelector('[data-champ="' + nom + '"]')); }
  function methode() { return form.querySelector('input[name="methode"]:checked').value; }

  function renumeroter() {
    var lignes = liste.querySelectorAll("[data-segment]");
    Array.prototype.forEach.call(lignes, function (l, i) {
      l.querySelector("[data-numero]").textContent = "Segment " + (i + 1);
      l.querySelector("[data-retirer]").hidden = lignes.length === 1;
      Array.prototype.forEach.call(l.querySelectorAll("input, select"), function (c) { c.setAttribute("aria-label", c.getAttribute("data-libelle") + ", segment " + (i + 1)); });
    });
    racine.querySelector("[data-ajouter]").disabled = lignes.length >= MAX;
  }
  function ajouter(v) {
    var l = modele.content.firstElementChild.cloneNode(true);
    if (v) {
      l.querySelector('[data-seg="phase"]').value = v[0];
      l.querySelector('[data-seg="profondeur"]').value = String(v[1]).replace(".", ",");
      l.querySelector('[data-seg="duree"]').value = String(v[2]).replace(".", ",");
    }
    l.querySelector("[data-retirer]").addEventListener("click", function () { l.remove(); renumeroter(); rendre(); });
    liste.appendChild(l);
    renumeroter();
    return l;
  }

  function afficherOptions() {
    var m = methode();
    Array.prototype.forEach.call(form.querySelectorAll("[data-option]"), function (o) { o.hidden = o.getAttribute("data-option") !== m; });
  }

  function rendre() {
    afficherOptions();
    var segments = [];
    Array.prototype.forEach.call(liste.querySelectorAll("[data-segment]"), function (l) {
      segments.push({ phase: l.querySelector('[data-seg="phase"]').value, profondeur: lire(l.querySelector('[data-seg="profondeur"]')), duree: lire(l.querySelector('[data-seg="duree"]')) });
    });
    var d = { volume: champ("volume"), depart: champ("depart"), surface: champ("surface"), reserve: champ("reserve"), surfaceRemontee: champ("surfaceRemontee"), methode: methode(), segments: segments };
    var r = Calcul.plongee(d);
    var erreur = racine.querySelector("[data-erreur]");
    var bilan = racine.querySelector("[data-bilan]");
    var sortie = function (k) { return racine.querySelector('[data-r="' + k + '"]'); };
    var pasapas = racine.querySelector("[data-pasapas]");
    pasapas.textContent = "";
    if (r.erreurs) {
      erreur.textContent = r.erreurs.join(" ");
      erreur.hidden = false;
      bilan.hidden = true;
      ["remontee", "sortie", "mi", "res"].forEach(function (k) { sortie(k).textContent = "–"; });
      return;
    }
    erreur.hidden = true;
    sortie("remontee").textContent = val(r.pRemontee, 0, "bar");
    sortie("sortie").textContent = r.panne ? "panne d’air" : val(r.pSortie, 0, "bar");
    sortie("mi").textContent = minute(r.tMiPression);
    sortie("res").textContent = val(r.reserve, 0, "bar") + ", " + minute(r.tReserve);

    bilan.hidden = false;
    bilan.className = "outil-bilan " + (r.ok ? "outil-bilan--ok" : "outil-bilan--alerte");
    if (r.panne) bilan.textContent = "Le bloc est vide avant la fin du profil, " + minute(r.tVide) + " : cette plongée est impossible avec cet air.";
    else if (r.ok) bilan.textContent = "La plongée tient" + NB + ": " + r.moment + ", il reste " + val(r.pControle, 0, "bar") + " pour une réserve de " + val(r.reserve, 0, "bar") + ", soit " + val(r.marge, 0, "bar") + " de marge.";
    else bilan.textContent = "La plongée ne tient pas" + NB + ": " + r.moment + ", il ne reste que " + val(r.pControle, 0, "bar") + " pour une réserve de " + val(r.reserve, 0, "bar") + ". Raccourcis le fond, plonge moins profond ou prends plus d’air.";

    function etape(libelle, texte) { var li = el("li"); li.appendChild(el("strong", "", libelle)); li.appendChild(document.createTextNode(NB + ": " + texte)); pasapas.appendChild(li); }
    etape("Air au départ", nombre(d.volume, 1) + " × " + nombre(d.depart, 1) + " " + eg(r.dispo, 0) + " " + val(r.dispo, 0, "L"));
    r.segments.forEach(function (s, i) {
      var seg = segments[i];
      etape("Segment " + (i + 1) + (s.phase === "fond" ? ", fond" : ", remontée"),
        nombre(d.surface, 1) + " × " + nombre(s.pabs, 2) + " " + eg(s.debit, 1) + " " + val(s.debit, 1, "L/min") + " pendant " + val(seg.duree, 1, "min") + " " + eg(s.litres, 0) + " " + val(s.litres, 0, "L") + ", soit " + nombre(s.litres, 0) + " ÷ " + nombre(d.volume, 1) + " " + eg(s.bars, 1) + " " + val(s.bars, 1, "bar"));
    });
    etape("Pression au début de la remontée", val(r.pRemontee, 1, "bar") + " après " + val(r.tRemontee, 1, "min"));
    etape("Pression à la sortie", r.panne ? "le calcul descend sous 0" + NB + "bar : panne d’air" : val(r.pSortie, 1, "bar") + " après " + val(r.duree, 1, "min"));
    etape("Mi-pression", "la moitié de " + val(d.depart, 0, "bar") + ", soit " + val(r.miPression, 0, "bar") + ", atteinte " + minute(r.tMiPression));
    if (d.methode === "fixe") etape("Réserve", val(r.reserve, 0, "bar") + ", à garder au début de la remontée");
    else if (d.methode === "tiers") etape("Réserve", "un tiers de " + val(d.depart, 0, "bar") + " " + eg(r.reserve, 0) + " " + val(r.reserve, 0, "bar") + ", à garder à la sortie");
    else etape("Réserve", "air de la remontée pour deux plongeurs à " + val(d.surfaceRemontee, 1, "L/min") + " chacun en surface " + eg(2 * r.airRemontee, 0) + " " + val(2 * r.airRemontee, 0, "L") + ", soit " + nombre(2 * r.airRemontee, 0) + " ÷ " + nombre(d.volume, 1) + " " + eg(r.reserve, 0) + " " + val(r.reserve, 0, "bar") + " à garder au début de la remontée");
  }

  racine.querySelector("[data-ajouter]").addEventListener("click", function () {
    var l = ajouter(["remontee", "3", "3"]);
    l.querySelector("select").focus();
    rendre();
  });
  form.addEventListener("input", rendre);
  form.addEventListener("change", rendre);
  form.addEventListener("submit", function (e) { e.preventDefault(); rendre(); });
  Array.prototype.forEach.call(racine.querySelectorAll("[data-exemple]"), function (b) {
    b.addEventListener("click", function () {
      liste.textContent = "";
      b.getAttribute("data-exemple").split("|").forEach(function (seg) { ajouter(seg.split(";")); });
      rendre();
    });
  });
  racine.querySelector("[data-exemple]").getAttribute("data-exemple").split("|").forEach(function (seg) { ajouter(seg.split(";")); });
  rendre();
}());
