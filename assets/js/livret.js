/* Outil « Vérifier mon livret » (fiche Remplir le livret pédagogique, shortcode verif-livret).
   Règles du MFT MF1 (juillet 2026) :
   - une séance est complète quand toutes les phases sont réalisées (aucune case NT ni vide), validée quand tout est A ;
   - un module est validable avec au moins 5 séances complètes dont 2 validées, sur des thèmes et des niveaux différents ;
   - le tuteur qui valide doit avoir suivi le stagiaire sur au moins 4 séances, dont au moins 1 dans le module.
   Données : Stockage « livret » = { courant: "p06", modules: { p06: [ { date, e4, niveau, theme, c: ["A", "ECA", "NT", ""] } ] } }. */
// Lancé à DOMContentLoaded : le script commun (Stockage) est chargé après le contenu de la page.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var zone = document.querySelector("[data-verif-livret]");
  if (!zone || !window.Stockage) return;

  var ENSEIGNER = [
    ["Concevoir", "Définir les objectifs de formation"],
    ["Concevoir", "Positionner le thème dans le cursus"],
    ["Concevoir", "Justifier la séance"],
    ["Concevoir", "Définir une stratégie d’enseignement"],
    ["Réaliser", "Accueillir les plongeurs"],
    ["Réaliser", "Animer une séance et communiquer"],
    ["Réaliser", "Mettre en œuvre une stratégie de formation"],
    ["Évaluer", "Réaliser une évaluation adaptée"]
  ];
  var ORGANISER = [
    ["Organiser", "Accueillir les plongeurs"],
    ["Organiser", "Choisir un site de plongée"],
    ["Organiser", "Composer les palanquées"],
    ["Organiser", "Fixer les paramètres de la plongée"],
    ["Organiser", "Présenter le site"],
    ["Organiser", "Sécuriser et surveiller"],
    ["Organiser", "Réagir en cas d’accident"]
  ];
  var MODULES = [
    { id: "p06", nom: "Pratique entre 0 et 6 m", items: ENSEIGNER, niveau: true },
    { id: "p620", nom: "Pratique entre 6 et 20 m", items: ENSEIGNER, niveau: true },
    { id: "p2040", nom: "Pratique entre 20 et 40 m", items: ENSEIGNER, niveau: true },
    { id: "t1", nom: "Théorie : PE12, N1, PA20, PE40 et N2", items: ENSEIGNER, niveau: true },
    { id: "t2", nom: "Théorie : PA40, PE60, N3, GP-N4 et DP-N5", items: ENSEIGNER, niveau: true },
    { id: "orga", nom: "Organiser et sécuriser l’activité", items: ORGANISER, niveau: false }
  ];
  var CYCLE = ["", "A", "ECA", "NT"];
  var LIBELLE = { "": "case vide", A: "acquis", ECA: "en cours d’acquisition", NT: "non travaillé" };
  var NB = " ";

  var etat = Stockage.lire("livret", null);
  if (!etat || typeof etat !== "object" || !etat.modules) etat = { courant: "p06", modules: {} };
  function module() { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === etat.courant) return MODULES[i]; etat.courant = "p06"; return MODULES[0]; }
  function seances() { var m = module(); if (!Array.isArray(etat.modules[m.id])) etat.modules[m.id] = []; return etat.modules[m.id]; }
  function enregistrer() { Stockage.ecrire("livret", etat); }
  function nouvelle(m) { var c = []; for (var i = 0; i < m.items.length; i++) c.push(""); return { date: "", e4: "", niveau: "", theme: "", c: c }; }

  function statut(s) {
    var vide = 0, nt = 0, eca = 0;
    s.c.forEach(function (x) { if (x === "") vide++; else if (x === "NT") nt++; else if (x === "ECA") eca++; });
    return { vide: vide, complete: vide === 0 && nt === 0, validee: vide === 0 && nt === 0 && eca === 0 };
  }
  function norm(t) { return (t || "").trim().toLowerCase().replace(/\s+/g, " "); }
  function pluriel(n, mot) { return n + NB + mot + (n > 1 ? "s" : ""); }

  /* ---------- Construction de la grille ---------- */
  var choix = zone.querySelector("[data-verif-module]");
  MODULES.forEach(function (m) { var o = document.createElement("option"); o.value = m.id; o.textContent = m.nom; choix.appendChild(o); });
  var grille = zone.querySelector("[data-verif-grille]");
  var bilan = zone.querySelector("[data-verif-bilan]");

  function el(tag, classe, texte) { var e = document.createElement(tag); if (classe) e.className = classe; if (texte !== undefined) e.textContent = texte; return e; }

  function champ(s, i, cle, libelle, place) {
    var input = el("input", "verif__champ");
    input.type = "text";
    input.value = s[cle] || "";
    input.placeholder = place;
    input.setAttribute("aria-label", "Séance " + (i + 1) + ", " + libelle);
    input.addEventListener("input", function () { s[cle] = input.value; enregistrer(); majBilan(); });
    return input;
  }

  function dessiner() {
    var m = module(), liste = seances();
    choix.value = m.id;
    grille.textContent = "";
    var table = el("table", "livret-grille verif-grille");
    var thead = el("thead"), tbody = el("tbody");
    var tr = el("tr"); tr.appendChild(el("th", "", "Séance")).setAttribute("scope", "row");
    liste.forEach(function (s, i) {
      var th = el("th"); th.setAttribute("scope", "col");
      th.appendChild(el("span", "", String(i + 1)));
      var sup = el("button", "verif__suppr", "×");
      sup.type = "button";
      sup.setAttribute("aria-label", "Supprimer la séance " + (i + 1));
      sup.addEventListener("click", function () {
        if (!window.confirm("Supprimer la séance " + (i + 1) + " de ce module ?")) return;
        liste.splice(i, 1); enregistrer(); dessiner();
      });
      th.appendChild(sup);
      tr.appendChild(th);
    });
    thead.appendChild(tr);

    var infos = [["date", "Date", "jj/mm"], ["e4", "Formateur E4", "Nom"]];
    if (m.niveau) infos.push(["niveau", "Niveau travaillé", "N1, PA20…"]);
    infos.push(["theme", "Thème travaillé", "Thème"]);
    infos.forEach(function (inf) {
      var r = el("tr", "livret-grille__info"); var h = el("th", "", inf[1]); h.setAttribute("scope", "row"); r.appendChild(h);
      liste.forEach(function (s, i) { var td = el("td"); td.appendChild(champ(s, i, inf[0], inf[1], inf[2])); r.appendChild(td); });
      tbody.appendChild(r);
    });

    var phase = "";
    m.items.forEach(function (it, k) {
      if (it[0] !== phase && m.items !== ORGANISER) {
        phase = it[0];
        var rp = el("tr", "livret-grille__phase"); var hp = el("th"); hp.appendChild(el("span", "livret-grille__phase-nom", phase)); hp.setAttribute("scope", "rowgroup"); hp.colSpan = liste.length + 1; rp.appendChild(hp); tbody.appendChild(rp);
      }
      var r = el("tr"); var h = el("th", "", it[1]); h.setAttribute("scope", "row"); r.appendChild(h);
      liste.forEach(function (s, i) {
        var td = el("td"), b = el("button", "");
        b.type = "button";
        function maj() {
          var v = s.c[k] || "";
          b.className = "livret-code verif__case livret-code--" + (v ? v.toLowerCase() : "vide");
          b.textContent = v || "·";
          b.setAttribute("aria-label", "Séance " + (i + 1) + ", " + it[1] + " : " + LIBELLE[v] + ". Changer");
        }
        b.addEventListener("click", function () {
          s.c[k] = CYCLE[(CYCLE.indexOf(s.c[k] || "") + 1) % CYCLE.length];
          maj(); enregistrer(); majBilan();
        });
        maj(); td.appendChild(b); r.appendChild(td);
      });
      tbody.appendChild(r);
    });

    ["Séance complète ?", "Séance validée ?"].forEach(function (libelle, j) {
      var r = el("tr", "livret-grille__bilan"); var h = el("th", "", libelle); h.setAttribute("scope", "row"); r.appendChild(h);
      liste.forEach(function (s) { var td = el("td"); td.setAttribute("data-verif-statut", String(j)); r.appendChild(td); });
      tbody.appendChild(r);
    });
    table.appendChild(thead); table.appendChild(tbody);
    if (liste.length) grille.appendChild(table);
    else grille.appendChild(el("p", "verif__vide", "Aucune séance dans ce module. Ajoute ta première séance."));
    grille.classList.toggle("verif__grille--vide", !liste.length);
    majBilan();
  }

  /* ---------- Bilan du module ---------- */
  function majBilan() {
    var m = module(), liste = seances();
    var stats = liste.map(statut);
    // Lignes « complète ? » et « validée ? »
    var cellules = grille.querySelectorAll("[data-verif-statut]");
    for (var n = 0; n < cellules.length; n++) {
      var td = cellules[n], i = n % liste.length, j = td.getAttribute("data-verif-statut"), st = stats[i];
      td.textContent = "";
      if (st.vide) td.appendChild(el("span", "verif__a-remplir", "À remplir"));
      else if (j === "0" ? st.complete : st.validee) td.appendChild(el("strong", "", "Oui"));
      else td.textContent = "Non";
    }
    var completes = 0, validees = 0, vides = 0;
    stats.forEach(function (st) { if (st.complete) completes++; if (st.validee) validees++; if (st.vide) vides++; });

    bilan.textContent = "";
    if (!liste.length) return;
    var ok = completes >= 5 && validees >= 2;
    var titre = el("p", "verif__verdict " + (ok ? "verif__verdict--ok" : "verif__verdict--non"));
    titre.textContent = ok ? "Le compte est bon : ce module est validable." : "Ce module n’est pas encore validable.";
    bilan.appendChild(titre);
    var ul = el("ul", "verif__points");
    function point(t) { ul.appendChild(el("li", "", t)); }
    point(pluriel(completes, "séance") + " complète" + (completes > 1 ? "s" : "") + " sur 5 demandées, dont " + validees + " validée" + (validees > 1 ? "s" : "") + " sur 2.");
    if (!ok) {
      var manqueC = Math.max(0, 5 - completes), manqueV = Math.max(0, 2 - validees);
      var aFaire = Math.max(manqueC, manqueV);
      var t = "Il te faut encore au moins " + pluriel(aFaire, "séance") + " complète" + (aFaire > 1 ? "s" : "");
      if (manqueV) t += ", dont " + manqueV + " validée" + (manqueV > 1 ? "s" : "") + " (tout en A)";
      point(t + ".");
    }
    if (vides) point(pluriel(vides, "séance") + " avec des cases vides : chaque case du livret porte A, ECA ou NT.");

    // Thèmes et niveaux différents, parmi les séances complètes
    var vus = {}, doublons = 0, niveaux = {};
    liste.forEach(function (s, i) {
      if (!stats[i].complete) return;
      var cle = norm(s.niveau) + "|" + norm(s.theme);
      if (norm(s.theme) && vus[cle]) doublons++;
      vus[cle] = true;
      if (norm(s.niveau)) niveaux[norm(s.niveau)] = true;
    });
    if (doublons) point("Attention : " + pluriel(doublons, "séance") + " complète" + (doublons > 1 ? "s" : "") + " répète" + (doublons > 1 ? "nt" : "") + " un même thème avec le même niveau. Le MFT demande des thèmes et des niveaux différents.");
    if (m.niveau && completes >= 2 && Object.keys(niveaux).length === 1) point("Attention : toutes tes séances complètes portent sur le même niveau de plongeurs. Varie les niveaux.");

    // Tuteurs : au moins 4 séances avec le stagiaire, dont au moins 1 dans ce module (tous modules confondus)
    var total = {}, ici = {}, noms = {};
    MODULES.forEach(function (mm) {
      (etat.modules[mm.id] || []).forEach(function (s) {
        var nom = norm(s.e4); if (!nom) return;
        noms[nom] = noms[nom] || s.e4.trim();
        total[nom] = (total[nom] || 0) + 1;
        if (mm.id === m.id) ici[nom] = (ici[nom] || 0) + 1;
      });
    });
    var peuvent = Object.keys(ici).filter(function (n) { return total[n] >= 4; });
    if (peuvent.length) point("Tuteur pouvant valider ce module : " + peuvent.map(function (n) { return noms[n] + " (" + pluriel(total[n], "séance") + " avec toi, dont " + ici[n] + " ici)"; }).join(", ") + ".");
    else if (Object.keys(ici).length) point("Aucun tuteur de ce module ne t’a encore suivi sur 4 séances (tous modules confondus) : c’est le minimum pour qu’il puisse valider le module.");
    bilan.appendChild(ul);
  }

  /* ---------- Actions ---------- */
  choix.addEventListener("change", function () { etat.courant = choix.value; enregistrer(); dessiner(); });
  zone.querySelector("[data-verif-ajouter]").addEventListener("click", function () {
    seances().push(nouvelle(module())); enregistrer(); dessiner();
    grille.scrollLeft = grille.scrollWidth;
  });
  zone.querySelector("[data-verif-effacer]").addEventListener("click", function () {
    if (!seances().length) return;
    if (!window.confirm("Effacer toutes les séances du module « " + module().nom + " » ? Cette action est définitive.")) return;
    etat.modules[module().id] = []; enregistrer(); dessiner();
  });

  dessiner();
});
