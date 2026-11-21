# Roadmap UX/UI · passe-ton-mf1.com

Document de travail issu de deux audits UX/UI (novembre 2026).
Les étapes sont classées de la plus urgente (plus fort impact) à la moins urgente, et regroupées en lots.

---

## ⛔ RÈGLE N°1 : N'EXÉCUTE QUE L'ÉTAPE DEMANDÉE

**Ce fichier est un catalogue, pas une liste de tâches à enchaîner.**

- Tu n'exécutes **que l'étape dont Philippe te donne explicitement l'identifiant** (exemple : « fais l'étape 1.3 »).
- Une fois cette étape terminée, **tu t'arrêtes**. Tu ne commences pas l'étape suivante, même si elle paraît évidente, petite ou liée.
- Tu ne fais pas « au passage » une partie d'une autre étape. Si tu remarques quelque chose qui relève d'une autre étape, tu le signales dans ton compte rendu, sans le faire.
- Si une étape demandée dépend d'une étape qui n'est pas marquée ✅ faite, tu le signales et tu demandes avant de commencer.
- Si une étape te semble ambiguë ou contredit l'état réel du code, tu poses la question avant de modifier quoi que ce soit.
- Si Philippe demande un lot entier (« fais le lot 2 »), tu demandes confirmation et tu traites les étapes **une par une**, avec un compte rendu et une validation entre chaque.

### Compte rendu attendu à la fin de chaque étape

1. Ce qui a été modifié (fichiers, en une ligne chacun).
2. Comment c'est vérifié (build Hugo, affichage desktop 1440 px et mobile 390 px, clavier).
3. Ce qui reste à valider par Philippe (textes, choix visuels).
4. Ce que tu as remarqué hors périmètre (sans l'avoir corrigé).
5. Puis : mets à jour le statut de l'étape dans ce fichier (☐ → ✅) et **arrête-toi**.

---

## Règles générales (valables pour toutes les étapes)

- **Une étape = un commit** (ou une PR), avec un message qui cite l'identifiant de l'étape.
- **Ne jamais modifier le contenu pédagogique** (textes repris du MFT, du Code du sport, fiches de compétences, progressions) sans demande explicite. Les étapes portent sur l'interface, la structure et les textes d'interface.
- **Ne jamais casser la progression existante des utilisateurs.** Les clés `localStorage` actuelles doivent rester lisibles. Si une structure change, prévoir une migration silencieuse.
- **Ne jamais casser une URL existante.** Si une page change d'adresse, ajouter une redirection (alias Hugo).
- **Conserver la sobriété technique** : site statique Hugo, pas de framework JS lourd, pas de bibliothèque d'animation, pas de traceur, rien envoyé à un serveur.
- **Conserver l'existant qui marche** : IBM Plex Sans, le tutoiement et le ton personnel, le responsive mobile actuel (puces de niveaux défilantes, accordéons), le lien d'évitement, le focus visible, le respect de `prefers-reduced-motion`.
- Vérifier chaque modification sur **desktop (≈1440 px)** et **mobile (390 px)**, et au **clavier** (Tab, Entrée, Échap).
- Pas de cadratin « — » dans les textes d'interface.

## Décisions déjà tranchées (ne pas les remettre en cause sans demander)

- La grille de préparation de « S'entraîner » reste **entièrement visible** (pas d'assistant pas à pas avec Précédent/Suivant). On ajoute une colonne latérale fixe et un indicateur d'avancement.
- Sur mobile, le choix du niveau reste en **puces défilantes** (pas de menu déroulant).
- La police reste **IBM Plex Sans**. Plex Mono est réservée aux chiffres qui bougent (chrono, temps chronométrés).
- La **courbe de plongée** est la signature visuelle du site. Pas de photos sous-marines, de bulles ou de poissons.
- Pas de comptes utilisateurs. La continuité passe par l'export/import.

---

## Vue d'ensemble

| Lot | Thème | Urgence |
|---|---|---|
| 0 | État des lieux (lecture seule) | Préalable |
| 1 | Corrections rapides à fort impact | Très haute |
| 2 | Atelier « S'entraîner » | Haute |
| 3 | Export / import (travail à montrer au tuteur) | Haute |
| 4 | Navigation et lisibilité | Moyenne |
| 5 | Réviser, CdS et suivi personnel | Moyenne |
| 6 | Accueil recentré sur la courbe | Après tests utilisateurs |
| 7 | Explore le MFT et page Progressions | Après tests utilisateurs |
| 8 | Identité visuelle et confort | Basse |

