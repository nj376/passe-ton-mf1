---
title: "Passe-ton-MF1 · Le modèle DCIEM"
description: "Le modèle DCIEM pour le MF1 : origine canadienne, quatre compartiments en série, désaturation retardée, gestion native des plongées successives et facteur de répétition, différences avec le modèle de Haldane. Ce qu’attend l’écrit 4 du capacitaire, et comment s’en servir pour enseigner la cohabitation des moyens de désaturation."
classePrincipal: "principal--interieur principal--capa"
titre: "Le modèle DCIEM"
resume: "Une autre façon de découper le corps : des compartiments à la file plutôt que côte à côte. Comprendre ce que change cette disposition, pourquoi deux modèles donnent deux réponses pour la même plongée, et comment l’expliquer à tes élèves."
weight: 220
epreuves: ["theorique"]
mindmap: "desaturation"
menuParent: "/ressources"
sources: "MFT de la FFESSM : MF1, version juillet 2026 (module capacitaire, désaturation) ; Plongeur Niveau 2, version mai 2026 ; Plongeur Niveau 3, version décembre 2025 ; GP-N4, version mai 2026. Sujets de pédagogie théorique 2026 des CTR Aquitaine et Île-de-France. Le détail des documents est dans la partie Sources"
---

## En deux minutes

- **Le DCIEM est un modèle de décompression canadien**, né dans un institut de médecine lié à la défense canadienne, à partir des travaux de Kidd et Stubbs. Il sert de base aux tables du même nom.
- **Ses quatre compartiments sont en série** : seul le premier est alimenté par le sang, et l’azote passe ensuite de l’un à l’autre, à la file. Chez Haldane, les compartiments sont côte à côte et le sang les alimente tous.
- **Conséquence à la remontée** : les compartiments du bout de la chaîne ne peuvent se vider qu’en traversant les autres. Leur désaturation est retardée.
- **Le modèle garde la trace de l’azote d’une plongée à l’autre** : il gère les successives de lui-même, sans règle ajoutée après coup. Les tables le traduisent par un **facteur de répétition**.
- **Deux modèles, deux réponses** : pour la même plongée, des tables ou des ordinateurs de modèles différents ne donnent pas les mêmes paliers. Aucun ne donne « la » vérité.

Au capacitaire, le MFT range le DCIEM sous le titre « Autre modèle » et en retient deux points : « Compartiments en série » et « Gestion native des plongées successives ». L’évaluation porte sur la « Compréhension des différences avec le modèle de Haldane ». Pas de calcul : il faut savoir expliquer et comparer.

## 1. Comprendre

