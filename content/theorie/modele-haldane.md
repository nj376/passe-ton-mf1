---
title: "Passe-ton-MF1 · Le modèle de Haldane et ses dérivés"
description: "Le modèle de Haldane pour le MF1 : compartiments en parallèle, période et équation de la saturation, coefficient de sursaturation critique, M-values et facteurs de gradient, tables MN90, Bühlmann ZHL-16C, RGBM, plongées successives et majoration. Ce qu'attend l'écrit 4 du capacitaire, les calculs types, et comment l'enseigner."
classePrincipal: "principal--interieur principal--capa"
titre: "Le modèle de Haldane et ses dérivés"
resume: "Tables et ordinateurs reposent sur la même idée : un corps découpé en compartiments qui se chargent et se déchargent en azote, chacun à sa vitesse. Comprendre ce modèle, ses limites et ses réglages, et savoir l’expliquer à tes élèves, du N1 au GP-N4."
weight: 210
epreuves: ["theorique"]
mindmap: "desaturation"
menuParent: "/ressources"
sources: "MFT de la FFESSM : MF1, version juillet 2026 (module capacitaire, désaturation) ; Plongeur Niveau 1, version décembre 2025 ; Plongeur Niveau 2, version mai 2026 ; Plongeur Niveau 3, version décembre 2025 ; GP-N4, version mai 2026. Tables de plongée FFESSM établies à partir des tables MN90 et leur mode d’emploi. Le détail des documents est dans la partie Sources"
---

## En deux minutes

- **Un modèle de décompression découpe le corps en compartiments fictifs**, alimentés en parallèle par le sang. Chacun se charge et se décharge en azote à sa propre vitesse, mesurée par sa **période**.
- **À la remontée, on accepte que les tissus contiennent plus d’azote que l’air respiré**, mais jamais au-delà d’une limite : le **coefficient de sursaturation critique** (Sc) des tables MN90, la **M-value** des modèles d’ordinateurs. Quand un compartiment approche de sa limite, on s’arrête : c’est le palier.
- **Les facteurs de gradient (GF)** permettent de garder une marge sous la M-value. Pour la plongée à l’air, le MFT fixe GF bas = GF haut, entre 85 et 90 %, sans palier profond.
- **MN90, Bühlmann ZHL-16C et RGBM** sont trois jeux de paramètres pour ce même modèle.
- **Le modèle ne sait pas gérer une deuxième plongée** : on la corrige par la **majoration**.
- **Un modèle n’est qu’une aide.** Il ignore le froid, l’effort, la fatigue et les différences entre individus ; le respecter ne garantit pas l’absence d’accident.

Au capacitaire, le MFT attend des **réponses à des questions simples** sur les modèles, les jeux de paramètres, les M-values et les GF, et sur l’**incidence des GF sur les paliers**. Il précise aussi que « les connaissances des niveaux antérieurs sont considérées comme maîtrisées » : la dissolution de l’azote et les états de saturation, au programme du GP-N4, en font partie.

## 1. Comprendre

### D’abord, la dissolution de l’azote

