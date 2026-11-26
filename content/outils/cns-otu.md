---
title: "Passe-ton-MF1 · Exposition à l'oxygène : CNS et OTU"
description: "Calculateur d'exposition à l'oxygène : pourcentage CNS selon les limites NOAA d'exposition unique et sur 24 heures, dose pulmonaire en OTU, pour une plongée découpée en segments. Avec les tables NOAA et Repex et le calcul déroulé pas à pas."
classePrincipal: "principal--interieur principal--capa"
titre: "Exposition à l’oxygène : CNS et OTU"
resume: "Pour une plongée au nitrox ou des paliers à l’oxygène : la part des limites NOAA utilisée, pour le cerveau (CNS), et la dose reçue par les poumons (OTU). Segment par segment, avec le calcul déroulé."
ecrit: "Nitrox"
menuParent: "/ressources"
fiche: "/theorie/pressions-partielles/#limites-toxicite"
ficheTitre: "Pressions partielles"
sources: "R. W. Hamilton, « Tolerating oxygen exposure », SPUMS Journal, vol. 27, n° 1, 1997, p. 43-47, qui reproduit la table 15-1 du NOAA Diving Manual (1991) et la méthode Repex ; Code du sport, article A322-92. Le détail est dans la partie Sources"
---

{{< encart "orange" >}}
**Un outil pour apprendre, pas pour plonger.** Ces limites sont empiriques et valent pour un plongeur au repos, sans effort ni résistance respiratoire : des accidents ont été décrits en dessous. L’outil ne tient pas compte de la récupération entre deux plongées. Ton ordinateur, ta formation nitrox et les consignes du directeur de plongée font foi.
{{< /encart >}}

{{< outil "cns-otu" >}}

## Comprendre le calcul

