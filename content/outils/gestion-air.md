---
title: "Passe-ton-MF1 · Gestion de l'air"
description: "Calculateur de gestion de l'air en plongée : profil en segments, air consommé à chaque étape, pression au début de la remontée et à la sortie, moment de la mi-pression et de la réserve, avec trois façons de fixer la réserve. Le calcul déroulé pas à pas."
classePrincipal: "principal--interieur principal--capa"
titre: "Gestion de l’air"
resume: "Prépare l’air d’une plongée : décris ton profil, choisis ta règle de réserve, et vérifie qu’il te restera assez d’air au début de la remontée et à la sortie. Avec le moment où tu feras le signe « mi-pression »."
ecrit: "Écrit 2"
menuParent: "/ressources"
fiche: "/theorie/compressibilite/#consommation"
ficheTitre: "Compressibilité des gaz"
sources: "MFT de la FFESSM : Plongeur Niveau 1, version décembre 2025 (signes « mi-pression » et « réserve ») ; Plongeur Niveau 2, version mai 2026 (consommation et autonomie, marge de sécurité) ; tables fédérales MN90 pour les paliers des exemples. Fiche du site Compressibilité des gaz. Le détail est dans la partie Sources"
---

{{< encart "orange" >}}
**Un outil pour apprendre, pas pour planifier seul.** Le calcul suppose une consommation constante, que tu choisis. Dans l’eau, le froid, l’effort, le courant ou le stress l’augmentent : surveille ton manomètre, et suis les consignes du directeur de plongée, qui fixe la réserve.
{{< /encart >}}

{{< outil "gestion-air" >}}

## Comprendre le calcul

Pour chaque segment de la plongée, on calcule la consommation à sa profondeur moyenne, puis l’air consommé, en litres et en bars :

- **consommation à la profondeur** = consommation en surface × (1 + profondeur ÷ 10) ;
- **air consommé** = consommation à la profondeur × durée ;
- **bars consommés** = air consommé ÷ volume du bloc.

En retirant ces bars un à un de la pression de départ, on obtient la pression **au début de la remontée** (après le dernier segment de fond) et **à la sortie**. Les calculs de base sont dans l’outil [Consommation et autonomie](/outils/consommation/) et dans la fiche [Compressibilité des gaz](/theorie/compressibilite/#consommation).

**Le signe « mi-pression »** fait partie des signes conventionnels que le MFT demande dès le N1, avec le signe « réserve ». L’outil indique à quelle minute de la plongée tu atteins la moitié de ta pression de départ.

## Trois façons de fixer la réserve

Le MFT N2 parle de « marge de sécurité », sans fixer de méthode ni de chiffre. L’outil en propose trois, à comparer :

1. **Une réserve fixe** : une pression à garder au moment de quitter le fond, souvent 50 bar. La remontée et les paliers se prennent sur cette réserve, comme dans les calculs de l’écrit 2. La valeur est fixée par le directeur de plongée ou la palanquée.
2. **La règle des tiers** : un tiers de l’air pour l’aller, un tiers pour le retour, un tiers à garder à la sortie. Elle vient surtout de la plongée anglo-saxonne, en particulier en grotte ou sous plafond, où il faut revenir par le même chemin.
3. **De quoi remonter à deux** : au moment de quitter le fond, ton bloc doit contenir assez d’air pour faire toute la remontée prévue à deux, si ton binôme tombe en panne d’air. L’outil compte la remontée et les paliers que tu as décrits, pour deux plongeurs. Sous le stress, la consommation augmente : tu peux saisir une valeur plus forte que ta consommation habituelle.

## Un exercice type

*Un plongeur équipé d’un bloc de 15 L gonflé à 200 bar consomme 20 L/min en surface. Il prévoit 25 minutes à 30 m, une remontée d’environ 2 minutes jusqu’au palier (profondeur moyenne 16 m), et le palier de 4 minutes à 3 m que donne la table MN90. Sa plongée tient-elle avec chacune des trois règles ?*

{{< pistes >}}
- **Au fond** : 20 × 4 × 25 = **2 000 L**, soit 2 000 ÷ 15 ≈ 133,3 bar. Au début de la remontée, il reste ≈ **66,7 bar**.
- **Remontée et palier** : 20 × 2,6 × 2 = 104 L, et 20 × 1,3 × 4 = 104 L, soit 208 L ≈ 13,9 bar. À la sortie, il reste ≈ **52,8 bar**.
- **Mi-pression** : 100 bar sont atteints aux trois quarts du fond, vers la **18e minute**.
- **Réserve fixe de 50 bar** : 66,7 bar au début de la remontée, la plongée **tient**.
- **Règle des tiers** : il faut 66,7 bar à la sortie, il n’en reste que 52,8 : la plongée **ne tient pas**.
- **Remontée à deux** : 2 × 208 = 416 L ≈ 27,7 bar à garder au début de la remontée ; il en a 66,7 : la plongée **tient**.
- **Ce que ça montre** : la même plongée est acceptable ou non selon la règle choisie. Ici, la règle des tiers est la plus exigeante. D’où l’importance de se mettre d’accord avant de s’immerger.
{{< /pistes >}}

## Les erreurs fréquentes

- **Oublier la remontée et les paliers** : ils consomment peu par minute, mais ils comptent, surtout à deux.
- **Prendre la profondeur maximale** pour tous les segments : on surestime la consommation des phases moins profondes. À l’inverse, sous-estimer la profondeur du fond donne une marge trompeuse.
- **Garder la même consommation dans toutes les situations** : froid, courant, effort et stress l’augmentent.
- **Confondre les règles** : une réserve de 50 bar à quitter le fond n’est pas un tiers à la sortie.
- **Oublier que le DP fixe la réserve** : l’outil compare des méthodes, il ne décide pas.

## Sources

**Le MFT de la FFESSM** : Plongeur Niveau 1 (décembre 2025, signes conventionnels « mi-pression » et « réserve »), Plongeur Niveau 2 (mai 2026, consommation et autonomie, notion de marge de sécurité).

**Les tables fédérales MN90** et leur mode d’emploi, pour le palier de l’exercice (25 minutes à 30 m : 4 minutes à 3 m).

**Le site** : l’outil [Consommation et autonomie](/outils/consommation/) et la fiche [Compressibilité des gaz](/theorie/compressibilite/).
