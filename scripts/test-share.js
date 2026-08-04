// Testa o ida-e-volta do progresso embutido na URL.
//
// Extrai as funções REAIS do index.html (em vez de reimplementá-las) e confere
// que o que o navegador codifica é exatamente o que o /api/og e o /api/share
// decodificam. Um erro silencioso aqui corromperia todo link compartilhado.
//
// Uso: node scripts/test-share.js

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { decodeShareState } from '../lib/share-state.js';

const root = path.join(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Carrega o catálogo de verdade.
globalThis.window = globalThis;
await import(path.join(root, 'data.js'));
const DATA = globalThis.window.DOOMSDAY_DATA;

const ALL = [];
DATA.forEach(sec => sec.items.forEach(it => ALL.push(it)));

// Recorta as funções de codificação do index.html e as avalia neste escopo.
const slice = html.slice(
  html.indexOf('const SHARE_V=1;'),
  html.indexOf('function shareURL()')
);
assert.ok(slice.includes('function encodeState()'), 'não achei encodeState no index.html');
assert.ok(slice.includes('function decodeState('), 'não achei decodeState no index.html');

let checked = {}, ratings = {};
const scope = new Function('ALL', 'checkedRef', 'ratingsRef', `
  const checked = checkedRef, ratings = ratingsRef;
  ${slice}
  return { encodeState, decodeState, catalogSum };
`)(ALL, /* proxies abaixo */ new Proxy({}, {
  get: (_, k) => checked[k], has: (_, k) => k in checked
}), new Proxy({}, {
  get: (_, k) => ratings[k], has: (_, k) => k in ratings
}));

let passed = 0;
const check = (label, fn) => {
  try { fn(); console.log(`  ✓ ${label}`); passed++; }
  catch (e) { console.error(`  ✗ ${label}\n    ${e.message}`); process.exitCode = 1; }
};

console.log(`Catálogo: ${ALL.length} títulos\n`);

const scenarios = [
  ['tudo vazio', () => { checked = {}; ratings = {}; }],
  ['um título só', () => { checked = { [ALL[0][0]]: true }; ratings = {}; }],
  ['último título (borda do bitmap)', () => {
    checked = { [ALL[ALL.length - 1][0]]: true }; ratings = {};
  }],
  ['nota 0 vs sem nota', () => {
    checked = {};
    ratings = { [ALL[0][0]]: 0, [ALL[2][0]]: 10 };
  }],
  ['metade assistida com notas variadas', () => {
    checked = {}; ratings = {};
    ALL.forEach((it, i) => {
      if (i % 2 === 0) checked[it[0]] = true;
      if (i % 3 === 0) ratings[it[0]] = i % 11;
    });
  }],
  ['tudo assistido e tudo avaliado', () => {
    checked = {}; ratings = {};
    ALL.forEach((it, i) => { checked[it[0]] = true; ratings[it[0]] = (i * 7) % 11; });
  }]
];

for (const [label, setup] of scenarios) {
  setup();
  const expDone = Object.keys(checked).length;
  const expRated = Object.keys(ratings).length;
  const expSum = Object.values(ratings).reduce((a, b) => a + b, 0);

  const code = scope.encodeState();

  check(`${label} — decodifica no cliente`, () => {
    const back = scope.decodeState(code);
    assert.ok(back, 'decodeState devolveu null');
    assert.deepEqual(Object.keys(back.checked).sort(), Object.keys(checked).sort(),
      'marcações não bateram');
    assert.deepEqual(back.ratings, ratings, 'notas não bateram');
    assert.equal(back.drift, false, 'acusou drift de catálogo indevidamente');
  });

  check(`${label} — decodifica no servidor`, () => {
    const srv = decodeShareState(code);
    assert.ok(srv, 'decodeShareState devolveu null');
    assert.equal(srv.done, expDone, `assistidos: ${srv.done} ≠ ${expDone}`);
    assert.equal(srv.tot, ALL.length, 'total errado');
    assert.equal(srv.rcount, expRated, `avaliados: ${srv.rcount} ≠ ${expRated}`);
    if (expRated) {
      assert.ok(Math.abs(srv.avg - expSum / expRated) < 1e-9, 'média errada');
    } else {
      assert.equal(srv.avg, null, 'média deveria ser null');
    }
  });
}

console.log('\nEntradas inválidas:');
for (const bad of ['', 'x', '!!!!!!!!!!', 'AAAA', 'A'.repeat(9)]) {
  check(`rejeita ${JSON.stringify(bad.slice(0, 12))}`, () => {
    assert.equal(decodeShareState(bad), null, 'deveria ter rejeitado');
  });
}

check('detecta catálogo diferente (drift)', () => {
  checked = { [ALL[0][0]]: true }; ratings = {};
  const code = scope.encodeState();
  const tampered = scope.decodeState(code);
  assert.equal(tampered.drift, false);
  // Muda o checksum manualmente e confirma que o cliente percebe.
  const raw = Buffer.from(code.replace(/-/g, '+').replace(/_/g, '/') + '==', 'base64');
  raw[3] ^= 0xFF;
  const mutated = raw.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  assert.equal(scope.decodeState(mutated).drift, true, 'não detectou o catálogo trocado');
});

console.log(`\n${passed} verificações passaram.`);
