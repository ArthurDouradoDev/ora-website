// Ora · landing page
(() => {
    document.documentElement.classList.add('js');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cabeçalho: linha inferior só depois de rolar
    const header = document.querySelector('.header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Entrada suave ao rolar (escalonada dentro de cada grupo)
    const revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-in'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
                el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 70 + 'ms';
                el.classList.add('is-in');
                io.unobserve(el);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        revealEls.forEach((el) => io.observe(el));
    }

    // Comparação antes/depois: o range cobre a imagem (arrastar, clicar e teclado)
    document.querySelectorAll('.compare').forEach((box) => {
        const range = box.querySelector('.compare-range');
        const labels = box.querySelectorAll('.compare-label');
        const set = (v) => {
            box.style.setProperty('--pos', v + '%');
            labels[0].style.opacity = v < 14 ? 0 : 1;
            labels[1].style.opacity = v > 86 ? 0 : 1;
        };
        range.addEventListener('input', () => set(range.value));
        range.addEventListener('pointerdown', () => box.classList.add('is-dragging'));
        window.addEventListener('pointerup', () => box.classList.remove('is-dragging'));

        // Um pequeno aceno na primeira vez que aparece, para mostrar que dá para arrastar
        if (!reduceMotion && 'IntersectionObserver' in window) {
            const hint = new IntersectionObserver(([e]) => {
                if (!e.isIntersecting) return;
                hint.disconnect();
                let t0 = null;
                const touched = () => { t0 = -1; };
                range.addEventListener('pointerdown', touched, { once: true });
                const step = (ts) => {
                    if (t0 === -1) return;
                    if (t0 === null) t0 = ts;
                    const p = Math.min((ts - t0) / 1600, 1);
                    const v = 50 + Math.sin(p * Math.PI * 2) * 14 * (1 - p);
                    range.value = v; set(v);
                    if (p < 1) requestAnimationFrame(step);
                };
                setTimeout(() => requestAnimationFrame(step), 500);
            }, { threshold: 0.6 });
            hint.observe(box);
        }
    });

    // Tour "Como funciona": abas acessíveis (setas, Home/End)
    const tabs = [...document.querySelectorAll('.tour-tabs [role="tab"]')];
    const stage = document.querySelector('.tour-stage');
    if (tabs.length && stage) {
        const img = stage.querySelector('.tour-img');
        const text = stage.querySelector('.tour-text');
        tabs.forEach((t) => { const pre = new Image(); pre.src = t.dataset.img; }); // pré-carrega
        const select = (tab, focus) => {
            tabs.forEach((t) => {
                const on = t === tab;
                t.setAttribute('aria-selected', on);
                t.tabIndex = on ? 0 : -1;
            });
            stage.setAttribute('aria-labelledby', tab.id);
            if (focus) tab.focus();
            if (img.getAttribute('src') === tab.dataset.img) return;
            const swap = () => {
                img.src = tab.dataset.img;
                img.alt = tab.dataset.alt;
                text.textContent = tab.dataset.text;
                img.classList.remove('is-swapping');
            };
            if (reduceMotion) return swap();
            img.classList.add('is-swapping');
            setTimeout(swap, 180);
        };
        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => select(tab));
            tab.addEventListener('keydown', (e) => {
                const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
                if (!(e.key in keys)) return;
                e.preventDefault();
                select(tabs[(keys[e.key] + tabs.length) % tabs.length], true);
            });
        });
    }

    // Diálogo de sugestão (Formspree)
    document.querySelectorAll('[data-open]').forEach((btn) => {
        const dlg = document.getElementById(btn.dataset.open);
        btn.addEventListener('click', () => dlg.showModal());
    });
    document.querySelectorAll('dialog').forEach((dlg) => {
        dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
        dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    });
    document.querySelectorAll('form[data-ajax]').forEach((form) => {
        const status = form.querySelector('.form-status');
        const submit = form.querySelector('[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submit.disabled = true;
            status.textContent = 'Enviando…';
            try {
                const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
                if (!res.ok) throw new Error(res.status);
                form.reset();
                status.textContent = 'Obrigado! Sua mensagem chegou.';
                setTimeout(() => { form.closest('dialog')?.close(); status.textContent = ''; }, 1800);
            } catch {
                status.textContent = 'Não foi possível enviar agora. Tente de novo ou fale no Instagram.';
            } finally {
                submit.disabled = false;
            }
        });
    });
})();
