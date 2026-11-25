# Modèles à télécharger

Sources des documents de la rubrique « À télécharger » des Ressources : plans de secours (bord, mer), fiche d’évacuation (modèle type de l’annexe III-19 du Code du sport) et fiche de sécurité.

- `*.html` : un modèle par document, mis en page pour l’A4 (`modeles.css`, polices du site).
- `generer-pdf.mjs` : imprime chaque modèle en PDF avec Google Chrome sans interface, dans `static/telechargements/`.

## Régénérer après une modification

Depuis `Passe-ton-mf1/` :

```sh
node outils/telechargements/generer-pdf.mjs
```

Puis refaire l’aperçu de la première page (`static/telechargements/apercu-<nom>.jpg`, 900 px de large), par exemple sous macOS avec Aperçu, ou en convertissant la première page du PDF en JPEG.

## Ce que suivent les modèles

- Plans de secours : Code du sport, articles A322-72, A322-78-1 et A322-78-2 ; conduite à tenir d’après le MFT RIFAP, version mai 2026 (eau plate sans sucre, pas d’aspirine conseillée).
- Fiche d’évacuation : toutes les rubriques de l’annexe III-19, sans en retirer.
- Fiche de sécurité : article A322-72 (noms, aptitudes, fonctions, paramètres prévus et réalisés).

Mettre à jour la mention « version » en pied de page à chaque changement.
