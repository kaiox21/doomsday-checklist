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
import { DOOM_IMAGE } from '../lib/doom-card.js';

export const config = { runtime: 'edge' };

const BG = '#060907', GREEN = '#3CE07E', DIM = '#1E6B41',
      LINE = '#1E2C22', MUTED = '#76867C', SILVER = '#C9D2CD', WHITE = '#EAF2ED';

// Largura útil do texto. O resto dos 1200px fica para a máscara.
const COL = 600;

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
    const avg = state.avg === null
      ? 'sem notas ainda'
      : `média ${state.avg.toFixed(1).replace('.', ',')}`;
    // O nome vai em linha própria: junto da contagem, um nome no limite de 24
    // caracteres quebrava a linha e deixava uma palavra órfã embaixo.
    const lines = [
      el('div', { display: 'flex', alignItems: 'flex-end' }, [
        txt({ fontSize: 190, lineHeight: 1, color: GREEN, fontFamily: 'Anton' }, String(state.pct)),
        txt({ fontSize: 78, lineHeight: 1.6, color: DIM, fontFamily: 'Anton' }, '%')
      ])
    ];
    if (rawName) lines.push(txt({ fontSize: 30, color: GREEN, marginTop: 14 }, rawName));
    lines.push(txt({ fontSize: 33, color: WHITE, marginTop: rawName ? 4 : 14 },
      `${state.done} de ${state.tot} títulos do MCU`));
    lines.push(txt({ fontSize: 27, color: MUTED, marginTop: 8 }, avg));
    middle = el('div', { display: 'flex', flexDirection: 'column' }, lines);
  } else {
    // Tudo aqui é dimensionado para caber na coluna de 600px sem quebrar
    // linha — com a máscara ocupando a direita, o texto não tem para onde
    // crescer sem colidir com o rodapé.
    middle = el('div', { display: 'flex', flexDirection: 'column' }, [
      txt({ fontSize: 86, lineHeight: 1, color: WHITE, fontFamily: 'Anton' }, 'CHECKLIST MCU'),
      txt({ fontSize: 30, color: SILVER, marginTop: 20 },
        '75 títulos em ordem cronológica'),
      txt({ fontSize: 25, color: MUTED, marginTop: 10 },
        'Progresso, notas e ritmo de maratona')
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

  // A máscara sangra pela direita. O texto fica numa coluna à esquerda com
  // largura fixa, para nunca cair por cima do rosto seja qual for o conteúdo.
  const mask = {
    type: 'img',
    props: {
      src: DOOM_IMAGE,
      width: 630,
      height: 630,
      style: { position: 'absolute', top: 0, right: 0 }
    }
  };

  // Escurece da esquerda para a direita: o texto assenta no preto sólido e a
  // máscara emerge da penumbra em vez de terminar num corte reto.
  //
  // O trecho 100% opaco vai até 50% (600px) de propósito: a borda esquerda da
  // imagem cai em 570px, então fica coberta. Sem isso, sobra uma emenda
  // vertical nítida onde o JPEG começa.
  const scrim = el('div', {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    backgroundImage:
      'linear-gradient(90deg, ' +
      `${BG} 0%, ${BG} 50%, rgba(6,9,7,0.62) 66%, ` +
      'rgba(6,9,7,0.20) 84%, rgba(6,9,7,0) 100%)'
  }, '');

  const content = el('div', {
    position: 'absolute', top: 0, left: 0,
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    width: COL + 136, height: '100%', padding: '58px 68px'
  }, state ? [head, middle, bar, foot] : [head, middle, foot]);

  const root = el('div', {
    position: 'relative', display: 'flex',
    width: '100%', height: '100%',
    backgroundColor: BG,
    backgroundImage: 'linear-gradient(160deg, rgba(60,224,126,0.10), rgba(6,9,7,0) 55%)',
    color: SILVER, fontFamily: 'sans-serif'
  }, [mask, scrim, content]);

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