---

## LOT 0 · État des lieux (aucune modification de code)

### ✅ 0.1 · Inventaire technique
**Objectif :** comprendre le code avant d'y toucher.
**À faire :** produire un court rapport (dans la conversation, pas dans le dépôt) qui répond à :
- Structure du projet Hugo : layouts, partials, CSS, JS, données (où sont stockés MFT, CdS, progressions, cartes).
- Liste des clés `localStorage` utilisées et leur format.
- Comment fonctionne la redirection `/` → `/bienvenue/` (script ? condition ? les liens profonds sont-ils concernés ?).
- La grille de « S'entraîner » est-elle sauvegardée automatiquement ? Que se passe-t-il au rechargement de la page ?
- Où sont définis le menu principal, le pied de page et les balises `<head>`.
- Taille du HTML de `/progression/` et nombre d'éléments DOM : tous les niveaux sont-ils chargés d'un coup ?

**Critère de fin :** rapport livré. **Aucun fichier modifié.**

---

## LOT 1 · Corrections rapides à fort impact

### ✅ 1.1 · Balises de partage (description et image)
**Pourquoi :** les liens partagés dans les groupes de stagiaires s'affichent sans description ni image. C'est le principal canal de diffusion du site.
**À faire :**
- Une `meta description` par page (champ `description` dans le front matter, avec une valeur par défaut dans la config).
- Balises Open Graph et Twitter : `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale=fr_FR`.
- Une image de partage 1200 × 630 en SVG ou PNG statique : la courbe de plongée et le nom du site, sur fond marine. Pas de photo.

**Critères d'acceptation :** chaque page a une description unique ; l'aperçu fonctionne dans un validateur Open Graph ; aucune requête externe ajoutée.
**À valider par Philippe :** les textes de description.

### ✅ 1.2 · Lever l'ambiguïté du mot « Progression »
**Pourquoi :** « Progression » dans le menu mène à une progression pédagogique type, alors que « Ta progression » sur l'accueil désigne le suivi personnel.
**À faire :**
- Menu : « Progression » → **« Progressions types »**. Titre de page conservé (« Imaginer une progression ») ou aligné, au choix de Philippe.
- Accueil : bloc « Ta progression » → **« Mon suivi »**.
- Ne pas changer l'URL `/progression/` dans cette étape.

**Critères d'acceptation :** plus aucune occurrence de « progression » qui désigne le suivi personnel dans l'interface ; le menu tient sur une ligne en desktop.
**À valider par Philippe :** les deux libellés.

### ☐ 1.3 · Sauvegarde automatique de la grille « S'entraîner »
**Pré-requis :** résultat de 0.1. **Si la sauvegarde existe déjà**, se limiter à ajouter l'indicateur visible.
**Pourquoi :** perdre 25 minutes de rédaction à cause d'un rechargement ferait fuir n'importe qui.
**À faire :**
- Sauvegarde dans `localStorage` à chaque saisie (avec un délai de quelques centaines de millisecondes), associée au thème tiré.
- Restauration automatique au retour sur la page.
- Indicateur discret près de la grille : « Enregistré dans ce navigateur » (mis à jour après chaque sauvegarde, annoncé via `aria-live="polite"`).
- Bouton « Effacer ma grille » avec confirmation.

**Critères d'acceptation :** saisir, recharger la page, le texte est toujours là ; tirer un nouveau thème ne mélange pas les grilles.

### ✅ 1.4 · Supprimer l'écran d'entrée `/bienvenue/`
**Pré-requis :** 0.1.
**Pourquoi :** un clic obligatoire avant toute valeur, et un texte personnel adressé à quelqu'un qui n'a encore rien vu.
**À faire :**
- Supprimer la redirection vers `/bienvenue/`.
- Sur l'accueil, à la première visite seulement : un bandeau qu'on peut fermer, avec la phrase de présentation courte et les 4 usages (reprendre « Ce que tu trouveras »). Mémoriser la fermeture dans `localStorage`.
- Déplacer le texte personnel (mathématicien, Navier-Stokes) dans la page À propos.
- `/bienvenue/` redirige vers `/` (alias) pour ne pas casser les anciens liens.

