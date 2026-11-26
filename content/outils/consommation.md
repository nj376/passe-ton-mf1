---
title: "Passe-ton-MF1 · Consommation et autonomie"
description: "Calculateur de consommation et d'autonomie en plongée : consommation ramenée à la surface, consommation à la profondeur, autonomie avant la réserve, en litres et en bars par minute. Le calcul déroulé pas à pas, comme à l'écrit 2 du MF1."
classePrincipal: "principal--interieur principal--capa"
titre: "Consommation et autonomie"
resume: "Mesure ta consommation ramenée à la surface après une plongée, ou prévois ton autonomie avant d’y aller. Le calcul se déroule pas à pas avec tes propres chiffres, comme tu le rédigerais à l’examen."
ecrit: "Écrit 2"
menuParent: "/ressources"
fiche: "/theorie/compressibilite/#consommation"
ficheTitre: "Compressibilité des gaz"
sources: "MFT de la FFESSM : Plongeur Niveau 2, version mai 2026 ; Plongeur Niveau 3, version décembre 2025 ; MF1, version juillet 2026 (écrit 2). Fiche du site Compressibilité des gaz. Le détail est dans la partie Sources"
---

{{< encart "orange" >}}
**Un outil pour apprendre, pas pour planifier seul.** Les résultats supposent une consommation constante et une profondeur fixe. Dans l’eau, le froid, l’effort ou le stress changent tout : suis ton manomètre, ton ordinateur et les consignes du directeur de plongée.
{{< /encart >}}

{{< outil "consommation" >}}

## Comprendre le calcul

Ton détendeur te donne de l’air à la pression ambiante : à chaque inspiration, tes poumons se remplissent du même volume qu’en surface, mais cet air est plus comprimé. Plus tu descends, plus tu prends d’air au bloc pour la même respiration. C’est la loi de Mariotte, détaillée dans la fiche [Compressibilité des gaz](/theorie/compressibilite/#mariotte).

Quatre relations suffisent :

- **pression absolue** = 1 + profondeur ÷ 10, en bar ;
- **consommation à la profondeur** = consommation en surface × pression absolue ;
- **air disponible** = volume du bloc × (pression au départ − réserve) ;
- **autonomie** = air disponible ÷ consommation à la profondeur.

Le MFT N2 demande de savoir calculer « l’autonomie et la consommation du plongeur en profondeur et au palier en litre/minute et en bar/minute ». Les **bars par minute**, c’est ce que tu lis vraiment sur ton manomètre : litres par minute ÷ volume du bloc.

**La consommation en surface** est la valeur qui te caractérise : elle ne dépend pas de la profondeur. On la calcule en ramenant la consommation mesurée à la surface, en divisant par la pression absolue moyenne de la plongée.

**La réserve** est l’air que tu gardes pour la remontée, les paliers et un imprévu. Le MFT ne fixe pas de valeur : elle est décidée par la palanquée ou par le directeur de plongée. 50 bar est une valeur courante, que l’outil propose par défaut.

## Mesurer ta propre consommation

Ta consommation en surface te servira à préparer tes plongées. Pour la mesurer :

- note la pression au départ et à la sortie, et la durée de la plongée ;
- relève sur ton ordinateur la **profondeur moyenne**, pas la profondeur maximale ;
- fais le calcul sur plusieurs plongées, dans des conditions variées : une plongée calme et une plongée avec du courant ne donnent pas le même résultat.

La remontée et les paliers sont compris dans la plongée : la valeur obtenue est une moyenne, suffisante pour préparer une plongée, pas une mesure de précision.

## Un exercice type

*Après 35 minutes à une profondeur moyenne de 25 m, un plongeur équipé d’un bloc de 15 L est passé de 200 à 60 bar. Quelle est sa consommation en surface ? Il prévoit ensuite une plongée à 40 m avec un bloc de 12 L gonflé à 200 bar, et une réserve de 50 bar : combien de temps pourra-t-il rester au fond ?*

{{< pistes >}}
- **Air consommé** : 15 × (200 − 60) = **2 100 L**.
- **Consommation à 25 m** : 2 100 ÷ 35 = **60 L/min**, sous une pression absolue de 1 + 25 ÷ 10 = 3,5 bar.
- **Consommation en surface** : 60 ÷ 3,5 ≈ **17,1 L/min**.
- **À 40 m** : 17,1 × 5 ≈ **85,5 L/min**.
- **Air disponible** : 12 × (200 − 50) = **1 800 L**.
- **Autonomie au fond** : 1 800 ÷ 85,5 ≈ **21 min**. La remontée et les paliers se prennent sur la réserve.
- **Ce que ça montre** : à 40 m, ce plongeur consomme cinq fois plus qu’en surface ; son autonomie au fond ne dépasse pas une vingtaine de minutes.
{{< /pistes >}}

Tu peux vérifier chaque étape avec le calculateur.

## Les erreurs fréquentes

- **Prendre la profondeur maximale** pour mesurer sa consommation : on surestime la pression, et on sous-estime sa consommation.
- **Oublier la pression de surface** : à 30 m, la pression absolue est de 4 bar, pas de 3.
- **Oublier la réserve** dans l’air disponible.
- **Appliquer l’autonomie à une autre profondeur** : elle n’est valable qu’à la profondeur du calcul. Plus profond, elle diminue.
- **Confondre litres et bars** : 80 L/min sur un bloc de 12 L, c’est environ 6,7 bar par minute au manomètre, pas 80.
- **Croire que la consommation est fixe** : le froid, l’effort, le stress et le courant l’augmentent, parfois beaucoup.

## Sources

**Le MFT de la FFESSM** : Plongeur Niveau 2 (mai 2026, notions de physique pour calculer l’autonomie et la consommation, en litres et en bars par minute), Plongeur Niveau 3 (décembre 2025) et MF1 (juillet 2026, écrit 2).

**Le site** : la fiche [Compressibilité des gaz](/theorie/compressibilite/), pour la loi de Mariotte, la consommation et l’autonomie.
