#!/usr/bin/env python3
"""Mindmaps : export des fichiers draw.io du dépôt mf1-docs vers le site.

Parcourt mf1-docs/NN - Niveau/mindmaps/*.drawio (en lecture seule) et produit :
  - static/mindmaps/<niveau>/<carte>.svg       affichage (texte réel, allégé)
  - static/mindmaps/<niveau>/<carte>-mini.png  mini-carte
  - static/mindmaps/png/passe-ton-mf1_<Niveau>_<carte>.png  téléchargement (échelle 2)
  - data/mindmaps.json                         niveaux, cartes, sections (sommaire)

À lancer en local (draw.io desktop requis), puis commiter les fichiers produits :
    python3 outils/mindmaps.py          # ne réexporte que les fichiers draw.io modifiés
    python3 outils/mindmaps.py --tout   # réexporte tout
    --sans-compression : garde les PNG de draw.io tels quels (5 fois plus lourds)
"""
import glob, hashlib, html, json, os, re, shutil, subprocess, sys, tempfile, unicodedata
import xml.etree.ElementTree as ET

ICI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(ICI)                 # Passe-ton-mf1/
DEPOT = os.path.dirname(SITE)               # mf1-docs/
SORTIE = os.path.join(SITE, "static", "mindmaps")
DONNEES = os.path.join(SITE, "data", "mindmaps.json")
DRAWIO = os.environ.get("DRAWIO", "/Applications/draw.io.app/Contents/MacOS/draw.io")

# Nom du répertoire (après « NN - ») → identifiant d'adresse, pastille, nom long.
NIVEAUX = {
    "Randonnée subaquatique": ("randosub", "Randosub", "Randonnée subaquatique"),
    "Jeunes Plongeurs": ("jeunes-plongeurs", "Jeunes plongeurs", "Jeunes plongeurs"),
    "Baptême": ("bapteme", "Baptême", "Baptême"),
    "PE12": ("pe12", "PE12", "PE12"),
    "PA12": ("pa12", "PA12", "PA12"),
    "N1": ("n1", "N1", "Niveau 1"),
    "N2": ("n2", "N2", "Niveau 2"),
    "N3": ("n3", "N3", "Niveau 3"),
    "N4": ("n4", "GP-N4", "Niveau 4"),
    "N5": ("n5", "DP-N5", "Niveau 5"),
    "MF1": ("mf1", "MF1", "MF1"),
    "RIFAP": ("rifap", "RIFAP", "RIFAP"),
}
# Nom de page draw.io → libellé d'onglet. Les autres pages gardent leur nom.
ONGLETS = {
    "Théorie": "Connaissances théoriques",
    "Connaissances": "Connaissances à maîtriser",   # RIFAP
}


def nfc(s):
    return unicodedata.normalize("NFC", s)


