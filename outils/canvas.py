#!/usr/bin/env python3
"""Jeux de cartes du Canvas, tirés des planches imprimables du dépôt (lecture seule).

Lit les tableaux JavaScript (FAM, HEADS, GESTES, THEO, CADRE, MILIEU) de chaque
`NN - Niveau/cartes/cartes_*.html` et écrit :
  - data/canvas.json : la liste des niveaux et de leurs jeux (pastilles, sélecteur « Jeu ») ;
  - static/canvas/<jeu>.json : un fichier par jeu, chargé par la page au choix du niveau.

Codes : compétences C1…Cn dans l'ordre du jeu, épreuves N4 E1…E13, cartes techniques
et théoriques avec le code de leur planche (EQU-03, TH-12, CAD-01).
Les compétences citées par une connaissance théorique sont retrouvées dans le début
de son champ « l » (« S'équiper · S'équilibrer. Note… »), avec une petite table de synonymes.
Une carte « Transversal » ou sans compétence reconnue ne cite rien : ses liens ne sont jamais signalés.

Usage : python3 outils/canvas.py [--verifier]   (--verifier affiche les correspondances théorie → compétences)
"""
import html
import json
import re
import sys
import unicodedata
from pathlib import Path

ICI = Path(__file__).resolve().parent
SITE = ICI.parent
DEPOT = SITE.parent

# Niveaux, dans l'ordre des pastilles. « cartesDe » : en-tête de la palette.
NIVEAUX = [
    ("jp", "Jeunes plongeurs", "Jeunes plongeurs", "Cartes des Jeunes plongeurs", [("jp", None, "02 - Jeunes Plongeurs/cartes/cartes_jeunes_plongeurs.html")]),
    ("pe12", "PE12", "PE12", "Cartes du PE12", [("pe12", None, "04 - PE12/cartes/cartes_pe12.html")]),
    ("pa12", "PA12", "PA12", "Cartes du PA12", [("pa12", None, "05 - PA12/cartes/cartes_pa12.html")]),
    ("n1", "N1", "Niveau 1", "Cartes du Niveau 1", [("n1", "PE20", "06 - N1/cartes/cartes_n1_pe20.html")]),
    ("n2", "N2", "Niveau 2", "Cartes du Niveau 2", [("pa20", "PA20", "07 - N2/cartes/cartes_pa20.html"), ("pe40", "PE40", "07 - N2/cartes/cartes_pe40.html")]),
    ("n3", "N3", "Niveau 3", "Cartes du Niveau 3", [("n3", "N3", "08 - N3/cartes/cartes_n3.html"), ("pa60", "PA60", "08 - N3/cartes/cartes_n3_pa60.html")]),
    ("n4", "N4", "Niveau 4", "Cartes du Niveau 4", [("n4", None, "09 - N4/cartes/cartes_n4.html")]),
    ("n5", "N5", "Niveau 5", "Cartes du Niveau 5", [("n5", None, "10 - N5/cartes/cartes_n5.html")]),
]

# Synonymes des compétences abrégées dans le champ « l » des cartes théoriques.
SYNONYMES = {"organiser la plongee": "ORG", "milieu et environnement": "MIL", "materiel des equipiers": "MAT"}


# ---------- Lecture des littéraux JavaScript ----------

def litteral_js(texte, i):
    """Lit un littéral JS (objet, tableau, chaîne, nombre) à partir de l'indice i. Renvoie (valeur, indice suivant)."""
    def blancs(i):
        while i < len(texte):
            if texte[i] in " \t\r\n":
                i += 1
            elif texte.startswith("//", i):
                i = texte.index("\n", i)
            elif texte.startswith("/*", i):
                i = texte.index("*/", i) + 2
            else:
                break
        return i

    def valeur(i):
        i = blancs(i)
        c = texte[i]
        if c == "{":
            obj, i = {}, i + 1
            while True:
                i = blancs(i)
                if texte[i] == "}":
                    return obj, i + 1
                if texte[i] in "\"'":
                    cle, i = valeur(i)
                else:
                    m = re.compile(r"[A-Za-z_$][\w$]*").match(texte, i)
                    cle, i = m.group(0), m.end()
                i = blancs(i)
                assert texte[i] == ":", texte[i - 30:i + 30]
                obj[cle], i = valeur(i + 1)
                i = blancs(i)
                if texte[i] == ",":
                    i += 1
        if c == "[":
            tab, i = [], i + 1
            while True:
                i = blancs(i)
                if texte[i] == "]":
                    return tab, i + 1
                v, i = valeur(i)
                tab.append(v)
                i = blancs(i)
                if texte[i] == ",":
                    i += 1
        if c in "\"'":
            j, morceaux = i + 1, []
            while texte[j] != c:
                if texte[j] == "\\":
                    suivant = texte[j + 1]
                    morceaux.append({"n": "\n", "t": "\t"}.get(suivant, suivant))
                    j += 2
                else:
                    morceaux.append(texte[j])
                    j += 1
            return "".join(morceaux), j + 1
        m = re.compile(r"-?\d+(\.\d+)?").match(texte, i)
        if m:
            return (float(m.group(0)) if m.group(1) else int(m.group(0))), m.end()
        for mot, v in (("true", True), ("false", False), ("null", None)):
            if texte.startswith(mot, i):
                return v, i + len(mot)
        raise ValueError("Littéral inattendu : " + texte[i:i + 40])

    return valeur(i)