L’oxygène devient toxique quand sa pression partielle augmente. On suit deux toxicités, présentées dans la mindmap des accidents : celle du **système nerveux central** ([hyperoxie neurologique](/accidents-de-plongee/#hyperoxie-neurologique)), brutale, et celle des **poumons** ([hyperoxie pulmonaire](/accidents-de-plongee/#hyperoxie-pulmonaire)), qui s’installe avec la durée. Le calcul de la PpO2 est détaillé dans la fiche [Pressions partielles](/theorie/pressions-partielles/#dalton).

**Le CNS, la part de la limite utilisée.** La NOAA, l’agence américaine dont le manuel de plongée fait référence en la matière, fixe pour chaque PpO2 une durée maximale d’exposition. Le CNS est la part de cette durée déjà consommée : 15 minutes sur une limite de 45 minutes, c’est 33 %.

- Entre deux lignes de la table, la limite est **interpolée** en ligne droite : à 1,28 bar, entre 210 et 180 minutes, elle vaut 186 minutes.
- Les segments **s’additionnent** : une série de plongées dans la journée se cumule dans la même limite.
- **Sous 0,6 bar**, la table ne fixe pas de limite.
- **Au-delà de 1,6 bar**, le Code du sport interdit la plongée (article A322-92), et l’outil ne calcule rien.

**La limite sur 24 heures.** La même table donne une durée totale à ne pas dépasser sur une journée. D’après la NOAA, si la limite d’exposition unique est dépassée, on attend 2 heures avant de replonger ; si la limite sur 24 heures est dépassée, on attend 12 heures.

**Les OTU, la dose pour les poumons.** L’unité de tolérance à l’oxygène (OTU) mesure l’effet de l’oxygène sur les poumons : une minute à 1 bar d’oxygène vaut 1 OTU. La formule de Lambertsen est OTU = durée × ((PpO2 − 0,5) ÷ 0,5)^0,83, et l’oxygène n’a pas d’effet mesurable sous 0,5 bar.

## Les tables de référence

**Les limites NOAA** (table 15-1 du *NOAA Diving Manual*, 1991, reproduite par Hamilton) :

| PpO2 | Exposition unique | Sur 24 heures |
|---|---|---|
| 1,6 bar | 45 min | 150 min |
| 1,5 bar | 120 min | 180 min |
| 1,4 bar | 150 min | 180 min |
| 1,3 bar | 180 min | 210 min |
| 1,2 bar | 210 min | 240 min |
| 1,1 bar | 240 min | 270 min |
| 1,0 bar | 300 min | 300 min |
| 0,9 bar | 360 min | 360 min |
| 0,8 bar | 450 min | 450 min |
| 0,7 bar | 570 min | 570 min |
| 0,6 bar | 720 min | 720 min |

**La méthode Repex** fixe la dose d’OTU admise sur plusieurs jours de suite. Le premier jour, le corps tolère davantage ; la dose moyenne baisse ensuite et se stabilise à 300 OTU par jour.

| Jours de suite | Dose moyenne par jour | Dose totale |
|---|---|---|
| 1 | 850 OTU | 850 OTU |
| 2 | 650 OTU | 1 400 OTU |
| 3 | 600 OTU | 1 860 OTU |
| 4 | 520 OTU | 2 100 OTU |
| 5 | 450 OTU | 2 300 OTU |
| 6 | 420 OTU | 2 520 OTU |
| 7 | 400 OTU | 2 660 OTU |
| 8 | 350 OTU | 2 800 OTU |
| 9 | 330 OTU | 2 970 OTU |
| 10 | 320 OTU | 3 100 OTU |
| 11 et plus | 300 OTU | 300 OTU × nombre de jours (3 300 OTU à 11 jours) |

L’outil compare tes OTU à la dose d’un jour isolé, 850 OTU. Pour plusieurs jours de suite, additionne tes plongées et compare à la dose totale de la table.

## Un exercice type

*Un plongeur fait 40 minutes à 30 m à l’EAN32, puis un palier de 5 minutes à 3 m avec le même mélange. Quelle part de la limite NOAA utilise-t-il ? Combien d’OTU reçoit-il ?*

{{< pistes >}}
- **Au fond** : PpO2 = 4 × 0,32 = **1,28 bar**. La limite d’exposition unique, entre 210 minutes (1,2 bar) et 180 minutes (1,3 bar), vaut 210 − 0,8 × 30 = **186 minutes**.
- **CNS du fond** : 40 ÷ 186 ≈ **21,5 %**.
- **OTU du fond** : 40 × ((1,28 − 0,5) ÷ 0,5)^0,83 = 40 × 1,56^0,83 ≈ **58 OTU**.
- **Au palier** : PpO2 = 1,3 × 0,32 ≈ 0,42 bar, sous 0,6 et sous 0,5 bar : ni CNS ni OTU.
- **Ce que ça montre** : une plongée nitrox classique utilise environ un cinquième de la limite, et la dose pulmonaire reste très loin des 850 OTU d’une journée. Ce sont les paliers à l’oxygène pur et les PpO2 proches de 1,6 bar qui font grimper le CNS.
{{< /pistes >}}

## Les erreurs fréquentes

- **Oublier les paliers** : à l’oxygène pur à 6 m, la PpO2 atteint 1,6 bar, et 10 minutes y consomment déjà 22 % de la limite.
- **Ne compter que la plongée la plus longue** : les plongées de la journée s’additionnent.
- **Prendre le pourcentage prévu du mélange au lieu du pourcentage analysé.**
- **Croire qu’un CNS sous 100 % protège de tout** : l’effort, le froid, le CO2 et la résistance respiratoire abaissent le seuil.
- **Confondre les deux mesures** : le CNS protège le cerveau, sur une plongée ; les OTU protègent les poumons, sur des jours.

## Sources

**R. W. Hamilton**, [« Tolerating oxygen exposure »](https://www.dhmjournal.com/images/IndividArticles/27March/Hamilton_SPUMSJ.27.1.43-47.pdf), *SPUMS Journal*, vol. 27, n° 1, 1997, p. 43-47 : la formule des OTU, la méthode Repex, et la table 15-1 du *NOAA Diving Manual* (1991) avec ses règles d’usage.

**Le Code du sport** (extrait du MFT, version juin 2026) : article A322-92, PpO2 entre 0,16 et 1,6 bar.

**Le site** : la fiche [Pressions partielles](/theorie/pressions-partielles/) et les mini-fiches hyperoxie de la [mindmap des accidents](/accidents-de-plongee/#hyperoxie-neurologique).