**La loi de Henry.** À température constante, la quantité d’un gaz qui se dissout dans un liquide, une fois l’équilibre atteint, est proportionnelle à la pression partielle de ce gaz au-dessus du liquide. À 30 m, la pression absolue est de 4 bar : l’azote respiré y a une pression partielle quatre fois plus forte qu’en surface, et le corps peut en dissoudre quatre fois plus. Pour la pression partielle elle-même, voir [la loi de Dalton](/theorie/pressions-partielles/#dalton).

**Pression partielle et tension.** On parle de pression partielle pour un gaz dans un mélange gazeux, l’air respiré. On parle de **tension** pour la quantité de ce gaz dissoute dans un liquide ou un tissu. L’oxygène est consommé par les cellules ; l’azote, lui, est inerte : il se dissout et doit ressortir par les poumons.

**Les quatre états.** La comparaison entre la pression partielle de l’azote respiré et la tension dans un tissu donne quatre situations.

{{< schema "des-etats" >}}

Le but de tout modèle de décompression est de laisser les tissus en sursaturation pendant la remontée, puisque c’est elle qui fait sortir l’azote, sans jamais atteindre la sursaturation critique.

### Les principes de Haldane {#haldane-principes}

Au début du XXᵉ siècle, le physiologiste écossais John Scott Haldane est chargé par la Royal Navy de rendre la plongée des scaphandriers plus sûre. À partir d’expériences sur des chèvres, il propose le premier modèle de décompression, sur lequel reposent encore les tables MN90 et une grande partie des ordinateurs.

**Les hypothèses du modèle.**

- **Le corps est découpé en compartiments** : des groupes fictifs de tissus qui se comportent de la même manière vis-à-vis de l’azote. Ce ne sont pas des organes : un compartiment est une case mathématique.
- **Les compartiments sont en parallèle** : le sang, chargé en azote aux poumons, les alimente tous en même temps, et ils n’échangent pas entre eux.
- **Les échanges sont supposés instantanés** entre l’air des poumons et le sang, puis entre le sang et chaque compartiment. Ce qui limite la vitesse, c’est le débit de sang qui arrive au compartiment (on parle de modèle « par perfusion »).
- **La charge et la décharge suivent la même loi**, à la même vitesse.
- **Tout l’azote reste dissous** : le modèle ne connaît pas les bulles.

**La période.** Chaque compartiment a une période : le temps qu’il lui faut pour parcourir la moitié du chemin entre sa tension de départ et la tension d’équilibre. Après une période, il en est à 50 % ; après deux, il a fait la moitié de ce qui restait, soit 75 % ; puis 87,5 %, 93,75 %, environ 97 % et environ 98,4 %. On le considère saturé au bout de **six périodes**. Un compartiment de période courte est dit **rapide**, un compartiment de période longue est dit **lent**.

{{< schema "des-courbe-saturation" >}}

{{< schema "des-compartiments" >}}

**L’équation de la saturation**, sous la forme utilisée à l’examen :

> tension finale = tension initiale + (gradient × taux de saturation)

- le **gradient** est l’écart entre la tension d’équilibre (la pression partielle d’azote respirée au fond) et la tension initiale du compartiment ;
- le **taux de saturation** dépend du nombre de périodes écoulées : 50 % pour une période, 75 % pour deux, et ainsi de suite.

**La désaturation** suit la même loi : à chaque période, le compartiment se débarrasse de la moitié de l’excès qui lui reste. C’est pour cela qu’il faut des heures pour que les compartiments lents reviennent à l’équilibre.

**Ce que le modèle ne voit pas.** Le modèle est une simplification. Il ignore le débit cardiaque de chacun, le froid, l’effort, la fatigue, la déshydratation, les bulles déjà présentes, et les écarts entre deux personnes. C’est pourquoi on répète qu’un modèle n’est qu’une aide : il ne peut garantir l’absence d’accident, et le dépasser n’entraîne pas forcément un accident. Voir la fiche [La déshydratation](/theorie/deshydratation/#deshydratation-consequences) et la mindmap des [accidents de désaturation](/capacitaire/desaturation/#add-prevention).

[L’enseigner →](#enseigner-principes)

### Les conditions de remontée {#conditions-remontee}

**Le coefficient de sursaturation.** À la remontée, la pression ambiante baisse plus vite que la tension des compartiments. Le rapport entre la tension d’un compartiment et la pression absolue augmente : c’est le coefficient de sursaturation.

**Le Sc, la limite des tables.** Le modèle fixe pour chaque compartiment un rapport à ne pas dépasser, le **coefficient de sursaturation critique** (Sc). Les compartiments rapides tolèrent un rapport plus élevé que les lents. Pour savoir jusqu’où un compartiment peut remonter, on divise sa tension par son Sc : on obtient la **pression absolue minimale** qu’il accepte. Si elle dépasse 1 bar, il ne peut pas sortir : il impose un palier, placé au multiple de 3 m immédiatement plus profond (3 m, 6 m, 9 m…). Le compartiment qui impose le palier le plus profond est le **compartiment directeur**.

**Les M-values, la limite des ordinateurs.** Robert Workman, puis Albert Bühlmann, ont remplacé le rapport fixe par une **M-value** : la tension maximale tolérée par un compartiment, qui change avec la profondeur. On la représente par une droite. Deux façons de la lire, toutes deux justes :

- **en tension**, la tolérance augmente avec la profondeur : un compartiment peut contenir plus d’azote à 20 m qu’en surface ;
- **en rapport** tension ÷ pression ambiante, elle diminue avec la profondeur : le rapport toléré est plus faible au fond qu’en surface.

**Les facteurs de gradient.** Les GF expriment la part de la sursaturation tolérée qu’on accepte d’utiliser : 0 % correspond à la pression ambiante, 100 % à la M-value. On en règle deux :

- le **GF bas** s’applique au premier palier : plus il est faible, plus l’ordinateur arrête la remontée tôt, donc profond ;
- le **GF haut** s’applique à l’arrivée en surface : plus il est faible, plus les derniers paliers, près de la surface, s’allongent.

{{< schema "des-diagramme-mvalue" >}}

{{< schema "des-gf-paliers" >}}

**Ce que dit le MFT.** Pour la plongée à l’air, le MFT du N2 et celui du GP-N4 fixent les limites : **GF bas = GF haut, entre 85 et 90 %**, et **pas de paliers profonds à l’air**. Un GF bas très faible fait commencer les paliers profond ; à l’air, les compartiments lents continuent alors à se charger pendant ces arrêts. Le GP-N4 doit aussi connaître le réglage des ordinateurs de sa palanquée avant la plongée.

[L’enseigner →](#enseigner-conditions)

### Les tables MN90 {#mn90}

**L’origine.** Les tables MN90 ont été établies par la Marine nationale en 1990, puis actualisées. Leur mode d’emploi rappelle qu’elles ont été conçues pour la plongée autonome des missions de la Marine, avec un effort physique modéré, et déconseille leur usage hors de ce domaine. La FFESSM impose leur utilisation dans les épreuves théoriques des examens.

**Les paramètres du modèle.** Les MN90 utilisent 12 compartiments, de période 5 à 120 minutes, chacun avec son Sc.

| Compartiment (période) | Sc |
|---|---|
| 5 min | 2,72 |
| 7 min | 2,54 ou 2,57 selon les sources |
| 10 min | 2,38 |
| 15 min | 2,20 |
| 20 min | 2,04 |
| 30 min | 1,82 |
| 40 min | 1,68 |
| 50 min | 1,61 |
| 60 min | 1,58 |
| 80 min | 1,56 |
| 100 min | 1,55 |
| 120 min | 1,54 |

**Les règles du mode d’emploi**, à connaître par cœur pour l’examen :

- remontée **de 15 à 17 m/min** du fond au premier palier, puis **6 m/min** entre les paliers et du dernier palier à la surface (30 secondes d’un palier à l’autre). Pour les calculs d’examen, la convention est de 15 m/min jusqu’au premier palier ;
- on compte la durée de la plongée du moment où l’on quitte la surface jusqu’au début de la remontée, en minutes entières (une minute commencée compte pour une minute) ;
- la profondeur est la **profondeur maximale** atteinte ;
- si la durée ou la profondeur n’est pas dans la table, on prend la **valeur immédiatement supérieure** ; l’interpolation est interdite ;
- pas plus de deux plongées en 24 heures ; la plongée au-delà de 60 m est interdite (les tables de 62 et 65 m sont des tables de secours).

**La table est calculée pour un profil carré** : elle suppose que tu as passé toute la durée à la profondeur maximale. C’est prudent pour une plongée en profil descendant, mais cela ne tient pas compte d’un profil en dents de scie.

**Les types de plongées.**

- **Consécutive** : intervalle strictement inférieur à 15 minutes. Les deux immersions n’en font qu’une pour la table : on additionne les durées et on retient la profondeur maximale des deux.
- **Successive** : intervalle de 15 minutes à 12 heures. On applique la majoration (voir plus bas).
- **Isolée** : au moins 12 heures après la précédente.

**Le GPS.** À la fin de chaque plongée, la table donne un **groupe de plongée successive**, une lettre de A à P. Il traduit la charge du compartiment de 120 minutes, le plus lent : c’est lui qui sert à suivre l’azote résiduel en surface. Le tableau I couvre 12 heures, soit six périodes de ce compartiment.

[L’enseigner →](#enseigner-mn90)

### Bühlmann ZHL-16C {#buhlmann}

Le médecin suisse Albert Bühlmann a construit à Zurich un modèle haldanien à **16 compartiments**, de quelques minutes à environ 635 minutes. Son nom résume ses caractéristiques : ZH pour Zurich, L pour limites, 16 pour le nombre de compartiments, C pour la variante adaptée au calcul en continu par les ordinateurs.

- Chaque compartiment a deux coefficients, **a et b**, qui définissent sa M-value : la tension tolérée vaut a + (pression ambiante ÷ b).
- Le modèle tient compte de l’**air alvéolaire**, appauvri en azote par la vapeur d’eau et le CO2, plutôt que de l’air respiré.
- Il est très souvent associé aux **facteurs de gradient**, qui permettent de régler le conservatisme.

Le MFT du GP-N4 cite le ZHL-16C comme exemple de jeu de paramètres haldaniens dans les ordinateurs, et rappelle que **les logiciels des ordinateurs de plongée ne sont pas certifiés**.

L’ordinateur applique le modèle **en temps réel**, à partir de ton profil réel, alors que la table raisonne sur un profil carré. C’est son avantage, et aussi la raison pour laquelle il ne se prête pas, ne s’échange pas et ne s’éteint pas entre deux plongées : il garde en mémoire la charge de chaque compartiment.

[L’enseigner →](#enseigner-buhlmann)

### Le RGBM {#rgbm}

Le **Reduced Gradient Bubble Model**, développé par Bruce Wienke, part du même socle de compartiments, mais **réduit les gradients admis** pour tenir compte de la formation de bulles. Concrètement, il pénalise les profils à risque : remontées en yoyo, remontées rapides, plongées successives rapprochées, intervalles courts, plongées répétées sur plusieurs jours. Il équipe plusieurs marques d’ordinateurs.

Le MFT du MF1 le range parmi les jeux de paramètres haldaniens, avec la MN90 et Bühlmann. D’autres supports le présentent plutôt comme un modèle « à bulles » : retiens qu’il garde les compartiments de Haldane et qu’il y ajoute des pénalités liées aux bulles. Pour les bulles elles-mêmes, voir la branche [Bulles](/capacitaire/desaturation/#micronoyaux) de la mindmap.

[L’enseigner →](#enseigner-rgbm)

### Successives et majoration {#successives}

**Pourquoi le modèle ne sait pas gérer une deuxième plongée.** Les tables sont calculées pour un plongeur qui part de la surface avec des compartiments à l’équilibre. Après une plongée, même parfaitement décompressée, il reste de l’**azote résiduel**, qui s’élimine en quelques heures. Une deuxième plongée part donc d’une charge plus élevée : si on lisait la table comme pour une plongée isolée, les paliers seraient trop courts.

**Le principe de la majoration.** On transforme l’azote résiduel en temps fictif : la **majoration** est, selon le mode d’emploi des tables, le « temps qu’il faudrait passer à la profondeur de la 2e plongée pour avoir la même quantité d’azote dissous ». On l’ajoute à la durée réelle de la deuxième plongée.

**La démarche aux tables MN90.**

{{< schema "des-successive" >}}

1. La table de la première plongée donne le **GPS**.
2. Avec le GPS et l’intervalle en surface, le **tableau I** donne l’**azote résiduel**. Si l’intervalle n’y figure pas, on prend la valeur immédiatement inférieure.
3. Avec l’azote résiduel et la profondeur prévue de la deuxième plongée, le **tableau II** donne la **majoration**. Si la valeur d’azote ou la profondeur n’y figure pas, on prend la valeur immédiatement supérieure.
4. On entre dans la table avec la **durée fictive** (durée réelle + majoration) et la profondeur de la deuxième plongée.

Si la deuxième plongée finit plus profond que prévu, on garde la majoration déjà calculée et on lit la table à la profondeur réellement atteinte. Si elle reste moins profonde, on garde la majoration et la profondeur prévue.

**La plongée consécutive**, elle, ne passe pas par la majoration : une plongée de 25 minutes à 40 m, suivie moins de 15 minutes plus tard d’une plongée de 15 minutes à 10 m, se calcule comme une plongée de 40 minutes à 40 m. La table donne alors 13 minutes à 6 m et 40 minutes à 3 m.

Les procédures de rattrapage (remontée rapide, palier interrompu) et les préconisations fédérales sont traitées dans la branche [Bulles](/capacitaire/desaturation/#rattrapage) de la mindmap.

[L’enseigner →](#enseigner-successives)

## 2. Les calculs types

Dans ces exemples, la pression partielle d’azote en surface est prise à 0,8 bar, comme dans les supports de formation, sauf au premier exemple, qui compare avec 0,79.

### Exemple 1 : la tension d’un compartiment

*Calcule la tension d’azote du compartiment de 20 minutes après 40 minutes à 30 m.*

{{< pistes >}}
- **Le nombre de périodes** : 40 ÷ 20 = **2 périodes**, soit un taux de saturation de **75 %**.
- **Avec 0,8** : pression partielle au fond = 4 × 0,8 = 3,2 bar ; gradient = 3,2 − 0,8 = 2,4 bar ; tension = 0,8 + 2,4 × 0,75 = **2,6 bar**.
- **Avec 0,79** : pression partielle au fond = 4 × 0,79 = 3,16 bar ; gradient = 3,16 − 0,79 = 2,37 bar ; tension = 0,79 + 2,37 × 0,75 ≈ **2,57 bar**.
- **Ce que ça montre** : la méthode compte plus que la valeur retenue pour l’azote. Indique toujours celle que tu utilises.
{{< /pistes >}}

### Exemple 2 : la profondeur du palier

*Après 40 minutes à 30 m, le compartiment de 10 minutes (Sc 2,38) impose-t-il un palier ?*

{{< pistes >}}
- **Le nombre de périodes** : 40 ÷ 10 = 4 périodes, soit 93,75 %.
- **La tension** : 0,8 + 2,4 × 0,9375 = **3,05 bar**.
- **La pression minimale acceptée** : 3,05 ÷ 2,38 ≈ **1,28 bar**, soit environ 2,8 m. Ce compartiment ne peut pas sortir directement : il impose un **palier à 3 m**.
- **La table MN90** pour 40 minutes à 30 m donne bien un seul palier, à 3 m (24 minutes).
{{< /pistes >}}

### Exemple 3 : le compartiment directeur

*Après 20 minutes à 50 m, compare les compartiments de 5, 10 et 20 minutes (Sc 2,72, 2,38 et 2,04).*

{{< pistes >}}
- **Au fond** : pression absolue 6 bar, pression partielle d’azote 4,8 bar, gradient 4 bar.
- **5 min** (4 périodes, 93,75 %) : tension 0,8 + 4 × 0,9375 = 4,55 bar ; 4,55 ÷ 2,72 ≈ 1,67 bar, soit 6,7 m : **palier à 9 m**.
- **10 min** (2 périodes, 75 %) : tension 3,8 bar ; 3,8 ÷ 2,38 ≈ 1,60 bar, soit environ 6 m : **palier à 6 m**.
- **20 min** (1 période, 50 %) : tension 2,8 bar ; 2,8 ÷ 2,04 ≈ 1,37 bar, soit 3,7 m : **palier à 6 m**.
- **Ce que ça montre** : ici, c’est le compartiment le plus rapide qui dirige. Mais attention : la table MN90 pour 20 minutes à 50 m ne donne **pas** de palier à 9 m (4 minutes à 6 m, 22 minutes à 3 m). Ce calcul d’école ne tient compte ni de la décharge des compartiments rapides pendant la remontée, ni de tous les compartiments : il sert à comprendre le principe, jamais à remplacer la table.
{{< /pistes >}}

### Exemple 4 : l’effet d’un facteur de gradient

*Exemple d’école, aux valeurs fictives : en surface (1 bar), la M-value d’un compartiment est de 1,6 bar. Quelle tension l’ordinateur accepte-t-il pour sortir avec un GF haut de 85 %, puis de 70 % ?*

{{< pistes >}}
- **La sursaturation tolérée** : 1,6 − 1 = 0,6 bar au-dessus de la pression ambiante.
- **GF 85 %** : 1 + 0,85 × 0,6 = **1,51 bar**.
- **GF 70 %** : 1 + 0,70 × 0,6 = **1,42 bar**.
- **Ce que ça montre** : un GF plus bas impose au compartiment de descendre plus bas avant de sortir. Il lui faut donc plus de temps au dernier palier : le GF agit d’abord sur la durée des paliers.
{{< /pistes >}}

### Exemple 5 : une plongée successive aux tables MN90

*Une palanquée plonge à 9 h, 25 minutes à 40 m. Elle replonge à 16 h 30, à 35 m, pendant 35 minutes. Calcule la décompression des deux plongées.*

{{< pistes >}}
- **1re plongée** (40 m, 25 min) : 2 minutes à 6 m, 19 minutes à 3 m, durée totale de remontée 25 minutes, **GPS J**. Sortie à 9 h 50.
- **Intervalle** : de 9 h 50 à 16 h 30, soit 6 h 40. Tableau I, ligne J, valeur immédiatement inférieure (6 h 30) : azote résiduel **0,85**.
- **Majoration** : tableau II, valeur immédiatement supérieure 0,86, colonne 35 m : **4 minutes**.
- **2e plongée** : durée fictive 35 + 4 = 39 minutes, on lit **40 minutes** à 35 m : 5 minutes à 6 m, 34 minutes à 3 m, durée totale de remontée 42 minutes, GPS L.
- **À retenir** : sans majoration, on aurait lu 35 minutes à 35 m, soit 2 minutes à 6 m et 27 minutes à 3 m. Dix minutes de paliers en moins.
{{< /pistes >}}

## 3. L’enseigner

Ce que le MFT demande à chaque niveau :

- **au N1** : la courbe de plongée sans palier et une lecture simple de l’ordinateur et de la table fédérale, qui « sert de support pédagogique » (durée, profondeur, palier, vitesse de remontée) ;
- **au N2** : une information sur la modélisation de la désaturation ; l’usage complet de son ordinateur, les critères de conservatisme, les limites de GF à l’air ; la table fédérale et ses principes ; la gestion de moyens de désaturation différents dans une palanquée ;
- **au N3** : les principes des modèles qu’utilisent les différents moyens de désaturation, et l’incidence des GF sur les paliers ;
- **au GP-N4** : la dissolution de l’azote et les états de saturation, les ordinateurs (paramétrage, GF, ZHL-16C), la gestion d’une palanquée aux moyens de désaturation différents.

### Les principes, au N3 et au GP-N4 {#enseigner-principes}

- **L’image du quotidien** : des baignoires identiques remplies par des robinets de débits différents. À chaque période, chaque baignoire se remplit de la moitié de ce qui lui manque : vite au début, de plus en plus lentement en approchant du bord.
- **En clair** : « Ton corps, c’est plusieurs réservoirs à azote qui se remplissent à des vitesses différentes. Les rapides se remplissent et se vident vite, les lents mettent des heures. »
- **Le geste** : respecter la vitesse de remontée et les paliers, même après une plongée courte, et finir par un palier de sécurité.
- **Au tableau** :

{{< schema "des-tableau-baignoires" >}}

- **Les idées fausses** :
  - « Les compartiments, ce sont des organes » : ce sont des cases mathématiques.
  - « Une fois en surface, l’azote est parti » : les compartiments lents mettent des heures à se vider.
  - « Si je respecte ma table, je ne peux pas avoir d’accident » : le modèle ne connaît ni ton état du jour, ni le froid, ni l’effort.

### Les conditions de remontée, au N3 et au GP-N4 {#enseigner-conditions}

- **L’image du quotidien** : la bouteille de soda. Fermée, le gaz est dissous. Ouverte doucement, il sort en petites bulles. Ouverte d’un coup, la mousse déborde. Pour les GF, la limitation de vitesse : la M-value est la limite, le GF est la vitesse à laquelle tu choisis de rouler en dessous.
- **En clair** : « En remontant, tu laisses sortir l’azote. Doucement, il part par les poumons ; trop vite, il fait des bulles. Les paliers, c’est ouvrir la bouteille doucement. »
- **Le geste** : vérifier avant la plongée le réglage des ordinateurs de la palanquée, et à l’air, s’en tenir au MFT : GF bas = GF haut, entre 85 et 90 %, sans palier profond.
- **Au tableau** :

{{< schema "des-tableau-soda" >}}

{{< schema "des-tableau-vitesse" >}}

- **Les idées fausses** :
  - « Un GF bas très faible, c’est plus sûr » : à l’air, il fait commencer les paliers trop profond, pendant que les compartiments lents continuent à se charger. Le MFT l’exclut.
  - « Le GF ne change que la profondeur des paliers » : le GF haut agit surtout sur leur durée.
  - « La M-value, c’est la limite au-delà de laquelle on fait un accident » : c’est une limite de calcul, pas une frontière biologique.

### Les tables MN90, du N1 au GP-N4 {#enseigner-mn90}

- **L’image du quotidien** : le livre de recettes. Les temps y ont été calculés d’avance pour une cuisson à température fixe ; la table, de même, est calculée pour un profil carré.
- **En clair** : « La table, c’est comme si tu avais passé toute ta plongée à ta profondeur maximale. Elle est prudente, mais elle ne connaît pas ta vraie plongée. »
- **Les gestes, selon le niveau** :
  - **au N1** : lire une ligne de la table, dans la courbe sans palier ;
  - **au N2 et au N3** : appliquer les règles de lecture (profondeur maximale, valeur supérieure, pas d’interpolation), calculer une durée totale de remontée ;
  - **au GP-N4** : traiter une plongée successive et une consécutive.
- **Au tableau** :

{{< schema "des-tableau-recette" >}}

- **Les idées fausses** :
  - « Je prends la profondeur moyenne de ma plongée » : c’est toujours la profondeur maximale.
  - « 38 minutes, c’est presque 35 » : on prend la valeur immédiatement supérieure, 40 minutes.
  - « La table et mon ordinateur doivent donner la même chose » : ils n’utilisent ni le même modèle ni le même profil.

### Bühlmann et les ordinateurs, du N2 au GP-N4 {#enseigner-buhlmann}

- **L’image du quotidien** : le GPS de la voiture, qui recalcule l’itinéraire à chaque virage, là où la table est une carte routière imprimée.
- **En clair** : « Ton ordinateur refait le calcul toutes les secondes avec ta vraie profondeur. C’est pour ça qu’il ne se prête pas et ne s’éteint pas entre deux plongées : il se souvient de ce que tu as dans le corps. »
- **Le geste** : un ordinateur par plongeur, le même pour toute la journée ; connaître ses réglages ; dans une palanquée, suivre l’ordinateur le plus pénalisant.
- **Au tableau** : on reprend le schéma du livre de recettes et du GPS.
- **Les idées fausses** :
  - « L’ordinateur est certifié, il ne peut pas se tromper » : le MFT rappelle que les logiciels ne sont pas certifiés.
  - « Je peux prêter mon ordinateur à un ami pour sa deuxième plongée » : il afficherait ta charge en azote, pas la sienne.

### Le RGBM, au GP-N4 {#enseigner-rgbm}

- **L’image du quotidien** : le GPS qui, en plus, rallonge le trajet quand tu prends des routes dangereuses.
- **En clair** : « Certains ordinateurs te pénalisent si tu fais le yoyo, si tu remontes trop vite ou si tu enchaînes les plongées : ils allongent les paliers ou raccourcissent la plongée suivante. »
- **Le geste** : éviter le yoyo et les remontées rapides ; dans une palanquée mixte, anticiper qu’un ordinateur RGBM demandera souvent plus de paliers.
- **Au tableau** : on reprend le GPS, avec des routes barrées « yoyo » et « remontée rapide ».
- **Les idées fausses** :
  - « Mon ordinateur RGBM est moins bon, il me donne plus de paliers » : il est plus prudent sur les profils à risque, ce n’est pas un défaut.

### Successives et majoration, du N2 au GP-N4 {#enseigner-successives}

- **L’image du quotidien** : le sac à dos qu’on n’a pas vidé avant la deuxième randonnée. On repart avec ce qui reste, plus la nouvelle charge.
- **En clair** : « Après ta première plongée, il te reste de l’azote. Pour la deuxième, la table fait comme si tu étais déjà resté quelques minutes au fond. »
- **Le geste** : noter son GPS et l’heure de sortie ; respecter l’intervalle ; garder le même ordinateur ; ne pas faire la deuxième plongée plus profonde que la première.
- **Au tableau** :

{{< schema "des-tableau-sac" >}}

- **Les idées fausses** :
  - « Deux plongées de 20 minutes, c’est comme une de 40 minutes » : seulement si l’intervalle est inférieur à 15 minutes ; sinon, c’est une successive.
  - « Après trois heures, je suis comme neuf » : le tableau I montre qu’il faut jusqu’à 12 heures.

## 4. À l’examen

### Côté capacitaire

L’écrit 4, « Désaturation », dure 45 minutes au plus, avec un coefficient 3. Sur cette partie, le MFT attend des **réponses à des questions simples** sur les modèles, les jeux de paramètres, les M-values et les facteurs de gradient, et sur l’**incidence des GF sur les paliers**. Les questions types :

- citer les hypothèses du modèle de Haldane et définir la période ;
- calculer une tension, un nombre de périodes, une profondeur de palier ;
- définir le Sc, la M-value et les GF, et expliquer l’effet du GF bas et du GF haut ;
- comparer MN90, ZHL-16C et RGBM ;
- expliquer pourquoi on majore une plongée successive, et dérouler la démarche ;
- dire ce qu’un modèle ne prend pas en compte.

Pour réviser les notions une à une, voir la [mindmap « Désaturation »](/capacitaire/desaturation/#haldane-principes).

### Côté pédagogie théorique

Le sujet se prête à un cours pour des N3 ou des GP-N4. Par exemple : « Pourquoi faisons-nous des paliers ? » ou « Comment fonctionne ton ordinateur ? ». Ce sont des formulations possibles, pas des sujets officiels.

Ce que le jury regarde :

- **un modèle expliqué simplement** : des réservoirs qui se remplissent à des vitesses différentes, une limite à ne pas dépasser ;
- **le lien avec la pratique** : vitesse de remontée, paliers, réglages de l’ordinateur, plongées successives ;
- **les limites du modèle** : une aide, pas une garantie.

La méthode complète est dans la [trame de la pédagogie théorique](/ressources/trame-pedagogie-theorique/).

## Les pièges classiques

- **Confondre pression partielle et tension.**
- **Croire qu’un compartiment est un organe.**
- **Oublier que la désaturation suit la même loi que la saturation**, et qu’elle prend des heures pour les compartiments lents.
- **Arrondir une profondeur de palier vers la surface** : 2,8 m donne un palier à 3 m, et 6,7 m un palier à 9 m, jamais à 6 m.
- **Proposer un GF bas faible à l’air** : le MFT fixe GF bas = GF haut, entre 85 et 90 %, sans palier profond.
- **Interpoler dans les tables MN90**, ou prendre la valeur inférieure pour la durée ou la profondeur.
- **Se tromper de sens d’arrondi** dans les tableaux I et II : l’intervalle à la valeur inférieure, l’azote résiduel et la profondeur à la valeur supérieure.
- **Confondre plongée consécutive et successive.**
- **Présenter le modèle comme une garantie.**

## Sources

**Le MFT de la FFESSM**, qui fait foi : MF1 (juillet 2026, module capacitaire, désaturation), GP-N4 (mai 2026, épreuve de désaturation), Plongeur Niveau 1 (décembre 2025), Niveau 2 (mai 2026) et Niveau 3 (décembre 2025).

**Les tables de plongée FFESSM** établies à partir des tables MN90, et leur mode d’emploi (règles de lecture, tableaux I à IV, plongées consécutives et successives).

**Le site** : les mini-fiches de la [mindmap Désaturation](/capacitaire/desaturation/#haldane-principes), les fiches [Pressions partielles](/theorie/pressions-partielles/) et [La déshydratation](/theorie/deshydratation/).

**Les références consultées**, pour vérifier les notions :

- DAN Europe, [« Gradient factor calculations »](https://alertdiver.eu/en_US/articles/gradient-factor-calculations/), sur l’origine et le principe des facteurs de gradient ;
- [l’algorithme de Bühlmann](https://en.wikipedia.org/wiki/B%C3%BChlmann_decompression_algorithm), pour la structure du ZHL-16C, recoupée avec les supports de formation.

**Les supports de formation consultés comme repères**, sans reprise de texte ni d’image : un cours GP-N4 sur la saturation et la désaturation (2023), un cours de formation théorique Niveau 4 sur les éléments de calcul de tables et un autre sur les procédures de décompression particulières (2013).

**Les illustrations** : tous les schémas de cette fiche (états, courbes, diagrammes et schémas au tableau) sont dessinés pour le site.

{{< sujets-examen >}}

{{< encart "orange" >}}
**Cette fiche est une aide, pas une réponse type.** Les calculs d’école simplifient le modèle et ne remplacent jamais la table ou l’ordinateur. Pour la lecture des tables, suis leur mode d’emploi officiel ; pour les réglages des ordinateurs, le MFT en vigueur. Pour l’examen, suis le MFT et les consignes de ta CTR.
{{< /encart >}}
