/* Flashcard MFT : cartes mémoire en répétition espacée datée (5 boîtes de Leitner)
   et recherche chronométrée dans le MFT. L’avancement reste dans ce navigateur. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-reviser]");
  if (!racine || !window.Stockage) return;
  var $ = function (s) { return racine.querySelector(s); };
  var contact = racine.getAttribute("data-contact");
  var D = null;

  /* ---------- Onglets « Cartes mémoire » / « Retrouver dans le MFT » ---------- */
  var modes = Array.prototype.slice.call(racine.querySelectorAll("[data-mode]"));
  function choisirMode(b) {
    var m = b.getAttribute("data-mode");
    modes.forEach(function (x) {
      var actif = x === b;
      x.setAttribute("aria-selected", actif ? "true" : "false");
      x.tabIndex = actif ? 0 : -1;
    });
    racine.querySelectorAll("[data-panneau-mode]").forEach(function (p) { p.hidden = p.getAttribute("data-panneau-mode") !== m; });
    // En quittant « Retrouver dans le MFT », le chrono s'arrête : un temps mesuré pendant les cartes fausserait la moyenne.
    if (m !== "retrouver" && recherche.minuterie) { clearInterval(recherche.minuterie); recherche.minuterie = null; recherche.texte = ""; }
    if (m === "retrouver" && D && !recherche.texte) nouvelleRecherche();
  }
  modes.forEach(function (b, i) {
    b.addEventListener("click", function () { choisirMode(b); });
    b.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      var j = (i + (e.key === "ArrowRight" ? 1 : modes.length - 1)) % modes.length;
      choisirMode(modes[j]); modes[j].focus();
    });
  });

  /* ---------- Génération des cartes depuis la base ---------- */
  var QUESTIONS = [
    { champ: "objectif", q: "Quel est l’objectif de cette compétence ?" },
    { champ: "evaluation", q: "Quels sont les critères d’évaluation de cette compétence ?" },
    { champ: "nouveau", q: "Qu’est-ce qui change par rapport au niveau précédent ?" },
    { champ: "technique", q: "Quelles techniques recouvre cette compétence ?" },
    { champ: "theorie", q: "Quelles connaissances théoriques s’y rattachent ?" }
  ];
  var toutes = [];
  function genererCartes() {
    D.competences.forEach(function (c) {
      QUESTIONS.forEach(function (q) {
        var r = c[q.champ];
        if (!r) return;
        if (q.champ === "nouveau" && /^Point de départ/.test(r)) return;
        toutes.push({ id: c.id + ":" + q.champ, c: c, question: q.q, reponse: r });
      });
    });
  }
  function ongletDe(niv) { return D.onglets.filter(function (o) { return o.niveaux.indexOf(niv) >= 0; })[0]; }
  // « RANDO » s’affiche « Randosub », « N4 » « GP-N4 » ; « PA20+PE40 » « PA20 · PE40 ».
  function nomNiveau(niv) {
    var o = ongletDe(niv);
    return o && o.niveaux.length === 1 ? o.libelle : niv.replace("+", " · ");
  }

  /* ---------- Répétition espacée datée : 5 boîtes de Leitner ---------- */
  // Boîte → prochaine révision : 1 demain, 2 dans 3 jours, 3 dans 7, 4 dans 14, 5 dans 30.
  // Affichage : boîte 1 « À revoir », 2 « En cours », 3 à 5 « Acquises » (une carte sue du premier coup est acquise).
  // Une carte ratée puis retrouvée en fin de séance passe en boîte 2 et garde sa révision au lendemain.
  // Une séance, sans limite : les cartes dues (les plus en retard d’abord), puis toutes les cartes jamais vues.
  var INTERVALLES = [0, 1, 3, 7, 14, 30];
  function z2(n) { return (n < 10 ? "0" : "") + n; }
  // Jours de calendrier à l’heure du navigateur (insensible à l’heure de la journée et au changement d’heure).
  function jourDans(n) { var d = new Date(); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return d.getFullYear() + "-" + z2(d.getMonth() + 1) + "-" + z2(d.getDate()); }
  function aujourdhui() { return jourDans(0); }
  function ecartJours(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""), a = new Date();
    if (!m) return 0;
    return Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - new Date(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
  }
  function categorie(b) { return b <= 1 ? 0 : b === 2 ? 1 : 2; }
  // Ancien format (version 1 : boîtes 0/1/2 comptées en séries) → version 2, sans perte.
  // Les dates sont réparties sur 7 jours pour que tout ne tombe pas le même jour.
  function convertir(e) {
    if (!e || typeof e !== "object") e = {};
    if (e.version === 2 && e.cartes && typeof e.cartes === "object") return e;
    var cartes = {}, anciennes = e.boites || {};
    Object.keys(anciennes).forEach(function (id) {
      var v = anciennes[id], b = v === 2 ? 4 : v === 1 ? 2 : 1;
      cartes[id] = { b: b, d: b === 1 ? aujourdhui() : jourDans(Math.floor(Math.random() * 7)) };
    });
    return { version: 2, cartes: cartes, niveau: e.niveau || "tous", total: e.total || 0 };
  }
  var etat = convertir(window.Stockage.lire("cartes", null));
  etat.niveau = etat.niveau || "tous";
  var file = [];
  var position = 0;
  var courante = null;
  var retournee = false;
  var libre = false;      // « Réviser quand même » : ne change aucune date
  var rappelees = {};     // cartes ratées déjà remises en fin de séance

  function enregistrer() { window.Stockage.ecrire("cartes", etat); }
  function fiche(id) { return etat.cartes[id]; }
  function cartesDuNiveau() {
    if (etat.niveau === "tous") return toutes;
    var o = D.onglets.filter(function (x) { return x.id === etat.niveau; })[0];
    return toutes.filter(function (k) { return o && o.niveaux.indexOf(k.c.niveau) >= 0; });
  }
  function dues(liste) {
    var auj = aujourdhui();
    return melanger(liste.filter(function (k) { var f = fiche(k.id); return f && f.d <= auj; }))
      .sort(function (a, b) { var x = fiche(a.id).d, y = fiche(b.id).d; return x < y ? -1 : x > y ? 1 : 0; });
  }
  function inedites(liste) { return liste.filter(function (k) { return !fiche(k.id); }); }
  function melanger(t) {
    for (var i = t.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = t[i]; t[i] = t[j]; t[j] = x; }
    return t;
  }
  function nouvelleSerie() {
    var liste = cartesDuNiveau();
    libre = false;
    rappelees = {};
    file = dues(liste).concat(melanger(inedites(liste)));
    position = 0;
    enregistrer();
  }
  function serieLibre() {
    var auj = aujourdhui();
    file = melanger(cartesDuNiveau().filter(function (k) { var f = fiche(k.id); return f && f.d > auj; }));
    libre = true;
    rappelees = {};
    position = 0;
  }
  function compter() {
    var n = [0, 0, 0], liste = cartesDuNiveau();
    liste.forEach(function (k) { var f = fiche(k.id); if (f) n[categorie(f.b)]++; }); // cartes déjà vues seulement
    [0, 1, 2].forEach(function (i) { $('[data-boite="' + i + '"]').textContent = n[i]; });
    var nDues = dues(liste).length, nNouv = inedites(liste).length;
    $("[data-cartes-jour]").textContent = "Aujourd’hui : " + nDues + " carte" + (nDues > 1 ? "s" : "") + " à revoir, " + nNouv + " nouvelle" + (nNouv > 1 ? "s" : "") + ".";
  }
  function libelleNiveau() {
    if (etat.niveau === "tous") return "tous niveaux";
    var o = D.onglets.filter(function (x) { return x.id === etat.niveau; })[0];
    return o ? o.libelle : etat.niveau;
  }
  // « Carte 1 sur 10 · GP-N4 » : la première partie en gras.
  function ligneCompte(gras, suite) {
    var z = $("[data-carte-compte]"); z.textContent = "";
    var b = document.createElement("b"); b.textContent = gras; z.appendChild(b);
    z.appendChild(document.createTextNode(" · " + suite));
  }
  // Barre décorative : un segment par carte jusqu'à 20 ; au-delà, une barre continue.
  function barre(faites, total) {
    var z = $("[data-segments]"); z.textContent = "";
    z.classList.toggle("fc-segments--continue", total > 20);
    if (total > 20) {
      var s = document.createElement("span"); s.className = "fc-segment fc-segment--fait";
      s.style.width = Math.round(faites / total * 100) + "%"; z.appendChild(s); return;
    }
    for (var i = 0; i < total; i++) { var g = document.createElement("span"); g.className = "fc-segment" + (i < faites ? " fc-segment--fait" : ""); z.appendChild(g); }
  }
  function dateCourte(iso) { var p = iso.split("-"); return p[2] + "/" + p[1]; }
  function afficherAJour() {
    var liste = cartesDuNiveau(), auj = aujourdhui();
    var futures = liste.map(function (k) { return fiche(k.id); }).filter(function (f) { return f && f.d > auj; });
    var texte;
    if (futures.length) {
      var proche = futures.reduce(function (m, f) { return f.d < m ? f.d : m; }, futures[0].d);
      var n = futures.filter(function (f) { return f.d === proche; }).length, j = ecartJours(proche);
      texte = "Prochaine révision : " + (j === 1 ? "demain" : "dans " + j + " jours (le " + dateCourte(proche) + ")") + ", " + n + " carte" + (n > 1 ? "s" : "") + ".";
    } else {
      texte = "Aucune carte pour ce niveau.";
    }
    $("[data-ajour-texte]").textContent = texte;
    $("[data-ajour-libre]").hidden = !futures.length;
    $("[data-carte]").hidden = true;
    $("[data-ajour]").hidden = false;
    ligneCompte("Séance terminée", libelleNiveau());
    barre(1, 1);
  }

  function afficherCarte() {
    if (position >= file.length) {
      if (libre) libre = false;
      nouvelleSerie();
    }
    compter();
    courante = file[position];
    retournee = false;
    $("[data-carte-signaler]").hidden = !courante;
    if (!courante) { afficherAJour(); return; }
    $("[data-ajour]").hidden = true;
    $("[data-carte]").hidden = false;
    var c = courante.c;
    var numero = "Carte " + (position + 1) + " sur " + file.length;
    ligneCompte((libre ? "Révision libre · " : "") + numero, libelleNiveau());
    barre(position + 1, file.length);
    $("[data-carte]").setAttribute("aria-label", numero);
    $("[data-carte-niveau]").textContent = nomNiveau(c.niveau);
    $("[data-carte-competence]").textContent = c.competence;
    $("[data-carte-question]").textContent = courante.question;
    $("[data-carte-texte]").textContent = courante.reponse;
    $("[data-carte-annonce]").textContent = "";
    $("[data-carte-reponse]").hidden = true;
    $("[data-carte-attente]").hidden = false;
    $("[data-carte-recto]").hidden = false;
    $("[data-carte-verso]").hidden = true;
    var sujet = "Erreur sur la carte " + c.niveau + " - " + c.competence;
    $("[data-carte-signaler]").href = contact + "?sujet=" + encodeURIComponent(sujet);
  }
  function retourner() {
    if (!courante || retournee) return;
    retournee = true;
    $("[data-carte-reponse]").hidden = false;
    $("[data-carte-attente]").hidden = true;
    $("[data-carte-recto]").hidden = true;
    $("[data-carte-verso]").hidden = false;
    // Lecteurs d'écran : la réponse est annoncée, le focus va sur « Je savais ».
    $("[data-carte-annonce]").textContent = "Réponse : " + courante.reponse;
    racine.querySelector('[data-repondre="1"]').focus();
  }
  function repondre(savais) {
    if (!courante || !retournee) return;
    var id = courante.id, f = fiche(id);
    if (!libre && !rappelees[id]) {
      if (!f) {
        // Nouvelle carte : sue d’emblée, boîte 3 (7 jours) ; sinon boîte 1.
        f = etat.cartes[id] = { b: savais ? 3 : 1, d: "" };
      } else {
        f.b = savais ? Math.min(5, f.b + 1) : 1;
      }
      f.d = jourDans(INTERVALLES[f.b]);
      // Ratée : elle revient une fois en fin de séance (sans changer sa date), puis demain.
      if (!savais) { rappelees[id] = true; file.push(courante); }
    } else if (!libre && rappelees[id] && savais && f && f.b === 1) {
      // Ratée puis retrouvée en fin de séance : « En cours » (boîte 2), toujours à revoir demain.
      f.b = 2;
    }
    etat.total = toutes.length;
    position++;
    enregistrer();
    afficherCarte();
    var suite = $("[data-carte]").hidden ? $("[data-ajour] button:not([hidden])") : $("[data-retourner]");
    if (suite) suite.focus();
  }
  $("[data-ajour-libre]").addEventListener("click", function () {
    serieLibre();
    afficherCarte();
    $("[data-retourner]").focus();
  });

  $("[data-retourner]").addEventListener("click", retourner);
  // Sur téléphone, toucher la carte la retourne (hors liens et boutons).
  $("[data-carte]").addEventListener("click", function (e) {
    if (e.target.closest("a, button")) return;
    retourner();
  });
  racine.querySelectorAll("[data-repondre]").forEach(function (b) {
    b.addEventListener("click", function () { repondre(b.getAttribute("data-repondre") === "1"); });
  });
  $("[data-cartes-niveau]").addEventListener("change", function (e) {
    etat.niveau = e.target.value;
    nouvelleSerie();
    afficherCarte();
  });

  /* Raccourcis clavier : Espace retourne, 1 « À revoir », 2 « Je savais ». */
  document.addEventListener("keydown", function (e) {
    if ($("[data-panneau-mode=cartes]").hidden) return;
    if (document.querySelector("dialog[open]")) return;
    var cible = e.target;
    if (cible && (cible.tagName === "INPUT" || cible.tagName === "TEXTAREA" || cible.tagName === "SELECT")) return;
    if (e.key === " " || e.code === "Space") {
      if (cible && cible.tagName === "BUTTON" && cible.closest("[data-carte]") === null) return;
      if (!retournee) { e.preventDefault(); retourner(); }
    } else if (e.key === "1" && retournee) { e.preventDefault(); repondre(false); }
    else if (e.key === "2" && retournee) { e.preventDefault(); repondre(true); }
  });

  /* ---------- Retrouver dans le MFT (chronométré) ---------- */
  var recherche = { texte: null, source: null, debut: 0, minuterie: null };
  var phrases = [];
  function genererPhrases() {
    var rubriques = { objectif: "Objectif", technique: "Technique", theorie: "Théorie", evaluation: "Évaluation" };
    D.competences.forEach(function (c) {
      Object.keys(rubriques).forEach(function (r) {
        (c[r] || "").split(/(?<=\.)\s+/).forEach(function (p) {
          p = p.trim();
          if (p.length >= 30 && p.length <= 180) phrases.push({ texte: p, c: c, rubrique: rubriques[r], chiffre: /\d/.test(p) });
        });
      });
    });
  }
  function format(ms) {
    var s = Math.floor(ms / 1000), m = Math.floor(s / 60);
    return (m < 10 ? "0" : "") + m + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }
  function tic() {
    var ms = Date.now() - recherche.debut, t = $("[data-recherche-temps]");
    t.textContent = format(ms);
    // Au-delà d'une minute (l'objectif), le chrono passe au rouge.
    t.classList.toggle("fc-chrono--depasse", ms > 60000);
  }
  function nouvelleRecherche() {
    // Une fois sur deux, une information chiffrée (distance, profondeur…).
    var pool = Math.random() < 0.5 ? phrases.filter(function (p) { return p.chiffre; }) : phrases;
    var p = pool[Math.floor(Math.random() * pool.length)];
    recherche.texte = p.texte;
    recherche.source = p;
    recherche.debut = Date.now();
    clearInterval(recherche.minuterie);
    recherche.minuterie = setInterval(tic, 250);
    tic();
    $("[data-recherche-texte]").textContent = "« " + p.texte + " »";
    $("[data-recherche-reponse]").hidden = true;
    $("[data-trouvee]").hidden = false;
    $("[data-montrer]").hidden = false;
    $("[data-suivante]").hidden = true;
  }
  function terminer(trouvee) {
    clearInterval(recherche.minuterie);
    var secondes = Math.round((Date.now() - recherche.debut) / 1000);
    tic();
    var p = recherche.source;
    var o = ongletDe(p.c.niveau);
    $("[data-recherche-resultat]").textContent = trouvee
      ? "Trouvée en " + secondes + " s" + (secondes <= 60 ? ", en moins d’une minute." : ".")
      : "Voici où elle se trouve.";
    var chap = o ? o.chapitre : p.c.niveau;
    var niv = nomNiveau(p.c.niveau);
    $("[data-recherche-source]").textContent = "MFT " + chap + (niv !== chap ? " · " + niv : "") + " · " + p.c.competence + ", rubrique « " + p.rubrique + " ».";
    $("[data-recherche-reponse]").hidden = false;
    $("[data-trouvee]").hidden = true;
    $("[data-montrer]").hidden = true;
    $("[data-suivante]").hidden = false;
    $("[data-suivante]").focus();
    if (trouvee) {
      var r = window.Stockage.lire("recherche", { temps: [] });
      if (!r || !Array.isArray(r.temps)) r = { temps: [] };
      r.temps.push(secondes);
      if (r.temps.length > 50) r.temps = r.temps.slice(-50);
      window.Stockage.ecrire("recherche", r);
    }
  }
  $("[data-trouvee]").addEventListener("click", function () { terminer(true); });
  $("[data-montrer]").addEventListener("click", function () { terminer(false); });
  $("[data-suivante]").addEventListener("click", function () { nouvelleRecherche(); $("[data-trouvee]").focus(); });

  /* ---------- Démarrage ---------- */
  fetch(racine.getAttribute("data-donnees"))
    .then(function (r) { return r.json(); })
    .then(function (d) {
      D = d;
      genererCartes();
      etat.total = toutes.length;
      genererPhrases();
      var sel = $("[data-cartes-niveau]");
      if (sel.querySelector('option[value="' + etat.niveau + '"]')) sel.value = etat.niveau; else etat.niveau = "tous";
      nouvelleSerie();
      afficherCarte();
      if (location.hash === "#retrouver") choisirMode(modes[1]);
    })
    .catch(function () {
      $("[data-carte-question]").textContent = "Le contenu n’a pas pu être chargé. Vérifie ta connexion, puis recharge la page.";
    });
})();