**Critères d'acceptation :** `/` affiche directement l'accueil ; le bandeau apparaît une seule fois, se ferme au clavier (bouton accessible) et ne revient plus ; l'ancienne URL redirige.

### ☐ 1.5 · Regrouper les avertissements
**Pourquoi :** la même mise en garde apparaît jusqu'à six fois ; trop de répétition, les utilisateurs ne la lisent plus et le ton devient défensif.
**À faire :**
- Créer une page **« Méthode et limites »** qui contient le texte complet : pas une référence officielle, pas une banque de sujets, ne remplace pas le tuteur MF2, où trouver de vrais sujets, comment signaler une erreur.
- Pied de page : une mention courte et permanente, par exemple « Outil indépendant, non affilié à la FFESSM. Le MFT officiel fait foi. » avec un lien vers « Méthode et limites ».
- Accueil : supprimer la carte « Un pense-bête de stagiaire, pas une référence » et son encadré orange.
- « S'entraîner » : garder la ligne courte sous le thème tiré (elle est déjà au bon dosage).
- « Progressions types » : réduire l'encadré à deux phrases maximum (« Une piste de réflexion parmi d'autres, pas une réponse d'examen. Construis la tienne et fais-la valider par ton tuteur MF2. »).
- Supprimer les phrases entièrement en majuscules.
- Réserver le style encadré orange aux vraies alertes.

**Critères d'acceptation :** la mise en garde complète n'existe qu'à un endroit ; aucune page n'affiche plus d'un encadré d'avertissement ; la modale « Où trouver de vrais sujets » reste accessible.
**À valider par Philippe :** tous les textes.

---

## LOT 2 · Atelier « S'entraîner »

### ☐ 2.1 · Mise en page en deux colonnes (desktop)
**Pré-requis :** 1.3 ✅.
**Pourquoi :** la grille occupe la moitié de la largeur, l'autre moitié est vide, et le thème comme le chrono disparaissent au défilement.
**À faire :**
- À partir de ≈1024 px : grille à gauche (≈60 %), colonne à droite en `position: sticky` contenant le thème tiré et son contexte (lieu, élève), le chrono et ses commandes.
- La grille reste entièrement visible (voir « Décisions déjà tranchées »).

**Critères d'acceptation :** en remplissant la dernière rubrique, le thème et le chrono sont visibles sans défiler ; rien ne change sous 1024 px.

### ☐ 2.2 · Aide contextuelle dans la colonne latérale
**Pré-requis :** 2.1 ✅.
**À faire :** quand un champ reçoit le focus, la colonne latérale affiche l'aide de cette rubrique (le contenu actuel des boutons « ? »). Les boutons « ? » restent fonctionnels sur mobile.
**Critères d'acceptation :** l'aide suit le focus au clavier comme à la souris ; elle est annoncée aux lecteurs d'écran sans couper la saisie.

### ☐ 2.3 · Indicateur d'avancement de la grille
**À faire :** afficher « 3 / 8 rubriques remplies » (ou le nombre réel) avec une barre fine, dans la colonne latérale en desktop et en haut de la grille sur mobile.
**Critères d'acceptation :** le compteur se met à jour à la saisie et après restauration.

### ☐ 2.4 · Chrono compact persistant sur mobile
**À faire :** sous 1024 px, quand le chrono tourne et que sa carte sort de l'écran, afficher une barre compacte fixe en bas (temps restant, pause). Ne pas masquer les champs de saisie ni le clavier virtuel.
**Critères d'acceptation :** testé à 390 px ; la barre disparaît quand le chrono est arrêté.

### ☐ 2.5 · Comparaison avec le MFT après l'effort
**À faire :** vérifier que la comparaison n'est visible qu'après un clic sur « Comparer avec le MFT ». Sur desktop, afficher la comparaison en deux colonnes (« Ma séance » / « Repères du MFT ») ; sur mobile, en deux onglets.
**Critères d'acceptation :** aucune donnée du MFT n'est affichée avant le clic ; la saisie de l'utilisateur reste modifiable après la comparaison.

---

## LOT 3 · Export / import

