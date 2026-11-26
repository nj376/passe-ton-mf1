---
title: "Passe-ton-MF1 · Ressources"
description: "Fiches pour préparer le MF1, dans l'ordre du parcours : le MFT et le livret, concevoir un enseignement, évaluer, les trames de l'examen, organiser et sécuriser l'activité, comprendre et enseigner la théorie, le cadre réglementaire et fédéral."
classePrincipal: "principal--interieur principal--capa"
# Sections du sommaire, dans l’ordre du cheminement d’un stagiaire. Chaque fiche se range par son paramètre « groupe »
# (égal à « nom ») et, dans une section, par « weight ». Une fiche qui a « sousgroupe » s’affiche dans une sous-partie.
# ancre : identifiant de la section dans la page (liens depuis l’accueil ou les fiches).
# Une fiche peut porter « epreuves » (pratique, theorique, orga) : des étiquettes sur sa carte, pour les épreuves de pédagogie qu’elle prépare.
# cartes : cartes vers d’autres pages du site (titre, resume, url, epreuves), pour une section qui ne contient pas de fiche Ressources.
# sujets : true ajoute la carte « Sujets d’examen régionaux » (fenêtre des vrais sujets) à la fin de la section.
groupes:
  - nom: "Les bases : le MFT et ton parcours"
    ancre: "les-bases"
    intro: "Le point d’entrée : comprendre le MFT, savoir lire une compétence, et suivre ton stage en situation avec le livret pédagogique."
  - nom: "Concevoir un enseignement"
    ancre: "concevoir"
    intro: "Du général au précis : poser le sujet avec QQCOQP, situer la séance dans le cursus, construire la progression, choisir l’angle V.É.P., puis concevoir la séance elle-même."
  - nom: "Évaluer et faire progresser"
    ancre: "evaluer"
    intro: "L’évaluation est l’un des trois temps de l’acte d’enseignement. Cette fiche va au-delà des trames : remédier quand ça bloque, et certifier."
  - nom: "Les trames attendues à l’examen"
    ancre: "trames"
    intro: "En théorie, la trame est indicative. En pratique, le jury l’attend, et ne pas la suivre coûte des points."
    sujets: true
  - nom: "Organiser et sécuriser l’activité"
    ancre: "organiser"
    intro: "Le rôle de directeur de plongée que te donne le MF1, l’encadrement des baptêmes, et les documents à imprimer pour le jour J."
  - nom: "Comprendre et enseigner la théorie"
    ancre: "theorie"
    intro: "Des fiches théoriques complètes, une par branche des mindmaps du capacitaire : comprendre la notion, réussir l’écrit, et surtout savoir l’enseigner à tes élèves."
    souscartes:
      - titre: "Écrit 2 : aspects théoriques de l’activité"
        cartes:
          - titre: "Les fiches de l’écrit 2"
            resume: "Flottabilité, compressibilité des gaz, pressions partielles, optique, acoustique : comprendre la notion, réussir les calculs du capacitaire, et savoir l’enseigner, du N1 au GP-N4."
            url: "/theorie/#ecrit-2"
            epreuves: ["theorique"]
      - titre: "Écrit 3 : anatomie, physiologie, physiopathologie"
        cartes:
          - titre: "L’oreille et la plongée"
            resume: "Anatomie de l’oreille, audition et équilibre, barotraumatismes, vertige alternobarique, manœuvres d’équilibrage : comprendre les mécanismes, et apprendre à tes élèves à équilibrer tôt, souvent et sans forcer."
            url: "/theorie/oreille/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "Les barotraumatismes"
            resume: "Anatomie des poumons et des sinus, surpression pulmonaire, sinus, dents et masque : comprendre pourquoi chaque poche d’air se blesse, et apprendre à tes élèves à ne jamais bloquer leur respiration en remontant."
            url: "/theorie/barotraumatismes/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "Ventilation et essoufflement"
            resume: "Mécanique et commande de la respiration, volumes et espace mort, échanges gazeux, ventilation en immersion, cercle vicieux du CO2 : comprendre l’essoufflement, faire les calculs, et apprendre à tes élèves à le casser."
            url: "/theorie/ventilation-essoufflement/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "L’œdème pulmonaire d’immersion"
            resume: "Les deux circulations, le sang qui reflue vers le thorax, les facteurs qui s’additionnent, l’essoufflement qui ne passe pas : comprendre l’OPI, le distinguer des autres accidents et réussir l’étude de cas."
            url: "/theorie/oedeme-pulmonaire-immersion/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "Les accidents de l’apnée"
            resume: "Syncope hypoxique, piège de l’hyperventilation et de la remontée, samba, règles de sécurité : comprendre pourquoi la syncope frappe sans prévenir, et faire de « un en bas, un en haut » un réflexe pour tes élèves."
            url: "/theorie/apnee/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "Les incidents liés au froid"
            resume: "Les trois fuites de chaleur, les défenses du corps, l’hypothermie qui s’installe sans bruit, la syncope thermo-différentielle : comprendre le froid et organiser tes plongées en conséquence, en guide comme en directeur de plongée."
            url: "/theorie/froid/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "La déshydratation"
            resume: "Diurèse d’immersion, diurèse liée au froid, air sec du bloc, soleil, mal de mer : comprendre par où le plongeur perd son eau, le lien avec l’accident de désaturation, et faire boire ta palanquée comme un vrai guide."
            url: "/theorie/deshydratation/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "L’entraînement physique"
            resume: "Filières énergétiques, cœur et poumons à l’effort, zones de fréquence cardiaque, endurance, récupération : comprendre comment on progresse, et savoir planifier la préparation d’un futur GP jusqu’aux épreuves physiques."
            url: "/theorie/entrainement-physique/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
      - titre: "Écrit 4 : désaturation"
        cartes:
          - titre: "Le modèle de Haldane et ses dérivés"
            resume: "Compartiments et périodes, Sc, M-values et facteurs de gradient, tables MN90, Bühlmann, RGBM, plongées successives : comprendre ce que calculent tables et ordinateurs, et savoir l’expliquer à tes élèves."
            url: "/theorie/modele-haldane/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "Le modèle DCIEM"
            resume: "Des compartiments en série plutôt qu’en parallèle, une désaturation retardée, des successives gérées par le modèle : comprendre les différences avec Haldane, et s’en servir pour enseigner la cohabitation des moyens de désaturation."
            url: "/theorie/modele-dciem/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "Formation et croissance des bulles"
            resume: "Micronoyaux, bulles circulantes et filtre pulmonaire, index Prt, remontées rapides et yoyo, acclimatation, procédures de rattrapage de la CTN : comprendre d’où viennent les bulles et les règles qui en découlent, et savoir l’expliquer à tes élèves."
            url: "/theorie/bulles-desaturation/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
          - titre: "Les accidents de désaturation"
            resume: "Mécanismes et formes, cœur et FOP, shunts pulmonaires, prévention, prise en charge selon le RIFAP et trois études de cas : reconnaître un ADD, raisonner sur un cas, et savoir l’expliquer à tes élèves."
            url: "/theorie/accidents-desaturation/"
            epreuves: ["theorique"]
            lien: "Lire la fiche →"
  - nom: "Le cadre : droit et institutions"
    ancre: "le-cadre"
    intro: "Ta responsabilité d’encadrant, le club comme établissement d’APS, et l’organisation de la fédération."
---