def lire_jeu(chemin):
    source = chemin.read_text(encoding="utf-8")
    script = source[source.index("<script>"):]
    tableaux = {}
    for m in re.finditer(r"\bconst\s+([A-Z_]+)\s*=\s*(?=[\[{])", script):
        tableaux[m.group(1)], _ = litteral_js(script, m.end())
    return tableaux


# ---------- Mise en forme ----------

def typo(texte):
    """Apostrophes typographiques, espaces propres."""
    texte = re.sub(r"(\w)'", "\\1’", texte or "")
    texte = texte.replace("'", "’")
    return re.sub(r"\s+", " ", texte).strip()


def sans_accents(texte):
    texte = unicodedata.normalize("NFD", texte.lower().replace("’", "'"))
    return "".join(c for c in texte if not unicodedata.combining(c)).strip()


def rubriques(txt):
    """« <b>Attendu.</b> … <br><b>Comportement.</b> … » → [{titre, texte}]."""
    morceaux = re.split(r"<b>([^<]+?)\.?</b>", txt)
    sortie = []
    if morceaux[0].strip(" <br>"):
        sortie.append({"titre": "", "texte": typo(html.unescape(re.sub(r"<[^>]+>", " ", morceaux[0])))})
    for k in range(1, len(morceaux), 2):
        texte = typo(html.unescape(re.sub(r"<[^>]+>", " ", morceaux[k + 1])))
        sortie.append({"titre": typo(morceaux[k].strip().rstrip(".")), "texte": texte})
    return sortie


def majuscule(t):
    return t[:1].upper() + t[1:] if t else t


def nom_court(nom):
    return nom.split("· ")[-1].strip()


# ---------- Construction d'un jeu ----------

