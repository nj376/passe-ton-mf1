---
title: "Passe-ton-MF1 · Pressions partielles"
description: "Les pressions partielles pour le MF1 : loi de Dalton, seuils de toxicité de l'oxygène et de l'azote à l'air, limite des 60 m, qualité de l'air des blocs. Les calculs de l'écrit 2 du capacitaire, et comment l'enseigner du N2 au GP-N4."
classePrincipal: "principal--interieur principal--capa"
titre: "Pressions partielles"
resume: "Dalton, narcose, limite des 60 m et air des blocs : comprendre pourquoi chaque gaz agit selon sa pression partielle, réussir les calculs du capacitaire, et savoir l’expliquer à tes élèves."
weight: 30
epreuves: ["theorique"]
mindmap: "aspects-theoriques"
menuParent: "/ressources"
sources: "MFT de la FFESSM : MF1, version juillet 2026 (module capacitaire, aspects théoriques de l’activité) ; Plongeur Niveau 2, version mai 2026 ; Plongeur Niveau 3, version décembre 2025 ; GP-N4, version mai 2026 ; Code du sport, articles A322-92 et suivants (extrait du MFT, version juin 2026)"
---

## En deux minutes

- **L’air est un mélange** : environ 21 % d’oxygène et 79 % d’azote. Cette proportion ne change pas avec la profondeur.
- **Ce qui change, c’est la pression de chaque gaz**, sa **pression partielle** : elle vaut la pression absolue multipliée par la part du gaz. C’est la loi de Dalton.
- **Chaque gaz agit selon sa pression partielle** : l’azote devient narcotique, l’oxygène toxique au-delà d’un seuil.
- **D’où des limites** : à l’air, la narcose se fait sentir vers 30 m, la plongée est limitée à 60 m par le Code du sport, et l’oxygène atteint son seuil de toxicité vers 66 m.
- **Un polluant obéit à la même loi** : une trace de monoxyde de carbone dans un bloc agit cinq fois plus fort à 40 m qu’en surface.

Au capacitaire, le MFT limite le sujet aux limites de toxicité de l’oxygène et de l’azote et au gonflage des blocs à l’air : **les mélanges autres que l’air ne sont pas traités**. Devant tes élèves, les pressions partielles expliquent pourquoi la profondeur n’est pas qu’une affaire de paliers.

## 1. Comprendre

### La loi de Dalton {#dalton}

**L’énoncé** : la pression d’un mélange de gaz est la somme des pressions partielles de ses composants. Chaque gaz exerce la pression qu’il exercerait s’il était seul.

**Pp d’un gaz = pression absolue × fraction du gaz dans le mélange**

