const demo = document.querySelector('.demo');
const layout = demo.closest('.tour-layout');
const stage = demo.closest('.tour-stage');
const header = document.querySelector('.header');
const panels = [...demo.querySelectorAll('[data-panel]')];
const steps = [...demo.querySelectorAll('.demo-steps button')];
const beats = [...layout.querySelectorAll('[data-beat]')];
const tourToggle = demo.querySelector('.tour-toggle');
const tourViewport = window.matchMedia('(min-width: 901px) and (min-height: 700px)');
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
const hint = demo.querySelector('#demo-hint');
const status = demo.querySelector('#demo-status');
const fruitsLink = demo.querySelector('#demo-fruits');

const duration = 25 * 60;
const sceneHints = {
    today: 'Seu próximo passo já está pronto. Você pode personalizá-lo.',
    focus: 'Abra a aba Rede social para ver a proteção em ação.',
    opening: 'A tentativa de abrir a aba acontece aqui na demonstração.',
    blocked: 'O Ora traz sua tarefa de volta à tela.',
    prayer: 'Experimente mudar o tamanho do texto ou a aparência da leitura.'
};
let task = taskInput.value;
let intention = intentions.find((button) => button.getAttribute('aria-pressed') === 'true').textContent.trim();
let deadline = null;
let interval;
let openingTimer;
let returnedToTask = false;
let beforePrayer = 'today';
let textSize = 19;
let manual = false;
let tourFrame = null;
// Na apresentação, a rolagem conduz o relógio do foco: de 25:00 até restarem 12 minutos.
const tourEndSeconds = 12 * 60;
let tourSeconds = duration;

// Cada verso da oração vira uma linha para se acender conforme a rolagem.
let lineIndex = 0;
for (const paragraph of reader.querySelectorAll('.prayer-text p')) {
    for (const node of [...paragraph.childNodes]) {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
        const line = document.createElement('span');
        line.className = 'prayer-line';
        line.style.setProperty('--i', lineIndex++);
        line.textContent = node.textContent;
        node.replaceWith(line);
    }
}

function renderDay() {
    for (const element of document.querySelectorAll('[data-task]')) {
        element.textContent = task;
    }
    for (const element of demo.querySelectorAll('[data-intention]')) {
        element.textContent = intention ? 'Intenção do dia · ' + intention : '';
        element.hidden = !intention;
    }
    document.querySelector('#hero-intent').textContent = intention || 'Oferecer o dia por…';
}

function showTaskCard(show) {
    taskForm.hidden = show;
    taskCard.hidden = !show;
}

function focusInside(target) {
    target.focus({ preventScroll: true });
    const top = Math.max(12, header.getBoundingClientRect().bottom + 12);
    const bottom = window.innerHeight - 14;
    const stepsTop = demo.getBoundingClientRect().top;
    const bounds = target.getBoundingClientRect();

    // Preserve the chapter controls whenever they and the focused target fit together.
    if (stepsTop < top - 1 && bounds.bottom - stepsTop <= bottom - top) {
        window.scrollBy({ top: stepsTop - top, behavior: 'instant' });
    } else if (bounds.top < top) {
        window.scrollBy({ top: bounds.top - top, behavior: 'instant' });
    } else if (bounds.bottom > bottom) {
        window.scrollBy({ top: bounds.bottom - bottom, behavior: 'instant' });
    }
}

function isTouring() {
    return tourViewport.matches && !manual;
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

    const active = !complete && (scene === 'focus' || (!isTouring() && deadline !== null));
    protection.toggleAttribute('data-active', active);
    protectionLabel.textContent = active ? 'Proteção ativa' : 'Proteção';
    focusLabel.textContent = complete ? 'Foco concluído' : 'Em foco';
    focusLabel.parentElement.toggleAttribute('data-complete', complete);
    socialTab.hidden = (scene !== 'focus' || complete) && scene !== 'opening' && scene !== 'blocked';
    socialTab.tabIndex = scene === 'focus' ? 0 : -1;
    if (scene === 'focus') socialTab.removeAttribute('aria-disabled');
    else socialTab.setAttribute('aria-disabled', 'true');
    restart.hidden = !complete;
    returnNote.hidden = !returnedToTask || complete || isTouring();
    const suggestPrayer = complete || (!isTouring() && returnedToTask);
    prayerButton.classList.toggle('app-primary', suggestPrayer);
    prayerButton.classList.toggle('app-quiet', !suggestPrayer);
    if (scene === 'focus') {
        hint.textContent = complete ? 'A sessão terminou. Você pode abrir uma oração ou iniciar outro foco.'
            : suggestPrayer ? 'Retome a tarefa ou faça uma pausa para rezar.' : sceneHints.focus;
    }
    if (tick && complete && (scene === 'blocked' || scene === 'opening')) {
        showScene('focus', { moveFocus: demo.contains(document.activeElement) });
    }
}

