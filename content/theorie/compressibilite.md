---
title: "Passe-ton-MF1 · Compressibilité des gaz"
description: "La compressibilité des gaz pour le MF1 : loi de Mariotte, pression absolue, consommation et autonomie, densité du gaz respiré, température et pression des blocs. Les calculs de l'écrit 2 du capacitaire, et comment l'enseigner du N1 au GP-N4."
classePrincipal: "principal--interieur principal--capa"
titre: "Compressibilité des gaz"
resume: "Mariotte, consommation, densité de l’air et température des blocs : comprendre ce que la pression fait aux gaz, réussir les calculs du capacitaire, et savoir l’expliquer à tes élèves."
weight: 20
epreuves: ["theorique"]
mindmap: "aspects-theoriques"
menuParent: "/ressources"
sources: "MFT de la FFESSM : MF1, version juillet 2026 (module capacitaire, aspects théoriques de l’activité) ; Plongeur Niveau 1, version décembre 2025 ; Plongeur Niveau 2, version mai 2026 ; Plongeur Niveau 3, version décembre 2025 ; GP-N4, version mai 2026"
---

## En deux minutes

- **Sous l’eau, la pression augmente d’environ 1 bar tous les 10 m.** En surface, on vit déjà sous 1 bar d’air : à 10 m, on est à 2 bar, à 30 m à 4 bar.
- **Un gaz se comprime quand la pression augmente, et se dilate quand elle baisse** : c’est la loi de Mariotte. Les plus fortes variations ont lieu entre la surface et 10 m.
- **Plus on est profond, plus on consomme** : chaque inspiration prend au bloc un air plus comprimé. À 30 m, le bloc se vide quatre fois plus vite qu’en surface.
- **L’air respiré devient plus dense en profondeur**, donc plus difficile à faire circuler : un facteur d’essoufflement.
- **La pression d’un bloc suit sa température** : chaud au sortir du gonflage, il affiche plus qu’une fois refroidi.

Au capacitaire, l’écrit 2 demande des problèmes « dont les données chiffrées sont simples ». Devant tes élèves, Mariotte est la loi la plus utile de toutes : c’est elle qui explique la plupart des réflexes de sécurité.

## 1. Comprendre

### La loi de Mariotte {#mariotte}

**La pression absolue** est la pression totale que subit le plongeur : celle de l’air au-dessus de l’eau, la **pression atmosphérique**, environ 1 bar, plus celle de l’eau, la **pression relative**, environ 1 bar par 10 m.

**Pabs = Patm + Phydro**, soit en pratique **1 bar + 1 bar par tranche de 10 m**.

| Profondeur | Pression absolue | Volume d’un même gaz |
|---|---:|---:|
| Surface | 1 bar | 1 |
| 10 m | 2 bar | 1/2 |
| 20 m | 3 bar | 1/3 |
| 30 m | 4 bar | 1/4 |
| 40 m | 5 bar | 1/5 |

**L’énoncé** : à température constante, le volume d’un gaz est inversement proportionnel à la pression qu’il subit. **P1 × V1 = P2 × V2**.

{{< schema "comp-ballons" >}}

**La conséquence la plus importante** : c’est près de la surface que le volume varie le plus. Entre 0 et 10 m, il double ; entre 30 et 40 m, il ne change que d’un quart. C’est donc dans les derniers mètres de la remontée que l’air enfermé (poumons, oreilles, masque, gilet) se dilate le plus vite.

