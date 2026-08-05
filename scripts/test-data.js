// Valida o catálogo do data.js.
//
// O data.js existe para ser editado à mão, e é aí que mora o risco: as
// conquistas do index.html referenciam ids literais ("iw", "endgame", "loki"...).
// Renomear ou remover um título não quebra nada visivelmente — a conquista
// apenas nunca mais é desbloqueada, em silêncio. Este script transforma esse
// tipo de erro num aviso na hora.
//
// Uso: node scripts/test-data.js

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');

globalThis.window = globalThis;
await import(path.join(ROOT, 'data.js'));
const DATA = globalThis.window.DOOMSDAY_DATA;

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Recorta o ACHS do index.html e o avalia — assim o teste checa as conquistas
// que estão no site, não uma cópia que envelheceria.
const achSrc = html.slice(html.indexOf('const ACHS=['), html.indexOf('let checked='));
const ACHS = new Function(`${achSrc}; return ACHS;`)();

const problemas = [];
const erro = (onde, msg) => problemas.push(`${onde}: ${msg}`);

const PRIORIDADES = new Set(['E', 'R', 'O']);
const PLATAFORMAS = new Set(['D', 'N', 'C']);

// ---- estrutura -----------------------------------------------------------
if (!Array.isArray(DATA) || !DATA.length) {
  erro('data.js', 'DOOMSDAY_DATA não é um array com conteúdo');
}

const vistos = new Map();   // id -> onde apareceu primeiro
const todos = [];

DATA.forEach((sec, si) => {
  const onde = `bloco ${si} ("${sec?.g ?? '?'}")`;
  if (typeof sec?.g !== 'string' || !sec.g.trim()) erro(onde, 'sem nome (campo g)');
  if (!Array.isArray(sec?.items) || !sec.items.length) {
    erro(onde, 'sem items');
    return;
  }

  sec.items.forEach((it, ii) => {
    const rotulo = `${onde} item ${ii} ("${it?.[1] ?? '?'}")`;

    if (!Array.isArray(it) || it.length < 8 || it.length > 9) {
      erro(rotulo, `esperava 8 ou 9 campos, tem ${Array.isArray(it) ? it.length : 'não é array'}`);
      return;
    }

    const [id, titulo, detalhes, prio, sinopse, min, lanc, plat, estreia] = it;

    // O id vai para atributos e seletores CSS (.row[data-id="..."]) e para as
    // chaves do localStorage — precisa ser simples e estável.
    if (typeof id !== 'string' || !/^[a-z0-9]+$/.test(id)) {
      erro(rotulo, `id "${id}" deve ser só letras minúsculas e números`);
    } else if (vistos.has(id)) {
      erro(rotulo, `id "${id}" repetido — já usado em ${vistos.get(id)}`);
    } else {
      vistos.set(id, rotulo);
    }

    if (typeof titulo !== 'string' || !titulo.trim()) erro(rotulo, 'título vazio');
    if (typeof detalhes !== 'string' || !detalhes.trim()) erro(rotulo, 'detalhes vazios');
    if (!PRIORIDADES.has(prio)) erro(rotulo, `prioridade "${prio}" inválida (use E, R ou O)`);
    if (typeof sinopse !== 'string' || sinopse.trim().length < 20) {
      erro(rotulo, 'sinopse ausente ou curta demais');
    }

    if (!Number.isInteger(min) || min <= 0 || min > 5000) {
      erro(rotulo, `duração "${min}" deve ser um inteiro de minutos plausível`);
    }

    // Chave de lançamento no formato aaaamm, usada na ordenação por data.
    if (!Number.isInteger(lanc) || lanc < 190001 || lanc > 210012) {
      erro(rotulo, `chave de lançamento "${lanc}" fora do formato aaaamm`);
    } else {
      const mes = lanc % 100;
      if (mes < 1 || mes > 12) erro(rotulo, `mês ${mes} inválido em "${lanc}"`);
    }

    if (!PLATAFORMAS.has(plat)) erro(rotulo, `plataforma "${plat}" inválida (use D, N ou C)`);

    if (estreia !== undefined) {
      if (typeof estreia !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(estreia)) {
        erro(rotulo, `data de estreia "${estreia}" deve ser aaaa-mm-dd`);
      } else if (Number.isNaN(Date.parse(`${estreia}T00:00:00-03:00`))) {
        erro(rotulo, `data de estreia "${estreia}" não existe no calendário`);
      }
    }

    todos.push({ id, titulo, prio, min });
  });
});

// ---- conquistas ----------------------------------------------------------
// A checagem que motivou este script: um id citado numa conquista que não
// existe mais no catálogo torna a conquista impossível, sem erro nenhum.
ACHS.forEach(a => {
  if (!a.ids) return;
  a.ids.forEach(id => {
    if (!vistos.has(id)) {
      erro(`conquista "${a.t}"`, `cita o id "${id}", que não existe no data.js`);
    }
  });
  if (new Set(a.ids).size !== a.ids.length) {
    erro(`conquista "${a.t}"`, 'tem ids repetidos na lista');
  }
});

// A conquista "Decreto Cumprido" deve cobrir exatamente os títulos essenciais.
// Sem isto, adicionar um novo essencial a deixa desbloqueável cedo demais.
const decreto = ACHS.find(a => a.id === 'ess');
if (decreto?.ids) {
  const essenciais = todos.filter(t => t.prio === 'E').map(t => t.id);
  const faltando = essenciais.filter(id => !decreto.ids.includes(id));
  const sobrando = decreto.ids.filter(id => !essenciais.includes(id));
  if (faltando.length) {
    erro('conquista "Decreto Cumprido"',
      `não inclui essenciais: ${faltando.join(', ')}`);
  }
  if (sobrando.length) {
    erro('conquista "Decreto Cumprido"',
      `inclui títulos que não são essenciais: ${sobrando.join(', ')}`);
  }
}

// ---- relatório -----------------------------------------------------------
const horas = Math.round(todos.reduce((a, t) => a + t.min, 0) / 60);
const porPrio = { E: 0, R: 0, O: 0 };
todos.forEach(t => { if (porPrio[t.prio] !== undefined) porPrio[t.prio]++; });

console.log(`Catálogo: ${todos.length} títulos em ${DATA.length} blocos · ${horas}h no total`);
console.log(`  essenciais ${porPrio.E} · recomendados ${porPrio.R} · opcionais ${porPrio.O}`);
console.log(`Conquistas: ${ACHS.length} (${ACHS.filter(a => a.ids).length} baseadas em listas de ids)`);

if (problemas.length) {
  console.error(`\n${problemas.length} problema(s):`);
  problemas.forEach(p => console.error(`  ✗ ${p}`));
  process.exitCode = 1;
} else {
  console.log('\n✓ Catálogo íntegro e conquistas consistentes.');
}
