/* Page « Suivi » : date d'examen, avancement de chaque module, contenu stocké, tout effacer.
   Tout est lu dans ce navigateur (localStorage) ; rien n'est envoyé ailleurs.
   Sauvegarde et restauration : assets/js/donnees.js (événement « ptmf1:donnees-importees » après un import). */
(function () {
  "use strict";
  var racine = document.querySelector("[data-suivi]");
  if (!racine) return;
  var $ = function (s) { return racine.querySelector(s); };

  var CLE_EXAMEN = "ptmf1:examen";
  var noms = {};
  try { noms = JSON.parse(document.getElementById("suivi-noms").textContent); } catch (e) { noms = {}; }

  function lire(cle) { try { return localStorage.getItem(cle); } catch (e) { return null; } }
  function lireJson(cle, defaut) { var b = lire(cle); if (b === null) return defaut; try { return JSON.parse(b); } catch (e) { return defaut; } }
  function el(tag, cls, texte) { var e = document.createElement(tag); if (cls) e.className = cls; if (texte !== undefined) e.textContent = texte; return e; }
  function pluriel(n, un, plusieurs) { return n + " " + (n > 1 ? plusieurs : un); }
  function z(n) { return (n < 10 ? "0" : "") + n; }
  function dateCourte(iso) { var d = new Date(iso); return isNaN(d) ? "" : z(d.getDate()) + "/" + z(d.getMonth() + 1) + "/" + d.getFullYear(); }

  /* ---------- Date de l'examen ---------- */
  var form = $("[data-date-form]"), carte = $("[data-date-carte]"), champ = $("[data-date-champ]");
  function dateLocale(aaaammjj) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(aaaammjj || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function afficherDate(modifier) {
    var valeur = lire(CLE_EXAMEN), d = dateLocale(valeur);
    if (!d || modifier) {
      form.hidden = false; carte.hidden = true;
      champ.value = d ? valeur : "";
      return;
    }
    form.hidden = true; carte.hidden = false;
    var auj = new Date(); auj = new Date(auj.getFullYear(), auj.getMonth(), auj.getDate());
    var jours = Math.round((d - auj) / 86400000); // jours calendaires, heure locale
    var nombre = $("[data-date-nombre]"), unite = $("[data-date-unite]"), texte = $("[data-date-texte]");
    var enLettres = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    nombre.classList.toggle("suivi-examen__nombre--mot", jours <= 0);
    if (jours > 0) {
      nombre.textContent = String(jours);
      unite.textContent = jours > 1 ? "jours restants" : "jour restant";
      texte.textContent = "Le " + enLettres;
    } else if (jours === 0) {
      nombre.textContent = "Jour J";
      unite.textContent = "";
      texte.textContent = "C’est aujourd’hui. Bonne chance !";
    } else {
      nombre.textContent = "Examen dépassé";
      unite.textContent = "";
      texte.textContent = "";
    }
    texte.hidden = !texte.textContent;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!dateLocale(champ.value)) return;
    try { localStorage.setItem(CLE_EXAMEN, champ.value); } catch (err) { /* stockage refusé */ }
    afficherDate();
    rendreStockage();
    $("[data-date-modifier]").focus();
  });
  $("[data-date-modifier]").addEventListener("click", function () { afficherDate(true); champ.focus(); });
  $("[data-date-retirer]").addEventListener("click", function () {
    try { localStorage.removeItem(CLE_EXAMEN); } catch (err) { /* rien */ }
    afficherDate();
    rendreStockage();
    champ.focus();
  });

  /* ---------- Mes modules ---------- */
  function barres(zone, lignes) {
    zone.textContent = "";
    // Ligne : [libellé, valeur] (part du total) ou [libellé, valeur, maximum] (affiché « valeur/maximum »).
    var total = lignes.reduce(function (s, l) { return s + l[1]; }, 0);
    zone.hidden = !total;
    lignes.forEach(function (l) {
      var ligne = el("div", "suivi-barre");
      ligne.appendChild(el("span", null, l[0]));
      var b = el("div", "suivi-barre__fond"); b.setAttribute("aria-hidden", "true");
      var base = l[2] || total;
      var r = el("span"); r.style.width = (base ? Math.round(l[1] / base * 100) : 0) + "%";
      b.appendChild(r); ligne.appendChild(b);
      ligne.appendChild(el("span", "suivi-barre__nombre", l[2] ? l[1] + "/" + l[2] : String(l[1])));
      zone.appendChild(ligne);
    });
  }
  function rendreModules() {
    // S'entraîner
    var themes = lireJson("ptmf1:themes", []); if (!Array.isArray(themes)) themes = [];
    if (themes.length) {
      var dernier = themes[themes.length - 1];
      $("[data-entr-chiffre]").textContent = pluriel(themes.length, "thème préparé", "thèmes préparés");
      $("[data-entr-texte]").textContent = "Dernier thème : " + (dernier.titre || "") + ", le " + dateCourte(dernier.date) + ".";
    } else {
      $("[data-entr-chiffre]").textContent = "Aucun thème préparé pour l’instant";
      $("[data-entr-texte]").textContent = "Tire un thème, puis clique sur « Enregistrer ce thème » : il apparaîtra ici.";
    }
    var compte = function (ep) { return themes.filter(function (t) { return t.epreuve === ep; }).length; };
    barres($("[data-entr-barres]"), [["Pratique", compte("prat")], ["Organisationnelle", compte("orga")], ["Théorique", compte("theo")]]);

    // Ma progression détaillée (un seul enregistrement : ptmf1-construire)
    var prog = lireJson("ptmf1-construire", null);
    if (prog && typeof prog === "object") {
      $("[data-prog-chiffre]").textContent = "1 progression enregistrée";
      var nom = ((prog.competence && noms[prog.competence]) || prog.titre || "Sans titre").replace(/(\p{L})'(\p{L})/gu, "$1’$2");
      $("[data-prog-texte]").textContent = nom + (prog.date ? ", modifiée le " + dateCourte(prog.date) : "") + ".";
    } else {
      $("[data-prog-chiffre]").textContent = "Aucune progression enregistrée";
      $("[data-prog-texte]").textContent = "Construis ta progression : elle s’enregistre dans ce navigateur.";
    }

    // Flashcard MFT. Version 2 : cartes {b: 1-5, d: date} (1 à revoir, 2 en cours, 3 à 5 acquises).
    // Version 1 (avant conversion par la page Flashcard) : boites {0 à revoir, 1 en cours, 2 acquises}.
    var cartes = lireJson("ptmf1:cartes", {}) || {};
    var n = [0, 0, 0], nDues = 0, ids;
    if (cartes.version === 2 && cartes.cartes) {
      var auj = new Date(), jour = auj.getFullYear() + "-" + z(auj.getMonth() + 1) + "-" + z(auj.getDate());
      ids = Object.keys(cartes.cartes);
      ids.forEach(function (id) { var f = cartes.cartes[id] || {}; n[f.b <= 1 ? 0 : f.b === 2 ? 1 : 2]++; if (f.d && f.d <= jour) nDues++; });
    } else {
      var boites = cartes.boites || {}; ids = Object.keys(boites);
      ids.forEach(function (id) { var b = boites[id]; if (b === 0 || b === 1 || b === 2) n[b]++; });
      nDues = n[0];
    }
    var temps = (lireJson("ptmf1:recherche", {}) || {}).temps; temps = Array.isArray(temps) ? temps : [];
    if (ids.length) {
      // Part des cartes acquises sur l'ensemble des cartes de la série (total enregistré par Flashcard MFT).
      var pc = Math.round(n[2] / Math.max(cartes.total || 0, ids.length) * 100);
      $("[data-flash-chiffre]").textContent = pc + " % des cartes acquises";
    } else {
      $("[data-flash-chiffre]").textContent = "Aucune carte révisée pour l’instant";
    }
    var texte = $("[data-flash-texte]"), tempsMoyen = $("[data-flash-temps]");
    texte.textContent = ids.length
      ? (nDues ? nDues + " carte" + (nDues > 1 ? "s" : "") + " à revoir aujourd’hui." : "Aucune carte à revoir aujourd’hui.")
      : "Lance une série : tes cartes acquises apparaîtront ici.";
    tempsMoyen.textContent = temps.length ? "Temps moyen pour retrouver une information : " + Math.round(temps.reduce(function (a, b) { return a + b; }, 0) / temps.length) + " s." : "";
    tempsMoyen.hidden = !tempsMoyen.textContent;
    barres($("[data-flash-barres]"), [["Acquises", n[2]], ["En cours", n[1]], ["À revoir", n[0]]]);
  }

  /* ---------- Ce qui est stocké dans ce navigateur ---------- */
  function poids(cle) { var v = lire(cle); return v === null ? 0 : new Blob([cle + v]).size; }
  function ko(octets) { return (octets ? Math.ceil(octets / 102.4) / 10 : 0).toFixed(1).replace(".", ",") + " ko"; } // arrondi au dixième supérieur
  function rendreStockage() {
    var lignes = [];
    var themes = lireJson("ptmf1:themes", null);
    if (Array.isArray(themes)) lignes.push(["Thèmes enregistrés", pluriel(themes.length, "élément", "éléments"), "ptmf1:themes"]);
    if (lire("ptmf1-construire") !== null) lignes.push(["Fiche de progression", "1 élément", "ptmf1-construire"]);
    var cartes = lireJson("ptmf1:cartes", null);
    var vues = cartes && (cartes.cartes || cartes.boites);
    if (vues) lignes.push(["Flashcard MFT", pluriel(Object.keys(vues).length, "carte", "cartes"), "ptmf1:cartes"]);
    var rech = lireJson("ptmf1:recherche", null);
    if (rech && Array.isArray(rech.temps)) lignes.push(["Recherches chronométrées", pluriel(rech.temps.length, "mesure", "mesures"), "ptmf1:recherche"]);
    var capaS = lireJson("ptmf1:capa", null);
    if (capaS && capaS.reponses) lignes.push(["Module capacitaire", pluriel(Object.keys(capaS.reponses).length, "rubrique", "rubriques"), "ptmf1:capa"]);
    var cds = lireJson("ptmf1:cds", null);
    if (cds && cds.reponses) lignes.push(["Questions du Code du sport", pluriel(Object.keys(cds.reponses).length, "réponse", "réponses"), "ptmf1:cds"]);
    var canvas = lireJson("ptmf1:canvas", null);
    if (canvas && Array.isArray(canvas.seances)) lignes.push(["Séances Storyboard", pluriel(canvas.seances.length, "séance", "séances"), "ptmf1:canvas"]);
    var d = dateLocale(lire(CLE_EXAMEN));
    if (d) lignes.push(["Date d’examen", z(d.getDate()) + "/" + z(d.getMonth() + 1) + "/" + d.getFullYear(), CLE_EXAMEN]);
    var corps = $("[data-stockage-lignes]"); corps.textContent = "";
    var total = 0;
    lignes.forEach(function (l) {
      var o = poids(l[2]); total += o;
      var tr = el("tr");
      tr.appendChild(el("td", "suivi-stockage__nom", l[0]));
      tr.appendChild(el("td", "suivi-stockage__compte", l[1]));
      tr.appendChild(el("td", "suivi-stockage__poids", ko(o)));
      corps.appendChild(tr);
    });
    if (!lignes.length) {
      var tr = el("tr"), td = el("td", "suivi-stockage__vide", "Aucune donnée enregistrée pour l’instant.");
      td.colSpan = 3; tr.appendChild(td); corps.appendChild(tr);
    }
    $("[data-stockage-total]").textContent = ko(total);
  }
  var voir = $("[data-voir-donnees]"), cadre = document.getElementById("suivi-stockage");
  voir.addEventListener("click", function () {
    var ouvrir = cadre.hidden;
    if (ouvrir) rendreStockage();
    cadre.hidden = !ouvrir;
    voir.setAttribute("aria-expanded", ouvrir ? "true" : "false");
  });

  /* ---------- Tout effacer : toutes les données du site ---------- */
  var confirmer = document.querySelector("[data-remise-a-zero]");
  if (confirmer) confirmer.addEventListener("click", function () {
    try {
      var cles = [];
      for (var i = 0; i < localStorage.length; i++) {
        var c = localStorage.key(i);
        // Données du site (mêmes clés que la sauvegarde) ; l'avis « version mobile » déjà vu est conservé.
        if (c && (c.indexOf("ptmf1:") === 0 || c === "ptmf1-construire")) cles.push(c);
      }
      cles.forEach(function (c) { localStorage.removeItem(c); });
    } catch (e) { /* stockage refusé */ }
    if (window.Interface) window.Interface.fermerFenetre(confirmer.closest("dialog"));
    tout();
    var titre = racine.querySelector(".suivi-titre");
    if (titre) { titre.setAttribute("tabindex", "-1"); titre.focus(); }
  });

  function tout() { afficherDate(); rendreModules(); rendreStockage(); }
  document.addEventListener("ptmf1:donnees-importees", tout);
  tout();
})();
