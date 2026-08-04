// ============================================================
// Catálogo de títulos do Protocolo Doomsday.
// Editar aqui é tudo que você precisa para mudar a lista.
//
// Formato de cada item:
//   [0] id            — chave curta e única (usada no localStorage e nas conquistas)
//   [1] título        — nome exibido
//   [2] detalhes      — linha secundária (tipo · ano · duração · plataforma)
//   [3] prioridade    — "E" essencial · "R" recomendado · "O" opcional
//   [4] sinopse       — resumo sem spoiler, exibido no botão ⓘ
//   [5] minutos       — duração total, usada no cálculo de ritmo
//   [6] lançamento    — aaaamm, usado na ordenação por data de estreia
//   [7] plataforma    — "D" Disney+ · "N" Netflix · "C" Cinemas
//   [8] estreiaFutura — ISO (aaaa-mm-dd), opcional: trava o item até a data
// ============================================================
window.DOOMSDAY_DATA =
[
{g:"Origens · 1942–1995",items:[
["cap1","Capitão América: O Primeiro Vingador","Filme · 1943–45 · 124 min · Disney+","R","Na 2ª Guerra Mundial, o franzino Steve Rogers recebe o soro do supersoldado e enfrenta a Hydra e o Caveira Vermelha — até cair no gelo com o Tesseract.",124,201107,"D"],
["olhos","Olhos de Wakanda","Animação · Antiguidade–1896 · 4 ep · Disney+","O","Antologia animada sobre os Cães de Guerra, guerreiros wakandanos enviados através dos séculos para recuperar artefatos de vibranium roubados.",100,202508,"D"],
["agcarter","Agente Carter (One-Shot)","Curta · 1946 · 15 min","O","No pós-guerra, Peggy Carter prova seu valor em uma missão solo da SSR — o embrião da fundação da S.H.I.E.L.D.",15,201309,"D"],
["cmarvel","Capitã Marvel","Filme · 1995 · 123 min · Disney+","O","Nos anos 90, Carol Danvers recupera memórias de sua vida na Terra e descobre o alcance de seus poderes cósmicos em meio à guerra entre Kree e Skrulls.",123,201903,"D"]]},
{g:"Fase 1 · A era dos heróis",items:[
["im1","Homem de Ferro","Filme · 2010 · 126 min · Disney+","O","Sequestrado por terroristas, o magnata das armas Tony Stark constrói uma armadura para escapar — e decide virar algo maior: o Homem de Ferro.",126,200805,"D"],
["im2","Homem de Ferro 2","Filme · 2011 · 124 min · Disney+","O","Tony lida com o legado do pai, a pressão do governo pela sua tecnologia e o vingativo Ivan Vanko (Whiplash). Estreia da Viúva Negra.",124,201005,"D"],
["hulk","O Incrível Hulk","Filme · 2011 · 112 min · Disney+","O","Bruce Banner foge do general Ross enquanto busca uma cura para o monstro que carrega — até precisar dele para deter o Abominável.",112,200806,"D"],
["thor1","Thor","Filme · 2011 · 115 min · Disney+","O","Banido de Asgard por arrogância, Thor cai na Terra sem poderes e precisa reaprender a ser digno do Mjölnir — enquanto Loki trama no trono.",115,201105,"D"],
["aveng1","Os Vingadores","Filme · 2012 · 143 min · Disney+ · Loki e o Tesseract","R","Loki rouba o Tesseract e abre um portal alienígena sobre Nova York. Os heróis se unem pela primeira vez — e a fuga de uma variante de Loki nesse dia origina a série que cria o multiverso.",143,201205,"D"]]},
{g:"Fase 2",items:[
["thor2","Thor: O Mundo Sombrio","Filme · 2013 · 112 min · Disney+","O","Thor enfrenta os Elfos Negros e o Éter (a Joia da Realidade) ao lado de Jane Foster — e de um Loki prisioneiro cheio de segundas intenções.",112,201311,"D"],
["im3","Homem de Ferro 3","Filme · 2012–13 · 130 min · Disney+","O","Abalado após a batalha de Nova York, Tony enfrenta crises de ansiedade, o misterioso Mandarim e a vida sem depender da armadura.",130,201305,"D"],
["cap2","Capitão América: O Soldado Invernal","Filme · 2014 · 136 min · Disney+ · Bucky e Sam","R","Steve descobre que a Hydra infiltrou a S.H.I.E.L.D. por dentro — e que o assassino Soldado Invernal é seu amigo Bucky. Estreia de Sam Wilson, o Falcão.",136,201404,"D"],
["gotg1","Guardiões da Galáxia","Filme · 2014 · 121 min · Disney+","O","O ladrão espacial Peter Quill e um bando de foras-da-lei se unem para impedir que Ronan use a Joia do Poder para destruir um planeta.",121,201408,"D"],
["gotg2","Guardiões da Galáxia Vol. 2","Filme · 2014 · 136 min · Disney+","O","Os Guardiões encontram Ego, o pai celestial de Quill — e descobrem que família é o que se escolhe, não o que se herda.",136,201705,"D"],
["groot","Eu Sou Groot (T1+T2)","Curtas · 2014 · 10 ep · Disney+","O","Curtas animados com as travessuras do bebê Groot pela galáxia entre as aventuras dos Guardiões.",30,202208,"D"],
["ultron","Vingadores: Era de Ultron","Filme · 2015 · 141 min · Disney+ · Visão e Wanda","R","Uma IA criada por Tony decide que a paz exige exterminar a humanidade. Nascem o Visão, Wanda e Pietro Maximoff — peças-chave de WandaVision e VisionQuest.",141,201505,"D"],
["ant1","Homem-Formiga","Filme · 2015 · 117 min · Disney+ · Scott Lang","R","O ladrão Scott Lang veste o traje encolhedor de Hank Pym para impedir que a tecnologia Pym caia em mãos erradas. Origem do herói que está em Doomsday.",117,201507,"D"]]},
{g:"Defensores · Séries Netflix (cânone)",items:[
["dd","Demolidor (T1–T3)","Série · 2015–18 · 39 ep · Disney+ · base de Renascido","R","O advogado cego Matt Murdock combate o crime no Hell's Kitchen como Demolidor, em guerra pessoal contra Wilson Fisk, o Rei do Crime. Base direta de Demolidor: Renascido.",1950,201504,"D"],
["jj","Jessica Jones (T1–T3)","Série · 2015–19 · Disney+","O","Detetive particular com superforça e passado traumático, Jessica enfrenta Kilgrave, um homem capaz de controlar mentes com a voz.",1950,201511,"D"],
["lc","Luke Cage (T1–T2)","Série · 2016–18 · Disney+","O","Com pele à prova de balas, Luke Cage vira o protetor relutante do Harlem contra o crime organizado local.",1300,201609,"D"],
["if","Punho de Ferro (T1–T2)","Série · 2017–18 · Disney+","O","Danny Rand retorna da cidade mística de K'un-Lun com o poder do Punho de Ferro para retomar a empresa da família e enfrentar o Tentáculo.",1150,201703,"D"],
["def","Os Defensores","Minissérie · 2017 · 8 ep · Disney+","O","Demolidor, Jessica Jones, Luke Cage e Punho de Ferro se unem a contragosto para derrubar a organização Tentáculo em Nova York.",400,201708,"D"],
["pun","O Justiceiro (T1–T2)","Série · 2017–19 · Disney+","O","Frank Castle caça implacavelmente os responsáveis pela morte de sua família — e descobre uma conspiração militar mais funda.",1430,201711,"D"]]},
{g:"Fase 3 · Rumo ao infinito",items:[
["civil","Capitão América: Guerra Civil","Filme · 2016 · 147 min · Disney+","R","O Acordo de Sokóvia racha os Vingadores ao meio: Tony contra Steve, com o Barão Zemo manipulando tudo nos bastidores. Estreias de Pantera Negra e Homem-Aranha no MCU.",147,201605,"D"],
["bw","Viúva Negra","Filme · 2016 · 134 min · Disney+ · Yelena e Guardião Vermelho","R","Foragida após Guerra Civil, Natasha reencontra sua 'família' russa — Yelena, Melina e o Guardião Vermelho — para derrubar a Sala Vermelha. Origem de dois nomes do elenco de Doomsday.",134,202107,"D"],
["bp1","Pantera Negra","Filme · 2016 · 134 min · Disney+ · Shuri e M'Baku","R","T'Challa assume o trono de Wakanda e enfrenta Killmonger, que quer usar o vibranium para uma revolução global. Estreias de Shuri e M'Baku.",134,201802,"D"],
["sp1","Homem-Aranha: De Volta ao Lar","Filme · 2016 · 133 min · Netflix","O","Peter Parker equilibra o colégio e a vida de herói de bairro enquanto enfrenta o Abutre, sob a mentoria (e vigilância) de Tony Stark.",133,201707,"N"],
["dstr","Doutor Estranho","Filme · 2016–17 · 115 min · Disney+","R","O cirurgião arrogante Stephen Strange perde o uso das mãos e encontra as artes místicas em Kamar-Taj — a introdução da magia e das dimensões no MCU.",115,201611,"D"],
["ragna","Thor: Ragnarok","Filme · 2017 · 130 min · Disney+","O","Preso no planeta-lixão Sakaar, Thor precisa escapar com Hulk e Loki para impedir que sua irmã Hela consuma Asgard.",130,201711,"D"],
["ant2","Homem-Formiga e a Vespa","Filme · 2018 · 118 min · Disney+ · Ghost","O","Scott, Hope e Hank tentam resgatar Janet do Reino Quântico enquanto são caçados pela intangível Ghost — que reaparece em Thunderbolts* e Doomsday.",118,201807,"D"],
["iw","Vingadores: Guerra Infinita","Filme · 2018 · 149 min · Disney+","E","Thanos cruza o universo reunindo as seis Joias do Infinito. Pela primeira vez, os heróis perdem — e metade de toda a vida vira pó.",149,201804,"D"],
["endgame","Vingadores: Ultimato","Filme · 2018/2023 · 181 min · Disney+ · origem da variante de Loki","E","Cinco anos após o estalo, os Vingadores executam o 'assalto no tempo' para desfazer Thanos. O desfecho da Saga do Infinito — e o acidente que solta a variante de Loki no multiverso.",181,201904,"D"]]},
{g:"Fase 4 · O multiverso desperta",items:[
["loki","Loki (T1+T2)","Série · AVT, fora do tempo · 12 ep · Disney+ · lista oficial da Disney","E","Capturado pela AVT após escapar em 2012, Loki descobre quem realmente controla o tempo. A série que cria o multiverso, a TVA e as regras de toda a Saga atual — a peça nº 1 para Doomsday.",600,202106,"D"],
["whatif","What If...? (T1–T3)","Animação · Multiverso · Disney+","R","O Vigia narra realidades alternativas: e se momentos-chave do MCU tivessem acontecido de outro jeito? Um tour guiado pelos conceitos do multiverso.",810,202108,"D"],
["zombies","Marvel Zombies","Animação · 2025 · 4 ep · Disney+","O","Em um universo alternativo devastado, heróis transformados em mortos-vivos caçam os poucos sobreviventes.",120,202509,"D"],
["wanda","WandaVision","Série · 2023 · 9 ep · Disney+","R","Presa numa sitcom idílica em Westview, Wanda esconde um luto devastador. A origem da Feiticeira Escarlate — e o ponto de partida da trilogia que termina em VisionQuest.",360,202101,"D"],
["shang","Shang-Chi e a Lenda dos Dez Anéis","Filme · 2023 · 132 min · Disney+ · lista oficial da Disney","E","Shang-Chi confronta o pai, Wenwu, líder milenar da organização dos Dez Anéis, e abraça seu destino na vila mística de Ta Lo. Shang-Chi está confirmado em Doomsday.",132,202109,"D"],
["falcao","Falcão e o Soldado Invernal","Série · 2024 · 6 ep · Disney+ · Agente Americano e Torres","R","Sam Wilson hesita em assumir o escudo enquanto enfrenta os Apátridas e vê o governo entregar o título a John Walker — o futuro Agente Americano. Estreia de Joaquín Torres.",300,202103,"D"],
["sp2","Homem-Aranha: Longe de Casa","Filme · 2024 · 129 min · Netflix/Prime","O","Em excursão pela Europa, Peter enfrenta as ilusões de Mysterio — e termina com sua identidade secreta exposta ao mundo.",129,201907,"N"],
["eternos","Eternos","Filme · 2024 · 156 min · Disney+","O","Seres imortais que moldaram a civilização humana em segredo se reúnem contra os Deviantes — e descobrem o verdadeiro propósito de sua missão na Terra.",156,202111,"D"],
["nwh","Homem-Aranha: Sem Volta para Casa","Filme · 2024 · 148 min · Netflix · multiverso","R","Um feitiço de Strange dá errado e vilões (e Aranhas) de outros universos invadem o MCU. O multiverso escancarado para o grande público — com retorno do Demolidor.",148,202112,"N"],
["mom","Doutor Estranho no Multiverso da Loucura","Filme · 2024 · 126 min · Disney+","R","Strange e America Chavez fogem através de universos da Feiticeira Escarlate corrompida pelo Darkhold. As regras (e os perigos) das incursões multiversais.",126,202205,"D"],
["hawk","Gavião Arqueiro","Série · Natal 2024 · 6 ep · Disney+ · Kingpin e Yelena","O","No Natal nova-iorquino, Clint Barton treina a jovem Kate Bishop enquanto seu passado como Ronin o alcança — com Yelena em caçada e Kingpin nas sombras.",270,202111,"D"],
["moon","Cavaleiro da Lua","Série · 2025 · 6 ep · Disney+","O","Marc Spector e Steven Grant dividem o mesmo corpo a serviço do deus lunar Khonshu, contra o culto do fanático Arthur Harrow.",300,202203,"D"],
["wakanda2","Pantera Negra: Wakanda Para Sempre","Filme · 2025 · 161 min · Disney+ · lista oficial · Namor e Namora","E","Wakanda, de luto por T'Challa, entra em rota de colisão com Namor e o reino submarino de Talokan. Shuri assume o manto — e Namor, Namora e Riri Williams estreiam aqui.",161,202211,"D"],
["echo","Echo","Série · 2025 · 5 ep · Disney+","O","Maya Lopez retorna a Oklahoma para acertar contas com Kingpin — e se reconectar com o legado ancestral Choctaw de sua família.",225,202401,"D"],
["shehulk","Mulher-Hulk: Defensora de Heróis","Série · 2025 · 9 ep · Disney+","O","A advogada Jennifer Walters ganha os poderes do primo Bruce e passa a defender super-humanos no tribunal — quebrando a quarta parede no caminho.",315,202208,"D"],
["msmarvel","Ms. Marvel","Série · 2025 · 6 ep · Disney+","O","A fã de super-heróis Kamala Khan descobre poderes ligados a um bracelete de família e à dimensão Noor, em Jersey City.",270,202206,"D"],
["thor4","Thor: Amor e Trovão","Filme · 2025 · 119 min · Disney+","O","Thor enfrenta Gorr, o Carniceiro dos Deuses, ao lado de uma Jane Foster empunhando o Mjölnir como a Poderosa Thor.",119,202207,"D"],
["iron","Coração de Ferro","Série · 2025 · 6 ep · Disney+ · Riri Williams","O","De volta a Chicago, Riri Williams constrói sua própria armadura e cruza com Parker Robbins, o místico Capuz — tecnologia contra magia.",270,202506,"D"],
["werewolf","Lobisomem na Noite","Especial · 2025 · 53 min · Disney+","O","Em uma noite gótica em preto e branco, caçadores de monstros disputam uma relíquia — e um deles esconde um segredo peludo.",53,202210,"D"],
["gotgx","Guardiões: Especial de Festas","Especial · 2025 · 44 min · Disney+","O","Drax e Mantis sequestram Kevin Bacon na Terra para animar o Natal de Peter Quill. Curto, leve e natalino.",44,202211,"D"],
["quant","Homem-Formiga e a Vespa: Quantumania","Filme · 2025 · 124 min · Disney+ · Cassie Lang","R","A família Formiga inteira é sugada ao Reino Quântico, onde enfrenta Kang, o Conquistador. Cassie Lang vira heroína — e está no elenco de Doomsday.",124,202302,"D"],
["gotg3","Guardiões da Galáxia Vol. 3","Filme · 2025 · 150 min · Disney+","O","Com Rocket entre a vida e a morte, os Guardiões enfrentam o Alto Evolucionário em sua última missão como equipe.",150,202305,"D"]]},
{g:"Fase 5 · A convergência",items:[
["secreta","Invasão Secreta","Série · 2026 · 6 ep · Disney+","O","Nick Fury retorna à Terra para desmontar uma infiltração de Skrulls rebeldes nos mais altos escalões dos governos humanos.",300,202306,"D"],
["marvels","As Marvels","Filme · 2026 · 105 min · Disney+ · pós-créditos com o Fera","O","Carol Danvers, Monica Rambeau e Kamala Khan trocam de lugar a cada uso de poderes. A cena pós-créditos apresenta o Fera de Kelsey Grammer — hoje no elenco de Doomsday.",105,202311,"D"],
["agatha","Agatha Desde Sempre","Série · 2026 · 9 ep · Disney+ · ponte para VisionQuest","R","Sem poderes, Agatha Harkness percorre a lendária Estrada das Bruxas ao lado de um adolescente misterioso ligado a Wanda. Ponte direta para VisionQuest.",360,202409,"D"],
["dpw","Deadpool & Wolverine","Filme · Multiverso · 128 min · Disney+ · mutantes da Fox e Gambit","R","Deadpool arrasta um Wolverine falido por uma odisseia multiversal na AVT. A porta de entrada oficial dos mutantes da Fox no MCU — com estreia do Gambit de Channing Tatum.",128,202407,"D"],
["ddborn1","Demolidor: Renascido (T1)","Série · 2026 · 9 ep · Disney+","R","Matt Murdock tenta viver apenas como advogado enquanto Wilson Fisk se elege prefeito de Nova York — até a máscara se tornar inevitável de novo.",450,202503,"D"],
["capbnw","Capitão América: Admirável Mundo Novo","Filme · 2027 · 118 min · Disney+ · lista oficial da Disney","E","Sam Wilson, já como Capitão América, desvenda uma conspiração em torno do presidente Ross — que se transforma no Hulk Vermelho. Sam e Torres estão em Doomsday.",118,202502,"D"],
["tbolts","Thunderbolts* (Novos Vingadores)","Filme · 2027 · 126 min · Disney+ · lista oficial · Sentinela/Bob","E","Anti-heróis descartáveis — Yelena, Bucky, Guardião Vermelho, Ghost e Agente Americano — viram os Novos Vingadores após o surgimento do instável Sentinela. Doomsday se passa ~14 meses depois.",126,202505,"D"]]},
{g:"Fase 6 · Reta final 2026",items:[
["f4","Quarteto Fantástico: Primeiros Passos","Filme · Terra-828 (1964) · 115 min · Disney+ · leva direto a Doomsday","E","Na retrô-futurista Terra-828, a primeira família da Marvel enfrenta Galactus e o Surfista Prateado. A única aparição de Reed, Sue, Johnny e Ben antes do filme — e a cena final conecta direto a Doomsday.",115,202507,"D"],
["wonderman","Wonder Man","Série · jan/2026 · 8 ep · Disney+","O","Sátira de Hollywood: o ator Simon Williams disputa o papel de um super-herói no cinema... tendo poderes de verdade.",280,202601,"D"],
["ddborn2","Demolidor: Renascido (T2)","Série · mar–mai/2026 · 9 ep · Disney+","R","As consequências do reinado de Fisk sobre Nova York explodem — e a temporada prepara o terreno para o novo Homem-Aranha.",450,202603,"D"],
["punlast","O Justiceiro: Uma Última Morte","Especial · mai/2026 · Disney+","O","Especial brutal de Frank Castle em uma última caçada — desdobramento direto de Demolidor: Renascido.",90,202605,"D"],
["spbnd","Homem-Aranha: Um Novo Dia","Filme · jul/2026 · 145 min · ainda nos cinemas","R","Esquecido por todos após Sem Volta para Casa, Peter recomeça do zero nas ruas de NY — cruzando com Hulk, Demolidor e Justiceiro.",145,202607,"C"],
["xmen97","X-Men '97 (T2)","Animação · jul/2026 · Disney+","O","Continuação direta da animação clássica dos X-Men dos anos 90, em seu próprio universo — clima perfeito para o retorno dos mutantes.",300,202607,"D"],
["vision","VisionQuest","Série · out/2026 · 8 ep · Disney+ · conclui a trilogia da Wanda/Visão","R","O Visão Branco busca suas memórias e sua humanidade. Encerra a trilogia iniciada em WandaVision — com o retorno de Ultron na voz de James Spader.",360,202610,"D","2026-10-14"]]},
{g:"Arquivo Fox · X-Men originais no elenco",items:[
["x1","X-Men: O Filme (2000)","Filme · 104 min · Disney+ · Prof. X, Magneto, Ciclope, Mística","R","Os mutantes emergem: Xavier recruta Wolverine e Vampira enquanto Magneto planeja 'mutar' os líderes mundiais à força. Estreia de 4 dos 6 veteranos que retornam em Doomsday.",104,200007,"D"],
["x2","X-Men 2 (X2)","Filme · 2003 · 134 min · Disney+ · única aparição do Noturno","R","O coronel Stryker invade a escola de Xavier, forçando X-Men e a Irmandade de Magneto a uma aliança. A ÚNICA aparição do Noturno de Alan Cumming — indispensável.",134,200305,"D"],
["x3","X-Men: O Confronto Final","Filme · 2006 · 104 min · Disney+ · estreia do Fera","R","Uma 'cura mutante' e o retorno de Jean Grey como a Fênix racham a comunidade mutante. Estreia do Fera de Kelsey Grammer no cinema.",104,200605,"D"],
["dofp","X-Men: Dias de um Futuro Esquecido","Filme · 2014 · 132 min · Disney+ · une as duas gerações","E","Wolverine é enviado a 1973 para impedir o futuro apocalíptico dos Sentinelas. O filme que une as duas gerações de elenco e reescreve a linha do tempo da trilogia original.",132,201405,"D"],
["logan","Logan","Filme · 2029 (interno) · 137 min · Disney+","O","Em 2029, um Logan envelhecido e um Xavier doente protegem a jovem X-23 na jornada final do Wolverine da era Fox.",137,201703,"D"],
["dp1","Deadpool","Filme · 2016 · 108 min · Disney+","O","O mercenário tagarela Wade Wilson, desfigurado por um experimento, caça o responsável — quebrando a quarta parede o tempo todo.",108,201602,"D"],
["dp2","Deadpool 2","Filme · 2018 · 119 min · Disney+","O","Deadpool monta a X-Force para proteger um jovem mutante do viajante do tempo Cable.",119,201805,"D"]]}
];
