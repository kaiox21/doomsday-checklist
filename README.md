# Protocolo Doomsday — Checklist MCU

Checklist cronológico do Universo Cinematográfico Marvel para chegar preparado a **Vingadores: Doutor Destino** (17/12/2026). Uma única página HTML, sem build, sem back-end e sem conta: todo o progresso fica no `localStorage` do seu navegador.

## O que tem dentro

- **75 títulos** organizados em 9 blocos: Origens, Fases 1 a 6, o arco das séries Netflix (Defensores) e o Arquivo Fox dos X-Men.
- **Prioridade por cor** — 🟢 verde = essencial · 🟡 dourado = recomendado · cinza = opcional. Dá pra fazer só o núcleo se o tempo apertar.
- **Contagem regressiva** para a estreia, em dias/horas/minutos.
- **Barra de progresso** com contagem separada por prioridade e nota média.
- **Ritmo da maratona** — quantas horas faltam e quantos minutos por dia você precisa assistir até 17/12, tanto pra ver tudo quanto só o essencial + recomendado.
- **Ficha de cada título** (botão ⓘ): sinopse sem spoiler, duração, plataforma, nota de 0 a 10, anotações livres e marcador de "assistindo agora".
- **Busca e filtros** por título, prioridade, plataforma (Disney+, Netflix, cinemas) e "falta assistir".
- **Duas ordens de exibição**: cronológica (linha do tempo da história) ou por data de lançamento.
- **9 conquistas** — Saga do Infinito, Defensor de NY, Mutante Honorário, Mestre do Multiverso, Latvéria Orgulhosa e outras.
- **Veredicto da maratona**: média das suas notas, estatísticas por era e um resumo pronto pra copiar e compartilhar.
- **Exportar / importar** o progresso em JSON, pra fazer backup ou levar pra outro navegador.

## Rodando localmente

Não precisa de nada instalado — é um arquivo só:

```bash
open index.html
```

Se preferir servir por HTTP:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Deploy na Vercel

Site estático puro, sem configuração. Na Vercel:

1. **Add New → Project** e importe este repositório.
2. Framework Preset: **Other**.
3. Build Command: deixe vazio · Output Directory: deixe vazio (raiz do projeto).
4. **Deploy**.

O `index.html` na raiz já é servido direto. Cada push na branch `main` gera um novo deploy automático.

## Detalhes técnicos

- HTML + CSS + JavaScript puro, tudo em um único arquivo (`index.html`, ~60 KB).
- Única dependência externa: as fontes Anton e Archivo via Google Fonts.
- Persistência em `localStorage`, na chave `doomsday-checklist` — nada é enviado a lugar nenhum, nenhum dado sai do seu navegador.
- Layout responsivo e com `prefers-reduced-motion` respeitado.

## Aviso

Projeto de fã, sem qualquer vínculo com a Marvel Studios ou a Disney. Títulos, sinopses e datas são informativos e podem mudar conforme os estúdios anunciarem alterações no calendário.
