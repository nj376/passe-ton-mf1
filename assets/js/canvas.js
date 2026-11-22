/* Page « Canvas » : tableau blanc pour construire une séance à partir des jeux de cartes du MFT.
   Données : #cv-niveaux (data/canvas.json) et static/canvas/<jeu>.json, produits par outils/canvas.py.
   Stockage : clé « ptmf1:canvas » (window.Stockage), prise en compte par la sauvegarde de la page Suivi.
   Format : { version: 1, ouverte, astuce, seances: [{ id, nom, niveau, jeu, creee, modifiee, vue: {x, y, s},
     cartes: [{u, c, t, x, y, f}], liens: [{u, a, b}], notes: [{u, texte, rouge, type, x, y, l, h}] (type : absent, "evaluer" ou "bilan"), cadres: [{u, titre, x, y, l, h}] }] }
   Les cartes posées gardent l'identifiant de la carte (c) et son titre au moment de la pose (t), seulement pour
   repérer une carte retirée ou renumérotée du jeu ; le texte affiché vient toujours du jeu à jour.
   Pas de tableau sur téléphone : rien n'est chargé sous 768 px. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-cv]");
  if (!racine || !window.matchMedia("(min-width: 768px)").matches) return;

  var VERSION = 1, CLE = "canvas";
  var CL = 200, CH = 96;               // carte à 100 %
  var ZMIN = 0.25, ZMAX = 2, HISTO = 100;
  var NS = "http://www.w3.org/2000/svg";
  var ORANGE = "#D9822B", GRIS = "#8796A5", ROUGE = "#B3261E", FONCE = "#3A4A59";
  var POLICE = "\"IBM Plex Sans\", system-ui, sans-serif", MONO = "\"IBM Plex Mono\", monospace";

  var base = racine.getAttribute("data-base") || "/";
  var contact = racine.getAttribute("data-contact");
  var niveaux = JSON.parse(document.getElementById("cv-niveaux").textContent);
  // Niveaux masqués (hugo.toml, masquesCanvas) : pas de pastille, mais les séances déjà créées restent lisibles.
  var masques = [];
  try { masques = JSON.parse(racine.getAttribute("data-masques")) || []; } catch (e) { /* aucun */ }
  // Fiche « Construire ma progression détaillée » de chaque compétence : première progression type qui pointe vers la carte.
  var fiches = {};
  try {
    var liens = JSON.parse(document.getElementById("cv-liens").textContent) || {};
    Object.keys(liens).forEach(function (id) { if (!fiches[liens[id]]) fiches[liens[id]] = id; });
  } catch (e) { /* pas de correspondance */ }
  var tablette = window.matchMedia("(max-width: 1023px)");

  function $(s, r) { return (r || racine).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || racine).querySelectorAll(s)); }
  function el(tag, cls, texte) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texte !== undefined && texte !== null) e.textContent = texte;
    return e;
  }
  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  var ICONES = {
    relier: "<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1\"></path><path d=\"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"></path>",
    corbeille: "<path d=\"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13\"></path>",
    croix: "<path d=\"M6 6l12 12M18 6L6 18\"></path>",
    alerte: "<path d=\"M12 4l9 16H3z\"></path><path d=\"M12 10v4M12 17v.5\"></path>",
    crayon: "<path d=\"M4 20h4L19 9l-4-4L4 16z\"></path><path d=\"M13.5 6.5l4 4\"></path>",
    copie: "<rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2\"></rect><path d=\"M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3\"></path>",
    plus: "<path d=\"M12 5v14M5 12h14\"></path>",
    coche: "<path d=\"M5 12l5 5 9-10\"></path>",
    etincelle: "<path d=\"M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6\"></path>"
  };
  function icone(nom, taille, epaisseur) {
    return "<svg width=\"" + (taille || 16) + "\" height=\"" + (taille || 16) + "\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"" + (epaisseur || 2) + "\" stroke-linecap=\"round\" stroke-linejoin=\"round\">" + ICONES[nom] + "</svg>";
  }
  function echapper(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  function sansAccents(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "'"); }
  function z2(n) { return (n < 10 ? "0" : "") + n; }
  function heure(ms) { var d = new Date(ms); return z2(d.getHours()) + ":" + z2(d.getMinutes()); }
  function jour(ms) { var d = new Date(ms); return z2(d.getDate()) + "/" + z2(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function estAujourdhui(ms) { return jour(ms) === jour(Date.now()); }
  var compteur = 0;
  function uid() { return "e" + Date.now().toString(36) + (compteur++).toString(36); }
  function guillemets(t) { return "« " + t + " »"; }
  function listeEt(tab) { return tab.length < 2 ? tab.join("") : tab.slice(0, -1).join(", ") + " et " + tab[tab.length - 1]; }
  function pluriel(n, un, plusieurs) { return n + " " + (n > 1 ? plusieurs : un); }

  /* ---------- Vocabulaire des jeux ---------- */
  var FEMININ = { "compétence": 1, "technique": 1, "connaissance théorique": 1, "aptitude": 1, "épreuve": 1, "théorie": 1 };
  function noms(jeu) {
    // « compétence, technique, connaissance théorique » → noms au singulier, pluriel, genre.
    return jeu.chaine.split(", ").map(function (n) {
      return { un: n, plusieurs: n.split(" ").map(function (m) { return m + "s"; }).join(" "), f: !!FEMININ[n] };
    });
  }
  function cette(nom) { return (nom.f ? "Cette " : "Ce ") + nom.un; }
  function toutes(groupe) {
    var g = groupe.toLowerCase();
    var f = { "compétences": 1, "techniques": 1, "connaissances théoriques": 1, "aptitudes": 1, "épreuves": 1 };
    if (f[g]) return "Toutes les " + g;
    if (g === "cadre") return "Tout le cadre";
    if (g === "théorie") return "Toute la théorie";
    return "Tous les " + g;
  }
  function libelleOnglet(groupe) { return groupe === "Connaissances théoriques" ? "Théorie" : groupe; }

  /* ---------- État ---------- */
  var store = { version: VERSION, ouverte: null, astuce: false, seances: [] };
  var lu = window.Stockage ? window.Stockage.lire(CLE, null) : null;
  if (lu && lu.version === VERSION && Array.isArray(lu.seances)) store = lu;
  var seance = null;           // séance ouverte (enregistrée ou neuve)
  var jeu = null;              // jeu de cartes chargé
  var jeux = {};               // cache des jeux
  var vue = { x: 0, y: 0, s: 1 };
  var taille = { l: 800, h: 700 };
  var sel = null;              // { k: "carte" | "note" | "cadre" | "lien", u }
  var relierDepuis = null;     // relier au doigt ou au clavier : uid de l'élément de départ
  var onglet = 0, recherche = "", filtre = "", voirSuite = {};
  var histos = {};             // uid de séance → { pile, refaire }
  var minuterie = null, etat = "", edition = null, bulleMinuterie = null, detailsPour = null;

  var fond = $("[data-fond]"), monde = $("[data-monde]"), tableau = $("[data-tableau]");
  var travail = $("[data-travail]"), details = $("[data-details]"), selbar = $("[data-selbar]");
  var voile = $("[data-voile]"), annonceZone = $("[data-annonce]");

  function annoncer(t) { annonceZone.textContent = ""; setTimeout(function () { annonceZone.textContent = t; }, 30); }
  function niveauDe(id) { return niveaux.filter(function (n) { return n.id === id; })[0]; }
  function infoJeu(niv, idJeu) { return niv.jeux.filter(function (j) { return j.id === idJeu; })[0] || niv.jeux[0]; }
  function libelleNiveau(s) {
    var niv = niveauDe(s.niveau), j = infoJeu(niv, s.jeu);
    return niv.court + (niv.jeux.length > 1 ? " · " + j.nom : "");
  }

  /* ---------- Séances et enregistrement ---------- */
  function seanceVide(niveau, idJeu) {
    var niv = niveauDe(niveau);
    return { id: uid(), nom: "", niveau: niveau, jeu: idJeu || niv.jeux[0].id, creee: Date.now(), modifiee: Date.now(),
             vue: null, cartes: [], liens: [], notes: [], cadres: [], neuve: true };
  }
  function estVide(s) { return !s.cartes.length && !s.notes.length && !s.cadres.length && !s.liens.length; }
  function aGarder(s) { return !estVide(s) || !!(s.nom && s.nom.trim()); }
  function enregistrees() {
    return store.seances.slice().sort(function (a, b) { return b.modifiee - a.modifiee; });
  }
  function ecrireStore() {
    var i = store.seances.indexOf(seance);
    if (aGarder(seance) && i < 0) store.seances.push(seance);
    if (store.seances.indexOf(seance) >= 0) delete seance.neuve;
    seance.vue = { x: Math.round(vue.x), y: Math.round(vue.y), s: vue.s };
    store.ouverte = store.seances.indexOf(seance) >= 0 ? seance.id : null;
    var ok = window.Stockage ? window.Stockage.ecrire(CLE, store) : false;
    etat = ok ? "ok" : "erreur";
    majRepere();
    majCompte();
    return ok;
  }
  function programmer() {
    clearTimeout(minuterie);
    if (aGarder(seance) || store.seances.indexOf(seance) >= 0) { etat = "encours"; majRepere(); }
    minuterie = setTimeout(function () { minuterie = null; ecrireStore(); }, 1000);
  }
  function vider() { if (minuterie) { clearTimeout(minuterie); minuterie = null; ecrireStore(); } }
  window.addEventListener("pagehide", vider);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") vider(); });

  function majRepere() {
    var r = $("[data-repere]");
    r.className = "cv-repere";
    if (etat === "erreur") {
      r.classList.add("cv-repere--erreur");
      r.innerHTML = icone("alerte", 16) + "<span>Modifications non enregistrées : le stockage de ton navigateur est plein. Sauvegarde tes séances depuis <a href=\"" + base + "suivi/\">Mon suivi</a>, puis supprimes-en d’anciennes.</span>";
    } else if (etat === "encours") {
      r.innerHTML = "<span>Enregistrement…</span>";
    } else if (store.seances.indexOf(seance) >= 0) {
      r.classList.add("cv-repere--ok");
      r.innerHTML = icone("coche", 16, 2.4) + (estAujourdhui(seance.modifiee) ? "Enregistré à " + heure(seance.modifiee) : "Enregistré le " + jour(seance.modifiee));
    } else {
      r.innerHTML = icone("coche", 16, 2.4) + "Enregistrement automatique";
    }
  }
  function majCompte() {
    var n = store.seances.length;
    $("[data-nb-seances]").textContent = n;
    $("[data-action=\"seances\"]").disabled = n === 0;
    // « Supprimer la séance » : seulement s'il y a quelque chose à effacer (séance enregistrée ou tableau non vide).
    $("[data-action=\"supprimer-seance\"]").disabled = store.seances.indexOf(seance) < 0 && estVide(seance);
  }

  /* ---------- Séances modifiées dans un autre onglet (ou restaurées depuis Mon suivi) ---------- */
  window.addEventListener("storage", function (ev) {
    if (ev.key !== "ptmf1:" + CLE || !ev.newValue) return;
    var nouveau;
    try { nouveau = JSON.parse(ev.newValue); } catch (e) { return; }
    if (!nouveau || nouveau.version !== VERSION || !Array.isArray(nouveau.seances)) return;
    var i = nouveau.seances.map(function (x) { return x.id; }).indexOf(seance.id);
    if (minuterie || i < 0) {
      // Modifications en attente ici, ou séance pas encore connue ailleurs : on garde la version de cet onglet.
      if (i >= 0) nouveau.seances[i] = seance;
      else if (store.seances.indexOf(seance) >= 0) nouveau.seances.push(seance);
      store = nouveau;
    } else {
      store = nouveau;
      var autre = store.seances[i];
      if (autre.modifiee !== seance.modifiee) { ouvrir(autre, false); annoncer("La séance a été modifiée dans un autre onglet : elle est à jour."); }
      else store.seances[i] = seance;
    }
    majCompte(); majRepere();
  });

  /* ---------- Historique (annuler / rétablir), par séance, pour la durée de la page ---------- */
  function histo() { return histos[seance.id] || (histos[seance.id] = { pile: [], refaire: [] }); }
  function instantane() { return JSON.stringify({ cartes: seance.cartes, liens: seance.liens, notes: seance.notes, cadres: seance.cadres }); }
  function retenir(cle) {
    var h = histo(), maintenant = Date.now();
    if (cle && h.derniere === cle && maintenant - h.quand < 900) { h.quand = maintenant; return; }
    h.pile.push(instantane());
    if (h.pile.length > HISTO) h.pile.shift();
    h.refaire = [];
    h.derniere = cle || null; h.quand = maintenant;
  }
  function restaurer(texte) {
    var o = JSON.parse(texte);
    seance.cartes = o.cartes; seance.liens = o.liens; seance.notes = o.notes; seance.cadres = o.cadres;
  }
  function annuler() {
    var h = histo(); if (!h.pile.length) return;
    h.refaire.push(instantane()); restaurer(h.pile.pop()); h.derniere = null;
    if (sel && !trouver(sel.u)) sel = null;
    if (relierDepuis && !trouver(relierDepuis)) relierDepuis = null;
    if (edition && !trouver(edition.u)) edition = null;
    apresModif(); annoncer("Action annulée.");
  }
  function retablir() {
    var h = histo(); if (!h.refaire.length) return;
    h.pile.push(instantane()); restaurer(h.refaire.pop()); h.derniere = null;
    if (sel && !trouver(sel.u)) sel = null;
    if (relierDepuis && !trouver(relierDepuis)) relierDepuis = null;
    if (edition && !trouver(edition.u)) edition = null;
    apresModif(); annoncer("Action rétablie.");
  }
  function modifier(fn, cle) { retenir(cle); fn(); apresModif(); }
  function apresModif() { seance.modifiee = Date.now(); rendre(); programmer(); majCompte(); }

  /* ---------- Jeux de cartes ---------- */
  function chargerJeu(idJeu) {
    if (jeux[idJeu]) return Promise.resolve(jeux[idJeu]);
    return fetch(base + "canvas/" + idJeu + ".json").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) {
      j.parId = {};
      j.cartes.forEach(function (c) { j.parId[c.id] = c; });
      j.noms = noms(j);
      jeux[idJeu] = j;
      return j;
    });
  }
  function carteDe(pc) {
    var c = jeu && jeu.parId[pc.c];
    if (!c || (pc.t && c.titre !== pc.t)) return null;   // retirée ou renumérotée
    return c;
  }
  function couleurDe(c) {
    if (c.type === "competence") return c.couleur;
    if (c.type === "technique") return jeu.parId[c.comp].couleur;
    return null;
  }
  function nomComp(id) { return jeu.parId[id] ? jeu.parId[id].titre : ""; }
  function surLigne(c) {
    // Libellé du haut d'une carte compétence : « Compétence », « Épreuve », « Aptitude ».
    var n = c.libre ? "compétence" : jeu.noms[0].un;
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
  function nomCarte(pc) { var c = carteDe(pc); return c ? c.titre : (pc.t || pc.c); }
  function codeCarte(pc) { var c = carteDe(pc); return c ? c.code : pc.c; }

  /* ---------- Éléments du tableau ---------- */
  function trouver(u) {
    var tabs = [["carte", seance.cartes], ["note", seance.notes], ["cadre", seance.cadres], ["lien", seance.liens]];
    for (var i = 0; i < tabs.length; i++) for (var j = 0; j < tabs[i][1].length; j++) if (tabs[i][1][j].u === u) return { k: tabs[i][0], o: tabs[i][1][j] };
    return null;
  }
  function rect(o, k) {
    if (k === "carte" || o.c) return { x: o.x, y: o.y, w: CL, h: CH };
    return { x: o.x, y: o.y, w: o.l, h: o.h };
  }
  function poses(idCarte) { return seance.cartes.filter(function (pc) { return pc.c === idCarte; }).length; }
  function cadreSous(cx, cy, sauf) {
    var meilleur = null;
    seance.cadres.forEach(function (f) {
      if (f.u === sauf) return;
      if (cx >= f.x && cx <= f.x + f.l && cy >= f.y && cy <= f.y + f.h && (!meilleur || f.l * f.h < meilleur.l * meilleur.h)) meilleur = f;
    });
    return meilleur;
  }
  // Ce qui bouge avec un cadre : ses cartes, et les annotations dont le centre est dedans.
  function membresCadre(f) {
    return seance.cartes.filter(function (pc) { return pc.f === f.u; }).concat(seance.notes.filter(function (n) {
      var cx = n.x + n.l / 2, cy = n.y + n.h / 2;
      return cx >= f.x && cx <= f.x + f.l && cy >= f.y && cy <= f.y + f.h;
    }));
  }
  function rattacher() {
    seance.cartes.forEach(function (pc) { var f = cadreSous(pc.x + CL / 2, pc.y + CH / 2); pc.f = f ? f.u : null; });
  }

  /* ---------- Liens guidés ---------- */
  // Renvoie { de, vers } dans le sens général → détaillé, et l'avertissement éventuel.
  function analyser(l) {
    var A = trouver(l.a), B = trouver(l.b);
    if (!A || !B) return null;
    if (A.k === "note" || B.k === "note") return { de: A.o, vers: B.o, note: A.k === "note" ? A.o : B.o };
    var ca = carteDe(A.o), cb = carteDe(B.o);
    if (!ca || !cb) return { de: A.o, vers: B.o, retiree: true };
    var de = A.o, vers = B.o;
    if (ca.g > cb.g) { var t = ca; ca = cb; cb = t; de = B.o; vers = A.o; }
    // Deux cartes du même groupe : enchaînement (séquence), dans le sens du geste, jamais signalé.
    return { de: de, vers: vers, ca: ca, cb: cb, cas: casLien(ca, cb), enchainement: ca.g === cb.g };
  }
  function casLien(ca, cb) {
    if (ca.g === cb.g) return 0;
    if (ca.libre || cb.libre) return 0;
    if (ca.type === "competence" && cb.comp) return cb.comp !== ca.id ? 1 : 0;
    if (ca.type === "competence" && cb.cite) return cb.cite.indexOf(ca.id) < 0 ? 4 : 0;
    if (ca.comp && cb.cite && ca.type === "technique") return cb.cite.indexOf(ca.comp) < 0 ? 2 : 0;
    return 0;
  }
  // Phrase d'un lien à vérifier. « vu » : la carte du point de vue de laquelle on parle (panneau), sinon titres entre guillemets.
  function phrase(info, vu) {
    var ca = info.ca, cb = info.cb, n = jeu.noms;
    function sujet(c, nom) { return vu && vu === c ? cette(nom) : guillemets(c.titre); }
    if (info.cas === 1) {
      var nb = n[cb.g] || n[1];
      return sujet(cb, nb) + " relève de " + guillemets(nomComp(cb.comp)) + ", mais " + (nb.f ? "elle est reliée" : "il est relié") + " à " + guillemets(ca.titre) + ".";
    }
    if (info.cas === 2) {
      return sujet(cb, n[2]) + " sert " + listeEt(cb.cite.map(function (id) { return guillemets(nomComp(id)); })) + ", mais " + (n[1].f ? "la " : "le ") + n[1].un + " " + guillemets(ca.titre) + " relève de " + guillemets(nomComp(ca.comp)) + ".";
    }
    if (info.cas === 4) return sujet(cb, n[2]) + " ne cite pas " + guillemets(ca.titre) + ".";
    return "";
  }

  /* ---------- Géométrie ---------- */
  function centre(r) { return { x: r.x + r.w / 2, y: r.y + r.h / 2 }; }
  function bord(r, p) {
    // Point du bord du rectangle r sur le segment centre → p.
    var c = centre(r), dx = p.x - c.x, dy = p.y - c.y;
    if (!dx && !dy) return c;
    var k = Math.min(dx ? (r.w / 2) / Math.abs(dx) : Infinity, dy ? (r.h / 2) / Math.abs(dy) : Infinity);
    return { x: c.x + dx * k, y: c.y + dy * k };
  }
  function geometrie(l) {
    var info = analyser(l);
    if (!info) return null;
    var A = trouver(info.de.u), B = trouver(info.vers.u);
    var ra = rect(A.o, A.k), rb = rect(B.o, B.k);
    if (info.note) {
      var p1 = bord(ra, centre(rb)), p2 = bord(rb, centre(ra));
      return { info: info, d: "M" + r1(p1.x) + "," + r1(p1.y) + " L" + r1(p2.x) + "," + r1(p2.y), mid: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 } };
    }
    var ca = centre(ra), cb = centre(rb), dx = cb.x - ca.x, dy = cb.y - ca.y;
    var gx = Math.abs(dx) - (ra.w + rb.w) / 2, gy = Math.abs(dy) - (ra.h + rb.h) / 2;
    var x1, y1, x2, y2, c1x, c1y, c2x, c2y, ux = 0, uy = 0;
    if (gx >= 0 || gx >= gy) {
      var sx = dx >= 0 ? 1 : -1;
      x1 = sx > 0 ? ra.x + ra.w : ra.x; y1 = ca.y; x2 = sx > 0 ? rb.x : rb.x + rb.w; y2 = cb.y;
      var kx = Math.max(24, Math.abs(x2 - x1) * 0.45) * sx;
      c1x = x1 + kx; c1y = y1; c2x = x2 - kx; c2y = y2; ux = sx;
    } else {
      var sy = dy >= 0 ? 1 : -1;
      x1 = ca.x; y1 = sy > 0 ? ra.y + ra.h : ra.y; x2 = cb.x; y2 = sy > 0 ? rb.y : rb.y + rb.h;
      var ky = Math.max(24, Math.abs(y2 - y1) * 0.45) * sy;
      c1x = x1; c1y = y1 + ky; c2x = x2; c2y = y2 - ky; uy = sy;
    }
    var fx = x2 - ux * 6, fy = y2 - uy * 6;        // le trait s'arrête sous la pointe
    var bx = x2 - ux * 10, by = y2 - uy * 10, px = -uy * 5, py = ux * 5;
    return {
      info: info,
      d: "M" + r1(x1) + "," + r1(y1) + " C" + r1(c1x) + "," + r1(c1y) + " " + r1(c2x) + "," + r1(c2y) + " " + r1(fx) + "," + r1(fy),
      fleche: "M" + r1(x2) + "," + r1(y2) + " L" + r1(bx + px) + "," + r1(by + py) + " L" + r1(bx - px) + "," + r1(by - py) + " Z",
      mid: { x: (x1 + 3 * c1x + 3 * c2x + x2) / 8, y: (y1 + 3 * c1y + 3 * c2y + y2) / 8 }
    };
  }
  function r1(v) { return Math.round(v * 10) / 10; }

  /* ---------- Rendu du tableau ---------- */
  function appliquerVue() {
    monde.style.transform = "translate(" + vue.x + "px," + vue.y + "px) scale(" + vue.s + ")";
    $("[data-zoom]").textContent = Math.round(vue.s * 100) + " %";
    placerSelbar();
  }

  function domCarte(pc) {
    var c = carteDe(pc), d = el("div", "cv-carte");
    d.setAttribute("data-u", pc.u);
    d.setAttribute("tabindex", "0");
    d.setAttribute("role", "button");
    d.style.left = pc.x + "px"; d.style.top = pc.y + "px";
    if (!c) {
      d.classList.add("cv-carte--retiree");
      d.setAttribute("aria-label", "Carte retirée du jeu : " + pc.c + " " + (pc.t || ""));
      d.innerHTML = "<div class=\"cv-carte__bandeau\"><span>Carte retirée du jeu</span><span>" + echapper(pc.c) + "</span></div><div class=\"cv-carte__titre\">" + echapper(pc.t || "") + "</div>";
    } else if (c.type === "competence") {
      d.classList.add("cv-carte--competence");
      d.style.borderColor = c.couleur;
      d.setAttribute("aria-label", c.code + " " + c.titre);
      d.innerHTML = "<div class=\"cv-carte__plein\" style=\"background:" + c.couleur + "\"><span class=\"cv-carte__sur\"><span>" + echapper(surLigne(c)) + "</span><span>" + echapper(c.code) + "</span></span><span class=\"cv-carte__nom\">" + echapper(c.titre) + "</span></div>";
    } else if (c.type === "technique") {
      d.setAttribute("aria-label", c.code + " " + c.titre);
      d.innerHTML = "<div class=\"cv-carte__bandeau\" style=\"background:" + couleurDe(c) + "\"><span>" + echapper(nomComp(c.comp)) + "</span><span>" + echapper(c.code) + "</span></div><div class=\"cv-carte__titre\">" + echapper(c.titre) + "</div>";
    } else {
      d.classList.add("cv-carte--theorie");
      d.setAttribute("aria-label", c.code + " " + c.titre);
      d.innerHTML = "<div class=\"cv-carte__bandeau\"><span>" + echapper(c.bandeau || "Théorie · " + c.rubrique) + "</span><span>" + echapper(c.code) + "</span></div><div class=\"cv-carte__titre\">" + echapper(c.titre) + "</div>";
    }
    ajouterPoignees(d);
    if (sel && sel.u === pc.u) d.classList.add("est-choisi");
    if (relierDepuis === pc.u) d.classList.add("est-source");
    return d;
  }
  function ajouterPoignees(d) {
    ["n", "e", "s", "o"].forEach(function (c) {
      var p = el("span", "cv-poignee cv-poignee--" + c);
      p.setAttribute("data-poignee", c);
      p.setAttribute("aria-hidden", "true");
      d.appendChild(p);
    });
  }
  function domNote(n) {
    var d = el("div", "cv-note" + (n.type ? " cv-note--" + n.type : n.rouge ? " cv-note--rouge" : ""));
    d.setAttribute("data-u", n.u);
    d.setAttribute("tabindex", "0");
    d.setAttribute("role", "button");
    d.setAttribute("aria-label", "Annotation, " + genreNote(n) + " : " + (n.texte || "vide"));
    d.style.left = n.x + "px"; d.style.top = n.y + "px"; d.style.width = n.l + "px"; d.style.height = n.h + "px";
    if (edition && edition.u === n.u) {
      var t = el("textarea", "cv-note__saisie");
      t.value = n.texte; t.setAttribute("aria-label", "Texte de l’annotation"); t.placeholder = "Annotation";
      d.appendChild(t);
    } else {
      d.appendChild(document.createTextNode(n.texte));
    }
    ajouterPoignees(d);
    var r = el("span", "cv-note__taille"); r.setAttribute("data-taille", "se"); r.setAttribute("aria-hidden", "true");
    d.appendChild(r);
    if (sel && sel.u === n.u) d.classList.add("est-choisi");
    if (relierDepuis === n.u) d.classList.add("est-source");
    return d;
  }
  function domCadre(f) {
    var d = el("div", "cv-cadre");
    d.setAttribute("data-u", f.u);
    d.setAttribute("tabindex", "0");
    d.setAttribute("role", "group");
    d.setAttribute("aria-label", "Cadre : " + f.titre);
    d.style.left = f.x + "px"; d.style.top = f.y + "px"; d.style.width = f.l + "px"; d.style.height = f.h + "px";
    if (edition && edition.u === f.u) {
      var i = el("input", "cv-cadre__saisie"); i.value = f.titre; i.setAttribute("aria-label", "Titre du cadre"); i.maxLength = 120;
      d.appendChild(i);
    } else {
      var t = el("span", "cv-cadre__titre", f.titre); t.setAttribute("data-titre-cadre", "");
      d.appendChild(t);
    }
    ["n", "s", "e", "o", "ne", "no", "se", "so"].forEach(function (c) {
      var p = el("span", "cv-poignee-cadre cv-poignee-cadre--" + c); p.setAttribute("data-taille", c); p.setAttribute("aria-hidden", "true");
      d.appendChild(p);
    });
    if (sel && sel.u === f.u) d.classList.add("est-choisi");
    return d;
  }
  var calqueLiens = null;
  function rendreLiens() {
    if (!calqueLiens) return;
    calqueLiens.textContent = "";
    seance.liens.forEach(function (l) {
      var g = geometrie(l);
      if (!g) return;
      var info = g.info, orange = info.cas > 0, couleur = info.note ? (info.note.rouge ? ROUGE : GRIS) : (orange ? ORANGE : info.enchainement ? FONCE : GRIS);
      var grp = svg("g", { "class": "cv-lien-g" + (sel && sel.u === l.u ? " est-choisi" : ""), "data-u": l.u, tabindex: "0", role: "button" });
      var nomA = info.note ? "annotation" : guillemets(nomCarte(info.de)), nomB = info.note ? guillemets(nomCarte(info.note === info.de ? info.vers : info.de)) : guillemets(nomCarte(info.vers));
      grp.setAttribute("aria-label", info.note ? "Lien de l’annotation vers " + nomB : (info.enchainement ? "Enchaînement : " + nomA + " puis " + nomB : "Lien de " + nomA + " vers " + nomB) + (orange ? ", à vérifier" : ""));
      var trace = svg("path", { d: g.d, "class": "cv-lien-trace", stroke: couleur, "stroke-width": info.note ? 1.6 : (orange || info.enchainement ? 3 : 2) });
      if (info.note) trace.setAttribute("stroke-dasharray", "5 4");
      grp.appendChild(trace);
      if (g.fleche) grp.appendChild(svg("path", { d: g.fleche, fill: couleur, "class": "cv-lien-trace" }));
      var zone = svg("path", { d: g.d, "class": "cv-lien-zone" });
      if (orange) { var titre = svg("title", {}); titre.textContent = phrase(info); zone.appendChild(titre); }
      grp.appendChild(zone);
      if (orange) {
        var p = svg("g", { "class": "cv-lien-pastille" });
        p.appendChild(svg("circle", { cx: r1(g.mid.x), cy: r1(g.mid.y), r: 11, fill: "#FFFFFF", stroke: ORANGE, "stroke-width": 2 }));
        var t = svg("text", { x: r1(g.mid.x), y: r1(g.mid.y + 5), "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: ROUGE, "font-family": POLICE });
        t.textContent = "!";
        p.appendChild(t);
        grp.appendChild(p);
      }
      calqueLiens.appendChild(grp);
    });
  }

  function rendre() {
    if (!jeu || jeu.id !== seance.jeu) return;   // jeu en cours de chargement
    var focusDedans = monde.contains(document.activeElement);
    monde.textContent = "";
    seance.cadres.slice().sort(function (a, b) { return b.l * b.h - a.l * a.h; }).forEach(function (f) { monde.appendChild(domCadre(f)); });
    calqueLiens = svg("svg", { "class": "cv-liens-svg", "aria-label": "Liens" });
    monde.appendChild(calqueLiens);
    rendreLiens();
    seance.notes.forEach(function (n) { monde.appendChild(domNote(n)); });
    seance.cartes.forEach(function (pc) { monde.appendChild(domCarte(pc)); });
    appliquerVue();
    $("[data-aide]").hidden = !estVide(seance);
    var h = histo();
    $("[data-action=\"annuler\"]").disabled = !h.pile.length;
    $("[data-action=\"retablir\"]").disabled = !h.refaire.length;
    fond.classList.toggle("est-relie", !!relierDepuis);
    rendrePalette();
    rendreDetails();
    majSignaler();
    if (edition) {
      var champ = $("[data-u=\"" + edition.u + "\"] textarea, [data-u=\"" + edition.u + "\"] input", monde);
      if (champ) { champ.focus({ preventScroll: true }); if (edition.nouveau && champ.select) champ.select(); }
    } else if (focusDedans && sel) {
      var e = $("[data-u=\"" + sel.u + "\"]", monde);
      if (e) e.focus({ preventScroll: true });
    }
  }

  /* ---------- Sélection ---------- */
  function choisir(u) {
    var t = u ? trouver(u) : null;
    var avant = sel && sel.u;
    sel = t ? { k: t.k, u: u } : null;
    if (avant !== (sel && sel.u)) { voirSuite = {}; rendre(); }
  }
  function focaliser(u) { var e = $("[data-u=\"" + u + "\"]", monde); if (e) e.focus({ preventScroll: true }); }

  /* ---------- Vue : zoom et déplacement ---------- */
  function zoomer(f, px, py) {
    var s = Math.max(ZMIN, Math.min(ZMAX, vue.s * f));
    if (px === undefined) { px = taille.l / 2; py = taille.h / 2; }
    vue.x = px - (px - vue.x) * s / vue.s; vue.y = py - (py - vue.y) * s / vue.s; vue.s = s;
    appliquerVue(); programmerVue();
  }
  var minuterieVue = null;
  function programmerVue() {
    // La vue est enregistrée avec la séance, sans compter comme une modification.
    clearTimeout(minuterieVue);
    var s = seance;
    minuterieVue = setTimeout(function () { if (s === seance && store.seances.indexOf(seance) >= 0 && !minuterie) { seance.vue = { x: Math.round(vue.x), y: Math.round(vue.y), s: vue.s }; window.Stockage && window.Stockage.ecrire(CLE, store); } }, 1200);
  }
  function englobant() {
    var bx = Infinity, by = Infinity, bX = -Infinity, bY = -Infinity;
    function ajoute(r) { bx = Math.min(bx, r.x); by = Math.min(by, r.y); bX = Math.max(bX, r.x + r.w); bY = Math.max(bY, r.y + r.h); }
    seance.cartes.forEach(function (o) { ajoute(rect(o, "carte")); });
    seance.notes.forEach(function (o) { ajoute(rect(o)); });
    seance.cadres.forEach(function (o) { ajoute(rect(o)); });
    return bx === Infinity ? null : { x: bx, y: by, w: bX - bx, h: bY - by };
  }
  function ajuster() {
    var b = englobant();
    if (!b) { vue = { x: Math.round(taille.l / 2), y: Math.round(taille.h / 2), s: 1 }; appliquerVue(); return; }
    var haut = 64, marge = 24;
    var s = Math.min((taille.l - 2 * marge) / b.w, (taille.h - haut - 2 * marge) / b.h, 1);
    s = Math.max(ZMIN, Math.min(ZMAX, s));
    vue.s = s; vue.x = (taille.l - b.w * s) / 2 - b.x * s; vue.y = haut + marge + (taille.h - haut - 2 * marge - b.h * s) / 2 - b.y * s;
    appliquerVue(); programmerVue();
  }
  // Recentrer : le contenu revient au milieu du tableau (sous la barre d'outils), au même zoom.
  function recentrer() {
    var b = englobant(), haut = 64;
    if (!b) { vue.x = Math.round(taille.l / 2); vue.y = Math.round(taille.h / 2); }
    else {
      vue.x = Math.round(taille.l / 2 - (b.x + b.w / 2) * vue.s);
      vue.y = Math.round(haut + (taille.h - haut) / 2 - (b.y + b.h / 2) * vue.s);
    }
    appliquerVue(); programmerVue();
    annoncer("Tableau recentré.");
  }
  function versMonde(cx, cy) {
    var r = fond.getBoundingClientRect();
    return { x: (cx - r.left - vue.x) / vue.s, y: (cy - r.top - vue.y) / vue.s };
  }
  function centreVue() { return { x: (taille.l / 2 - vue.x) / vue.s, y: (taille.h / 2 - vue.y) / vue.s }; }

  /* ---------- Ajouts ---------- */
  function poser(idCarte, x, y, depuisClavier) {
    if (!jeu || jeu.id !== seance.jeu) return;
    var c = jeu.parId[idCarte];
    if (!c) return;
    if (x === undefined) {
      var m = centreVue(); x = m.x - CL / 2; y = m.y - CH / 2;
      for (var i = 0; i < 30 && seance.cartes.some(function (pc) { return Math.abs(pc.x - x) < 16 && Math.abs(pc.y - y) < 16; }); i++) { x += 24; y += 24; }
    }
    var pc = { u: uid(), c: c.id, t: c.titre, x: Math.round(x), y: Math.round(y), f: null };
    var f = cadreSous(pc.x + CL / 2, pc.y + CH / 2); pc.f = f ? f.u : null;
    modifier(function () { seance.cartes.push(pc); sel = { k: "carte", u: pc.u }; voirSuite = {}; });
    annoncer("Carte ajoutée au tableau : " + c.code + " " + c.titre + ".");
    if (c.type === "competence" && !c.libre && !store.astuce) montrerBulle(pc);
    if (tablette.matches) fermerPalette();
    if (!depuisClavier) focaliser(pc.u);
  }
  function montrerBulle(pc) {
    store.astuce = true;
    var b = $("[data-bulle]");
    var x = vue.x + (pc.x + CL + 16) * vue.s, y = vue.y + pc.y * vue.s;
    b.hidden = false;
    var lb = b.offsetWidth, hb = b.offsetHeight;
    if (x + lb > taille.l - 12) x = vue.x + pc.x * vue.s - lb - 16;
    b.style.left = Math.max(12, Math.min(taille.l - lb - 12, x)) + "px";
    b.style.top = Math.max(64, Math.min(taille.h - hb - 12, y)) + "px";
    clearTimeout(bulleMinuterie);
    bulleMinuterie = setTimeout(cacherBulle, 9000);
  }
  function cacherBulle() { $("[data-bulle]").hidden = true; }
  // Types d'annotation : indication (blanche), précaution (rouge), « Évaluer l'élève » (orange, en début de séance)
  // et « Bilan » (sombre, en fin de séance). Les deux derniers partent d'une trame à compléter.
  var TYPES_NOTE = [["Indication", false, ""], ["Précaution", true, ""], ["Évaluer l’élève", false, "evaluer"], ["Bilan", false, "bilan"]];
  var TRAMES = {
    evaluer: "Évaluer l’élève\nSon vécu : \nCe qu’il sait ou croit savoir : \nSon état d’esprit : \nAdapter la séance : ",
    bilan: "Bilan : A, ECA ou NT\nCritères de la situation finale : \nÀ retravailler : "
  };
  function genreNote(n) { return n.type === "evaluer" ? "évaluer l’élève" : n.type === "bilan" ? "bilan" : n.rouge ? "précaution" : "indication"; }
  function ajouterNote(type) {
    var trame = TRAMES[type] || "", grande = !!trame;
    var m = centreVue(), n = { u: uid(), texte: trame, rouge: false, x: Math.round(m.x - (grande ? 150 : 100)), y: Math.round(m.y - (grande ? 70 : 44)), l: grande ? 300 : 200, h: grande ? 140 : 88 };
    if (type) n.type = type;
    modifier(function () { seance.notes.push(n); sel = { k: "note", u: n.u }; edition = { u: n.u, nouveau: true, avant: trame }; });
    annoncer((type === "evaluer" ? "Carte « Évaluer l’élève » ajoutée" : type === "bilan" ? "Carte « Bilan » ajoutée" : "Annotation ajoutée") + ". Tape ton texte, puis Échap.");
  }
  function ajouterCadre() {
    var m = centreVue(), f = { u: uid(), titre: "Nouveau cadre", x: Math.round(m.x - 260), y: Math.round(m.y - 160), l: 520, h: 320 };
    modifier(function () { seance.cadres.push(f); rattacher(); sel = { k: "cadre", u: f.u }; edition = { u: f.u, nouveau: true }; });
    annoncer("Cadre ajouté. Tape son titre, puis Entrée.");
  }
  function relier(a, b) {
    if (a === b) return false;
    var A = trouver(a), B = trouver(b);
    if (!A || !B || A.k === "lien" || B.k === "lien" || A.k === "cadre" || B.k === "cadre") return false;
    if (A.k === "note" && B.k === "note") { annoncer("Une annotation se relie à une carte."); return false; }
    if (seance.liens.some(function (l) { return (l.a === a && l.b === b) || (l.a === b && l.b === a); })) { annoncer("Ces deux éléments sont déjà reliés."); return false; }
    var l = { u: uid(), a: a, b: b };
    modifier(function () { seance.liens.push(l); });
    var info = analyser(l);
    annoncer(info.note ? "Annotation reliée." : info.enchainement ? "Enchaînement créé." : "Lien créé" + (info.cas ? ", à vérifier : " + phrase(info) : "."));
    return true;
  }
  function supprimer(u) {
    var t = trouver(u); if (!t) return;
    var libelle = t.k === "carte" ? "Carte retirée du tableau." : t.k === "note" ? "Annotation supprimée." : t.k === "cadre" ? "Cadre supprimé. Ses cartes restent sur le tableau." : "Lien supprimé.";
    modifier(function () {
      if (t.k === "carte") seance.cartes = seance.cartes.filter(function (o) { return o.u !== u; });
      if (t.k === "note") seance.notes = seance.notes.filter(function (o) { return o.u !== u; });
      if (t.k === "cadre") { seance.cadres = seance.cadres.filter(function (o) { return o.u !== u; }); rattacher(); }
      seance.liens = seance.liens.filter(function (l) { return l.u !== u && l.a !== u && l.b !== u; });
      if (sel && sel.u === u) sel = null;
      if (relierDepuis === u) relierDepuis = null;
    });
    annoncer(libelle);
    fond.focus({ preventScroll: true });
  }
  function commencerRelier(u) {
    relierDepuis = u;
    details.classList.remove("est-complet");
    rendre();
    annoncer("Choisis la carte à relier. Échap pour annuler.");
    if (!tablette.matches) {
      var autre = seance.cartes.filter(function (pc) { return pc.u !== u; })[0];
      if (autre) focaliser(autre.u);
    }
  }
  function annulerRelier() { if (relierDepuis) { relierDepuis = null; rendre(); annoncer("Lien annulé."); } }

  /* ---------- Édition des annotations et des cadres ---------- */
  function commencerEdition(u) {
    var t = trouver(u); if (!t) return;
    edition = { u: u, avant: t.k === "note" ? t.o.texte : t.o.titre };
    rendre();
  }
  function finirEdition(garder) {
    if (!edition) return;
    var t = trouver(edition.u), e = edition;
    edition = null;
    if (t) {
      var champ = $("[data-u=\"" + e.u + "\"] textarea, [data-u=\"" + e.u + "\"] input", monde);
      var valeur = champ ? champ.value : null;
      if (t.k === "cadre" && valeur !== null) valeur = valeur.trim() || e.avant || "Nouveau cadre";
      var cle = t.k === "note" ? "texte" : "titre";
      if (garder && valeur !== null && valeur !== e.avant) {
        if (e.nouveau) { t.o[cle] = valeur; apresModif(); }
        else modifier(function () { t.o[cle] = valeur; });
      } else rendre();
    } else rendre();
    focaliser(e.u);
  }
  monde.addEventListener("keydown", function (ev) {
    if (!edition) return;
    var t = ev.target;
    if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); finirEdition(true); }
    else if (t.tagName === "INPUT" && ev.key === "Enter") { ev.preventDefault(); finirEdition(true); }
    ev.stopPropagation();
  });
  monde.addEventListener("focusout", function (ev) {
    if (edition && (ev.target.tagName === "TEXTAREA" || ev.target.tagName === "INPUT")) setTimeout(function () { if (edition) finirEdition(true); }, 0);
  });

  /* ---------- Gestes sur le tableau ---------- */
  var geste = null, pointeurs = {}, pince = null;
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  fond.addEventListener("pointerdown", function (ev) {
    if (ev.button > 0 || edition && ev.target.closest(".cv-note__saisie, .cv-cadre__saisie")) return;
    cacherBulle();
    pointeurs[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    var ids = Object.keys(pointeurs);
    if (ids.length === 2) {
      // Pincement : on abandonne le geste en cours et on zoome entre les deux doigts.
      if (geste && geste.trace) geste.trace.remove();
      if (geste && geste.avant) { restaurer(geste.avant); rendre(); }
      geste = null;
      var a = pointeurs[ids[0]], b = pointeurs[ids[1]];
      pince = { d: distance(a, b), s: vue.s, x: vue.x, y: vue.y, m: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
      return;
    }
    if (ids.length > 2) return;
    if (edition) finirEdition(true);
    try { fond.setPointerCapture(ev.pointerId); } catch (e) { /* pointeur déjà relâché */ }
    var cible = ev.target.closest("[data-u]"), u = cible && cible.getAttribute("data-u");
    var t = u ? trouver(u) : null;
    var m = versMonde(ev.clientX, ev.clientY);
    geste = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, m0: m, bouge: false, u: u, t: t, cible: ev.target };
    if (ev.target.hasAttribute("data-poignee") && t && !relierDepuis) {
      geste.mode = "lien";
    } else if (ev.target.hasAttribute("data-taille") && t) {
      geste.mode = "taille"; geste.dir = ev.target.getAttribute("data-taille");
      geste.r0 = { x: t.o.x, y: t.o.y, l: t.o.l, h: t.o.h };
    } else if (t && t.k === "carte") {
      geste.mode = "carte"; geste.p0 = { x: t.o.x, y: t.o.y };
    } else if (t && t.k === "note") {
      geste.mode = "note"; geste.p0 = { x: t.o.x, y: t.o.y };
    } else if (t && t.k === "cadre" && ev.target.hasAttribute("data-titre-cadre")) {
      geste.mode = "cadre"; geste.p0 = { x: t.o.x, y: t.o.y };
      geste.membres = membresCadre(t.o).map(function (o) { return { o: o, x: o.x, y: o.y }; });
    } else if (t && t.k === "lien") {
      geste.mode = "clic";
    } else {
      geste.mode = "fond"; geste.v0 = { x: vue.x, y: vue.y };
    }
  });

  fond.addEventListener("pointermove", function (ev) {
    if (pointeurs[ev.pointerId]) pointeurs[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    if (pince) {
      var ids = Object.keys(pointeurs); if (ids.length < 2) return;
      var a = pointeurs[ids[0]], b = pointeurs[ids[1]], r = fond.getBoundingClientRect();
      var s = Math.max(ZMIN, Math.min(ZMAX, pince.s * distance(a, b) / pince.d));
      var mx = (a.x + b.x) / 2 - r.left, my = (a.y + b.y) / 2 - r.top, m0x = pince.m.x - r.left, m0y = pince.m.y - r.top;
      vue.s = s; vue.x = mx - (m0x - pince.x) * s / pince.s; vue.y = my - (m0y - pince.y) * s / pince.s;
      appliquerVue();
      return;
    }
    if (!geste || ev.pointerId !== geste.id) return;
    var dx = ev.clientX - geste.x0, dy = ev.clientY - geste.y0;
    if (!geste.bouge && Math.hypot(dx, dy) < 4) return;
    var premier = !geste.bouge;
    geste.bouge = true;
    var wx = dx / vue.s, wy = dy / vue.s;
    if (geste.mode === "fond") {
      fond.classList.add("est-glisse");
      vue.x = geste.v0.x + dx; vue.y = geste.v0.y + dy; appliquerVue();
    } else if (geste.mode === "carte" || geste.mode === "note" || geste.mode === "cadre") {
      if (premier) {
        geste.avant = instantane();
        fond.classList.add("est-glisse");
        if (!sel || sel.u !== geste.u) { sel = { k: geste.t.k, u: geste.u }; rendre(); }
        selbar.hidden = true;
      }
      geste.t.o.x = Math.round(geste.p0.x + wx); geste.t.o.y = Math.round(geste.p0.y + wy);
      var e = $("[data-u=\"" + geste.u + "\"]", monde);
      if (e) { e.style.left = geste.t.o.x + "px"; e.style.top = geste.t.o.y + "px"; }
      if (geste.mode === "cadre") geste.membres.forEach(function (m) {
        m.o.x = Math.round(m.x + wx); m.o.y = Math.round(m.y + wy);
        var me = $("[data-u=\"" + m.o.u + "\"]", monde); if (me) { me.style.left = m.o.x + "px"; me.style.top = m.o.y + "px"; }
      });
      if (geste.mode === "carte") {
        var f = cadreSous(geste.t.o.x + CL / 2, geste.t.o.y + CH / 2);
        $$(".cv-cadre", monde).forEach(function (c) { c.classList.toggle("est-cible", !!f && c.getAttribute("data-u") === f.u); });
      }
      rendreLiens();
    } else if (geste.mode === "taille") {
      if (premier) geste.avant = instantane();
      var o = geste.t.o, r0 = geste.r0, d = geste.dir, mini = geste.t.k === "note" ? { l: 120, h: 56 } : { l: 240, h: 140 };
      if (d.indexOf("e") >= 0 || d === "se") o.l = Math.max(mini.l, Math.round(r0.l + wx));
      if (d.indexOf("s") >= 0) o.h = Math.max(mini.h, Math.round(r0.h + wy));
      if (d.indexOf("o") >= 0) { var l = Math.max(mini.l, Math.round(r0.l - wx)); o.x = r0.x + r0.l - l; o.l = l; }
      if (d.indexOf("n") >= 0) { var h = Math.max(mini.h, Math.round(r0.h - wy)); o.y = r0.y + r0.h - h; o.h = h; }
      var te = $("[data-u=\"" + geste.u + "\"]", monde);
      if (te) { te.style.left = o.x + "px"; te.style.top = o.y + "px"; te.style.width = o.l + "px"; te.style.height = o.h + "px"; }
      rendreLiens();
    } else if (geste.mode === "lien") {
      fond.classList.add("est-glisse");
      var p = versMonde(ev.clientX, ev.clientY);
      if (!geste.trace) { geste.trace = svg("path", { "class": "cv-trace-geste" }); calqueLiens.appendChild(geste.trace); }
      var b = bord(rect(geste.t.o, geste.t.k), p);
      geste.trace.setAttribute("d", "M" + r1(b.x) + "," + r1(b.y) + " L" + r1(p.x) + "," + r1(p.y));
      var sous = document.elementFromPoint(ev.clientX, ev.clientY), c2 = sous && sous.closest(".cv-carte, .cv-note");
      $$(".est-cible", monde).forEach(function (x) { x.classList.remove("est-cible"); });
      if (c2 && c2.getAttribute("data-u") !== geste.u) c2.classList.add("est-cible");
    }
  });

  function finGeste(ev) {
    if (pointeurs[ev.pointerId]) delete pointeurs[ev.pointerId];
    if (pince) { if (Object.keys(pointeurs).length < 2) { pince = null; programmerVue(); } return; }
    if (!geste || ev.pointerId !== geste.id) return;
    var g = geste; geste = null;
    fond.classList.remove("est-glisse");
    $$(".est-cible", monde).forEach(function (x) { x.classList.remove("est-cible"); });
    if (ev.type === "pointercancel") { if (g.trace) g.trace.remove(); if (g.avant) { restaurer(g.avant); rendre(); } return; }
    if (!g.bouge) { clic(g); return; }
    if (g.mode === "fond") { programmerVue(); return; }
    if (g.mode === "lien") {
      if (g.trace) g.trace.remove();
      var sous = document.elementFromPoint(ev.clientX, ev.clientY), c2 = sous && sous.closest(".cv-carte, .cv-note");
      if (c2) relier(g.u, c2.getAttribute("data-u"));
      return;
    }
    if (g.avant) {
      // Le geste est déjà appliqué : on l'inscrit dans l'historique avec l'état d'avant.
      var h = histo(); h.pile.push(g.avant); if (h.pile.length > HISTO) h.pile.shift(); h.refaire = []; h.derniere = null;
      if (g.mode === "carte") { var f = cadreSous(g.t.o.x + CL / 2, g.t.o.y + CH / 2); g.t.o.f = f ? f.u : null; }
      if (g.mode === "cadre" || (g.mode === "taille" && g.t.k === "cadre")) rattacher();
      apresModif();
      focaliser(g.u);
    }
  }
  fond.addEventListener("pointerup", finGeste);
  fond.addEventListener("pointercancel", finGeste);

  var dernierClic = { u: null, t: 0 };
  function clic(g) {
    var maintenant = Date.now(), double = dernierClic.u === g.u && maintenant - dernierClic.t < 400;
    dernierClic = { u: g.u, t: maintenant };
    if (relierDepuis) {
      if (g.t && (g.t.k === "carte" || g.t.k === "note") && g.u !== relierDepuis) {
        var depuis = relierDepuis; relierDepuis = null;
        if (!relier(depuis, g.u)) rendre();
      } else annulerRelier();
      return;
    }
    if (!g.t) { choisir(null); fond.focus({ preventScroll: true }); return; }
    if (double && g.t.k === "note") { choisir(g.u); commencerEdition(g.u); return; }
    if (double && g.t.k === "cadre" && g.cible.hasAttribute("data-titre-cadre")) { choisir(g.u); commencerEdition(g.u); return; }
    choisir(g.u);
    focaliser(g.u);
  }
  fond.addEventListener("dblclick", function (ev) { ev.preventDefault(); });

  fond.addEventListener("wheel", function (ev) {
    ev.preventDefault();
    var r = fond.getBoundingClientRect(), dy = ev.deltaY * (ev.deltaMode === 1 ? 16 : 1);
    zoomer(Math.exp(-dy * (ev.ctrlKey ? 0.01 : 0.0015)), ev.clientX - r.left, ev.clientY - r.top);
  }, { passive: false });

  fond.addEventListener("focusin", function (ev) {
    var e = ev.target.closest("[data-u]");
    if (e && !geste && (!sel || sel.u !== e.getAttribute("data-u"))) {
      var t = trouver(e.getAttribute("data-u"));
      sel = t ? { k: t.k, u: t.o.u } : null;
      $$(".est-choisi", monde).forEach(function (x) { x.classList.remove("est-choisi"); });
      e.classList.add("est-choisi");
      voirSuite = {};
      rendrePalette(); rendreDetails(); majSignaler();
      rendreLiens();
    }
  });

  /* ---------- Clavier ---------- */
  document.addEventListener("keydown", function (ev) {
    if (document.querySelector("dialog[open]")) return;
    var t = ev.target, saisie = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
    var mod = ev.metaKey || ev.ctrlKey;
    if (mod && (ev.key === "z" || ev.key === "Z") && !saisie) { ev.preventDefault(); if (ev.shiftKey) retablir(); else annuler(); return; }
    if (mod && (ev.key === "y" || ev.key === "Y") && !saisie) { ev.preventDefault(); retablir(); return; }
    if (saisie) return;
    var dansTableau = tableau.contains(t);
    if (ev.key === "Escape") {
      if (relierDepuis) { annulerRelier(); return; }
      if (travail.classList.contains("palette-ouverte")) { fermerPalette(); return; }
      if (sel && (dansTableau || details.contains(t))) { choisir(null); fond.focus({ preventScroll: true }); return; }
      return;
    }
    if (!dansTableau || details.contains(t) || t.closest(".cv-outils, .cv-selbar")) return;
    if (ev.key === "+" || ev.key === "=") { ev.preventDefault(); zoomer(1.2); return; }
    if (ev.key === "-") { ev.preventDefault(); zoomer(1 / 1.2); return; }
    if (ev.key === "0") { ev.preventDefault(); ajuster(); return; }
    var fleches = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (fleches[ev.key]) {
      ev.preventDefault();
      var pas = ev.shiftKey ? 1 : 10, d = fleches[ev.key];
      if (sel && sel.k !== "lien") {
        var o = trouver(sel.u).o;
        modifier(function () {
          o.x += d[0] * pas; o.y += d[1] * pas;
          if (sel.k === "cadre") membresCadre(o).forEach(function (m) { m.x += d[0] * pas; m.y += d[1] * pas; });
          if (sel.k === "carte") { var f = cadreSous(o.x + CL / 2, o.y + CH / 2); o.f = f ? f.u : null; }
        }, "fleche-" + sel.u);
      } else { vue.x -= d[0] * 40; vue.y -= d[1] * 40; appliquerVue(); programmerVue(); }
      return;
    }
    if ((ev.key === "Delete" || ev.key === "Backspace") && sel) { ev.preventDefault(); supprimer(sel.u); return; }
    if (ev.key === "Enter" && sel && t.closest("[data-u]")) {
      ev.preventDefault();
      if (relierDepuis) { var dep = relierDepuis; relierDepuis = null; if (!relier(dep, sel.u)) rendre(); return; }
      if (sel.k === "note" || sel.k === "cadre") commencerEdition(sel.u);
      else if (tablette.matches) details.classList.add("est-complet");
    }
  });

  /* ---------- Barre d'outils, pied, boutons ---------- */
  racine.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-action]");
    if (!b || !racine.contains(b)) return;
    var a = b.getAttribute("data-action");
    if (a === "png" || a === "pdf") ev.preventDefault();
    switch (a) {
      case "annotation": ajouterNote(); break;
      case "evaluer": ajouterNote("evaluer"); break;
      case "bilan": ajouterNote("bilan"); break;
      case "cadre": ajouterCadre(); break;
      case "annuler": annuler(); break;
      case "retablir": retablir(); break;
      case "moins": zoomer(1 / 1.2); break;
      case "plus": zoomer(1.2); break;
      case "ajuster": ajuster(); break;
      case "recentrer": recentrer(); break;
      case "plein": pleinEcran(); break;
      case "vider": if (!estVide(seance)) ouvrirConfirmation($("[data-fenetre-vider]"), function () { modifier(function () { seance.cartes = []; seance.liens = []; seance.notes = []; seance.cadres = []; sel = null; relierDepuis = null; }); annoncer("Tableau vidé. « Annuler » le rétablit."); }); break;
      case "enregistrer":
        clearTimeout(minuterie); minuterie = null;
        if (!aGarder(seance) && store.seances.indexOf(seance) < 0) { annoncer("La séance est vide : rien à enregistrer pour l’instant."); break; }
        if (aGarder(seance)) seance.modifiee = Date.now();
        ecrireStore(); annoncer(etat === "ok" ? "Séance enregistrée." : "La séance n’a pas pu être enregistrée."); break;
      case "seances": ouvrirSeances(); break;
      case "supprimer-seance": vider(); actionSeance("supprimer", seance); break;
      case "nouvelle": nouvelleSeance(); break;
      case "cartes": if (travail.classList.contains("palette-ouverte")) fermerPalette(); else ouvrirPalette(); break;
      case "relier": if (sel) commencerRelier(sel.u); break;
      case "details": details.classList.add("est-complet"); break;
      case "png": telechargerPng(); break;
      case "pdf": $("[data-fenetre-imprimer]").showModal(); break;
    }
  });

  function pleinEcran() {
    var dedans = document.fullscreenElement || document.webkitFullscreenElement;
    if (dedans) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    // La palette et le tableau passent ensemble en plein écran : on continue à poser les cartes du niveau.
    var f = travail.requestFullscreen || travail.webkitRequestFullscreen;
    if (f) f.call(travail);
  }

  /* ---------- Palette ---------- */
  function ouvrirPalette() {
    travail.classList.add("palette-ouverte"); voile.hidden = false;
    $("[data-action=\"cartes\"]").setAttribute("aria-expanded", "true");
    var o = $("[data-groupes] [aria-selected=\"true\"]"); if (o) o.focus();
  }
  function fermerPalette() {
    if (!travail.classList.contains("palette-ouverte")) return;
    travail.classList.remove("palette-ouverte"); voile.hidden = true;
    $("[data-action=\"cartes\"]").setAttribute("aria-expanded", "false");
  }
  voile.addEventListener("click", fermerPalette);
  tablette.addEventListener("change", function () { fermerPalette(); details.classList.remove("est-complet"); rendre(); });

  function rendreOnglets() {
    var zone = $("[data-groupes]"); zone.textContent = "";
    jeu.groupes.forEach(function (g, i) {
      var b = el("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.id = "cv-onglet-" + i;
      b.setAttribute("aria-selected", i === onglet ? "true" : "false");
      b.tabIndex = i === onglet ? 0 : -1;
      if (libelleOnglet(g) !== g) { b.title = g; b.setAttribute("aria-label", g + ", " + pluriel(compte(i), "carte", "cartes")); }
      b.innerHTML = "<span>" + echapper(libelleOnglet(g)) + "</span><span class=\"cv-groupes__nb\">" + compte(i) + "</span>";
      b.addEventListener("click", function () { choisirOnglet(i); });
      zone.appendChild(b);
    });
    $("[data-liste]").setAttribute("aria-labelledby", "cv-onglet-" + onglet);
  }
  function compte(g) { return jeu.cartes.filter(function (c) { return c.g === g; }).length; }
  function choisirOnglet(i) {
    onglet = i; rendreOnglets(); rendrePalette();
    var b = $("#cv-onglet-" + i); if (b) b.focus();
  }
  $("[data-groupes]").addEventListener("keydown", function (ev) {
    var n = jeu.groupes.length, i = onglet;
    if (ev.key === "ArrowRight") i = (onglet + 1) % n; else if (ev.key === "ArrowLeft") i = (onglet + n - 1) % n;
    else if (ev.key === "Home") i = 0; else if (ev.key === "End") i = n - 1; else return;
    ev.preventDefault(); choisirOnglet(i);
  });
  $("[data-recherche]").addEventListener("input", function (ev) { recherche = sansAccents(ev.target.value.trim()); rendrePalette(); });
  $("[data-filtre]").addEventListener("change", function (ev) { filtre = ev.target.value; rendreFiltre(); rendrePalette(); var r = $("[data-filtre-retirer]"); if (filtre) r.focus(); });
  $("[data-filtre-retirer]").addEventListener("click", function () { filtre = ""; rendreFiltre(); rendrePalette(); $("[data-filtre]").focus(); });

  function nomFiltre() { var n = jeu.noms[0].un; return n.charAt(0).toUpperCase() + n.slice(1); }
  function rendreFiltre() {
    var s = $("[data-filtre]"), comps = jeu.cartes.filter(function (c) { return c.g === 0 && !c.libre; });
    s.textContent = "";
    var o = el("option", null, toutes(jeu.groupes[0])); o.value = ""; s.appendChild(o);
    comps.forEach(function (c) { var x = el("option", null, c.titre); x.value = c.id; s.appendChild(x); });
    s.value = filtre;
    $(".cv-filtre__menu").hidden = !!filtre;
    $("[data-filtre-pastille]").hidden = !filtre;
    if (filtre) $("[data-filtre-nom]").textContent = nomFiltre() + " : " + nomComp(filtre);
  }
  function correspond(c) {
    if (filtre) {
      if (c.g === 0 && c.id !== filtre) return false;
      if (c.g > 0 && c.comp !== filtre && !(c.cite && c.cite.indexOf(filtre) >= 0)) return false;
    }
    if (recherche) {
      var texte = [c.code, c.titre, c.repere, c.note, c.rubrique, (c.etiquettes || []).join(" "), (c.texte || []).map(function (r) { return r.titre + " " + r.texte; }).join(" ")].join(" ");
      return sansAccents(texte).indexOf(recherche) >= 0;
    }
    return true;
  }
  function domMini(c, suggeree) {
    var li = el("li", "cv-mini" + (c.type === "theorie" ? " cv-mini--theorie" : "") + (suggeree ? " cv-mini--suggeree" : ""));
    li.setAttribute("data-carte", c.id);
    var coul = c.type === "theorie" ? "#B9C4CF" : couleurDe(c), n = poses(c.id);
    li.innerHTML = "<span class=\"cv-mini__liseret\" style=\"background:" + coul + "\"></span><span class=\"cv-mini__corps\"><span class=\"cv-mini__ligne\"><span class=\"cv-mini__code\">" + echapper(c.code) + "</span>" +
      (n ? "<span class=\"cv-mini__pose\" title=\"Déjà posée sur le tableau\">×" + n + "</span>" : "") + "</span><span class=\"cv-mini__titre\">" + echapper(c.titre) + "</span></span>" +
      "<button type=\"button\" class=\"cv-mini__ajout\" aria-label=\"Ajouter au tableau : " + echapper(c.titre) + "\">" + icone("plus", 18) + "</button>";
    return li;
  }
  function suggestionsPour() {
    if (!sel || sel.k !== "carte") return null;
    var c = carteDe(trouver(sel.u).o);
    return c && c.type === "competence" && !c.libre ? c : null;
  }
  function rendrePalette() {
    if (!jeu) return;
    var liste = $("[data-liste]"), haut = liste.scrollTop, focusCarte = document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-carte]");
    var focusId = focusCarte && liste.contains(focusCarte) ? focusCarte.getAttribute("data-carte") : null;
    liste.textContent = "";
    var comp = suggestionsPour();
    if (comp) {
      var parGroupe = [];
      for (var g = 1; g < jeu.groupes.length; g++) {
        var cartes = jeu.cartes.filter(function (c) { return c.g === g && (c.comp === comp.id || (c.cite && c.cite.indexOf(comp.id) >= 0)); });
        if (cartes.length) parGroupe.push({ g: g, cartes: cartes });
      }
      if (parGroupe.length) {
        var boite = el("div", "cv-suggestions");
        boite.innerHTML = "<span class=\"cv-suggestions__titre\">" + icone("etincelle", 16) + "Pour " + echapper(guillemets(comp.titre)) + "</span>";
        var morceaux = parGroupe.map(function (p) { var nm = jeu.noms[p.g]; return pluriel(p.cartes.length, nm.un, nm.plusieurs); });
        var total = parGroupe.reduce(function (a, p) { return a + p.cartes.length; }, 0);
        boite.appendChild(el("span", "cv-suggestions__texte", listeEt(morceaux) + (total > 1 ? " vont" : " va") + " avec " + cette(jeu.noms[0]).toLowerCase() + "."));
        parGroupe.forEach(function (p) {
          boite.appendChild(el("span", "cv-eyebrow", jeu.groupes[p.g]));
          var ul = el("ul"), tout = voirSuite[p.g];
          p.cartes.slice(0, tout ? p.cartes.length : 3).forEach(function (c) { ul.appendChild(domMini(c, true)); });
          if (!tout && p.cartes.length > 3) {
            var reste = p.cartes.length - 3, nm = jeu.noms[p.g];
            var li = el("li", "cv-suite"), b = el("button", null, reste > 1 ? "Voir les " + reste + " autres " + nm.plusieurs : "Voir la 4ᵉ " + nm.un);
            if (!nm.f && reste === 1) b.textContent = "Voir le 4ᵉ " + nm.un;
            b.type = "button";
            b.addEventListener("click", function () { voirSuite[p.g] = true; rendrePalette(); });
            li.appendChild(b); ul.appendChild(li);
          }
          boite.appendChild(ul);
        });
        liste.appendChild(boite);
        liste.appendChild(el("span", "cv-eyebrow", toutes(jeu.groupes[onglet])));
      }
    }
    var ul2 = el("ul"), n = 0;
    jeu.cartes.forEach(function (c) { if (c.g === onglet && correspond(c)) { ul2.appendChild(domMini(c)); n++; } });
    if (n) liste.appendChild(ul2);
    else liste.appendChild(el("p", "cv-liste__vide", "Aucune carte ne correspond."));
    liste.scrollTop = haut;
    if (focusId) { var f = $("[data-carte=\"" + focusId + "\"] .cv-mini__ajout", liste); if (f) f.focus({ preventScroll: true }); }
  }

  // Ajout par « + », ou glisser-déposer (souris, stylet ou doigt) vers le tableau.
  var glisse = null;
  $("[data-liste]").addEventListener("click", function (ev) {
    var b = ev.target.closest(".cv-mini__ajout");
    if (b) poser(b.closest("[data-carte]").getAttribute("data-carte"), undefined, undefined, true);
  });
  $("[data-liste]").addEventListener("pointerdown", function (ev) {
    var li = ev.target.closest(".cv-mini");
    if (!li || ev.target.closest("button") || ev.button > 0) return;
    glisse = { id: ev.pointerId, li: li, x0: ev.clientX, y0: ev.clientY, actif: false, tactile: ev.pointerType !== "mouse" };
    if (!glisse.tactile) ev.preventDefault();
  });
  document.addEventListener("pointermove", function (ev) {
    if (!glisse || ev.pointerId !== glisse.id) return;
    var dx = ev.clientX - glisse.x0, dy = ev.clientY - glisse.y0;
    if (!glisse.actif) {
      if (Math.hypot(dx, dy) < 6) return;
      if (glisse.tactile && Math.abs(dy) > Math.abs(dx)) { glisse = null; return; }   // défilement de la liste
      glisse.actif = true;
      var f = glisse.li.cloneNode(true); f.classList.add("cv-fantome"); f.removeAttribute("data-carte");
      document.body.appendChild(f); glisse.fantome = f;
      try { glisse.li.setPointerCapture(ev.pointerId); } catch (e) { /* rien */ }
      if (tablette.matches) fermerPalette();
    }
    ev.preventDefault();
    glisse.fantome.style.left = (ev.clientX - 20) + "px"; glisse.fantome.style.top = (ev.clientY - 20) + "px";
  });
  function finGlisse(ev) {
    if (!glisse || ev.pointerId !== glisse.id) return;
    var g = glisse; glisse = null;
    if (!g.actif) return;
    g.fantome.remove();
    var r = fond.getBoundingClientRect();
    if (ev.type === "pointerup" && ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
      var m = versMonde(ev.clientX, ev.clientY);
      poser(g.li.getAttribute("data-carte"), m.x - CL / 2, m.y - CH / 2);
    } else if (tablette.matches) fermerPalette();
  }
  document.addEventListener("pointerup", finGlisse);
  document.addEventListener("pointercancel", finGlisse);

  /* ---------- Panneau de détails ---------- */
  function rendreDetails() {
    details.textContent = "";
    var t = sel ? trouver(sel.u) : null;
    details.hidden = !t;
    placerSelbar();
    if (!t) return;
    var titres = { carte: "Carte", note: "Annotation", cadre: "Cadre", lien: "Lien" }, c = t.k === "carte" ? carteDe(t.o) : null;
    var nomSur = t.k === "carte" && c ? (c.type === "competence" ? { un: surLigne(c), f: c.libre || jeu.noms[0].f } : c.type === "technique" ? jeu.noms[1] : (jeu.noms[c.g] || jeu.noms[2])) : { un: titres[t.k], f: t.k === "carte" || t.k === "note" };
    var sur = nomSur.un.charAt(0).toUpperCase() + nomSur.un.slice(1);
    if (detailsPour !== sel.u) { detailsPour = sel.u; details.classList.remove("est-complet"); }
    details.setAttribute("aria-label", "Détails : " + sur.toLowerCase());
    var poignee = el("button", "cv-poignee-tiroir"); poignee.type = "button"; poignee.setAttribute("aria-label", "Tout afficher ou réduire");
    poignee.addEventListener("click", function () { details.classList.toggle("est-complet"); });
    poignee.addEventListener("pointerdown", tirerTiroir);
    details.appendChild(poignee);
    var complet = el("div", "cv-details__complet");
    var tete = el("div", "cv-details__tete");
    tete.innerHTML = "<span class=\"cv-eyebrow\">" + echapper(sur) + " · sélectionné" + (nomSur.f ? "e" : "") + "</span>";
    var fermer = el("button", "cv-outil"); fermer.type = "button"; fermer.setAttribute("aria-label", "Fermer le panneau"); fermer.innerHTML = icone("croix", 16);
    fermer.addEventListener("click", function () { choisir(null); fond.focus({ preventScroll: true }); });
    tete.appendChild(fermer);
    complet.appendChild(tete);
    var avertissements = [];
    if (t.k === "carte") {
      seance.liens.forEach(function (l) { if (l.a !== t.o.u && l.b !== t.o.u) return; var info = analyser(l); if (info && info.cas) avertissements.push(phrase(info, c)); });
      contenuCarte(complet, t.o, c, avertissements);
    } else if (t.k === "lien") contenuLien(complet, t.o);
    else if (t.k === "note") contenuNote(complet, t.o);
    else contenuCadre(complet, t.o);
    details.appendChild(complet);
    if (t.k === "carte") details.appendChild(resumeCarte(t.o, c, avertissements));
    else details.classList.add("est-complet");
  }
  function bouton(texte, ico, cls, fn) {
    var b = el("button", "cv-btn cv-btn--petit" + (cls ? " " + cls : "")); b.type = "button";
    b.innerHTML = (ico ? icone(ico, 16) : "") + echapper(texte);
    b.addEventListener("click", fn);
    return b;
  }
  function boutonsCarte(pc) {
    var z = el("div", "cv-details__boutons");
    z.appendChild(bouton("Relier à une autre carte", "relier", "", function () { commencerRelier(pc.u); }));
    z.appendChild(bouton("Supprimer du tableau", "corbeille", "cv-btn--rouge-contour", function () { supprimer(pc.u); }));
    return z;
  }
  function boiteAvert(textes) {
    var b = el("div", "cv-avert");
    b.innerHTML = "<span class=\"cv-avert__titre\">" + icone("alerte", 16) + "Lien à vérifier</span>";
    textes.forEach(function (x) { b.appendChild(el("span", "cv-avert__texte", x)); });
    return b;
  }
  function dl(paires) {
    var d = el("dl", "cv-dl");
    paires.forEach(function (p) { d.appendChild(el("dt", null, p[0])); d.appendChild(el("dd", null, p[1])); });
    return d;
  }
  function nbLiens(u) { return seance.liens.filter(function (l) { return l.a === u || l.b === u; }).length; }
  function contenuCarte(z, pc, c, avert) {
    var corps;
    if (!c) {
      z.appendChild(bandeauDetails("Carte retirée du jeu", pc.c, null));
      corps = el("div", "cv-details__corps");
      corps.appendChild(el("h3", "cv-details__titre", pc.t || pc.c));
      corps.appendChild(el("p", "cv-details__texte", "Cette carte n’existe plus dans le jeu à jour, ou elle a changé de numéro. Retire-la et pose la carte actuelle depuis la palette."));
      corps.appendChild(boutonsCarte(pc));
      z.appendChild(corps); return;
    }
    if (c.type === "competence") {
      var plein = el("div", "cv-details__plein"); plein.style.background = c.couleur;
      plein.appendChild(el("span", "cv-details__code", c.code));
      plein.appendChild(el("h3", "cv-details__titre", c.titre));
      z.appendChild(plein);
      corps = el("div", "cv-details__corps cv-details__corps--serre");
      c.texte.forEach(function (r) {
        var bloc = el("div", "cv-details__rubrique");
        if (r.titre) bloc.appendChild(el("span", "cv-eyebrow", r.titre));
        var items = r.texte.split(/\s;\s/);
        if (items.length > 1) { var ul = el("ul"); items.forEach(function (i) { ul.appendChild(el("li", null, i.replace(/\.$/, ""))); }); bloc.appendChild(ul); }
        else bloc.appendChild(el("p", null, r.texte));
        corps.appendChild(bloc);
      });
      if (avert.length) corps.appendChild(boiteAvert(avert));
      var n = nbLiens(pc.u);
      corps.appendChild(dl([["Groupe", jeu.groupes[c.g]], ["Liens", n ? pluriel(n, "lien", "liens") : "aucun pour l’instant"]]));
      var fiche = fiches[jeu.id + "/" + c.id];
      if (fiche) {
        var lienFiche = el("a", "cv-btn cv-btn--petit");
        lienFiche.href = base + "construire/?competence=" + encodeURIComponent(fiche.toLowerCase());
        lienFiche.innerHTML = icone("crayon", 16) + "Rédiger la fiche";
        corps.appendChild(lienFiche);
      }
    } else {
      z.appendChild(bandeauDetails(c.type === "technique" ? nomComp(c.comp) : (c.bandeau || "Théorie · " + c.rubrique), c.code, couleurDe(c)));
      corps = el("div", "cv-details__corps");
      corps.appendChild(el("h3", "cv-details__titre", c.titre));
      var texte = c.repere || c.note;
      if (texte) corps.appendChild(el("p", "cv-details__texte", texte));
      if (c.type === "theorie" && c.cite) {
        var bloc2 = el("div", "cv-details__rubrique");
        bloc2.appendChild(el("span", "cv-eyebrow", "Compétences"));
        bloc2.appendChild(el("p", "cv-details__texte", c.cite.map(function (id) { return nomComp(id); }).join(" · ")));
        corps.appendChild(bloc2);
      }
      if (c.etiquettes && c.etiquettes.length) {
        var et = el("div", "cv-etiquettes");
        c.etiquettes.forEach(function (x) { et.appendChild(el("span", "cv-etiquette", x)); });
        corps.appendChild(et);
      }
      if (avert.length) corps.appendChild(boiteAvert(avert));
      var p = poses(c.id);
      corps.appendChild(dl([["Groupe", jeu.groupes[c.g]], ["Sur le tableau", "posée " + p + " fois"]]));
    }
    corps.appendChild(boutonsCarte(pc));
    z.appendChild(corps);
  }
  function bandeauDetails(gauche, droite, couleur) {
    var b = el("div", "cv-details__bandeau" + (couleur ? "" : " cv-details__bandeau--theorie"));
    if (couleur) b.style.background = couleur;
    b.appendChild(el("span", null, gauche)); b.appendChild(el("span", null, droite));
    return b;
  }
  function contenuLien(z, l) {
    var info = analyser(l), corps = el("div", "cv-details__corps");
    var de = info.note ? info.note : info.de, vers = info.note ? (info.note === info.de ? info.vers : info.de) : info.vers;
    corps.appendChild(el("p", "cv-details__texte", info.note ? "Annotation reliée à " + guillemets(nomCarte(vers)) + "." : info.enchainement ? "Enchaînement : " + guillemets(nomCarte(de)) + " puis " + guillemets(nomCarte(vers)) + "." : "De " + guillemets(nomCarte(de)) + " vers " + guillemets(nomCarte(vers)) + "."));
    if (info.cas) corps.appendChild(boiteAvert([phrase(info)]));
    var z2b = el("div", "cv-details__boutons");
    z2b.appendChild(bouton("Supprimer le lien", "corbeille", "cv-btn--rouge-contour", function () { supprimer(l.u); }));
    corps.appendChild(z2b);
    z.appendChild(corps);
  }
  function contenuNote(z, n) {
    var corps = el("div", "cv-details__corps");
    var lab = el("div", "cv-details__libelle"); lab.appendChild(el("span", null, "Type"));
    var seg = el("span", "cv-seg cv-seg--grille"); seg.setAttribute("role", "radiogroup"); seg.setAttribute("aria-label", "Type d’annotation");
    TYPES_NOTE.forEach(function (p) {
      var actif = (n.type || "") === p[2] && (p[2] || !!n.rouge === p[1]);
      var b = el("button", null, p[0]); b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", actif ? "true" : "false");
      b.addEventListener("click", function () {
        if ((n.type || "") === p[2] && (p[2] || !!n.rouge === p[1])) return;
        modifier(function () { n.rouge = p[1]; if (p[2]) n.type = p[2]; else delete n.type; });
        annoncer("Annotation : " + p[0].toLowerCase() + ".");
        var x = $("[data-details] [role=\"radio\"][aria-checked=\"true\"]"); if (x) x.focus();
      });
      seg.appendChild(b);
    });
    lab.appendChild(seg); corps.appendChild(lab);
    var zb = el("div", "cv-details__boutons");
    zb.appendChild(bouton("Supprimer l’annotation", "corbeille", "cv-btn--rouge-contour", function () { supprimer(n.u); }));
    corps.appendChild(zb);
    z.appendChild(corps);
  }
  function contenuCadre(z, f) {
    var corps = el("div", "cv-details__corps");
    var lab = el("label", "cv-details__libelle"); lab.appendChild(el("span", null, "Titre"));
    var i = el("input", "cv-details__champ"); i.value = f.titre; i.maxLength = 120;
    i.addEventListener("change", function () { var v = i.value.trim(); if (v && v !== f.titre) { modifier(function () { f.titre = v; }); focaliser(f.u); } });
    i.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); i.blur(); } });
    lab.appendChild(i); corps.appendChild(lab);
    var zb = el("div", "cv-details__boutons");
    zb.appendChild(bouton("Supprimer le cadre", "corbeille", "cv-btn--rouge-contour", function () { supprimer(f.u); }));
    corps.appendChild(zb);
    z.appendChild(corps);
  }
  // Tablette : résumé du tiroir de détails (maquette TabletteCanvas).
  function resumeCarte(pc, c, avert) {
    var r = el("div", "cv-details__resume"), haut = el("div", "cv-resume__haut"), tx = el("div", "cv-resume__texte");
    var coul = c ? (couleurDe(c) || "#6A7B8C") : "#6A7B8C";
    var surL = el("span", "cv-resume__sur"); surL.style.color = coul;
    var puce = el("span", "cv-resume__puce"); puce.style.background = coul; surL.appendChild(puce);
    surL.appendChild(document.createTextNode((c ? (c.type === "competence" ? surLigne(c) : c.type === "technique" ? nomComp(c.comp) : (c.bandeau || "Théorie · " + c.rubrique)) : "Carte retirée du jeu") + " · "));
    surL.appendChild(el("span", "cv-resume__code", c ? c.code : pc.c));
    tx.appendChild(surL);
    tx.appendChild(el("h3", "cv-resume__titre", c ? c.titre : (pc.t || pc.c)));
    var rep = c ? (c.repere || c.note || (c.texte && c.texte[0] && c.texte[0].texte)) : "Cette carte n’existe plus dans le jeu à jour.";
    if (rep) tx.appendChild(el("p", "cv-resume__repere", rep));
    haut.appendChild(tx);
    if (avert.length) {
      var a = el("div", "cv-resume__avert");
      a.innerHTML = "<strong>" + icone("alerte", 15) + "Lien à vérifier</strong>";
      a.appendChild(document.createTextNode(avert.join(" ")));
      haut.appendChild(a);
    }
    r.appendChild(haut);
    var b = el("div", "cv-resume__boutons");
    var tout = el("button", "cv-btn", "Tout afficher"); tout.type = "button"; tout.addEventListener("click", function () { details.classList.add("est-complet"); });
    var rel = el("button", "cv-btn"); rel.type = "button"; rel.innerHTML = icone("relier", 17) + "Relier à…"; rel.addEventListener("click", function () { commencerRelier(pc.u); });
    var sup = el("button", "cv-btn cv-btn--rouge-contour"); sup.type = "button"; sup.innerHTML = icone("corbeille", 17) + "Supprimer du tableau"; sup.addEventListener("click", function () { supprimer(pc.u); });
    b.appendChild(tout); b.appendChild(rel); b.appendChild(sup);
    r.appendChild(b);
    return r;
  }
  function tirerTiroir(ev) {
    var y0 = ev.clientY, cible = ev.currentTarget, fait = false;
    try { cible.setPointerCapture(ev.pointerId); } catch (e) { /* rien */ }
    function mouvement(e) {
      if (fait) return;
      if (e.clientY - y0 < -30) { details.classList.add("est-complet"); fait = true; }
      else if (e.clientY - y0 > 30) { if (details.classList.contains("est-complet")) details.classList.remove("est-complet"); else choisir(null); fait = true; }
    }
    function fin() { cible.removeEventListener("pointermove", mouvement); cible.removeEventListener("pointerup", fin); cible.removeEventListener("pointercancel", fin); if (fait) { cible.addEventListener("click", stop, { once: true, capture: true }); setTimeout(function () { cible.removeEventListener("click", stop, { capture: true }); }, 400); } }
    function stop(e) { e.stopPropagation(); }
    cible.addEventListener("pointermove", mouvement); cible.addEventListener("pointerup", fin); cible.addEventListener("pointercancel", fin);
  }
  function placerSelbar() {
    var t = sel && (sel.k === "carte" || sel.k === "note") && !relierDepuis && tablette.matches ? trouver(sel.u) : null;
    if (!t) { selbar.hidden = true; return; }
    selbar.hidden = false;
    var r = rect(t.o, t.k), l = selbar.offsetWidth, h = selbar.offsetHeight;
    var x = vue.x + (r.x + r.w / 2) * vue.s - l / 2, y = vue.y + r.y * vue.s - h - 12;
    if (y < 64) y = vue.y + (r.y + r.h) * vue.s + 12;
    selbar.style.left = Math.max(8, Math.min(taille.l - l - 8, x)) + "px";
    selbar.style.top = Math.max(8, Math.min(taille.h - h - 8, y)) + "px";
  }

  /* ---------- Signaler une erreur ---------- */
  function majSignaler() {
    var lien = $("[data-signaler]"), sujet = "Erreur dans le Canvas " + libelleNiveau(seance);
    var t = sel && sel.k === "carte" ? trouver(sel.u) : null;
    if (t) sujet += " - " + codeCarte(t.o) + " " + nomCarte(t.o);
    lien.href = contact + "?sujet=" + encodeURIComponent(sujet);
  }

  /* ---------- Niveau, jeu, séances ---------- */
  function majNiveaux() {
    $$("[data-niveau]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-niveau") === seance.niveau ? "true" : "false"); });
    var niv = niveauDe(seance.niveau), zone = $("[data-jeu-zone]"), seg = $("[data-jeux]");
    zone.hidden = niv.jeux.length < 2;
    $("[data-aide-niveau]").textContent = niv.jeux.length > 1 ? "Choisis un niveau, puis son jeu de cartes." : "Choisis un niveau.";
    seg.textContent = "";
    if (niv.jeux.length > 1) niv.jeux.forEach(function (j) {
      var b = el("button", null, j.nom); b.type = "button"; b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", j.id === seance.jeu ? "true" : "false");
      b.tabIndex = j.id === seance.jeu ? 0 : -1;
      b.addEventListener("click", function () { changerNiveau(seance.niveau, j.id); });
      seg.appendChild(b);
    });
    var nom = $("[data-nom]");
    if (document.activeElement !== nom) nom.value = seance.nom || "";
  }
  $("[data-jeux]").addEventListener("keydown", function (ev) {
    if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
    var niv = niveauDe(seance.niveau), i = niv.jeux.map(function (j) { return j.id; }).indexOf(seance.jeu);
    i = (i + (ev.key === "ArrowRight" ? 1 : niv.jeux.length - 1)) % niv.jeux.length;
    ev.preventDefault(); changerNiveau(seance.niveau, niv.jeux[i].id);
    var b = $("[data-jeux] [aria-checked=\"true\"]"); if (b) b.focus();
  });
  $$("[data-niveau]").forEach(function (b) { b.addEventListener("click", function () { changerNiveau(b.getAttribute("data-niveau")); }); });

  function changerNiveau(idNiveau, idJeu) {
    var niv = niveauDe(idNiveau);
    idJeu = idJeu || (idNiveau === seance.niveau ? seance.jeu : niv.jeux[0].id);
    if (idNiveau === seance.niveau && idJeu === seance.jeu) return;
    if (estVide(seance)) {
      seance.niveau = idNiveau; seance.jeu = idJeu;
      delete histos[seance.id];   // l'historique concerne l'ancien jeu : on ne doit pas y revenir
      if (store.seances.indexOf(seance) >= 0) { seance.modifiee = Date.now(); programmer(); }
      ouvrir(seance, false);
    } else {
      // Une séance reste liée au jeu de sa création : on en ouvre une nouvelle pour ce niveau.
      vider();
      var ancienne = seance.nom || "Séance sans titre";
      ouvrir(seanceVide(idNiveau, idJeu), true);
      annoncer("Nouvelle séance pour " + libelleNiveau(seance) + ". " + guillemets(ancienne) + " reste dans Mes séances.");
    }
  }
  function nouvelleSeance() {
    vider();
    var d = $("[data-fenetre-seances]"); if (d.open) d.close();
    ouvrir(seanceVide(seance.niveau, seance.jeu), true);
    annoncer("Nouvelle séance.");
    $("[data-nom]").focus();
  }
  function ouvrir(s, recentrer) {
    seance = s; sel = null; relierDepuis = null; edition = null; voirSuite = {};
    if (!jeu || jeu.id !== s.jeu) {
      // Nouveau jeu : rien de l'ancien ne doit rester utilisable pendant le chargement.
      jeu = null; onglet = 0; filtre = ""; recherche = ""; $("[data-recherche]").value = "";
      monde.textContent = ""; $("[data-liste]").textContent = ""; $("[data-groupes]").textContent = ""; details.hidden = true;
    }
    etat = "";
    if (store.seances.indexOf(s) >= 0 && store.ouverte !== s.id) { store.ouverte = s.id; if (window.Stockage) window.Stockage.ecrire(CLE, store); }
    majNiveaux(); majRepere(); majCompte();
    var niv = niveauDe(s.niveau), j = infoJeu(niv, s.jeu);
    $("[data-palette-titre]").textContent = niv.cartesDe;
    $("[data-palette-jeu]").textContent = niv.jeux.length > 1 ? j.nom : "";
    return chargerJeu(s.jeu).then(function (donnees) {
      if (seance !== s) return;
      jeu = donnees;
      rendreOnglets(); rendreFiltre();
      if (s.vue && !recentrer) { vue = { x: s.vue.x, y: s.vue.y, s: s.vue.s }; } else ajuster();
      rendre();
    }).catch(function () {
      $("[data-liste]").innerHTML = "<p class=\"cv-liste__vide\">Le jeu de cartes n’a pas pu être chargé. Recharge la page.</p>";
    });
  }
  $("[data-nom]").addEventListener("input", function (ev) {
    seance.nom = ev.target.value;
    seance.modifiee = Date.now();
    programmer();
  });
  $("[data-nom]").addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); ev.target.blur(); } });

  /* ---------- Fenêtres ---------- */
  $$("dialog", racine).forEach(function (d) {
    d.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-fermer]")) d.close();
      else if (ev.target === d) {   // clic sur le voile, hors du cadre de la fenêtre
        var r = d.getBoundingClientRect();
        if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) d.close();
      }
    });
  });
  function ouvrirConfirmation(d, fn) {
    var nom = seance.nom || "Séance sans titre";
    var cible = $("[data-vider-nom]", d); if (cible) cible.textContent = nom;
    d.showModal();
    var b = $("[data-confirmer]", d);
    var gestion = function () { b.removeEventListener("click", gestion); d.close(); fn(); };
    b.addEventListener("click", gestion);
    d.addEventListener("close", function () { b.removeEventListener("click", gestion); }, { once: true });
  }
  function dateSeance(ms) { return estAujourdhui(ms) ? "Aujourd’hui, " + heure(ms) : jour(ms); }
  function ouvrirSeances() { vider(); rendreSeances(); $("[data-fenetre-seances]").showModal(); }
  function rendreSeances(renommer) {
    var liste = enregistrees(), corps = $("[data-seances-lignes]");
    $("[data-seances-resume]").textContent = pluriel(liste.length, "séance enregistrée", "séances enregistrées") + " dans ce navigateur, de la plus récente à la plus ancienne.";
    corps.textContent = "";
    liste.forEach(function (s) {
      var tr = el("tr"), nom = s.nom || "Séance sans titre";
      var tdNom = el("td", "cv-table__nom");
      if (renommer === s.id) {
        var i = el("input"); i.value = s.nom; i.maxLength = 120; i.setAttribute("aria-label", "Nouveau nom de la séance");
        var fini = false;
        var valider = function (garder) {
          if (fini) return; fini = true;
          if (garder && i.value.trim() !== s.nom) { s.nom = i.value.trim(); s.modifiee = Date.now(); if (s === seance) majNiveaux(); ecrireStore(); annoncer("Séance renommée."); }
          rendreSeances();
          var b = $("[data-seances-lignes] [data-renommer=\"" + s.id + "\"]"); if (b) b.focus();
        };
        i.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); valider(true); } if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); valider(false); } });
        i.addEventListener("blur", function () { valider(true); });
        tdNom.appendChild(i);
        setTimeout(function () { i.focus(); i.select(); }, 0);
      } else tdNom.textContent = nom;
      tr.appendChild(tdNom);
      var tdN = el("td"); tdN.appendChild(el("span", "cv-etiquette", libelleNiveau(s))); tr.appendChild(tdN);
      tr.appendChild(el("td", "cv-table__date", dateSeance(s.modifiee)));
      var tdA = el("td", "cv-table__actions"), grp = el("span", "cv-table__groupe");
      if (s === seance) grp.appendChild(el("span", "cv-ouverte", "Ouverte"));
      else {
        var o = el("button", "cv-btn cv-btn--petit cv-btn--principal", "Ouvrir"); o.type = "button";
        o.setAttribute("aria-label", "Ouvrir " + guillemets(nom));
        o.addEventListener("click", function () { $("[data-fenetre-seances]").close(); ouvrir(s, false); annoncer("Séance ouverte : " + nom + "."); });
        grp.appendChild(o);
      }
      [["renommer", "crayon", "Renommer"], ["dupliquer", "copie", "Dupliquer"], ["supprimer", "corbeille", "Supprimer"]].forEach(function (a) {
        var b = el("button", "cv-icone-btn" + (a[0] === "supprimer" ? " cv-icone-btn--rouge" : "")); b.type = "button";
        b.setAttribute("aria-label", a[2] + " " + guillemets(nom)); b.setAttribute("data-" + a[0], s.id);
        b.innerHTML = icone(a[1], 16);
        b.addEventListener("click", function () { actionSeance(a[0], s); });
        grp.appendChild(b);
      });
      tdA.appendChild(grp); tr.appendChild(tdA);
      corps.appendChild(tr);
    });
  }
  function actionSeance(a, s) {
    if (a === "renommer") { rendreSeances(s.id); return; }
    if (a === "dupliquer") {
      var copie = JSON.parse(JSON.stringify(s));
      copie.id = uid(); copie.nom = (s.nom || "Séance sans titre") + " (copie)"; copie.creee = copie.modifiee = Date.now();
      store.seances.push(copie);
      ecrireStore(); rendreSeances();
      annoncer("Séance dupliquée : " + copie.nom + ".");
      var b = $("[data-seances-lignes] [data-dupliquer=\"" + s.id + "\"]"); if (b) b.focus();
      return;
    }
    var d = $("[data-fenetre-supprimer]");
    $("[data-supprimer-nom]", d).textContent = s.nom || "Séance sans titre";
    d.showModal();
    var b2 = $("[data-confirmer]", d);
    var ok = function () {
      d.close();
      store.seances = store.seances.filter(function (x) { return x !== s; });
      delete histos[s.id];
      if (s === seance) { ouvrir(seanceVide(s.niveau, s.jeu), true); }
      ecrireStore();
      annoncer("Séance supprimée.");
      if (store.seances.length) { rendreSeances(); var p = $("[data-seances-lignes] button"); if (p) p.focus(); }
      else { $("[data-fenetre-seances]").close(); $("[data-action=\"nouvelle\"]").focus(); }
    };
    b2.addEventListener("click", ok, { once: true });
    d.addEventListener("close", function () { b2.removeEventListener("click", ok); }, { once: true });
  }

  /* ---------- Scène dessinée : PNG (canvas) et impression (SVG) ---------- */
  var mesure = document.createElement("canvas").getContext("2d");
  function police(taillePx, graisse, mono) { return (graisse || 400) + " " + taillePx + "px " + (mono ? MONO : POLICE); }
  function couper(texte, largeur, taillePx, graisse, maxLignes) {
    mesure.font = police(taillePx, graisse);
    var lignes = [];
    String(texte || "").split("\n").forEach(function (para) {
      var mots = para.split(/\s+/).filter(Boolean), ligne = "";
      if (!mots.length) { lignes.push(""); return; }
      mots.forEach(function (m) {
        var essai = ligne ? ligne + " " + m : m;
        if (mesure.measureText(essai).width <= largeur || !ligne) ligne = essai;
        else { lignes.push(ligne); ligne = m; }
      });
      lignes.push(ligne);
    });
    if (maxLignes && lignes.length > maxLignes) {
      lignes = lignes.slice(0, maxLignes);
      var der = lignes[maxLignes - 1];
      while (der && mesure.measureText(der + "…").width > largeur) der = der.slice(0, -1);
      lignes[maxLignes - 1] = der.replace(/\s+$/, "") + "…";
    }
    return lignes;
  }
  function raccourcir(texte, largeur, taillePx, graisse, mono) {
    mesure.font = police(taillePx, graisse, mono);
    if (mesure.measureText(texte).width <= largeur) return texte;
    while (texte && mesure.measureText(texte + "…").width > largeur) texte = texte.slice(0, -1);
    return texte + "…";
  }
  function largeurTexte(texte, taillePx, graisse, mono) { mesure.font = police(taillePx, graisse, mono); return mesure.measureText(texte).width; }
  function scene(cadreSeul) {
    // Liste de primitives (rect, texte, chemin, cercle) en coordonnées du monde.
    var items = [];
    function R(x, y, w, h, o) { items.push({ k: "rect", x: x, y: y, w: w, h: h, r: o.r || 0, fill: o.fill || "none", stroke: o.stroke || "none", sw: o.sw || 1, dash: o.dash, haut: o.haut }); }
    function T(x, y, t, o) { items.push({ k: "texte", x: x, y: y, t: t, size: o.size, w: o.w || 400, color: o.color, mono: o.mono, align: o.align || "start" }); }
    function lignes(x, y, ls, size, lh, w, color) { ls.forEach(function (l, i) { T(x, y + i * lh + (lh - size) / 2 + size * 0.8, l, { size: size, w: w, color: color }); }); }
    var cadres = seance.cadres.slice().sort(function (a, b) { return b.l * b.h - a.l * a.h; });
    cadres.forEach(function (f) {
      R(f.x, f.y, f.l, f.h, { r: 14, fill: "rgba(243,247,251,0.75)", stroke: "#B9C4CF", sw: 1.5 });
      T(f.x + 14, f.y + 10 + 15, raccourcir(f.titre, f.l - 28, 15, 600), { size: 15, w: 600, color: "#2A3A49" });
    });
    seance.liens.forEach(function (l) {
      var g = geometrie(l); if (!g) return;
      var info = g.info, orange = info.cas > 0, coul = info.note ? (info.note.rouge ? ROUGE : GRIS) : (orange ? ORANGE : info.enchainement ? FONCE : GRIS);
      items.push({ k: "chemin", d: g.d, stroke: coul, sw: info.note ? 1.6 : (orange || info.enchainement ? 3 : 2), dash: info.note ? [5, 4] : null });
      if (g.fleche) items.push({ k: "chemin", d: g.fleche, fill: coul });
      if (orange) {
        items.push({ k: "cercle", x: g.mid.x, y: g.mid.y, r: 11, fill: "#FFFFFF", stroke: ORANGE, sw: 2 });
        T(g.mid.x, g.mid.y + 5, "!", { size: 14, w: 700, color: ROUGE, align: "middle" });
      }
    });
    seance.notes.forEach(function (n) {
      var st = n.type === "evaluer" ? ["#FDF3E4", ORANGE, "#4A3206"] : n.type === "bilan" ? ["#EEF2F6", "#13212E", "#13212E"] : n.rouge ? ["#FBEDE6", ROUGE, "#5A1E0A"] : ["#FFFFFF", "#B9C4CF", "#13212E"];
      R(n.x, n.y, n.l, n.h, { r: 8, fill: st[0], stroke: st[1], sw: n.type ? 2 : 1.5 });
      var ls = couper(n.texte, n.l - 24, 14, 400, Math.max(1, Math.floor((n.h - 20) / 19.6)));
      lignes(n.x + 12, n.y + 10, ls, 14, 19.6, 400, st[2]);
    });
    seance.cartes.forEach(function (pc) {
      var c = carteDe(pc), x = pc.x, y = pc.y;
      if (!c) {
        R(x, y, CL, CH, { r: 10, fill: "#EEF2F6", stroke: GRIS, sw: 1.5, dash: [5, 4] });
        T(x + 10, y + 18, raccourcir("Carte retirée du jeu", 120, 11.5, 600), { size: 11.5, w: 600, color: "#4A5A69" });
        T(x + CL - 10, y + 18, pc.c, { size: 11.5, w: 500, color: "#4A5A69", mono: true, align: "end" });
        lignes(x + 10, y + 36, couper(pc.t || "", CL - 20, 14, 600, 3), 14, 18.2, 600, "#4A5A69");
      } else if (c.type === "competence") {
        R(x, y, CL, CH, { r: 10, fill: c.couleur });
        T(x + 12, y + 10 + 11, surLigne(c).toUpperCase(), { size: 11, w: 600, color: "rgba(255,255,255,0.85)" });
        T(x + CL - 12, y + 10 + 11, c.code, { size: 11, w: 500, color: "rgba(255,255,255,0.85)", mono: true, align: "end" });
        lignes(x + 12, y + 30, couper(c.titre, CL - 24, 16, 600, 2), 16, 20.8, 600, "#FFFFFF");
      } else {
        var theorie = c.type === "theorie", coul = couleurDe(c);
        R(x, y, CL, CH, { r: 10, fill: theorie ? "#EEF2F6" : "#FFFFFF", stroke: "#CFD8E1", sw: 1 });
        if (!theorie) R(x, y, CL, 28, { r: 10, fill: coul, haut: true });
        else items.push({ k: "chemin", d: "M" + x + "," + (y + 28) + " L" + (x + CL) + "," + (y + 28), stroke: "#D5DDE5", sw: 1 });
        var codeL = largeurTexte(c.code, 11.5, 500, true);
        var gauche = theorie ? (c.bandeau || "Théorie · " + c.rubrique) : nomComp(c.comp);
        T(x + 10, y + 18, raccourcir(gauche, CL - 26 - codeL, 11.5, 600), { size: 11.5, w: 600, color: theorie ? "#3A4A59" : "#FFFFFF" });
        T(x + CL - 10, y + 18, c.code, { size: 11.5, w: 500, color: theorie ? "#3A4A59" : "#FFFFFF", mono: true, align: "end" });
        var ts = theorie ? 14 : 15;
        lignes(x + 10, y + 36, couper(c.titre, CL - 20, ts, 600, 3), ts, ts * 1.3, 600, "#13212E");
      }
    });
    var b = cadreSeul ? { x: cadreSeul.x, y: cadreSeul.y, w: cadreSeul.l, h: cadreSeul.h } : englobant();
    return { items: items, b: b };
  }
  function versCanvas(ctx, items) {
    items.forEach(function (it) {
      ctx.save();
      if (it.k === "rect") {
        ctx.beginPath();
        var r = it.r, x = it.x, y = it.y, w = it.w, h = it.h;
        if (it.haut) { ctx.moveTo(x, y + h); ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h); ctx.closePath(); }
        else if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
        if (it.fill !== "none") { ctx.fillStyle = it.fill; ctx.fill(); }
        if (it.stroke !== "none") { ctx.strokeStyle = it.stroke; ctx.lineWidth = it.sw; if (it.dash) ctx.setLineDash(it.dash); ctx.stroke(); }
      } else if (it.k === "texte") {
        ctx.font = police(it.size, it.w, it.mono); ctx.fillStyle = it.color;
        ctx.textAlign = it.align === "middle" ? "center" : it.align === "end" ? "right" : "left";
        ctx.fillText(it.t, it.x, it.y);
      } else if (it.k === "chemin") {
        var p = new Path2D(it.d);
        if (it.fill) { ctx.fillStyle = it.fill; ctx.fill(p); }
        if (it.stroke) { ctx.strokeStyle = it.stroke; ctx.lineWidth = it.sw; ctx.lineCap = "round"; if (it.dash) ctx.setLineDash(it.dash); ctx.stroke(p); }
      } else if (it.k === "cercle") {
        ctx.beginPath(); ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
        ctx.fillStyle = it.fill; ctx.fill(); ctx.strokeStyle = it.stroke; ctx.lineWidth = it.sw; ctx.stroke();
      }
      ctx.restore();
    });
  }
  function versSvg(items, b, marge) {
    var x0 = b.x - marge, y0 = b.y - marge, w = b.w + 2 * marge, h = b.h + 2 * marge;
    var out = ["<svg xmlns=\"" + NS + "\" viewBox=\"" + r1(x0) + " " + r1(y0) + " " + r1(w) + " " + r1(h) + "\" preserveAspectRatio=\"xMidYMid meet\"><defs><clipPath id=\"cv-clip\"><rect x=\"" + r1(x0) + "\" y=\"" + r1(y0) + "\" width=\"" + r1(w) + "\" height=\"" + r1(h) + "\"/></clipPath></defs><g clip-path=\"url(#cv-clip)\">"];
    items.forEach(function (it) {
      if (it.k === "rect") {
        var attrs = " fill=\"" + it.fill + "\" stroke=\"" + it.stroke + "\" stroke-width=\"" + it.sw + "\"" + (it.dash ? " stroke-dasharray=\"" + it.dash.join(" ") + "\"" : "");
        if (it.haut) {
          var r = it.r;
          out.push("<path d=\"M" + it.x + "," + (it.y + it.h) + " V" + (it.y + r) + " Q" + it.x + "," + it.y + " " + (it.x + r) + "," + it.y + " H" + (it.x + it.w - r) + " Q" + (it.x + it.w) + "," + it.y + " " + (it.x + it.w) + "," + (it.y + r) + " V" + (it.y + it.h) + " Z\"" + attrs + "/>");
        } else out.push("<rect x=\"" + r1(it.x) + "\" y=\"" + r1(it.y) + "\" width=\"" + r1(it.w) + "\" height=\"" + r1(it.h) + "\" rx=\"" + it.r + "\"" + attrs + "/>");
      } else if (it.k === "texte") {
        out.push("<text x=\"" + r1(it.x) + "\" y=\"" + r1(it.y) + "\" font-size=\"" + it.size + "\" font-weight=\"" + it.w + "\" fill=\"" + it.color + "\" font-family=\"" + echapper(it.mono ? MONO : POLICE) + "\"" + (it.align !== "start" ? " text-anchor=\"" + it.align + "\"" : "") + ">" + echapper(it.t) + "</text>");
      } else if (it.k === "chemin") {
        out.push("<path d=\"" + it.d + "\" fill=\"" + (it.fill || "none") + "\"" + (it.stroke ? " stroke=\"" + it.stroke + "\" stroke-width=\"" + it.sw + "\" stroke-linecap=\"round\"" : "") + (it.dash ? " stroke-dasharray=\"" + it.dash.join(" ") + "\"" : "") + "/>");
      } else if (it.k === "cercle") {
        out.push("<circle cx=\"" + r1(it.x) + "\" cy=\"" + r1(it.y) + "\" r=\"" + it.r + "\" fill=\"" + it.fill + "\" stroke=\"" + it.stroke + "\" stroke-width=\"" + it.sw + "\"/>");
      }
    });
    out.push("</g></svg>");
    return out.join("");
  }
  function nomFichier(ext) {
    var nom = (seance.nom || "seance").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "seance";
    return "passe-ton-mf1_canvas_" + nom + "." + ext;
  }
  function telechargerPng() {
    var sc = scene();
    if (!sc.b) { annoncer("Le tableau est vide : rien à télécharger."); return; }
    var marge = 32, echelle = 2, w = sc.b.w + 2 * marge, h = sc.b.h + 2 * marge;
    var max = 12000; if (Math.max(w, h) * echelle > max) echelle = max / Math.max(w, h);
    echelle = Math.min(echelle, Math.sqrt(16e6 / (w * h)));   // Safari (iPad) refuse les canvas de plus de ~16 Mpx
    var cv = document.createElement("canvas");
    cv.width = Math.ceil(w * echelle); cv.height = Math.ceil(h * echelle);
    var ctx = cv.getContext("2d");
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.scale(echelle, echelle); ctx.translate(marge - sc.b.x, marge - sc.b.y);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      versCanvas(ctx, sc.items);
      cv.toBlob(function (blob) {
        if (!blob) { annoncer("L’image n’a pas pu être créée : le tableau est trop grand. Essaie l’impression en PDF."); return; }
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = nomFichier("png");
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        annoncer("Image PNG téléchargée.");
      }, "image/png");
    });
  }

  /* ---------- Impression en PDF ---------- */
  var impression = document.querySelector("[data-impression]");
  $("[data-fenetre-imprimer] [data-confirmer]").addEventListener("click", function () {
    var format = ($("[name=\"cv-format\"]:checked") || {}).value || "A4";
    $("[data-fenetre-imprimer]").close();
    imprimer(format);
  });
  function imprimer(format) {
    vider();
    var niv = niveauDe(seance.niveau), j = infoJeu(niv, seance.jeu);
    var titre = seance.nom || "Séance sans titre";
    var nbC = seance.cartes.length, nbF = seance.cadres.length;
    var infos = { niveau: niv.nom + (j.nom ? " (" + j.nom + ")" : ""), date: jour(Date.now()), contenu: pluriel(nbC, "carte", "cartes") + " · " + pluriel(nbF, "cadre", "cadres") };
    var zoomPage = format === "A4" ? 0.7071 : 1;
    var sc = scene(), pages = [];
    pages.push({ sc: sc, cote: true });
    if (sc.b) {
      var echelle = Math.min(1071 / (sc.b.w + 48), 860 / (sc.b.h + 48)) * zoomPage;
      if (echelle < 0.45) seance.cadres.forEach(function (f) { pages.push({ sc: scene(f), cadre: f }); });
    }
    impression.textContent = "";
    impression.className = "impression cv-impression cv-impression--" + format;
    pages.forEach(function (p, i) { impression.appendChild(page(p, titre, infos, i + 1, pages.length)); });
    var style = document.getElementById("cv-style-page");
    if (!style) { style = document.createElement("style"); style.id = "cv-style-page"; document.head.appendChild(style); }
    style.textContent = "@media print { @page { size: " + format + " landscape; margin: 0; } }";
    var fin = function () { window.removeEventListener("afterprint", fin); impression.textContent = ""; };
    window.addEventListener("afterprint", fin);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { window.print(); });
  }
  function page(p, titre, infos, num, total) {
    var pg = el("div", "cv-page");
    var tete = el("header", "cv-page__tete"), gauche = el("div");
    gauche.innerHTML = "<span class=\"cv-page__marque\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 28 28\" aria-hidden=\"true\"><rect width=\"28\" height=\"28\" rx=\"7\" fill=\"#0B5AA6\"></rect><path d=\"M5 10 H10 L14 19 H19 L21 15 H23\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg>passe-ton-mf1.com · Canvas</span>";
    gauche.appendChild(el("h1", "cv-page__titre", titre));
    tete.appendChild(gauche);
    var droite = el("div", "cv-page__infos");
    var paires = [["Niveau", infos.niveau], ["Date", infos.date], ["Contenu", infos.contenu]];
    if (p.cadre) paires.push(["Cadre", p.cadre.titre]);
    paires.forEach(function (x) { var d = el("div"); d.appendChild(el("span", "cv-eyebrow", x[0])); d.appendChild(el("strong", null, x[1])); droite.appendChild(d); });
    tete.appendChild(droite);
    pg.appendChild(tete);
    var corps = el("div", "cv-page__corps" + (p.cote ? "" : " cv-page__corps--seul"));
    var tab = el("div", "cv-page__tableau");
    if (p.sc.b) tab.innerHTML = versSvg(p.sc.items, p.sc.b, 24);
    corps.appendChild(tab);
    if (p.cote) corps.appendChild(colonne());
    pg.appendChild(corps);
    var pied = el("footer", "cv-page__pied");
    pied.appendChild(el("span", null, "Construit sur passe-ton-mf1.com à partir du MFT (version décembre 2025). Document de travail, pas un texte officiel."));
    pied.appendChild(el("span", null, "Page " + num + " / " + total));
    pg.appendChild(pied);
    return pg;
  }
  function carteCommentee(n) {
    var l = seance.liens.filter(function (x) { return x.a === n.u || x.b === n.u; })[0];
    if (!l) return null;
    var autre = trouver(l.a === n.u ? l.b : l.a);
    return autre && autre.k === "carte" ? nomCarte(autre.o) : null;
  }
  function point(cls, gras, texte) {
    var d = el("div", "cv-page__point cv-page__point--" + cls);
    if (gras) { d.appendChild(el("strong", null, gras)); d.appendChild(document.createTextNode(" : ")); }
    d.appendChild(document.createTextNode(texte));
    return d;
  }
  function colonne() {
    var cote = el("aside", "cv-page__cote");
    var evals = seance.notes.filter(function (n) { return n.type === "evaluer" && n.texte.trim(); });
    if (evals.length) {
      var s0 = el("section"); s0.appendChild(el("h2", null, "Évaluer l’élève"));
      evals.forEach(function (n) { s0.appendChild(point("evaluer", carteCommentee(n), n.texte)); });
      cote.appendChild(s0);
    }
    var rouges = seance.notes.filter(function (n) { return !n.type && n.rouge && n.texte.trim(); });
    var oranges = seance.liens.map(analyser).filter(function (i) { return i && i.cas; });
    if (rouges.length || oranges.length) {
      var s1 = el("section"); s1.appendChild(el("h2", null, "Points d’attention"));
      rouges.forEach(function (n) { s1.appendChild(point("rouge", carteCommentee(n), n.texte)); });
      oranges.forEach(function (i) { s1.appendChild(point("orange", "Lien à vérifier", phrase(i))); });
      cote.appendChild(s1);
    }
    var blancs = seance.notes.filter(function (n) { return !n.type && !n.rouge && n.texte.trim(); });
    if (blancs.length) {
      var s2 = el("section"); s2.appendChild(el("h2", null, "Annotations"));
      blancs.forEach(function (n) { s2.appendChild(point("blanc", carteCommentee(n), n.texte)); });
      cote.appendChild(s2);
    }
    var bilans = seance.notes.filter(function (n) { return n.type === "bilan" && n.texte.trim(); });
    if (bilans.length) {
      var s4 = el("section"); s4.appendChild(el("h2", null, "Bilan : A, ECA ou NT"));
      bilans.forEach(function (n) { s4.appendChild(point("bilan", carteCommentee(n), n.texte)); });
      cote.appendChild(s4);
    }
    var s3 = el("section", "cv-page__legende"); s3.appendChild(el("h2", null, "Légende"));
    var ul = el("ul"), n = jeu.noms, coul = (jeu.cartes.filter(function (c) { return c.type === "competence" && !c.libre; })[0] || {}).couleur || "#6B5B3E";
    var maj = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
    var lignes = [
      ["<span style=\"background:" + coul + "\"></span>", maj(n[0].un) + " (couleur de " + (n[0].f ? "la " : "le ") + n[0].un + ")"],
      ["<span style=\"border:1px solid #CFD8E1;border-top:6px solid " + coul + "\"></span>", maj(n[1].un) + " (bandeau de " + (n[0].f ? "sa " : "son ") + n[0].un + ")"]
    ];
    if (n[2]) lignes.push(["<span style=\"background:#EEF2F6;border:1px solid #CFD8E1\"></span>", maj(n[2].un)]);
    lignes.push(["<svg width=\"30\" height=\"10\" aria-hidden=\"true\"><path d=\"M0 5h30\" stroke=\"#8796A5\" stroke-width=\"2\"></path></svg>", "Lien"]);
    lignes.push(["<svg width=\"30\" height=\"10\" aria-hidden=\"true\"><path d=\"M0 5h30\" stroke=\"#3A4A59\" stroke-width=\"3\"></path></svg>", "Enchaînement (dans l’ordre de la séance)"]);
    lignes.push(["<svg width=\"30\" height=\"10\" aria-hidden=\"true\"><path d=\"M0 5h30\" stroke=\"#D9822B\" stroke-width=\"3\"></path></svg>", "Lien à vérifier"]);
    lignes.push(["<svg width=\"30\" height=\"10\" aria-hidden=\"true\"><path d=\"M0 5h30\" stroke=\"#8796A5\" stroke-width=\"1.6\" stroke-dasharray=\"5 4\"></path></svg>", "Annotation (rouge : précaution ; orange : évaluer l’élève ; sombre : bilan)"]);
    lignes.forEach(function (l) { var li = el("li"); li.innerHTML = l[0] + "<span>" + echapper(l[1]) + "</span>"; ul.appendChild(li); });
    s3.appendChild(ul); cote.appendChild(s3);
    return cote;
  }

  /* ---------- Progression type transmise par « Continuer dans le Canvas » (page Pistes) ---------- */
  // La compétence à gauche, puis un cadre par technique, de gauche à droite : ses cartes en haut (reliées à la
  // compétence si elles en relèvent), une carte « Évaluer l'élève », une annotation blanche par étape (titre et objectif), une annotation rouge
  // qui regroupe les points de sécurité de la technique. Le tout s'annule en une fois.
  function construireProgression(prog, idComp) {
    var comp = idComp && jeu.parId[idComp];
    var FL = 460, MARGE = 20, HAUT = 48, ECART = 40, LN = FL - 2 * MARGE;
    function hauteurNote(texte) { return Math.max(56, Math.ceil(couper(texte, LN - 24, 14, 400).length * 19.6 + 22)); }
    var cartes = [], liens = [], notes = [], cadres = [], x = comp ? 280 : 0, plusHaut = 0;
    var pcComp = comp ? { u: uid(), c: comp.id, t: comp.titre, x: 0, y: HAUT, f: null } : null;
    if (pcComp) cartes.push(pcComp);
    prog.techniques.forEach(function (t) {
      var f = { u: uid(), titre: t.nom, x: x, y: 0, l: FL, h: 0 }, y = HAUT;
      var poses = t.cartes.filter(function (id) { return jeu.parId[id]; });
      poses.forEach(function (id, i) {
        var c = jeu.parId[id], pc = { u: uid(), c: id, t: c.titre, x: x + MARGE + (i % 2) * (CL + MARGE), y: HAUT + Math.floor(i / 2) * (CH + 16), f: f.u };
        cartes.push(pc);
        if (pcComp && (c.comp === comp.id || comp.libre)) liens.push({ u: uid(), a: pcComp.u, b: pc.u });
      });
      if (poses.length) y = HAUT + Math.ceil(poses.length / 2) * (CH + 16) + 8;
      // Carte « Évaluer l'élève » en tête du cadre, « Bilan » à la fin (quand elles sont rédigées : data/evaluation/).
      function poserType(texte, type) {
        var h = hauteurNote(texte);
        notes.push({ u: uid(), texte: texte, rouge: false, type: type, x: x + MARGE, y: y, l: LN, h: h });
        y += h + 12;
      }
      if (t.evaluer) poserType(t.evaluer, "evaluer");
      var securite = [];
      t.etapes.forEach(function (e) {
        var texte = "Étape " + e.n + " · " + e.titre + (e.objectif ? "\n" + e.objectif : "");
        var h = hauteurNote(texte);
        notes.push({ u: uid(), texte: texte, rouge: false, x: x + MARGE, y: y, l: LN, h: h });
        y += h + 12;
        if (e.securite) securite.push("Étape " + e.n + " : " + e.securite);
      });
      if (securite.length) {
        var ts = "Sécurité\n" + securite.join("\n"), hs = hauteurNote(ts);
        notes.push({ u: uid(), texte: ts, rouge: true, x: x + MARGE, y: y, l: LN, h: hs });
        y += hs + 12;
      }
      if (t.bilan) poserType(t.bilan, "bilan");
      f.h = y + MARGE - 12;
      cadres.push(f);
      plusHaut = Math.max(plusHaut, f.h);
      x += FL + ECART;
    });
    modifier(function () {
      seance.cartes = seance.cartes.concat(cartes);
      seance.liens = seance.liens.concat(liens);
      seance.notes = seance.notes.concat(notes);
      seance.cadres = seance.cadres.concat(cadres);
      if (!seance.nom) seance.nom = prog.competence;
      sel = null;   // pas de panneau : tout le storyboard reste visible
    });
    majNiveaux();
    ajuster();
    annoncer("Progression transmise : " + prog.competence + ", " + pluriel(prog.techniques.length, "technique", "techniques") + ".");
  }

  /* ---------- Démarrage ---------- */
  new ResizeObserver(function () {
    var l = fond.clientWidth, h = fond.clientHeight;
    if (!l || !h) return;
    taille = { l: l, h: h };
    placerSelbar();
  }).observe(fond);
  taille = { l: fond.clientWidth || 800, h: fond.clientHeight || 700 };

  var depart = store.seances.filter(function (s) { return s.id === store.ouverte; })[0];
  // Venue de « Progressions types » : ?jeu=n1&carte=C1 ouvre ce jeu (séance vide réutilisée, sinon nouvelle) et pose la carte.
  var demande = new URLSearchParams(location.search), jeuDemande = demande.get("jeu"), carteDemandee = demande.get("carte");
  var nivDemande = jeuDemande ? niveaux.filter(function (n) { return masques.indexOf(n.id) < 0 && n.jeux.some(function (j) { return j.id === jeuDemande; }); })[0] : null;
  if (nivDemande) {
    if (window.history.replaceState) window.history.replaceState(null, "", location.pathname);
    var s0 = depart && estVide(depart) ? depart : seanceVide(nivDemande.id, jeuDemande);
    s0.niveau = nivDemande.id; s0.jeu = jeuDemande;
    var progDemandee = demande.get("progression");
    ouvrir(s0, true).then(function () {
      if (seance !== s0 || !jeu) return;
      if (progDemandee && racine.getAttribute("data-progressions")) {
        fetch(racine.getAttribute("data-progressions")).then(function (r) { return r.json(); }).then(function (toutes) {
          if (seance === s0 && toutes[progDemandee]) construireProgression(toutes[progDemandee], carteDemandee);
          else if (carteDemandee && jeu.parId[carteDemandee]) poser(carteDemandee);
        }).catch(function () { if (carteDemandee && jeu.parId[carteDemandee]) poser(carteDemandee); });
      } else if (carteDemandee && jeu.parId[carteDemandee]) poser(carteDemandee);
    });
  } else ouvrir(depart || seanceVide("n1"), !depart);
})();
