// Casa cada título do data.js com um registro do TMDB e baixa o pôster.
//
// Uso:
//   node scripts/fetch-posters.js --dry-run   # só relata os pareamentos
//   node scripts/fetch-posters.js             # baixa e escreve posters.js
//
// Precisa de TMDB_API_KEY. Ponha em .env.local (que está no .gitignore):
//   echo 'TMDB_API_KEY=sua_chave' > .env.local
//
// Por que não confiar cegamente na busca: os títulos aqui são em português e
// vários são coletâneas ("Demolidor (T1–T3)", "Loki (T1+T2)"). O script busca
// em filmes E em séries, pontua os candidatos por semelhança de nome e
// proximidade de ano, e RELATA tudo que ficou abaixo de 0.75 de confiança em
// vez de gravar em silêncio. Para os que errarem, fixe o id à mão em
// scripts/tmdb-overrides.json — o override sempre vence.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.join(import.meta.dirname, '..');
const POSTER_DIR = path.join(ROOT, 'posters');
const OVERRIDES = path.join(import.meta.dirname, 'tmdb-overrides.json');
const DRY = process.argv.includes('--dry-run');

const IMG_W = 200, IMG_H = 300, JPEG_Q = 82;   // ~2x do tamanho exibido
const CONF_MIN = 0.75;

// ---- chave -----------------------------------------------------------------
function readKey() {
  if (process.env.TMDB_API_KEY) return process.env.TMDB_API_KEY.trim();
  const envFile = path.join(ROOT, '.env.local');
  if (fs.existsSync(envFile)) {
    const m = /^TMDB_API_KEY\s*=\s*(.+)$/m.exec(fs.readFileSync(envFile, 'utf8'));
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  }
  return null;
}
const KEY = readKey();
if (!KEY) {
  console.error('Falta a chave do TMDB.\n');
  console.error("  echo 'TMDB_API_KEY=sua_chave' > .env.local\n");
  console.error('Pegue em https://www.themoviedb.org/settings/api (grátis).');
  process.exit(1);
}

// ---- catálogo --------------------------------------------------------------
globalThis.window = globalThis;
await import(path.join(ROOT, 'data.js'));
const ALL = [];
globalThis.window.DOOMSDAY_DATA.forEach(sec => sec.items.forEach(it => ALL.push(it)));

const overrides = fs.existsSync(OVERRIDES)
  ? JSON.parse(fs.readFileSync(OVERRIDES, 'utf8'))
  : {};

// ---- normalização e pontuação ---------------------------------------------
const semAcento = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// "Demolidor (T1–T3)" -> "Demolidor" · "Agente Carter (One-Shot)" -> "Agente Carter"
const limpaTitulo = t => t
  .replace(/\s*\((?:T\d+[^)]*|One-Shot|Especial[^)]*)\)/gi, '')
  .replace(/\s+/g, ' ')
  .trim();

const chave = s => semAcento(String(s).toLowerCase())
  .replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Similaridade por bigramas (Sørensen–Dice): tolera pontuação e ordem de
// palavras melhor que igualdade exata, sem precisar de dependência.
function similaridade(a, b) {
  a = chave(a); b = chave(b);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const bi = s => {
    const out = new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      out.set(g, (out.get(g) || 0) + 1);
    }
    return out;
  };
  const A = bi(a), B = bi(b);
  let inter = 0, total = 0;
  for (const [g, n] of A) { total += n; if (B.has(g)) inter += Math.min(n, B.get(g)); }
  for (const [, n] of B) total += n;
  return total ? (2 * inter) / total : 0;
}

// "Filme · 1943–45 · 124 min" -> movie · "Série · 2015–18" -> tv
function tiposProvaveis(detalhes) {
  const d = chave(detalhes).split(' ')[0];
  if (['serie', 'minisserie', 'series'].includes(d)) return ['tv'];
  if (['filme'].includes(d)) return ['movie'];
  // Animação, Especial, Curta, Curtas: o TMDB classifica de formas diferentes,
  // então procura nos dois e deixa a pontuação decidir.
  return ['movie', 'tv'];
}

// ---- TMDB ------------------------------------------------------------------
const base = 'https://api.themoviedb.org/3';
const espera = ms => new Promise(r => setTimeout(r, ms));

async function tmdb(rota, params = {}) {
  const u = new URL(base + rota);
  u.searchParams.set('api_key', KEY);
  u.searchParams.set('language', 'pt-BR');
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const r = await fetch(u);
  if (r.status === 429) {           // limite de taxa: espera e tenta de novo
    await espera(2000);
    return tmdb(rota, params);
  }
  if (!r.ok) throw new Error(`TMDB ${r.status} em ${rota}`);
  return r.json();
}

