// Demonstração "Um dia com Ora".
// No desktop (apresentação), a rolagem é a única fonte de verdade: cada botão que troca de cena
// rola a página até o momento correspondente, então rolar para cima ou para baixo sempre faz sentido.
// No celular e com movimento reduzido, os botões trocam a cena diretamente e o relógio corre de verdade.
const demo = document.querySelector('.demo');
const layout = demo.closest('.tour-layout');
const stage = demo.closest('.tour-stage');
const header = document.querySelector('.header');
const panels = [...demo.querySelectorAll('[data-panel]')];
const steps = [...demo.querySelectorAll('.demo-steps button')];
const beats = [...layout.querySelectorAll('[data-beat]')];
const beatNames = beats.map((beat) => beat.dataset.beat);
const tourViewport = window.matchMedia('(min-width: 901px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const taskForm = demo.querySelector('#demo-task-form');
const taskInput = demo.querySelector('#demo-task-input');
const taskCard = demo.querySelector('#demo-task-card');
const taskTitle = demo.querySelector('#demo-saved-task');
const editTask = demo.querySelector('#demo-edit-task');
const intentions = [...demo.querySelectorAll('.intention-options button')];
const reader = demo.querySelector('.reader-scene');
const sizeButtons = [...reader.querySelectorAll('[data-size]')];
const appearanceButtons = [...reader.querySelectorAll('button[data-appearance]')];
const socialTab = demo.querySelector('#demo-try-block');
const prayerButton = demo.querySelector('#demo-open-prayer');
const protection = demo.querySelector('#demo-protection');
const protectionLabel = demo.querySelector('#demo-protection-label');
const timer = demo.querySelector('#demo-timer');
const progress = demo.querySelector('#demo-progress');
const blockTime = demo.querySelector('#demo-block-time');
const restart = demo.querySelector('#demo-restart');
const returnNote = demo.querySelector('#demo-return-note');
const focusLabel = demo.querySelector('#demo-focus-label');
const endFocus = demo.querySelector('#demo-end-focus');
const endPrayer = demo.querySelector('#demo-end-prayer');
const hint = demo.querySelector('#demo-hint');
const status = demo.querySelector('#demo-status');
const prayerLines = [];

const duration = 25 * 60;
const sceneHints = {
    today: 'Seu próximo passo já está pronto. Você pode personalizá-lo.',
    focus: 'Abra a aba Rede social para ver a proteção em ação.',
    opening: 'A tentativa de abrir a aba acontece aqui na demonstração.',
    blocked: 'O Ora traz sua tarefa de volta à tela.',
    prayer: 'Experimente mudar o tamanho do texto ou a aparência da leitura.',
    end: 'O dia fica registrado em Frutos, logo abaixo.'
};
let task = taskInput.value;
let intention = intentions.find((button) => button.getAttribute('aria-pressed') === 'true').textContent.trim();
let deadline = null;
let interval;
let openingTimer;
let returnedToTask = false;
let prayed = false;
let beforePrayer = 'today';
let textSize = 19;
let tourFrame = null;
let pendingFocus = null;
// Geometria da trilha, medida no resize (nunca a cada quadro de rolagem).
const track = { top: 0, travel: 1, inset: 0 };
// Na apresentação, a rolagem conduz o relógio do foco: de 25:00 até restarem 12 minutos.
const tourEndSeconds = 12 * 60;
let tourSeconds = duration;

// Cada verso da oração vira uma linha para se acender conforme a rolagem.
for (const paragraph of reader.querySelectorAll('.prayer-text p')) {
    for (const node of [...paragraph.childNodes]) {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
        const line = document.createElement('span');
        line.className = 'prayer-line';
        line.textContent = node.textContent;
        node.replaceWith(line);
        prayerLines.push(line);
    }
}

function isTouring() {
    return tourViewport.matches;
}

function focusedMinutes() {
    if (isTouring()) return Math.round((duration - tourSeconds) / 60);
    if (deadline === null) return 0;
    const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    return Math.floor((duration - remaining) / 60);
}

// O dia da demonstração é compartilhado com o resto da página (Frutos, abertura).
function publishDay() {
    const detail = { task, intention, minutes: focusedMinutes(), prayed };
    window.oraDay = detail;
    document.dispatchEvent(new CustomEvent('ora:day', { detail }));
}

function renderDay() {
    for (const element of document.querySelectorAll('[data-task]')) {
        element.textContent = task;
    }
    for (const element of demo.querySelectorAll('[data-intention]')) {
        element.textContent = intention ? 'Intenção do dia · ' + intention : '';
        element.hidden = !intention;
    }
    const heroIntent = document.querySelector('#hero-intent');
    if (heroIntent) heroIntent.textContent = intention || 'Oferecer o dia por…';
    publishDay();
}

function renderEnd() {
    const minutes = focusedMinutes();
    endFocus.textContent = minutes > 0 ? minutes + ' min de foco protegido' : 'Nenhuma sessão de foco ainda';
    endFocus.previousElementSibling.textContent = minutes > 0 ? '✓' : '';
    const prayedNow = prayed || isTouring();
    endPrayer.textContent = prayedNow ? 'Ave Maria no leitor' : 'Um momento de oração, quando quiser';
    endPrayer.previousElementSibling.textContent = prayedNow ? '✓' : '';
}

function showTaskCard(show) {
    taskForm.hidden = show;
    taskCard.hidden = !show;
}

function focusInside(target) {
    target.focus({ preventScroll: true });
    if (isTouring()) return;
    const top = Math.max(12, header.getBoundingClientRect().bottom + 12);
    const bottom = window.innerHeight - 14;
    const stepsTop = demo.getBoundingClientRect().top;
    const bounds = target.getBoundingClientRect();

    // Mantém os controles de etapa visíveis quando eles e o alvo cabem juntos.
    if (stepsTop < top - 1 && bounds.bottom - stepsTop <= bottom - top) {
        window.scrollBy({ top: stepsTop - top, behavior: 'instant' });
    } else if (bounds.top < top) {
        window.scrollBy({ top: bounds.top - top, behavior: 'instant' });
    } else if (bounds.bottom > bottom) {
        window.scrollBy({ top: bounds.bottom - bottom, behavior: 'instant' });
    }
}

function focusTarget(scene) {
    const panel = panels.find((element) => element.dataset.panel === scene);
    return scene === 'prayer' ? panel : panel.querySelector('h3');
}

function renderSession({ tick = false } = {}) {
    const scene = demo.dataset.scene;
    const remaining = deadline === null ? duration : Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const seconds = isTouring() ? tourSeconds : remaining;
    const complete = seconds === 0;
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const remainder = String(seconds % 60).padStart(2, '0');
    timer.textContent = minutes + ':' + remainder;
    progress.style.transform = 'scaleX(' + (1 - seconds / duration) + ')';
    const blockMessage = complete ? 'O tempo reservado terminou.' : 'Faltam ' + Math.ceil(seconds / 60) + ' min';
    if (blockTime.textContent !== blockMessage) blockTime.textContent = blockMessage;
    if (remaining === 0) window.clearInterval(interval);
    if (tick && !complete) return;

    const active = !complete && (scene === 'focus' || scene === 'blocked' || scene === 'opening' || (!isTouring() && deadline !== null && scene !== 'end'));
    protection.toggleAttribute('data-active', active);
    protectionLabel.textContent = active ? 'Proteção ativa' : 'Proteção';
    focusLabel.textContent = complete ? 'Foco concluído' : 'Em foco';
    focusLabel.parentElement.toggleAttribute('data-complete', complete);
    socialTab.hidden = (scene !== 'focus' || complete) && scene !== 'opening' && scene !== 'blocked';
    socialTab.tabIndex = scene === 'focus' ? 0 : -1;
    if (scene === 'focus') socialTab.removeAttribute('aria-disabled');
    else socialTab.setAttribute('aria-disabled', 'true');
    restart.hidden = !complete;
    returnNote.hidden = !returnedToTask || complete;
    const suggestPrayer = complete || returnedToTask;
    prayerButton.classList.toggle('app-primary', suggestPrayer);
    prayerButton.classList.toggle('app-quiet', !suggestPrayer);
    if (scene === 'focus') {
        hint.textContent = complete ? 'A sessão terminou. Você pode abrir uma oração ou iniciar outro foco.'
            : suggestPrayer ? 'Retome a tarefa ou faça uma pausa para rezar.' : sceneHints.focus;
    }
    if (scene === 'end') renderEnd();
    if (tick && complete && (scene === 'blocked' || scene === 'opening')) {
        showScene('focus', { moveFocus: demo.contains(document.activeElement) });
    }
}

function finishLeaving(panel) {
    if (panel.leaving) panel.leaving.cancel();
    panel.leaving = null;
    if (!panel.hasAttribute('data-leaving')) return;
    panel.removeAttribute('data-leaving');
    panel.inert = false;
    panel.style.top = panel.style.height = '';
    panel.hidden = panel.dataset.panel !== demo.dataset.scene;
    if (panel.dataset.panel === 'today') taskTitle.style.visibility = '';
}

const sceneEase = 'cubic-bezier(.23, 1, .32, 1)';

function showScene(scene, { moveFocus = false } = {}) {
    const previous = demo.dataset.scene;
    if (scene === previous) {
        if (moveFocus) focusInside(focusTarget(scene));
        return;
    }
    const animate = !reducedMotion.matches && !document.hidden;
    for (const panel of panels) finishLeaving(panel);
    const leaving = animate ? panels.find((element) => element.dataset.panel === previous) : null;
    const leavingBox = leaving && { top: leaving.offsetTop, height: leaving.offsetHeight };
    // O título da tarefa viaja do cartão de Hoje até a sessão de foco.
    const flyFrom = animate && previous === 'today' && scene === 'focus' && !taskCard.hidden
        ? taskTitle.getBoundingClientRect() : null;
    if (scene !== 'opening') window.clearTimeout(openingTimer);
    if (scene === 'prayer') {
        if (previous !== 'prayer') beforePrayer = previous === 'opening' ? 'focus' : previous;
        prayed = true;
    }
    const chapter = scene === 'opening' ? 'blocked' : scene;

    for (const step of steps) {
        if ((step.dataset.step || step.dataset.go) === chapter) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
    }
    for (const beat of beats) beat.toggleAttribute('data-current', beat.dataset.beat === chapter);

    demo.dataset.scene = scene;
    demo.querySelector('#demo-appbar').hidden = !['today', 'focus', 'end'].includes(scene);
    for (const panel of panels) panel.hidden = panel.dataset.panel !== scene;
    const entering = panels.find((element) => element.dataset.panel === scene);

    if (leaving) {
        // A cena que sai se dissolve por cima, fora do fluxo, enquanto a nova entra.
        leaving.hidden = false;
        leaving.inert = true;
        leaving.setAttribute('data-leaving', '');
        leaving.style.top = leavingBox.top + 'px';
        leaving.style.height = leavingBox.height + 'px';
        leaving.leaving = leaving.animate(
            [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px) scale(.985)' }],
            { duration: 220, easing: sceneEase, fill: 'forwards' }
        );
        leaving.leaving.finished.then(() => finishLeaving(leaving), () => {});
    }
    if (animate) {
        // A cena que entra chega em sequência, com atrasos que encolhem.
        const delays = [0, 50, 90, 120, 140];
        [...entering.children].forEach((child, index) => {
            if (flyFrom && child.id === 'scene-focus') return;
            child.animate(
                [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
                { duration: 420, delay: delays[Math.min(index, delays.length - 1)], easing: sceneEase, fill: 'backwards' }
            );
        });
    }
    if (flyFrom) {
        const title = demo.querySelector('#scene-focus');
        const to = title.getBoundingClientRect();
        taskTitle.style.visibility = 'hidden';
        title.animate([
            {
                transform: 'translate(' + (flyFrom.left + flyFrom.width / 2 - to.left - to.width / 2) + 'px, '
                    + (flyFrom.top + flyFrom.height / 2 - to.top - to.height / 2) + 'px) scale(' + flyFrom.height / to.height + ')'
            },
            { transform: 'none' }
        ], { duration: 520, easing: 'cubic-bezier(.77, 0, .175, 1)' });
    }
    hint.textContent = sceneHints[scene];
    renderSession();
    if (scene === 'end') publishDay();

    if (moveFocus || pendingFocus === scene) {
        pendingFocus = null;
        focusInside(focusTarget(scene));
    }
}

// Apresentação: cada momento ocupa um trecho da trilha; "local" é o avanço dentro dele.
function updateTour() {
    tourFrame = null;
    if (!isTouring()) return;
    const position = Math.min(1, Math.max(0, (window.scrollY - track.top) / track.travel));
    layout.style.setProperty('--tour-p', position.toFixed(4));

    const exact = Math.min(beats.length - .0001, position * beats.length);
    const index = Math.floor(exact);
    const local = exact - index;
    const chapter = beatNames[index];
    const scene = chapter === 'blocked' && local < .16 ? 'opening' : chapter;

    const focusIndex = beatNames.indexOf('focus');
    const seconds = index < focusIndex ? duration
        : index === focusIndex ? Math.round(duration - local * (duration - tourEndSeconds))
            : tourEndSeconds;
    const timeChanged = seconds !== tourSeconds;
    tourSeconds = seconds;
    demo.toggleAttribute('data-armed', chapter === 'today' && local > .66);
    demo.toggleAttribute('data-nudge', chapter === 'focus' && local > .7);
    const lit = chapter === 'prayer' ? Math.min(1, local * 1.25) : 1;
    prayerLines.forEach((line, i) => {
        const value = Math.min(1, Math.max(.26, lit * 9.6 - i));
        if (line.lit !== value) {
            line.lit = value;
            line.style.opacity = value;
        }
    });

    if (demo.dataset.scene !== scene) showScene(scene);
    else if (timeChanged) renderSession({ tick: true });
    if (timeChanged) publishDay();
}

// A trilha tem a altura do palco mais a distância rolada: cerca de 70% da tela por momento.
function sizeTour() {
    if (!isTouring()) {
        layout.style.height = '';
        layout.style.removeProperty('--stage-top');
        return;
    }
    const inset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--demo-inset'));
    const stageTop = Math.max(inset, Math.round((window.innerHeight - stage.offsetHeight) / 2 + 24));
    layout.style.setProperty('--stage-top', stageTop + 'px');
    layout.style.height = stage.offsetHeight + Math.round(window.innerHeight * .7) * beats.length + 'px';
    track.inset = stageTop;
    track.top = layout.getBoundingClientRect().top + window.scrollY - stageTop;
    track.travel = Math.max(1, layout.offsetHeight - stage.offsetHeight);
}

// Leva a rolagem até um ponto do momento; a cena muda pela própria rolagem.
function scrollToBeat(name, local = .35, { focus = false } = {}) {
    const index = beatNames.indexOf(name);
    if (index < 0) return;
    if (focus) pendingFocus = local < .16 && name === 'blocked' ? 'opening' : name;
    window.scrollTo({ top: track.top + track.travel * (index + local) / beats.length, behavior: 'smooth' });
}

function queueTourUpdate() {
    if (isTouring() && tourFrame === null) tourFrame = window.requestAnimationFrame(updateTour);
}

function configureTour() {
    const touring = isTouring();
    layout.toggleAttribute('data-scroll-tour', touring);
    demo.querySelector('.demo-steps').hidden = touring;
    if (!touring) {
        demo.removeAttribute('data-armed');
        demo.removeAttribute('data-nudge');
        for (const line of prayerLines) line.style.opacity = line.lit = '';
    }
    sizeTour();
    renderSession();
    queueTourUpdate();
}

for (const beat of beats) {
    beat.addEventListener('click', () => {
        if (isTouring()) scrollToBeat(beat.dataset.beat, .35, { focus: true });
    });
}

window.addEventListener('scroll', queueTourUpdate, { passive: true });
window.addEventListener('resize', () => {
    sizeTour();
    queueTourUpdate();
});
window.addEventListener('load', () => {
    sizeTour();
    queueTourUpdate();
});
// Fontes e imagens acima da trilha mudam a posição dela: remede quando a página muda de altura.
if ('ResizeObserver' in window) {
    let lastHeight = 0;
    new ResizeObserver(() => {
        const height = document.documentElement.scrollHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        sizeTour();
        queueTourUpdate();
    }).observe(document.body);
}
tourViewport.addEventListener('change', configureTour);

function startFocus() {
    if (deadline === null || Date.now() >= deadline) {
        deadline = Date.now() + duration * 1000;
        returnedToTask = false;
        window.clearInterval(interval);
        interval = window.setInterval(() => {
            renderSession({ tick: true });
            publishDay();
        }, 1000);
    }
}

function openDistraction() {
    if (isTouring()) {
        scrollToBeat('blocked', .3, { focus: true });
        return;
    }
    if (demo.dataset.scene === 'opening') return;
    startFocus();
    if (reducedMotion.matches) {
        showScene('blocked', { moveFocus: true });
        return;
    }
    showScene('opening');
    status.textContent = 'Abrindo a aba fictícia Rede social.';
    socialTab.focus({ preventScroll: true });
    openingTimer = window.setTimeout(() => {
        const frame = demo.getBoundingClientRect();
        const inView = frame.bottom > header.getBoundingClientRect().bottom && frame.top < window.innerHeight;
        showScene('blocked', { moveFocus: inView && demo.contains(document.activeElement) });
    }, 520);
}

// Botões que mudam de momento: na apresentação, rolam; fora dela, trocam a cena.
function goTo(scene, { local = .35 } = {}) {
    if (isTouring()) {
        scrollToBeat(scene, local, { focus: true });
        return;
    }
    if (scene === 'focus') {
        startFocus();
        showScene('focus');
        focusInside(socialTab);
        return;
    }
    showScene(scene, { moveFocus: true });
}

for (const trigger of document.querySelectorAll('[data-demo-start]')) {
    trigger.addEventListener('click', (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (location.hash !== '#como-funciona') history.pushState(null, '', '#como-funciona');
        if (isTouring()) {
            scrollToBeat('focus', .12, { focus: true });
            return;
        }
        startFocus();
        showScene('focus');
        demo.scrollIntoView({ block: 'start', behavior: 'instant' });
        focusInside(socialTab);
    });
}

demo.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.getAttribute('aria-disabled') === 'true') return;
    const { go, action } = button.dataset;

    if (go) goTo(go, { local: go === 'focus' ? .12 : .35 });
    if (action === 'open-tab') openDistraction();
    if (action === 'return') {
        returnedToTask = true;
        if (isTouring()) {
            scrollToBeat('focus', .92, { focus: true });
        } else {
            if (deadline === null) startFocus();
            showScene('focus', { moveFocus: true });
        }
    }
    if (action === 'restart') {
        startFocus();
        showScene('focus', { moveFocus: true });
    }
    if (action === 'reader-back') {
        if (isTouring()) {
            scrollToBeat(beforePrayer === 'today' ? 'today' : 'focus', beforePrayer === 'today' ? .35 : .92, { focus: true });
        } else {
            if (deadline === null && beforePrayer !== 'today') startFocus();
            const previous = beforePrayer === 'blocked' && Date.now() >= deadline ? 'focus' : beforePrayer;
            showScene(previous, { moveFocus: true });
        }
    }
    if (action === 'cancel-edit') {
        showTaskCard(true);
        focusInside(editTask);
    }
});

