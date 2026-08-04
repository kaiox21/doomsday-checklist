// Renderiza os cards do /api/og em arquivos locais, para conferir o visual
// sem precisar de deploy. Uso: npm run og
//
// Os PNGs saem em scripts/out/ e são descartáveis (estão no .gitignore).

import fs from 'node:fs';
import path from 'node:path';
import handler from '../api/og.js';

// Mesma codificação do encodeState() no index.html, só para gerar um exemplo.
function encode(total, doneIdx, ratings) {
  const nbits = Math.ceil(total / 8), nnib = Math.ceil(total / 2);
  const b = new Uint8Array(5 + nbits + nnib);
  b[0] = 1; b[1] = total >> 8; b[2] = total & 255; b[3] = 0xAB; b[4] = 0xCD;
  for (let i = 0; i < total; i++) {
    if (doneIdx.has(i)) b[5 + (i >> 3)] |= 1 << (i & 7);
    const v = ratings.has(i) ? ratings.get(i) : 15;
    const p = 5 + nbits + (i >> 1);
    b[p] |= (i & 1) ? (v << 4) : v;
  }
  return Buffer.from(b).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const done = new Set();
for (let i = 0; i < 47; i++) done.add(i);
const ratings = new Map();
[3, 5, 8, 9, 7, 8, 10, 6, 9, 8].forEach((n, i) => ratings.set(i * 3, n));
const code = encode(75, done, ratings);

const outDir = path.join(import.meta.dirname, 'out');
fs.mkdirSync(outDir, { recursive: true });

const cases = [
  ['og-padrao.png', 'https://guia.doomsday.sbs/api/og'],
  ['og-progresso.png', `https://guia.doomsday.sbs/api/og?s=${code}&n=Kaio`],
  ['og-zerado.png', `https://guia.doomsday.sbs/api/og?s=${encode(75, new Set(), new Map())}`]
];

for (const [file, url] of cases) {
  const res = await handler(new Request(url));
  if (!res.ok) {
    console.error(`✗ ${file}: HTTP ${res.status}`);
    console.error(await res.text());
    process.exitCode = 1;
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(outDir, file), buf);
  console.log(`✓ ${file} — ${buf.length} bytes`);
}

console.log(`\ncódigo de exemplo: ${code}`);
