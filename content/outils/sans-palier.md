---
title: "Passe-ton-MF1 · Courbe de sécurité"
description: "Durée maximale sans palier obligatoire : la courbe de sécurité des tables fédérales MN90, comparée au modèle de Bühlmann ZH-L16C avec facteur de gradient, à l'air et au nitrox. Pour comprendre pourquoi tables et ordinateurs ne donnent pas la même durée."
classePrincipal: "principal--interieur principal--capa"
titre: "Courbe de sécurité"
resume: "Combien de temps peut-on rester à une profondeur sans palier obligatoire ? La réponse des tables MN90, celle du modèle de Bühlmann de nombreux ordinateurs, et pourquoi elles diffèrent."
ecrit: "Écrit 4"
menuParent: "/ressources"
fiche: "/theorie/modele-haldane/#mn90"
ficheTitre: "Le modèle de Haldane et ses dérivés"
sources: "Tables de plongée fédérales FFESSM (MN90) et leur mode d’emploi, juillet 2005 ; A. A. Bühlmann, Decompression - Decompression Sickness, Springer, 1984, paramètres ZH-L16C ; MFT de la FFESSM, Plongeur Niveau 2, version mai 2026, et GP-N4, version mai 2026 (réglage des facteurs de gradient). Le détail est dans la partie Sources"
---

{{< encart "orange" >}}
**Un outil pour comprendre, jamais pour planifier une plongée.** Les durées sont calculées pour une plongée unique, à profondeur constante, sans plongée la veille ni le jour même. Respecter la courbe ne garantit pas l’absence d’accident. Pour plonger, suis ta table ou ton ordinateur, et les consignes du directeur de plongée.
{{< /encart >}}

{{< outil "sans-palier" >}}

## La courbe, profondeur par profondeur

{{< table-sans-palier >}}

## Comprendre le calcul

**Aux tables MN90**, la courbe de sécurité se lit directement : pour chaque profondeur, la plus longue durée dont la ligne ne comporte aucun palier. On applique les règles de lecture habituelles : la profondeur maximale atteinte, lue à la profondeur immédiatement supérieure de la table, et la durée à la valeur immédiatement supérieure. Au nitrox, on entre dans la table avec la profondeur équivalente du mode d’emploi (voir l’outil [Nitrox et profondeurs maximales](/outils/nitrox/)). Les tables sont présentées dans la fiche [Le modèle de Haldane et ses dérivés](/theorie/modele-haldane/#mn90).

**Avec le modèle de Bühlmann**, la durée sans palier est le temps au bout duquel le premier compartiment atteint la tension qu’il tolère en surface. L’outil calcule les seize compartiments et retient le plus rapide à atteindre sa limite ; le pas à pas te dit lequel. Le modèle est présenté dans la fiche Haldane, partie [Bühlmann ZH-L16C](/theorie/modele-haldane/#buhlmann).

**Le facteur de gradient haut** abaisse la tension tolérée en surface : à 85 %, on ne garde que 85 % de la marge entre la pression ambiante et la limite du modèle. Pour une durée sans palier, seul le GF haut compte, puisqu’on remonte directement à la surface. Le MFT N2 et GP-N4 retient, pour la plongée à l’air, un GF bas égal au GF haut, entre 85 et 90 % : c’est pourquoi l’outil propose 85 % par défaut.

**Pourquoi les deux ne disent pas la même chose.** Les tables MN90 et le modèle de Bühlmann n’ont ni les mêmes compartiments, ni les mêmes limites, ni les mêmes essais derrière eux. Sans facteur de gradient, le modèle de Bühlmann laisse plus de temps que la table à toutes les profondeurs de la courbe ; avec un GF de 85 %, il devient plus prudent que la table jusqu’à 28 m, mais au-delà de 30 m il laisse souvent un peu plus de temps qu’elle (compare les colonnes du tableau). Aucun des deux ne donne « la vraie » durée : chacun applique son modèle avec ses marges. Voir aussi [le modèle DCIEM](/theorie/modele-dciem/#dciem-differences).

## Un exercice type

*Un plongeur prévoit 38 minutes à 21 m, à l’air. Peut-il remonter sans palier obligatoire, selon les tables MN90 ? Et selon un ordinateur réglé sur le modèle de Bühlmann avec un GF haut de 85 % ?*

{{< pistes >}}
- **Tables MN90** : 21 m se lit à **22 m**, et 38 minutes à **40 minutes**. La courbe de sécurité à 22 m est de 35 minutes : la plongée en sort. La ligne 22 m, 40 minutes, impose **2 minutes à 3 m** (durée totale de remontée 4 minutes, groupe I).
- **Bühlmann, GF 85 %** : à 21 m, l’outil donne environ **28 minutes** sans palier. Au-delà, l’ordinateur affichera lui aussi un palier obligatoire.
- **Ce que ça montre** : les deux moyens imposent un palier, mais pas au même moment. Le guide de palanquée s’aligne sur le moyen le plus pénalisant de la palanquée.
{{< /pistes >}}

## Les erreurs fréquentes

- **Lire la table à la profondeur inférieure** : 21 m se lit à 22 m, jamais à 20 m.
- **Prendre la profondeur moyenne** pour les tables : c’est la profondeur maximale atteinte.
- **Croire que la courbe de sécurité est une garantie** : le froid, l’effort, la fatigue ou une plongée successive changent tout.
- **Comparer une durée sans palier de table et d’ordinateur** sans tenir compte du réglage de l’ordinateur.
- **Oublier le palier de sécurité** recommandé en fin de plongée, même sans palier obligatoire.

## Sources

**Les tables de plongée fédérales FFESSM (MN90)** et leur mode d’emploi (juillet 2005) : la courbe de sécurité est relevée ligne par ligne dans les tables officielles, de 6 à 60 m.

**A. A. Bühlmann**, *Decompression - Decompression Sickness*, Springer, 1984 : les paramètres du modèle ZH-L16C (périodes et coefficients a et b de l’azote), tels que tabulés par l’article [Bühlmann decompression algorithm](https://en.wikipedia.org/wiki/B%C3%BChlmann_decompression_algorithm) (Wikipédia, en anglais), avec une pression de vapeur d’eau de 0,0627 bar.

**Le MFT de la FFESSM** : Plongeur Niveau 2 et GP-N4 (mai 2026), pour le réglage des facteurs de gradient à l’air.

**Le site** : la fiche [Le modèle de Haldane et ses dérivés](/theorie/modele-haldane/) et l’outil [Nitrox et profondeurs maximales](/outils/nitrox/).
