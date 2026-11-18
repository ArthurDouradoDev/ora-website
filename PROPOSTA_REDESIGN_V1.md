# Proposta de evolução da landing page do Ora

Data: 7 de novembro de 2026  
Versão de referência solicitada: `redesign-v1`  
Status: proposta para discussão; implementação não realizada.

## Objetivo

Dar à landing page mais dinâmica, interatividade e qualidade visual, preservando a serenidade do Ora e tornando mais claro como ele reúne oração e foco na nova aba.

A prioridade é apresentar o produto de forma viva e permitir uma pequena experiência antes da instalação. O parallax entra como complemento de profundidade, depois da composição e da demonstração interativa.

## Base e limites da análise

As cinco referências abaixo foram abertas no navegador. A inspeção incluiu suas composições iniciais e trechos acessíveis por rolagem ou navegação. No Mapa da Fé, a interação “Sou eu” foi testada: o progresso passou de 0 para 1 de 4.

Esta não foi uma auditoria completa de animações, desempenho ou responsividade das referências. Não se deve interpretar uma composição em camadas como comprovação de que o site usa parallax.

O arquivo local `index.html` do Ora foi parcialmente consultado. O trecho analisado apresenta título, explicação, botões e uma captura estática no hero. A inspeção visual local ficou bloqueada pelo acesso a endereços `file://`, e a correspondência do arquivo com a versão `redesign-v1` ainda precisa ser confirmada. As recomendações abaixo são uma direção de projeto, sujeita à avaliação visual da versão correta.

## 1. O que aproveitar das referências