### ✅ 3.1 · Version imprimable / PDF de la grille
**Pré-requis :** 1.3 ✅.
**Pourquoi :** transformer « ne remplace pas ton tuteur MF2 » en fonctionnalité : la grille devient un support à montrer au tuteur.
**À faire :**
- Bouton « Imprimer / enregistrer en PDF » sur « S'entraîner » (via `window.print()`).
- Feuille de style `@media print` : thème, contexte, date, rubriques et contenus ; sans menu, chrono ni boutons ; une mention discrète du site en bas de page.

**Critères d'acceptation :** l'aperçu d'impression tient proprement sur A4, lisible en noir et blanc.

### ✅ 3.2 · Export JSON de toutes les données
**À faire :** dans « Mon suivi » (ou une section « Mes données »), un bouton qui télécharge un fichier `passe-ton-mf1-sauvegarde-AAAA-MM-JJ.json` contenant toutes les clés `localStorage` du site, avec un numéro de version de format.
**Critères d'acceptation :** le fichier se télécharge sans aucun appel réseau.

### ✅ 3.3 · Import JSON
**Pré-requis :** 3.2 ✅.
**À faire :** bouton d'import avec vérification du format et de la version, aperçu de ce qui va être remplacé, confirmation, puis rechargement des données. En cas de fichier invalide, un message clair et aucune donnée touchée.
**Critères d'acceptation :** export depuis un navigateur, import dans un autre, tout est retrouvé.

---

## LOT 4 · Navigation et lisibilité

### ☐ 4.1 · En-tête fixe sur desktop
**À faire :** en-tête en `position: sticky` sur desktop (il l'est déjà sur mobile), en version compacte au défilement si besoin. Gérer `scroll-margin-top` pour les ancres.
**Critères d'acceptation :** pas de saut de mise en page ; les ancres ne passent pas sous l'en-tête.

### ☐ 4.2 · Onglets de niveau fixes sur « Explore le MFT »
**Pré-requis :** 4.1 ✅.
**À faire :** les onglets de niveau (et le sélecteur de phase en desktop) restent visibles au défilement, sous l'en-tête.

### ☐ 4.3 · Regrouper le menu en deux familles
**Pré-requis :** 1.2 ✅.
**À faire :** organiser le menu selon l'intention :
- **Comprendre** : Explore le MFT, Code du sport, Progressions types.
- **Pratiquer** : S'entraîner, Réviser.
- « À propos » et « Méthode et limites » passent dans le pied de page.
- « CdS » écrit en clair : « Code du sport ».

Les deux familles peuvent être de simples séparateurs visuels en desktop et des intertitres dans le menu mobile. Pas de menus déroulants imbriqués.
**À valider par Philippe :** une capture avant/après avant le commit.

### ☐ 4.4 · Bouton d'aide explicite
**À faire :** remplacer le bouton « ? » isolé du menu par « Aide » (texte et icône), avec un `aria-label` qui précise qu'il ouvre l'aide de la page en cours.

### ☐ 4.5 · Taille minimale des textes
**À faire :** tout texte qui informe (notes de tableau, mentions sous les boutons, étiquettes « Situation », « Pour passer à la suite », métadonnées des fiches) passe à **14 px minimum**. Le 12 px n'est conservé que pour les étiquettes courtes en capitales.
**Critères d'acceptation :** vérifier les pages Accueil, Progressions types, Code du sport, Réviser, en desktop et mobile ; pas de débordement.

### ☐ 4.6 · Plex Mono réservée au chrono
**À faire :** les durées (« 30 min + 30 min ») et les compteurs de Réviser passent en Plex Sans avec `font-variant-numeric: tabular-nums`. Plex Mono reste pour le chrono et les temps de recherche chronométrée.

### ☐ 4.7 · Cartes des épreuves cliquables de façon évidente
**À faire :** sur l'accueil desktop, les 4 cartes d'épreuves ont un état de survol et de focus net, une flèche en bas à droite (comme les chevrons de la version mobile), et la même structure interne pour les quatre. Toute la carte est cliquable, avec un seul lien par carte.

---

## LOT 5 · Réviser, Code du sport et suivi

### ☐ 5.1 · Sessions courtes dans « Réviser »
**À faire :**
- Proposer des sessions de 10 ou 20 cartes (20 par défaut), avec une barre de progression de session et un écran de fin (« 14 sues, 6 à revoir »).
- Ajouter un état « Jamais vue », de couleur neutre. L'orange « À revoir » est réservé aux cartes ratées.
- Afficher les raccourcis clavier sous forme de touches dessinées (`<kbd>`).

**Critères d'acceptation :** un nouveau visiteur ne voit plus « À revoir 290 » ; les données existantes sont conservées (migration : les cartes jamais notées deviennent « Jamais vue »).

### ☐ 5.2 · Réponses floutées du Code du sport explicites
**Pré-requis :** vérifier d'abord le fonctionnement actuel.
**À faire :** un bouton visible « Afficher la réponse » sur chaque carte floutée et un interrupteur global « Mode quiz / Mode lecture ». Le contenu flouté est masqué aux lecteurs d'écran jusqu'à révélation.

### ☐ 5.3 · Indicateurs séparés dans « Mon suivi »
**Pré-requis :** 1.2 ✅.
**À faire :** afficher séparément, sans les additionner en une note globale :
- Connaissances mémorisées (cartes acquises / total),
- Recherche dans le MFT (temps moyen),
- Séances préparées (nombre de grilles remplies),
- Thèmes déjà travaillés par épreuve.

Les blocs ne s'affichent que s'il y a des données ; sinon, un appel à l'action vers l'outil concerné.

---

## LOT 6 · Accueil recentré sur la courbe

> À ne lancer qu'après les tests avec quelques stagiaires (voir « Tests utilisateurs » en fin de document).

### ☐ 6.1 · Nouveau titre et sous-titre
**À faire :** remplacer le H1 par une formulation qui porte le différenciateur du site. Pistes à faire choisir par Philippe :
- « Le MFT, placé sur la courbe de plongée. »
- « Prépare ton MF1, une séance à la fois. »

Garder la formule actuelle (« Comprends le MFT, une séance après l'autre ») ailleurs, par exemple en tête de « S'entraîner ».
**À valider par Philippe :** le texte final. Ne rien coder avant.

### ☐ 6.2 · Courbe interactive en tête d'accueil
**À faire :** une grande courbe de plongée en SVG natif, dont les 5 phases réagissent au survol et au focus (« Fond · N1 : 2 compétences ») et mènent vers « Explore le MFT » au bon niveau et à la bonne phase. Alternative textuelle complète ; navigation au clavier.

### ☐ 6.3 · Nouvel ordre des sections de l'accueil
**À faire :** 1) titre et courbe, 2) les trois façons d'utiliser le site (Comprendre, S'entraîner, Réviser), 3) les 4 épreuves, 4) Mon suivi. La carte sombre « Explore le MFT sur la courbe » disparaît (remplacée par 6.2).

