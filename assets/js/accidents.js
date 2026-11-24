/* Mindmap des accidents de plongée (page /accidents-de-plongee/, gabarit layouts/_default/accidents.html).
   Script d’origine conservé (mindmap-accidents.html), deux adaptations seulement :
   - typographie française dans les textes (apostrophes, espaces insécables) ;
   - CSP du site (style-src 'self') : les positions sont posées par le CSSOM (data-s → style.cssText),
     et non par des attributs style dans le HTML généré. */
{
const C=[
{id:"baro",name:"Barotraumatismes",law:"Loi de Mariotte",col:"var(--baro)",items:[
{id:"oreille-moyenne",name:"Oreille moyenne",alt:"Barotraumatisme le plus fréquent",tags:["Descente surtout","0 à 10 m critiques"],s:{
"Mécanisme":["À la descente, la pression augmente et le volume d’air de la caisse du tympan diminue.","Si la trompe d’Eustache ne s’ouvre pas, le tympan est aspiré vers l’intérieur. Les plus fortes variations de volume se font entre 0 et 10 m."],
"Signes":["Douleur vive et croissante, sensation d’oreille bouchée, baisse d’audition.","Saignement (otorragie) en cas de perforation.","Vertige brutal si l’eau froide entre dans l’oreille moyenne après perforation."],
"Conduite à tenir":["Stopper la descente, remonter d’1 ou 2 m et rééquilibrer en douceur.","Si c’est impossible ou si la douleur persiste : fin de plongée.","Consultation ORL, pas de plongée avant guérison."],
"Prévention":["Équilibrer tôt, souvent et sans forcer (Valsalva doux, BTV, Frenzel).","Descendre à son rythme, au pendeur ou au mouillage si besoin.","Ne pas plonger enrhumé, éviter les décongestionnants (effet rebond à la remontée)."]},
mf1:"Faire pratiquer plusieurs méthodes d’équilibrage dès les premières plongées et repérer les signes chez l’élève (main à l’oreille, arrêt, regard inquiet)."},
{id:"oreille-interne",name:"Oreille interne",alt:"Rupture de fenêtre, fistule périlymphatique",tags:["Valsalva forcé","Urgence ORL"],s:{
"Mécanisme":["Valsalva trop tardif ou trop violent : la surpression transmise par les osselets ou le liquide rompt la fenêtre ronde ou ovale.","Le liquide de l’oreille interne fuit (fistule périlymphatique)."],
"Signes":["Vertiges rotatoires, nausées, vomissements.","Acouphènes, surdité brutale, parfois retardés après la plongée."],
"Conduite à tenir":["Sur le bateau, impossible de la distinguer d’un ADD vestibulaire : on traite comme un ADD (O2 15 L/min, alerte, évacuation).","Diagnostic et traitement en milieu hospitalier."],
"Prévention":["Jamais de Valsalva en force.","Ne pas insister avec une oreille qui passe mal, privilégier les manœuvres douces."]},
mf1:"Bien expliquer pourquoi le Valsalva en force est dangereux et maîtriser le diagnostic différentiel avec l’ADD vestibulaire."},
{id:"sinus",name:"Sinus",alt:"Barotraumatisme sinusien",tags:["Descente ou remontée"],s:{
"Mécanisme":["Les sinus communiquent avec les fosses nasales par des canaux fins.","Rhume, sinusite ou polype les bouchent : dépression à la descente, ou surpression à la remontée (blocage inverse)."],
"Signes":["Douleur frontale (au-dessus des yeux) ou maxillaire (pommettes, parfois dents du haut).","Saignement de nez, sang dans le masque."],
"Conduite à tenir":["Stopper la descente, remonter un peu, puis fin de plongée si la douleur persiste.","En blocage à la remontée, remonter très lentement.","Avis ORL si la douleur dure."],
"Prévention":["Pas de plongée enrhumé ou avec une sinusite.","Pas de vasoconstricteurs pour « passer » quand même."]}},
{id:"placage-masque",name:"Placage de masque",alt:"Barotraumatisme du masque",tags:["Descente","Bénin le plus souvent"],s:{
"Mécanisme":["Le volume d’air du masque diminue à la descente : sans expiration par le nez, il fait ventouse sur le visage."],
"Signes":["Yeux rouges, hémorragies conjonctivales, petites taches rouges (pétéchies) autour des yeux.","Douleur, saignement de nez."],
"Conduite à tenir":["Souffler par le nez.","Consultation si l’œil est touché ou si la vue est gênée."],
"Prévention":["Expirer régulièrement par le nez pendant la descente.","Masque englobant le nez, jamais de lunettes de natation."]}},
{id:"dents",name:"Dents",alt:"Barodontalgie",tags:["Carie, soin récent"],s:{
"Mécanisme":["Une bulle d’air piégée sous une carie, un plombage ou une couronne mal ajustée subit les variations de pression."],
"Signes":["Douleur dentaire à la descente ou à la remontée.","Plombage descellé, voire dent fissurée."],
"Conduite à tenir":["Remonter lentement, fin de plongée.","Consulter un dentiste."],
"Prévention":["Soins dentaires à jour.","Après un soin ou une extraction, demander l’avis du dentiste avant de replonger."]}},
{id:"surpression-pulmonaire",name:"Surpression pulmonaire",alt:"Barotraumatisme pulmonaire",tags:["Remontée","Urgence vitale","Caisson"],s:{
"Mécanisme":["À la remontée, l’air des poumons se dilate. Si le plongeur bloque son expiration (panique, remontée en apnée, toux, laryngospasme, remontée trop rapide), les alvéoles se distendent puis se déchirent.","L’air passe alors dans la plèvre, le médiastin, sous la peau ou dans la circulation artérielle. Le risque est maximal près de la surface."],
"Signes":["Douleur thoracique, toux, crachats sanglants et mousseux, difficultés respiratoires.","Emphysème sous-cutané (crépitations au cou), voix modifiée, pneumothorax.","Embolie gazeuse : troubles neurologiques (paralysie, troubles visuels, de la parole), perte de connaissance, arrêt cardio-respiratoire."],
"Conduite à tenir":["Sortir de l’eau, allonger ou semi-asseoir si la victime respire mal, PLS si inconsciente et ventilant, RCP sinon.","Oxygène 15 L/min, alerte, fiche d’évacuation.","Jamais de réimmersion. Évacuation vers un centre hyperbare."],
"Prévention":["Expirer pendant toute la remontée, ne jamais bloquer.","Vitesse maîtrisée, encore plus lente dans la zone des 10 derniers mètres.","Aptitude médicale (asthme, pathologies pulmonaires)."]},
mf1:"C’est l’accident redouté pendant les exercices de remontée (REC, remontée assistée) : le moniteur contrôle l’expiration de l’élève et freine la remontée."},
{id:"estomac-intestins",name:"Estomac, intestins",alt:"Colique du scaphandrier",tags:["Remontée"],s:{
"Mécanisme":["Les gaz digestifs se dilatent à la remontée."],
"Signes":["Ballonnements, douleurs abdominales, nausées, rarement malaise."],
"Conduite à tenir":["Remonter plus lentement, laisser les gaz s’évacuer.","Consulter si la douleur persiste."],
"Prévention":["Éviter boissons gazeuses, repas lourds et aliments qui fermentent avant la plongée.","Ne pas avaler d’air (détendeur, mal de mer)."]}}]},
{id:"tox",name:"Accidents toxiques",law:"Loi de Dalton",col:"var(--tox)",items:[
{id:"narcose",name:"Narcose",alt:"Ivresse des profondeurs",tags:["PpN2 ≈ 3,2 bar","Réversible"],s:{
"Mécanisme":["L’azote sous forte pression partielle a un effet narcotique sur le système nerveux.","Effets nets vers 30 à 40 m à l’air, croissants avec la profondeur, très variables selon la personne et le jour."],
"Signes":["Euphorie ou angoisse, rires, sentiment de toute-puissance.","Troubles du jugement, lenteur, fixation sur une idée, vision en tunnel.","Oubli des instruments, perte de mémoire de la plongée, perte de conscience à très grande profondeur."],
"Conduite à tenir":["Remonter de quelques mètres : les symptômes disparaissent vite.","Surveiller le plongeur, mettre fin à la plongée si besoin.","Le vrai danger est le comportement induit : panne d’air, remontée rapide, perte de palanquée."],
"Prévention":["Profondeur adaptée au niveau, progressivité de l’expérience.","Facteurs aggravants à éviter : froid, fatigue, stress, alcool, médicaments, essoufflement, mauvaise visibilité.","Au-delà de 60 m (limite de l’air), mélanges à l’hélium."]},
mf1:"Surveiller les élèves N2/N3 dans la zone 30-40 m : signes simples à faire répéter, lecture des instruments, contrôle de l’air."},
{id:"hyperoxie-neurologique",name:"Hyperoxie neurologique",alt:"Effet Paul Bert",tags:["PpO2 > 1,6 bar","Convulsions"],s:{
"Mécanisme":["L’oxygène devient toxique pour le système nerveux au-delà d’une PpO2 de 1,6 bar, la limite fixée par le Code du sport.","À l’air, 1,6 bar est atteint vers 66 m. Au nitrox, la profondeur limite est bien plus faible."],
"Signes":["Crise convulsive de type épileptique, souvent sans prévenir : phase tonique (contracture, glotte fermée), phase clonique (convulsions), phase résolutive (confusion, coma).","Signes avant-coureurs inconstants : troubles visuels, acouphènes, nausées, contractions du visage, irritabilité, vertiges."],
"Conduite à tenir":["Maintenir le détendeur en bouche et tenir la victime.","Remonter une fois la phase tonique passée, quand l’expiration est possible (sinon risque de surpression pulmonaire).","En surface : voies aériennes, bilan, O2, alerte, prise en charge d’une éventuelle noyade."],
"Prévention":["Calculer et respecter la profondeur maximale du mélange.","Analyser son nitrox, marquer le bloc, ne pas dépasser la profondeur prévue."]},
mf1:"Calcul type : Pabs max = PpO2 max ÷ %O2. EAN32 à 1,6 bar : 1,6 ÷ 0,32 = 5 bar, soit 40 m."},
{id:"hyperoxie-pulmonaire",name:"Hyperoxie pulmonaire",alt:"Effet Lorrain Smith",tags:["PpO2 > 0,5 bar longtemps","Rare en loisir"],s:{
"Mécanisme":["Exposition prolongée à une PpO2 supérieure à 0,5 bar : inflammation des alvéoles.","Concerne surtout la recompression thérapeutique, la plongée technique, l’oxygénothérapie longue."],
"Signes":["Toux sèche, brûlure derrière le sternum, gêne respiratoire, baisse de la capacité vitale."],
"Conduite à tenir":["Arrêter l’exposition, généralement réversible.","Avis médical."],
"Prévention":["Gestion des doses d’oxygène (UPTD, CPTD) en plongée technique."]}},
{id:"essoufflement",name:"Essoufflement",alt:"Hypercapnie",tags:["CO2","Cercle vicieux"],s:{
"Mécanisme":["Le CO2 est mal évacué : respiration rapide et superficielle, espace mort, air plus dense en profondeur.","Le CO2 qui s’accumule accélère encore la respiration, qui devient de moins en moins efficace."],
"Signes":["Rythme rapide, inspiration privilégiée, sensation de manque d’air.","Angoisse, envie de remonter, panique.","Maux de tête après la plongée."],
"Conduite à tenir":["Stopper tout effort, se stabiliser, tenir le plongeur.","Le faire expirer à fond, le rassurer, remonter de quelques mètres si besoin.","Fin de plongée. Danger : panique, remontée incontrôlée, surpression, ADD, noyade."],
"Prévention":["Lestage et équipement adaptés, détendeur entretenu, bloc bien ouvert.","Palmage souple, anticiper courant et froid, expirations longues."]},
mf1:"Premier accident à surveiller en exploration. Apprendre à l’élève à signaler « je suis essoufflé » et à ne jamais filer seul vers la surface."},
{id:"monoxyde-carbone",name:"Monoxyde de carbone",alt:"Intoxication au CO",tags:["Air pollué","Caisson"],s:{
"Mécanisme":["Air du bloc pollué : prise d’air du compresseur près d’un échappement, huile surchauffée, filtres saturés.","Le CO se fixe sur l’hémoglobine environ 200 à 250 fois plus que l’O2, et la pression amplifie son effet."],
"Signes":["Maux de tête, nausées, vertiges, fatigue.","Troubles du comportement, perte de connaissance.","Plusieurs plongeurs gonflés au même endroit touchés en même temps."],
"Conduite à tenir":["Sortir, O2 15 L/min, alerte.","Oxygénothérapie hyperbare en centre spécialisé.","Mettre de côté les blocs suspects et le compresseur pour analyse."],
"Prévention":["Prise d’air du compresseur à l’abri des fumées, entretien et filtres à jour.","Contrôle régulier de la qualité de l’air."]}}]},
{id:"add",name:"Désaturation (ADD)",law:"Loi de Henry",col:"var(--add)",items:[
{id:"add-cutane",name:"ADD cutané",alt:"Puces et moutons",tags:["Type I"],s:{
"Mécanisme":["Bulles d’azote dans les petits vaisseaux de la peau et le tissu sous-cutané."],
"Signes":["Puces : démangeaisons.","Moutons : marbrures violacées, peau gonflée, souvent sur le thorax ou l’abdomen."],
"Conduite à tenir":["O2, surveillance, protocole RIFAP.","Les moutons sont un signe sérieux, souvent associés à une atteinte plus grave : alerte et caisson."],
"Prévention":["Voir « Facteurs favorisants »."]}},
{id:"add-osteo-articulaire",name:"ADD ostéo-articulaire",alt:"Bends",tags:["Type I","Caisson"],s:{
"Mécanisme":["Bulles dans les articulations, les tendons ou les os."],
"Signes":["Douleur profonde d’une grosse articulation (épaule, coude, genou), croissante, que la position ne soulage pas.","Impotence du membre."],
"Conduite à tenir":["O2 15 L/min, alerte, évacuation vers un caisson.","Ne pas masser, ne pas chauffer, ne pas mettre sur le compte d’un effort."],
"Prévention":["Voir « Facteurs favorisants »."]}},
{id:"add-neurologique",name:"ADD neurologique",alt:"Médullaire ou cérébral",tags:["Type II","Urgence vitale"],s:{
"Mécanisme":["Médullaire : les bulles bloquent la circulation de la moelle épinière, forme grave la plus fréquente.","Cérébral : bulles dans la circulation artérielle cérébrale, souvent via un FOP."],
"Signes":["Médullaire : douleur en coup de poignard dans le dos, fourmillements, faiblesse ou paralysie des jambes, impossibilité d’uriner.","Cérébral : troubles visuels, de la parole, paralysie d’un côté, confusion, convulsions, perte de connaissance."],
"Conduite à tenir":["Protocole RIFAP complet, O2 15 L/min sans attendre.","Alerte immédiate, évacuation la plus rapide possible vers un caisson.","Tester la sensibilité et la motricité, noter l’évolution sur la fiche."],
"Prévention":["Voir « Facteurs favorisants »."]},
mf1:"Une fatigue anormale ou une jambe lourde après plongée : on y pense tout de suite. Le déni du plongeur fait perdre un temps précieux."},
{id:"add-vestibulaire",name:"ADD vestibulaire",alt:"Atteinte de l’oreille interne",tags:["Type II","FOP fréquent"],s:{
"Mécanisme":["Bulles dans l’oreille interne, souvent après des plongées profondes et en présence d’un FOP."],
"Signes":["Grand vertige rotatoire, nausées, vomissements, mouvements anormaux des yeux.","Acouphènes, baisse d’audition."],
"Conduite à tenir":["Traiter comme un ADD : O2, alerte, caisson rapidement (les séquelles dépendent du délai).","Pas d’eau à boire si la victime vomit."],
"Prévention":["Voir « Facteurs favorisants »."]},
mf1:"Diagnostic différentiel avec le barotraumatisme de l’oreille interne : dans le doute, on traite toujours comme un ADD."},
{id:"add-cardio-pulmonaire",name:"ADD cardio-pulmonaire",alt:"Chokes",tags:["Type II","Urgence vitale"],s:{
"Mécanisme":["Afflux massif de bulles vers les poumons, après une remontée panique ou des paliers oubliés."],
"Signes":["Douleur thoracique, toux, gêne respiratoire croissante.","Détresse respiratoire, état de choc."],
"Conduite à tenir":["Position semi-assise si consciente, O2 15 L/min.","Alerte immédiate, évacuation vers un caisson, RCP si arrêt."],
"Prévention":["Voir « Facteurs favorisants »."]}},
{id:"facteurs-favorisants",name:"Facteurs favorisants",alt:"Prévenir l’ADD",tags:["Jusqu’à 24 h après"],s:{
"Liés à la plongée":["Remontée trop rapide, paliers écourtés ou oubliés.","Profils inversés ou en yo-yo, plongées successives.","Effort en fin de plongée ou pendant le palier."],
"Liés au plongeur":["Fatigue, déshydratation, froid, stress.","Âge, surpoids, condition physique, foramen ovale perméable (FOP).","Lendemain de fête, alcool.","Reprise après une période sans plonger : prévoir des plongées de réadaptation (acclimatation à la désaturation)."],
"Après la plongée":["Effort (gonflage, remonter l’ancre, porter les blocs), apnée.","Avion ou altitude trop tôt, douche très chaude, sauna."],
"Délai d’apparition":["La majorité des signes apparaissent dans l’heure qui suit la sortie, parfois jusqu’à 24 h après."]},
mf1:"Tout signe anormal après une plongée est un ADD jusqu’à preuve du contraire."},
{id:"procedures-de-rattrapage",name:"Procédures de rattrapage",alt:"Remontée anormale sans signe d’accident",tags:["CTN 2024","Plongée à l’ordinateur"],s:{
"Remontée trop rapide":["Cas visé : plus de 15 m/min entre 30 m et la surface, sur au moins 10 m de trajet vertical.","Si la réimmersion est possible : redescendre en moins de 3 minutes au moins à mi-profondeur, y faire un palier de 5 minutes, puis au moins 1 minute à 6 m et 5 minutes à 3 m.","Sinon : oxygène et évacuation."],
"Palier obligatoire non fait":["Si la réimmersion est possible : redescendre en moins de 3 minutes, suivre son ordinateur et ajouter 3 minutes à 3 m, quel que soit le temps de palier manqué.","Si elle n’est pas possible, s’il y a un signe d’accident, ou s’il manque plus de 3 minutes de palier : déclencher les secours.","Si elle n’est pas possible et qu’il manque 3 minutes de palier au plus : observation pendant 3 heures, pas de plongée pendant 24 h."],
"À retenir":["Au moindre signe pouvant évoquer un accident, on déclenche les secours : on ne redescend plus.","Les yoyos sont fortement déconseillés en exploration. En formation, leur profondeur plafond est de 6 m."]},
mf1:"Le MFT MF1 demande de connaître et d’expliquer ces procédures avec les préconisations fédérales."}]},
{id:"mil",name:"Milieu et apnée",law:"Thermique, physiologie",col:"var(--mil)",items:[
{id:"froid",name:"Froid, hypothermie",alt:"Refroidissement",tags:["Aggrave tout"],s:{
"Mécanisme":["L’eau évacue la chaleur environ 25 fois plus vite que l’air.","Le froid favorise l’essoufflement, la narcose et l’ADD."],
"Signes":["Frissons, crampes, lèvres bleues, respiration accélérée.","Gestes maladroits, perte de lucidité."],
"Conduite à tenir":["Fin de plongée, sortir, sécher, vêtements secs, couverture de survie.","Boisson chaude non sucrée si la personne est consciente, ni alcool ni frictions."],
"Prévention":["Protection adaptée (épaisseur, cagoule), ne pas plonger à jeun ni fatigué.","Durée de plongée raisonnable, surveiller les élèves les plus minces."]}},
{id:"syncope-thermo-differentielle",name:"Syncope thermo-différentielle",alt:"Hydrocution",tags:["Entrée dans l’eau froide","Risque de noyade"],s:{
"Mécanisme":["Passage brutal d’un milieu chaud à une eau froide : réaction réflexe du système nerveux.","Le cœur ralentit fortement et la tension artérielle chute."],
"Signes":["Malaise, puis perte de connaissance peu après l’entrée dans l’eau."],
"Conduite à tenir":["Sortir la victime de l’eau sans attendre : le risque de noyade est élevé.","Protocole RIFAP : bilan, oxygène, alerte."],
"Prévention":["Porter une combinaison adaptée à la température de l’eau.","Ne pas attendre longtemps en plein soleil tout équipé, se mouiller avant de s’immerger."]},
mf1:"Surveiller les élèves qui attendent équipés au soleil avant la mise à l’eau, surtout par eau froide."},
{id:"deshydratation",name:"Déshydratation",alt:"Diurèse d’immersion",tags:["Favorise l’ADD","Froid"],s:{
"Mécanisme":["En immersion, la pression de l’eau ramène le sang vers le thorax. Le cœur et les reins réagissent en produisant plus d’urine : c’est la diurèse d’immersion.","Le froid déclenche sa propre diurèse, qui s’ajoute à la première. L’air sec du bloc et la transpiration augmentent encore les pertes d’eau.","Le sang devient plus concentré, ce qui augmente le risque d’accident de désaturation."],
"Signes":["Soif intense, bouche sèche, fatigue inhabituelle, maux de tête, crampes."],
"Conduite à tenir":["Boire de l’eau dès la sortie de l’eau, sans alcool.","Tout signe anormal après une plongée est un ADD jusqu’à preuve du contraire : appliquer le protocole RIFAP."],
"Prévention":["Boire régulièrement avant et après la plongée, même sans soif.","Se protéger du froid, éviter l’alcool et les efforts inutiles."]},
mf1:"Les deux diurèses, celle de l’immersion et celle du froid, s’additionnent. Faire boire les élèves entre deux plongées fait partie de la prévention de l’ADD."},
{id:"noyade",name:"Noyade",alt:"Inhalation de liquide",tags:["4 stades","Toujours hospitalisée"],s:{
"Mécanisme":["Inhalation d’eau, souvent conséquence d’un autre accident (panique, convulsion, perte de connaissance)."],
"Stades":["Aquastress : angoisse, pas d’inhalation.","Petit hypoxique : quelques gorgées, toux, frissons.","Grand hypoxique : détresse respiratoire, confusion.","Anoxique : arrêt respiratoire puis cardiaque."],
"Conduite à tenir":["Sortir la victime de l’eau, voies aériennes, bilan.","Pas de respiration : 5 insufflations initiales puis RCP 30/2 avec DAE.","O2, alerte : toute noyade est évaluée à l’hôpital (aggravation secondaire possible)."],
"Prévention":["Surveillance en surface, gilet gonflé, savoir assister et tracter."]}},
{id:"syncope-apnee",name:"Syncope en apnée",alt:"Rendez-vous syncopal, samba",tags:["Hyperventilation","Près de la surface"],s:{
"Mécanisme":["L’hyperventilation abaisse le CO2 et retarde l’envie de respirer.","À la remontée, la pression partielle d’O2 chute avec la pression : perte de connaissance près de la surface."],
"Signes":["Souvent aucun signe avant-coureur.","Samba : tremblements, perte de contrôle moteur.","Perte de connaissance en fin de remontée ou juste après la sortie."],
"Conduite à tenir":["Voies aériennes hors de l’eau, retirer le masque, stimuler (parler, souffler sur le visage).","Pas de reprise : insufflations, RIFAP, O2, alerte."],
"Prévention":["Jamais d’hyperventilation.","Un en bas, un en haut ; surveillance jusqu’à 30 secondes après la sortie."]}},
{id:"opi",name:"OPI",alt:"Œdème pulmonaire d’immersion",tags:["Froid + effort","Semi-assis"],s:{
"Mécanisme":["Immersion, froid et effort augmentent la pression dans les vaisseaux pulmonaires : du liquide passe dans les alvéoles.","Favorisé par l’âge, l’hypertension, une maladie cardiaque, une hydratation excessive, une combinaison serrée, le stress."],
"Signes":["Essoufflement inhabituel, toux, crachats mousseux parfois rosés.","Peut se confondre avec un essoufflement ou une surpression pulmonaire."],
"Conduite à tenir":["Fin de plongée, sortir, position semi-assise.","O2 15 L/min, alerte, évacuation."],
"Prévention":["Avis médical après un premier épisode, tension surveillée.","Éviter l’effort dans l’eau froide, ne pas boire de grandes quantités juste avant."]}},
{id:"faune-flore",name:"Faune et flore",alt:"Piqûres, brûlures, morsures",tags:["Allergie possible"],s:{
"Mécanisme":["Venins de poissons (vive, rascasse), méduses, coraux de feu, oursins."],
"Signes":["Douleur vive, rougeur, œdème local.","Malaise, réaction allergique pouvant aller au choc anaphylactique."],
"Conduite à tenir":["Vive, rascasse : venin sensible à la chaleur, eau très chaude (sans brûler) le plus tôt possible.","Méduse : rincer à l’eau de mer, ne pas frotter, retirer les filaments.","Signes généraux : alerte."],
"Prévention":["Ne rien toucher, bonne maîtrise de la flottabilité, connaître la faune locale."]}},
{id:"mal-de-mer",name:"Mal de mer",alt:"Cinétose",tags:["Déshydratation"],s:{
"Mécanisme":["Conflit entre les informations de l’oreille interne et celles de la vue."],
"Signes":["Nausées, vomissements, pâleur, sueurs, fatigue.","La déshydratation qui suit favorise l’ADD."],
"Conduite à tenir":["Regarder l’horizon, rester au grand air, s’équiper et se mettre à l’eau vite.","Vomir dans le détendeur en le gardant en bouche, s’hydrater ensuite.","Renoncer si la personne est très atteinte."],
"Prévention":["Repas léger, éviter les médicaments qui endorment (ils renforcent la narcose), avis médical."]}}]},
{id:"sec",name:"Secours et prévention",law:"RIFAP, Code du sport",col:"var(--sec)",items:[
{id:"rifap",name:"Conduite à tenir",alt:"Protocole RIFAP",tags:["Tout accident"],s:{
"Dans l’ordre":["Sortir la victime de l’eau, protéger, mettre la palanquée en sécurité.","Bilan : conscience, ventilation, circulation, signes neurologiques.","Oxygène : inhalateur 15 L/min avec masque haute concentration si elle respire, insufflateur relié à l’O2 sinon.","Alerter les secours.","Faire boire de l’eau plate, sans sucre : 1 litre sur la première heure, en petites quantités.","Ne pas faire boire si la victime est peu coopérative ou inconsciente, si elle a des nausées ou vomit, ou si on soupçonne une lésion du tube digestif.","Protéger du froid ou du soleil, rassurer, surveiller l’évolution.","Remplir la fiche d’évacuation, l’ordinateur suit la victime."]},
mf1:"Le moniteur doit savoir enchaîner ces gestes et les enseigner : c’est le cœur du RIFAP."},
{id:"alerte",name:"Alerter les secours",alt:"Numéros et message",tags:["CROSS VHF 16","196, 15, 112"],s:{
"Qui appeler":["En mer : CROSS par VHF canal 16, ou le 196 par téléphone.","À terre : 15 (SAMU) ou 112."],
"Message":["Qui appelle et d’où, position précise du bateau ou du site.","Nombre de victimes, âge, signes et heure d’apparition.","Profil de plongée : profondeur, durée, paliers, gaz.","Soins déjà entrepris. Ne pas raccrocher le premier."]}},
{id:"materiel",name:"Matériel de secours",alt:"À bord ou sur le site",tags:["Code du sport"],s:{
"À avoir sur place (article A322-78-1)":["Un plan de secours et un moyen de communication pour prévenir les secours (une VHF en mer, au départ d’une embarcation).","De l’eau douce potable.","Un ballon auto-remplisseur à valve unidirectionnelle (BAVU), avec sac de réserve d’oxygène et trois masques (grand, moyen, petit).","Un masque à haute concentration.","Un ensemble d’oxygénothérapie médicale normobare de capacité suffisante jusqu’à l’arrivée des secours, avec manodétendeur, débit-litre et tuyau de raccordement.","Une couverture isothermique et des fiches d’évacuation."],
"Le réflexe":["Vérifier avant chaque sortie : pression de la bouteille d’O2, masques, VHF chargée."]},
mf1:"Vérifie la liste exacte dans le Code du sport en vigueur, c’est un classique de l’épreuve de réglementation."},
{id:"role-moniteur",name:"Rôle du moniteur et du DP",alt:"Prévenir, surveiller, organiser",tags:["Avant, pendant, après"],s:{
"Avant":["Briefing : profil, signes, consignes en cas de séparation ou de problème.","Adapter la plongée au niveau, à la forme et aux conditions."],
"Pendant":["Surveiller les signes d’essoufflement, de froid, de narcose chez les élèves.","Contrôler la vitesse de remontée et les paliers."],
"Après":["Observer les plongeurs à la sortie, limiter les efforts.","En cas d’accident : le DP coordonne, répartit les rôles, gère les autres palanquées, compte les plongeurs, puis fait la déclaration."]}}]}
];
const all=[];C.forEach(c=>c.items.forEach(it=>{it.c=c;all.push(it)}));
const open=new Set(C.map(c=>c.id));
let cur='surpression-pulmonaire',q='',quiz=false;
const map=document.getElementById('map'),nodes=document.getElementById('nodes'),svg=document.getElementById('links'),panel=document.getElementById('panel');
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const hit=it=>!q||norm(it.name+' '+it.alt+' '+it.tags.join(' ')+' '+JSON.stringify(it.s)+' '+(it.mf1||'')).includes(q);
const poser=r=>r.querySelectorAll('[data-s]').forEach(e=>{e.style.cssText=e.dataset.s});
function tree(W){
  map.classList.remove('isList');
  const pad=4,rootW=Math.min(150,W*.19),catW=Math.min(200,W*.27),leafW=Math.min(250,W-rootW-catW-2*pad-60),gap=(W-2*pad-rootW-catW-leafW)/2;
  const rh=36,lh=30,ch=54,gb=18,xc=pad+rootW+gap,xl=xc+catW+gap;
  let y=0,h='',p='';const cats=[];
  C.forEach(c=>{const vis=open.has(c.id)?c.items:[];const bh=Math.max(vis.length*rh,ch);const cy=y+bh/2;cats.push(cy);
    h+=`<button class="node cat${c.items.some(hit)?'':' dim'}" data-cat="${c.id}" aria-expanded="${open.has(c.id)}" data-s="left:${xc}px;top:${cy-ch/2}px;width:${catW}px;height:${ch}px;background:${c.col}"><b>${esc(c.name)}</b><small>${esc(c.law)}</small><span class="n">${open.has(c.id)?'−':'+'+c.items.length}</span></button>`;
    vis.forEach((it,i)=>{const ly=y+(bh-vis.length*rh)/2+i*rh+rh/2;
      h+=`<button class="node leaf${it.id===cur?' on':''}${hit(it)?'':' dim'}" data-leaf="${it.id}" title="${esc(it.name+'\u00a0: '+it.alt)}" data-s="--c:${c.col};left:${xl}px;top:${ly-lh/2}px;width:${leafW}px;height:${lh}px"><i></i><span>${esc(it.name)}</span></button>`;
      p+=`<path d="M${xc+catW} ${cy}C${xc+catW+gap/2} ${cy} ${xl-gap/2} ${ly} ${xl} ${ly}" stroke="${c.col}" stroke-width="2" fill="none" opacity="${hit(it)?.85:.2}"/>`;});
    y+=bh+gb;});
  const H=y-gb,ry=H/2,rH=64;
  h=`<div class="node root" data-s="left:${pad}px;top:${ry-rH/2}px;width:${rootW}px;height:${rH}px">Accidents de plongée</div>`+h;
  C.forEach((c,i)=>{p=`<path d="M${pad+rootW} ${ry}C${pad+rootW+gap/2} ${ry} ${xc-gap/2} ${cats[i]} ${xc} ${cats[i]}" stroke="${c.col}" stroke-width="3" fill="none"/>`+p});
  map.style.height=H+'px';nodes.innerHTML=h;svg.innerHTML=p;poser(nodes);
}
function list(){
  map.classList.add('isList');svg.innerHTML='';
  nodes.innerHTML=C.map(c=>`<div class="grp" data-s="--c:${c.col}"><button data-cat="${c.id}" aria-expanded="${open.has(c.id)}"><span><b>${esc(c.name)}</b><small>${esc(c.law)}</small></span><span>${open.has(c.id)?'−':'+'+c.items.length}</span></button>${open.has(c.id)?`<div class="chips">${c.items.map(it=>`<button class="chip${it.id===cur?' on':''}${hit(it)?'':' dim'}" data-leaf="${it.id}">${esc(it.name)}</button>`).join('')}</div>`:''}</div>`).join('');
  poser(nodes);
}
function draw(){const W=map.clientWidth;W>=600?tree(W):list()}
function renderPanel(){
  const it=all.find(i=>i.id===cur),c=it.c,i=all.indexOf(it),pv=all[(i-1+all.length)%all.length],nx=all[(i+1)%all.length];
  const secs=Object.entries(it.s).map(([k,v])=>{const ul=`<ul>${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;return quiz?`<details class="sec"><summary>${esc(k)}</summary>${ul}</details>`:`<div class="sec"><h3>${esc(k)}</h3>${ul}</div>`}).join('');
  const tip=it.mf1?(quiz?`<details class="tip"><summary><b>Côté moniteur</b></summary><p>${esc(it.mf1)}</p></details>`:`<div class="tip"><b>Côté moniteur</b>${esc(it.mf1)}</div>`):'';
  panel.style.setProperty('--c',c.col);panel.style.setProperty('--c2',c.col);
  panel.innerHTML=`<div class="ph"><div class="fam">${esc(c.name)}, ${esc(c.law)}</div><h2>${esc(it.name)}</h2><div class="tags"><span>${esc(it.alt)}</span>${it.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div><div class="pb">${secs}${tip}</div><div class="nav"><button data-leaf="${pv.id}">← ${esc(pv.name)}</button><button data-leaf="${nx.id}">${esc(nx.name)} →</button></div>`;
}
function go(id,scroll){if(!all.some(i=>i.id===id))return;cur=id;open.add(all.find(i=>i.id===id).c.id);renderPanel();draw();if(scroll&&window.innerWidth<1000)panel.scrollIntoView({behavior:'smooth',block:'start'});try{history.replaceState(null,'','#'+id)}catch(e){}}
const onClick=e=>{const l=e.target.closest('[data-leaf]');if(l){go(l.dataset.leaf,e.currentTarget===nodes);return}const k=e.target.closest('[data-cat]');if(k){const id=k.dataset.cat;open.has(id)?open.delete(id):open.add(id);draw()}};
nodes.addEventListener('click',onClick);panel.addEventListener('click',onClick);
document.getElementById('q').addEventListener('input',e=>{q=norm(e.target.value.trim());if(q)C.forEach(c=>{if(c.items.some(hit))open.add(c.id)});draw()});
document.getElementById('openAll').addEventListener('click',()=>{C.forEach(c=>open.add(c.id));draw()});
document.getElementById('closeAll').addEventListener('click',()=>{open.clear();draw()});
document.getElementById('quiz').addEventListener('change',e=>{quiz=e.target.checked;renderPanel()});
window.addEventListener('hashchange',()=>go(location.hash.slice(1),false));
const h0=location.hash.slice(1);if(all.some(i=>i.id===h0))cur=h0;
renderPanel();draw();
const ro=new ResizeObserver(()=>draw());ro.observe(map);
}
