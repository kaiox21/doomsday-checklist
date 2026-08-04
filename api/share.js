// Página de compartilhamento.
//
// O index.html é estático, então suas meta tags não podem variar por pessoa —
// e o fragmento (#s=...) nem sequer chega ao servidor. Esta rota resolve isso:
// devolve um HTML mínimo com as meta tags certas para o robô do WhatsApp/Twitter
// ler, e manda o visitante humano para o app com o progresso no hash.

import { decodeShareState, daysLeft } from '../lib/share-state.js';

export const config = { runtime: 'edge' };

const escAttr = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export default async function handler(req) {
  const url = new URL(req.url);

  const rawCode = url.searchParams.get('s') || '';
  const code = /^[A-Za-z0-9_-]{8,4096}$/.test(rawCode) ? rawCode : '';
  const name = (url.searchParams.get('n') || '').slice(0, 24).trim();

  const state = decodeShareState(code);
  const origin = url.origin;

  const target = code ? `${origin}/#s=${code}` : `${origin}/`;
  const ogImage = code
    ? `${origin}/api/og?s=${code}${name ? `&n=${encodeURIComponent(name)}` : ''}`
    : `${origin}/api/og`;

  const days = daysLeft();
  const quem = name || 'Alguém';

  const title = state
    ? `${quem} está em ${state.pct}% do checklist do MCU`
    : 'Protocolo Doomsday — Checklist MCU';

  const desc = state
    ? `${state.done} de ${state.tot} títulos assistidos` +
      (state.avg !== null ? `, média ${state.avg.toFixed(1).replace('.', ',')}` : '') +
      `. Faltam ${days} dias para Vingadores: Doutor Destino.`
    : `75 títulos do MCU em ordem cronológica para chegar preparado a Vingadores: Doutor Destino. Faltam ${days} dias.`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escAttr(title)}</title>
<meta name="description" content="${escAttr(desc)}">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Protocolo Doomsday">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${escAttr(url.href)}">
<meta property="og:title" content="${escAttr(title)}">
<meta property="og:description" content="${escAttr(desc)}">
<meta property="og:image" content="${escAttr(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(title)}">
<meta name="twitter:description" content="${escAttr(desc)}">
<meta name="twitter:image" content="${escAttr(ogImage)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta http-equiv="refresh" content="0; url=${escAttr(target)}">
<style>
  body{background:#060907;color:#76867C;font-family:system-ui,sans-serif;
       display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center}
  a{color:#3CE07E}
</style>
</head>
<body>
<p>Abrindo o Protocolo Doomsday...<br><a href="${escAttr(target)}">Clique aqui se não for automático.</a></p>
<script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=600, s-maxage=600'
    }
  });
}
