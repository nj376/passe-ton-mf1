#!/usr/bin/env python3
"""Convertit un fichier de progressions rédigé en Markdown en JSON pour le site.

Usage (depuis Passe-ton-mf1/) :
    python3 outils/progressions_md_vers_json.py _passation/donnees/progressions/progressions_N1.md

Écrit data/progressions/progressions_<niveau>.json (le niveau est lu dans le nom du fichier)
et vérifie que chaque compétence existe dans data/mft_data.json.

Format attendu du Markdown :
    # Nom de la compétence (ID-de-la-base)
    > Statut… Source : …
    **Modalités d'évaluation du MFT :** texte
    ## Nom de la technique
    *Curseurs : a → b ; c → d*
    ### 1. Titre de l'étape          (suffixe « (évaluation) » pour l'étape finale)
    **Objectif.** texte
    **Situation.** texte
    **Critère pour passer à la suite.** texte
    **Théorie.** texte               (facultatif)
    **⚠ Sécurité.** texte            (facultatif)
"""
import json
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
CHAMPS = {
    "objectif": "objectif",
    "situation": "situation",
    "critère pour passer à la suite": "critere",
    "théorie": "theorie",
    "sécurité": "securite",
}


def erreur(numero, message):
    sys.exit(f"Ligne {numero} : {message}")


def convertir(chemin):
    lignes = chemin.read_text(encoding="utf-8").splitlines()
    resultat = {"niveau": None, "source": None, "statut": None, "competences": []}
    comp = tech = etape = None
    champ = None  # dernier champ rempli, pour les paragraphes sur plusieurs lignes

    for n, brute in enumerate(lignes, 1):
        ligne = brute.strip()
        if not ligne:
            champ = None
            continue

        m = re.match(r"^# (.+?)\s*\(([A-Za-z0-9+_-]+)\)\s*$", ligne)
        if m:
            comp = {"id": m.group(2), "competence": m.group(1).strip(), "evaluation_mft": "", "techniques": []}
            resultat["competences"].append(comp)
            tech = etape = champ = None
            continue

        if ligne.startswith("> "):
            texte = ligne[2:].strip()
            if "Source :" in texte:
                statut, source = texte.split("Source :", 1)
                # Le point qui précède « Source : » sépare les deux champs : on n'en retire qu'un.
                resultat["statut"] = resultat["statut"] or statut.strip().removesuffix(".")
                resultat["source"] = resultat["source"] or source.strip().removesuffix(".")
            continue

        m = re.match(r"^\*\*Modalités d.évaluation du MFT\s*:\*\*\s*(.+)$", ligne)
        if m:
            if comp is None:
                erreur(n, "modalités d'évaluation avant toute compétence")
            comp["evaluation_mft"] = m.group(1).strip()
            continue

        m = re.match(r"^## (.+)$", ligne)
        if m:
            if comp is None:
                erreur(n, "technique avant toute compétence")
            tech = {"nom": m.group(1).strip(), "curseurs": [], "etapes": []}
            comp["techniques"].append(tech)
            etape = champ = None
            continue

        m = re.match(r"^\*Curseurs\s*:\s*(.+?)\*$", ligne)
        if m:
            if tech is None:
                erreur(n, "curseurs avant toute technique")
            tech["curseurs"] = [c.strip() for c in m.group(1).split(";") if c.strip()]
            continue

        m = re.match(r"^### (\d+)\.\s*(.+)$", ligne)
        if m:
            if tech is None:
                erreur(n, "étape avant toute technique")
            etape = {"n": int(m.group(1)), "titre": m.group(2).strip()}
            tech["etapes"].append(etape)
            champ = None
            continue

        m = re.match(r"^\*\*(?:⚠\s*)?([^*]+?)\.\*\*\s*(.*)$", ligne)
        if m and m.group(1).strip().lower() in CHAMPS:
            if etape is None:
                erreur(n, f"« {m.group(1)} » hors d'une étape")
            champ = CHAMPS[m.group(1).strip().lower()]
            etape[champ] = m.group(2).strip()
            continue

        if champ and etape is not None:  # suite d'un paragraphe
            etape[champ] += " " + ligne
            continue

        erreur(n, f"ligne non reconnue : {ligne[:80]}")

    return resultat


def controler(resultat):
    base = json.loads((RACINE / "data" / "mft_data.json").read_text(encoding="utf-8"))
    ids = {c["id"] for c in base["competences"]}
    # Niveaux sans compétence dans la base (PE12, cursus jeunes JP) : le fichier propose ses propres identifiants.
    hors_base = resultat["niveau"] not in {c["niveau"] for c in base["competences"]}
    problemes = []
    for c in resultat["competences"]:
        if c["id"] not in ids and not hors_base:
            problemes.append(f"{c['id']} : identifiant absent de mft_data.json")
        if not c["evaluation_mft"]:
            problemes.append(f"{c['id']} : modalités d'évaluation manquantes")
        if not c["techniques"]:
            problemes.append(f"{c['id']} : aucune technique")
        for t in c["techniques"]:
            if not t["curseurs"]:
                problemes.append(f"{c['id']} / {t['nom']} : curseurs manquants")
            if not 4 <= len(t["etapes"]) <= 6:
                problemes.append(f"{c['id']} / {t['nom']} : {len(t['etapes'])} étapes (4 à 6 attendues, voir progressions.schema.json)")
            for i, e in enumerate(t["etapes"], 1):
                if e["n"] != i:
                    problemes.append(f"{c['id']} / {t['nom']} : étape {e['n']} à la place {i}")
                for obligatoire in ("objectif", "situation", "critere"):
                    if not e.get(obligatoire):
                        problemes.append(f"{c['id']} / {t['nom']} / étape {e['n']} : « {obligatoire} » manquant")
    return problemes


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    source = Path(sys.argv[1])
    m = re.search(r"progressions_([A-Za-z0-9+]+)\.md$", source.name)
    if not m:
        sys.exit("Le nom du fichier doit être de la forme progressions_<niveau>.md")
    resultat = convertir(source)
    resultat["niveau"] = m.group(1)
    problemes = controler(resultat)
    if problemes:
        print("Problèmes à corriger dans le Markdown :")
        for p in problemes:
            print(" -", p)
        sys.exit(1)
    cible = RACINE / "data" / "progressions" / f"progressions_{resultat['niveau']}.json"
    cible.write_text(json.dumps(resultat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    nb_t = sum(len(c["techniques"]) for c in resultat["competences"])
    nb_e = sum(len(t["etapes"]) for c in resultat["competences"] for t in c["techniques"])
    print(f"{cible.relative_to(RACINE)} : {len(resultat['competences'])} compétences, {nb_t} techniques, {nb_e} étapes")


if __name__ == "__main__":
    main()
