// Partes vivas da página fora da demonstração: relógio, loja certa, tempo litúrgico,
// terço, coroa do Advento, Frutos e o formulário de sugestão.
(() => {
    const STORE_URL = {
        cws: 'https://chromewebstore.google.com/detail/ora-nova-aba/mbbeidlknhdnkngijiokgbekbfdhmnph',
        amo: 'https://addons.mozilla.org/pt-BR/firefox/addon/ora-nova-aba/'
    };
    const STORE_NAME = { cws: 'Chrome Web Store', amo: 'Firefox Add-ons' };
    // Navegadores compatíveis listados em "Ver todos" (logotipos em assets/browsers).
    const BROWSERS = [
        { id: 'chrome', name: 'Chrome', store: 'cws', icon: 'assets/browsers/chrome.png' },
        { id: 'edge', name: 'Edge', store: 'cws', icon: 'assets/browsers/edge.png', note: 'Permita extensões de outras lojas quando o Edge pedir.' },
        { id: 'brave', name: 'Brave', store: 'cws', icon: 'assets/browsers/brave.png' },
        { id: 'opera', name: 'Opera', store: 'cws', icon: 'assets/browsers/opera.png', note: 'Confira o suporte à nova aba.' },
        { id: 'vivaldi', name: 'Vivaldi', store: 'cws', icon: 'assets/browsers/vivaldi.png', note: 'Autorize a extensão a controlar a nova aba.' },
        { id: 'arc', name: 'Arc', store: 'cws', icon: 'assets/browsers/arc.png' },
        { id: 'firefox', name: 'Firefox', store: 'amo', icon: 'assets/browsers/firefox.png' },
        { id: 'zen', name: 'Zen', store: 'amo', icon: 'assets/browsers/zen.png' },
        { id: 'librewolf', name: 'LibreWolf', store: 'amo', icon: 'assets/browsers/librewolf.png' }
    ];
    const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Relógios: a hora de quem visita, como na extensão.
    const clocks = [...document.querySelectorAll('[data-clock]')];
    function renderClock() {
        const now = new Date();
        const text = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        for (const clock of clocks) if (clock.textContent !== text) clock.textContent = text;
    }
    renderClock();
    window.setInterval(renderClock, 15000);

    // Loja certa para cada navegador; no celular, a ação principal é experimentar.
    const ua = navigator.userAgent;
    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
    function detectBrowser() {
        if (/Edg\//.test(ua)) return 'edge';
        if (/OPR\//.test(ua)) return 'opera';
        if (/Vivaldi\//.test(ua)) return 'vivaldi';
        if (navigator.brave) return 'brave';
        if (/LibreWolf/i.test(ua)) return 'librewolf';
        if (/Firefox\//.test(ua)) return 'firefox';
        // O Arc só se revela pelas variáveis de cor que injeta na página.
        if (getComputedStyle(document.documentElement).getPropertyValue('--arc-palette-title')) return 'arc';
        if (/Chrome\//.test(ua)) return 'chrome';
        return null; // Safari e outros sem suporte
    }
    const yours = mobile ? null : BROWSERS.find((item) => item.id === detectBrowser()) || null;
    const browserGuide = (item) => 'manual-install.html#' + item.id;
    if (yours) {
        for (const link of document.querySelectorAll('[data-browser-guide]')) link.href = browserGuide(yours);
    }

    const primary = document.querySelector('[data-store-primary]');
    const secondary = document.querySelector('[data-store-secondary]');
    const install = document.querySelector('[data-store-install]');
    const other = document.querySelector('[data-store-other]');
    const shareStatus = document.querySelector('[data-share-status]');
    const browsersDialog = document.querySelector('#browsers');
    const canDialog = Boolean(browsersDialog && typeof browsersDialog.showModal === 'function');
    const openBrowsers = (event) => {
        if (!canDialog) return;
        event.preventDefault();
        browsersDialog.showModal();
    };

    if (yours && yours.store === 'amo' && other) {
        other.href = STORE_URL.cws;
        other.firstChild.textContent = 'Chrome Web Store ';
    }
    if (yours) {
        for (const link of [primary, install]) {
            if (!link) continue;
            link.href = yours.id === 'opera' ? browserGuide(yours) : STORE_URL[yours.store];
            link.querySelector('[data-store-label]').textContent = yours.id === 'opera' ? 'Ver instruções para Opera' : 'Adicionar ao ' + yours.name;
        }
    } else if (!mobile) {
        // Safari e outros: mostra a lista, em vez de prometer o que não instala.
        for (const link of [primary, install]) {
            if (!link) continue;
            link.href = 'manual-install.html';
            link.querySelector('[data-store-label]').textContent = 'Ver opções de instalação';
            link.addEventListener('click', openBrowsers);
        }
    }

    function browserMark(item) {
        const img = document.createElement('img');
        img.src = item.icon;
        img.width = img.height = 32;
        img.alt = '';
        return img;
    }

    // Faixa dos quatro: o navegador de quem visita entra no lugar do Brave quando não está entre eles.
    const strip = document.querySelector('.compat-links');
    if (strip && yours) {
        let link = strip.querySelector('[data-browser="' + yours.id + '"]');
        if (!link) {
            link = strip.querySelector('[data-browser="brave"]');
            link.dataset.browser = yours.id;
            link.href = browserGuide(yours);
            link.removeAttribute('title');
            link.replaceChildren(browserMark(yours), document.createTextNode(yours.name));
        }
        link.classList.add('is-yours');
        link.setAttribute('aria-label', 'Como instalar o Ora no ' + yours.name + ' (seu navegador)');
    }

    // "Ver todos": compatíveis por loja, com o seu navegador marcado.
    if (canDialog) {
        for (const list of browsersDialog.querySelectorAll('[data-browser-list]')) {
            for (const item of BROWSERS.filter((entry) => entry.store === list.dataset.browserList)) {
                const row = document.createElement('li');
                const link = document.createElement('a');
                link.href = browserGuide(item);
                const text = document.createElement('span');
                text.className = 'browser-row-text';
                const name = document.createElement('strong');
                name.textContent = item.name;
                const note = document.createElement('small');
                note.textContent = item.note || STORE_NAME[item.store];
                text.append(name, note);
                link.append(browserMark(item), text);
                if (yours && yours.id === item.id) {
                    row.classList.add('is-yours');
                    const tag = document.createElement('span');
                    tag.className = 'browser-tag';
                    tag.textContent = 'Seu navegador';
                    link.append(tag);
                }
                row.append(link);
                list.append(row);
            }
        }
        for (const trigger of document.querySelectorAll('[data-open-browsers]')) {
            trigger.hidden = false;
            trigger.addEventListener('click', openBrowsers);
        }
        browsersDialog.querySelector('[data-close]').addEventListener('click', () => browsersDialog.close());
        browsersDialog.addEventListener('click', (event) => {
            if (event.target === browsersDialog) browsersDialog.close();
        });
    }

    if (mobile && primary && secondary) {
        const installCopy = document.querySelector('[data-install-copy]');
        if (installCopy) installCopy.textContent = 'O Ora é instalado no computador. Consulte o guia para escolher seu navegador.';
        if (install) install.closest('.install-actions').hidden = true;
        primary.href = '#como-funciona';
        primary.querySelector('[data-store-label]').textContent = 'Experimentar a demonstração';
        primary.querySelector('use').setAttribute('href', 'assets/ora-icons.svg#arrow-down');
        secondary.textContent = 'Enviar o link para o computador';
        secondary.href = 'https://oratime.com.br/';
        secondary.addEventListener('click', async (event) => {
            event.preventDefault();
            const data = { title: 'Ora · Nova aba católica', text: 'Instalar no computador:', url: 'https://oratime.com.br/' };
            try {
                if (navigator.share) {
                    await navigator.share(data);
                    return;
                }
                await navigator.clipboard.writeText(data.url);
                shareStatus.textContent = 'Link copiado. Abra no computador para instalar.';
            } catch (error) {
                if (error && error.name === 'AbortError') return;
                shareStatus.textContent = 'Abra oratime.com.br no computador para instalar.';
            }
        });
    }

    // Tempo litúrgico (mesma regra do LiturgicalCalendar da extensão).
    const DAY = 864e5;
    const adventStart = (year) => {
        const eve = new Date(year, 11, 24);
        return new Date(year, 11, 24 - eve.getDay() - 21);
    };
    const daysBetween = (from, to) => Math.round((to - from) / DAY);
    function season(date) {
        const year = date.getFullYear();
        const start = adventStart(year);
        const christmas = new Date(year, 11, 25);
        if (date >= start && date < christmas) {
            return { kind: 'advent', week: Math.min(4, Math.floor(daysBetween(start, date) / 7) + 1), start };
        }
        if (date >= christmas || date < new Date(year, 0, 7)) return { kind: 'christmas' };
        const next = date < start ? start : adventStart(year + 1);
        return { kind: 'ordinary', next, days: daysBetween(date, next) };
    }
    const now = season(today);
    const longDate = (date) => date.getDate() + ' de ' + MONTHS[date.getMonth()];
    const ordinal = ['', '1ª', '2ª', '3ª', '4ª'];

    const seasonLine = document.querySelector('[data-season-line]');
    if (seasonLine) {
        const weekday = WEEKDAYS[today.getDay()];
        let text = '';
        if (now.kind === 'advent') text = ordinal[now.week] + ' semana do Advento';
        else if (now.kind === 'christmas') text = 'Tempo do Natal';
        else if (now.days <= 40) text = now.days === 1 ? 'Amanhã começa o Advento' : 'Faltam ' + now.days + ' dias para o Advento';
        if (text) {
            seasonLine.textContent = weekday.charAt(0).toUpperCase() + weekday.slice(1) + ' · ' + text;
            seasonLine.hidden = false;
        }
    }

    // Coroa do Advento: velas acesas pela semana real; a prévia acende as quatro.
    const wreath = document.querySelector('[data-wreath]');
    if (wreath) {
        const title = document.querySelector('[data-advent-title]');
        const text = document.querySelector('[data-advent-text]');
        const preview = document.querySelector('[data-advent-preview]');
        const candles = [...wreath.querySelectorAll('.candle')].sort((a, b) => a.dataset.candle - b.dataset.candle);
        const weeks = [...document.querySelectorAll('[data-advent-weeks] li')];
        // Antes do Advento, a primeira vela já aparece acesa: é a que se acende no primeiro domingo.
        const realLit = now.kind === 'advent' ? now.week : now.kind === 'christmas' ? 4 : 1;
        const light = (count, stagger) => {
            candles.forEach((candle, index) => {
                candle.style.setProperty('--delay', stagger ? index * 220 + 'ms' : '0ms');
                candle.toggleAttribute('data-lit', index < count);
            });
            weeks.forEach((week, index) => {
                week.style.setProperty('--delay', stagger ? index * 220 + 'ms' : '0ms');
                week.toggleAttribute('data-lit', index < count);
                week.toggleAttribute('data-current', index === count - 1);
            });
        };
        if (now.kind === 'advent') {
            title.textContent = ordinal[now.week] + ' semana do Advento.';
            text.textContent = 'A coroa acende uma vela a cada domingo, com a contagem até o Natal na tela Rezar.';
        } else if (now.kind === 'christmas') {
            title.textContent = 'Tempo do Natal.';
            text.textContent = 'Depois do Advento, a tela Rezar acompanha o Natal até o Batismo do Senhor.';
        } else {
            title.textContent = now.days === 1 ? 'Amanhã começa o Advento.' : 'Faltam ' + now.days + ' dias para o Advento.';
            text.textContent = 'Começa no domingo, ' + longDate(now.next) + ', com a primeira vela. Depois, a tela Rezar acende uma por semana até o Natal.';
        }
        light(realLit, false);
        if (realLit === 4) preview.hidden = true;
        preview.addEventListener('click', () => {
            const on = preview.getAttribute('aria-pressed') !== 'true';
            preview.setAttribute('aria-pressed', on);
            preview.textContent = on ? 'Voltar a hoje' : 'Ver as quatro semanas';
            light(on ? 4 : realLit, on);
        });
    }

    // Terço: uma dezena com Pai Nosso, dez Ave-Marias e Glória; mistérios do dia da semana.
    const MYSTERIES = {
        gozosos: ['A Anunciação do Anjo a Nossa Senhora', 'A Visitação de Nossa Senhora a Santa Isabel', 'O Nascimento de Jesus', 'A Apresentação de Jesus no Templo', 'A Perda e o Encontro de Jesus no Templo'],
        dolorosos: ['A Agonia de Jesus no Horto', 'A Flagelação de Jesus', 'A Coroação de Espinhos', 'Jesus carrega a Cruz', 'A Crucificação e Morte de Jesus'],
        gloriosos: ['A Ressurreição de Jesus', 'A Ascensão de Jesus ao Céu', 'A Vinda do Espírito Santo', 'A Assunção de Nossa Senhora', 'A Coroação de Nossa Senhora'],
        luminosos: ['O Batismo de Jesus no Jordão', 'As Bodas de Caná', 'O Anúncio do Reino de Deus', 'A Transfiguração de Jesus', 'A Instituição da Eucaristia']
    };
    const beadsBox = document.querySelector('[data-rosary-beads]');
    if (beadsBox) {
        const set = ['gloriosos', 'gozosos', 'dolorosos', 'gloriosos', 'luminosos', 'dolorosos', 'gozosos'][today.getDay()];
        const mysteryLine = document.querySelector('[data-rosary-mystery]');
        const nowLine = document.querySelector('[data-rosary-now]');
        const next = document.querySelector('[data-rosary-next]');
        // Como na extensão: losango do Pai Nosso, separador, dez contas, separador e o losango do Glória.
        // 0 = Pai Nosso, 1..10 = Ave-Marias, 11 = Glória.
        let mystery = 0;
        let step = 0;
        const beads = [];
        const separator = () => {
            const line = document.createElement('span');
            line.className = 'bead-sep';
            line.setAttribute('aria-hidden', 'true');
            beadsBox.append(line);
        };
        for (let i = 0; i <= 11; i++) {
            if (i === 1 || i === 11) separator();
            const bead = document.createElement('button');
            bead.type = 'button';
            bead.className = i === 0 || i === 11 ? 'bead bead-big' : 'bead';
            const name = i === 0 ? 'Pai Nosso' : i === 11 ? 'Glória ao Pai' : 'Ave Maria ' + i;
            bead.setAttribute('aria-label', name);
            bead.title = name;
            bead.append(document.createElement('i'));
            bead.addEventListener('click', () => {
                step = i;
                render(true);
            });
            beads.push(bead);
            beadsBox.append(bead);
        }
        function render(announce) {
            mysteryLine.textContent = 'Mistérios ' + set + ' · ' + (mystery + 1) + 'º: ' + MYSTERIES[set][mystery];
            beads.forEach((bead, index) => {
                bead.classList.toggle('is-done', index < step);
                bead.classList.toggle('is-current', index === step);
                if (index === step) bead.setAttribute('aria-current', 'step');
                else bead.removeAttribute('aria-current');
            });
            const name = step === 0 ? 'Pai Nosso' : step === 11 ? 'Glória ao Pai' : 'Ave Maria · ' + step + ' de 10';
            nowLine.textContent = name;
            next.textContent = step === 11 ? (mystery === 4 ? 'Recomeçar' : 'Próximo mistério') : 'Próxima conta';
            if (!announce) nowLine.removeAttribute('aria-live');
            else nowLine.setAttribute('aria-live', 'polite');
        }
        next.addEventListener('click', () => {
            if (step < 11) step++;
            else {
                step = 0;
                mystery = (mystery + 1) % 5;
            }
            render(true);
        });
        render(false);
    }

    // Frutos: semana de exemplo com a barra de hoje vinda da demonstração.
    const chart = document.querySelector('[data-fruits-chart]');
    if (chart) {
        const summary = document.querySelector('[data-fruits-summary]');
        // Os últimos sete dias, terminando hoje, para a semana nunca começar vazia.
        const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const labels = Array.from({ length: 7 }, (_, i) => names[(today.getDay() + 1 + i) % 7]);
        const todayIndex = 6;
        // Minutos de foco e oração nos dias anteriores (exemplo); null = sem registro.
        const sample = [[47, true], [31, false], [null, false], [68, true], [22, true], [null, true]];
        const max = 75;
        const bars = labels.map((label, index) => {
            const column = document.createElement('div');
            column.className = 'fruit-col';
            const bar = document.createElement('span');
            bar.className = 'fruit-bar';
            const value = document.createElement('span');
            value.className = 'fruit-value';
            const dot = document.createElement('i');
            dot.className = 'fruit-dot';
            const name = document.createElement('span');
            name.className = 'fruit-day';
            name.textContent = label;
            column.append(value, bar, dot, name);
            if (index === todayIndex) {
                column.classList.add('is-today');
                name.textContent = 'Hoje';
            }
            chart.append(column);
            return { column, bar, value, dot };
        });
        function renderChart(day) {
            let sessions = 0;
            let prayerDays = 0;
            let minutes = 0;
            bars.forEach(({ column, bar, value, dot }, index) => {
                let focus = null;
                let prayed = false;
                if (index < todayIndex) [focus, prayed] = sample[index];
                if (index === todayIndex) {
                    focus = day.minutes > 0 ? day.minutes : null;
                    prayed = day.prayed;
                }
                const none = index <= todayIndex && focus === null && !prayed;
                column.classList.toggle('is-empty', none);
                bar.style.setProperty('--h', focus ? Math.max(.06, focus / max).toFixed(3) : '0');
                value.textContent = focus ? focus + ' min' : !none ? '' : index === todayIndex ? 'Ainda não' : 'Sem registro';
                dot.hidden = !prayed;
                if (focus) {
                    sessions += Math.max(1, Math.round(focus / 25));
                    minutes += focus;
                }
                if (prayed) prayerDays++;
            });
            const hours = Math.floor(minutes / 60);
            const time = (hours ? hours + 'h ' : '') + (minutes % 60) + 'min';
            summary.textContent = 'Nos últimos 7 dias: ' + sessions + ' sessões de foco (' + time + ') e oração em ' + prayerDays
                + (prayerDays === 1 ? ' dia.' : ' dias.');
            const todayBar = bars[todayIndex];
            todayBar.column.title = day.task;
        }
        const initial = window.oraDay || { minutes: 13, prayed: true, task: 'Revisar minhas anotações' };
        renderChart(initial);
        document.addEventListener('ora:day', (event) => renderChart(event.detail));
    }

    // Dúvidas: a resposta abre e fecha por altura e opacidade (o <details> nativo só pula).
    // Um clique no meio da animação inverte a partir do ponto atual.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    for (const details of document.querySelectorAll('.faq details')) {
        const summary = details.querySelector('summary');
        const answer = details.querySelector('summary + *');
        let running = null;
        summary.addEventListener('click', (event) => {
            if (reduce.matches || !answer.animate) return;
            event.preventDefault();
            const opening = !details.open || details.hasAttribute('data-closing');
            const wasOpen = details.open;
            // Estado atual (inclusive no meio de uma animação), para inverter sem pulo.
            const style = getComputedStyle(answer);
            const from = { height: wasOpen ? answer.getBoundingClientRect().height : 0, pad: wasOpen ? style.paddingBottom : '0px', opacity: wasOpen ? style.opacity : 0 };
            if (running) running.cancel();
            details.toggleAttribute('data-closing', !opening);
            if (opening) details.open = true;
            const pad = getComputedStyle(answer).paddingBottom;
            const to = opening ? { height: answer.scrollHeight, pad, opacity: 1 } : { height: 0, pad: '0px', opacity: 0 };
            running = answer.animate(
                [{ height: from.height + 'px', paddingBottom: from.pad, opacity: from.opacity },
                    { height: to.height + 'px', paddingBottom: to.pad, opacity: to.opacity }],
                { duration: opening ? 340 : 240, easing: 'cubic-bezier(.23, 1, .32, 1)' }
            );
            running.onfinish = () => {
                running = null;
                if (!opening) {
                    details.open = false;
                    details.removeAttribute('data-closing');
                }
            };
        });
    }

    // Sugestões usam o diálogo nativo para conter e devolver o foco.
    const feedbackTrigger = document.querySelector('[data-open="feedback"]');
    const feedback = document.querySelector('#feedback');
    if (feedback && typeof feedback.showModal === 'function') {
        const form = feedback.querySelector('form');
        const formStatus = form.querySelector('.form-status');
        const submit = form.querySelector('[type="submit"]');
        feedbackTrigger.addEventListener('click', () => feedback.showModal());
        feedback.querySelector('[data-close]').addEventListener('click', () => feedback.close());
        feedback.addEventListener('click', (event) => {
            if (event.target === feedback) feedback.close();
        });
        feedbackTrigger.hidden = false;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            submit.disabled = true;
            formStatus.textContent = 'Enviando…';
            try {
                const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
                if (!response.ok) throw new Error(String(response.status));
                form.reset();
                formStatus.textContent = 'Obrigado. Sua mensagem foi enviada.';
            } catch {
                formStatus.textContent = 'Não foi possível enviar agora. Tente novamente ou fale com a gente no Instagram.';
            } finally {
                submit.disabled = false;
            }
        });
    }
})();