La même loi explique pourquoi la combinaison s’écrase et le gilet se vide en descendant : ses effets sur l’équilibre du plongeur sont détaillés dans la fiche [Flottabilité](/theorie/flottabilite/#lestage).

La pression absolue sert aussi à calculer la pression de chaque gaz que tu respires : c’est la loi de Dalton, dans la fiche [Pressions partielles](/theorie/pressions-partielles/#dalton).

[L’enseigner →](#enseigner-mariotte)

### La consommation et l’autonomie {#consommation}

Ton détendeur te donne de l’air **à la pression ambiante**. À chaque inspiration, tes poumons se remplissent du même volume qu’en surface, mais cet air est plus comprimé : il a fallu en prendre davantage au bloc.

{{< schema "comp-consommation" >}}

Trois formules suffisent :

- **consommation à la profondeur = consommation en surface × pression absolue** ;
- **air disponible = volume du bloc × (pression de départ − réserve)** ;
- **autonomie = air disponible ÷ consommation à la profondeur**.

La **réserve** est l’air qu’on garde pour remonter, faire ses paliers et faire face à un imprévu. Sa valeur est fixée par la palanquée ou par le directeur de plongée.

Le MFT N2 et N3 demande aussi de raisonner **en bars par minute**, ce que l’on lit vraiment sur le manomètre : **bars par minute = litres par minute ÷ volume du bloc**.

[L’enseigner →](#enseigner-consommation)

### La densité du gaz respiré {#densite-gaz}

Quand un gaz est comprimé, ses molécules sont plus serrées : la même masse occupe un volume plus petit. **La masse volumique de l’air augmente donc avec la pression** : à 40 m, sous 5 bar, l’air est cinq fois plus dense qu’en surface.

{{< schema "comp-densite" >}}

Pour le plongeur, cela change deux choses :

- **respirer demande plus d’effort** : un air plus dense s’écoule moins facilement dans le détendeur et dans les voies respiratoires ;
- **le risque d’essoufflement augmente** : l’effort pour respirer favorise l’accumulation de gaz carbonique. Voir l’[essoufflement](/accidents-de-plongee/#essoufflement) sur la page des accidents.

Avec la narcose et la toxicité de l’oxygène, la densité de l’air est l’une des trois raisons de la limite des 60 m à l’air : voir [Pressions partielles](/theorie/pressions-partielles/#limites-toxicite).

[L’enseigner →](#enseigner-densite)

### La température et la pression {#temperature-bloc}

Un bloc a un volume fixe. Si l’air qu’il contient chauffe, ses molécules s’agitent plus et sa pression monte ; s’il refroidit, elle baisse. C’est la **loi de Charles** :

**à volume constant, P1 ÷ T1 = P2 ÷ T2**, avec la température **en kelvins** : **T = t °C + 273**.

{{< schema "comp-temperature" >}}

Trois situations à connaître :

- **après le gonflage**, l’air comprimé est chaud : une fois refroidi, le bloc affiche moins ;
- **un bloc laissé au soleil** voit sa pression monter ;
- **dans une eau froide**, la pression lue au fond est un peu plus basse que sur le bateau.

[L’enseigner →](#enseigner-temperature)

## 2. Les calculs types

Même méthode qu’en flottabilité : **écrire ce qu’on cherche, poser les données avec leurs unités, calculer, vérifier que le résultat a un sens.** Et toujours raisonner en **pression absolue**.

### Exemple 1 : un volume qui change de profondeur

*Un ballon contient 6 L d’air à 30 m. Quel est son volume à 10 m, puis en surface ?*

{{< pistes >}}
- **Pressions absolues** : 30 m donne 4 bar ; 10 m donne 2 bar ; la surface, 1 bar.
- **Mariotte** : P1 × V1 = P2 × V2, donc V2 = P1 × V1 ÷ P2.
- **À 10 m** : 4 × 6 ÷ 2 = **12 L**.
- **En surface** : 4 × 6 ÷ 1 = **24 L**.
- **Vérification** : la pression est divisée par 4 entre 30 m et la surface, le volume est multiplié par 4. C’est cohérent.
{{< /pistes >}}

### Exemple 2 : la consommation et l’autonomie

*Un plongeur consomme 20 L/min en surface. Il plonge à 30 m avec un bloc de 12 L gonflé à 200 bar, et garde une réserve de 50 bar. Quelle est son autonomie au fond ? À quel rythme son manomètre descend-il ?*

{{< pistes >}}
- **Air disponible** : 12 × (200 − 50) = 12 × 150 = **1 800 L**.
- **Consommation à 30 m** : 20 × 4 = **80 L/min**.
- **Autonomie au fond** : 1 800 ÷ 80 = **22,5 min**, soit environ 22 min. La remontée et les paliers se prennent sur la réserve.
- **En bars par minute** : 80 ÷ 12 ≈ **6,7 bar/min**. Au bout de 10 min au fond, le manomètre a baissé d’environ 67 bar.
- **Vérification** : à 30 m, on consomme quatre fois plus qu’en surface ; une autonomie de 22 min pour 150 bar utiles est plausible.
{{< /pistes >}}

### Exemple 3 : un bloc qui refroidit

*Un bloc est gonflé à 230 bar ; l’air est alors à 50 °C. Quelle pression affichera-t-il à 15 °C ?*

{{< pistes >}}
- **En kelvins** : 50 + 273 = 323 K ; 15 + 273 = 288 K.
- **Charles** : P2 = P1 × T2 ÷ T1 = 230 × 288 ÷ 323 ≈ **205 bar**.
- **Vérification** : le bloc a refroidi, sa pression a baissé. Le piège : avec des degrés Celsius, on trouverait 230 × 15 ÷ 50 = 69 bar, un résultat absurde.
{{< /pistes >}}

### Exemple 4 : l’air pris au bloc pour gonfler un gilet au fond

*À 20 m, un plongeur injecte 4 L d’air dans son gilet. Combien d’air prend-il à son bloc de 12 L ? De combien baisse son manomètre ?*

{{< pistes >}}
- **À 20 m**, la pression absolue est de 3 bar : 4 L à 3 bar correspondent à 4 × 3 = **12 L** d’air détendu à la surface.
- **Sur un bloc de 12 L** : 12 ÷ 12 = **1 bar** de moins au manomètre.
- **À la remontée**, ces 4 L redeviennent 12 L en surface : il faut purger le gilet tout au long de la remontée (voir [Flottabilité](/theorie/flottabilite/#relevage) pour le même raisonnement avec un parachute).
{{< /pistes >}}

## 3. L’enseigner

Au N1, le MFT demande des principes présentés **sans calcul**, en lien direct avec la prévention des barotraumatismes et la maîtrise de la ventilation à la remontée. Au N2 et au N3, la consommation et l’autonomie se démontrent **par le calcul**, en litres et en bars par minute. Au GP-N4, il s’agit de surveiller l’air de toute une palanquée.

### Mariotte, au N1 {#enseigner-mariotte}

- **L’image du quotidien** : des ballons qui rétrécissent à la descente et regonflent à la remontée. Une bouteille d’eau vide, fermée en surface, revient écrasée d’une plongée à 10 m ; fermée au fond, elle gonfle en remontant.
- **En clair** : « L’eau serre tout ce qui contient de l’air. En descendant, l’air se fait petit ; en remontant, il reprend sa place. »
- **Les réflexes qui en découlent**, à dire explicitement :
  - **à la descente, j’équilibre** mes oreilles dès les premiers mètres, et je souffle un peu par le nez dans mon masque : l’air y rétrécit, il faut en remettre ;
  - **à la remontée, je ne bloque jamais ma respiration** : l’air de mes poumons regonfle, il doit pouvoir sortir ;
  - **à la remontée, je purge mon gilet** : son air regonfle aussi, et me ferait monter de plus en plus vite.
- **Au tableau** :

{{< schema "comp-tableau-ballons" >}}

- **Les idées fausses** :
  - « La pression, c’est surtout au fond qu’elle est dangereuse » : c’est **près de la surface** que le volume change le plus.
  - « Si je n’ai pas mal, tout va bien » : on équilibre avant d’avoir mal, pas après.

Si ces réflexes ne sont pas respectés, Mariotte mène directement aux barotraumatismes : de l’[oreille moyenne](/accidents-de-plongee/#oreille-moyenne), le [placage de masque](/accidents-de-plongee/#placage-masque) et, le plus grave, la [surpression pulmonaire](/accidents-de-plongee/#surpression-pulmonaire). Les fiches de la page Accidents les détaillent.

**Au N2**, Mariotte s’applique au gilet et au poumon ballast en profondeur : il faut plus d’air dans le gilet au fond, qui se dilatera d’autant plus à la remontée. Le MFT N2 relie explicitement Mariotte à la flottabilité : voir [Flottabilité](/theorie/flottabilite/#enseigner-archimede).

### La consommation, du N1 au GP-N4 {#enseigner-consommation}

**Au N1**, sans calcul :

- **L’image du quotidien** : une paille plantée dans une brique de jus. En surface, on aspire un peu de jus à chaque gorgée ; au fond, chaque gorgée vide la brique quatre fois plus vite.
- **En clair** : « Plus tu es profond, plus ton bloc se vide vite. »
- **Le geste** : regarder son manomètre régulièrement, et le montrer à son guide quand il le demande.
- **Au tableau** :

{{< schema "comp-tableau-bloc" >}}

- **Les idées fausses** :
  - « Un bloc dure toujours autant » : sa durée dépend de la profondeur, de l’effort, du froid, du stress.
  - « Je regarderai mon manomètre quand je serai essoufflé » : c’est trop tard.

**Au N2 et au N3**, le calcul : la consommation au fond, l’autonomie, puis le passage aux **bars par minute**, pour que l’élève lise son manomètre avec un ordre de grandeur en tête. Le MFT N2 demande un **protocole de contrôle des consommations** dans la palanquée : quand on se montre son manomètre, et à quelle pression on fait demi-tour.

**Au GP-N4**, le guide surveille la consommation de toute sa palanquée : c’est le plongeur qui consomme le plus qui fixe la fin de la plongée.

### La densité du gaz, au N2 et au N3 {#enseigner-densite}

- **L’image du quotidien** : aspirer de l’eau à la paille, puis un milk-shake épais. Le geste est le même, l’effort n’est pas le même.
- **En clair** : « Au fond, l’air est plus épais. Respirer y demande plus d’effort : il faut se ménager. »
- **Le geste** : en profondeur, palmer calmement, respirer amplement et lentement, en insistant sur l’expiration. À la moindre gêne, s’arrêter, se reposer, et remonter de quelques mètres si besoin.
- **Au tableau** :

{{< schema "comp-tableau-epais" >}}

- **Les idées fausses** :
  - « L’essoufflement, c’est un problème de forme physique » : la profondeur y contribue, même chez un plongeur entraîné.
  - « Un meilleur détendeur règle tout » : il aide, mais l’air reste plus dense.

C’est la base de la prévention de l’[essoufflement](/accidents-de-plongee/#essoufflement), que le MFT N3 associe à l’accroissement des risques avec la profondeur.

### La température, au N2 {#enseigner-temperature}

- **L’image du quotidien** : une bouteille de soda laissée en plein soleil dans une voiture, qui devient dure comme du bois.
- **En clair** : « La chaleur fait monter la pression d’un bloc, le froid la fait baisser. »
- **Le geste** : ne pas laisser les blocs au soleil, et ne pas s’étonner si le manomètre affiche un peu moins sur le bateau qu’à la station de gonflage.
- **Au tableau** : un bloc, un soleil, une flèche vers le haut ; un bloc, un flocon, une flèche vers le bas.
- **Les idées fausses** :
  - « Mon bloc fuit, il a perdu 20 bar depuis hier » : il a peut-être seulement refroidi.
  - « Les degrés suffisent pour calculer » : il faut des kelvins.

## 4. À l’examen

### Côté capacitaire

L’écrit 2, « Aspects théoriques de l’activité », dure 45 minutes au plus, avec un coefficient 2. Sur la compressibilité des gaz, le MFT attend la consommation des plongeurs en surface et en immersion avec ses conséquences pratiques, l’influence de la densité des gaz respirés et l’influence de la température sur la pression des blocs, à travers des problèmes **dont les données chiffrées sont simples**. Les questions types :

- calculer une pression absolue et un volume à une autre profondeur ;
- calculer une consommation au fond, un air disponible, une autonomie, et la convertir en bars par minute ;
- calculer la pression d’un bloc après un changement de température, en kelvins ;
- expliquer pourquoi respirer est plus difficile en profondeur.

Pour réviser les notions une à une, voir la [mindmap « Aspects théoriques »](/capacitaire/aspects-theoriques/#mariotte).

### Côté pédagogie théorique

Mariotte et ses conséquences sont un thème central de cours théorique : pour des N1, à travers la prévention des barotraumatismes ; pour des N2 ou des N3, à travers la consommation et l’autonomie. Par exemple : « La pression et ses effets sur le plongeur » pour des N1, ou « Calculer son autonomie avant une plongée à 30 m » pour des N2. Ce sont des formulations possibles, pas des sujets officiels.

Ce que le jury regarde :

- **le niveau adapté au public** : pas de calcul pour un N1, des calculs simples et concrets pour un N2 ;
- **le lien avec les réflexes** : chaque effet de Mariotte doit déboucher sur un geste de sécurité ;
- **un fil rouge tiré d’une plongée**, plutôt qu’une suite de formules.

La méthode complète est dans la [trame de la pédagogie théorique](/ressources/trame-pedagogie-theorique/).

## Les pièges classiques

- **Oublier la pression atmosphérique** : à 10 m, on est à 2 bar, pas à 1.
- **Calculer avec la pression relative** dans Mariotte ou dans la consommation.
- **Oublier la réserve** dans le calcul de l’air disponible.
- **Calculer la température en degrés Celsius** au lieu des kelvins.
- **Penser que le danger est au fond** : c’est près de la surface que les volumes changent le plus.
- **Présenter Mariotte sans les réflexes** qui en découlent : à des élèves, la loi n’a de sens que par les gestes qu’elle impose.

{{< sujets-examen >}}

{{< encart "orange" >}}
**Cette fiche est une aide, pas une réponse type.** Les conventions utilisées (1 bar en surface, 1 bar par 10 m, kelvins arrondis à t + 273, consommation de 20 L/min) sont des simplifications d’usage. Pour l’examen, suis les données de l’énoncé, le MFT en vigueur et les consignes de ta CTR.
{{< /encart >}}
