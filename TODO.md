# À faire pour finaliser passe-ton-mf1.com

Liste des chantiers restants. Les améliorations d’ergonomie sont détaillées à part, dans `ROADMAP-UX.md`.
Rien ici ne se lance sans l’accord explicite de Philippe.

---

## 1. Module Capacitaire (en pause)

**État actuel** (v.1.152) : la page présente le programme des quatre écrits, tiré du MFT, avec une auto-évaluation par rubrique. Elle porte le badge « En construction ».

**En attente de Philippe** : des ressources fiables pour compléter le contenu, surtout en **anatomie et physiologie** et en **désaturation**, sans oublier la théorie et le cadre réglementaire si besoin.

Quand ces ressources seront là :

- [ ] Compléter les fiches des rubriques avec ce contenu (`data/capacitaire.yaml`), en citant les sources.
- [ ] Ajouter un niveau « Capacitaire » à la Flashcard MFT (l’ancienne « étape 3 »), avec une carte par rubrique. Points à trancher d’abord :
  - un seul niveau, ou un choix par écrit ;
  - découper ou non les rubriques trop longues ;
  - un lien « Voir la fiche » au verso ;
  - distinguer ou non ces cartes dans Suivi.
- [ ] Retirer le badge « En construction » et mettre à jour l’Aide.

## 2. Page Canvas

- [x] Page Canvas développée d’après les maquettes `_passation/canvas/` (21/11/2026).
- [x] Déroulé et fonctionnement validés par Philippe (22/11/2026).
- [x] Étiquette au-dessus du titre réduite à « ESSAI EXPÉRIMENTAL » (22/11/2026).
- [ ] 47 cartes théoriques ne citent aucune compétence (« Transversal » ou note seule) : leurs liens ne sont pas vérifiés. À compléter dans les planches si besoin.

## 3. Petits restes techniques

- [x] Supprimer le CSS qui ne sert plus (`carte-memoire`, `cartes-barre`, `reviser__*`) : fait en v.1.154.
- [ ] Assombrir la bordure du menu « Niveau » de la Flashcard : `#C9D3DD` est sous le contraste 3:1 du site.

## 4. Ménage

- [x] Tri de `Passe-ton-mf1/` (21/11/2026) : zip Mindmaps, anciennes captures Flashcard et `maquette/canvas.json` supprimés. On garde `_passation/donnees/memo_mft.html`, `base_mft.xlsx` et `ROADMAP-UX.md`.
- [x] `Passe-ton-mf1_maj_canvas.zip` supprimé après validation du Canvas (22/11/2026).

## 5. Propositions restées sans réponse

- [ ] Un grand bandeau jaune « En construction » en tête de la page Capacitaire, en plus du badge.
- [ ] Un titre visible dans l’avis « version mobile ».
