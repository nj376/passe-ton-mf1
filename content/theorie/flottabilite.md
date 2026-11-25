---
title: "Passe-ton-MF1 · Flottabilité"
description: "La flottabilité pour le MF1 : poussée d'Archimède, poids apparent, masse volumique et densité, lestage, relevage au parachute. Les calculs de l'écrit 2 du capacitaire, et comment l'enseigner du N1 au GP-N4."
classePrincipal: "principal--interieur principal--capa"
titre: "Flottabilité"
resume: "Archimède, poids apparent, masse volumique, lestage et relevage : comprendre la notion, réussir les calculs du capacitaire, et savoir l’expliquer à tes élèves."
weight: 10
epreuves: ["theorique"]
mindmap: "aspects-theoriques"
menuParent: "/ressources"
sources: "MFT de la FFESSM : MF1, version juillet 2026 (module capacitaire, aspects théoriques de l’activité) ; Plongeur Niveau 1, version décembre 2025 ; Plongeur Niveau 2, version mai 2026 ; Plongeur Niveau 3, version décembre 2025 ; GP-N4, version mai 2026"
---

## En deux minutes

- **Tout corps plongé dans l’eau est poussé vers le haut** par une force égale au poids de l’eau qu’il déplace : c’est la poussée d’Archimède.
- **Ce que le plongeur ressent, c’est son poids apparent** : son poids réel moins cette poussée. Positif, il coule ; négatif, il remonte ; nul, il est équilibré.
- **L’eau de mer porte un peu plus que l’eau douce**, parce qu’elle est plus dense : environ 1,03 kg par litre contre 1 kg.
- **Pendant une plongée, la flottabilité change sans cesse** : la combinaison s’écrase en descendant, le bloc s’allège en se vidant. Le lest, le gilet et le poumon ballast servent à corriger.
- **Pour relever un objet, on lui ajoute de l’air** : juste assez pour annuler son poids apparent, en purgeant à la remontée, car l’air se dilate.

Au capacitaire, l’écrit 2 attend des « problèmes simples et en lien avec la pratique ». Devant tes élèves, l’enjeu est ailleurs : leur faire **sentir** la flottabilité avant de la leur expliquer.

## 1. Comprendre

### La poussée d’Archimède {#archimede}

**L’énoncé** : tout corps plongé dans un liquide reçoit une poussée verticale, dirigée vers le haut, égale au poids du volume de liquide déplacé.

{{< schema "flot-archimede" >}}

Trois idées à retenir :

