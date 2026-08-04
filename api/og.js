// Imagem de preview (Open Graph) gerada na hora.
//
// /api/og            → card genérico do site
// /api/og?s=CODE     → card com o progresso de quem compartilhou o link
// /api/og?s=CODE&n=  → idem, com o nome da pessoa
//
// Sem JSX de propósito: o projeto é estático, sem etapa de build. O satori
// (motor por trás do @vercel/og) aceita elementos como objetos simples
// { type, props }, que é exatamente no que o JSX seria compilado.

import { ImageResponse } from '@vercel/og';
import { decodeShareState, daysLeft } from '../lib/share-state.js';

export const config = { runtime: 'edge' };

const BG = '#060907', GREEN = '#3CE07E', DIM = '#1E6B41',
      LINE = '#1E2C22', MUTED = '#76867C', SILVER = '#C9D2CD', WHITE = '#EAF2ED';

const el = (type, style, children) => ({ type, props: { style, children } });
const txt = (style, children) => el('div', style, children);

// Anton é a fonte dos títulos do site. Se o download falhar, o card ainda
// renderiza na fonte padrão do @vercel/og — só perde o toque de marca.
const ANTON = 'https://raw.githubusercontent.com/google/fonts/main/ofl/anton/Anton-Regular.ttf';
let antonCache;
async function anton() {
  if (antonCache === undefined) {
    antonCache = fetch(ANTON)
      .then(r => (r.ok ? r.arrayBuffer() : null))
      .catch(() => null);
  }
  return antonCache;
}

export default async function handler(req) {
  const url = new URL(req.url);
  const state = decodeShareState(url.searchParams.get('s'));
  const rawName = (url.searchParams.get('n') || '').slice(0, 24).trim();
  const days = daysLeft();

  const head = el('div', {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'
  }, [
    txt({ fontSize: 26, letterSpacing: 10, color: GREEN, fontWeight: 700 }, 'PROTOCOLO DOOMSDAY'),
    txt({ fontSize: 24, letterSpacing: 4, color: MUTED }, '17.12.2026')
  ]);

  let middle;
  if (state) {
    const who = rawName ? `${rawName} · ` : '';
    const avg = state.avg === null
      ? 'sem notas ainda'
      : `média ${state.avg.toFixed(1).replace('.', ',')}`;
    middle = el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', alignItems: 'flex-end' }, [
        txt({ fontSize: 190, lineHeight: 1, color: GREEN, fontFamily: 'Anton' }, String(state.pct)),
        txt({ fontSize: 78, lineHeight: 1.6, color: DIM, fontFamily: 'Anton' }, '%')
      ]),
      txt({ fontSize: 36, color: WHITE, marginTop: 14 },
        `${who}${state.done} de ${state.tot} títulos do MCU`),
      txt({ fontSize: 28, color: MUTED, marginTop: 8 }, avg)
    ]);
  } else {
    middle = el('div', { display: 'flex', flexDirection: 'column' }, [
      txt({ fontSize: 116, lineHeight: 1, color: WHITE, fontFamily: 'Anton' }, 'CHECKLIST MCU'),
      txt({ fontSize: 34, color: SILVER, marginTop: 20 },
        '75 títulos em ordem cronológica, do essencial ao opcional'),
      txt({ fontSize: 28, color: MUTED, marginTop: 10 },
        'Progresso, notas, ritmo de maratona e placar entre amigos')
    ]);
  }

  const bar = el('div', {
    display: 'flex', width: '100%', height: 16, backgroundColor: LINE, borderRadius: 8
  }, [
    el('div', {
      display: 'flex',
      width: `${state ? state.pct : 0}%`,
      height: '100%', backgroundColor: GREEN, borderRadius: 8
    }, '')
  ]);

  const foot = el('div', {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'
  }, [
    txt({ fontSize: 27, color: SILVER, letterSpacing: 1 }, 'VINGADORES: DOUTOR DESTINO'),
    txt({ fontSize: 27, color: days ? GREEN : MUTED },
      days ? `faltam ${days} dias` : 'é hoje')
  ]);

  const root = el('div', {
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    width: '100%', height: '100%', padding: '58px 68px',
    backgroundColor: BG,
    backgroundImage: `linear-gradient(160deg, rgba(60,224,126,0.10), rgba(6,9,7,0) 55%)`,
    color: SILVER, fontFamily: 'sans-serif'
  }, state ? [head, middle, bar, foot] : [head, middle, foot]);

  const font = await anton();

  return new ImageResponse(root, {
    width: 1200,
    height: 630,
    fonts: font ? [{ name: 'Anton', data: font, weight: 400, style: 'normal' }] : [],
    headers: {
      // O número de dias muda diariamente; 1h de cache é um meio-termo seguro.
      'cache-control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
