/* Explore le MFT : onglets de niveau, moments de la plongée, fiches,
   recherche plein texte et comparaison N1 · N2 · N3. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-mft]");
  if (!racine) return;

  var onglets = Array.prototype.slice.call(racine.querySelectorAll("[data-niv]"));
  var panneaux = Array.prototype.slice.call(racine.querySelectorAll("[data-panneau]"));

  /* ---------- Onglets accessibles (flèches, Début, Fin) ---------- */
  function clavierOnglets(liste, activer) {
    liste.forEach(function (b, i) {
      b.addEventListener("keydown", function (e) {
        var j = null;
        if (e.key === "ArrowRight") j = (i + 1) % liste.length;
        else if (e.key === "ArrowLeft") j = (i - 1 + liste.length) % liste.length;
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = liste.length - 1;
        if (j === null) return;
        e.preventDefault();
        activer(liste[j]);
        liste[j].focus();
      });
    });
  }

  function choisirOnglet(bouton, sansHistorique) {
    var id = bouton.getAttribute("data-niv");
    onglets.forEach(function (b) {
      var actif = b === bouton;
      b.setAttribute("aria-selected", actif ? "true" : "false");
      b.tabIndex = actif ? 0 : -1;
    });
    panneaux.forEach(function (p) { p.hidden = p.getAttribute("data-panneau") !== id; });
    if (!sansHistorique) majAdresse();
    if (bouton.scrollIntoView && window.matchMedia("(max-width: 900px)").matches) {
      bouton.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }
  onglets.forEach(function (b) { b.addEventListener("click", function () { choisirOnglet(b); }); });
  clavierOnglets(onglets, choisirOnglet);

  /* ---------- Zone surlignée sur la courbe ---------- */
  function surligner(panneau, x, l, xm, lm) {
    var zb = panneau.querySelector("[data-zone-bureau]");
    var zm = panneau.querySelector("[data-zone-mobile]");
    if (zb && x !== null) { zb.setAttribute("x", x); zb.setAttribute("width", l); }
    if (zm && xm !== null) { zm.setAttribute("x", xm); zm.setAttribute("width", lm); }
  }

  /* ---------- Moments (bureau : onglets ; téléphone : liste dépliable) ---------- */
  panneaux.forEach(function (panneau) {
    // Un moment sans compétence n’est pas cliquable : il est exclu de la navigation.
    var moments = Array.prototype.slice.call(panneau.querySelectorAll("[data-moment]:not([disabled])"));
    var phases = Array.prototype.slice.call(panneau.querySelectorAll("[data-phase]"));

    function choisirMoment(bouton, sansHistorique) {
      var id = bouton.getAttribute("data-moment");
      moments.forEach(function (b) {
        var actif = b === bouton;
        b.setAttribute("aria-selected", actif ? "true" : "false");
        b.tabIndex = actif ? 0 : -1;
      });
      phases.forEach(function (ph) { ph.classList.toggle("phase--active", ph.getAttribute("data-phase") === id); });
      surligner(panneau, bouton.getAttribute("data-x"), bouton.getAttribute("data-l"), bouton.getAttribute("data-xm"), bouton.getAttribute("data-lm"));
      if (!sansHistorique) majAdresse();
    }
    moments.forEach(function (b) { b.addEventListener("click", function () { choisirMoment(b); }); });
    clavierOnglets(moments, choisirMoment);
    var initial = moments.filter(function (m) { return m.getAttribute("aria-selected") === "true"; })[0];
    if (initial) choisirMoment(initial, true);
    else {
      var ph = panneau.querySelector(".phase--depliee [data-phase-bouton]");
      if (ph) surligner(panneau, null, null, ph.getAttribute("data-xm"), ph.getAttribute("data-lm"));
    }
    panneau._choisirMoment = function (id) {
      var b = moments.filter(function (m) { return m.getAttribute("data-moment") === id; })[0];
      if (!b) return; // moment vide ou inconnu : on garde le moment par défaut
      choisirMoment(b, true);
      phases.forEach(function (ph) {
        var ouvrir = ph.getAttribute("data-phase") === id;
        ph.classList.toggle("phase--depliee", ouvrir);
        var pb = ph.querySelector("[data-phase-bouton]");
        if (pb) pb.setAttribute("aria-expanded", ouvrir ? "true" : "false");
      });
    };

    phases.forEach(function (ph) {
      var pb = ph.querySelector("[data-phase-bouton]");
      if (!pb) return;
      pb.addEventListener("click", function () {
        var ouvrir = !ph.classList.contains("phase--depliee");
        ph.classList.toggle("phase--depliee", ouvrir);
        pb.setAttribute("aria-expanded", ouvrir ? "true" : "false");
        if (ouvrir) surligner(panneau, null, null, pb.getAttribute("data-xm"), pb.getAttribute("data-lm"));
      });
    });
  });

  /* ---------- Fiches : détails et ouverture sur téléphone ---------- */
  if (window.matchMedia("(max-width: 900px)").matches) {
    racine.querySelectorAll(".fiche--details").forEach(function (f) {
      f.classList.remove("fiche--details");
      var b = f.querySelector("[data-details]");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  document.addEventListener("click", function (e) {
    var d = e.target.closest("[data-details]");
    if (d) {
      var fiche = d.closest(".fiche");
      var ouvrir = !fiche.classList.contains("fiche--details");
      fiche.classList.toggle("fiche--details", ouvrir);
      d.setAttribute("aria-expanded", ouvrir ? "true" : "false");
      return;
    }
    var o = e.target.closest("[data-ouvrir-fiche]");
    if (o) {
      var f = o.closest(".fiche");
      f.classList.add("fiche--ouverte");
      o.setAttribute("aria-expanded", "true");
      var titre = f.querySelector(".fiche__titre");
      if (titre) { titre.tabIndex = -1; titre.focus(); }
    }
  });

  /* ---------- Adresse de la page : #niveau/moment ---------- */
  function majAdresse() {
    var o = onglets.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0];
    if (!o) return;
    var p = panneaux.filter(function (x) { return !x.hidden; })[0];
    var m = p && p.querySelector('[data-moment][aria-selected="true"]');
    var h = "#" + o.getAttribute("data-niv") + (m ? "/" + m.getAttribute("data-moment") : "");
    try { history.replaceState(null, "", h); } catch (e) { /* rien */ }
  }
  function lireAdresse() {
    var h = (location.hash || "").replace(/^#/, "").split("/");
    if (!h[0]) return;
    var o = onglets.filter(function (b) { return b.getAttribute("data-niv") === h[0]; })[0];
    if (!o) return;
    choisirOnglet(o, true);
    var p = document.getElementById("panneau-" + h[0]);
    if (h[1] && p && p._choisirMoment) p._choisirMoment(h[1]);
  }
  lireAdresse();

  /* ---------- Comparer N1 · N2 · N3 (même famille de compétence) ---------- */
  var toutes = Array.prototype.slice.call(racine.querySelectorAll(".fiche"));
  var familles = {};
  toutes.forEach(function (f) {
    var g = f.getAttribute("data-groupe");
    if (!g) return;
    var cle = f.getAttribute("data-famille");
    familles[cle] = familles[cle] || { N1: {}, N2: {}, N3: {} };
    if (familles[cle][g]) familles[cle][g][f.getAttribute("data-fiche")] = f;
  });
  function groupesPresents(cle) {
    var fam = familles[cle];
    if (!fam) return 0;
    return ["N1", "N2", "N3"].filter(function (g) { return Object.keys(fam[g]).length > 0; }).length;
  }
  racine.querySelectorAll("[data-comparer]").forEach(function (b) {
    var f = b.closest(".fiche");
    if (groupesPresents(f.getAttribute("data-famille")) >= 2) b.hidden = false;
  });

  var fenetre = document.getElementById("fenetre-comparer");
  function texte(f, sel) { var el = f.querySelector(sel); return el ? el.textContent.trim() : ""; }
  function comparer(fiche) {
    if (!fenetre) return;
    var fam = familles[fiche.getAttribute("data-famille")];
    fenetre.querySelector("[data-comparer-nom]").textContent = fiche.getAttribute("data-nom");
    var cols = fenetre.querySelector("[data-comparer-colonnes]");
    cols.textContent = "";
    ["N1", "N2", "N3"].forEach(function (g) {
      var col = document.createElement("section");
      col.className = "comparer__colonne";
      var h = document.createElement("h3");
      h.className = "comparer__niveau";
      h.textContent = g;
      col.appendChild(h);
      var ids = Object.keys(fam[g]);
      if (!ids.length) {
        var vide = document.createElement("p");
        vide.className = "comparer__vide";
        vide.textContent = "Pas de compétence correspondante dans le MFT " + g + ".";
        col.appendChild(vide);
      }
      ids.forEach(function (id) {
        var f = fam[g][id];
        var bloc = document.createElement("div");
        bloc.className = "comparer__fiche";
        var p = document.createElement("span"); p.className = "puce puce--niveau"; p.textContent = texte(f, ".puce--niveau");
        var t = document.createElement("h4"); t.className = "comparer__titre"; t.textContent = texte(f, ".fiche__titre");
        var ob = document.createElement("p"); ob.className = "comparer__texte"; ob.textContent = texte(f, ".fiche__objectif");
        bloc.appendChild(p); bloc.appendChild(t); bloc.appendChild(ob);
        var ch = f.querySelector(".fiche__change");
        if (ch) {
          var c = document.createElement("div"); c.className = "fiche__change";
          var ct = document.createElement("span"); ct.className = "fiche__change-titre"; ct.textContent = texte(ch, ".fiche__change-titre");
          var cp = document.createElement("p"); cp.textContent = texte(ch, "p");
          c.appendChild(ct); c.appendChild(cp); bloc.appendChild(c);
        }
        col.appendChild(bloc);
      });
      cols.appendChild(col);
    });
    if (window.Interface) window.Interface.ouvrirFenetre("fenetre-comparer");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-comparer]");
    if (b) comparer(b.closest(".fiche"));
  });

  /* ---------- Recherche plein texte, chiffres compris ---------- */
  var champ = document.querySelector("[data-recherche-mft]");
  var zoneRes = document.querySelector("[data-resultats]");
  var titreRes = document.querySelector("[data-resultats-titre]");
  var listeRes = document.querySelector("[data-resultats-liste]");

  function normaliser(s) {
    return (s || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[  ]/g, " ")
      .replace(/[’`]/g, "'")
      .replace(/(\d)\s+(m|min|bar|s)\b/g, "$1$2")
      .replace(/\s+/g, " ").trim();
  }
  function echapper(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // Une seule entrée par compétence (une fiche peut apparaître dans deux moments).
  var index = [];
  var vues = {};
  toutes.forEach(function (f) {
    var id = f.getAttribute("data-fiche");
    if (vues[id]) return;
    vues[id] = true;
    index.push({ fiche: f, texte: normaliser(f.textContent + " " + (f.getAttribute("data-groupe") || "")) });
  });

  function rechercher() {
    var q = normaliser(champ.value);
    if (!q) {
      zoneRes.hidden = true;
      racine.hidden = false;
      listeRes.textContent = "";
      return;
    }
    var termes = q.split(" ").map(function (t) {
      // Un nombre ne doit pas être trouvé à l’intérieur d’un autre (« 20 m » ≠ « 120 m »).
      return new RegExp((/^\d/.test(t) ? "(^|[^0-9,.])" : "") + echapper(t));
    });
    var trouves = index.filter(function (e) { return termes.every(function (r) { return r.test(e.texte); }); });
    listeRes.textContent = "";
    trouves.forEach(function (e, i) {
      var copie = e.fiche.cloneNode(true);
      copie.classList.add("fiche--ouverte");
      copie.classList.toggle("fiche--details", i === 0);
      copie.querySelectorAll("[id]").forEach(function (el) { el.id = el.id + "-r"; });
      copie.querySelectorAll("[aria-controls]").forEach(function (el) { el.setAttribute("aria-controls", el.getAttribute("aria-controls") + "-r"); });
      var db = copie.querySelector("[data-details]");
      if (db) db.setAttribute("aria-expanded", i === 0 ? "true" : "false");
      var ob = copie.querySelector("[data-ouvrir-fiche]");
      if (ob) ob.setAttribute("aria-expanded", "true");
      listeRes.appendChild(copie);
    });
    var brut = champ.value.trim();
    titreRes.textContent = trouves.length === 0
      ? "Aucune fiche trouvée pour « " + brut + " »"
      : trouves.length + (trouves.length > 1 ? " fiches trouvées" : " fiche trouvée") + " pour « " + brut + " »";
    zoneRes.hidden = false;
    racine.hidden = true;
  }
  var minuterie = null;
  if (champ) {
    champ.addEventListener("input", function () {
      clearTimeout(minuterie);
      minuterie = setTimeout(rechercher, 150);
    });
    champ.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { champ.value = ""; rechercher(); }
    });
  }
})();
