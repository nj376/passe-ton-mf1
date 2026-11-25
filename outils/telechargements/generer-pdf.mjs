// Génère les PDF à télécharger (static/telechargements/) à partir des modèles HTML de ce dossier.
// Usage, depuis Passe-ton-mf1/ : node outils/telechargements/generer-pdf.mjs
// Nécessite Google Chrome (impression sans interface, protocole DevTools, sans dépendance).
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ici = dirname(fileURLToPath(import.meta.url));
const sortie = resolve(ici, "../../static/telechargements");
const modeles = ["plan-secours-bord", "plan-secours-mer", "fiche-evacuation", "fiche-securite"];
const chromeBin = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

mkdirSync(sortie, { recursive: true });
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(chromeBin, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "pdf-"))}`, "about:blank"], { stdio: "ignore" });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
let cible;
for (let i = 0; i < 50 && !cible; i++) {
  try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); }
  catch { await pause(200); }
}
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const attente = new Map(); let charge = false;
ws.addEventListener("message", (m) => {
  const d = JSON.parse(m.data);
  if (d.id && attente.has(d.id)) { attente.get(d.id)(d); attente.delete(d.id); }
  else if (d.method === "Page.loadEventFired") charge = true;
});
const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; attente.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await cmd("Page.enable");
for (const nom of modeles) {
  charge = false;
  await cmd("Page.navigate", { url: pathToFileURL(join(ici, `${nom}.html`)).href });
  for (let i = 0; i < 50 && !charge; i++) await pause(100);
  await cmd("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
  await pause(300);
  const r = await cmd("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
  writeFileSync(join(sortie, `${nom}.pdf`), Buffer.from(r.result.data, "base64"));
  console.log(`${nom}.pdf`);
}
ws.close(); chrome.kill();
