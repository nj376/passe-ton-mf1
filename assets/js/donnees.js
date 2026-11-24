/* Exporter / importer mes données : sauvegarde dans un fichier et continuité entre appareils,
   sans compte ni serveur. Utilisé sur la page Suivi (« Mes données »).
   Attend un bloc [data-donnees] (boutons [data-exporter], [data-importer], message [data-donnees-message])
   et la fenêtre de confirmation « fenetre-import » (partials/fenetres/import.html). */
(function () {
  "use strict";
  var zone = document.querySelector("[data-donnees]");
  if (!zone) return;

  /* ---------- Exporter / importer mes données (sans compte ni serveur) ---------- */
  // Le fichier contient toutes les clés du site, en texte brut, avec un numéro de version de format.
  var FORMAT = "passe-ton-mf1";
  var VERSION = 1;
  function cleDuSite(c) { return c.indexOf("ptmf1:") === 0 || c === "ptmf1-construire"; }
  function clesDuSite() {
    var cles = [];
    try {
      for (var i = 0; i < localStorage.length; i++) { var c = localStorage.key(i); if (c && cleDuSite(c)) cles.push(c); }
    } catch (e) { /* stockage refusé */ }
    return cles;
  }
  var message = zone.querySelector("[data-donnees-message]");
  function dire(texte, erreur) {
    message.textContent = texte;
    message.classList.toggle("donnees__message--erreur", !!erreur);
  }
  function aujourdhui(sep) {
    var d = new Date(), z = function (n) { return (n < 10 ? "0" : "") + n; };
    return sep === "-" ? d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()) : z(d.getDate()) + "/" + z(d.getMonth() + 1) + "/" + d.getFullYear();
  }
  function lireJson(brut, defaut) { try { return JSON.parse(brut); } catch (e) { return defaut; } }
  // Résumé lisible du contenu d'une sauvegarde (clé → texte brut).
  function resumer(donnees) {
    var p = [];
    var themes = lireJson(donnees["ptmf1:themes"], []);
    if (Array.isArray(themes) && themes.length) p.push(themes.length + " thème" + (themes.length > 1 ? "s" : "") + " préparé" + (themes.length > 1 ? "s" : ""));
    var cartes = lireJson(donnees["ptmf1:cartes"], {});
    var vues = cartes && (cartes.cartes || cartes.boites) ? Object.keys(cartes.cartes || cartes.boites).length : 0; // version 2 : cartes ; version 1 : boites
    if (vues) p.push(vues + " carte" + (vues > 1 ? "s" : "") + " de Flashcard MFT déjà vue" + (vues > 1 ? "s" : ""));
    var capa = lireJson(donnees["ptmf1:capa"], {});
    var nCapa = capa && capa.reponses ? Object.keys(capa.reponses).length : 0;
    if (nCapa) p.push(nCapa + " rubrique" + (nCapa > 1 ? "s" : "") + " du module capacitaire évaluée" + (nCapa > 1 ? "s" : ""));
    var cds = lireJson(donnees["ptmf1:cds"], {});
    var nCds = cds && cds.reponses ? Object.keys(cds.reponses).length : 0;
    if (nCds) p.push(nCds + " réponse" + (nCds > 1 ? "s" : "") + " aux questions du Code du sport");
    var rech = lireJson(donnees["ptmf1:recherche"], {});
    var nRech = rech && Array.isArray(rech.temps) ? rech.temps.length : 0;
    if (nRech) p.push(nRech + " recherche" + (nRech > 1 ? "s" : "") + " chronométrée" + (nRech > 1 ? "s" : ""));
    var canvas = lireJson(donnees["ptmf1:canvas"], {});
    var nCanvas = canvas && Array.isArray(canvas.seances) ? canvas.seances.length : 0;
    if (nCanvas) p.push(nCanvas + " séance" + (nCanvas > 1 ? "s" : "") + " du Storyboard");
    var livret = lireJson(donnees["ptmf1:livret"], {});
    var nLivret = 0;
    if (livret && livret.modules) Object.keys(livret.modules).forEach(function (k) { if (Array.isArray(livret.modules[k])) nLivret += livret.modules[k].length; });
    if (nLivret) p.push(nLivret + " séance" + (nLivret > 1 ? "s" : "") + " recopiée" + (nLivret > 1 ? "s" : "") + " de ton livret pédagogique");
    var cours = lireJson(donnees["ptmf1-construire"], null);
    if (cours && typeof cours === "object") p.push("une préparation de cours" + (cours.titre ? " (« " + cours.titre + " »)" : ""));
    var examen = donnees["ptmf1:examen"];
    if (examen && /^\d{4}-\d{2}-\d{2}$/.test(examen)) p.push("ta date d’examen (" + examen.split("-").reverse().join("/") + ")");
    return p;
  }

  var boutonExporter = zone.querySelector("[data-exporter]");
  if (boutonExporter) boutonExporter.addEventListener("click", function () {
    var donnees = {};
    try { clesDuSite().forEach(function (c) { donnees[c] = localStorage.getItem(c); }); } catch (e) { /* rien */ }
    if (!resumer(donnees).length) { dire("Rien à sauvegarder pour l’instant : prépare un thème, révise quelques cartes ou enregistre ta date d’examen d’abord."); return; }
    var fichier = { format: FORMAT, version: VERSION, date: new Date().toISOString(), donnees: donnees };
    var blob = new Blob([JSON.stringify(fichier, null, 2)], { type: "application/json" });
    var lien = document.createElement("a");
    lien.href = URL.createObjectURL(blob);
    lien.download = "passe-ton-mf1-sauvegarde-" + aujourdhui("-") + ".json";
    document.body.appendChild(lien);
    lien.click();
    setTimeout(function () { URL.revokeObjectURL(lien.href); lien.remove(); }, 1000);
    dire("Fichier « " + lien.download + " » téléchargé. Garde-le, ou importe-le sur ton autre appareil.");
  });

  var aImporter = null;
  var champImport = zone.querySelector("[data-importer]");
  if (champImport) champImport.addEventListener("change", function () {
    var f = champImport.files && champImport.files[0];
    champImport.value = "";
    aImporter = null;
    if (!f) return;
    var lecteur = new FileReader();
    lecteur.onload = function () {
      var contenu = lireJson(lecteur.result, null);
      var valide = contenu && contenu.format === FORMAT && typeof contenu.donnees === "object" && contenu.donnees !== null;
      if (valide && contenu.version > VERSION) {
        dire("Ce fichier vient d’une version plus récente du site. Recharge la page, puis réessaie. Aucune donnée n’a été modifiée.", true);
        return;
      }
      var donnees = {};
      if (valide) Object.keys(contenu.donnees).forEach(function (c) {
        if (cleDuSite(c) && typeof contenu.donnees[c] === "string") donnees[c] = contenu.donnees[c];
      });
      var resume = valide ? resumer(donnees) : [];
      if (!resume.length) {
        dire("Ce fichier n’est pas une sauvegarde de Passe-ton-MF1 valide, ou il est vide. Aucune donnée n’a été modifiée.", true);
        return;
      }
      aImporter = donnees;
      var date = new Date(contenu.date);
      document.querySelector("[data-import-resume]").textContent =
        "Sauvegarde" + (isNaN(date) ? "" : " du " + date.toLocaleDateString("fr-FR")) + " : " + resume.join(", ") + ".";
      if (window.Interface) window.Interface.ouvrirFenetre("fenetre-import");
    };
    lecteur.onerror = function () { dire("Ce fichier n’a pas pu être lu. Aucune donnée n’a été modifiée.", true); };
    lecteur.readAsText(f);
  });
  var confirmerImport = document.querySelector("[data-import-confirmer]");
  if (confirmerImport) confirmerImport.addEventListener("click", function () {
    if (window.Interface) window.Interface.fermerFenetre(confirmerImport.closest("dialog"));
    if (!aImporter) return;
    // Copie des données actuelles : remises en place si l'écriture échoue en cours de route (stockage plein).
    var avant = {};
    try { clesDuSite().forEach(function (c) { avant[c] = localStorage.getItem(c); }); } catch (e) { /* rien */ }
    try {
      clesDuSite().forEach(function (c) { localStorage.removeItem(c); });
      Object.keys(aImporter).forEach(function (c) { localStorage.setItem(c, aImporter[c]); });
    } catch (e) {
      try {
        clesDuSite().forEach(function (c) { localStorage.removeItem(c); });
        Object.keys(avant).forEach(function (c) { localStorage.setItem(c, avant[c]); });
      } catch (e2) { /* rien de plus à faire */ }
      dire("Ce navigateur refuse l’enregistrement (navigation privée ?) : l’import n’a pas pu se faire.", true);
      return;
    }
    aImporter = null;
    dire("Sauvegarde restaurée le " + aujourdhui("/") + ". Ton suivi est à jour sur cet appareil.");
    // La page met à jour ce qu’elle affiche (compteurs de l’accueil).
    document.dispatchEvent(new CustomEvent("ptmf1:donnees-importees"));
  });
})();