function finishLeaving(panel) {
    window.clearTimeout(panel.leaveTimer);
    if (!panel.hasAttribute('data-leaving')) return;
    panel.removeAttribute('data-leaving');
    panel.inert = false;
    panel.style.top = panel.style.height = '';
    panel.hidden = panel.dataset.panel !== demo.dataset.scene;
    if (panel.dataset.panel === 'today') taskTitle.style.visibility = '';
}

function showScene(scene, { moveFocus = false } = {}) {
    const previous = demo.dataset.scene;
    const animate = scene !== previous && !reducedMotion.matches && !document.hidden;
    for (const panel of panels) finishLeaving(panel);
    const leaving = animate ? panels.find((element) => element.dataset.panel === previous) : null;
    const leavingBox = leaving && { top: leaving.offsetTop, height: leaving.offsetHeight };
    // O título da tarefa viaja do cartão de Hoje até a sessão de foco.
    const flyFrom = animate && previous === 'today' && scene === 'focus' && !taskCard.hidden
        ? taskTitle.getBoundingClientRect() : null;
    if (scene !== 'opening') window.clearTimeout(openingTimer);
    if (scene === 'prayer' && previous !== 'prayer') beforePrayer = previous === 'opening' ? 'focus' : previous;
    const chapter = scene === 'opening' ? 'blocked' : scene;

    for (const step of steps) {
        if ((step.dataset.step || step.dataset.go) === chapter) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
    }
    for (const beat of beats) beat.toggleAttribute('data-current', beat.dataset.beat === chapter);

    demo.dataset.scene = scene;
    if (scene !== previous) demo.dataset.transition = scene;
    demo.querySelector('#demo-appbar').hidden = !['today', 'focus'].includes(scene);
    for (const panel of panels) panel.hidden = panel.dataset.panel !== scene;
    demo.toggleAttribute('data-flip', Boolean(flyFrom));
    if (leaving) {
        leaving.hidden = false;
        leaving.inert = true;
        leaving.setAttribute('data-leaving', '');
        leaving.style.top = leavingBox.top + 'px';
        leaving.style.height = leavingBox.height + 'px';
        leaving.leaveTimer = window.setTimeout(() => finishLeaving(leaving), 320);
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
        ], { duration: 560, easing: 'cubic-bezier(.22, .7, .23, 1)' });
    }
    fruitsLink.hidden = scene !== 'prayer';
    hint.textContent = sceneHints[scene];
    renderSession();

    if (moveFocus) {
        const panel = panels.find((element) => element.dataset.panel === scene);
        focusInside(scene === 'prayer' ? panel : panel.querySelector('h3'));
    }
}

function updateTour() {
    tourFrame = null;
    if (!isTouring()) return;
    const bounds = layout.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    const inset = Number.parseFloat(getComputedStyle(stage).top);
    const travel = Math.max(1, bounds.height - stage.offsetHeight);
    const position = Math.min(1, Math.max(0, inset - bounds.top) / travel);
    layout.style.setProperty('--tour-p', position.toFixed(4));

    // Cada momento ocupa um trecho da trilha; "local" é o avanço dentro dele.
    const exact = Math.min(beats.length - .0001, position * beats.length);
    const index = Math.floor(exact);
    const local = exact - index;
    const chapter = beats[index].dataset.beat;
    const scene = chapter === 'blocked' && local < .16 && !reducedMotion.matches ? 'opening' : chapter;

    const seconds = chapter === 'today' ? duration
        : chapter === 'focus' ? Math.round(duration - local * (duration - tourEndSeconds))
            : tourEndSeconds;
    const timeChanged = seconds !== tourSeconds;
    tourSeconds = seconds;
    demo.toggleAttribute('data-armed', chapter === 'today' && local > .66);
    demo.toggleAttribute('data-nudge', chapter === 'focus' && local > .7);
    reader.style.setProperty('--lit', chapter === 'prayer' ? Math.min(1, local * 1.25).toFixed(3) : 1);

    if (demo.dataset.scene !== scene) showScene(scene);
    else if (timeChanged) renderSession({ tick: true });
}

// A trilha tem a altura do palco mais a distância rolada: cerca de 70% da tela por momento.
function sizeTour() {
    if (!tourViewport.matches) {
        layout.style.height = '';
        return;
    }
    // O palco fica centrado na tela, sem encostar no cabeçalho.
    const inset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--demo-inset'));
    layout.style.setProperty('--stage-top', Math.max(inset, Math.round((window.innerHeight - stage.offsetHeight) / 2 + 24)) + 'px');
    layout.style.height = stage.offsetHeight + Math.round(window.innerHeight * .7) * beats.length + 'px';
}