def slug(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def texte(v):
    v = re.sub(r"<br\s*/?>", " ", v or "")
    v = re.sub(r"<[^>]+>", " ", v)
    return re.sub(r"\s+", " ", html.unescape(v)).strip()


def exporter(fichier, page, sortie, *options):
    r = subprocess.run([DRAWIO, "-x", "-p", str(page), "--theme", "light", *options, "-o", sortie, fichier],
                       capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(sortie):
        sys.exit(f"Échec de l'export : {fichier} page {page}\n{r.stderr}")


def compresser_png(chemin):
    """Palette de 256 couleurs, sans tramage : écart invisible (2 à 3 sur 255 en moyenne), fichier 5 fois plus léger."""
    try:
        from PIL import Image
    except ImportError:
        print("  (PIL absent : PNG non compressé)")
        return
    Image.open(chemin).convert("RGB").quantize(colors=256, method=Image.Quantize.FASTOCTREE,
                                               dither=Image.Dither.NONE).save(chemin, optimize=True)


def alleger_svg(chemin):
    """Retire les images de secours de draw.io (le texte reste du vrai texte) et l'en-tête XML."""
    t = open(chemin, encoding="utf-8").read()
    t = re.sub(r"<\?xml[^>]*\?>\s*|<!DOCTYPE[^>]*>\s*", "", t)
    # <switch><foreignObject requiredFeatures=…>…</foreignObject><image|text…></switch> → le foreignObject seul
    t = re.sub(r"<switch>(<foreignObject.*?</foreignObject>)(?:<image[^>]*/>|<text.*?</text>)?</switch>",
               lambda m: m.group(1).replace(' requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"', ""),
               t, flags=re.S)
    # Avertissement « Text is not SVG - cannot display »
    t = re.sub(r'<switch><g requiredFeatures="[^"]*"/>.*?</switch>', "", t, flags=re.S)
    if "<image" in t or "<switch" in t:
        print(f"  ⚠️  {os.path.relpath(chemin, SITE)} : éléments de secours non retirés")
    # Largeur et hauteur fixes retirées : la visionneuse pilote le viewBox.
    t = re.sub(r'(<svg[^>]*?) width="[^"]*" height="[^"]*"', r"\1", t, count=1)
    vb = re.search(r'viewBox="([^"]+)"', t).group(1).split()
    # Les textes de draw.io sont dans des foreignObject de 100 % × 100 % : en pourcentage du viewBox,
    # ils rétrécissent quand on zoome et coupent les libellés. On leur donne la taille de toute la carte.
    t = t.replace('<foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="100%" height="100%"',
                  '<foreignObject style="overflow: visible; text-align: left;" pointer-events="none" width="%g" height="%g"'
                  % (float(vb[0]) + float(vb[2]), float(vb[1]) + float(vb[3])))
    if 'width="100%" height="100%"' in t:
        print(f"  ⚠️  {os.path.relpath(chemin, SITE)} : foreignObject en pourcentage restants")
    open(chemin, "w", encoding="utf-8").write(t)
    return t, float(vb[2]), float(vb[3])


def geometries(modele):
    """Géométrie absolue de chaque cellule (les parents imbriqués sont additionnés)."""
    cellules = {c.get("id"): c for c in modele.iter("mxCell")}
    cache = {}

    def absolue(i):
        if i in cache:
            return cache[i]
        c = cellules.get(i)
        g = c.find("mxGeometry") if c is not None else None
        if g is None or c.get("edge") == "1":
            cache[i] = None
            return None
        x, y = float(g.get("x", 0)), float(g.get("y", 0))
        p = absolue(c.get("parent")) if c.get("parent") in cellules else None
        if p:
            x, y = x + p[0], y + p[1]
        cache[i] = (x, y, float(g.get("width", 0)), float(g.get("height", 0)))
        return cache[i]

    return cellules, {i: absolue(i) for i in cellules}


def sections(modele, svg):
    cellules, geo = geometries(modele)
    cadres = [c for c in modele.iter("mxCell")
              if "arcSize=2" in (c.get("style") or "") and "verticalLabelPosition=top" in (c.get("style") or "")]
    if not cadres:
        return [], [], []
    # Décalage entre les coordonnées draw.io et celles du SVG exporté, lu sur le premier cadre.
    ref = cadres[0]
    m = re.search(r'data-cell-id="%s"><g transform="translate\(0\.5,0\.5\)"><rect x="([-\d.]+)" y="([-\d.]+)"'
                  % re.escape(ref.get("id")), svg)
    dx, dy = (float(m.group(1)) - geo[ref.get("id")][0], float(m.group(2)) - geo[ref.get("id")][1]) if m else (0, 0)

    liste = []
    sans_titre = []
    for rang, c in enumerate(cadres):
        x, y, l, h = geo[c.get("id")]
        t = texte(c.get("value"))
        (liste if t else sans_titre).append({"titre": t, "x": x, "y": y, "l": l, "h": h, "rang": rang})
    # Cadres sans titre (tableau comparatif) : une entrée par ligne, titrée par le texte placé entre les cadres.
    lignes = {}
    for s in sans_titre:
        lignes.setdefault(s["y"], []).append(s)
    textes = [(geo[i], texte(c.get("value"))) for i, c in cellules.items()
              if geo.get(i) and texte(c.get("value")) and c not in cadres]
    alertes = []
    for y, groupe in lignes.items():
        x0 = min(s["x"] for s in groupe); x1 = max(s["x"] + s["l"] for s in groupe)
        y1 = max(s["y"] + s["h"] for s in groupe)
        titre = ""
        for (tx, ty, tl, th), t in textes:
            cx, cy = tx + tl / 2, ty + th / 2
            if y <= cy <= y1 and any(s["x"] + s["l"] <= cx <= nxt["x"] for s in groupe for nxt in groupe if nxt["x"] > s["x"]):
                titre = t
                break
        if not titre:
            alertes.append(f"cadres sans titre à y={y:g}")
            titre = "Section"
        liste.append({"titre": titre, "x": x0, "y": y, "l": x1 - x0, "h": y1 - y, "rang": min(s["rang"] for s in groupe)})

    # Ordre du fichier, sauf s'il fait remonter une colonne (une section placée avant une autre
    # qui est au-dessus d'elle dans la même colonne) : on prend alors l'ordre de lecture.
    fichier = sorted(liste, key=lambda s: s["rang"])
    if not any(a["x"] == b["x"] and a["y"] > b["y"] for i, a in enumerate(fichier) for b in fichier[i + 1:]):
        return finaliser(fichier, cellules, geo, dx, dy, alertes)
    # Ordre de lecture : les colonnes (ou la grille), puis les bandeaux larges du bas.
    larges = [s["y"] for s in liste if s["l"] >= 1000]
    debut = min(larges) if larges else float("inf")
    corps = [s for s in liste if s["y"] < debut]
    bas = sorted((s for s in liste if s["y"] >= debut), key=lambda s: (s["y"], s["x"]))
    ys = {}
    for s in corps:
        ys[s["y"]] = ys.get(s["y"], 0) + 1
    grille = bool(corps) and all(n >= 2 for n in ys.values())
    corps.sort(key=(lambda s: (s["y"], s["x"])) if grille else (lambda s: (s["x"], s["y"])))
    ordre = corps + bas
    if [s["rang"] for s in ordre] != sorted(s["rang"] for s in ordre):
        alertes.append("ordre du fichier différent de l'ordre de lecture (ordre de lecture retenu)")
    return finaliser(ordre, cellules, geo, dx, dy, alertes)


def finaliser(ordre, cellules, geo, dx, dy, alertes):
    """Coordonnées SVG et groupes du sommaire.

    Groupes : quand au moins deux colonnes de sections ont chacune un sous-titre (texte libre placé juste
    au-dessus de leur première section), chaque colonne devient un groupe titré par ce sous-titre
    (par exemple « Jeunes bulles » et « Bronze et argent » chez les Jeunes plongeurs)."""
    larges = [s["y"] for s in ordre if s["l"] >= 1000]
    debut = min(larges) if larges else float("inf")
    colonnes = {}
    for s in ordre:
        if s["y"] < debut and s["l"] < 1000:
            colonnes.setdefault(s["x"], []).append(s)
    textes = [(geo[i], texte(c.get("value"))) for i, c in cellules.items()
              if geo.get(i) and (c.get("style") or "").startswith("text;") and texte(c.get("value"))]
    titres = {}
    for x, membres in colonnes.items():
        haut = min(s["y"] for s in membres)
        trouves = sorted(((g[1], t, g) for g, t in textes if abs(g[0] - x) <= 30 and haut - 80 <= g[1] < haut), reverse=True)
        if trouves:
            titres[x] = (trouves[0][1], trouves[0][2])
    groupes = []
    if len(titres) >= 2:
        for x in sorted(titres):
            t, (tx, ty, tl, th) = titres[x]
            membres = colonnes[x]
            x0 = min(s["x"] for s in membres); x1 = max(s["x"] + s["l"] for s in membres)
            y1 = max(s["y"] + s["h"] for s in membres)
            for s in membres:
                s["groupe"] = len(groupes)
            groupes.append({"titre": t, "x": round(x0 + dx, 1), "y": round(ty + dy, 1),
                            "l": round(x1 - x0, 1), "h": round(y1 - ty, 1)})
    secs = []
    for s in ordre:
        e = {"titre": s["titre"], "x": round(s["x"] + dx, 1), "y": round(s["y"] + dy, 1),
             "l": round(s["l"], 1), "h": round(s["h"], 1)}
        if "groupe" in s:
            e["groupe"] = s["groupe"]
        secs.append(e)
    return secs, groupes, alertes


def main():
    tout = "--tout" in sys.argv
    compression = "--sans-compression" not in sys.argv
    if not os.path.exists(DRAWIO):
        sys.exit(f"draw.io introuvable : {DRAWIO} (variable DRAWIO pour un autre chemin)")
    ancien = {}
    if os.path.exists(DONNEES):
        for n in json.load(open(DONNEES, encoding="utf-8"))["niveaux"]:
            ancien[n["id"]] = n
    niveaux = []
    for rep in sorted(glob.glob(os.path.join(DEPOT, "[0-9][0-9] - *"))):
        nom_rep = nfc(os.path.basename(rep))
        fichiers = sorted(glob.glob(os.path.join(rep, "mindmaps", "*.drawio")))
        if not fichiers:
            continue
        nom = nom_rep.split(" - ", 1)[1]
        ident, court, long = NIVEAUX.get(nom, (slug(nom), nom, nom))
        prefixe = "passe-ton-mf1_%s_" % "".join(c for c in unicodedata.normalize("NFD", court.replace(" ", "-"))
                                                 if unicodedata.category(c) != "Mn")
        fichier = fichiers[0]
        if len(fichiers) > 1:
            print(f"⚠️  {nom_rep} : plusieurs fichiers draw.io, seul {os.path.basename(fichier)} est lu")
        empreinte = hashlib.sha1(open(fichier, "rb").read()).hexdigest()
        print(f"{nom_rep} · {os.path.basename(fichier)}")
        a = ancien.get(ident)
        if not tout and a and a.get("empreinte") == empreinte and all(
                os.path.exists(os.path.join(SITE, "static", c[k].lstrip("/"))) for c in a["cartes"] for k in ("svg", "png", "mini")):
            print("  inchangé")
            niveaux.append(a)
            continue
        racine = ET.parse(fichier).getroot()
        # Export dans un dossier temporaire hors de Dropbox, puis copie : Dropbox supporte mal
        # les fichiers créés et réécrits en rafale.
        tmp = tempfile.mkdtemp(prefix="mindmaps-")
        dossier = os.path.join(tmp, ident)
        os.makedirs(dossier)
        os.makedirs(os.path.join(tmp, "png"))
        cartes = []
        for p, d in enumerate(racine.findall("diagram"), start=1):
            modele = d.find("mxGraphModel")
            if modele is None:
                sys.exit(f"{fichier} : page {p} compressée, enregistre-la sans compression dans draw.io")
            page = nfc(d.get("name", f"Page {p}"))
            titre = ONGLETS.get(page, page)
            cid = slug(titre)
            svg = os.path.join(dossier, f"{cid}.svg")
            png = os.path.join(tmp, "png", f"{prefixe}{cid}.png")
            mini = os.path.join(dossier, f"{cid}-mini.png")
            exporter(fichier, p, svg, "-f", "svg")
            exporter(fichier, p, png, "-f", "png", "-s", "2")
            exporter(fichier, p, mini, "-f", "png", "--width", "360")
            if compression:
                compresser_png(png)
                compresser_png(mini)
            contenu, largeur, hauteur = alleger_svg(svg)
            secs, groupes, alertes = sections(modele, contenu)
            print(f"  p{p} « {page} » → onglet « {titre} » · {len(secs)} sections · SVG {os.path.getsize(svg)//1024} Ko")
            for g in groupes:
                print(f"     groupe « {g['titre']} »")
            for al in alertes:
                print(f"     ⚠️  {al}")
            cartes.append({
                "id": cid, "titre": titre, "page": page,
                "svg": f"/mindmaps/{ident}/{cid}.svg",
                "mini": f"/mindmaps/{ident}/{cid}-mini.png",
                "png": f"/mindmaps/png/{prefixe}{cid}.png",
                "largeur": largeur, "hauteur": hauteur, "sections": secs,
            })
            if groupes:
                cartes[-1]["groupes"] = groupes
        # Remplacement des fichiers du niveau : anciens fichiers retirés un par un, nouveaux copiés.
        cible = os.path.join(SORTIE, ident)
        os.makedirs(cible, exist_ok=True)
        os.makedirs(os.path.join(SORTIE, "png"), exist_ok=True)
        nouveaux = set(os.listdir(dossier))
        for f in os.listdir(cible):
            if f not in nouveaux:
                os.remove(os.path.join(cible, f))
        for f in glob.glob(os.path.join(SORTIE, "png", f"{prefixe}*.png")):
            if os.path.basename(f) not in os.listdir(os.path.join(tmp, "png")):
                os.remove(f)
        for f in nouveaux:
            shutil.copyfile(os.path.join(dossier, f), os.path.join(cible, f))
        for f in os.listdir(os.path.join(tmp, "png")):
            shutil.copyfile(os.path.join(tmp, "png", f), os.path.join(SORTIE, "png", f))
        shutil.rmtree(tmp)
        niveaux.append({"id": ident, "court": court, "nom": long, "source": os.path.relpath(fichier, DEPOT),
                        "empreinte": empreinte, "cartes": cartes})
    # Fichiers qui ne correspondent plus à aucune mindmap (page ou niveau renommé, supprimé).
    utiles = {os.path.normpath(os.path.join(SITE, "static", c[k].lstrip("/"))) for n in niveaux for c in n["cartes"] for k in ("svg", "png", "mini")}
    for f in glob.glob(os.path.join(SORTIE, "**", "*.*"), recursive=True):
        if os.path.normpath(f) not in utiles and unicodedata.normalize("NFC", os.path.normpath(f)) not in utiles:
            os.remove(f)
            print(f"  retiré : {os.path.relpath(f, SITE)}")
    json.dump({"niveaux": niveaux}, open(DONNEES, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"→ {os.path.relpath(DONNEES, SITE)} : {len(niveaux)} niveaux, {sum(len(n['cartes']) for n in niveaux)} mindmaps")


if __name__ == "__main__":
    main()
