// Decodificador do progresso embutido na URL.
//
// Espelha `encodeState()` do index.html. O formato guarda o TOTAL de títulos
// dentro do próprio payload, então aqui não precisamos conhecer o catálogo —
// dá para contar assistidos e calcular a média só a partir dos bytes.
//
// Layout: [versão][total:2][checksum:2][bitmap de assistidos][notas em nibbles]
// Nibble 0–10 = nota, 15 = sem nota.

export const SHARE_V = 1;

// 17/12/2026 00:00 no horário de Brasília (UTC-3).
export const PREMIERE = Date.UTC(2026, 11, 17, 3, 0, 0);

export function daysLeft(now = Date.now()) {
  return Math.max(0, Math.ceil((PREMIERE - now) / 864e5));
}

export function decodeShareState(code) {
  if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{8,4096}$/.test(code)) return null;

  let s = code.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';

  let bin;
  try { bin = atob(s); } catch { return null; }

  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);

  if (b.length < 5 || b[0] !== SHARE_V) return null;

  const n = (b[1] << 8) | b[2];
  if (!n || n > 2000) return null;

  const nbits = Math.ceil(n / 8);
  const nnib = Math.ceil(n / 2);
  if (b.length < 5 + nbits + nnib) return null;

  let done = 0, rsum = 0, rcount = 0;
  for (let i = 0; i < n; i++) {
    if ((b[5 + (i >> 3)] >> (i & 7)) & 1) done++;
    const p = 5 + nbits + (i >> 1);
    const v = (i & 1) ? (b[p] >> 4) : (b[p] & 15);
    if (v <= 10) { rsum += v; rcount++; }
  }

  return {
    done,
    tot: n,
    pct: Math.round((done / n) * 100),
    rcount,
    avg: rcount ? rsum / rcount : null
  };
}
