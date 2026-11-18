# Landing page do Ora: análise das duas versões e plano de melhoria (v3)

Data: 18 de novembro de 2026
Versões analisadas: `anterior.html` (redesign-v2, com GSAP e abertura cinematográfica) e `index.html` (versão atual, com o arco da cúpula e sem GSAP), servidas em `http://127.0.0.1:8763/`.
Medição: navegador a 1440×900 e 375×812, console sem erros nas duas.

Skills e referências usadas como régua:

- `redesign-existing-projects` e `design-taste-frontend` (taste-skill, Leonxlnx): auditoria de tipografia, cor, layout, estados e conteúdo.
- `emilkowalski/skills` (`improve-animations/AUDIT.md`, `choreograph`, `review-animations`, `animation-performance`): propósito, easing, duração, desempenho e acessibilidade de cada animação.
- `diego3g/craft` (`craft-critique/references/rules.md`): hierarquia, estabilidade de layout, contraste e consistência.
- `benjitaylor/skills` (`stageshow`): como construir uma interface simulada que pareça produto de verdade.
- `amirmushichge/cinematic-scroll-prompt-kit` (`PROMPT.txt`): arquitetura de cena única conduzida pela rolagem, com motor de linha do tempo determinístico.
- `greensock/GSAP`: ScrollTrigger, SplitText e `matchMedia`, já presentes em `assets/vendor/`.
- `details.so/inspo`: galeria de detalhes reais. Categorias mais próximas do Ora: Editorial, Pinned Scroll, Text Showcase, Section Transition e Stacked Scroll. A página não expõe os valores de movimento; vale abrir os vídeos para calibrar.

---

## 1. Veredito em uma linha

A versão atual acertou a estrutura (a mensagem e o botão aparecem no primeiro segundo, a faixa de navegadores resolve "funciona no meu?"), mas perdeu o movimento e o momento marcante. A anterior tinha o momento, mas escondia a mensagem por 2 a 3 segundos e pesava. **O caminho é usar `index.html` como base e trazer de volta um único momento cinematográfico, mais curto, sobre um sistema de movimento refeito.**

## 2. Comparação lado a lado

| Aspecto | `anterior.html` | `index.html` | Melhor |
| --- | --- | --- | --- |
| Altura total (1440×900) | 7.489 px | 6.285 px | nenhuma: ambas curtas para o que o produto tem |
| Primeira dobra | Foto do altar em tela cheia; na primeira visita o título só aparece depois de ~2–3 s | Título, texto, dois botões e o arco, tudo visível de imediato | atual |
| Mensagem do título | "Cada nova aba, um convite à oração e ao foco." (diz o que é) | "Um tempo para rezar. Outro para agir." (diz o benefício, mas não diz que é uma extensão) | anterior no "o quê", atual no tom |
| Botão principal | "Adicionar ao Chrome" (vai direto à loja) | "Instalar o Ora" leva a `#instalar`, que leva à loja: um clique a mais | anterior |
| Navegadores | Só no final | Faixa logo abaixo da hero | atual |
| Momento marcante | Aba comum se dissolve no Ora e a foto recua até virar a janela | Nenhum; o arco tem só um leve zoom em CSS | anterior |
| Movimento por seção | Títulos em linhas mascaradas, blocos que sobem, frase com palavras que acendem | Nenhum (os atributos `data-split` e `data-reveal` ficaram no HTML sem script que os use) | anterior |
| Peso de JS | ~126 KB de GSAP + `motion.js` | Só `site.js` | atual |
| Demonstração | Igual nas duas (3.464 px, 4 momentos) | Igual | empate |
| Frutos | Captura estática | Captura estática | empate, ambas fracas |
| Instalação | Medalhão com cruz | Foto do altar em arco | atual |
| Textos desatualizados | "Versão 1.1.5 na loja… 1.2.0 em desenvolvimento" | Corrigidos | atual |

## 3. Diagnóstico da versão atual, seção por seção

### 3.1 Hero

