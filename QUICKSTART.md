# 🚀 Quick Start — Site do Ora

Guia rápido para colocar o site no ar em minutos.

## Opção 1: GitHub Pages (Recomendado)

### Passo 1: Prepare o Repositório
```bash
git clone https://github.com/arthurdouradodev/ora-website.git
cd ora-website

# Adicione suas imagens
cp sua-screenshot.png assets/hero-screenshot.png
# (opcional) cp sua-foto.jpg assets/creator-photo.jpg
```

### Passo 2: Personalize
Edite `index.html` e atualize:
- Links do GitHub (procure por `arthurdouradodev/ora`)
- LinkedIn na seção de criador
- Email de contato (se desejar)

### Passo 3: Deploy
```bash
git add .
git commit -m "Initial commit: Ora website"
git push origin main
```

### Passo 4: Ative GitHub Pages
1. Vá em Settings → Pages
2. Source: Branch `main`, folder `/ (root)`
3. Save

✅ Pronto! Seu site estará em `https://seu-usuario.github.io/ora-website` em ~1 minuto

---

## Opção 2: Vercel (Deploy Instantâneo)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure:
   - Framework Preset: `Other`
   - Root Directory: `./`
5. Deploy

✅ Seu site estará no ar em segundos!

---

## Opção 3: Netlify (Drag & Drop)

1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto para Netlify Drop
3. Pronto!

✅ Deploy imediato sem configuração!

---

## Customização Rápida

### Mudar Cores
Edite `styles.css` linha 8-15:
```css
:root {
    --accent-gold: #eebb55;  /* Mude para sua cor */
    /* ... */
}
```

### Adicionar Analytics
No `index.html`, antes de `</body>`:
```html
<script defer data-domain="seusite.com" src="https://plausible.io/js/script.js"></script>
```

### Adicionar Favicon
Coloque `favicon.ico` na raiz e adicione no `<head>`:
```html
<link rel="icon" href="favicon.ico">
```

---

## Checklist Pré-Publicação

- [ ] Screenshot adicionada em `assets/hero-screenshot.png`
- [ ] Links do GitHub atualizados
- [ ] LinkedIn atualizado
- [ ] Testado em Chrome e Firefox
- [ ] Testado no mobile
- [ ] Favicon adicionado
- [ ] Analytics configurado (opcional)

---

## Problemas Comuns

### Imagens não aparecem
- Verifique que estão em `assets/`
- Caminhos são case-sensitive
- Use `.png` ou `.jpg`, não `.PNG` ou `.JPG`

### CSS não carrega no GitHub Pages
- Verifique que o arquivo é `styles.css` (não `style.css`)
- Clear cache do navegador (Ctrl+Shift+R)

### Links quebrados
- Use caminhos relativos: `./assets/img.png`
- Não use caminhos absolutos: `/assets/img.png`

---

## Próximos Passos

1. [ ] Grave um vídeo demo da extensão
2. [ ] Colete depoimentos de usuários
3. [ ] Configure domínio customizado (opcional)
4. [ ] Adicione mais screenshots/exemplos

---

**Precisa de ajuda?** Abra uma issue no GitHub!

Que Deus abençoe seu projeto! 🙏