---

## LOT 7 · Explore le MFT et Progressions types

> À ne lancer qu'après les tests utilisateurs.

### ☐ 7.1 · La courbe comme sélecteur de phase
**À faire :** sur « Explore le MFT », rendre les segments de la courbe cliquables, avec le nom de la phase et le nombre de compétences, et une échelle de profondeur discrète. Phase active nettement contrastée (pas un rectangle pâle). Les boutons de phase actuels restent pour l'accessibilité et le mobile.

### ☐ 7.2 · Fiches de compétences en une colonne (desktop)
**À faire :** remplacer la grille en deux colonnes (hauteurs très inégales une fois une fiche dépliée) par une colonne unique de largeur confortable (≈720 px) ou une mise en page liste et panneau de détail.

### ☐ 7.3 · Comparateur de niveaux plus visible
**À faire :** mettre en avant « Comparer N1 · N2 · N3 » (comparer les niveaux est une compétence clé du MF1) : bouton secondaire visible en haut de chaque fiche, pas seulement en bas.

### ☐ 7.4 · Passerelles systématiques entre outils
**À faire :** sur chaque fiche de compétence, quand les données existent : « Voir une progression possible », « Préparer une séance sur ce thème ». En sens inverse, depuis « S'entraîner » et « Progressions types », un lien vers la fiche MFT. Le niveau et la compétence sont transmis dans l'URL.

