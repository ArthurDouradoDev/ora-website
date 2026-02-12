# 🔄 Guia de Integração — Seção de Comparação

Este guia mostra como adicionar a seção de comparação interativa ao site do Ora.

## 📦 Arquivos Criados

1. **comparison-section.html** — HTML da seção
2. **comparison-styles.css** — Estilos CSS completos
3. **comparison-script.js** — JavaScript interativo
4. **assets/comparison-before.svg** — Imagem "aba comum"
5. **assets/comparison-after.svg** — Imagem "aba do Ora"

## 🚀 Instalação Rápida

### Passo 1: Adicionar o HTML

Abra `index.html` e escolha onde adicionar a seção de comparação:

**Opção A: Logo após o Hero** (recomendado)
```html
</section>
<!-- Hero Section termina aqui -->

<!-- ADICIONE AQUI -->
[Cole o conteúdo de comparison-section.html]

<section id="sobre" class="section-sobre">
<!-- Seção Sobre começa aqui -->
```

**Opção B: Após a seção Sobre**
```html
</section>
<!-- Seção Sobre termina aqui -->

<!-- ADICIONE AQUI -->
[Cole o conteúdo de comparison-section.html]

<section id="funcionalidades" class="section-features">
<!-- Funcionalidades começa aqui -->
```

### Passo 2: Adicionar os Estilos

Abra `styles.css` e adicione no final do arquivo:

```css
/* ============================================================
   COMPARISON SECTION
   ============================================================ */

[Cole todo o conteúdo de comparison-styles.css aqui]
```

### Passo 3: Adicionar o JavaScript

Abra `script.js` e adicione no final do arquivo:

```javascript
/* ============================================================
   COMPARISON SLIDER
   ============================================================ */

[Cole todo o conteúdo de comparison-script.js aqui]
```

### Passo 4: Verificar os Assets

Certifique-se de que as imagens estão na pasta correta:

```
assets/
├── comparison-before.svg  ✓
├── comparison-after.svg   ✓
└── hero-screenshot.png
```

### Passo 5: Testar

Abra `index.html` no navegador e:

1. ✅ A seção de comparação aparece?
2. ✅ Você consegue arrastar o slider?
3. ✅ O slider funciona no mobile (touch)?
4. ✅ As imagens carregam corretamente?

## 🎨 Personalização

### Usar suas próprias imagens

Substitua os SVGs por screenshots reais:

```html
<!-- Em comparison-section.html, linha ~9 -->
<img src="assets/comparison-before.svg" alt="...">
<!-- Mude para: -->
<img src="assets/comparison-before.png" alt="...">
```

Tire screenshots com:
- **Resolução recomendada**: 1600x1000px (16:10)
- **Formato**: PNG ou JPG otimizado
- **Dica**: Use a extensão Full Page Screen Capture

### Alterar a posição inicial do slider

```javascript
// Em comparison-script.js, linha ~13
this.currentPosition = 50; // 50% = meio
// Mude para:
this.currentPosition = 30; // 30% = mais à esquerda
```

### Desabilitar a animação automática

```javascript
// Em comparison-script.js, comente a linha final:
// animateComparisonOnView();
```

### Mudar os textos de comparação

Edite diretamente em `comparison-section.html`:

```html
<div class="highlight-item highlight-before">
    <!-- ... -->
    <ul>
        <li>Seu texto aqui</li>
        <!-- ... -->
    </ul>
</div>
```

## 📱 Comportamento Responsivo

A seção é totalmente responsiva:

- **Desktop**: Slider completo com highlights lado a lado
- **Tablet**: Highlights empilhados
- **Mobile**: Aspect ratio ajustado (4:3), botão de slider maior

## ♿ Acessibilidade

Funcionalidades inclusas:

- ✅ Suporte a teclado (setas ← →)
- ✅ Indicador visual de foco
- ✅ Labels descritivos
- ✅ Contraste adequado

## 🎯 Integração com Navegação

Adicione um link no menu (opcional):

```html
<!-- Em index.html, dentro do <nav> -->
<li><a href="#comparacao">Comparação</a></li>
```

## 🐛 Troubleshooting

### Slider não funciona

**Causa**: JavaScript não carregou
**Solução**: Verifique o console do navegador (F12) por erros

### Imagens não aparecem

**Causa**: Caminho incorreto
**Solução**: Verifique que as imagens estão em `assets/` e os caminhos no HTML estão corretos

### Slider "pula" no mobile

**Causa**: Normal em alguns dispositivos
**Solução**: Já está otimizado, mas você pode ajustar a propriedade `transition` no CSS

### Animação automática não funciona

**Causa**: Intersection Observer precisa de threshold
**Solução**: Role até a seção aparecer ~30% na tela

## 💡 Dicas de UX

1. **Primeira impressão**: Coloque logo após o Hero para impacto máximo
2. **Call to Action**: Adicione um botão de CTA após a comparação
3. **Analytics**: Rastreie quantos usuários interagem com o slider
4. **Screenshots reais**: Substitua os SVGs por screenshots reais da extensão

## 🎬 Próximos Passos

Depois de integrar a seção de comparação:

1. [ ] Tire screenshots reais e substitua os placeholders
2. [ ] Ajuste os textos de comparação para seu público
3. [ ] Teste em diferentes dispositivos
4. [ ] Considere adicionar um CTA após a comparação
5. [ ] Meça o engajamento dos usuários

## 📊 Exemplo de CTA após Comparação

Adicione ao final da seção:

```html
<div class="comparison-cta">
    <h3>Pronto para transformar sua experiência?</h3>
    <a href="#install" class="btn btn-primary btn-large">
        Instalar Ora Grátis
    </a>
</div>
```

E o CSS:

```css
.comparison-cta {
    text-align: center;
    margin-top: 50px;
    padding: 40px;
    background: rgba(238, 187, 85, 0.05);
    border-radius: 16px;
}

.comparison-cta h3 {
    margin-bottom: 20px;
    font-size: 1.5rem;
}
```

---

**Precisa de ajuda?** Consulte a documentação completa no README.md ou abra uma issue no GitHub.

Que Deus abençoe sua implementação! 🙏