O que funciona: cabe na primeira tela, um único foco de leitura, contraste bom, arco com proporção tirada das janelas da cúpula (detalhe de ofício que dá identidade).

Problemas:

1. **O título não diz o que o Ora é.** "Um tempo para rezar. Outro para agir." é bonito, mas quem chega de um anúncio não sabe que é uma extensão de nova aba até ler o kicker em 11 px. A regra do craft "One thing wins the first glance" falha: o que vence é o arco. Sugestão: manter o título e trazer "extensão gratuita para a nova aba do navegador" para a primeira linha do texto de apoio, ou mostrar o arco dentro de uma aba de navegador (ver 5.1).
2. **Botão principal com um passo a mais.** Detectar o navegador (`navigator.userAgent` / `userAgentData`) e apontar direto para a loja certa: "Adicionar ao Chrome", "Adicionar ao Firefox", "Adicionar ao Edge". `#instalar` continua como link secundário.
3. **No celular o botão principal é "Instalar o Ora", mas a extensão não roda no celular.** Trocar por "Experimentar a demonstração" como ação principal e "Enviar o link para o computador" (abre o compartilhamento nativo ou copia o link) como secundária.
4. **Duas horas diferentes na mesma página.** A hero mostra a hora real (08:13) e a demonstração fixa 09:41. Escolher uma: hora real nos dois lugares é mais convincente.
5. **Tracking do título exagerado.** `letter-spacing: -.067em` na Literata a 87 px aproxima demais as serifas ("tempo", "para"). Testar entre `-.035em` e `-.045em`.
6. **Legenda do arco a 9 px** (`.58rem`, caixa-alta). Fica abaixo do legível; subir para 11–12 px ou retirar.
7. **Oportunidade do calendário litúrgico.** O Advento começa em 29 de novembro de 2026, daqui a 11 dias. Uma linha real no arco ("Faltam 11 dias para o Advento"), calculada com `LiturgicalCalendar` copiado da extensão, mostra ao vivo um recurso que só o Ora tem e muda a página a cada visita.

### 3.2 Faixa de navegadores

Boa decisão. Ajustes: Edge e Brave apontam para a Chrome Web Store sem explicar; um "via Chrome Web Store" em texto pequeno evita a dúvida. O texto "Disponível para seu navegador" pode virar só os ícones com rótulo, que já dizem isso.

### 3.3 "Um dia com Ora" (demonstração)

É o ativo mais forte da página: uma interface de verdade que o visitante pode usar. A régua do `stageshow` diz que uma interface simulada funciona quando "uma coisa acontece" por quadro e o resto fica quieto; a demonstração já faz isso em boa parte.

Problemas:

1. **Cabeçalho dividido** (título à esquerda, parágrafo pequeno à direita), o padrão que a taste-skill marca como genérico. Empilhar ou cortar o parágrafo para uma linha.
2. **Duas formas de navegar pelos mesmos 4 momentos:** a lista à esquerda e as abas "01 Organizar · 02 Focar…" acima da janela. Ficar com uma (a lista, que já é clicável e tem trilho de progresso).
3. **3.464 px para 4 momentos** é bom no desktop, mas a seção não tem respiro visual: creme do início ao fim. Dá para escurecer o fundo da seção inteira de forma progressiva à medida que o dia avança (manhã creme, foco mais quente, oração noite), sem cortes secos.
4. **Falta o quinto momento, "Encerrar o dia"**, que liga a demonstração a Frutos. Hoje a passagem é um link ("Ver o dia em Frutos").
5. **"Simulação" e "Demonstração interativa · Bloqueio simulado"** aparecem duas vezes. Uma basta.

### 3.4 Frutos

Ainda é uma captura estática de 1800 px reduzida para 741 px: os textos do gráfico ficam ilegíveis. Trocar por um gráfico em HTML que cresce ao entrar na tela, com a tarefa escolhida na demonstração ("Revisar minhas anotações") aparecendo nele. O cartão "Exemplo de síntese" tem duas linhas que não dizem nada ("Na extensão, veja o tempo das suas sessões"); com o gráfico vivo, o cartão pode sumir.

