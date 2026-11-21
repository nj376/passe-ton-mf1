/* Page « Construire ma progression détaillée » : formulaire enregistré dans ce navigateur,
   rappel du dernier enregistrement, impression et copie de tous les textes.
   Clé « ptmf1-construire » : incluse dans la sauvegarde et effacée par « Tout effacer » (page Suivi). */
(function () {
  "use strict";
  var racine = document.querySelector("[data-construire]");
  if (!racine) return;

  var CLE = "ptmf1-construire";
  var donnees = [];
  try { donnees = JSON.parse(document.getElementById("donnees-construire").textContent); } catch (e) { donnees = []; }
  function competence(id) { return donnees.filter(function (c) { return c.id === id; })[0] || null; }

  var CHAMPS = [
    ["titre", "Rappel du titre"],
    ["objectif", "Objectif du cours"],
    ["prerogatives", "Prérogatives"],
    ["justification", "Justification"],
    ["position", "Position du cours dans la formation"],
    ["materiels", "Moyens matériels"],
    ["humains", "Moyens humains"],
    ["savoir", "Savoir"],
    ["savoirFaire", "Savoir-faire"],
    ["savoirEtre", "Savoir-être"],
    ["criteres", "Critères d’évaluation"],
    ["prochain", "Prochain cours"],
    ["commentaire", "Commentaire"]
  ];
  function champ(nom) { return racine.querySelector('[data-champ="' + nom + '"]'); }

  var choix = racine.querySelector("[data-competence]");
  var zoneEtapes = racine.querySelector("[data-etapes]");
  var etat = racine.querySelector("[data-etat]");
  var boutonRappel = racine.querySelector("[data-rappel]");
  var titreAuto = ""; // titre proposé automatiquement (remplacé tant que l’utilisateur ne l’a pas modifié)

  /* ---------- Stockage (protégé : navigation privée, stockage refusé) ---------- */
  function lireSauvegarde() {
    try { var b = window.localStorage.getItem(CLE); return b ? JSON.parse(b) : null; } catch (e) { return null; }
  }
  function ecrireSauvegarde(v) {
    try { window.localStorage.setItem(CLE, JSON.stringify(v)); return true; } catch (e) { return false; }
  }

  /* ---------- Point de départ ---------- */
  function afficherCompetence(id, garderTitre) {
    var c = competence(id);
    var bloc = racine.querySelector("[data-arrivee]");
    if (!c) { bloc.hidden = true; return; }
    racine.querySelector("[data-arrivee-titre]").textContent = c.arriveeTitre || "Point d’arrivée fixé par le MFT";
    racine.querySelector("[data-arrivee-texte]").textContent = c.arrivee || "";
    bloc.hidden = !c.arrivee;
    var t = champ("titre");
    if (!garderTitre && (t.value === "" || t.value === titreAuto)) {
      t.value = c.competence;
    }
    titreAuto = c.competence;
  }
  choix.addEventListener("change", function () { afficherCompetence(choix.value, false); enregistrer(); });

  /* ---------- Étapes de la progression ---------- */
  function renumeroter() {
    var items = Array.prototype.slice.call(zoneEtapes.children);
    items.forEach(function (li, i) {
      var n = i + 1;
      li.querySelector(".construire__etape-num").textContent = "Étape " + n;
      var zone = li.querySelector("textarea");
      zone.id = "c-etape-" + n;
      li.querySelector("label").setAttribute("for", zone.id);
      li.querySelector("[data-monter]").disabled = i === 0;
      li.querySelector("[data-descendre]").disabled = i === items.length - 1;
      li.querySelector("[data-monter]").setAttribute("aria-label", "Monter l’étape " + n);
      li.querySelector("[data-descendre]").setAttribute("aria-label", "Descendre l’étape " + n);
      li.querySelector("[data-supprimer]").setAttribute("aria-label", "Supprimer l’étape " + n);
    });
  }
  function ajouterEtape(texte, focaliser) {
    var li = document.createElement("li");
    li.className = "construire__etape";
    li.innerHTML =
      '<div class="construire__etape-tete">' +
        '<label class="champ__nom construire__etape-num"></label>' +
        '<span class="construire__etape-outils">' +
          '<button type="button" class="construire__outil" data-monter>↑</button>' +
          '<button type="button" class="construire__outil" data-descendre>↓</button>' +
          '<button type="button" class="construire__outil bouton-rouge" data-supprimer>Supprimer</button>' +
        "</span>" +
      "</div>" +
      '<textarea class="champ__texte" data-etape></textarea>';
    li.querySelector("textarea").value = texte || "";
    zoneEtapes.appendChild(li);
    renumeroter();
    if (focaliser) li.querySelector("textarea").focus();
  }
  function lireEtapes() {
    return Array.prototype.slice.call(zoneEtapes.querySelectorAll("[data-etape]")).map(function (t) { return t.value; });
  }
  function ecrireEtapes(liste) {
    zoneEtapes.innerHTML = "";
    (liste && liste.length ? liste : [""]).forEach(function (t) { ajouterEtape(t, false); });
  }
  racine.querySelector("[data-ajouter]").addEventListener("click", function () { ajouterEtape("", true); enregistrer(); });
  zoneEtapes.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var li = b.closest("li");
    if (b.hasAttribute("data-monter") && li.previousElementSibling) {
      zoneEtapes.insertBefore(li, li.previousElementSibling);
    } else if (b.hasAttribute("data-descendre") && li.nextElementSibling) {
      zoneEtapes.insertBefore(li.nextElementSibling, li);
    } else if (b.hasAttribute("data-supprimer")) {
      var voisin = li.nextElementSibling || li.previousElementSibling;
      li.remove();
      if (!zoneEtapes.children.length) ajouterEtape("", false);
      renumeroter();
      var cible = (voisin && voisin.isConnected ? voisin : zoneEtapes.lastElementChild).querySelector("textarea");
      cible.focus();
      enregistrer();
      return;
    } else {
      return;
    }
    renumeroter();
    b.disabled ? li.querySelector("textarea").focus() : b.focus();
    enregistrer();
  });

  /* ---------- Lecture / écriture du formulaire ---------- */
  function lireFormulaire() {
    var v = { competence: choix.value, etapes: lireEtapes(), schemas: schemas.slice(), date: new Date().toISOString() };
    CHAMPS.forEach(function (c) { v[c[0]] = champ(c[0]).value; });
    return v;
  }
  function remplirFormulaire(v) {
    choix.value = v.competence || "";
    CHAMPS.forEach(function (c) { champ(c[0]).value = v[c[0]] || ""; });
    afficherCompetence(choix.value, true);
    ecrireEtapes(v.etapes);
    schemas = (v.schemas || []).slice(0, MAX_SCHEMAS);
    afficherSchemas();
  }
  /* ---------- Enregistrement automatique ---------- */
  function dateLisible(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    var z = function (n) { return (n < 10 ? "0" : "") + n; };
    return z(d.getDate()) + "/" + z(d.getMonth() + 1) + "/" + d.getFullYear() + " à " + z(d.getHours()) + "h" + z(d.getMinutes());
  }
  var minuterie = null;
  // Un enregistrement précédent existe et n'a pas été rappelé : on demande avant de l'écraser.
  var protegee = false, refusee = false;
  function enregistrer() {
    if (refusee) return;
    if (protegee) {
      if (window.Interface) window.Interface.ouvrirFenetre("fenetre-ecraser-construire");
      return;
    }
    clearTimeout(minuterie);
    minuterie = setTimeout(function () {
      var v = lireFormulaire();
      if (ecrireSauvegarde(v)) {
        etat.textContent = "Dernier enregistrement : le " + dateLisible(v.date) + ".";
        boutonRappel.hidden = true;
      } else if (v.schemas.length && ecrireSauvegarde(Object.assign({}, v, { schemas: [] }))) {
        etat.textContent = "Enregistré le " + dateLisible(v.date) + ", sans les images : elles sont trop lourdes pour ce navigateur. Elles restent affichées et seront imprimées tant que la page reste ouverte.";
      } else {
        etat.textContent = "Ce navigateur refuse l’enregistrement (navigation privée ?). Pense à imprimer ou copier ta progression.";
      }
    }, 600);
  }
  racine.addEventListener("input", function (e) {
    if (e.target.matches("[data-champ], [data-etape]")) enregistrer();
  });

  /* ---------- Rappel du dernier enregistrement ---------- */
  var sauvegarde = lireSauvegarde();
  if (sauvegarde) {
    var c = competence(sauvegarde.competence);
    etat.textContent = "Dernier enregistrement : « " + (sauvegarde.titre || (c && c.competence) || "sans titre") + " », le " + dateLisible(sauvegarde.date) + ".";
    boutonRappel.hidden = false;
    protegee = true;
    var nomAncien = document.querySelector("[data-ecraser-nom]");
    if (nomAncien) nomAncien.textContent = "« " + (sauvegarde.titre || (c && c.competence) || "sans titre") + " », enregistrée le " + dateLisible(sauvegarde.date);
  }
  var ecraser = document.querySelector("[data-ecraser-confirmer]");
  if (ecraser) ecraser.addEventListener("click", function () {
    if (window.Interface) window.Interface.fermerFenetre(ecraser.closest("dialog"));
    protegee = false; refusee = false;
    enregistrer();
  });
  var garder = document.querySelector("[data-ecraser-annuler]");
  if (garder) garder.addEventListener("click", function () {
    refusee = true;
    etat.textContent = "Ta saisie n’est pas enregistrée : ton dernier enregistrement est conservé. Rappelle-le, ou imprime ce que tu viens d’écrire.";
  });
  var confirmer = document.querySelector("[data-rappel-confirmer]");
  if (confirmer) {
    confirmer.addEventListener("click", function () {
      var s = lireSauvegarde();
      if (window.Interface) window.Interface.fermerFenetre(confirmer.closest("dialog"));
      if (!s) return;
      protegee = false; refusee = false;
      remplirFormulaire(s);
      etat.textContent = "Dernier enregistrement rappelé (" + dateLisible(s.date) + ").";
      boutonRappel.hidden = true;
      champ("titre").focus();
    });
  }

  /* ---------- Tout effacer : champs, étapes, images et enregistrement ---------- */
  var effacer = document.querySelector("[data-effacer-confirmer]");
  if (effacer) {
    effacer.addEventListener("click", function () {
      if (window.Interface) window.Interface.fermerFenetre(effacer.closest("dialog"));
      clearTimeout(minuterie);
      protegee = false; refusee = false;
      try { window.localStorage.removeItem(CLE); } catch (e) { /* rien */ }
      CHAMPS.forEach(function (c) { champ(c[0]).value = ""; });
      titreAuto = "";
      afficherCompetence(choix.value, false);
      ecrireEtapes([""]);
      schemas = [];
      afficherSchemas();
      alerteImage.textContent = "";
      boutonRappel.hidden = true;
      etat.textContent = "Tout a été effacé.";
      champ("titre").focus();
    });
  }

  /* ---------- Schémas (images JPG ou PNG, réduites puis gardées avec le cours) ---------- */
  var MAX_SCHEMAS = 4;
  var schemas = []; // [{ image: "data:image/jpeg;base64,…", legende: "" }]
  var listeSchemas = racine.querySelector("[data-schemas]");
  var champImage = racine.querySelector("[data-ajouter-image]");
  var alerteImage = racine.querySelector("[data-alerte-image]");
  function afficherSchemas() {
    listeSchemas.innerHTML = "";
    schemas.forEach(function (s, i) {
      var li = document.createElement("li");
      li.className = "construire__schema";
      var img = document.createElement("img");
      img.src = s.image;
      img.alt = s.legende ? "Schéma : " + s.legende : "Schéma " + (i + 1);
      var droite = document.createElement("div");
      droite.className = "construire__schema-infos";
      var lbl = document.createElement("label");
      lbl.className = "champ__nom";
      lbl.setAttribute("for", "c-legende-" + i);
      lbl.textContent = "Légende du schéma " + (i + 1);
      var champL = document.createElement("input");
      champL.type = "text";
      champL.id = "c-legende-" + i;
      champL.className = "construire__ligne construire__ligne--fine";
      champL.value = s.legende || "";
      champL.addEventListener("input", function () { s.legende = champL.value; img.alt = "Schéma : " + champL.value; enregistrer(); });
      var suppr = document.createElement("button");
      suppr.type = "button";
      suppr.className = "construire__outil bouton-rouge";
      suppr.textContent = "Retirer l’image";
      suppr.addEventListener("click", function () {
        schemas.splice(i, 1);
        afficherSchemas();
        enregistrer();
        champImage.focus();
      });
      droite.appendChild(lbl);
      droite.appendChild(champL);
      droite.appendChild(suppr);
      li.appendChild(img);
      li.appendChild(droite);
      listeSchemas.appendChild(li);
    });
    champImage.disabled = schemas.length >= MAX_SCHEMAS;
    champImage.closest("label").classList.toggle("construire__fichier--inactif", champImage.disabled);
  }
  // Réduit l’image (1600 px de côté au plus) pour qu’elle tienne dans l’enregistrement du navigateur.
  function reduire(fichier, fini) {
    var lecteur = new FileReader();
    lecteur.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 1600;
        var k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var toile = document.createElement("canvas");
        toile.width = Math.round(img.naturalWidth * k);
        toile.height = Math.round(img.naturalHeight * k);
        var ctx = toile.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, toile.width, toile.height);
        ctx.drawImage(img, 0, 0, toile.width, toile.height);
        var png = toile.toDataURL("image/png");
        var jpg = toile.toDataURL("image/jpeg", 0.85);
        fini(png.length < jpg.length ? png : jpg); // un schéma au trait reste net en PNG
      };
      img.onerror = function () { fini(null); };
      img.src = lecteur.result;
    };
    lecteur.onerror = function () { fini(null); };
    lecteur.readAsDataURL(fichier);
  }
  champImage.addEventListener("change", function () {
    var fichier = champImage.files && champImage.files[0];
    champImage.value = "";
    alerteImage.textContent = "";
    if (!fichier) return;
    if (!/^image\/(jpeg|png)$/.test(fichier.type)) {
      alerteImage.textContent = "Seules les images JPG ou PNG sont acceptées.";
      return;
    }
    reduire(fichier, function (image) {
      if (!image) { alerteImage.textContent = "Cette image n’a pas pu être lue."; return; }
      schemas.push({ image: image, legende: "" });
      afficherSchemas();
      enregistrer();
      var l = listeSchemas.querySelector("li:last-child input");
      if (l) l.focus();
    });
  });

  /* ---------- Texte complet (impression et copie) ---------- */
  function sections() {
    var v = lireFormulaire();
    var c = competence(v.competence);
    var s = [];
    if (c) s.push({ titre: "Compétence", texte: c.niveau + " · " + c.competence });
    if (c && c.arrivee) s.push({ titre: c.arriveeTitre || "Point d’arrivée fixé par le MFT", texte: c.arrivee });
    CHAMPS.slice(1, 7).forEach(function (k) { if (v[k[0]].trim()) s.push({ titre: k[1], texte: v[k[0]].trim() }); });
    var contenu = CHAMPS.slice(7, 10).filter(function (k) { return v[k[0]].trim(); })
      .map(function (k) { return { titre: k[1], texte: v[k[0]].trim() }; });
    if (contenu.length) s.push({ titre: "Contenu de formation", sous: contenu });
    var etapes = v.etapes.map(function (t) { return t.trim(); }).filter(Boolean);
    if (etapes.length) s.push({ titre: "Progression", etapes: etapes });
    CHAMPS.slice(10).forEach(function (k) { if (v[k[0]].trim()) s.push({ titre: k[1], texte: v[k[0]].trim() }); });
    if (v.schemas.length) s.push({ titre: v.schemas.length > 1 ? "Schémas" : "Schéma", schemas: v.schemas });
    return { titre: v.titre.trim() || (c && c.competence) || "Ma progression", sections: s };
  }

  function texteComplet() {
    var d = sections();
    var l = [d.titre.toUpperCase(), ""];
    d.sections.forEach(function (s) {
      l.push(s.titre);
      if (s.texte) l.push(s.texte);
      if (s.sous) s.sous.forEach(function (x) { l.push("- " + x.titre + " : " + x.texte.replace(/\n+/g, " ")); });
      if (s.etapes) s.etapes.forEach(function (t, i) { l.push((i + 1) + ". " + t.replace(/\n+/g, " ")); });
      if (s.schemas) s.schemas.forEach(function (x, i) { l.push("Schéma " + (i + 1) + (x.legende ? " : " + x.legende : "") + " (joint à la version imprimée)"); });
      l.push("");
    });
    l.push("Mon draft de cours, préparé avec passe-ton-mf1.com.");
    return l.join("\n");
  }

  function el(tag, cls, texte) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texte !== undefined) e.textContent = texte;
    return e;
  }
  function preparerImpression() {
    var d = sections();
    var zone = document.querySelector("[data-impression]");
    zone.innerHTML = "";
    var tete = el("div", "impression__tete");
    tete.appendChild(el("p", "impression__sur", "Mon draft de cours · " + dateLisible(new Date().toISOString()).split(" à ")[0]));
    tete.appendChild(el("h1", "impression__titre", d.titre));
    zone.appendChild(tete);
    d.sections.forEach(function (s) {
      var b = el("section", "impression__bloc");
      b.appendChild(el("h2", "impression__rubrique", s.titre));
      if (s.texte) b.appendChild(el("p", "impression__texte", s.texte));
      if (s.sous) s.sous.forEach(function (x) {
        b.appendChild(el("h3", "impression__sous", x.titre));
        b.appendChild(el("p", "impression__texte", x.texte));
      });
      if (s.etapes) {
        var ol = el("ol", "impression__etapes");
        s.etapes.forEach(function (t) { ol.appendChild(el("li", "impression__texte", t)); });
        b.appendChild(ol);
      }
      if (s.schemas) s.schemas.forEach(function (x) {
        var fig = el("figure", "impression__schema");
        var img = document.createElement("img");
        img.src = x.image;
        img.alt = x.legende || "";
        fig.appendChild(img);
        if (x.legende) fig.appendChild(el("figcaption", "", x.legende));
        b.appendChild(fig);
      });
      zone.appendChild(b);
    });
    var notes = el("section", "impression__bloc impression__notes");
    notes.appendChild(el("h2", "impression__rubrique", "Remarques du tuteur MF2"));
    zone.appendChild(notes);
    zone.appendChild(el("p", "impression__pied", "Préparé avec passe-ton-mf1.com"));
  }
  window.addEventListener("beforeprint", preparerImpression);
  racine.querySelector("[data-imprimer]").addEventListener("click", function () {
    preparerImpression();
    window.print();
  });

  /* ---------- Copie ---------- */
  var retourCopie = racine.querySelector("[data-copie]");
  function copieFaite(ok) {
    retourCopie.textContent = ok ? "Textes copiés : colle-les dans ton e-mail." : "La copie a échoué : sélectionne le texte imprimé à la place.";
    setTimeout(function () { retourCopie.textContent = ""; }, 5000);
  }
  function copieDeSecours(texte) {
    var zone = document.createElement("textarea");
    zone.value = texte;
    zone.setAttribute("readonly", "");
    zone.style.position = "fixed";
    zone.style.opacity = "0";
    document.body.appendChild(zone);
    zone.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    zone.remove();
    return ok;
  }
  racine.querySelector("[data-copier]").addEventListener("click", function () {
    var texte = texteComplet();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(function () { copieFaite(true); }, function () { copieFaite(copieDeSecours(texte)); });
    } else {
      copieFaite(copieDeSecours(texte));
    }
  });

  /* ---------- Démarrage : seule la compétence d’origine est reprise ---------- */
  var demande = (new URLSearchParams(location.search).get("competence") || "").toLowerCase();
  if (competence(demande)) choix.value = demande;
  afficherCompetence(choix.value, false);
  ecrireEtapes([""]);
})();
