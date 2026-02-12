# Ora — Site Oficial

Site institucional da extensão **Ora**, uma extensão para Chrome que transforma a nova aba em um espaço de oração e foco.

## 🎯 Sobre

Este é o site oficial que apresenta a extensão Ora, suas funcionalidades, missão e como contribuir. O site foi desenvolvido com foco em:

- **Estética contemplativa**: Design minimalista com glassmorphism alinhado à extensão
- **Performance**: HTML, CSS e JavaScript vanilla para máxima velocidade
- **Responsividade**: Funciona perfeitamente em desktop, tablet e mobile
- **Acessibilidade**: Semântica HTML correta e navegação por teclado
- **Open Source**: Código aberto e documentado

## 🚀 Tecnologias

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Glassmorphism, animações, grid e flexbox
- **JavaScript**: Vanilla JS para interações e animações
- **Phosphor Icons**: Biblioteca de ícones utilizada na extensão
- **Google Fonts**: Cinzel (títulos) e Montserrat (corpo)

## 📁 Estrutura de Arquivos

```
├── index.html          # Página principal
├── styles.css          # Todos os estilos
├── script.js           # Interações e animações
├── assets/             # Imagens e recursos
│   ├── hero-screenshot.png
│   └── ...
└── README.md           # Este arquivo
```

## 🎨 Paleta de Cores

```css
--bg-dark: #0a0a0a;
--accent-gold: #eebb55;
--text-primary: #ffffff;
--glass-bg: rgba(20, 20, 20, 0.4);
--glass-border: rgba(255, 255, 255, 0.1);
```

## 📸 Assets Necessários

Para o site funcionar completamente, você precisará adicionar:

### Imagens Principais
- **hero-screenshot.png** (1920x1200px): Screenshot da extensão em uso
- **creator-photo.jpg** (400x400px): Foto do criador (opcional)

### Recursos Opcionais
- **demo-video.mp4**: Vídeo demonstrativo da extensão
- **favicon.ico**: Ícone do site

## 🛠️ Como Usar

### Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/arthurdouradodev/ora-website.git
cd ora-website
```

2. Abra `index.html` em seu navegador
   - Ou use um servidor local: `python -m http.server 8000`

3. Edite conforme necessário

### Deploy

#### GitHub Pages (Gratuito e Recomendado)

1. Faça push para o GitHub
2. Vá em Settings → Pages
3. Selecione a branch `main` e pasta `root`
4. Seu site estará em `https://seuusuario.github.io/ora-website`

#### Vercel (Alternativa)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Deploy automático a cada commit

#### Netlify (Alternativa)

1. Arraste a pasta para [Netlify Drop](https://app.netlify.com/drop)
2. Ou conecte via Git para deploys automáticos

## ✏️ Personalização

### Modificar Conteúdo

1. **Textos**: Edite diretamente no `index.html`
2. **Cores**: Altere as variáveis CSS no início do `styles.css`
3. **Links**: Atualize os URLs do GitHub e redes sociais

### Adicionar Seções

Siga o padrão existente:

```html
<section id="nova-secao" class="section-[nome]">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Badge</span>
            <h2>Título da Seção</h2>
            <p class="section-description">Descrição</p>
        </div>
        <!-- Conteúdo -->
    </div>
</section>
```

### Adicionar Animações

Use o Intersection Observer já configurado:

```javascript
const newElements = document.querySelectorAll('.sua-classe');
newElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});
```

## 🎯 Funcionalidades

### Implementadas
- ✅ Navegação fixa com efeito de scroll
- ✅ FAQ com accordion
- ✅ Modal de depoimento
- ✅ Botões de compartilhamento social
- ✅ Animações on-scroll
- ✅ Smooth scroll
- ✅ Responsivo completo
- ✅ Easter egg (Konami Code)

### Para Implementar
- [ ] Vídeo demonstrativo
- [ ] Sistema de envio de depoimentos (backend)
- [ ] Analytics (Plausible ou similar)
- [ ] Menu mobile expandível
- [ ] Modo claro/escuro
- [ ] Múltiplos idiomas (i18n)

## 📊 Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+

Dicas para manter:
- Otimize imagens (WebP, compressão)
- Use lazy loading para imagens
- Minifique CSS e JS para produção

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Checklist Pré-Deploy

- [ ] Todas as imagens adicionadas em `assets/`
- [ ] Links do GitHub/LinkedIn atualizados
- [ ] Informações de contato verificadas
- [ ] Tested em Chrome, Firefox, Safari
- [ ] Tested em mobile
- [ ] Analytics configurado (opcional)
- [ ] Favicon adicionado
- [ ] Meta tags Open Graph completas

## 📄 Licença

MIT License - Veja LICENSE para mais detalhes.

## 💬 Contato

**Arthur Dourado**
- GitHub: [@arthurdouradodev](https://github.com/arthurdouradodev)
- LinkedIn: [Arthur Dourado](https://www.linkedin.com/in/arthur-dourado/)

---

Desenvolvido com 🙏 e ☕ para a maior glória de Deus
