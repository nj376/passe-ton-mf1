/* Mindmaps : choix du niveau et de la mindmap, visionneuse (déplacement, zoom, sommaire, mini-carte).
   Le SVG (produit par outils/mindmaps.py) est inséré dans la page pour que son texte reste du vrai texte.
   Le zoom passe par le viewBox du SVG : le rendu reste net à tous les zooms. Sur téléphone, rien n'est chargé. */
(function () {
  "use strict";
  var racine = document.querySelector("[data-mm]");
  if (!racine) return;

  var niveaux = JSON.parse(document.getElementById("mm-donnees").textContent || "[]")
    .filter(function (n) { return n.cartes && n.cartes.length; });
  if (!niveaux.length) return;
  var base = racine.getAttribute("data-base").replace(/\/$/, "");
  var contact = racine.getAttribute("data-contact");
  function $(s) { return racine.querySelector(s); }

  var ongletsZone = $("[data-onglets]"), rappel = $("[data-rappel]"), listeSections = $("[data-sections]");
  var aller = $("[data-aller]"), vue = $("[data-vue]"), toile = $("[data-toile]"), zoomTexte = $("[data-zoom]");
  var astuce = $("[data-astuce]"), mini = $("[data-mini]"), miniCarte = $("[data-mini-carte]");
  var miniImage = $("[data-mini-image]"), miniCadre = $("[data-mini-cadre]");
  var telecharger = $("[data-telecharger]"), signaler = $("[data-signaler]");
  var boutonPlein = $('[data-action="plein"]');

  var ZOOM_MAX = 3, MARGE = 24;
  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var niveau = null, carte = null, svg = null, cache = {}, jeton = 0;
  var v = { x: 0, y: 0, s: 1 }, zoomMin = 0.1, taille = { l: 0, h: 0 }, anim = null;

  /* ---------- Choix du niveau et de la mindmap ---------- */
  function trouverNiveau(id) { return niveaux.filter(function (n) { return n.id === id; })[0]; }
  function trouverCarte(n, id) { return n.cartes.filter(function (c) { return c.id === id; })[0]; }

  function choisir(idNiveau, idCarte) {
    niveau = trouverNiveau(idNiveau) || trouverNiveau("n1") || niveaux[0];
    carte = trouverCarte(niveau, idCarte) || niveau.cartes[0];
    racine.querySelectorAll("[data-niveau]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-niveau") === niveau.id ? "true" : "false");
    });
    rappel.textContent = niveau.nom + " · " + niveau.cartes.length + " mindmap" + (niveau.cartes.length > 1 ? "s" : "");
    construireOnglets();
    construireSections();
    var png = carte.png.split("/").pop();
    telecharger.href = base + carte.png;
    telecharger.setAttribute("download", png);
    signaler.href = contact + "?sujet=" + encodeURIComponent("Erreur sur la mindmap " + niveau.court + " - " + carte.titre);
    try {
      var adresse = location.pathname + "?niveau=" + niveau.id + "&carte=" + carte.id;
      history.replaceState(null, "", adresse);
    } catch (e) { /* adresse non modifiable : sans conséquence */ }
    charger();
  }

  function construireOnglets() {
    ongletsZone.textContent = "";
    niveau.cartes.forEach(function (c) {
      var b = document.createElement("button");
      var actif = c === carte;
      b.type = "button";
      b.className = "mm-onglet";
      b.id = "mm-onglet-" + c.id;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", actif ? "true" : "false");
      b.setAttribute("aria-controls", "mm-vue");
      b.tabIndex = actif ? 0 : -1;
      b.textContent = c.titre;
      b.addEventListener("click", function () { if (c !== carte) choisir(niveau.id, c.id); });
      ongletsZone.appendChild(b);
    });
    vue.setAttribute("aria-labelledby", "mm-onglet-" + carte.id);
  }

  ongletsZone.addEventListener("keydown", function (e) {
    var i = niveau.cartes.indexOf(carte), n = niveau.cartes.length, j = null;
    if (e.key === "ArrowRight") j = (i + 1) % n;
    else if (e.key === "ArrowLeft") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = n - 1;
    if (j === null) return;
    e.preventDefault();
    choisir(niveau.id, niveau.cartes[j].id);
    var b = document.getElementById("mm-onglet-" + carte.id);
    if (b) b.focus();
  });

  function construireSections() {
    listeSections.textContent = "";
    aller.textContent = "";
    var groupes = carte.groupes || [], groupeCourant = null, conteneur = listeSections, optgroup = null;
    function bouton(texte, classe, cle, action) {
      var li = document.createElement("li"), b = document.createElement("button");
      b.type = "button";
      b.className = classe;
      b.textContent = texte;
      b.setAttribute("data-cle", cle);
      b.addEventListener("click", action);
      li.appendChild(b);
      return li;
    }
    function option(texte, valeur, parent) {
      var o = document.createElement("option");
      o.value = valeur;
      o.textContent = texte;
      parent.appendChild(o);
    }
    listeSections.appendChild(bouton("Vue d’ensemble", "mm-section mm-section--ensemble", "s0", function () { allerA(0); }));
    option("Vue d’ensemble", "s0", aller);
    carte.sections.forEach(function (s, i) {
      var g = s.groupe === undefined ? null : s.groupe;
      if (g !== groupeCourant) {
        groupeCourant = g;
        if (g === null) { conteneur = listeSections; optgroup = null; }
        else {
          // Groupe (colonne de la carte) : en-tête cliquable, puis ses sections en retrait.
          var li = bouton(groupes[g].titre, "mm-groupe", "g" + g, function () { allerGroupe(g); });
          conteneur = document.createElement("ul");
          conteneur.className = "mm-sections mm-sections--groupe";
          li.appendChild(conteneur);
          listeSections.appendChild(li);
          optgroup = document.createElement("optgroup");
          optgroup.label = groupes[g].titre;
          aller.appendChild(optgroup);
          option("Toute la colonne", "g" + g, optgroup);
        }
      }
      conteneur.appendChild(bouton(s.titre, "mm-section", "s" + (i + 1), function () { allerA(i + 1); }));
      option(s.titre, "s" + (i + 1), optgroup || aller);
    });
    marquer("s0");
  }

  function marquer(cle) {
    listeSections.querySelectorAll("[data-cle]").forEach(function (b) {
      if (b.getAttribute("data-cle") === cle) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
    aller.value = cle;
  }

  function allerGroupe(g) {
    interaction();
    marquer("g" + g);
    if (svg) versZone(carte.groupes[g], true);
  }

  function allerA(i) {
    interaction();
    marquer("s" + i);
    if (!svg) return;
    if (i === 0) animer(ajustement());
    else versZone(carte.sections[i - 1]);
  }
  aller.addEventListener("change", function () {
    var v = aller.value;
    if (v.charAt(0) === "g") allerGroupe(+v.slice(1));
    else allerA(+v.slice(1));
  });

  racine.querySelectorAll("[data-niveau]").forEach(function (b) {
    b.addEventListener("click", function () {
      var id = b.getAttribute("data-niveau");
      if (id !== niveau.id) choisir(id, carte.id);
    });
  });

  /* ---------- Chargement du SVG ---------- */
  function charger() {
    var c = carte, n = niveau, mon = ++jeton;
    arreter();
    svg = null;
    toile.textContent = "";
    miniImage.src = base + c.mini;
    dimensionnerMini();
    (cache[c.svg] ? Promise.resolve(cache[c.svg]) : fetch(base + c.svg).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    })).then(function (texte) {
      cache[c.svg] = texte;
      if (mon !== jeton) return;
      toile.innerHTML = texte;
      svg = toile.querySelector("svg");
      if (!svg) return;
      svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
      svg.setAttribute("role", "group");
      var titre = document.createElementNS("http://www.w3.org/2000/svg", "title");
      titre.textContent = "Mindmap " + n.nom + ", " + c.titre.toLowerCase();
      svg.insertBefore(titre, svg.firstChild);
      svg.setAttribute("aria-label", titre.textContent);
      mesurer();
      poser(ajustement());
    }).catch(function () {
      if (mon === jeton) toile.innerHTML = '<p class="mm-erreur">La mindmap n’a pas pu être chargée.</p>';
    });
  }

  /* ---------- Géométrie de la vue ---------- */
  function mesurer() { taille.l = vue.clientWidth; taille.h = vue.clientHeight; }

  function ajustement() {
    var s = Math.min((taille.l - 2 * MARGE) / carte.largeur, (taille.h - 2 * MARGE) / carte.hauteur);
    zoomMin = Math.min(s, ZOOM_MAX);
    return borner({ x: 0, y: 0, s: zoomMin });
  }

  function borner(c) {
    var s = Math.max(zoomMin, Math.min(ZOOM_MAX, c.s));
    var vl = taille.l / s, vh = taille.h / s, m = 40 / s;
    var x = vl >= carte.largeur ? (carte.largeur - vl) / 2 : Math.max(-m, Math.min(carte.largeur - vl + m, c.x));
    var y = vh >= carte.hauteur ? (carte.hauteur - vh) / 2 : Math.max(-m, Math.min(carte.hauteur - vh + m, c.y));
    return { x: x, y: y, s: s };
  }

  function poser(c) {
    v = borner(c);
    if (!svg) return;
    svg.setAttribute("viewBox", [v.x, v.y, taille.l / v.s, taille.h / v.s].map(function (n) { return n.toFixed(2); }).join(" "));
    zoomTexte.textContent = Math.round(v.s * 100) + " %";
    cadreMini();
  }

  function zoomer(facteur, px, py) {
    if (px === undefined) { px = taille.l / 2; py = taille.h / 2; }
    var ux = v.x + px / v.s, uy = v.y + py / v.s;
    var s = Math.max(zoomMin, Math.min(ZOOM_MAX, v.s * facteur));
    return { x: ux - px / s, y: uy - py / s, s: s };
  }

  function versZone(zone, colonne) {
    // Le titre de la section est placé au-dessus du cadre : on l'inclut dans la zone.
    // Colonne d'un groupe : cadrée sur sa largeur, à partir de son sous-titre.
    var z = colonne ? zone : { x: zone.x, y: zone.y - 30, l: zone.l, h: zone.h + 30 };
    var s = colonne ? (taille.l - 2 * MARGE) / z.l : Math.min((taille.l - 2 * MARGE) / z.l, (taille.h - 2 * MARGE) / z.h);
    s = Math.max(zoomMin, Math.min(ZOOM_MAX, s));
    var vl = taille.l / s, vh = taille.h / s;
    // Zone plus haute que la vue : on montre son haut (le titre).
    var y = z.h + 2 * MARGE / s > vh ? z.y - MARGE / s : z.y + z.h / 2 - vh / 2;
    animer(borner({ x: z.x + z.l / 2 - vl / 2, y: y, s: s }));
  }

  function arreter() { if (anim) { cancelAnimationFrame(anim); anim = null; } }

  function animer(cible) {
    arreter();
    if (reduit) { poser(cible); return; }
    var depart = { cx: v.x + taille.l / (2 * v.s), cy: v.y + taille.h / (2 * v.s), s: v.s };
    var arrivee = { cx: cible.x + taille.l / (2 * cible.s), cy: cible.y + taille.h / (2 * cible.s), s: cible.s };
    var t0 = null, duree = 380;
    function pas(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / duree), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      var s = depart.s * Math.pow(arrivee.s / depart.s, e);
      var cx = depart.cx + (arrivee.cx - depart.cx) * e, cy = depart.cy + (arrivee.cy - depart.cy) * e;
      poser({ x: cx - taille.l / (2 * s), y: cy - taille.h / (2 * s), s: s });
      anim = p < 1 ? requestAnimationFrame(pas) : null;
    }
    anim = requestAnimationFrame(pas);
  }

  /* ---------- Mini-carte ---------- */
  function dimensionnerMini() {
    var l = 156, h = l * carte.hauteur / carte.largeur;
    if (h > 140) { h = 140; l = h * carte.largeur / carte.hauteur; }
    miniCarte.style.width = l + "px";
    miniCarte.style.height = h + "px";
  }

  function cadreMini() {
    var l = miniCarte.clientWidth, h = miniCarte.clientHeight;
    if (!l) return;
    var kx = l / carte.largeur, ky = h / carte.hauteur;
    var x0 = Math.max(0, v.x), y0 = Math.max(0, v.y);
    var x1 = Math.min(carte.largeur, v.x + taille.l / v.s), y1 = Math.min(carte.hauteur, v.y + taille.h / v.s);
    miniCadre.style.left = x0 * kx + "px";
    miniCadre.style.top = y0 * ky + "px";
    miniCadre.style.width = Math.max(6, (x1 - x0) * kx) + "px";
    miniCadre.style.height = Math.max(6, (y1 - y0) * ky) + "px";
  }

  mini.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
  mini.addEventListener("click", function (e) {
    interaction();
    var r = miniCarte.getBoundingClientRect();
    var ux = (e.clientX - r.left) / r.width * carte.largeur, uy = (e.clientY - r.top) / r.height * carte.hauteur;
    animer(borner({ x: ux - taille.l / (2 * v.s), y: uy - taille.h / (2 * v.s), s: v.s }));
  });

  /* ---------- Souris, doigts, molette, clavier ---------- */
  var astuceVue = false;
  function interaction() {
    if (astuceVue) return;
    astuceVue = true;
    astuce.hidden = true;
  }

  var pointeurs = {}, geste = null;
  function liste() { return Object.keys(pointeurs).map(function (k) { return pointeurs[k]; }); }
  function local(p) { var r = vue.getBoundingClientRect(); return { x: p.x - r.left, y: p.y - r.top }; }
  function debutGeste() {
    var p = liste();
    if (p.length === 1) geste = { type: "glisse", x: p[0].x, y: p[0].y, v: { x: v.x, y: v.y, s: v.s } };
    else if (p.length >= 2) {
      var a = p[0], b = p[1];
      geste = { type: "pince", d: Math.hypot(a.x - b.x, a.y - b.y) || 1, m: local({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }), v: { x: v.x, y: v.y, s: v.s } };
    } else geste = null;
  }

  vue.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".mm-outils, .mm-mini") || (e.pointerType === "mouse" && e.button !== 0)) return;
    interaction();
    arreter();
    pointeurs[e.pointerId] = { x: e.clientX, y: e.clientY };
    try { vue.setPointerCapture(e.pointerId); } catch (err) { /* sans capture */ }
    vue.classList.add("est-glisse");
    debutGeste();
  });
  vue.addEventListener("pointermove", function (e) {
    if (!pointeurs[e.pointerId] || !geste) return;
    pointeurs[e.pointerId] = { x: e.clientX, y: e.clientY };
    var p = liste();
    if (geste.type === "glisse" && p.length === 1) {
      poser({ x: geste.v.x - (p[0].x - geste.x) / geste.v.s, y: geste.v.y - (p[0].y - geste.y) / geste.v.s, s: geste.v.s });
    } else if (geste.type === "pince" && p.length >= 2) {
      var a = p[0], b = p[1], d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      var m = local({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      var s = Math.max(zoomMin, Math.min(ZOOM_MAX, geste.v.s * d / geste.d));
      var ux = geste.v.x + geste.m.x / geste.v.s, uy = geste.v.y + geste.m.y / geste.v.s;
      poser({ x: ux - m.x / s, y: uy - m.y / s, s: s });
    }
  });
  function finPointeur(e) {
    if (!pointeurs[e.pointerId]) return;
    delete pointeurs[e.pointerId];
    if (!liste().length) vue.classList.remove("est-glisse");
    debutGeste();
  }
  vue.addEventListener("pointerup", finPointeur);
  vue.addEventListener("pointercancel", finPointeur);

  vue.addEventListener("wheel", function (e) {
    if (!svg) return;
    e.preventDefault();
    interaction();
    arreter();
    var dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? taille.h : 1);
    var p = local({ x: e.clientX, y: e.clientY });
    poser(zoomer(Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0015)), p.x, p.y));
  }, { passive: false });

  vue.addEventListener("keydown", function (e) {
    if (!svg || e.target !== vue || e.altKey || e.metaKey || e.ctrlKey) return;
    var pas = 80 / v.s, c = null;
    if (e.key === "+" || e.key === "=") c = zoomer(1.25);
    else if (e.key === "-" || e.key === "_") c = zoomer(0.8);
    else if (e.key === "0") { c = ajustement(); marquer("s0"); }
    else if (e.key === "ArrowLeft") c = { x: v.x - pas, y: v.y, s: v.s };
    else if (e.key === "ArrowRight") c = { x: v.x + pas, y: v.y, s: v.s };
    else if (e.key === "ArrowUp") c = { x: v.x, y: v.y - pas, s: v.s };
    else if (e.key === "ArrowDown") c = { x: v.x, y: v.y + pas, s: v.s };
    if (!c) return;
    e.preventDefault();
    interaction();
    animer(borner(c));
  });

  /* ---------- Barre d'outils ---------- */
  racine.querySelectorAll("[data-action]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!svg) return;
      interaction();
      var a = b.getAttribute("data-action");
      if (a === "plus") animer(borner(zoomer(1.25)));
      else if (a === "moins") animer(borner(zoomer(0.8)));
      else if (a === "ajuster") { marquer("s0"); animer(ajustement()); }
      else if (a === "plein") basculerPleinEcran();
    });
  });

  var pleinPossible = document.fullscreenEnabled || document.webkitFullscreenEnabled;
  if (!pleinPossible) boutonPlein.hidden = true;
  function enPleinEcran() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function basculerPleinEcran() {
    if (enPleinEcran()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else (vue.requestFullscreen || vue.webkitRequestFullscreen).call(vue);
  }
  function majPleinEcran() {
    boutonPlein.setAttribute("aria-label", enPleinEcran() ? "Quitter le plein écran" : "Plein écran");
  }
  document.addEventListener("fullscreenchange", majPleinEcran);
  document.addEventListener("webkitfullscreenchange", majPleinEcran);

  /* ---------- Redimensionnement : même centre, même zoom ---------- */
  function redimensionner() {
    if (!svg || !vue.clientWidth) { mesurer(); return; }
    var cx = v.x + taille.l / (2 * v.s), cy = v.y + taille.h / (2 * v.s), s = v.s;
    mesurer();
    ajustement();
    s = Math.max(s, zoomMin);
    poser({ x: cx - taille.l / (2 * s), y: cy - taille.h / (2 * s), s: s });
  }

  /* ---------- Démarrage (tablette et ordinateur seulement) ---------- */
  var demarre = false;
  function demarrer() {
    if (demarre) return;
    demarre = true;
    mesurer();
    if (window.ResizeObserver) new ResizeObserver(redimensionner).observe(vue);
    else window.addEventListener("resize", redimensionner);
    var q = new URLSearchParams(location.search);
    choisir(q.get("niveau"), q.get("carte"));
  }
  var grand = window.matchMedia("(min-width: 768px)");
  if (grand.matches) demarrer();
  else if (grand.addEventListener) grand.addEventListener("change", function (e) { if (e.matches) demarrer(); });
})();
