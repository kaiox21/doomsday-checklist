# Protocolo Doomsday — Checklist MCU

Checklist cronológico do Universo Cinematográfico Marvel para chegar preparado a **Vingadores: Doutor Destino** (17/12/2026). O progresso vive no `localStorage` do seu navegador — sem conta, sem senha, sem servidor no meio.

No ar em **[guia.doomsday.sbs](https://guia.doomsday.sbs)**.

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
- **Veredicto da maratona**: média das suas notas, estatísticas por era e um resumo pronto pra copiar.
- **Link do progresso** — gera uma URL com o seu estado embutido. Quem abrir vê onde você está e pode importar.
- **Placar do grupo** — ranking entre quem publicar o progresso. Só nome, porcentagem e média.
- **Instalável (PWA)** — dá pra colocar na tela de início do celular e usar offline.
- **Exportar / importar** o progresso em JSON, pra backup ou pra levar a outro navegador.

## Estrutura

```
index.html      página inteira: layout, estilos e lógica
data.js         catálogo dos 75 títulos — mexa aqui pra mudar a lista
sw.js           service worker (offline)
manifest.json   metadados de PWA
lib/            código compartilhado entre as funções serverless
api/og.js       imagem de preview gerada na hora
api/share.js    página de compartilhamento com as meta tags certas
api/board.js    placar do grupo (Redis)
scripts/        utilitários de desenvolvimento, fora do site
```

## Rodando localmente

O site continua funcionando com um duplo-clique:

```bash
open index.html
```

O placar precisa de HTTP e das funções da Vercel, então nesse modo ele aparece desligado — o resto funciona igual. Pra servir por HTTP:

```bash
npm run dev     # python3 -m http.server 8000
```

### Utilitários

```bash
npm install                 # só é preciso para os dois comandos abaixo
npm run og                  # renderiza os cards do /api/og em scripts/out/
node scripts/test-share.js  # testa o ida-e-volta do link de progresso
```

O `test-share.js` extrai as funções reais do `index.html` e confere que o que o navegador codifica é exatamente o que as funções serverless decodificam. Vale rodar depois de qualquer mexida no `data.js` ou na codificação.

## Deploy

Site estático com funções na pasta `api/`. Na Vercel: **Add New → Project**, importe o repositório, Framework Preset **Other**, sem build command. Cada push na `main` gera um deploy.

### Domínio

Em **Settings → Domains**, adicione `guia.doomsday.sbs`. Na Hostinger (que hospeda o DNS), crie um registro `CNAME` com nome `guia` apontando para `cname.vercel-dns.com`.

### Ligando o placar

O placar fica desligado até existir um banco. Em **Storage → Create Database → Upstash for Redis**, crie e conecte ao projeto. Isso injeta `KV_REST_API_URL` e `KV_REST_API_TOKEN` (as variáveis do Upstash direto também servem), e o `api/board.js` passa a responder. Sem elas, ele devolve `501` e a página mostra um aviso no lugar da lista.

## Como funciona o link de progresso

O estado vira uma sequência compacta de bytes — `[versão][total][checksum do catálogo][bitmap de assistidos][notas em nibbles]` — codificada em base64url. São ~72 caracteres para os 75 títulos. **Anotações de texto não entram**: elas nunca saem do seu navegador.

O checksum serve para detectar quando o catálogo mudou desde que o link foi gerado; nesse caso a página avisa em vez de embaralhar os títulos em silêncio.

Como o `index.html` é estático, as meta tags dele não podem variar por pessoa — e o `#fragmento` nem chega ao servidor. Por isso o botão gera um link para `/api/share?s=...`, que devolve um HTML mínimo com as meta tags certas (para o preview do WhatsApp/Twitter) e redireciona o visitante para `/#s=...`.

## Detalhes técnicos

- HTML + CSS + JavaScript puro. Sem framework, sem etapa de build, sem bundler.
- Única dependência do site: as fontes Anton e Archivo via Google Fonts. O `@vercel/og` só é usado pelas funções serverless.
- Persistência em `localStorage`, na chave `doomsday-checklist`.
- Layout responsivo, com `prefers-reduced-motion` respeitado.
- O `api/og.js` monta os elementos como objetos simples em vez de JSX, o que evita precisar de transpilação num projeto sem build.

## Aviso

Projeto de fã, sem qualquer vínculo com a Marvel Studios ou a Disney. Títulos, sinopses e datas são informativos e podem mudar conforme os estúdios anunciarem alterações no calendário.