function scrollToBeat(index) {
    const top = layout.getBoundingClientRect().top + window.scrollY - Number.parseFloat(getComputedStyle(stage).top);
    const travel = layout.offsetHeight - stage.offsetHeight;
    window.scrollTo({ top: top + travel * (index + .35) / beats.length, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}

function queueTourUpdate() {
    if (isTouring() && tourFrame === null) tourFrame = window.requestAnimationFrame(updateTour);
}

function setManual(value) {
    manual = value;
    tourToggle.textContent = value ? 'Retomar apresentação' : 'Pausar apresentação';
    if (value) {
        demo.removeAttribute('data-armed');
        demo.removeAttribute('data-nudge');
        reader.style.setProperty('--lit', 1);
        renderSession();
    } else {
        showTaskCard(true);
        if (demo.dataset.scene === 'opening') showScene('focus');
        renderSession();
        queueTourUpdate();
    }
}

function configureTour() {
    layout.toggleAttribute('data-scroll-tour', tourViewport.matches);
    tourToggle.hidden = !tourViewport.matches;
    sizeTour();
    queueTourUpdate();
}

for (const [index, beat] of beats.entries()) {
    beat.addEventListener('click', () => {
        if (!tourViewport.matches) return;
        if (manual) setManual(false);
        scrollToBeat(index);
    });
}

// Any use of the window hands control to the visitor until they resume the tour.
for (const eventName of ['focusin', 'pointerdown']) {
    demo.addEventListener(eventName, (event) => {
        if (event.target !== tourToggle && !manual) setManual(true);
    });
}
window.addEventListener('scroll', queueTourUpdate, { passive: true });
window.addEventListener('resize', () => {
    sizeTour();
    queueTourUpdate();
});
tourViewport.addEventListener('change', configureTour);

function startFocus() {
    if (deadline === null || Date.now() >= deadline) {
        deadline = Date.now() + duration * 1000;
        returnedToTask = false;
        window.clearInterval(interval);
        interval = window.setInterval(() => renderSession({ tick: true }), 1000);
    }
}

function openDistraction() {
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

document.querySelector('[data-demo-start]').addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== '#como-funciona') history.pushState(null, '', '#como-funciona');
    setManual(true);
    startFocus();
    showScene('focus');
    demo.scrollIntoView({ block: 'start', behavior: 'instant' });
    focusInside(socialTab);
});

demo.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.getAttribute('aria-disabled') === 'true') return;
    const { go, action } = button.dataset;
    if (action !== 'toggle-tour' && !manual) setManual(true);

    if (go === 'focus') {
        startFocus();
        showScene('focus');
        focusInside(socialTab);
    } else if (go) {
        showScene(go, { moveFocus: true });
    }
    if (action === 'open-tab') openDistraction();
    if (action === 'return') {
        if (deadline === null) startFocus();
        returnedToTask = true;
        showScene('focus', { moveFocus: true });
    }
    if (action === 'restart') {
        startFocus();
        showScene('focus', { moveFocus: true });
    }
    if (action === 'reader-back') {
        if (deadline === null && beforePrayer !== 'today') startFocus();
        const previous = beforePrayer === 'blocked' && Date.now() >= deadline ? 'focus' : beforePrayer;
        showScene(previous, { moveFocus: true });
    }
    if (action === 'toggle-tour') {
        setManual(!manual);
        status.textContent = manual ? 'Apresentação pausada. Explore as etapas nos controles.'
            : 'Apresentação retomada. A janela acompanha a rolagem.';
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
    if (task !== newTask) {
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
        // Keep focus on the active control at either end of the range.
        for (const item of sizeButtons) {
            const atLimit = Number(item.dataset.size) < 0 ? textSize === 16 : textSize === 38;
            item.setAttribute('aria-disabled', atLimit);
        }
    });
}

// O relógio da abertura mostra a hora de quem visita, como na extensão.
const heroClock = document.querySelector('.hero-clock');
function renderClock() {
    const now = new Date();
    heroClock.textContent = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}
renderClock();
window.setInterval(renderClock, 15000);

renderDay();
demo.querySelectorAll('[data-demo-controls]').forEach((element) => { element.hidden = false; });
configureTour();

// Sugestões usam o diálogo nativo para conter e devolver o foco.
const feedbackTrigger = document.querySelector('[data-open="feedback"]');
const feedback = document.querySelector('#feedback');
const form = feedback.querySelector('form');
const formStatus = form.querySelector('.form-status');
const submit = form.querySelector('[type="submit"]');

if (typeof feedback.showModal === 'function') {
    feedbackTrigger.addEventListener('click', () => feedback.showModal());
    feedback.querySelector('[data-close]').addEventListener('click', () => feedback.close());
    feedback.addEventListener('click', (event) => {
        if (event.target === feedback) feedback.close();
    });
    feedbackTrigger.hidden = false;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    formStatus.textContent = 'Enviando…';
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        formStatus.textContent = 'Obrigado! Sua mensagem foi enviada.';
    } catch {
        formStatus.textContent = 'Não foi possível enviar agora. Tente novamente ou fale com a gente no Instagram.';
    } finally {
        submit.disabled = false;
    }
});
