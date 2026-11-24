/* Données de la mindmap « desaturation » (page /capacitaire/desaturation/), reprises de mindmaps-mf1/desaturation.html.
   Seule la typographie a été adaptée (apostrophes, espaces insécables). */
const PAGE={
title:"Désaturation",
root:"Désaturation",
sub:"Écrit 4 du module capacitaire MF1 : modèles de décompression, bulles, préconisations fédérales et accident de désaturation. Les fiches donnent les chiffres clés et les questions types.",
meta:["Écrit 4","Coefficient 3","45 minutes","4 rubriques"],
search:"Rechercher : période, M-value, FOP, yoyo…",
start:"haldane-principes",
cats:[
{id:"haldane",name:"Haldane et dérivés",law:"Compartiments en parallèle",items:[
{id:"haldane-principes",name:"Principes de Haldane",alt:"Le modèle fondateur (1907)",tags:["Période","Gradient"],s:{
"Hypothèses":["L’organisme est découpé en compartiments théoriques, en parallèle, qui échangent tous directement avec le sang.","Chaque compartiment a une période : le temps pour faire la moitié du chemin vers la saturation.","La vitesse d’échange dépend du gradient entre la pression d’azote respirée et la tension du compartiment."],
"Saturation":["Après 1 période : 50 % ; 2 : 75 % ; 3 : 87,5 % ; 4 : 93,75 % ; 5 : environ 97 % ; 6 : environ 98,4 %.","On considère un compartiment saturé au bout de 6 périodes. La désaturation suit la même loi."]},
tip:"Question type : tension d’un compartiment de 20 min après 40 min à 30 m. Deux périodes : 75 % du chemin entre 0,79 et 3,16 bar, soit environ 2,57 bar."},
{id:"conditions-remontee",name:"Conditions de remontée",alt:"Sc, M-values, facteurs de gradient",tags:["Sursaturation tolérée"],s:{
"Sc":["Coefficient de sursaturation critique : rapport maximal toléré entre la tension d’un compartiment et la pression ambiante.","Plus le compartiment est rapide, plus il tolère une sursaturation élevée."],
"M-values":["Tension maximale tolérée par compartiment à chaque profondeur (approche de Workman, puis Bühlmann).","Elles s’expriment par une droite : la tolérance augmente avec la profondeur."],
"Facteurs de gradient":["Pourcentage de la M-value qu’on s’autorise : GF bas (premier palier) et GF haut (sortie), par exemple 30/85.","Un GF bas fait commencer les paliers plus profond ; un GF haut bas allonge les paliers près de la surface."]}},
{id:"mn90",name:"Tables MN90",alt:"Marine nationale, 1990",tags:["12 compartiments","Sc 2,72 à 1,54"],s:{
"Paramètres":["12 compartiments de période 5 à 120 min.","Sc de 2,72 pour le compartiment de 5 min à 1,54 pour celui de 120 min.","Vitesse de remontée de 15 à 17 m/min jusqu’au premier palier, 6 m/min entre les paliers et jusqu’à la surface.","Paliers de 3 en 3 m."],
"Plongées successives":["Le compartiment de 120 min sert à calculer l’azote résiduel.","Intervalle de moins de 15 min : plongée consécutive (une seule plongée). Plus de 12 h : plongée isolée."]}},
{id:"buhlmann",name:"Bühlmann ZHL-16C",alt:"Modèle des ordinateurs",tags:["16 compartiments"],s:{
"Paramètres":["16 compartiments, de quelques minutes à environ 635 min.","Chaque compartiment a ses coefficients a et b qui définissent sa M-value.","Version C adaptée au calcul en temps réel ; souvent combinée aux facteurs de gradient."]}},
{id:"rgbm",name:"RGBM",alt:"Modèle à bulles de Wienke",tags:["Gaz dissous + bulles"],s:{
"Principes":["Reduced Gradient Bubble Model : ajoute au calcul de gaz dissous une prise en compte de la formation de bulles.","Pénalise les profils à risque : yoyo, remontées rapides, intervalles courts, plongées successives.","Utilisé dans plusieurs marques d’ordinateurs."]}},
{id:"successives",name:"Successives et majoration",alt:"Calcul MN90",tags:["GPS, azote résiduel"],s:{
"Démarche":["Lire le groupe de plongée successive (GPS) à la sortie.","Avec l’intervalle, trouver l’azote résiduel.","Avec la profondeur de la 2ᵉ plongée, trouver la majoration : temps fictif ajouté à la durée réelle.","Lire les paliers avec durée réelle + majoration."]},
tip:"Les questions restent simples : savoir dérouler la démarche et expliquer pourquoi on majore."}]},
{id:"dciem",name:"Autre modèle : DCIEM",law:"Compartiments en série",items:[
{id:"dciem-principe",name:"Principe du DCIEM",alt:"Modèle canadien Kidd-Stubbs",tags:["4 compartiments en série"],s:{
"Fonctionnement":["Modèle canadien issu des travaux de Kidd et Stubbs (années 1970).","4 compartiments en série : l’azote passe de l’un à l’autre, seul le premier échange avec le sang.","Les tables ont été largement validées par détection de bulles au Doppler."]}},
{id:"dciem-successives",name:"Plongées successives",alt:"Gestion native",tags:["Facteur de répétition"],s:{
"Fonctionnement":["Les successives sont gérées par un facteur de répétition qui multiplie la durée de la 2ᵉ plongée.","Ce facteur dépend du groupe de sortie et de l’intervalle."]}},
{id:"dciem-differences",name:"Différences avec Haldane",alt:"Ce qu’il faut savoir comparer",tags:["Série ou parallèle"],s:{
"Comparaison":["Haldane : compartiments indépendants en parallèle, chacun avec sa période et son seuil.","DCIEM : compartiments en série, la désaturation des tissus profonds est retardée par les autres.","Le DCIEM est réputé plus conservateur sur les plongées répétées."]},
tip:"La question type demande de schématiser les deux architectures et d’en déduire une conséquence."}]},
{id:"bulles",name:"Bulles",law:"Formation, croissance, préconisations",items:[
{id:"micronoyaux",name:"Micronoyaux",alt:"Germes gazeux",tags:["Avant la plongée"],s:{
"Principe":["Des micro-bulles stables existent dans l’organisme avant toute plongée.","À la décompression, l’azote en excès diffuse vers ces germes, qui grossissent en bulles.","L’effort, les mouvements articulaires et la cavitation peuvent en créer."]}},
{id:"bulles-circulantes",name:"Bulles circulantes",alt:"Bulles « silencieuses »",tags:["Filtre pulmonaire"],s:{
"À retenir":["Des bulles veineuses sont fréquentes après une plongée normale, sans symptôme.","Le poumon les filtre et les élimine.","Le danger vient de leur nombre, de leur passage côté artériel ou de leur croissance."]}},
{id:"prt",name:"Charge en azote : index Prt",alt:"Estimer le risque d’un profil",tags:["P × √t"],s:{
"Principe":["Index proposé par Hennessy : Prt = P × √t, avec P la pression et t la durée en minutes.","Plus l’index est élevé, plus la charge en azote et le risque de bulles augmentent ; une valeur autour de 25 est souvent donnée comme seuil de prudence."]},
tip:"Vérifie dans ton support si P est exprimée en pression absolue ou relative : les formations ne présentent pas toutes l’index de la même façon."},
{id:"remontees-yoyo",name:"Remontées rapides et yoyo",alt:"Profils à risque",tags:["Bulles artérielles"],s:{
"Pourquoi c’est dangereux":["Une remontée rapide ne laisse pas le temps à l’azote de s’éliminer : production massive de bulles.","Le yoyo recomprime et réexpanse les bulles et favorise leur passage côté artériel."],
"Limites fédérales (CTN-08-001)":["4 cycles maximum dans la zone des 20 m, 3 entre 20 et 30 m, 2 au-delà de 30 m.","Ces limites baissent en cas de courant, froid, faible visibilité ou méforme."]}},
{id:"acclimatation",name:"Acclimatation et réadaptation",alt:"Reprendre progressivement",tags:["Début de saison"],s:{
"À retenir":["Des plongées régulières semblent réduire la production de bulles : on parle d’acclimatation.","Après une interruption, reprendre par des plongées peu profondes et courtes : plongées de réadaptation.","À l’inverse, une série de plongées intenses accumule la fatigue."]}},
{id:"rattrapage",name:"Procédures de rattrapage",alt:"Préconisations fédérales 2024",tags:["CTN-24-001","CTN-24-002"],s:{
"Remontée rapide":["Définition : plus de 15 m/min sur au moins 10 m, entre 30 m et la surface.","Redescendre en moins de 3 min au moins à mi-profondeur, y rester 5 min, puis suivre l’ordinateur en ajoutant 1 min à 6 m et 5 min à 3 m.","Réimmersion impossible : oxygène et évacuation."],
"Palier interrompu":["Se réimmerger en moins de 3 min, finir les paliers en ajoutant 3 min à 3 m.","Réimmersion impossible, aucun signe et 3 min de palier manquées au plus : surveillance 3 h et pas de plongée pendant 24 h.","Plus de 3 min manquées ou le moindre signe : oxygène et secours."]},
tip:"Ces procédures, validées en 2024, remplacent celles de la MN90 pour la plongée avec ordinateur."}]},
{id:"add",name:"Accidents de désaturation",law:"Mécanismes, cœur, prévention",items:[
{id:"add-mecanismes",name:"Mécanismes",alt:"Effets des bulles",tags:["Mécanique + biochimique"],s:{
"Effets mécaniques":["Obstruction des vaisseaux, compression ou étirement des tissus par les bulles."],
"Effets biochimiques":["Les bulles abîment la paroi des vaisseaux, activent plaquettes et coagulation, déclenchent une inflammation.","D’où des signes qui peuvent s’aggraver même après la sortie de l’eau."]}},
{id:"add-symptomes",name:"Symptômes",alt:"Type I et type II",tags:["Délai : souvent < 1 h"],s:{
"Formes":["Cutanées : puces (démangeaisons), moutons (marbrures).","Ostéo-arthro-musculaires : douleur articulaire profonde.","Neurologiques : médullaires (dos, jambes, vessie) ou cérébrales (vision, parole, paralysie).","Vestibulaires : vertige, nausées, acouphènes.","Cardio-pulmonaires : douleur thoracique, gêne respiratoire."],
"Délai":["La plupart des signes apparaissent dans l’heure, parfois jusqu’à 24 h."]}},
{id:"coeur-fop",name:"Cœur et FOP",alt:"Foramen ovale perméable",tags:["Shunt droit-gauche"],s:{
"Rappel anatomique":["Cœur droit vers les poumons (qui filtrent les bulles), cœur gauche vers tout l’organisme."],
"FOP":["Persistance d’un passage entre les deux oreillettes, présent chez environ un quart de la population.","Une hausse de pression dans le cœur droit (Valsalva, effort, toux) peut l’ouvrir : des bulles veineuses passent côté artériel.","Associé aux ADD neurologiques, vestibulaires et cutanés de type moutons."]}},
{id:"shunts-pulmonaires",name:"Shunts pulmonaires",alt:"Le filtre qui laisse passer",tags:["Effort"],s:{
"À retenir":["Des communications entre artères et veines pulmonaires peuvent s’ouvrir, notamment à l’effort.","Les bulles contournent alors le filtre pulmonaire : même risque de passage artériel qu’avec un FOP."]}},
{id:"add-prevention",name:"Prévention et profils à risque",alt:"Réduire le risque",tags:["Avant, pendant, après"],s:{
"Profils à risque":["Plongées profondes, longues, avec paliers ; successives ; profils inversés ou en yoyo ; remontées rapides."],
"Facteurs individuels":["Fatigue, froid, déshydratation, âge, surpoids, FOP, méforme."],
"Après la plongée":["Pas d’effort, pas d’apnée, pas de Valsalva forcé ; attendre avant l’avion ou l’altitude."]}},
{id:"add-rifap",name:"Prise en charge RIFAP",alt:"Ce qu’on attend au MF1",tags:["O2 15 L/min"],s:{
"Gestes":["Sortir, bilan, O2 au masque haute concentration à 15 L/min.","Hydratation par petites gorgées si la victime est consciente et sans nausées.","Alerte (CROSS VHF 16 ou 196 en mer, 15 ou 112 à terre), fiche d’évacuation, ordinateur avec la victime.","Protéger du froid, surveiller, surveiller aussi le reste de la palanquée."],
"À savoir":["L’aspirine a été retirée des référentiels de secourisme fédéraux (CDN-20-035)."]},
tip:"Le traitement en caisson n’est pas au programme : on s’arrête à la prise en charge vue au RIFAP."},
{id:"add-cas",name:"Exemple d’étude de cas",alt:"S’entraîner à raisonner",tags:["Analyse de profil"],s:{
"Énoncé type":["Deuxième plongée à 35 m, profil en yoyo pour un exercice, remontée accélérée sur les 10 derniers mètres. 40 min après, fourmillements dans les jambes."],
"Raisonnement attendu":["Hypothèse : ADD médullaire, facteurs : successive, yoyo, remontée rapide.","Conduite RIFAP immédiate, alerte, évacuation.","Prévention : respect des cycles CTN, procédure de rattrapage, vitesse de remontée."]}}]}
],
foot:{title:"Les chiffres à avoir en tête",cards:[
{t:"Périodes",p:"Après 1, 2, 3 périodes : 50, 75, 87,5 % de saturation. Saturé au bout de 6 périodes."},
{t:"Remontée rapide",p:"Plus de 15 m/min sur au moins 10 m entre 30 m et la surface : mi-profondeur 5 min, puis +1 min à 6 m et +5 min à 3 m."},
{t:"Yoyo",p:"4 cycles dans les 20 m, 3 entre 20 et 30 m, 2 au-delà de 30 m (CTN-08-001)."}]},
note:"Support de révision construit à partir du programme publié sur passe-ton-mf1.com et des recommandations fédérales publiées (CTN-24-001, CTN-24-002, CTN-08-001, CDN-20-035). Vérifie les paramètres exacts des modèles dans ton support de cours."
};
