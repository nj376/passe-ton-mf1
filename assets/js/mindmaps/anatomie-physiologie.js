/* Données de la mindmap « anatomie-physiologie » (page /capacitaire/anatomie-physiologie/), reprises du fichier d’origine mindmaps-mf1/anatomie-physiologie.html (version du 24/11/2026).
   Seule la typographie a été adaptée (apostrophes, espaces insécables). */
const PAGE={
title:"Anatomie, physiologie, physiopathologie",
root:"Anatomie et physiologie",
sub:"Écrit 3 du module capacitaire MF1, la matière au plus fort coefficient. Pour chaque thème : l’anatomie utile, le mécanisme, les signes, la conduite à tenir et la prévention.",
meta:["Écrit 3","Coefficient 4","45 minutes","8 rubriques"],
search:"Rechercher : trompe, ADH, VO2max, samba…",
start:"anatomie-oreille",
cats:[
{id:"oreille",name:"Oreille et plongée",law:"Audition, équilibre",items:[
{id:"anatomie-oreille",name:"Anatomie de l’oreille",alt:"Externe, moyenne, interne",tags:["Trompe d’Eustache"],s:{
"Oreille externe":["Pavillon et conduit auditif, fermé par le tympan."],
"Oreille moyenne":["Caisse du tympan remplie d’air, chaîne des osselets (marteau, enclume, étrier).","Reliée au rhinopharynx par la trompe d’Eustache, qui permet l’équilibrage."],
"Oreille interne":["Cochlée : audition.","Vestibule et canaux semi-circulaires : équilibre.","Communique avec l’oreille moyenne par les fenêtres ovale (étrier) et ronde."]}},
{id:"audition-equilibre",name:"Audition et équilibre",alt:"Rôle de chaque partie",tags:["Conduction osseuse"],s:{
"Audition":["Le son fait vibrer le tympan, les osselets le transmettent à la cochlée qui le transforme en influx nerveux.","Sous l’eau, la conduction osseuse domine : on entend moins bien et on ne localise plus."],
"Équilibre":["Le vestibule renseigne sur la position de la tête et les accélérations ; les canaux semi-circulaires sur les rotations.","Il travaille avec la vue et les capteurs du corps : sous l’eau, la vue et l’appui manquent."]}},
{id:"baro-oreille",name:"Barotraumatismes de l’oreille",alt:"Externe, moyenne, interne",tags:["Descente surtout"],s:{
"Mécanismes":["Moyenne : trompe fermée, le volume d’air diminue à la descente et le tympan est aspiré (Mariotte).","Interne : Valsalva forcé ou tardif, rupture de fenêtre, fistule périlymphatique.","Externe : cagoule trop serrée ou bouchon de cérumen qui piègent de l’air."],
"Signes":["Douleur, oreille bouchée, otorragie si perforation.","Interne : vertiges, nausées, acouphènes, surdité brutale."],
"Conduite à tenir":["Stopper la descente, remonter un peu, rééquilibrer doucement, sinon fin de plongée.","Signes d’oreille interne : traiter comme un ADD (O2, alerte), avis ORL urgent."],
"Prévention":["Équilibrer tôt et sans forcer, ne pas plonger enrhumé, éviter les vasoconstricteurs."]}},
{id:"vertige-alternobarique",name:"Vertige alternobarique",alt:"Équilibrage asymétrique",tags:["Remontée"],s:{
"Mécanisme":["Les deux oreilles s’équilibrent de façon inégale, souvent à la remontée : le cerveau reçoit des informations différentes."],
"Signes et conduite":["Vertige bref en remontée, parfois nausées.","S’arrêter, se tenir à un repère, attendre la fin du vertige, puis remonter lentement."]}},
{id:"manoeuvres",name:"Manœuvres d’équilibrage",alt:"Valsalva, BTV, Frenzel, Toynbee",tags:["Sans forcer"],s:{
"Les techniques":["Valsalva : expirer nez pincé, la plus connue mais la plus agressive si on force.","BTV (béance tubaire volontaire) : ouvrir les trompes par contraction musculaire, sans pression.","Frenzel : pousser l’air avec la langue, glotte fermée.","Toynbee : déglutir nez pincé."]},
tip:"Savoir expliquer pourquoi un Valsalva forcé peut léser l’oreille interne est un grand classique."}]},
{id:"baro",name:"Barotraumatismes",law:"Poumons, sinus, dents, masque",items:[
{id:"anatomie-poumon",name:"Anatomie des poumons",alt:"Voies aériennes et alvéoles",tags:["~300 millions d’alvéoles"],s:{
"Structure":["Trachée, bronches, bronchioles, puis alvéoles au contact des capillaires.","Surface d’échange de l’ordre de 70 à 100 m².","Les poumons sont enveloppés par la plèvre, qui les solidarise à la cage thoracique."]}},
{id:"surpression",name:"Surpression pulmonaire",alt:"Barotraumatisme pulmonaire",tags:["Remontée","Caisson"],s:{
"Mécanisme":["À la remontée, l’air pulmonaire se dilate ; si l’expiration est bloquée, les alvéoles se distendent et se déchirent.","L’air gagne la plèvre, le médiastin, la peau ou les artères (embolie gazeuse)."],
"Signes":["Douleur thoracique, toux, crachats sanglants mousseux, gêne respiratoire.","Emphysème sous-cutané, voix modifiée, pneumothorax.","Embolie : troubles neurologiques, perte de connaissance."],
"Conduite à tenir":["O2 15 L/min, position adaptée, alerte, évacuation vers un caisson, jamais de réimmersion."],
"Prévention":["Expirer pendant toute la remontée, vitesse maîtrisée, encadrement rigoureux des exercices de remontée."]}},
{id:"anatomie-sinus",name:"Anatomie des sinus",alt:"Cavités de la face",tags:["Ostium"],s:{
"Structure":["Sinus frontaux, maxillaires, ethmoïdaux et sphénoïdaux : cavités osseuses aériques.","Ils communiquent avec les fosses nasales par de fins canaux (ostiums)."]}},
{id:"baro-sinus",name:"Barotraumatisme des sinus",alt:"Blocage à la descente ou à la remontée",tags:["Rhume"],s:{
"Mécanisme":["Ostium bouché (rhume, sinusite, polype) : dépression à la descente, surpression à la remontée."],
"Signes":["Douleur frontale ou maxillaire, saignement de nez."],
"Conduite et prévention":["Stopper, remonter un peu, fin de plongée si persistant, avis ORL.","Ne pas plonger enrhumé."]}},
{id:"baro-dents-masque",name:"Dents et masque",alt:"Barodontalgie, placage",tags:["Bénins"],s:{
"Dents":["Air piégé sous une carie ou un soin : douleur, plombage descellé.","Prévention : soins dentaires à jour."],
"Placage de masque":["Le masque fait ventouse à la descente si on n’y souffle pas.","Yeux rouges, pétéchies ; prévention : expirer par le nez."]}}]},
{id:"essoufflement",name:"Essoufflement",law:"Ventilation, échanges gazeux",items:[
{id:"appareil-ventilatoire",name:"Appareil ventilatoire",alt:"Voies aériennes et muscles",tags:["Diaphragme"],s:{
"Composants":["Voies aériennes supérieures (nez, bouche, pharynx, larynx) et inférieures (trachée, bronches).","Poumons et plèvre.","Muscles : diaphragme surtout, intercostaux, muscles accessoires à l’effort."]}},
{id:"mecanique-ventilatoire",name:"Mécanique respiratoire",alt:"Inspiration, expiration, commande",tags:["Chémorécepteurs"],s:{
"Mouvements":["Inspiration active : le diaphragme s’abaisse, le thorax s’agrandit, l’air entre.","Expiration passive au repos, active à l’effort."],
"Commande":["Centres respiratoires du tronc cérébral.","Les chémorécepteurs réagissent surtout à la hausse du CO2 : c’est lui qui déclenche l’envie de respirer."]}},
{id:"volumes",name:"Volumes pulmonaires",alt:"Valeurs moyennes d’un adulte",tags:["Espace mort"],s:{
"Valeurs":["Volume courant : environ 0,5 L.","Volume de réserve inspiratoire : 2,5 à 3 L ; expiratoire : 1 à 1,5 L.","Volume résiduel : environ 1,2 L, il reste toujours dans les poumons.","Capacité vitale : 4 à 5 L ; capacité pulmonaire totale : environ 6 L."],
"Espace mort":["Air qui ne participe pas aux échanges : environ 150 mL dans les voies aériennes, augmenté par le tuba ou le détendeur.","D’où l’intérêt d’une ventilation lente et ample."]}},
{id:"echanges-gazeux",name:"Échanges gazeux",alt:"O2, CO2, CO",tags:["Diffusion"],s:{
"Au niveau des alvéoles":["Les gaz diffusent selon les différences de pression partielle entre alvéole et sang."],
"Transport":["O2 : fixé surtout sur l’hémoglobine des globules rouges.","CO2 : transporté surtout sous forme de bicarbonates, puis rejeté par les poumons.","CO : se fixe sur l’hémoglobine environ 200 à 250 fois plus que l’O2 et bloque le transport d’oxygène."]},
tip:"Les valeurs de pressions partielles des gaz du sang ne sont pas exigibles."},
{id:"ventilation-immersion",name:"Ventilation en immersion",alt:"Ce qui change sous l’eau",tags:["Air plus dense"],s:{
"Modifications":["Air plus dense en profondeur : résistance accrue dans les voies aériennes et le détendeur.","Pression hydrostatique sur le thorax et le détendeur : travail ventilatoire modifié.","Espace mort augmenté par le matériel."],
"Adaptation":["Ventiler lentement et profondément, en insistant sur l’expiration."]}},
{id:"retention-co2",name:"Rétention de CO2",alt:"Le cercle vicieux de l’essoufflement",tags:["Cause, CAT, prévention"],s:{
"Mécanisme":["Effort, froid, stress, matériel inadapté : ventilation rapide et superficielle, le CO2 s’accumule.","Le CO2 accélère la respiration, qui devient encore moins efficace : cercle vicieux."],
"Signes":["Respiration rapide, sensation de manque d’air, angoisse, panique ; céphalées après la plongée."],
"Conduite à tenir":["Stopper l’effort, tenir le plongeur, le faire expirer à fond, remonter de quelques mètres, fin de plongée."],
"Prévention":["Lestage juste, matériel entretenu, palmage souple, anticipation du courant et du froid."]}}]},
{id:"opi",name:"Œdème pulmonaire d’immersion",law:"OPI, étude de cas",items:[
{id:"opi-causes",name:"Causes et mécanisme",alt:"Pourquoi l’eau passe dans les alvéoles",tags:["Retour veineux"],s:{
"Mécanisme":["L’immersion et le froid chassent le sang de la périphérie vers le thorax.","La pression augmente dans les capillaires pulmonaires ; l’effort et la respiration contre résistance l’aggravent.","Du liquide passe des capillaires vers les alvéoles : les échanges gazeux s’effondrent."]}},
{id:"opi-facteurs",name:"Facteurs favorisants",alt:"Qui est exposé",tags:["Froid + effort"],s:{
"Liste":["Eau froide, effort intense, stress.","Âge, hypertension artérielle, maladie cardiaque.","Hydratation excessive juste avant la plongée.","Combinaison trop serrée, détendeur dur, surlestage.","Antécédent d’OPI : risque de récidive."]}},
{id:"opi-signes-cat",name:"Signes et conduite à tenir",alt:"Reconnaître et agir",tags:["Semi-assis"],s:{
"Signes":["Essoufflement inhabituel, toux, crachats mousseux parfois rosés.","Peut se confondre avec un essoufflement ou une surpression pulmonaire."],
"Conduite à tenir":["Fin de plongée, sortir de l’eau, position assise ou semi-assise, ne pas allonger contre son gré.","O2 15 L/min, alerte, évacuation."]}},
{id:"opi-cas",name:"Exemple d’étude de cas",alt:"S’entraîner à raisonner",tags:["Diagnostic différentiel"],s:{
"Énoncé type":["Plongeuse de 58 ans, hypertendue, eau à 14 °C, palmage contre le courant. À la remontée, elle tousse et crache mousseux."],
"Raisonnement attendu":["Hypothèse : OPI (froid, effort, âge, HTA), à différencier d’une surpression pulmonaire.","Conduite : sortie, position semi-assise, O2, alerte.","Prévention : avis médical, éviter l’effort au froid, protection thermique."]}}]},
{id:"apnee",name:"Accidents de l’apnée",law:"Syncope, samba, étude de cas",items:[
{id:"syncope-hypoxique",name:"Syncope hypoxique",alt:"Rendez-vous syncopal",tags:["Hyperventilation"],s:{
"Mécanisme":["L’hyperventilation abaisse le CO2 et retarde l’envie de respirer, sans augmenter les réserves d’O2.","À la remontée, la pression ambiante chute et avec elle la PpO2 : perte de connaissance près de la surface."],
"Signes":["Souvent aucun signe avant-coureur ; perte de connaissance en fin de remontée ou en surface."],
"Conduite à tenir":["Voies aériennes hors de l’eau, retirer le masque, stimuler.","Pas de reprise : insufflations, RCP si besoin, O2, alerte."]}},
{id:"samba",name:"Perte de contrôle moteur",alt:"La samba",tags:["Avant la syncope"],s:{
"Signes":["Tremblements, mouvements désordonnés, regard vague juste après la sortie de l’eau."],
"Conduite":["Maintenir les voies aériennes hors de l’eau, parler, rassurer, surveiller : la syncope peut suivre."]}},
{id:"prevention-apnee",name:"Prévention",alt:"Règles d’or",tags:["Un en bas, un en haut"],s:{
"Règles":["Jamais d’hyperventilation.","Toujours un binôme qui surveille depuis la surface pendant toute l’apnée et environ 30 s après la sortie.","Récupération suffisante entre deux apnées, pas d’apnée après une plongée en scaphandre (risque d’ADD)."]},
tip:"Étude de cas fréquente : un plongeur qui fait des apnées en attendant le bateau après sa plongée bouteille."}]},
{id:"froid",name:"Incidents liés au froid",law:"Thermorégulation",items:[
{id:"pertes-caloriques",name:"Pertes caloriques",alt:"Comment on se refroidit",tags:["Eau : ×25"],s:{
"Modes":["Conduction : l’eau évacue la chaleur environ 25 fois plus vite que l’air.","Convection : l’eau qui circule dans la combinaison se renouvelle.","Respiration : l’air détendu est froid et sec, il faut le réchauffer et l’humidifier.","Rayonnement et évaporation, plus faibles sous l’eau."]}},
{id:"thermoregulation",name:"Réponses du corps",alt:"Thermorégulation",tags:["Vasoconstriction"],s:{
"Mécanismes":["Vasoconstriction périphérique : le sang se concentre au centre du corps.","Frissons : production de chaleur par les muscles.","Diurèse accrue : on urine plus, d’où la déshydratation."]}},
{id:"hypothermie",name:"Signes et conduite à tenir",alt:"De la gêne à l’hypothermie",tags:["Frissons, confusion"],s:{
"Signes":["Frissons, crampes, lèvres bleues, gestes maladroits.","Puis confusion, somnolence, arrêt des frissons quand l’hypothermie s’aggrave."],
"Conduite à tenir":["Fin de plongée, sortir, sécher, vêtements secs, couverture isothermique, abri.","Boisson chaude et sucrée si la personne est consciente, ni alcool ni frictions.","Le froid favorise essoufflement, narcose et ADD : surveiller."]}},
{id:"syncope-thermo",name:"Syncope thermo-différentielle",alt:"L’hydrocution",tags:["Choc thermique"],s:{
"Mécanisme":["Entrée brutale dans une eau froide, surtout après soleil, repas copieux ou effort : réaction réflexe cardio-vasculaire.","Perte de connaissance immédiate, risque de noyade."],
"Prévention":["Entrer progressivement, se mouiller nuque et visage, éviter de s’équiper longtemps au soleil."]}},
{id:"froid-cas",name:"Exemple d’étude de cas",alt:"S’entraîner à raisonner",tags:["Élève fin"],s:{
"Énoncé type":["Élève mince en combinaison de 5 mm, eau à 13 °C, troisième exercice au fond ; il tremble et rate ses gestes."],
"Raisonnement attendu":["Signes de refroidissement qui altèrent la sécurité et l’apprentissage.","Interrompre la séance, réchauffer, adapter l’équipement et la durée la prochaine fois."]}}]},
{id:"deshydratation",name:"Déshydratation",law:"Diurèse, prévention",items:[
{id:"diurese-immersion",name:"Diurèse d’immersion",alt:"Pourquoi on urine sous l’eau",tags:["ADH"],s:{
"Mécanisme":["L’immersion ramène du sang vers le thorax ; le corps croit à un excès de volume sanguin.","La sécrétion d’hormone antidiurétique (ADH) baisse : les reins produisent plus d’urine."]}},
{id:"diurese-froid",name:"Diurèse liée au froid",alt:"Même effet, autre cause",tags:["Vasoconstriction"],s:{
"Mécanisme":["La vasoconstriction due au froid augmente aussi le volume sanguin central et donc la diurèse."]}},
{id:"autres-causes",name:"Autres causes",alt:"Ce qui assèche le plongeur",tags:["Air sec"],s:{
"Liste":["Air du bloc très sec à réchauffer et humidifier.","Transpiration dans la combinaison, au soleil, à l’effort.","Mal de mer et vomissements, alcool, café."]}},
{id:"deshydratation-consequences",name:"Conséquences et rôle du GP",alt:"Prévenir sur le bateau",tags:["Favorise l’ADD"],s:{
"Conséquences":["Sang plus visqueux, élimination de l’azote moins efficace : risque d’ADD accru.","Fatigue, crampes, maux de tête."],
"Conduite à tenir du GP":["Faire boire de l’eau avant et après la plongée, par petites quantités.","Repérer les signes (soif, urines foncées, céphalées) et les signaler au DP.","En cas de signe suspect après plongée, penser ADD et appliquer le protocole RIFAP."]},
tip:"Étude de cas classique : troisième plongée de la journée, en été, plongeur qui n’a bu que du café."}]},
{id:"entrainement",name:"Entraînement physique",law:"Préparation des plongeurs",items:[
{id:"filieres",name:"Filières énergétiques",alt:"D’où vient l’énergie",tags:["ATP"],s:{
"Trois filières":["Anaérobie alactique (ATP et phosphocréatine) : effort très intense, moins de 10 à 15 s.","Anaérobie lactique : effort intense de 15 s à 1 ou 2 min, production de lactates.","Aérobie : effort prolongé au-delà de 2 à 3 min, utilise l’oxygène, c’est la filière de l’endurance."],
"En plongée":["Palmage long : surtout aérobie. Sprint vers un plongeur en difficulté ou apnée : anaérobie."]}},
{id:"adaptation-effort",name:"Adaptation à l’effort",alt:"Cœur et poumons",tags:["Débit cardiaque"],s:{
"Cœur":["Débit cardiaque = fréquence cardiaque × volume d’éjection systolique ; les deux augmentent à l’effort.","L’entraînement augmente le volume d’éjection et abaisse la FC de repos."],
"Respiration":["Le débit ventilatoire augmente, la VO2max (consommation maximale d’O2) progresse avec l’entraînement."]}},
{id:"frequences",name:"Fréquences cardiaques",alt:"Piloter l’intensité",tags:["220 − âge"],s:{
"Repères":["FC max estimée ≈ 220 − âge (estimation grossière).","FC de réserve = FC max − FC de repos (méthode de Karvonen).","Endurance fondamentale : environ 60 à 70 % de FC max ; travail au seuil vers 80 à 90 %."]}},
{id:"endurance-intensite",name:"Endurance et intensité",alt:"Principes d’entraînement",tags:["Surcompensation"],s:{
"Principes":["Progressivité, régularité, spécificité (nager avec palmes pour progresser en plongée).","Alterner endurance fondamentale et fractionné.","Surcompensation : la progression se fait pendant la récupération qui suit la charge."]}},
{id:"recuperation",name:"Récupération",alt:"Partie de l’entraînement",tags:["Sommeil"],s:{
"Leviers":["Récupération active (effort léger), sommeil, hydratation, alimentation.","Éviter l’effort violent juste après une plongée."]}},
{id:"planification",name:"Planifier une préparation",alt:"Niveaux et épreuves GP-N4",tags:["Cycles"],s:{
"Méthode":["Évaluer le niveau de départ du plongeur et la date de l’examen.","Construire des cycles : développement de l’endurance, puis travail spécifique et intensité, puis affûtage.","Adapter aux épreuves visées (nage avec et sans matériel, apnée, sauvetage)."]},
tip:"Pour les barèmes et le détail des épreuves physiques du GP-N4, reprends le MFT à jour."}]}
],
foot:{title:"Les fils rouges de l’écrit 3",cards:[
{t:"Mécanisme d’abord",p:"Chaque réponse se construit dans l’ordre : anatomie, mécanisme, signes, conduite à tenir, prévention."},
{t:"Études de cas",p:"OPI, apnée, froid, déshydratation : on attend un raisonnement, des hypothèses et des décisions justifiées."},
{t:"Coefficient 4",p:"C’est l’écrit qui pèse le plus dans la moyenne des trois matières hors réglementation."}]},
note:"Support de révision construit à partir du programme publié sur passe-ton-mf1.com. Les valeurs physiologiques sont des moyennes d’adulte, arrondies : vérifie celles de ton support de formation."
};