async function melhorCandidato(titulo, ano, tipos) {
  const busca = limpaTitulo(titulo);
  let melhor = null;
  for (const tipo of tipos) {
    const j = await tmdb(`/search/${tipo}`, { query: busca, include_adult: 'false' });
    for (const c of (j.results || []).slice(0, 8)) {
      const nome = c.title || c.name || '';
      const orig = c.original_title || c.original_name || '';
      const data = c.release_date || c.first_air_date || '';
      const anoC = data ? +data.slice(0, 4) : null;

      const sim = Math.max(similaridade(busca, nome), similaridade(busca, orig));
      // Ano perto conta ponto; longe desconta. Coletâneas de série têm ano de
      // estreia bem antes da chave usada aqui, então a janela é generosa.
      const dAno = anoC && ano ? Math.abs(anoC - ano) : null;
      const bonus = dAno === null ? 0 : dAno <= 1 ? 0.18 : dAno <= 3 ? 0.09 : dAno <= 8 ? 0 : -0.14;
      const score = Math.min(1, Math.max(0, sim + bonus));

      if (!melhor || score > melhor.score) {
        melhor = { score, tipo, id: c.id, nome, ano: anoC, poster: c.poster_path };
      }
    }
  }
  return melhor;
}

// ---- redimensionamento ------------------------------------------------------
// Usa o Pillow via python3, que já é dependência do make-icons.py. Assim o
// repositório fica com pôsteres de ~15 KB em vez dos ~60 KB originais.
function reencodar(entrada, saida) {
  execFileSync('python3', ['-c', `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB').resize((${IMG_W}, ${IMG_H}), Image.LANCZOS)
im.save(sys.argv[2], 'JPEG', quality=${JPEG_Q}, optimize=True)
`, entrada, saida]);
}

// ---- execução ---------------------------------------------------------------
const resultados = [];
const duvidosos = [];

for (const it of ALL) {
  const [id, titulo, detalhes, , , , lanc] = it;
  const ano = Math.floor(lanc / 100);

  const ov = overrides[id];
  let m;
  if (ov) {
    const det = await tmdb(`/${ov.tipo}/${ov.id}`);
    m = { score: 1, tipo: ov.tipo, id: ov.id, nome: det.title || det.name,
          ano: +(det.release_date || det.first_air_date || '').slice(0, 4) || null,
          poster: det.poster_path, fixado: true };
  } else {
    m = await melhorCandidato(titulo, ano, tiposProvaveis(detalhes));
    await espera(60);
  }

  if (!m || !m.poster) {
    duvidosos.push({ id, titulo, motivo: m ? 'sem pôster no TMDB' : 'nenhum resultado' });
    console.log(`  ✗ ${id.padEnd(10)} ${titulo}`);
    continue;
  }

  const marca = m.fixado ? 'fixo' : m.score.toFixed(2);
  const flag = m.fixado || m.score >= CONF_MIN ? '✓' : '?';
  if (!m.fixado && m.score < CONF_MIN) duvidosos.push({ id, titulo, achou: m.nome, ano: m.ano, score: m.score });
  console.log(`  ${flag} ${id.padEnd(10)} ${String(marca).padEnd(5)} ${titulo}  →  ${m.nome} (${m.ano ?? '?'}) [${m.tipo}]`);

  resultados.push({ id, ...m });
}

console.log(`\n${resultados.length}/${ALL.length} pareados.`);

if (duvidosos.length) {
  console.log(`\n${duvidosos.length} para conferir à mão:`);
  duvidosos.forEach(d => console.log(`  ${d.id.padEnd(10)} "${d.titulo}"` +
    (d.achou ? ` → achou "${d.achou}" (${d.ano}) score ${d.score.toFixed(2)}` : ` — ${d.motivo}`)));
  console.log('\nPara corrigir, edite scripts/tmdb-overrides.json:');
  console.log('  { "id_do_titulo": { "tipo": "movie", "id": 12345 } }');
}

if (DRY) {
  console.log('\n--dry-run: nada foi baixado nem escrito.');
  process.exit(0);
}

// ---- download ---------------------------------------------------------------
fs.mkdirSync(POSTER_DIR, { recursive: true });
const tmp = path.join(POSTER_DIR, '.tmp.jpg');
const mapa = {};
let bytes = 0;

for (const r of resultados) {
  const url = `https://image.tmdb.org/t/p/w342${r.poster}`;
  const resp = await fetch(url);
  if (!resp.ok) { console.log(`  ✗ download falhou: ${r.id}`); continue; }
  fs.writeFileSync(tmp, Buffer.from(await resp.arrayBuffer()));
  const arquivo = `${r.id}.jpg`;
  reencodar(tmp, path.join(POSTER_DIR, arquivo));
  bytes += fs.statSync(path.join(POSTER_DIR, arquivo)).size;
  mapa[r.id] = arquivo;
}
fs.existsSync(tmp) && fs.unlinkSync(tmp);

const js = '// GERADO POR scripts/fetch-posters.js — não edite à mão.\n' +
  '// Mapa id do título -> arquivo em posters/.\n' +
  `// Dados de imagem: The Movie Database (TMDB). Este produto usa a API do TMDB\n` +
  `// mas não é endossado nem certificado pelo TMDB.\n` +
  `window.DOOMSDAY_POSTERS = ${JSON.stringify(mapa, null, 2)};\n`;
fs.writeFileSync(path.join(ROOT, 'posters.js'), js);

console.log(`\n${Object.keys(mapa).length} pôsteres em posters/ · ${(bytes / 1024).toFixed(0)} KB no total`);
console.log('posters.js escrito.');