### ☐ 7.5 · Chargement par niveau sur « Progressions types »
**Pré-requis :** mesures de 0.1.
**À faire :** si la page charge tous les niveaux d'un coup, ne générer ou n'afficher que le niveau sélectionné (pages séparées par niveau, ou données JSON chargées à la demande). Conserver les URL existantes.
**Critères d'acceptation :** nombre d'éléments DOM réduit et mesuré avant/après.

### ☐ 7.6 · Fil d'Ariane sur « Progressions types »
**À faire :** afficher en permanence Niveau › Compétence › Technique consultée.

---

## LOT 8 · Identité visuelle et confort

### ☐ 8.1 · Palette « profondeur » sémantique
**À faire :** définir une couleur par phase de plongée (avant, descente, fond, remontée, retour) dans une gamme de bleus, du clair (surface) au marine (fond), et l'utiliser partout où la phase apparaît (badges, fiches, cartes mémoire). Vérifier les contrastes WCAG AA. L'information ne repose jamais sur la couleur seule.
**À valider par Philippe :** la palette, présentée avant application.

### ☐ 8.2 · Logo autour du profil de plongée
**À faire :** proposer 2 ou 3 variantes de logo en SVG à partir du profil de plongée. Ne rien remplacer sans le choix de Philippe.

### ☐ 8.3 · Mode sombre
**À faire :** thème sombre via `prefers-color-scheme`, avec un interrupteur manuel mémorisé. Tous les états (focus, alertes, courbes, encadrés) vérifiés en sombre.

---

## Tests utilisateurs (à faire par Philippe, pas par Claude Code)

À mener après le lot 3, avant les lots 6 et 7, avec 3 à 5 stagiaires MF1 :

1. Retrouver les critères d'évaluation d'une compétence précise dans le MFT.
2. Préparer une séance à partir d'un thème tiré au hasard.
3. Reprendre une préparation, l'enregistrer et la montrer à un tuteur MF2.

Noter pour chaque scénario : réussite sans aide, temps, hésitations, commentaires. Les résultats peuvent modifier les lots 6 et 7.

---

## Suivi des étapes

| Étape | Statut | Date | Remarque |
|---|---|---|---|
| 0.1 | ✅ | 20/11/2026 | Rapport livré dans la conversation, aucun code modifié. Correction : le HTML est bien minifié |
| 1.1 | ✅ | 20/11/2026 | Descriptions à valider par Philippe ; image static/images/partage.png |
| 1.2 | ✅ | 20/11/2026 | Titre de page conservé (« Imaginer une progression »), choix de Philippe ; menu resserré entre 900 et 1120 px |
| 1.3 | ☐ | | |
| 1.4 | ✅ | 20/11/2026 | Texte perso et encadré non repris (choix de Philippe) ; bandeau caché à qui avait déjà la clé ptmf1-entree |
| 1.5 | ☐ | | |
| 2.1 | ☐ | | |
| 2.2 | ☐ | | |
| 2.3 | ☐ | | |
| 2.4 | ☐ | | |
| 2.5 | ☐ | | |
| 3.1 | ✅ | 20/11/2026 | Fait sans 1.3 (accord de Philippe) : imprime la grille en cours |
| 3.2 | ✅ | 20/11/2026 | Demandé par Philippe avec 3.3 ; bloc « Mon suivi » de l'accueil, aide mise à jour |
| 3.3 | ✅ | 20/11/2026 | Aperçu + confirmation ; fichier invalide sans effet |
| 4.1 | ☐ | | |
| 4.2 | ☐ | | |
| 4.3 | ☐ | | |
| 4.4 | ☐ | | |
| 4.5 | ☐ | | |
| 4.6 | ☐ | | |
| 4.7 | ☐ | | |
| 5.1 | ☐ | | |
| 5.2 | ☐ | | |
| 5.3 | ☐ | | |
| 6.1 | ☐ | | |
| 6.2 | ☐ | | |
| 6.3 | ☐ | | |
| 7.1 | ☐ | | |
| 7.2 | ☐ | | |
| 7.3 | ☐ | | |
| 7.4 | ☐ | | |
| 7.5 | ☐ | | |
| 7.6 | ☐ | | |
| 8.1 | ☐ | | |
| 8.2 | ☐ | | |
| 8.3 | ☐ | | |

**Rappel : n'exécute que l'étape explicitement demandée, puis arrête-toi.**
