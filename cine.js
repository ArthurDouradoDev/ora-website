// Movimento da página (GSAP + ScrollTrigger + SplitText, em assets/vendor).
// Regras: o texto principal nunca espera animação para ser lido; só transform, opacity e clip-path;
// cada propriedade é escrita direto no elemento animado (sem variáveis no pai); movimento reduzido
// mantém tudo visível e sem deslocamentos.
(() => {
    const root = document.documentElement;
    const { gsap, ScrollTrigger, SplitText } = window;
    if (!gsap || !ScrollTrigger || !SplitText) {
        root.classList.remove('motion', 'cine');
        return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);
    root.classList.add('motion-ready');

    const EASE_OUT = 'expo.out';
    const hero = document.querySelector('.hero');
    const header = document.querySelector('.header');
    const media = gsap.matchMedia();

    // Abertura: a foto em tela cheia recua até virar a janela do navegador com a tela Hoje.
    media.add('(prefers-reduced-motion: no-preference) and (min-width: 901px) and (min-height: 680px)', () => {
        root.classList.add('cine');
        const stage = hero.querySelector('.hero-stage');
        const plate = hero.querySelector('.hero-plate');
        const backdrop = hero.querySelector('.hero-backdrop');
        const inner = hero.querySelector('.hero-backdrop-inner');
        const scrim = hero.querySelector('.hero-scrim');
        const dim = hero.querySelector('.hero-dim');
        const heading = hero.querySelector('.hero-heading');
        const frame = hero.querySelector('.hero-frame');
        const bar = hero.querySelector('.hero-browser .browser-bar');
        const ui = hero.querySelectorAll('.hero-appbar, .hero-arrival, .hero-plate-note, .hero-caption');

        // O recorte final é o retângulo da janela, medido no próprio palco a cada refresh.
        let box = { t: 0, r: 0, b: 0, l: 0 };
        const measure = () => {
            const outer = stage.getBoundingClientRect();
            const target = plate.getBoundingClientRect();
            box = { t: target.top - outer.top, r: outer.right - target.right, b: outer.bottom - target.bottom, l: target.left - outer.left };
            root.style.setProperty('--header-h', header.offsetHeight + 'px');
        };
        const clip = (k) => 'inset(' + (box.t * k).toFixed(1) + 'px ' + (box.r * k).toFixed(1) + 'px ' + (box.b * k).toFixed(1)
            + 'px ' + (box.l * k).toFixed(1) + 'px round 0px 0px ' + (11 * k).toFixed(1) + 'px ' + (11 * k).toFixed(1) + 'px)';
        measure();

        const shrink = { k: 0 };
        const applyClip = () => { backdrop.style.clipPath = clip(shrink.k); };
        let over = null;
        const setOver = (value) => {
            if (value === over) return;
            over = value;
            header.classList.toggle('is-over', value);
        };
        setOver(true);
        root.classList.add('cine-ready');

        gsap.set(ui, { autoAlpha: 0, y: 22 });
        gsap.set([frame, bar], { autoAlpha: 0 });
        gsap.set(dim, { opacity: 0 });

        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom bottom',
                scrub: .6,
                invalidateOnRefresh: true,
                onRefresh: () => { measure(); applyClip(); },
                onUpdate: (self) => setOver(self.progress < .34)
            }
        });
        // A linha do tempo vai de 0 a 1; o fim (0,86–1) é a janela em repouso antes de o palco se soltar.
        tl.to(heading, { autoAlpha: 0, y: -48, duration: .24, ease: 'power1.in' }, 0)
            .to(scrim, { opacity: .35, duration: .3 }, 0)
            .to(shrink, { k: 1, duration: .6, ease: 'power2.inOut', onUpdate: applyClip }, .1)
            .fromTo(inner, { scale: 1.08 }, { scale: 1, duration: .6, ease: 'power2.inOut' }, .1)
            .to([frame, bar], { autoAlpha: 1, duration: .22 }, .5)
            .to(dim, { opacity: .42, duration: .25 }, .55)
            .to(ui, { autoAlpha: 1, y: 0, duration: .26, stagger: .03, ease: 'power2.out' }, .58)
            .to({}, { duration: .14 }, .86);

        return () => {
            root.classList.remove('cine-ready');
            header.classList.remove('is-over');
            backdrop.style.clipPath = '';
            gsap.set([ui, frame, bar, dim, heading, scrim, inner], { clearProps: 'all' });
        };
    });

    media.add('(prefers-reduced-motion: no-preference)', () => {
        const splits = [];
        let cancelled = false;
        const fontsReady = Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 900))]);

        fontsReady.then(() => {
            if (cancelled) return;

            // Títulos de seção: linhas sobem de trás de uma máscara; passos que encolhem.
            for (const element of document.querySelectorAll('[data-split]')) {
                splits.push(SplitText.create(element, {
                    type: 'lines',
                    mask: 'lines',
                    linesClass: 'split-line',
                    autoSplit: true,
                    onSplit(self) {
                        gsap.set(element, { visibility: 'visible' });
                        return gsap.from(self.lines, {
                            yPercent: 110,
                            duration: .8,
                            ease: EASE_OUT,
                            stagger: (index) => [0, .09, .16, .21][Math.min(index, 3)],
                            scrollTrigger: { trigger: element, start: 'top 88%', once: true }
                        });
                    }
                }));
            }

            // Versículo: as palavras ganham força conforme a leitura avança (nunca abaixo de 0,35).
            for (const element of document.querySelectorAll('[data-words]')) {
                splits.push(SplitText.create(element, {
                    type: 'words',
                    autoSplit: true,
                    onSplit: (self) => gsap.fromTo(self.words, { opacity: .35 }, {
                        opacity: 1,
                        ease: 'none',
                        stagger: .1,
                        scrollTrigger: { trigger: element, start: 'top 82%', end: 'bottom 45%', scrub: .5 }
                    })
                }));
            }

            // Blocos: sobem pouco, em grupo, com atrasos que encolhem; o principal desliza mais.
            const blocks = gsap.utils.toArray('[data-reveal]');
            gsap.set(blocks, { autoAlpha: 0, y: 18 });
            ScrollTrigger.batch(blocks, {
                start: 'top 90%',
                once: true,
                onEnter: (batch) => gsap.to(batch, {
                    autoAlpha: 1,
                    y: 0,
                    duration: .7,
                    ease: EASE_OUT,
                    stagger: (index) => [0, .1, .17, .22, .26, .29][Math.min(index, 5)],
                    overwrite: true,
                    clearProps: 'transform'
                })
            });

            // Frutos: as barras crescem da base quando o gráfico entra na tela.
            const chart = document.querySelector('[data-fruits-chart]');
            if (chart) {
                gsap.fromTo(chart.querySelectorAll('.fruit-bar'), { scaleY: 0 }, {
                    scaleY: 1,
                    duration: .9,
                    ease: EASE_OUT,
                    stagger: (index) => index * .06 - index * index * .003,
                    clearProps: 'transform',
                    scrollTrigger: { trigger: chart, start: 'top 80%', once: true }
                });
            }
            ScrollTrigger.refresh();
        });

        return () => {
            cancelled = true;
            for (const split of splits) split.revert();
            gsap.set('[data-reveal], [data-split], .fruit-bar', { clearProps: 'all' });
        };
    });
})();