### 3.5 Metade do produto não aparece

Terço interativo, liturgia do dia com arte sacra, exame de consciência, rituais de manhã e noite, sons e tempos litúrgicos cabem numa frase solta ("Ao longo do dia, você também pode…"). É a parte que diferencia o Ora de um Momentum com cruz. Merece uma seção própria, escura, com no máximo três peças grandes (ver 5.3).

### 3.6 Dúvidas

Acordeão funciona e é acessível (`<details>`). A taste-skill sugere alternativa ao acordeão, mas aqui ele é adequado: são perguntas de quem vai instalar. Melhoria: a primeira pergunta deveria ser "É gratuito? Preciso criar conta?", que é a objeção mais comum, e a resposta de privacidade pode citar que não há rastreamento.

### 3.7 Instalação e rodapé

A foto do altar em arco é melhor que o medalhão, mas o arco quase não aparece porque a imagem é larga (o raio de 48% vira só cantos arredondados). Usar a mesma proporção do arco da hero fecha a página com o mesmo símbolo do começo. Falta a nota de quem faz o projeto (`assets/arthur.jpeg` existe e não é usada): uma frase e uma foto dão a confiança que um projeto independente precisa no lugar de prova social que ainda não existe.

### 3.8 Ritmo geral

- Fundo creme contínuo da hero até a instalação; a única mudança é a seção final escura. A skill de redesign chama isso de "seção escura aleatória". Ou se alterna com intenção (creme, noite, creme, noite) ou se escurece de forma progressiva ao longo do "dia".
- Nenhum versículo ou frase-ponte entre seções. Um versículo curto em tipografia grande entre a demonstração e Rezar daria o respiro que Frater e Mapa da Fé usam.

### 3.9 Paleta e a régua da taste-skill

A taste-skill proíbe creme + ocre + tinta escura como escolha automática para marcas "premium". Aqui a exceção da própria skill se aplica: a identidade é litúrgica, de arte sacra e papel de missal, e a extensão já usa esses tons. O risco real é outro: o dourado (`--gold`), o ocre (`#835329`) e o marrom do kicker (`#70502e`) são três acentos quentes próximos. Consolidar em um acento.

---

## 4. Revisão do código das animações

### 4.1 `motion.js` + `motion.css` (abertura cinematográfica, só em `anterior.html`)