| Referência | Observação da inspeção | Aplicação proposta ao Ora |
| --- | --- | --- |
| [Plano de Vida — Editora Constante](https://campanhas.editoraconstante.com/planodevida/) | A abertura apresenta o livro em perspectiva sobre fundo escuro. Depois, fotografias grandes mostram o produto em situações cotidianas, com mudança de escala e atmosfera. | Dar protagonismo à interface e relacionar seu uso a momentos reais do dia. |
| [Mapa da Fé Católica](https://www.mapadafecatolica.com.br/) | Cartas sobrepostas, personagens, perguntas selecionáveis e progresso convidam o visitante a participar. A seleção de uma resposta atualiza o contador. | Criar uma pequena experiência em que a escolha do visitante gera uma resposta visível na prévia do Ora. |
| [Frater](https://fraterapp.com.br/) | Tipografia serifada ampla, creme e dourado, espaço generoso e navegação por recursos. A composição transmite serenidade. | Trabalhar hierarquia tipográfica, espaço e ritmo, mantendo a identidade própria do Ora. |
| [Saintly](https://besaintly.app/pt) | Telas sobrepostas, ilustrações consistentes, mascote e indicadores de resultado ao redor do produto. | Apresentar detalhes da interface em camadas, com foco claro em cada composição. |
| [Momentum](https://momentumdash.com/) | O hero comunica a transformação de uma aba comum em um espaço pessoal por meio de telas sobrepostas e uma seta. | Explicar visualmente, logo na abertura, o que muda no navegador quando o Ora é instalado. |

Direção recomendada: combinar a serenidade do Frater, a clareza de transformação do Momentum e a participação do Mapa da Fé. Do Plano de Vida e do Saintly, aproveitar o cuidado com a apresentação do produto. Essas referências orientam princípios, sem exigir copiar seus estilos, personagens ou efeitos.

## 2. Composição da abertura

Manter a promessa “Cada nova aba, um convite à oração e ao foco” como ponto de partida. Dar à interface do Ora presença suficiente para que o visitante entenda o produto antes de ler uma explicação longa.

A composição deve reunir:

- Uma promessa curta e legível.
- Uma explicação breve sobre a transformação da nova aba.
- Uma ação principal de instalação e um acesso à demonstração.
- Uma prévia grande, com detalhes legíveis e um foco visual definido.
- Informações objetivas de confiança, desde que confirmadas no produto: gratuidade, ausência de anúncios, ausência de conta e armazenamento local.

Evitar reduzir uma captura completa até que seus textos fiquem ilegíveis. Usar recortes ou estados específicos quando isso ajudar a demonstrar um benefício.

## 3. Demonstração interativa central

Oferecer três escolhas que alteram a própria prévia:

| Escolha | Resposta da demonstração | Benefício comunicado |
| --- | --- | --- |
| Quero me concentrar | Mostrar uma tarefa, o início de uma sessão de foco e a proteção ativada. | Trabalhar com intenção e reduzir distrações. |
| Quero rezar | Apresentar o Evangelho ou o início do terço. | Encontrar um momento de oração dentro da rotina. |
| Quero organizar meu dia | Mostrar uma intenção e o próximo passo. | Abrir o navegador sabendo por onde começar. |

Cada escolha deve produzir uma transição curta, uma mudança clara de estado e uma frase de apoio. A demonstração deve ser identificada como prévia e não sugerir que ativou proteção real no navegador.

Não é necessário reproduzir a extensão inteira. Um fluxo pequeno, fiel ao produto e bem acabado é suficiente. O visitante deve controlar as mudanças; a interface não deve trocar de estado automaticamente enquanto ele a explora.

## 4. Ritmo e sequência da página

Organizar a narrativa proposta nesta ordem:

1. **Promessa e prévia:** entender o que é o Ora e o que muda na nova aba.
2. **Por que na nova aba:** mostrar como a oração e a intenção encontram espaço em um hábito que já existe.
3. **Experimentar o Ora:** explorar as três escolhas da demonstração.
4. **O Ora ao longo do dia:** conectar organização, foco e oração a situações concretas.
5. **Confiança e instalação:** esclarecer compatibilidade, funcionamento, privacidade e dúvidas essenciais.

Alternar momentos de leitura e experiência, com variação de escala e composição. Evitar que todas as seções dependam da mesma combinação de título, parágrafo e cartões iguais.

No desktop, uma seção pode manter a prévia visível enquanto três explicações avançam com a rolagem. No celular, apresentar os mesmos momentos em sequência natural, sem exigir uma longa rolagem para revelar pouco conteúdo.

## 5. Parallax e movimento

### Onde o parallax faz sentido

Usar um deslocamento discreto entre a fotografia de fundo e a moldura do navegador no hero. A finalidade é acrescentar profundidade sem prejudicar a leitura. O texto principal deve permanecer estável.

Parallax e demonstração acompanhada pela rolagem têm funções diferentes: o primeiro cria profundidade; a segunda organiza uma explicação. Para o Ora, a demonstração tem maior prioridade.

### Movimento recomendado

- Entradas discretas por seção, com pequenos deslocamentos e variação de opacidade.
- Transições suaves entre os estados da demonstração.
- Respostas visíveis ao passar o cursor, focar pelo teclado e pressionar controles.
- Destaque pontual no elemento que está sendo explicado.
- Movimento interrompido ou simplificado quando a preferência por movimento reduzido estiver ativa.

### Limites

- Preservar a velocidade natural da rolagem.
- Evitar textos se movendo em velocidades diferentes.
- Evitar inclinação forte ou contínua das telas.
- Evitar elementos flutuando sem função e animações competindo com a leitura.
- Manter todo o conteúdo compreensível sem animação.
- Usar composição estática ou movimento simplificado em telas pequenas.
- Não esconder conteúdo essencial até que uma animação termine.

## 6. Qualidade visual e acabamento

A percepção de qualidade depende primeiro da composição: proporção das telas, legibilidade, hierarquia tipográfica, coerência entre imagens e espaço entre elementos.

Priorizar:

- Capturas atuais e fiéis à interface real do Ora.
- Recortes que tornem cada benefício reconhecível.
- Menos texto concorrendo com a demonstração.
- Tipografia e cores alinhadas à identidade existente.
- Botões com estados claros de interação e foco.
- Imagens dimensionadas para evitar saltos no carregamento.
- Navegação completa por teclado e seleção identificável sem depender apenas de cor.

## 7. Ordem de implementação

1. Confirmar e inspecionar visualmente a versão `redesign-v1` correta.
2. Melhorar a composição da abertura e a apresentação da interface.
3. Construir a demonstração interativa com três escolhas.
4. Ajustar o ritmo e a sequência das seções.
5. Refinar estados de interação e transições.
6. Experimentar parallax discreto e mantê-lo apenas se acrescentar qualidade.
7. Verificar desktop, celular, teclado, movimento reduzido e carregamento.

## 8. Critérios para avaliar o resultado

- A primeira tela deixa claro que o Ora transforma a nova aba do navegador.
- O visitante consegue reconhecer oração, foco e organização na apresentação do produto.
- Cada escolha da demonstração produz uma resposta clara e fiel ao Ora.
- As telas e os textos permanecem legíveis nos tamanhos avaliados.
- As animações ajudam a entender mudanças e direcionar a atenção.
- A página funciona integralmente com teclado e movimento reduzido.
- O celular mantém uma leitura fluida, sem sobreposições ou rolagem horizontal involuntária.
- A instalação continua fácil de encontrar ao longo da experiência.

## Recomendação final

Investir primeiro em uma demonstração interativa central e no ritmo visual da página. Aplicar movimento para explicar o produto e confirmar ações. Acrescentar parallax apenas como acabamento discreto, preservando a serenidade que o Ora promete.