for (const button of intentions) {
    button.addEventListener('click', () => {
        intention = button.getAttribute('aria-pressed') === 'true' ? '' : button.textContent.trim();
        for (const item of intentions) item.setAttribute('aria-pressed', Boolean(intention) && item === button);
        renderDay();
        status.textContent = intention ? 'Intenção escolhida. ' + intention + '.' : 'Intenção removida.';
    });
}

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTask = taskInput.value.trim();
    if (!newTask) {
        taskInput.setCustomValidity('Escreva sua próxima tarefa.');
        taskInput.reportValidity();
        return;
    }
    if (task !== newTask && !isTouring()) {
        window.clearInterval(interval);
        deadline = null;
        returnedToTask = false;
    }
    task = newTask;
    renderDay();
    renderSession();
    showTaskCard(true);
    focusInside(taskTitle);
});
taskInput.addEventListener('input', () => taskInput.setCustomValidity(''));
editTask.addEventListener('click', () => {
    taskInput.value = task;
    taskInput.setCustomValidity('');
    showTaskCard(false);
    focusInside(taskInput);
    taskInput.select();
});

for (const button of appearanceButtons) {
    button.addEventListener('click', () => {
        reader.dataset.appearance = button.dataset.appearance;
        for (const item of appearanceButtons) item.setAttribute('aria-pressed', item === button);
    });
}
for (const button of sizeButtons) {
    button.addEventListener('click', () => {
        if (button.getAttribute('aria-disabled') === 'true') return;
        textSize = Math.min(38, Math.max(16, textSize + Number(button.dataset.size)));
        reader.style.setProperty('--read-size', textSize / 16 + 'rem');
        demo.querySelector('#demo-text-size').textContent = textSize;
        for (const item of sizeButtons) {
            const atLimit = Number(item.dataset.size) < 0 ? textSize === 16 : textSize === 38;
            item.setAttribute('aria-disabled', atLimit);
        }
    });
}

renderDay();
demo.querySelectorAll('[data-demo-controls]').forEach((element) => { element.hidden = false; });
configureTour();