| # | Problema | Onde | Por que importa | Correção |
| --- | --- | --- | --- | --- |
| M1 | **O título fica escondido até as fontes carregarem (até 1,5 s) e ainda espera `introDelay` de 1,05 s antes de subir em 1,05 s.** Na primeira visita a mensagem só fica legível depois de ~2–3,5 s. Visto na captura: aos 3 s havia só a foto. | `motion.css:5-9`, `motion.js:21`, `:71`, `:113` | É o maior custo da versão anterior: a primeira impressão é uma foto sem texto. Atrasa o LCP do texto e, se o GSAP falhar no meio (não no carregamento), o texto fica invisível. | O título nunca espera a abertura. A abertura acontece por trás dele (foto saindo do desfoque), e o título entra em até 300 ms. Trocar `visibility: hidden` por um estado inicial em CSS que se resolve sozinho (por exemplo, `@starting-style` ou um tempo-limite que revela tudo em 2 s). |
| M2 | **Variáveis CSS no `.hero` conduzem `clip-path`, `transform` e `opacity` de vários filhos a cada quadro de rolagem.** `apply()` escreve quatro variáveis e alterna três classes por quadro. | `motion.js:40-50`, `motion.css:38-89` | Regra do Emil: variável no pai recalcula o estilo de todos os descendentes. Somado a `clip-path` sobre uma imagem de tela cheia com dois gradientes por cima, cada quadro repinta a área toda. | Escrever `transform`/`clip-path` direto nos elementos animados (o próprio GSAP faz isso com `gsap.to(el, { clipPath })` no timeline com `scrub`). Trocar as classes por mudanças só nos limiares, não a cada quadro. |
| M3 | **`filter: blur(18px)` com `scale(1.12)` numa foto de tela cheia por 1,7 s.** | `motion.js:77-78` | Blur animado em área grande é o efeito mais caro que existe, principalmente no Safari e em placas integradas. | Pré-renderizar uma versão desfocada da foto e fazer crossfade entre as duas (só `opacity`), ou limitar o blur a 8 px numa camada menor. |
| M4 | **`100vh` e altura do cabeçalho fixa em 69 px.** | `motion.css:14`, `:28`, `:32`, `:83` | Em janelas com barra de favoritos ou zoom, o recorte final erra. | `100svh` e medir o cabeçalho em `measure()`. |
| M5 | **Dois motores de rolagem paralelos:** ScrollTrigger na hero e um ouvinte de `scroll` próprio na demonstração. | `motion.js:54-59`, `site.js:296` | Duas fontes de verdade para o progresso; não dá para adicionar rolagem suave (Lenis) sem quebrar uma delas. | Uma só: a demonstração passa a usar `ScrollTrigger.create({ onUpdate })` com o mesmo `progress`. |
| M6 | **Palavras que acendem começam em `opacity: .2`.** | `motion.js:135` | No começo da leitura a frase fica abaixo do contraste mínimo (4,5:1). | Começar em `.35`–`.4`, ou acender por cor, não por opacidade. |
| M7 | **Título e apoio com a mesma duração e passos iguais** (`stagger: .11`, `.28`). | `motion.js:113-117` | O `choreograph` pede atrasos que encolhem e tratamentos diferentes: o principal desliza mais, o apoio menos, a decoração só aparece. Passos iguais parecem mecânicos. | Ex.: título 0,7 s com passos de 90 ms, 70 ms; texto de apoio só sobe 8 px; botões só aparecem. |
| M8 | **A abertura roda por sessão, inclusive para quem voltou de outra página do site.** | `motion.js:62-66` | É um momento raro (permitido pelo Emil), mas repetido a cada nova aba do site vira espera. | Guardar em `localStorage` por 30 dias, não em `sessionStorage`. |

Pontos bons que devem ser mantidos: `gsap.matchMedia()` com limpeza completa, porta de movimento reduzido e de tamanho de tela, `SplitText` com `mask: 'lines'` e `autoSplit`, `ScrollTrigger.batch` com `once`, e o fallback que remove `motion`/`cine` quando o script falha.

### 4.2 `site.js` + `site.css` (demonstração, nas duas versões)

| # | Problema | Onde | Correção |
| --- | --- | --- | --- |
| D1 | **Leitura de layout em cada quadro de rolagem:** `getBoundingClientRect()` e `getComputedStyle(stage).top` dentro de `updateTour`. | `site.js` em `updateTour` | Guardar `inset`, topo e altura da trilha em `sizeTour()` (já roda no resize) e calcular o progresso só com `scrollY`. Ou usar o `progress` do ScrollTrigger (M5). |
| D2 | **`--lit` no leitor e `--tour-p` no layout conduzem filhos** (`.prayer-line` com `clamp(.26, calc(var(--lit) * 9.6 - var(--i)), 1)`). | `site.css:658`, `:363` | Mesmo problema de M2, em escala menor. Aceitável hoje (são 7 linhas), mas se a cena crescer, escrever a opacidade de cada linha direto. |
| D3 | **Troca de cena por `@keyframes`** (`scene-in`, `scene-out`). | `site.css:809-818` | Keyframes recomeçam do zero; rolando rápido pelos momentos as cenas reiniciam. O Emil pede transições (que retomam do ponto atual) para o que pode ser interrompido. Usar `transition` com `@starting-style`, ou WAAPI com `cancel()` da animação anterior. |
| D4 | **Pulso infinito em `box-shadow` na aba "Rede social".** | `site.css:826-827` | `box-shadow` não é composto pela GPU; repinta a cada quadro enquanto durar. Fazer o pulso num pseudo-elemento com `transform: scale` e `opacity`, e limitar a 2–3 repetições. |
| D5 | **Estado "armado" do botão usa `scale(.97)`**, que é o vocabulário de botão pressionado. | `site.css:825` | Para "pronto para clicar", usar anel ou brilho sem reduzir o botão. Deixar `scale(.97)` só para `:active`. |
| D6 | **Só 2 estados `:active` na folha toda** (12 `:hover`). | `site.css` | Adicionar retorno de clique em todos os botões: `transform: scale(.97)` com `transition: transform 160ms var(--ease)`. |
| D7 | **Easing duplicado à mão** (`cubic-bezier(.22, .7, .23, 1)` no JS do voo do título e `--ease` no CSS). | `site.js` (voo do título), `site.css:49` | Ler o token do CSS no JS ou centralizar os tokens de movimento num objeto. Criar também `--ease-in-out` para movimentos na tela. |
| D8 | **Saída por `setTimeout(…, 320)`** casada a uma animação de 0,3 s. | `site.js` em `showScene` | Usar `animation.finished` (WAAPI) ou o evento `animationend`, para não dessincronizar. |

