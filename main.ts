// Indonesia in Numbers — entry program (Node 22, standard library only).
//
// The site itself is plain static files under app/ (index.html, style.css,
// main.js, data.js — no build step, no network requests). This program hands
// the entry in: it copies app/ and screenshots/ next to this file into the
// output directory and writes dossier.json there with the make.fun frontend
// library from vendor/makefun-frontend.ts, which must stay byte-identical to
// the kit's copy so the scorer's re-built dossier matches.
//
// Output directory: /output in the grader; MAKEFUN_OUTPUT_DIR outside it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Refuse to hand in a broken entry: the site and its screenshots must be
// present in this repository, with 3–4 screenshots, before anything is copied.
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing — the site was not built');
}
const shotDir = join(repoRoot, 'screenshots');
if (!existsSync(shotDir)) throw new Error('screenshots/ is missing');
const shots = (await import('node:fs')).readdirSync(shotDir).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3–4 screenshots, found ${shots.length}`);
}

// Create the output directory (never remove it: in the grader it is a mount).
mkdirSync(outDir, { recursive: true });

// Hand in the site as it stands in this repository.
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The dossier is the judge's view of the entry: its screenshots, the files a
// first load fetches, and an outline of its source. The caps below are the
// scorer's own: 3–4 screenshots at most 256 KiB each, app/ at most 993 files
// and directories and 16 MiB in total.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`Indonesia in Numbers handed in to ${outDir}`);
