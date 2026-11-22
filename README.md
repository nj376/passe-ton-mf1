# passe-ton-mf1.com

Le code et les contenus du site **[passe-ton-mf1.com](https://passe-ton-mf1.com)** : un pense-bête gratuit, conçu par un stagiaire MF1 pour les autres stagiaires, pour comprendre le MFT de la FFESSM et préparer l'examen.

Site indépendant, **non affilié à la FFESSM** : seul le MFT officiel fait foi.

> Ce dépôt est une **copie publique**, mise à jour automatiquement depuis le dépôt de travail. Les propositions (issues, pull requests) sont les bienvenues ; elles sont reportées à la main dans le dépôt de travail, puis reviennent ici à la synchronisation suivante.

## Pourquoi ce site

Tout est parti d'une phrase lâchée un jour, peut-être sous narcose, peut-être au bar du club : « Tiens, et si je passais mon MF1 ? »

Sur le papier, rien de plus logique. On aime la plongée, on a un peu de bouteille, on a envie de transmettre. Dans les faits, j'ai découvert qu'entre savoir plonger et apprendre aux autres à plonger s'étend un univers parallèle : pédagogie organisationnelle, pédagogie pratique, objectifs opérationnels, critères de réalisation, et un stock d'acronymes plus profond que la fosse des Mariannes. J'ai aussi appris qu'une séance de vingt minutes peut réclamer trois heures de préparation, quatre cafés et une petite crise existentielle, et qu'une question posée avec le sourire par un MF2 suffit à défaire une soirée entière de travail.

Reste le MFT, fidèle compagnon de mes soirées, dont je découvre chaque jour une nouvelle subtilité. Ayant étudié la physique quantique, je pensais savoir ce qu'est l'incertitude. C'était avant de comprendre qu'une fiche pédagogique peut être à la fois juste et à refaire, tant qu'aucun MF2 ne l'a regardée. Schrödinger aurait adoré.

Arrive alors l'inévitable « mais qu'est-ce que je suis allé faire dans cette galère ? ». Plutôt que d'aller voir un psy, j'ai préféré fabriquer quelque chose d'utile. Passe-ton-MF1 est d'abord mon outil de survie, puis un coup de main pour celles et ceux qui se lancent dans l'aventure sans avoir lu les petites lignes du contrat, imprimées en corps 4, par 40 mètres de fond, sans lampe. L'idée est simple : rassembler des ressources, des outils et quelques bouées pédagogiques pour rendre la préparation un peu moins mystérieuse.

Ce site ne remplace évidemment ni le MFT officiel ni les conseils des MF2. C'est un complément, né de mes propres questions, qui grandit au rythme de ma formation. Il est encore en version très alpha : développé sur un temps libre dont je ne dispose pas, il a des coins en chantier, d'autres à polir, et sans doute quelques bugs qui ont obtenu leur qualification avant moi.

Le MF1 reste une aventure individuelle, mais rien n'oblige à galérer chacun dans son coin. Remarques, corrections et idées sont les bienvenues (adresse de contact dans le pied de page du site), même formulées avec la douceur d'un débriefing de jury. Et pour signaler un bug, inutile de me le présenter en trois parties avec objectif, déroulement et évaluation : un simple signe « ça va pas » suffira.

*Philippe*

## Ce que fait le site

| Rubrique | Contenu |
| --- | --- |
| **Capacitaire** | Le module à réussir avant les épreuves : conditions, programme des quatre écrits, autoévaluation par rubrique. |
| **S'entraîner** | Tirage d'un thème, chrono de 30 minutes, grilles du livret pédagogique, comparaison avec le MFT ; page **IPD à 25 m**. |
| **MFT** | Chaque compétence placée sur la courbe de plongée ; **Flashcard MFT** et **Mindmaps**. |
| **CdS** | Les règles du Code du sport utiles à l'organisation d'une plongée. |
| **Construire** | Prérogatives et progressions types, prolongées par **Construire ma progression détaillée** ou dans le **Canvas**, un tableau blanc pour imaginer un projet de cours comme un storyboard, avec les cartes du MFT (export PNG et PDF). |
| **Mon suivi** | Avancement, date d'examen, sauvegarde et restauration des données. |

Aucun compte, aucune base de données : les données de chaque visiteur restent dans son navigateur.

## Lancer le site sur son ordinateur

Il faut [Hugo](https://gohugo.io/) **version 0.166** (édition « extended »).

```bash
hugo server
```

Puis ouvrir <http://localhost:1313/>.

## Organisation

| Dossier | Contenu |
| --- | --- |
| `layouts/` | Gabarits Hugo des pages |
| `assets/css/`, `assets/js/` | Styles et scripts (sans bibliothèque externe) |
| `content/` | Pages et textes |
| `data/` | Données : niveaux, compétences, progressions, jeux de cartes du Canvas, prérogatives… |
| `static/` | Polices, images, cartes mentales exportées, jeux de cartes du Canvas |
| `outils/` | Scripts de génération (voir ci-dessous) |

Les scripts `outils/canvas.py` et `outils/mindmaps.py` produisent les jeux de cartes et les cartes mentales à partir des fichiers d'une bibliothèque pédagogique qui **n'est pas incluse dans ce dépôt**. Leurs résultats (`data/`, `static/canvas/`, `static/mindmaps/`) le sont : le site se construit sans eux.

## Licences

- **Code** (gabarits, scripts, styles, configuration) : licence **MIT**, voir [`LICENSE`](LICENSE).
- **Contenus pédagogiques** (textes, données, cartes, cartes mentales, images) : licence **Creative Commons BY-NC 4.0**, voir [`LICENCE-CONTENUS.md`](LICENCE-CONTENUS.md).
- Les extraits du **MFT** restent la propriété de la **FFESSM**. Les polices **IBM Plex** sont sous licence SIL Open Font License (`static/fonts/OFL.txt`).