Pontos bons: o voo do título do cartão para o foco (FLIP com WAAPI), a pausa automática quando o visitante toca a janela, `requestAnimationFrame` com ouvinte passivo, movimento reduzido tratado na porta do tour e em CSS.

### 4.3 `experiencia.css` (versão atual)

- O único movimento é `dome-drift` com `animation-timeline: view()`. O Firefox não suporta (fica parado, o que é aceitável por causa do `@supports`), e o efeito só acontece quando o arco já está saindo da tela: quase ninguém vê.
- O HTML ainda tem `data-split` e `data-reveal` sem nenhum script que os leia. Ou volta o `motion.js` (sem a parte `cine`), ou os atributos saem.

### 4.4 Sistema de movimento proposto

Um único arquivo de movimento sobre o GSAP que já existe em `assets/vendor/`:

```css
:root {
    --ease-out: cubic-bezier(.23, 1, .32, 1);      /* entradas e saídas */
    --ease-in-out: cubic-bezier(.77, 0, .175, 1);  /* movimento na tela (voo do título, recuo) */
    --dur-press: 160ms;
    --dur-ui: 240ms;
    --dur-scene: 450ms;
    --dur-hero: 700ms;
}
```

Regras:

1. Texto principal nunca espera animação para ficar legível.
2. Só `transform`, `opacity` e `clip-path` (este só na abertura). Nada de `box-shadow`, `filter` grande ou `width` animados.
3. Uma única fonte de progresso de rolagem (ScrollTrigger). Rolagem suave (Lenis) só se for testada com o tour e desligada com movimento reduzido.
4. Entradas de grupo com atrasos que encolhem (100–150 ms no marketing, conforme o `choreograph`), ordem por importância.
5. Movimento reduzido mantém as trocas de opacidade e tira deslocamentos.
6. Nenhuma animação infinita, exceto uma muito sutil no momento principal, e nunca dentro de vidro.

---

## 5. Proposta de página

Base: `index.html`. Altura alvo no desktop: 10 a 12 mil px, próxima de Frater e Saintly, sem encher de seções.

### 5.1 Abertura (o momento marcante, mais curto)

Juntar o melhor das duas: o arco da cúpula continua como símbolo, mas **mora dentro de uma aba de navegador**. Ao rolar os primeiros ~60% de tela, a aba se expande até o arco ocupar a tela inteira, e a demonstração começa daí. É o "recuo" da versão anterior ao contrário, e conta a história certa: "isto é a sua nova aba". Título e botão ficam visíveis desde o primeiro quadro.

### 5.2 Um dia com Ora (demonstração, cinco momentos)

