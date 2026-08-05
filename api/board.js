// Placar do grupo.
//
// GET    /api/board  → { entries: [...] }
// POST   /api/board  → publica/atualiza sua linha e devolve o placar atualizado
// DELETE /api/board  → remove uma linha pelo nome
//
// Guarda tudo num único hash do Redis. Sem login: a chave é o nome normalizado,
// então republicar sobrescreve a própria linha. Isso é proposital — o placar é
// para um grupo pequeno de gente conhecida, não para a internet aberta.
//
// Sem banco configurado, responde 501 e o front mostra o aviso no lugar da lista.

export const config = { runtime: 'edge' };

const HASH = 'doomsday:board';
const MAX_ENTRIES = 200;

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

async function redis(command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(command)
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

// HGETALL devolve um array plano [campo, valor, campo, valor, ...].
async function readBoard() {
  const flat = await redis(['HGETALL', HASH]);
  if (!Array.isArray(flat)) return [];
  const out = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    try {
      const e = JSON.parse(flat[i + 1]);
      if (e && typeof e.name === 'string') out.push(e);
    } catch { /* linha corrompida: ignora em vez de derrubar o placar */ }
  }
  return out.sort((a, b) => b.pct - a.pct || b.done - a.done || a.name.localeCompare(b.name));
}

// Nome: sem quebras de linha nem caracteres de controle, no máximo 24
// caracteres. A chave no Redis é este nome em minúsculas — é o que faz
// republicar sobrescrever a própria linha em vez de criar outra.
function cleanName(raw) {
  return String(raw ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

export default async function handler(req) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return json({ error: 'unconfigured' }, 501);
  }

  try {
    if (req.method === 'GET') {
      return json({ entries: await readBoard() });
    }

    if (req.method === 'POST') {
      let body;
      try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400); }

      const name = cleanName(body?.name);
      if (name.length < 2) return json({ error: 'bad_name' }, 400);

      // Total: recusado, não corrigido. Limitar um tot inválido para dentro da
      // faixa gravaria uma linha inventada — tot=0 virava tot=1 em silêncio.
      const totRaw = Number(body?.tot);
      if (!Number.isFinite(totRaw) || totRaw < 1 || totRaw > 2000) {
        return json({ error: 'bad_progress' }, 400);
      }
      const tot = Math.round(totRaw);

      // Assistidos: aqui limitar faz sentido, porque a lista pode ter encolhido
      // entre o último save do navegador e este envio.
      const doneRaw = Number(body?.done);
      if (!Number.isFinite(doneRaw) || doneRaw < 0) {
        return json({ error: 'bad_progress' }, 400);
      }
      const done = Math.min(tot, Math.round(doneRaw));

      // pct vem recalculado aqui — não dá para confiar no que o cliente mandou.
      const pct = Math.round((done / tot) * 100);

      const rawAvg = Number(body?.avg);
      const avg = Number.isFinite(rawAvg)
        ? Math.min(10, Math.max(0, Math.round(rawAvg * 10) / 10))
        : null;

      const key = name.toLowerCase();
      const exists = await redis(['HEXISTS', HASH, key]);
      if (!exists) {
        const count = await redis(['HLEN', HASH]);
        if (Number(count) >= MAX_ENTRIES) return json({ error: 'board_full' }, 409);
      }

      await redis(['HSET', HASH, key, JSON.stringify({ name, done, tot, pct, avg, at: Date.now() })]);
      return json({ ok: true, entries: await readBoard() });
    }

    if (req.method === 'DELETE') {
      let body;
      try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400); }

      const name = cleanName(body?.name);
      if (name.length < 2) return json({ error: 'bad_name' }, 400);

      // Sem dono: qualquer um pode remover qualquer linha. É a mesma premissa
      // de publicar sem login — um grupo pequeno de gente conhecida. Fechar
      // isso exigiria contas, que é justamente o que o projeto não quer ter.
      const removidos = await redis(['HDEL', HASH, name.toLowerCase()]);
      return json({ ok: true, removed: Number(removidos) > 0, entries: await readBoard() });
    }

    return json({ error: 'method_not_allowed' }, 405);
  } catch (e) {
    return json({ error: 'upstream' }, 502);
  }
}