La pression absolue vaut environ 1 bar en surface, plus 1 bar par tranche de 10 m : elle est expliquée dans la fiche [Compressibilité des gaz](/theorie/compressibilite/#mariotte). À l’air, avec 21 % d’oxygène et 79 % d’azote :

| Profondeur | Pression absolue | PpO2 | PpN2 |
|---|---:|---:|---:|
| Surface | 1 bar | 0,21 bar | 0,79 bar |
| 10 m | 2 bar | 0,42 bar | 1,58 bar |
| 30 m | 4 bar | 0,84 bar | 3,16 bar |
| 60 m | 7 bar | 1,47 bar | 5,53 bar |

{{< schema "pp-barres" >}}

Retiens l’idée : **la proportion ne bouge pas, la pression de chaque gaz grandit.** Ce n’est pas l’air qui change au fond, c’est la force avec laquelle chaque gaz agit sur l’organisme.

[L’enseigner →](#enseigner-dalton)

### Les seuils de toxicité {#limites-toxicite}

Un gaz respiré n’a d’effet sur l’organisme qu’à partir d’une certaine pression partielle. Les repères à connaître, à l’air :

| Gaz | Seuil | Ce qui se passe | À l’air, atteint vers |
|---|---|---|---|
| Oxygène | **0,16 bar** au minimum (Code du sport) | En dessous, l’organisme manque d’oxygène : c’est l’hypoxie | Jamais en plongée à l’air : en surface, la PpO2 est déjà de 0,21 bar |
| Azote | **vers 3,2 bar** (repère) | La narcose devient sensible, puis s’accentue avec la profondeur | 30 m |
| Oxygène | **1,6 bar** au maximum (Code du sport) | L’oxygène devient toxique pour le système nerveux : l’hyperoxie | 66 m |

{{< schema "pp-seuils" >}}

Le Code du sport fixe deux limites : une PpO2 comprise **entre 0,16 et 1,6 bar**, et une plongée à l’air **limitée à 60 m**. À 60 m, la PpN2 dépasse 5,5 bar : la narcose y est forte, la PpO2 approche de son seuil, et l’air est sept fois plus dense qu’en surface.

Pour la narcose, le chiffre de 3,2 bar est un **repère**, pas une frontière : elle varie beaucoup selon les personnes et les jours, et le froid, la fatigue, le stress ou l’essoufflement l’aggravent.

[L’enseigner →](#enseigner-seuils)

### Le gonflage et la qualité de l’air {#gonflage}

L’air d’un bloc vient d’un compresseur. S’il aspire des gaz d’échappement, ou si son huile surchauffe, le bloc peut contenir des polluants : du **monoxyde de carbone** (CO), des vapeurs d’huile, de l’eau.

Un polluant suit la loi de Dalton comme les autres gaz : **sa pression partielle est multipliée par la pression absolue**. Une teneur sans effet en surface devient cinq fois plus agressive à 40 m.

{{< schema "pp-pollution" >}}

La prévention se joue à la station de gonflage :

- une **prise d’air à l’abri** des fumées et des gaz d’échappement ;
- des **filtres et des purges entretenus** ;
- un **contrôle régulier de la qualité de l’air**, selon la norme EN 12021.

Les obligations de la station de gonflage d’un club sont détaillées dans la fiche [Le club, un établissement d’APS](/ressources/le-club-etablissement-aps/#3-le-cas-du-club-de-plongée-la-station-de-gonflage).

[L’enseigner →](#enseigner-gonflage)

## 2. Les calculs types

Toujours la même méthode : **pression absolue d’abord, fraction du gaz ensuite**. Et toujours à l’air, puisque le programme écarte les autres mélanges.

### Exemple 1 : les pressions partielles à 40 m

*Un plongeur respire de l’air à 40 m. Quelles sont ses PpO2 et PpN2 ?*

{{< pistes >}}
- **Pression absolue à 40 m** : 1 + 4 = **5 bar**.
- **PpO2** = 5 × 0,21 = **1,05 bar**.
- **PpN2** = 5 × 0,79 = **3,95 bar**.
- **Vérification** : 1,05 + 3,95 = 5 bar, la pression absolue. La PpN2 dépasse le repère de 3,2 bar : la narcose est probable ; la PpO2 reste sous 1,6 bar.
{{< /pistes >}}

### Exemple 2 : à quelle profondeur un seuil est-il atteint ?

*À l’air, à partir de quelle profondeur la PpN2 atteint-elle 3,2 bar ? Et la PpO2, 1,6 bar ?*

{{< pistes >}}
- **On renverse la formule** : pression absolue = Pp ÷ fraction du gaz.
- **Azote** : 3,2 ÷ 0,79 ≈ 4,05 bar, soit (4,05 − 1) × 10 ≈ **30 m**.
- **Oxygène** : 1,6 ÷ 0,21 ≈ 7,62 bar, soit (7,62 − 1) × 10 ≈ **66 m**.
- **Vérification** : l’hyperoxie arrive au-delà de la limite de 60 m fixée pour l’air. La narcose, elle, est un risque de toute la zone des 30 à 60 m.
{{< /pistes >}}

### Exemple 3 : la limite de 60 m

*Quelles sont la PpO2 et la PpN2 d’un plongeur à l’air à 60 m ?*

{{< pistes >}}
- **Pression absolue** : 1 + 6 = **7 bar**.
- **PpO2** = 7 × 0,21 = **1,47 bar**, proche de la limite de 1,6 bar.
- **PpN2** = 7 × 0,79 ≈ **5,53 bar**, bien au-delà du repère de la narcose.
- **Conclusion** : à 60 m, deux limites sont proches à la fois, sans compter un air sept fois plus dense qu’en surface.
{{< /pistes >}}

### Exemple 4 : un polluant amplifié par la profondeur

*Pour l’exemple, un bloc contient une petite proportion de monoxyde de carbone, notée f. Comment sa pression partielle évolue-t-elle entre la surface et 40 m ?*

{{< pistes >}}
- **En surface** : Pp CO = 1 × f.
- **À 40 m** : Pp CO = 5 × f, soit **cinq fois plus**.
- **Ce qu’il faut retenir** : on ne calcule pas ici un seuil de toxicité, mais un rapport. Ce qui est négligeable en surface ne l’est plus au fond. D’où l’exigence d’un air propre, contrôlé selon la norme EN 12021.
{{< /pistes >}}

## 3. L’enseigner

Le MFT N1 ne parle pas des pressions partielles. Au **N2**, il demande des « notions sur les pressions partielles : seuils de toxicité des gaz », en précisant que **« les calculs viennent en appui de la démonstration et ne constituent pas un outil d’évaluation »**. Au **N3**, la narcose fait partie des risques qui augmentent avec la profondeur. Au **GP-N4**, il s’agit de la reconnaître et de la prévenir chez les autres.

### Dalton, au N2 {#enseigner-dalton}

- **L’image du quotidien** : une salle de classe qu’on remplit de plus en plus. Il y a toujours un élève sur cinq qui porte un tee-shirt vert ; plus la salle est pleine, plus il y a de tee-shirts verts, même si la proportion ne change pas.
- **En clair** : « Au fond, l’air a toujours la même composition. Mais chaque gaz pousse plus fort, et c’est ça que ton corps ressent. »
- **Le geste** : faire le lien avec la profondeur maximale de l’élève. Ce n’est pas qu’une affaire de paliers, c’est aussi une affaire de gaz.
- **Au tableau**, l’analogie des barres oxygène et azote qui grandissent avec la profondeur, la proportion de chaque gaz restant la même :

{{< schema "pp-tableau-barres" >}}

- **Les idées fausses** :
  - « Au fond, il y a plus d’azote dans l’air » : la **proportion** est la même, c’est la **pression** qui augmente.
  - « Respirer de l’oxygène, c’est toujours bon » : au-delà d’une certaine pression partielle, il devient toxique.

Un calcul simple, comme la PpN2 à 30 m, peut illustrer le propos. Mais au N2, il sert à démontrer, pas à évaluer.

### Les seuils, du N2 au GP-N4 {#enseigner-seuils}

**La narcose, au N2 et au N3**

- **L’image du quotidien** : le verre de trop. Plus on descend, plus le verre se remplit. Et comme après un verre de trop, celui qui est atteint est le dernier à s’en rendre compte.
- **En clair** : « Au-delà d’une trentaine de mètres, l’azote peut te monter à la tête. Ça disparaît en remontant de quelques mètres. »
- **Le geste** : surveiller son binôme et ses instruments, convenir d’un signe, et **remonter de quelques mètres** au moindre doute. Le froid, la fatigue, le stress et l’essoufflement l’aggravent : on les évite.
- **Au tableau** :

{{< schema "pp-tableau-verre" >}}

- **Les idées fausses** :
  - « Je supporte bien la profondeur, je ne suis jamais narcosé » : la narcose varie selon les jours, et on la perçoit mal soi-même.
  - « La narcose, c’est seulement au-delà de 40 m » : elle peut se faire sentir dès 30 m, voire avant.

**La limite des 60 m à l’air, au N3**

- **L’image du quotidien** : trois voyants qui s’allument sur un tableau de bord. L’azote (la narcose), l’oxygène (qui approche de son seuil), et la densité du gaz (un air sept fois plus épais à respirer, voir [Compressibilité des gaz](/theorie/compressibilite/#densite-gaz)).
- **En clair** : « Au-delà de 60 m, à l’air, trois risques arrivent en même temps. C’est pour ça que la loi s’arrête là. »
- **Le geste** : respecter la profondeur maximale de ses prérogatives et celle fixée par le DP, et ne jamais « grappiller » quelques mètres.
- **Au tableau** :

{{< schema "pp-tableau-voyants" >}}

- **Les idées fausses** :
  - « La limite de 60 m, c’est seulement à cause des paliers » : c’est d’abord une affaire de gaz.
  - « Un bon plongeur peut descendre plus profond à l’air » : les pressions partielles sont les mêmes pour tout le monde.

L’hyperoxie et l’hypoxie bornent les pressions partielles d’oxygène autorisées : à l’air, on ne les rencontre pas dans la zone des 0 à 60 m, mais leur logique sert à comprendre les mélanges que l’élève découvrira plus tard.

**Au GP-N4**, le MFT demande de connaître les symptômes, les facteurs favorisants et la prévention de la narcose **en tant que guide**, et le **rôle facilitateur du CO2** : un plongeur essoufflé est plus exposé. Le guide surveille sa palanquée, repère les premiers signes et fait remonter de quelques mètres.

Les symptômes et la conduite à tenir sont détaillés dans la page Accidents : [narcose](/accidents-de-plongee/#narcose), [hyperoxie neurologique](/accidents-de-plongee/#hyperoxie-neurologique), [essoufflement](/accidents-de-plongee/#essoufflement).

### La qualité de l’air, du N1 au N3 {#enseigner-gonflage}

- **L’image du quotidien** : on ne remplit pas un verre d’eau au robinet d’un garage. Un bloc gonflé près d’un échappement, c’est pareil.
- **En clair** : « Un air pollué est encore plus dangereux en profondeur. Une odeur ou un goût bizarre, on ne plonge pas. »
- **Le geste** :
  - sentir l’air du bloc avant de s’équiper ; au moindre goût ou odeur suspects, changer de bloc et prévenir ;
  - si plusieurs plongeurs gonflés au même endroit ont mal à la tête, penser à l’air et le signaler.
- **Au tableau** : une inspiration en surface avec deux points gris, la même à 40 m avec dix points gris.
- **Les idées fausses** :
  - « L’air comprimé, c’est de l’air pur » : il est aussi propre que la station qui l’a gonflé.
  - « Une légère odeur, ce n’est pas grave » : en profondeur, l’effet est multiplié.

L’intoxication au monoxyde de carbone est détaillée sur la page Accidents : [monoxyde de carbone](/accidents-de-plongee/#monoxyde-carbone).

## 4. À l’examen

### Côté capacitaire

L’écrit 2, « Aspects théoriques de l’activité », dure 45 minutes au plus, avec un coefficient 2. Sur les pressions partielles, le MFT attend les **limites de toxicité de l’oxygène et de l’azote en fonction de la profondeur** et le **gonflage des blocs à l’air**, avec des problèmes aux données simples. **Les mélanges autres que l’air ne sont pas traités.** Les questions types :

- calculer la PpO2 et la PpN2 à une profondeur donnée ;
- trouver la profondeur à laquelle un seuil est atteint ;
- expliquer pourquoi la plongée à l’air est limitée à 60 m ;
- expliquer pourquoi un air pollué est plus dangereux en profondeur, et comment on prévient la pollution.

Pour réviser les notions une à une, voir la [mindmap « Aspects théoriques »](/capacitaire/aspects-theoriques/#dalton).

### Côté pédagogie théorique

Les pressions partielles se prêtent à un cours pour des N2 ou des N3. Par exemple : « La narcose » pour des N2 qui découvrent la zone des 20 à 40 m, ou « Pourquoi la plongée à l’air est limitée à 60 m » pour des N3. Ce sont des formulations possibles, pas des sujets officiels.

Ce que le jury regarde :

- **le niveau adapté au public** : au N2, les calculs restent en appui de la démonstration ;
- **le lien avec les comportements** : chaque seuil doit déboucher sur un geste (surveiller, remonter, respecter sa profondeur maximale) ;
- **des images concrètes** plutôt qu’une suite de formules.

La méthode complète est dans la [trame de la pédagogie théorique](/ressources/trame-pedagogie-theorique/).

## Les pièges classiques

- **Confondre proportion et pression partielle** : la composition de l’air ne change pas en profondeur.
- **Oublier la pression atmosphérique** dans la pression absolue.
- **Renverser la formule de travers** : pour trouver une profondeur, on divise la Pp par la fraction, puis on retire 1 bar avant de multiplier par 10.
- **Présenter 3,2 bar comme une frontière nette** pour la narcose : c’est un repère, très variable.
- **Faire des calculs de nitrox à l’écrit du capacitaire** : le programme s’en tient à l’air.
- **Détailler les accidents** dans un cours sur les pressions partielles : on montre le lien, puis on renvoie à un cours dédié.

{{< sujets-examen >}}

{{< encart "orange" >}}
**Cette fiche est une aide, pas une réponse type.** Les valeurs utilisées (21 % d’oxygène et 79 % d’azote, 1 bar en surface, 1 bar par 10 m, repère de 3,2 bar pour la narcose) sont des simplifications d’usage. Seules les limites de 0,16 et 1,6 bar de PpO2 et de 60 m à l’air viennent du Code du sport. Pour l’examen, suis les données de l’énoncé, le MFT en vigueur et les consignes de ta CTR.
{{< /encart >}}
