/* S’entraîner : tirage d’un thème d’entraînement, chrono de préparation,
   grille du livret pédagogique MF1 et comparaison avec le MFT.
   Les thèmes ne sont jamais présentés comme des sujets d’examen. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-tirage]");
  if (!racine) return;

  var $ = function (sel) { return racine.querySelector(sel); };
  var D = null;            // données (base + listes + grilles)
  var etat = {
    epreuve: "prat",       // choix de l’utilisateur : any, prat, theo, orga
    niveau: "tous",
    theme: null,           // thème tiré
    comparer: false,
    aideOuverte: null,     // id du champ dont l’aide est ouverte
    etape: 0               // étape affichée sur téléphone
  };
  var statut = $("[data-statut]");

  /* ---------- Outils ---------- */
  function hasard(liste) { return liste[Math.floor(Math.random() * liste.length)]; }
  function el(balise, classe, texte) {
    var e = document.createElement(balise);
    if (classe) e.className = classe;
    if (texte !== undefined && texte !== null) e.textContent = texte;
    return e;
  }
  function onglet(id) { return D.onglets.filter(function (o) { return o.id === id; })[0]; }
  function ongletDeNiveau(niv) { return D.onglets.filter(function (o) { return o.niveaux.indexOf(niv) >= 0; })[0]; }
  function niveau(id) { return D.niveaux.filter(function (n) { return n.id === id; })[0]; }
  function competence(id) { return D.competences.filter(function (c) { return c.id === id; })[0]; }
  function moment(id) { var m = D.moments.filter(function (x) { return x.id === id; })[0]; return m ? m.libelle : ""; }
  // « PA20+PE40 » regroupe deux niveaux de la base.
  function niveauxSimples(niv) { return niv.split("+"); }
  function majuscule(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ---------- Tirage ---------- */
  function competencesPratique() {
    var exclues = D.tirage.pasEnPratique || [];
    var liste = D.competences.filter(function (c) { return exclues.indexOf(c.id) < 0; });
    if (etat.niveau !== "tous") {
      var o = onglet(etat.niveau);
      liste = liste.filter(function (c) { return o && o.niveaux.indexOf(c.niveau) >= 0; });
    }
    return liste;
  }

  function themePratique(c) {
    // Pas de bassin si le niveau se forme en milieu naturel uniquement, si la compétence
    // le demande, ou si elle se travaille au-delà de 6 m.
    var cadre = niveauxSimples(c.niveau).map(function (id) { var n = niveau(id); return n ? n.cadre : ""; }).join(" ");
    var texte = (c.evaluation || "") + " " + (c.technique || "") + " " + (c.curseurs || "");
    var milieuNaturel = /milieu naturel uniquement/i.test(cadre) || /milieu naturel/i.test(texte) ||
      /(^|[^0-9,])([7-9]|[1-9]\d)\s?m\b/.test(texte);
    var lieux = D.tirage.lieux.filter(function (l) { return !milieuNaturel || l.milieuNaturel; });
    var puces = [hasard(lieux).libelle, hasard(D.tirage.publics)];
    if (/fin de formation/i.test(c.evaluation || "")) puces.push("Compétence validée en fin de formation");
    return { epreuve: "prat", competence: c, titre: c.niveau.replace("+", " · ") + " · " + c.competence, puces: puces };
  }

  function themeTheorique() {
    var publics = D.tirage.publicsTheo;
    var correspondance = { PE12: "N1", N1: "N1", PA12: "N1", N2: "N2", N3: "N3", N4: "N4" };
    var p = publics.filter(function (x) { return x.id === correspondance[etat.niveau]; })[0] || hasard(publics);
    var sujets = [];
    D.tirage.themesTheo.forEach(function (t) {
      t.sujets.forEach(function (s) { if (s.min <= p.rang) sujets.push({ theme: t, sujet: s }); });
    });
    var choix = hasard(sujets);
    return { epreuve: "theo", public: p, sujet: choix.sujet, titre: majuscule(choix.sujet.libelle), puces: [p.libelle, choix.theme.nom] };
  }

  function themeOrga() {
    var t = hasard(D.tirage.themesOrga);
    if (t.id === "formation") {
      var visables = ["N1", "N2", "N3", "N4", "N5"];
      var o = onglet(visables.indexOf(etat.niveau) >= 0 ? etat.niveau : hasard(visables));
      return { epreuve: "orga", orga: t, cursus: o, titre: t.nom + " " + o.libelle, puces: [hasard(D.tirage.contextesFormation)] };
    }
    return { epreuve: "orga", orga: t, titre: t.nom, puces: [hasard(D.tirage.sites), hasard(D.tirage.meteo), hasard(D.tirage.groupes)] };
  }

  function tirer() {
    var ep = etat.epreuve === "any" ? hasard(["prat", "theo", "orga"]) : etat.epreuve;
    var theme = null;
    if (ep === "prat") {
      var liste = competencesPratique();
      theme = liste.length ? themePratique(hasard(liste)) : { epreuve: "prat", vide: true };
    } else if (ep === "theo") theme = themeTheorique();
    else theme = themeOrga();
    etat.theme = theme;
    etat.etape = 0;
    saisies = {};
    if (statut) statut.textContent = "";
    afficherTheme();
    construireGrille();
  }

  /* ---------- Affichage du thème ---------- */
  var FORMAT = "Thème d’entraînement";
  var SUITES = {
    prat: "puis 30 min devant le jury",
    theo: "puis 30 min devant le jury",
    orga: "puis 10 min d’exposé et 20 min de questions"
  };
  function afficherTheme() {
    var t = etat.theme;
    $("[data-theme-format]").textContent = FORMAT;
    $("[data-chrono-suite]").textContent = SUITES[t.epreuve];
    var titre = $("[data-theme-titre]");
    var puces = $("[data-theme-puces]");
    puces.textContent = "";
    if (t.vide) {
      titre.textContent = "Le MFT ne détaille pas de compétence pour ce niveau : choisis un autre niveau.";
      return;
    }
    titre.textContent = t.titre;
    t.puces.forEach(function (p) { puces.appendChild(el("span", "puce puce--theme", p)); });
  }

  /* ---------- Résumés du MFT en face des champs ---------- */
  function chapitre(niv) { var o = ongletDeNiveau(niv); return o ? o.chapitre : niv; }

  function resume(source) {
    var t = etat.theme;
    if (!t || t.vide || !source || source === "aucune") return null;
    var c = t.competence;

    if (t.epreuve === "prat") {
      var ch = chapitre(c.niveau);
      var nouveau = c.nouveau && !/^Point de départ/.test(c.nouveau) ? " Ce qui change : " + c.nouveau : "";
      var textes = {
        objectif: c.objectif,
        positionner: "Niveau d’entrée : " + (D.tirage.prerequis[c.niveau] || "") + "." + nouveau,
        justifier: "Prérogatives visées : " + niveauxSimples(c.niveau).map(function (id) { var n = niveau(id); return n ? n.nom + " : " + n.profondeur : ""; }).join(" ; ") + ". Moment de la plongée : " + moment(c.phase) + ".",
        strategie: c.technique + (c.curseurs ? " Curseurs : " + c.curseurs : ""),
        accueil: niveauxSimples(c.niveau).map(function (id) { var n = niveau(id); return n ? n.cadre : ""; }).join(" "),
        theorie: c.theorie,
        comportement: c.comportement ? "Comportement attendu : " + c.comportement : null,
        evaluation: c.evaluation
      };
      return textes[source] ? { chapitre: ch, texte: textes[source] } : null;
    }

    if (t.epreuve === "theo") {
      var p = t.public;
      var o = onglet(p.id);
      if (source === "theo-competences") {
        var cles = t.sujet.motsCles.map(function (k) { return k.toLowerCase(); });
        var trouvees = D.competences.filter(function (x) {
          if (p.niveaux.indexOf(x.niveau) < 0) return false;
          var txt = ((x.theorie || "") + " " + (x.technique || "")).toLowerCase();
          return cles.some(function (k) { return txt.indexOf(k) >= 0; });
        });
        return { chapitre: o ? o.chapitre : p.id, liste: trouvees.map(function (x) { return x.niveau.replace("+", " · ") + " · " + x.competence + " : " + x.theorie; }),
          texte: trouvees.length ? null : "Aucune compétence de ce niveau n’en parle directement : regarde les connaissances théoriques du MFT de ce niveau." };
      }
      if (source === "theo-limites") {
        var lim = [];
        p.niveaux.forEach(function (id) { niveauxSimples(id).forEach(function (s) { var n = niveau(s); if (n && lim.indexOf(n) < 0) lim.push(n); }); });
        return { chapitre: o ? o.chapitre : p.id, texte: "Limites du MFT pour ce public : " + lim.map(function (n) { return n.nom + " : " + n.limites; }).join(" ") };
      }
      if (source === "theo-evaluation") {
        return { chapitre: o ? o.chapitre : p.id, texte: p.rang === 0
          ? "Au N1 et au PA12, la théorie s’évalue à l’oral, pendant la pratique, sans écrit."
          : "À partir du N2, la théorie s’évalue à l’oral, en situation ou à l’écrit." };
      }
      return null;
    }

    // Organisationnelle
    if (t.cursus) {
      var oc = t.cursus;
      var nivs = [];
      oc.niveaux.forEach(function (id) { niveauxSimples(id).forEach(function (s) { var n = niveau(s); if (n && nivs.indexOf(n) < 0) nivs.push(n); }); });
      if (source === "cursus-niveau") {
        var pre = oc.niveaux.map(function (id) { return D.tirage.prerequis[id]; }).filter(Boolean)[0] || "";
        return { chapitre: oc.chapitre, texte: nivs.map(function (n) { return n.nom + " : " + n.profondeur + ", dès " + n.age + "."; }).join(" ") + (pre ? " Niveau d’entrée : " + pre + "." : "") };
      }
      if (source === "cursus-competences") {
        var comps = D.competences.filter(function (x) { return oc.niveaux.indexOf(x.niveau) >= 0; });
        var ordre = D.moments.map(function (m) { return m.id; });
        comps.sort(function (a, b) { return ordre.indexOf(a.phase) - ordre.indexOf(b.phase); });
        return { chapitre: oc.chapitre, liste: comps.map(function (x) { return moment(x.phase) + " · " + x.competence; }) };
      }
      if (source === "cursus-encadrement") return { chapitre: oc.chapitre, texte: nivs.map(function (n) { return n.cadre; }).join(" ") };
      return null;
    }
    var cible = competence(source);
    if (!cible) return null;
    return { chapitre: chapitre(cible.niveau), texte: cible.competence + " : " + cible.technique };
  }

  /* ---------- Grille ---------- */
  function grilleCourante() {
    var t = etat.theme;
    if (!t) return [];
    if (t.epreuve === "prat") return D.grilles.pratique;
    if (t.epreuve === "theo") return D.grilles.theorique;
    return t.cursus ? D.grilles.cursus : D.grilles.organisationnelle;
  }

  var saisies = {}; // texte saisi par champ ; vidé à chaque nouveau tirage
  function construireGrille() {
    var zone = $("[data-grille-sections]");
    zone.textContent = "";
    var coeur = (etat.theme && etat.theme.orga && etat.theme.orga.coeur) || [];
    var n = 0;
    grilleCourante().forEach(function (s) {
      var bloc = el("div", "grille__section");
      bloc.appendChild(el("h3", "grille__section-titre", s.titre));
      s.champs.forEach(function (f) {
        var ligne = el("div", "champ");
        ligne.setAttribute("data-etape", String(n++));
        ligne.setAttribute("data-section", s.titre);
        if (coeur.indexOf(f.id) >= 0) ligne.setAttribute("data-coeur", "");
        var gauche = el("div", "champ__saisie");
        var tete = el("div", "champ__tete");
        var lab = el("label", "champ__nom", f.nom);
        lab.setAttribute("for", "champ-" + f.id);
        tete.appendChild(lab);
        if (coeur.indexOf(f.id) >= 0) tete.appendChild(el("span", "puce puce--coeur bureau", "Cœur du sujet"));
        var aideB = el("button", "aide-bouton", "?");
        aideB.type = "button";
        aideB.setAttribute("aria-label", "Aide : " + f.nom);
        aideB.setAttribute("aria-controls", "aide-" + f.id);
        aideB.setAttribute("aria-expanded", etat.aideOuverte === f.id ? "true" : "false");
        aideB.setAttribute("data-aide-champ", f.id);
        tete.appendChild(aideB);
        gauche.appendChild(tete);
        var aide = el("p", "champ__aide", f.aide);
        aide.id = "aide-" + f.id;
        aide.hidden = etat.aideOuverte !== f.id;
        gauche.appendChild(aide);
        var ta = document.createElement("textarea");
        ta.id = "champ-" + f.id;
        ta.className = "champ__texte";
        ta.placeholder = f.exemple;
        ta.value = saisies[ta.id] || "";
        gauche.appendChild(ta);
        ligne.appendChild(gauche);

        var r = resume(f.source);
        // Colonne MFT : grisée (sans son contenu) tant que la comparaison n’est pas demandée.
        var droite = el("div", "champ__mft");
        droite.classList.toggle("champ__mft--verrouille", !etat.comparer);
        if (r) {
          var attente = el("p", "champ__mft-attente", "Le résumé du MFT s’affichera ici quand tu cliqueras sur « Comparer avec le MFT ».");
          attente.hidden = etat.comparer;
          droite.appendChild(attente);
          var corps = el("div", "champ__mft-corps");
          corps.hidden = !etat.comparer;
          corps.appendChild(el("span", "champ__mft-titre", "Résumé du MFT, chapitre " + r.chapitre + " · à vérifier"));
          if (r.liste && r.liste.length) {
            var ul = el("ul", "champ__mft-liste");
            r.liste.forEach(function (x) { ul.appendChild(el("li", null, x)); });
            corps.appendChild(ul);
          }
          if (r.texte) corps.appendChild(el("p", "champ__mft-texte", r.texte));
          droite.appendChild(corps);
        } else {
          droite.classList.add("champ__mft--vide");
        }
        ligne.appendChild(droite);
        bloc.appendChild(ligne);
      });
      zone.appendChild(bloc);
    });
    afficherEtape();
  }

  /* ---------- Comparer avec le MFT ---------- */
  function basculerComparaison(valeur) {
    etat.comparer = valeur;
    var b = $("[data-comparer-mft]");
    b.setAttribute("aria-pressed", valeur ? "true" : "false");
    b.textContent = valeur ? "Masquer le MFT" : "Comparer avec le MFT";
    racine.classList.toggle("tirage--comparaison", valeur);
    racine.querySelectorAll(".champ__mft").forEach(function (d) {
      d.classList.toggle("champ__mft--verrouille", !valeur);
      var attente = d.querySelector(".champ__mft-attente"), corps = d.querySelector(".champ__mft-corps");
      if (attente) attente.hidden = valeur;
      if (corps) corps.hidden = !valeur;
    });
    afficherEtape();
  }

  /* ---------- Étapes (téléphone) ---------- */
  function afficherEtape() {
    var lignes = racine.querySelectorAll(".champ");
    var total = lignes.length;
    if (!total) return;
    if (etat.etape >= total) etat.etape = total - 1;
    lignes.forEach(function (l, i) { l.classList.toggle("champ--etape", i === etat.etape); });
    racine.querySelectorAll(".grille__section").forEach(function (s) {
      s.classList.toggle("grille__section--etape", !!s.querySelector(".champ--etape"));
    });
    var courante = lignes[etat.etape];
    $("[data-etape-numero]").textContent = "Étape " + (etat.etape + 1) + " sur " + total;
    $("[data-etape-section]").textContent = courante.hasAttribute("data-coeur") ? "Cœur du sujet" : courante.getAttribute("data-section");
    $("[data-etape-avance]").style.width = Math.round(((etat.etape + 1) / total) * 100) + "%";
    var prec = racine.querySelector("[data-etape-precedente]");
    var suiv = racine.querySelector("[data-etape-suivante]");
    prec.disabled = etat.etape === 0;
    var derniere = etat.etape === total - 1;
    suiv.textContent = derniere ? (etat.comparer ? "Masquer le MFT" : "Comparer avec le MFT") : "Suivant";
    racine.classList.toggle("tirage--derniere-etape", derniere);
  }
  function changerEtape(delta) {
    var total = racine.querySelectorAll(".champ").length;
    var avant = etat.etape;
    if (delta > 0 && etat.etape === total - 1) { basculerComparaison(!etat.comparer); return; }
    etat.etape = Math.max(0, Math.min(total - 1, etat.etape + delta));
    if (etat.etape !== avant) {
      afficherEtape();
      var ta = racine.querySelector(".champ--etape textarea");
      var haut = $("[data-etapes-entete]");
      if (haut && haut.scrollIntoView) haut.scrollIntoView({ block: "start" });
      if (ta) ta.focus({ preventScroll: true });
    }
  }

  /* ---------- Chrono : 30 min, fiable même onglet en arrière-plan ---------- */
  var DUREE = 30 * 60 * 1000;
  var chrono = { fin: null, reste: DUREE, minuterie: null };
  var tempsEl = $("[data-chrono-temps]");
  var lancer = $("[data-chrono-lancer]");
  var zero = $("[data-chrono-zero]");
  var annonce = $("[data-chrono-annonce]");
  function format(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60);
    return (m < 10 ? "0" : "") + m + ":" + (s % 60 < 10 ? "0" : "") + (s % 60);
  }
  function libelleMinutes(ms) {
    var m = Math.ceil(Math.max(0, ms) / 60000);
    return "Temps restant " + m + " minute" + (m > 1 ? "s" : "");
  }
  function rafraichir() {
    var reste = chrono.fin ? chrono.fin - Date.now() : chrono.reste;
    tempsEl.textContent = format(reste);
    // L’intitulé accessible change à la minute, pour ne pas saturer les lecteurs d’écran.
    var lib = libelleMinutes(reste);
    if (tempsEl.getAttribute("aria-label") !== lib) tempsEl.setAttribute("aria-label", lib);
    if (chrono.fin && reste <= 0) {
      arreter();
      chrono.reste = 0;
      tempsEl.textContent = "00:00";
      lancer.hidden = true;
      annonce.textContent = "Temps de préparation écoulé.";
      racine.classList.add("tirage--temps-ecoule");
    }
  }
  function arreter() { clearInterval(chrono.minuterie); chrono.minuterie = null; }
  lancer.addEventListener("click", function () {
    if (chrono.fin) { // pause
      chrono.reste = chrono.fin - Date.now();
      chrono.fin = null;
      arreter();
      lancer.textContent = "Reprendre";
    } else {
      chrono.fin = Date.now() + chrono.reste;
      chrono.minuterie = setInterval(rafraichir, 250);
      lancer.textContent = "Pause";
      zero.hidden = false;
    }
    rafraichir();
  });
  zero.addEventListener("click", function () {
    arreter();
    chrono.fin = null;
    chrono.reste = DUREE;
    lancer.hidden = false;
    lancer.textContent = "Lancer le chrono";
    zero.hidden = true;
    annonce.textContent = "";
    racine.classList.remove("tirage--temps-ecoule");
    rafraichir();
  });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) rafraichir(); });

  /* ---------- Interactions ---------- */
  racine.querySelectorAll("[data-epreuve]").forEach(function (b) {
    b.addEventListener("click", function () {
      etat.epreuve = b.getAttribute("data-epreuve");
      racine.querySelectorAll("[data-epreuve]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });
  $("[data-niveau]").addEventListener("change", function (e) { etat.niveau = e.target.value; });
  $("[data-tirer]").addEventListener("click", function () {
    tirer();
    $("[data-theme-titre]").focus({ preventScroll: false });
  });
  $("[data-comparer-mft]").addEventListener("click", function () { basculerComparaison(!etat.comparer); });
  racine.querySelector("[data-etape-precedente]").addEventListener("click", function () { changerEtape(-1); });
  racine.querySelector("[data-etape-suivante]").addEventListener("click", function () { changerEtape(1); });

  racine.addEventListener("click", function (e) {
    var b = e.target.closest("[data-aide-champ]");
    if (!b) return;
    var id = b.getAttribute("data-aide-champ");
    etat.aideOuverte = etat.aideOuverte === id ? null : id;
    racine.querySelectorAll("[data-aide-champ]").forEach(function (x) {
      var ouvert = x.getAttribute("data-aide-champ") === etat.aideOuverte;
      x.setAttribute("aria-expanded", ouvert ? "true" : "false");
      var a = document.getElementById("aide-" + x.getAttribute("data-aide-champ"));
      if (a) a.hidden = !ouvert;
    });
  });

  /* ---------- Impression de la grille (thème, contexte, date, rubriques) ---------- */
  function dateDuJour() {
    var d = new Date();
    var z = function (n) { return (n < 10 ? "0" : "") + n; };
    return z(d.getDate()) + "/" + z(d.getMonth() + 1) + "/" + d.getFullYear();
  }
  function preparerImpression() {
    var zone = document.querySelector("[data-impression]");
    if (!zone) return;
    zone.textContent = "";
    var t = etat.theme;
    if (!t || t.vide) return;
    var tete = el("div", "impression__tete");
    tete.appendChild(el("p", "impression__sur", FORMAT + " · " + dateDuJour()));
    tete.appendChild(el("h1", "impression__titre", t.titre));
    if (t.puces && t.puces.length) tete.appendChild(el("p", "impression__contexte", t.puces.join(" · ")));
    zone.appendChild(tete);
    grilleCourante().forEach(function (s) {
      var bloc = el("section", "impression__bloc");
      bloc.appendChild(el("h2", "impression__rubrique", s.titre));
      s.champs.forEach(function (f) {
        var ta = document.getElementById("champ-" + f.id);
        var texte = ta ? ta.value.trim() : "";
        var champ = el("div", "impression__champ");
        champ.appendChild(el("h3", "impression__sous", f.nom));
        champ.appendChild(el("p", "impression__texte" + (texte ? "" : " impression__texte--vide"), texte));
        bloc.appendChild(champ);
      });
      zone.appendChild(bloc);
    });
    zone.appendChild(el("p", "impression__pied", "Thème d’entraînement préparé avec passe-ton-mf1.com, pas un sujet d’examen."));
  }
  window.addEventListener("beforeprint", preparerImpression);
  $("[data-imprimer]").addEventListener("click", function () {
    preparerImpression();
    window.print();
  });

  $("[data-effacer]").addEventListener("click", function () {
    racine.querySelectorAll(".champ__texte").forEach(function (ta) { ta.value = ""; });
    saisies = {};
    statut.textContent = "";
  });
  $("[data-enregistrer]").addEventListener("click", function () {
    var t = etat.theme;
    if (!t || t.vide || !window.Stockage) return;
    var themes = window.Stockage.lire("themes", []);
    if (!Array.isArray(themes)) themes = [];
    themes.push({ date: new Date().toISOString(), epreuve: t.epreuve, titre: t.titre });
    window.Stockage.ecrire("themes", themes);
    statut.textContent = "Thème enregistré. Tu en as préparé " + themes.length + ".";
  });

  /* ---------- Démarrage ---------- */
  var params = new URLSearchParams(location.search);
  var ep = params.get("epreuve");
  if (ep && ["prat", "theo", "orga"].indexOf(ep) >= 0) {
    etat.epreuve = ep;
    racine.querySelectorAll("[data-epreuve]").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-epreuve") === ep ? "true" : "false"); });
  }

  fetch(racine.getAttribute("data-donnees"))
    .then(function (r) { return r.json(); })
    .then(function (donnees) {
      D = donnees;
      tirer();
    })
    .catch(function () {
      $("[data-theme-titre]").textContent = "Le contenu n’a pas pu être chargé. Vérifie ta connexion, puis recharge la page.";
    });
})();