Cette fiche suppose connus les principes du modèle de Haldane : compartiments, période, sursaturation critique. Ils sont détaillés dans la fiche [Le modèle de Haldane et ses dérivés](/theorie/modele-haldane/#haldane-principes).

### Le principe du DCIEM {#dciem-principe}

**D’où il vient.** DCIEM est le sigle d’un institut canadien de médecine environnementale lié à la défense (*Defence and Civil Institute of Environmental Medicine*). Au milieu des années 1960, deux chercheurs, Kidd et Stubbs, y mettent au point un modèle de décompression d’un type nouveau, dit « en série ». À partir de la fin des années 1970, l’institut le réévalue et le corrige à partir des données accumulées : c’est le modèle « DCIEM 1983 », dont sont tirées les tables publiées en 1984.

**Quatre compartiments en série.**

- Le modèle compte **quatre compartiments** placés à la file.
- **Seul le premier compartiment échange avec le sang.** C’est par lui que l’azote entre, et par lui qu’il ressort.
- **L’azote passe d’un compartiment au suivant** : le deuxième se charge à partir du premier, le troisième à partir du deuxième, et ainsi de suite.
- À la descente et au fond, le premier compartiment se charge le plus vite, et le dernier le plus lentement : sa lenteur vient de **sa place dans la chaîne**, pas seulement de sa période. D’après la littérature consultée, les quatre compartiments auraient d’ailleurs la même période, de l’ordre de 21 minutes.

{{< schema "des-parallele-serie" >}}

**Un modèle de calcul.** Comme chez Haldane, les compartiments ne sont pas des organes. Le DCIEM 1983 est d’ailleurs décrit comme un modèle de calcul ajusté sur les résultats d’essais, plutôt que comme une description du corps.

**Ce qui décide de la remontée.** Chez Haldane, chaque compartiment a sa propre limite de sursaturation, et c’est le plus contraignant, le compartiment directeur, qui fixe le palier. Dans le DCIEM, selon les sources consultées, la limite porte sur les **deux premiers compartiments** de la chaîne, ceux qui sont au contact du sang.

**Des tables testées au Doppler.** Les tables DCIEM ont été vérifiées sur des milliers de plongées, en écoutant au Doppler les bulles qui circulent dans le sang au retour en surface. Le Doppler permet de juger une table non seulement sur les accidents, mais aussi sur les bulles détectées. Les bulles circulantes sont traitées dans la fiche [Formation et croissance des bulles](/theorie/bulles-desaturation/#bulles-circulantes).

[L’enseigner →](#enseigner-principe)

#### La désaturation retardée

À la remontée, la pression ambiante baisse et le sang se décharge. Le premier compartiment rend son azote au sang. Mais le dernier, lui, n’a aucun contact avec le sang : son azote doit **repasser par tous les compartiments qui le précèdent** avant de pouvoir sortir.

{{< schema "des-serie-desaturation" >}}

C’est la principale différence de comportement avec Haldane : dans un modèle en série, l’azote stocké au bout de la chaîne se comporte comme une réserve qui se vide lentement, et qui reste là longtemps après la plongée.

### Les plongées successives {#dciem-successives}

**Ce que veut dire « gestion native ».** Puisque l’azote stocké au bout de la chaîne se vide lentement, le modèle sait, à tout moment, ce qu’il reste dans chaque compartiment. Pour une deuxième plongée, il repart simplement de cet état : la successive fait partie du calcul.

**La comparaison avec Haldane et la MN90.** Pour le modèle de Haldane, le MFT parle de « Non-modélisation des plongées successives ou multiples, principe de la majoration » : les tables MN90 sont calculées pour une plongée unique, et la deuxième plongée passe par une règle ajoutée, la majoration (voir [successives et majoration](/theorie/modele-haldane/#successives)). Un ordinateur, quel que soit son modèle, calcule en continu et suit lui aussi l’azote d’une plongée à l’autre : la différence porte surtout sur les tables.

**Le facteur de répétition.** Dans les tables DCIEM, la deuxième plongée passe par un **facteur de répétition**. Selon la mini-fiche, ce facteur varie avec le groupe de sortie de la première plongée et de l’intervalle en surface, et il **multiplie** la durée de la deuxième plongée, là où la majoration de la MN90 **ajoute** des minutes. Dans les deux cas, l’idée est la même : transformer l’azote qui reste en temps fictif passé au fond.

Les tables DCIEM elles-mêmes n’ont pas pu être consultées pour cette fiche : retiens le principe, pas un chiffre. Le mode de calcul précis se lit sur les tables, et il n’est pas au programme.

[L’enseigner →](#enseigner-successives)

### Les différences avec Haldane {#dciem-differences}

| | Haldane (MN90, Bühlmann) | DCIEM |
|---|---|---|
| Disposition | en parallèle : le sang alimente chaque compartiment | en série : le sang n’alimente que le premier |
| Nombre de compartiments | 12 pour la MN90, 16 pour le ZHL-16C | 4 |
| Vitesse d’un compartiment | fixée par sa période, de 5 à 120 minutes pour la MN90 | fixée surtout par sa place dans la chaîne |
| Ce qui fixe le palier | le compartiment directeur, celui qui approche le plus de sa limite | la sursaturation des deux premiers compartiments, selon les sources consultées |
| Désaturation | chaque compartiment se vide directement dans le sang | les derniers se vident à travers les autres : elle est retardée |
| Plongées successives | dans les tables MN90, une règle ajoutée : la majoration | gérées par le modèle ; un facteur de répétition dans les tables |

**Lequel est le plus prudent ?** La mini-fiche dit le DCIEM « réputé plus conservateur sur les plongées répétées », et les tables DCIEM sont souvent décrites comme plus prudentes que celles de l’US Navy. Aucune comparaison chiffrée avec la MN90 n’a été trouvée : ne présente pas l’un comme meilleur que l’autre.

**La conséquence pour le plongeur.** Pour la même plongée, deux tables ou deux ordinateurs fondés sur des modèles différents ne donnent ni les mêmes paliers, ni la même durée sans palier, ni le même intervalle conseillé avant de replonger. Aucun n’est « faux » : chacun applique son modèle avec ses propres marges. C’est ce qui rend nécessaire, dans une palanquée, une règle de cohabitation des moyens de désaturation.

[L’enseigner →](#enseigner-differences)

## 2. L’enseigner

Le DCIEM lui-même n’apparaît que dans le MFT MF1 : tes élèves n’ont pas à le connaître. Mais il est la meilleure illustration d’une idée que le MFT demande à plusieurs niveaux :

- **au N2** : une information sur la modélisation de la désaturation, et la gestion de moyens de désaturation différents dans une palanquée ;
- **au N3** : les principes des modèles qu’utilisent les différents moyens de désaturation ;
- **au GP-N4** : la gestion d’une palanquée aux moyens de désaturation différents.

### Le principe, au N3 et au GP-N4 {#enseigner-principe}

- **L’image du quotidien** : une fontaine à vasques percées. Le robinet ne remplit que la vasque du haut ; chacune goutte, par un petit trou, dans celle du dessous. La première se remplit vite, la dernière à peine. Pour la vidange, l’image s’arrête : pense plutôt à un appartement en enfilade, où l’on ne sort de la chambre du fond qu’en traversant toutes les autres pièces.
- **En clair** : « Certains modèles imaginent tes réservoirs à azote les uns à côté des autres, d’autres les uns derrière les autres. Derrière, ils se remplissent moins vite, mais ils se vident aussi plus lentement. »
- **Le geste** : savoir quel modèle utilise ton ordinateur (c’est écrit dans sa notice), et ne pas en changer au cours d’une journée de plongée.
- **Au tableau** :

{{< schema "des-tableau-vasques" >}}

- **Les idées fausses** :
  - « En série, ça veut dire que le deuxième attend que le premier soit plein » : non, il commence à se charger dès que le premier contient de l’azote, mais il reste toujours en retard.
  - « Le compartiment 4, c’est l’os, le compartiment 1, le sang » : ce sont des cases de calcul, pas des organes.

### Les successives, au GP-N4 {#enseigner-successives}

- **L’image du quotidien** : le bonus-malus de l’assurance auto. Ton tarif dépend de ce que tu as fait avant, par un coefficient qui baisse avec le temps. Le facteur de répétition fait pareil avec la durée de ta deuxième plongée.
- **En clair** : « Après ta première plongée, il te reste de l’azote. Quelle que soit la méthode, table ou ordinateur, ta deuxième plongée en tient compte, et elle sera plus courte ou demandera plus de paliers. »
- **Le geste** : noter son heure de sortie et son groupe ; garder la même méthode de calcul pour toute la journée : on ne commence pas avec une table pour finir avec une autre, ni avec un ordinateur qu’on change.
- **Au tableau** : on reprend le sac à dos de la [fiche Haldane](/theorie/modele-haldane/#enseigner-successives), avec deux façons de compter ce qui reste : ajouter des minutes (MN90) ou multiplier la durée (DCIEM).
- **Les idées fausses** :
  - « Le facteur de répétition et la majoration, c’est pareil » : l’idée est la même, le calcul est différent, et on ne mélange jamais les deux.
  - « Mon ordinateur ne sait pas que j’ai déjà plongé » : s’il est resté allumé, ou en veille, il le sait. C’est pour ça qu’on ne le prête pas.

### Les différences, du N2 au GP-N4 {#enseigner-differences}

- **L’image du quotidien** : les caisses du supermarché et les contrôles de l’aéroport. Au supermarché, plusieurs caisses côte à côte : chaque client va directement à l’une d’elles. À l’aéroport, une suite de contrôles : chaque voyageur passe par tous, dans l’ordre.
- **En clair** : « Ta table et ton ordinateur, ou ton ordinateur et celui de ton binôme, ne font pas le même calcul. C’est normal qu’ils ne disent pas la même chose. Ce qui compte, c’est de se mettre d’accord avant la plongée. »
- **Le geste** : avant la mise à l’eau, comparer les moyens de désaturation de la palanquée et convenir d’une règle ; sous l’eau, respecter le moyen le plus pénalisant.
- **Au tableau** :

{{< schema "des-tableau-caisses" >}}

- **Les idées fausses** :
  - « Si la table et l’ordinateur ne disent pas pareil, l’un des deux est faux » : ils appliquent deux modèles différents.
  - « Le modèle le plus récent est forcément le plus sûr » : chaque modèle a ses marges et ses limites, et aucun ne garantit l’absence d’accident.

## 3. À l’examen

### Côté capacitaire

L’écrit 4, « Désaturation », dure 45 minutes au plus, avec un coefficient 3. Sur le DCIEM, le MFT attend la « Compréhension des différences avec le modèle de Haldane ». Les questions types :

- expliquer la différence entre des compartiments en parallèle et en série, avec un schéma ;
- dire pourquoi, dans un modèle en série, la désaturation des derniers compartiments est retardée ;
- expliquer ce que veut dire « gestion native des plongées successives », et comparer avec la majoration de la MN90 ;
- expliquer pourquoi deux moyens de désaturation donnent des résultats différents pour la même plongée.

Pour réviser les notions une à une, voir la [mindmap « Désaturation »](/capacitaire/desaturation/#dciem-principe).

### Côté pédagogie théorique

Le DCIEM n’est pas un sujet en soi, mais il nourrit des sujets officiels de 2026 sur la cohabitation des moyens de désaturation :

- CTR Aquitaine : « Les moyens de calculs de la désaturation et les règles de cohabitation des différentes procédures : construisez une séance sur ce thème à de futurs niveaux 2. »
- CTR Île-de-France : « la gestion des procédures de désaturation différentes au sein d’une palanquée pour des plongeurs en formation GP-N4 ».

Ce que le jury regarde :

- **une explication simple** de la raison pour laquelle les moyens de désaturation diffèrent : des modèles différents, sans entrer dans les calculs ;
- **une règle claire et pratique** pour la palanquée : se mettre d’accord avant, respecter le moyen le plus pénalisant ;
- **le niveau adapté** : une idée au N2, les principes au N3, la gestion de la palanquée au GP-N4.

La méthode complète est dans la [trame de la pédagogie théorique](/ressources/trame-pedagogie-theorique/).

## Les pièges classiques

- **Confondre « en série » et « l’un après l’autre dans le temps »** : tous les compartiments se chargent en même temps, mais chacun à partir du précédent.
- **Dire que tous les compartiments du DCIEM échangent avec le sang** : seul le premier le fait.
- **Confondre le facteur de répétition et la majoration.**
- **Présenter un modèle comme meilleur ou plus sûr que l’autre**, sans source.
- **Croire qu’un modèle décrit le corps tel qu’il est** : c’est un outil de calcul.
- **Mélanger deux méthodes de calcul au cours d’une même journée.**

## Sources

**Le MFT de la FFESSM**, qui fait foi : MF1 (juillet 2026, module capacitaire, désaturation, « Autre modèle »), Plongeur Niveau 2 (mai 2026), Niveau 3 (décembre 2025) et GP-N4 (mai 2026).

**Les sujets de pédagogie théorique 2026** des CTR Aquitaine et Île-de-France.

**Le site** : les mini-fiches de la [mindmap Désaturation](/capacitaire/desaturation/#dciem-principe) et la fiche [Le modèle de Haldane et ses dérivés](/theorie/modele-haldane/).

**Les références consultées**, pour l’histoire et la structure du modèle :

- [History of decompression research and development](https://en.wikipedia.org/wiki/History_of_decompression_research_and_development) (Wikipédia, en anglais), qui cite le rapport de R. Nishi et G. Lauckner, *Development of the DCIEM 1983 Decompression Model for Compressed Air Diving* (1984) ;
- [Decompression theory](https://en.wikipedia.org/wiki/Decompression_theory) (Wikipédia, en anglais), pour le fonctionnement des modèles en série.

Ni les tables DCIEM ni leur manuel n’ont pu être consultés : les points qui en dépendent, comme le facteur de répétition, sont signalés dans le texte.

**Les supports de formation consultés comme repères**, sans reprise de texte ni d’image : un cours de formation théorique Niveau 4 sur les éléments de calcul de tables (2013).

**Les illustrations** : tous les schémas de cette fiche sont dessinés pour le site.

{{< sujets-examen >}}

{{< encart "orange" >}}
**Cette fiche est une aide, pas une réponse type.** Le DCIEM est présenté ici dans son principe : pour utiliser des tables ou un ordinateur, suis leur mode d’emploi. Pour l’examen, suis le MFT et les consignes de ta CTR.
{{< /encart >}}