- **« Volume déplacé »**, c’est la place que l’objet prend dans l’eau. Un objet entièrement immergé déplace son propre volume ; un objet qui flotte n’en déplace qu’une partie.
- **La poussée ne dépend pas de la matière** : un litre de plomb et un litre de liège entièrement immergés reçoivent la même poussée. Ce qui change, c’est leur poids.
- **Pour un objet qui ne se déforme pas, la poussée ne dépend pas de la profondeur.** Pour un plongeur, c’est différent : sa combinaison et son gilet changent de volume avec la pression (voir [le lestage](#lestage)).

En pratique : **poussée (kg) ≈ volume immergé (L) × masse volumique du liquide (kg/L)**.

[L’enseigner →](#enseigner-archimede)

### Le poids réel et le poids apparent {#poids-apparent}

Le **poids réel** est celui qu’indique la balance hors de l’eau. Le **poids apparent** est ce qu’il en reste une fois dans l’eau :

**poids apparent = poids réel − poussée d’Archimède**

{{< schema "flot-trois-cas" >}}

| Poids apparent | Flottabilité | Ce qui se passe |
|---|---|---|
| Positif | Négative | L’objet coule. |
| Nul | Neutre | Il reste à sa profondeur : c’est l’équilibre recherché par le plongeur. |
| Négatif | Positive | Il remonte. |

Le vocabulaire est piégeux : un poids apparent **positif** donne une flottabilité **négative**. Choisis une façon de dire et tiens-la devant tes élèves.

[L’enseigner →](#enseigner-poids-apparent)

### La masse volumique et la densité {#masse-volumique}

- **La masse volumique** est la masse d’un volume donné : en kg/L ou en kg/m³. L’eau douce : 1 kg/L. L’eau de mer : environ 1,03 kg/L.
- **La densité** compare la masse volumique d’un corps à celle de l’eau. C’est un rapport, **sans unité** : une densité de 1,03 veut dire « 1,03 fois plus lourd que l’eau, à volume égal ».
- **Un corps plus dense que le liquide coule**, un corps moins dense flotte.

{{< schema "flot-douce-mer" >}}

D’où la conséquence pratique : le même plongeur, avec le même volume, est un peu mieux porté en mer qu’en lac. Il lui faut donc un peu plus de lest en mer.

[L’enseigner →](#enseigner-masse-volumique)

### Le lestage {#lestage}

Le plongeur équipé flotte, surtout à cause de l’air de sa combinaison et de ses poumons. Le **lest** compense cette flottabilité, pour qu’il puisse descendre et rester équilibré. Mais trois choses font varier sa flottabilité au cours d’une même plongée :

{{< schema "flot-plongee" >}}

- **La combinaison s’écrase en profondeur.** Le néoprène contient de petites bulles de gaz, qui diminuent de volume avec la pression ([loi de Mariotte](/theorie/compressibilite/#mariotte)). Moins de volume, moins de poussée : on perd de la flottabilité en descendant, on en regagne en remontant.
- **Le bloc s’allège en se vidant.** L’air a une masse : un bloc de 12 L gonflé à 200 bar contient environ 2 400 L d’air, soit à peu près 3 kg. Ce qu’on respire pendant la plongée, on ne le porte plus à la fin.
- **Le milieu compte** : en mer, la poussée est plus forte qu’en eau douce.

**Le bon lestage** permet de tenir le palier à 3 m en fin de plongée, bloc presque vide et gilet vide. Plus lourd, c’est un **surlestage** : il oblige à gonfler le gilet, donc à gérer plus d’air qui se dilate à la remontée, et il augmente l’effort et le risque d’essoufflement. Plus léger, le plongeur risque de ne pas pouvoir tenir son palier.

[L’enseigner →](#enseigner-lestage)

### Les problèmes pratiques : relevage et parachute {#relevage}

Pour relever un objet, on lui fixe un parachute qu’on remplit d’air.

1. **On calcule le poids apparent** de l’objet dans l’eau.
2. **On en déduit le volume d’air** à injecter pour l’annuler : chaque litre d’air immergé apporte une poussée d’environ 1 kg en eau douce, 1,03 kg en mer.
3. **On pense à [Mariotte](/theorie/compressibilite/#mariotte)** : en remontant, la pression baisse, l’air du parachute se dilate et pousse de plus en plus. Sans purge, l’ensemble accélère.

{{< schema "flot-relevage" >}}

[L’enseigner →](#enseigner-relevage)

## 2. Les calculs types

Les sujets de l’écrit 2 restent simples. Une méthode suffit : **écrire ce qu’on cherche, poser les données avec leurs unités, calculer, puis vérifier que le résultat a un sens.**

### Exemple 1 : le poids apparent d’une ancre

*Une ancre pèse 30 kg pour un volume de 4 L. Quel est son poids apparent en mer, puis en eau douce ?*

{{< pistes >}}
- **Poussée en mer** : 4 L × 1,03 kg/L = 4,12 kg.
- **Poids apparent en mer** : 30 − 4,12 = **25,88 kg**, soit environ 25,9 kg.
- **En eau douce** : 30 − 4 × 1 = **26 kg**.
- **Vérification** : l’ancre coule dans les deux cas (poids apparent positif), un peu moins lourdement en mer, ce qui est logique.
{{< /pistes >}}

### Exemple 2 : passer du lac à la mer

*Un plongeur parfaitement lesté en lac part plonger en mer, avec le même équipement. On prend, pour l’exemple, un volume total de 80 L pour le plongeur équipé. Combien de lest doit-il ajouter ?*

{{< pistes >}}
- **Poussée en lac** : 80 × 1 = 80 kg.
- **Poussée en mer** : 80 × 1,03 = 82,4 kg.
- **Différence** : 82,4 − 80 = **2,4 kg** de poussée en plus, donc environ 2,4 kg de lest à ajouter.
- **À retenir** : c’est un ordre de grandeur, qui dépend du volume réel du plongeur. On vérifie toujours son lestage dans l’eau.
{{< /pistes >}}

### Exemple 3 : relever un moteur au parachute

*Un moteur de 50 kg, d’un volume de 20 L, repose par 30 m de fond en mer. Quel volume d’air faut-il dans le parachute pour l’équilibrer ? Quelle quantité d’air cela représente-t-il dans le bloc ?*

{{< pistes >}}
- **Poids apparent du moteur** : 50 − 20 × 1,03 = 50 − 20,6 = **29,4 kg**.
- **Volume d’air dans le parachute** : il faut 29,4 kg de poussée. En mer, un litre d’air en apporte 1,03 kg : 29,4 ÷ 1,03 ≈ **28,5 L**. En arrondissant à 1 kg par litre, on trouve 29,4 L, ce qui laisse une petite marge.
- **Air pris au bloc** : à 30 m, la pression absolue est de 4 bar (voir [Compressibilité des gaz](/theorie/compressibilite/#mariotte)). Les 28,5 L au fond correspondent à 28,5 × 4 = **114 L** d’air détendu à la surface. Avec un bloc de 12 L, la pression baisse d’environ 114 ÷ 12 ≈ **9,5 bar**.
- **À la remontée** (Mariotte) : à 20 m (3 bar), ces 28,5 L deviennent 28,5 × 4 ÷ 3 = 38 L ; en surface, 114 L. Il faut purger tout au long de la remontée.
{{< /pistes >}}

### Exemple 4 : le bloc qui s’allège

*Un plongeur termine sa plongée avec 50 bar dans un bloc de 12 L gonflé au départ à 200 bar. De combien son bloc s’est-il allégé ?*

{{< pistes >}}
- **Air consommé** : 12 L × (200 − 50) bar = **1 800 L** d’air détendu.
- **Air consommé et autonomie** : le calcul complet est dans [Compressibilité des gaz](/theorie/compressibilite/#consommation).
- **Masse de cet air** : avec une masse volumique de l’air d’environ 1,2 g/L, 1 800 × 1,2 = 2 160 g, soit **un peu plus de 2 kg**.
- **Conséquence** : en fin de plongée, le plongeur a environ 2 kg de flottabilité en plus qu’au départ. C’est pour ça que le lestage se vérifie au palier, bloc presque vide.
{{< /pistes >}}

## 3. L’enseigner

Le MFT N1 le dit clairement : la physique se présente **sans calcul**. Le N2 relie la flottabilité à la profondeur et au lestage adapté à la plongée profonde. Au N3, elle sert surtout au palier en pleine eau ; au GP-N4, à l’assistance et au parachute. Ce qui suit est organisé notion par notion, et pour chaque notion, au niveau où elle compte vraiment.

### Archimède, au N1 {#enseigner-archimede}

- **L’image du quotidien** : le bouchon qui flotte, la pierre qui coule, le poisson qui reste entre deux eaux. Chacun l’a déjà vu.
- **En clair** : « L’eau te pousse vers le haut. Plus tu prends de place, plus elle pousse. »
- **Le geste** : à la mise à l’eau, gilet vide, fais-lui sentir que l’eau le porte. Puis qu’il gonfle un peu son gilet : il prend de la place, il remonte.
- **Au tableau** :

{{< schema "flot-tableau-archimede" >}}

- **Les idées fausses** :
  - « Ce qui est lourd coule toujours » : un bateau en acier flotte, parce qu’il déplace beaucoup d’eau.
  - « Plus on descend, plus l’eau pousse » : pour un objet rigide, la poussée reste la même ; pour le plongeur, elle diminue même, parce que sa combinaison s’écrase.

**Au N2**, on ajoute la profondeur : le plongeur perd du volume en descendant (combinaison, air du gilet), donc de la poussée. Il compense au gilet, et purge à la remontée. C’est le lien que le MFT N2 demande entre la [loi de Mariotte](/theorie/compressibilite/#enseigner-mariotte) et la flottabilité.

### Le poids apparent, au N1 {#enseigner-poids-apparent}

- **L’image du quotidien** : dans une piscine, on soulève facilement un camarade. Il n’a pas perdu de poids : l’eau en porte une partie.
- **En clair** : « Sous l’eau, ce que tu sens, c’est ton poids moins ce que l’eau porte. Équilibré, tu ne coules pas et tu ne remontes pas. »
- **Le geste** : le poumon ballast. Stabilisé, l’élève inspire un peu plus, il monte ; il expire, il descend. Chaque litre d’air en plus dans les poumons, c’est environ un kilo de poussée en plus. Le MFT N1 relie justement la flottabilité à la ventilation et au poumon ballast.
- **Au tableau** :

{{< schema "flot-tableau-poumon" >}}

- **Les idées fausses** :
  - « Être bien équilibré, c’est être léger » : c’est être **neutre**, ni lourd ni léger.
  - « Le gilet sert à remonter » : il sert à s’équilibrer. La remontée se fait en contrôlant sa vitesse.

L’équilibre ne se démontre pas, il se fait vivre : voir la fiche [Les trois pôles V.É.P.](/ressources/trois-poles-vep/).

### La masse volumique, au N1 {#enseigner-masse-volumique}

- **L’image du quotidien** : un œuf coule dans un verre d’eau du robinet, mais flotte dans de l’eau très salée. L’expérience se fait en vrai, avec du sel de cuisine.
- **En clair** : « L’eau de mer est un peu plus lourde que l’eau douce. Elle porte mieux, alors en mer, il faut un peu plus de plomb. »
- **Le geste** : à chaque changement de milieu ou d’équipement, on refait le point sur le lestage, dans l’eau, en début de plongée.
- **Au tableau** :

{{< schema "flot-tableau-mer" >}}

- **Les idées fausses** :
  - « Le sel rend le plongeur plus léger » : le plongeur n’a pas changé, c’est l’eau qui porte plus.
  - « Mon lest est le même partout » : il dépend du milieu, de la combinaison et du bloc.

### Le lestage, du N1 au N3 {#enseigner-lestage}

**Au N1**, le MFT demande d’informer l’élève sur ce qui lui permet de trouver son lestage, et de rechercher l’équilibre à 3 m.

- **L’image du quotidien** : la montgolfière. Elle emporte du lest pour descendre, et règle sa hauteur avec l’air de son ballon.
- **En clair** : « Le bon lest, c’est juste ce qu’il faut pour descendre, et pour rester au palier à la fin, bloc presque vide. Pas plus. »
- **Le geste** : la vérification au palier en fin de plongée, gilet vide. L’élève doit pouvoir y rester sans effort. S’il remonte, il manque du lest ; s’il doit gonfler son gilet, il en a trop.
- **Au tableau** :

{{< schema "flot-tableau-lestage" >}}

- **Les idées fausses** :
  - « Plus de plomb, c’est plus de sécurité » : le surlestage oblige à gonfler le gilet, essouffle, et complique la remontée.
  - « Le gilet corrigera » : il corrige, mais au prix d’un air à gérer à chaque changement de profondeur.

**Au N2**, le MFT parle de « lestage adapté à la plongée profonde » : plus on descend, plus la combinaison s’écrase, plus il faut d’air dans le gilet, et plus cet air se dilatera à la remontée. Un lestage juste limite tout cela.

**Au N3**, l’autonomie donne tout son sens au palier en pleine eau en fin de plongée : bloc presque vide, sans repère, l’équilibre doit tenir seul.

### Le relevage et le parachute, au N3 et au GP-N4 {#enseigner-relevage}

**Au N3**, le plongeur signale ses paliers en pleine eau avec un parachute.

- **L’image du quotidien** : une bulle qui grossit en montant vers la surface, comme dans un verre de limonade.
- **En clair** : « En remontant, l’air du parachute et du gilet gonfle. Si tu ne purges pas, tu accélères. »
- **Le geste** : purger son gilet régulièrement pendant la remontée, et contrôler sa vitesse sur son instrument.
- **Au tableau** :

{{< schema "flot-tableau-parachute" >}}

- **Les idées fausses** :
  - « Une fois gonflé, le parachute garde la même taille » : il grossit à mesure qu’on remonte.
  - « Il faut beaucoup d’air au fond » : juste assez pour équilibrer, le reste arrivera tout seul en remontant.

**Au GP-N4**, la même physique sert à l’assistance d’un plongeur et à la remontée au gilet : l’air du gilet de l’assisté se dilate lui aussi, et c’est au guide de maîtriser la vitesse de remontée pour deux. L’épreuve de démonstration technique de maîtrise de la remontée gilet (DTMR) évalue justement cette gestion de l’air et de la vitesse.

## 4. À l’examen

### Côté capacitaire

L’écrit 2, « Aspects théoriques de l’activité », dure 45 minutes au plus, avec un coefficient 2. Sur la flottabilité, le MFT attend les notions de densité et de masse volumique, de poids apparent, de poids réel, de poussée d’Archimède et de lestage des plongeurs, à travers des **problèmes simples et en lien avec la pratique**. Les questions types :

- calculer un poids apparent, en eau douce ou en mer ;
- calculer le volume d’air d’un parachute de relevage, puis l’air pris au bloc à une profondeur donnée ;
- ajuster un lestage : changement de milieu, de combinaison, de bloc ;
- expliquer pourquoi la flottabilité change pendant une plongée.

Pour réviser les notions une à une, voir la [mindmap « Aspects théoriques »](/capacitaire/aspects-theoriques/#archimede).

### Côté pédagogie théorique

La flottabilité est un thème classique de cours théorique, pour des N1 comme pour des N2. Par exemple : « La flottabilité et le lestage », thème proposé dans [S’entraîner](/s-entrainer/), ou un cours sur le poumon ballast pour des élèves N1. Ce sont des formulations possibles, pas des sujets officiels.

Ce que le jury regarde :

- **le niveau de détail adapté au public** : pour un N1, pas de formule ni de calcul ;
- **le lien avec la plongée** : chaque notion sert dans l’eau, au palier, au gilet, au lestage ;
- **un fil rouge et des images concrètes**, plutôt qu’un cours de physique.

La méthode complète est dans la [trame de la pédagogie théorique](/ressources/trame-pedagogie-theorique/).

## Les pièges classiques

- **Confondre masse volumique et densité** : la première a une unité, la seconde n’en a pas.
- **Oublier l’eau de mer** dans un calcul de poussée, ou l’oublier quand on parle du lestage.
- **Confondre le volume d’air au fond et l’air pris au bloc** : au fond, l’air est comprimé ; il faut multiplier par la pression absolue.
- **Oublier Mariotte au relevage** : sans purge, la remontée s’emballe.
- **Faire un cours de physique à des N1**, avec des formules : le MFT demande des principes présentés sans calcul.
- **Vouloir démontrer l’équilibre** : il se fait sentir dans l’eau, il ne se montre pas.

{{< sujets-examen >}}

{{< encart "orange" >}}
**Cette fiche est une aide, pas une réponse type.** Les valeurs utilisées (1,03 kg/L pour l’eau de mer, 1,2 g/L pour l’air) sont des ordres de grandeur. Pour l’examen, suis les données de l’énoncé, le MFT en vigueur et les consignes de ta CTR.
{{< /encart >}}
