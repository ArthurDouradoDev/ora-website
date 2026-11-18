// Animações da página: abertura, textos e entradas por seção. Depende do GSAP (assets/vendor).
(() => {
    const root = document.documentElement;
    const { gsap, ScrollTrigger, SplitText } = window;
    if (!gsap || !ScrollTrigger || !SplitText) {
        root.classList.remove('motion', 'cine');
        return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const hero = document.querySelector('.hero');
    const header = document.querySelector('.header');
    const heading = hero.querySelector('.hero-heading');
    const figure = hero.querySelector('.hero-figure');
    const stage = hero.querySelector('.hero-stage');
    const plate = hero.querySelector('.hero-plate');
    const before = hero.querySelector('.hero-backdrop-before');
    const photo = hero.querySelector('.hero-backdrop-photo');
    const title = hero.querySelector('h1');
    const span = (value, from, to) => gsap.utils.clamp(0, 1, (value - from) / (to - from));
    const fontsReady = Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]);
    const media = gsap.matchMedia();
    // Quanto a abertura espera antes de trazer o título (a aba comum se dissolve primeiro).
    let introDelay = .15;

    media.add('(prefers-reduced-motion: no-preference) and (min-width: 901px) and (min-height: 680px)', () => {
        root.classList.add('motion', 'cine');
        const state = { p: 0 };
        const shrink = gsap.parseEase('power2.inOut');

        // O recorte final da foto é o retângulo da janela, medido no próprio palco.
        const measure = () => {
            const outer = stage.getBoundingClientRect();
            const inner = plate.getBoundingClientRect();
            hero.style.setProperty('--ct', inner.top - outer.top + 'px');
            hero.style.setProperty('--cl', inner.left - outer.left + 'px');
            hero.style.setProperty('--cr', outer.right - inner.right + 'px');
            hero.style.setProperty('--cb', outer.bottom - inner.bottom + 'px');
        };
        const apply = () => {
            // O recuo termina um pouco antes de o palco se soltar, para a janela repousar.
            const p = Math.min(1, state.p / .86);
            hero.style.setProperty('--head', span(p, 0, .3));
            hero.style.setProperty('--k', shrink(span(p, .1, .8)));
            hero.style.setProperty('--frame', span(p, .56, .84));
            hero.style.setProperty('--ui', span(p, .62, .94));
            header.classList.toggle('is-over', p < .42);
            heading.classList.toggle('is-past', p >= .3);
            figure.classList.toggle('is-idle', p < .5);
        };
        measure();
        apply();
        root.classList.add('cine-ready');
        gsap.to(state, {
            p: 1,
            ease: 'none',
            onUpdate: apply,
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: .5, onRefresh: measure }
        });

        // Na primeira visita da sessão, a aba comum se dissolve no Ora.
        let seen = false;
        try {
            seen = sessionStorage.getItem('ora_intro') === '1';
            sessionStorage.setItem('ora_intro', '1');
        } catch { /* sem armazenamento, a abertura roda sempre */ }
        if (seen || window.scrollY > 40) {
            gsap.set(before, { autoAlpha: 0 });
            introDelay = .15;
        } else {
            introDelay = 1.05;
            gsap.set(hero, { '--shade': 0 });
            gsap.timeline({ defaults: { ease: 'power2.inOut' } })
                .from(header.querySelector('.header-inner'), { autoAlpha: 0, duration: .7 }, .75)
                .to(before, { autoAlpha: 0, duration: 1.15 }, .55)
                .to(hero, { '--shade': 1, duration: 1.15 }, .55)
                .fromTo(photo, { filter: 'blur(18px)', scale: 1.12 },
                    { filter: 'blur(0px)', scale: 1, duration: 1.7, ease: 'power3.out', clearProps: 'filter,transform' }, .55);
        }

        return () => {
            root.classList.remove('cine', 'cine-ready');
            header.classList.remove('is-over');
            heading.classList.remove('is-past');
            figure.classList.remove('is-idle');
            for (const name of ['--ct', '--cl', '--cr', '--cb', '--head', '--k', '--frame', '--ui', '--shade']) hero.style.removeProperty(name);
        };
    });

    media.add('(prefers-reduced-motion: no-preference)', () => {
        root.classList.add('motion');
        let cancelled = false;
        const splits = [];
        const lines = (element, animation) => SplitText.create(element, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
                gsap.set(element, { visibility: 'visible' });
                return animation(self.lines);
            }
        });

        fontsReady.then(() => {
            if (cancelled) return;

            // Abertura: o título sobe linha a linha; o apoio chega logo depois.
            let first = true;
            splits.push(lines(title, (items) => {
                const delay = first ? introDelay : 0;
                first = false;
                return gsap.from(items, { yPercent: 118, duration: 1.05, ease: 'power4.out', stagger: .11, delay });
            }));
            gsap.fromTo([hero.querySelector('.eyebrow'), hero.querySelector('.hero-aside')],
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .28, delay: introDelay + .1, clearProps: 'transform' });

            // Títulos de seção: linhas que sobem de trás de uma máscara ao entrar na tela.
            for (const element of document.querySelectorAll('[data-split]')) {
                splits.push(lines(element, (items) => gsap.from(items, {
                    yPercent: 118,
                    duration: .95,
                    ease: 'power4.out',
                    stagger: .09,
                    scrollTrigger: { trigger: element, start: 'top 88%', once: true }
                })));
            }

            // Frase de apoio: as palavras ganham cor conforme a leitura avança.
            for (const element of document.querySelectorAll('[data-scrub-words]')) {
                splits.push(SplitText.create(element, {
                    type: 'words',
                    autoSplit: true,
                    onSplit: (self) => gsap.fromTo(self.words, { opacity: .2 }, {
                        opacity: 1,
                        ease: 'none',
                        stagger: .08,
                        scrollTrigger: { trigger: element, start: 'top 86%', end: 'top 42%', scrub: .4 }
                    })
                }));
            }

            // Demais blocos: sobem alguns pixels, em sequência quando entram juntos.
            const blocks = gsap.utils.toArray('[data-reveal]');
            gsap.set(blocks, { autoAlpha: 0, y: 22 });
            ScrollTrigger.batch(blocks, {
                start: 'top 90%',
                once: true,
                onEnter: (batch) => gsap.to(batch, {
                    autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out', stagger: .08, overwrite: true, clearProps: 'transform'
                })
            });
        });

        return () => {
            cancelled = true;
            for (const split of splits) split.revert();
            root.classList.remove('motion');
            gsap.set('[data-reveal], [data-split], .hero .eyebrow, .hero h1, .hero-aside', { clearProps: 'all' });
        };
    });
})();