Organizar → Focar → Proteger → Rezar → Encerrar o dia. O fundo da seção acompanha o dia (manhã clara, noite escura no último momento), resolvendo o problema do creme contínuo sem cortes. O último momento entrega a tarefa a Frutos.

### 5.3 Rezar (seção escura nova)

Três peças grandes, cada uma com uma coisa acontecendo:

- **Terço clicável:** as contas acendem uma a uma; a dezena atual aparece em texto.
- **Liturgia do dia:** o Evangelho real do dia (a mesma API da extensão, com cache) ao lado da arte sacra empacotada.
- **Tempo litúrgico:** a coroa do Advento com velas que acendem conforme a data (calculada com `SeasonsCore`).

Formato sugerido: painéis empilhados ao rolar (Stacked Scroll, como em Delta Cafés no details.so), um por peça.

### 5.4 Versículo-ponte

Uma frase curta em tipografia grande, com as palavras acendendo pela rolagem (o efeito M6 corrigido).

### 5.5 Frutos vivo

Gráfico em HTML com a tarefa da demonstração dentro dele, barras que crescem ao entrar na tela, e o campo "Para refletir" digitável.

### 5.6 Quem faz + Dúvidas + Instalação

Nota curta com a foto do autor, dúvidas reordenadas, instalação com o mesmo arco da abertura e o botão da loja detectada.

---

## 6. Prioridades

### Rápidas (meio dia, baixo risco)

- [ ] Botão principal direto para a loja do navegador detectado; no celular, "Experimentar" e "Enviar link".
- [ ] Texto de apoio da hero diz "extensão gratuita para a nova aba".
- [ ] Hora real também na demonstração.
- [ ] Tracking do título, legenda do arco e acentos consolidados.
- [ ] Remover as abas duplicadas acima da janela e a segunda menção a "Simulação".
- [ ] `:active` em todos os botões (D6), pulso da aba sem `box-shadow` (D4), estado "armado" sem `scale` (D5).
- [ ] Decidir sobre `data-split`/`data-reveal`: voltar o `motion.js` só com títulos e entradas (corrigindo M1, M6 e M7) ou remover os atributos.

### Médias (1 a 2 dias)

- [ ] Unificar a rolagem no ScrollTrigger (M5, D1) e trocar keyframes de cena por transições (D3, D8).
- [ ] Linha do tempo litúrgico na hero ("Faltam N dias para o Advento"), antes de 29 de novembro.
- [ ] Frutos vivo.
- [ ] Nota de quem faz o projeto e instalação com o arco.
- [ ] Fundo da demonstração acompanhando o dia.

### Grandes (3 dias ou mais)

- [ ] Abertura "aba que vira arco" (5.1), com M2, M3 e M4 resolvidos desde o início.
- [ ] Seção Rezar com terço, liturgia e Advento.
- [ ] Quinto momento "Encerrar o dia".

## 7. Decisões que dependem de você

1. **Título:** manter "Um tempo para rezar. Outro para agir." (benefício) ou voltar a "Cada nova aba, um convite à oração e ao foco." (explica o produto)? Recomendo manter o atual e explicar no texto de apoio.
2. **Abertura cinematográfica:** volta na forma curta de 5.1, ou a página fica sem momento de abertura?
3. **Rolagem suave (Lenis):** testar ou descartar?
4. **Evangelho do dia ao vivo na landing:** aceitável depender da API `liturgia.up.railway.app` no site (precisa entrar na política de privacidade), ou usar só um texto fixo de exemplo?
5. **Foto e nota do autor:** pode usar `assets/arthur.jpeg`?

## 8. Verificação desta análise

- Conferido no navegador a 1440×900 (as duas versões) e 375×812 (versão atual), sem erros no console.
- Não testado: rolagem contínua com mouse e trackpad (as capturas pularam entre posições), Safari, e movimento reduzido ativado no sistema.
- O atraso do título na versão anterior foi visto numa captura aos 3 s da primeira visita; o tempo exato não foi medido com ferramenta de desempenho.
