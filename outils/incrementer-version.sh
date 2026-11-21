#!/usr/bin/env bash
# Crochet git « pre-commit » : augmente Passe-ton-mf1/VERSION d'un cran quand le commit modifie le site.
#   - format à trois nombres (depuis 1.2.01) : le dernier augmente de 1 (1.2.01 → 1.2.02 … 1.2.99 → 1.3.00) ;
#   - ancien format à deux nombres : + 0.001 (1.000 → 1.001…).
#
# Ne fait rien si :
#   - le commit ne touche pas le site (seuls README.md, ROADMAP-UX.md, _passation/ ou hors de Passe-ton-mf1/) ;
#   - VERSION est déjà modifié (par Philippe, pour imposer un numéro) : sa valeur est gardée telle quelle.
#
# Installation (une fois par clone du dépôt), depuis la racine de mf1-docs :
#   printf '#!/bin/sh\nexec bash Passe-ton-mf1/outils/incrementer-version.sh\n' > .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit
racine=$(git rev-parse --show-toplevel)
fichier="Passe-ton-mf1/VERSION"
indexes=$(git diff --cached --name-only)
base=$(tr -d '[:space:]' < "$racine/$fichier")
dernier=$(git show "HEAD:$fichier" 2>/dev/null | tr -d '[:space:]')
# Numéro imposé à la main : le fichier diffère du dernier commit. On le garde tel quel (et on l'inclut au commit).
# On compare les valeurs plutôt que l'état de l'index : après un « git commit <fichiers> », l'index peut garder
# une ancienne valeur de VERSION, qui ferait reculer le numéro.
if [ -n "$dernier" ] && [ "$base" != "$dernier" ]; then git add "$racine/$fichier"; exit 0; fi
# Le commit modifie-t-il le site ?
if ! printf '%s\n' "$indexes" | grep '^Passe-ton-mf1/' | grep -vqE '^Passe-ton-mf1/(README\.md|ROADMAP-UX\.md|_passation/)'; then exit 0; fi
if [[ "$base" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
  majeur=${BASH_REMATCH[1]}; mineur=$((10#${BASH_REMATCH[2]})); correctif=$((10#${BASH_REMATCH[3]} + 1))
  printf '%d.%d.%02d\n' "$majeur" $((mineur + correctif / 100)) $((correctif % 100)) > "$racine/$fichier"
  git add "$racine/$fichier"
  exit 0
fi
majeur=${base%%.*}
mineur=$((10#${base#*.} + 1))
printf '%d.%03d\n' $((majeur + mineur / 1000)) $((mineur % 1000)) > "$racine/$fichier"
git add "$racine/$fichier"
