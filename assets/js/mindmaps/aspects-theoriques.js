/* Données de la mindmap « aspects-theoriques » (page /capacitaire/aspects-theoriques/), reprises du fichier d’origine mindmaps-mf1/aspects-theoriques.html (version du 24/11/2026).
   Seule la typographie a été adaptée (apostrophes, espaces insécables). Champ facultatif « fiche » : bouton « Voir la fiche didactique »
   vers la collection Théorie (branches Flottabilité et Compressibilité des gaz). */
const PAGE={
title:"Aspects théoriques de l’activité",
root:"Théorie de l’activité",
sub:"Écrit 2 du module capacitaire MF1 : physique appliquée à la plongée et organisation du directeur de plongée. Chaque fiche donne la formule, un exemple chiffré simple et les conséquences pratiques.",
meta:["Écrit 2","Coefficient 2","45 minutes","6 rubriques"],
search:"Rechercher : Archimède, Charles, réfraction…",
start:"archimede",
cats:[
{id:"flottabilite",name:"Flottabilité",law:"Principe d’Archimède",items:[
{id:"archimede",fiche:"/theorie/flottabilite/#archimede",name:"Poussée d’Archimède",alt:"Tout corps plongé dans un liquide…",tags:["Volume × masse volumique"],s:{
"Énoncé":["Tout corps plongé dans un liquide reçoit une poussée verticale, dirigée vers le haut, égale au poids du volume de liquide déplacé."],
"En pratique":["Poussée (kg) ≈ volume immergé (L) × masse volumique du liquide (kg/L).","Eau douce : 1 kg/L. Eau de mer : environ 1,025 à 1,03 kg/L.","Un même objet est donc mieux porté en mer qu’en lac."]}},
{id:"poids-apparent",fiche:"/theorie/flottabilite/#poids-apparent",name:"Poids réel et apparent",alt:"Ce qu’on « sent » sous l’eau",tags:["Papp = Préel − PA"],s:{
"Formule":["Poids apparent = poids réel − poussée d’Archimède."],
"Trois cas":["Papp > 0 : flottabilité négative, l’objet coule.","Papp < 0 : flottabilité positive, il remonte.","Papp = 0 : flottabilité neutre, c’est l’équilibre recherché."],
"Exemple":["Une ancre de 30 kg de 4 L en mer : 30 − 4 × 1,03 ≈ 25,9 kg apparents."]}},
{id:"masse-volumique",fiche:"/theorie/flottabilite/#masse-volumique",name:"Masse volumique et densité",alt:"Deux notions voisines",tags:["kg/L","Sans unité"],s:{
"Définitions":["Masse volumique : masse par unité de volume (kg/L ou kg/m³).","Densité : rapport entre la masse volumique d’un corps et celle de l’eau, sans unité.","Un corps de densité supérieure à celle du liquide coule, inférieure il flotte."]}},
{id:"lestage",fiche:"/theorie/flottabilite/#lestage",name:"Lestage",alt:"Ce qui fait varier la flottabilité",tags:["Mer vs douce","Bloc qui s’allège"],s:{
"Ce qui change en plongée":["La combinaison s’écrase en profondeur : on perd de la flottabilité en descendant.","Le bloc s’allège en se vidant : 12 L à 200 bar contiennent 2 400 L d’air, soit environ 3 kg.","Passer de l’eau douce à la mer demande plus de lest."],
"Bon lestage":["Pouvoir tenir un palier à 3 m avec un bloc presque vide, gilet vide.","Un surlestage oblige à gonfler le gilet, augmente l’effort et l’essoufflement."]}},
{id:"relevage",fiche:"/theorie/flottabilite/#relevage",name:"Problèmes pratiques",alt:"Relevage, parachute",tags:["Exemple chiffré"],s:{
"Méthode":["Calculer le poids apparent de l’objet, puis le volume d’air à injecter pour l’annuler.","Penser à Mariotte : le volume du parachute augmente à la remontée, il faut purger."],
"Exemple":["Moteur de 50 kg, 20 L, en mer : Papp = 50 − 20 × 1,03 = 29,4 kg.","Il faut donc environ 29,4 L d’air dans le parachute, quelle que soit la profondeur ; à 30 m cela représente 29,4 × 4 ≈ 118 L pris dans le bloc."]},
tip:"Les sujets restent simples : un calcul de poids apparent, un volume de parachute, un ajustement de lest."}]},
{id:"compressibilite",name:"Compressibilité des gaz",law:"Mariotte, Charles",items:[
{id:"mariotte",fiche:"/theorie/compressibilite/#mariotte",name:"Loi de Mariotte",alt:"P × V = constante",tags:["Température constante"],s:{
"Énoncé":["À température constante, le volume d’un gaz est inversement proportionnel à la pression : P1 × V1 = P2 × V2."],
"Pression absolue":["Pabs = Patm + Phydro, soit environ 1 bar + 1 bar par 10 m.","10 m : 2 bar ; 20 m : 3 bar ; 30 m : 4 bar ; 40 m : 5 bar."],
"Conséquence":["Les plus fortes variations relatives de volume ont lieu entre 0 et 10 m : le volume double."]}},
{id:"consommation",fiche:"/theorie/compressibilite/#consommation",name:"Consommation et autonomie",alt:"Surface et immersion",tags:["Conso × Pabs"],s:{
"Formules":["Consommation à la profondeur = consommation en surface × Pabs.","Air disponible = volume du bloc × (pression de départ − réserve).","Autonomie = air disponible ÷ consommation à la profondeur."],
"Exemple":["Bloc 12 L à 200 bar, réserve 50 bar : 12 × 150 = 1 800 L.","20 L/min en surface, à 30 m : 20 × 4 = 80 L/min.","Autonomie au fond : 1 800 ÷ 80 ≈ 22 min (sans compter la remontée)."]}},
{id:"densite-gaz",fiche:"/theorie/compressibilite/#densite-gaz",name:"Densité du gaz respiré",alt:"Effet de la profondeur",tags:["Essoufflement"],s:{
"Principe":["La masse volumique de l’air augmente avec la pression : à 40 m, l’air est 5 fois plus dense qu’en surface."],
"Conséquences":["Écoulement plus difficile dans les voies aériennes et le détendeur : travail ventilatoire accru.","Facteur favorisant de l’essoufflement et de la rétention de CO2."]}},
{id:"temperature-bloc",fiche:"/theorie/compressibilite/#temperature-bloc",name:"Température et pression",alt:"Loi de Charles",tags:["T en kelvins"],s:{
"Énoncé":["À volume constant, la pression d’un gaz est proportionnelle à sa température absolue : P1/T1 = P2/T2, T en kelvins (T = t °C + 273)."],
"Exemple":["Bloc gonflé à 230 bar à 50 °C, refroidi à 15 °C : 230 × 288 ÷ 323 ≈ 205 bar.","Inversement, un bloc laissé au soleil voit sa pression monter."]},
tip:"Oublier de passer en kelvins est l’erreur la plus fréquente."}]},
{id:"pp",name:"Pressions partielles",law:"Loi de Dalton",items:[
{id:"dalton",name:"Loi de Dalton",alt:"Pp = Pabs × fraction",tags:["Air : 21 % O2, 79 % N2"],s:{
"Énoncé":["La pression d’un mélange est la somme des pressions partielles de ses gaz ; chaque Pp = Pabs × fraction du gaz."],
"Exemple":["À 30 m à l’air : PpO2 = 4 × 0,21 = 0,84 bar ; PpN2 = 4 × 0,79 = 3,16 bar."]}},
{id:"limites-toxicite",name:"Seuils de toxicité",alt:"O2 et N2 selon la profondeur",tags:["PpO2 1,6","PpN2 ≈ 3,2"],s:{
"Oxygène":["Hypoxie sous environ 0,16 à 0,17 bar.","Hyperoxie neurologique au-delà de 1,6 bar : atteint vers 66 m à l’air."],
"Azote":["Narcose sensible vers 3,2 bar de PpN2, soit environ 30 m à l’air, puis croissante.","La limite réglementaire de 60 m à l’air correspond à une PpN2 d’environ 5,5 bar."]},
tip:"Le programme écarte les mélanges autres que l’air : les calculs portent sur l’air seul."},
{id:"gonflage",name:"Gonflage et qualité de l’air",alt:"Polluants sous pression",tags:["CO, huile, eau"],s:{
"Principe":["Un polluant agit selon sa pression partielle : sa toxicité est multipliée par la Pabs.","Exemple : une concentration de CO tolérable en surface devient 5 fois plus agressive à 40 m."],
"Prévention":["Prise d’air du compresseur à l’abri des gaz d’échappement.","Filtres et purges entretenus, contrôle régulier de la qualité de l’air (norme EN 12021)."]}}]},
{id:"optique",name:"Optique",law:"Lumière sous l’eau",items:[
{id:"absorption",name:"Absorption des couleurs",alt:"Le rouge part en premier",tags:["Profondeur et distance"],s:{
"Ordre de disparition":["Rouge dès les premiers mètres (vers 5 m), puis orange, puis jaune vers 20 à 30 m.","Il reste surtout du bleu et du vert en profondeur."],
"Conséquences":["Le sang paraît vert ou noir en profondeur.","Une lampe restitue les couleurs à courte distance.","L’eau absorbe aussi sur la distance horizontale."]}},
{id:"refraction",name:"Réfraction",alt:"Le masque déforme",tags:["Plus gros, plus proche"],s:{
"Principe":["La lumière change de direction en passant de l’eau (indice 1,33) à l’air du masque (indice 1)."],
"Conséquences":["Les objets paraissent environ un tiers plus gros et un quart plus proches.","Erreurs d’estimation des distances, surtout chez les débutants."]}},
{id:"reflexion",name:"Réflexion et diffusion",alt:"Jour et nuit",tags:["Effet miroir"],s:{
"De jour":["Vue d’en dessous, la surface agit comme un miroir au-delà d’un certain angle (réflexion totale) : on ne voit le ciel que dans une fenêtre au-dessus de soi.","Les particules diffusent la lumière : eau trouble, contraste réduit."],
"De nuit":["Le faisceau du phare se réfléchit sur les particules : tenir la lampe écartée des yeux.","Signes lumineux codifiés, lampe de secours, repère lumineux sur le bateau."]}},
{id:"champ-visuel",name:"Champ visuel",alt:"Rétréci par le masque",tags:["Vigilance palanquée"],s:{
"Conséquences":["Le masque et la réfraction réduisent le champ de vision, surtout latéral et vers le bas.","Le guide doit tourner la tête pour surveiller sa palanquée ; positionner les élèves dans son champ."]},
tip:"Pas de calcul ni de trigonométrie en optique : on attend des explications et leurs conséquences pratiques."}]},
{id:"acoustique",name:"Acoustique",law:"Son dans l’eau",items:[
{id:"vitesse-son",name:"Vitesse du son",alt:"Environ 4,5 fois plus rapide",tags:["340 m/s","1 500 m/s"],s:{
"Chiffres":["Dans l’air : environ 340 m/s. Dans l’eau : environ 1 500 m/s."],
"Exemple de calcul":["Un bateau à 300 m : le son arrive en 0,2 s sous l’eau, contre près de 0,9 s dans l’air."]}},
{id:"localisation",name:"Conséquences en plongée",alt:"On entend sans localiser",tags:["Danger bateau"],s:{
"Pourquoi":["L’oreille localise grâce au décalage d’arrivée entre les deux oreilles ; sous l’eau ce décalage devient trop faible.","Sous l’eau, le son passe surtout par conduction osseuse."],
"Conséquences":["Un moteur de bateau semble venir de partout : remonter le long du mouillage, parachute, tour d’horizon.","Les signaux sonores (tapoter le bloc, avertisseur) servent à attirer l’attention, pas à guider vers une direction."]}}]},
{id:"dp",name:"Directeur de plongée",law:"Organisation, études de cas",items:[
{id:"organisation-dp",name:"Organisation théorique",alt:"Avant, pendant, après",tags:["Fiche de sécurité"],s:{
"Avant":["Site, météo, marée, courant, visibilité ; règles locales.","Vérifier aptitudes, CACI, matériel ; constituer les palanquées ; fixer profondeur et durée.","Fiche de sécurité, plan de secours, matériel de secours, briefing."],
"Pendant":["Surveillance de surface, heures de mise à l’eau et de sortie, sécurité surface.","Gestion des imprévus et décision d’alerte."],
"Après":["Contrôle des sorties et des paramètres, observation des plongeurs.","Débriefing, archivage de la fiche de sécurité."]}},
{id:"plongee-jeunes",name:"Plongée avec des jeunes",alt:"Plongée particulière",tags:["Mineurs"],s:{
"Points clés":["Autonomie seulement dès 16 ans (PA-12, PA-20) ou 17 ans (PA-40), sur décision du DP ; profondeurs et durées adaptées à l’âge et au brevet.","Matériel à leur taille, protection thermique renforcée, plongées courtes.","Encadrant habitué aux enfants, consignes simples, attention à la fatigue."]}},
{id:"plongee-nuit",name:"Plongée de nuit",alt:"Plongée particulière",tags:["Phare + secours"],s:{
"Points clés":["Site connu, idéalement reconnu de jour ; conditions calmes.","Chaque plongeur a un phare principal et une lampe de secours ; repère lumineux sur le bateau ou la sortie.","Briefing des signes lumineux, palanquées réduites, durée et profondeur prudentes."]}},
{id:"plongee-derivante",name:"Plongée dérivante",alt:"Plongée particulière",tags:["Bateau suiveur"],s:{
"Points clés":["Mise à l’eau groupée et descente rapide, pas de mouillage.","Un parachute par palanquée au minimum, à sortir pour la remontée ; le pilote suit les bulles.","Plongeurs expérimentés, briefing sur la séparation et la récupération."]}},
{id:"etude-cas-dp",name:"Méthode d’étude de cas",alt:"Comment répondre",tags:["Justifier"],s:{
"Démarche":["Relever niveaux, âges, aptitudes, conditions et contraintes du sujet.","Appliquer les tableaux du Code du sport et les règles fédérales.","Proposer des palanquées, profondeurs et durées, puis justifier chaque choix.","Prévoir la sécurité : secours, consignes, plan B."]},
tip:"Une réponse juste mais non justifiée rapporte peu : cite la règle qui fonde chaque décision."}]}
],
foot:{title:"Les lois à savoir écrire",cards:[
{t:"Archimède",p:"Poids apparent = poids réel − volume × masse volumique du liquide. Eau de mer ≈ 1,03 kg/L."},
{t:"Mariotte et Charles",p:"P1V1 = P2V2 à température constante ; P1/T1 = P2/T2 à volume constant, T en kelvins."},
{t:"Dalton",p:"Pp = Pabs × fraction du gaz. À l’air : 21 % d’O2, 79 % de N2."}]},
note:"Support de révision construit à partir du programme publié sur passe-ton-mf1.com. Les valeurs arrondies (1,03 kg/L, 1 500 m/s…) peuvent varier selon les supports : utilise celles de ton centre de formation."
};