def construire(id_jeu, d):
    fam, heads, gestes = d["FAM"], d["HEADS"], d["GESTES"]
    theo = d.get("THEO", [])
    milieu = d.get("MILIEU")

    # Noms des compétences : sans le préfixe de bloc (« Commune · », « PA20 · ») s'ils restent tous distincts.
    courts = {k: nom_court(v["nom"]) for k, v in fam.items()}
    garder_prefixe = id_jeu in ("jp", "n4") or len(set(courts.values())) < len(courts)
    noms = {k: typo(v["nom"] if garder_prefixe else courts[k]) for k, v in fam.items()}

    competences, cartes = [], []
    if id_jeu == "n4":
        groupes = ["Épreuves", "Contenus"]
        chaine = "épreuve, contenu"
    elif id_jeu == "n5":
        groupes = ["Compétences", "Contenus"]
        chaine = "compétence, contenu"
    elif id_jeu == "pe12":
        groupes = ["Aptitudes", "Gestes techniques", "Cadre"]
        chaine = "aptitude, geste technique, cadre"
    elif id_jeu == "jp":
        groupes = ["Compétences", "Gestes techniques", "Théorie"]
        chaine = "compétence, geste technique, théorie"
    else:
        groupes = ["Compétences", "Techniques", "Connaissances théoriques"]
        chaine = "compétence, technique, connaissance théorique"

    # 1. Compétences (épreuves au N4). Au N4, les cinq compétences générales (CMP) n'ont pas de contenus.
    n_c = n_e = 0
    for h in heads:
        f = fam[h["f"]]
        if id_jeu == "n4" and h["f"] != "CMP":
            n_e += 1
            code = "E%d" % n_e
        else:
            n_c += 1
            code = "C%d" % n_c
        titre = typo(h.get("t")) if id_jeu == "n4" and h["f"] == "CMP" else noms[h["f"]]
        carte = {"id": code, "g": 0, "type": "competence", "code": code, "titre": titre,
                 "couleur": f["col"], "texte": rubriques(h["txt"])}
        if id_jeu == "n4" and h["f"] == "CMP":
            carte["libre"] = 1  # pas de contenus rattachés : liens jamais signalés
            carte["bloc"] = typo(f["nom"])
        else:
            carte["comp"] = h["f"]
        cartes.append(carte)
        competences.append(h["f"])

    comp_par_famille = {}
    for c in cartes:
        if c.get("comp"):
            comp_par_famille.setdefault(c["comp"], c["id"])

    # 2. Gestes techniques / contenus
    for g in gestes:
        code = "%s-%02d" % (g["f"], g["n"])
        etiquettes = []
        if "m" in g:
            etiquettes.append(majuscule(milieu.get(g["m"], g["m"]) if milieu else ("milieu naturel" if g["m"] == "MN" else "bassin possible")))
        if g.get("niv"):
            etiquettes.append(typo(g["niv"]))
        if g.get("p"):
            etiquettes.append("Dès la plongée %s" % g["p"])
        if g.get("mo"):
            etiquettes.append(majuscule({"PREP": "avant la sortie", "SITE": "sur le site", "URG": "en cas d’accident", "THEO": "théorie"}.get(g["mo"], g["mo"])))
        if g.get("el"):
            etiquettes.append("Éliminatoire")
        if g.get("ap"):
            etiquettes.append("Aptitude %s" % g["ap"])
        if g.get("d"):
            etiquettes.append("Découpage pédagogique")
        cartes.append({"id": code, "g": 1, "type": "technique", "code": code, "titre": typo(g["t"]),
                       "repere": typo(g["c"]), "etiquettes": etiquettes, "comp": comp_par_famille[g["f"]]})

    # 3. Connaissances théoriques (au N5 : contenus de la compétence « Connaissances théoriques »)
    rapport = []
    fams_norm = [(k, sans_accents(re.sub(r"^Évoluer dans l'eau · ", "", nom_court(v["nom"])))) for k, v in fam.items()]
    for i, t in enumerate(theo, 1):
        code = "TH-%02d" % i
        l = t.get("l", "")
        carte = {"id": code, "g": 1 if id_jeu == "n5" else 2, "type": "theorie", "code": code,
                 "titre": typo(t["t"]), "rubrique": typo(t["r"])}
        if id_jeu == "n5":
            carte["comp"] = comp_par_famille["THE"]
            carte["note"] = typo(l)
        elif id_jeu == "jp":
            carte["note"] = typo(l)
            if t.get("niv"):
                carte["etiquettes"] = [typo(t["niv"])]
        else:
            tete, _, reste = l.partition(". ")
            if not reste and tete.endswith("."):
                tete = tete[:-1]
            cites, morceaux = [], tete.split(" · ")
            for m in morceaux:
                n = sans_accents(m)
                if n in SYNONYMES:
                    trouve = [SYNONYMES[n]] if SYNONYMES[n] in fam else []
                else:
                    trouve = [k for k, nom in fams_norm if nom.startswith(n) or n in nom]
                for k in trouve:
                    if comp_par_famille.get(k) and comp_par_famille[k] not in cites:
                        cites.append(comp_par_famille[k])
            if cites:
                carte["cite"] = cites
                carte["note"] = typo(reste)
            else:
                carte["note"] = typo(l)
            rapport.append((code, t["t"], l, [c for c in cites]))
        cartes.append(carte)

    # 3 bis. Cadre du PE12
    for i, c in enumerate(d.get("CADRE", []), 1):
        code = "CAD-%02d" % i
        cartes.append({"id": code, "g": 2, "type": "theorie", "code": code, "titre": typo(c["t"]),
                       "rubrique": "MFT PE12", "bandeau": "Cadre · MFT PE12", "note": typo(c["l"])})

    for c in cartes:
        if c["type"] == "competence":
            c.pop("comp", None)  # clé interne (famille de la planche)
    return {"id": id_jeu, "groupes": groupes, "chaine": chaine, "cartes": cartes}, rapport


def main():
    verifier = "--verifier" in sys.argv
    index = []
    sortie = SITE / "static" / "canvas"
    sortie.mkdir(parents=True, exist_ok=True)
    for id_niv, court, nom, cartes_de, jeux in NIVEAUX:
        entree = {"id": id_niv, "court": court, "nom": nom, "cartesDe": cartes_de, "jeux": []}
        for id_jeu, nom_jeu, chemin in jeux:
            jeu, rapport = construire(id_jeu, lire_jeu(DEPOT / chemin))
            jeu["source"] = chemin
            texte = json.dumps(jeu, ensure_ascii=False, separators=(",", ":"))
            (sortie / (id_jeu + ".json")).write_text(texte + "\n", encoding="utf-8")
            comptes = [sum(1 for c in jeu["cartes"] if c["g"] == g) for g in range(len(jeu["groupes"]))]
            entree["jeux"].append({"id": id_jeu, "nom": nom_jeu, "groupes": jeu["groupes"], "comptes": comptes})
            print("%-6s %-5s %s" % (id_niv, id_jeu, " · ".join("%s (%d)" % gc for gc in zip(jeu["groupes"], comptes))))
            if verifier:
                titres = {c["id"]: c["titre"] for c in jeu["cartes"]}
                for code, titre, l, cites in rapport:
                    print("    %s %-45s → %s   [%s]" % (code, titre[:45], ", ".join(titres[c] for c in cites) or "—", l[:70]))
        index.append(entree)
    (SITE / "data" / "canvas.json").write_text(json.dumps({"niveaux": index}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
