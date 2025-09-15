// nossa-metodologia.js — Pomodoro somente
(() => {
  const $ = id => document.getElementById(id);

  const els = {
    phase: $('pomo-phase'),
    mm: $('pomo-mm'),
    ss: $('pomo-ss'),
    bar: $('pomo-bar'),
    start: $('pomo-start'),
    pause: $('pomo-pause'),
    reset: $('pomo-reset'),
    focus: $('pomo-focus'),
    short: $('pomo-short'),
    long: $('pomo-long'),
    cycles: $('pomo-cycles'),
    cycleLabel: $('pomo-cycle')
  };

  // Durations padrão (em minutos)
  let DUR = { focus: 25, short: 5, long: 15 };
  let state = {
    phase: 'focus',
    total: DUR.focus * 60, // em segundos
    left: DUR.focus * 60,
    running: false,
    timer: null,
    startedAt: 0,
    cycle: 1
  };

  // Audio beep simples (fallback se não houver WebAudio)
  function beep(ms = 160, freq = 880) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq;
      o.type = 'sine';
      o.connect(g); g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, now + ms/1000);
      o.stop(now + ms/1000 + 0.05);
    } catch(e){ /* sem som */ }
  }

  function fmt(t){
    const m = Math.floor(t/60), s = Math.floor(t%60);
    return [String(m).padStart(2,'0'), String(s).padStart(2,'0')];
  }

  function render(){
    if (els.phase) els.phase.textContent = (
      state.phase === 'focus' ? 'Foco' :
      state.phase === 'short' ? 'Pausa curta' : 'Pausa longa'
    );
    const [m, s] = fmt(Math.max(0, state.left));
    if (els.mm) els.mm.textContent = m;
    if (els.ss) els.ss.textContent = s;
    if (els.bar && state.total > 0){
      const done = Math.max(0, Math.min(1, 1 - state.left / state.total));
      els.bar.style.width = (done * 100).toFixed(2) + '%';
    }
    if (els.cycleLabel) els.cycleLabel.textContent = String(state.cycle);
  }

  function setPhase(phase){
    state.phase = phase;
    state.total = DUR[phase] * 60;
    state.left  = state.total;
    stop();
    render();
  }

  function tick(){
    const now = Date.now();
    const elapsed = Math.floor((now - state.startedAt)/1000);
    state.left = Math.max(0, state.total - elapsed);
    render();
    if (state.left <= 0){
      beep();
      stop();
      // Ao terminar um foco, sugere pausa curta; ao terminar pausas, volta ao foco.
      if (state.phase === 'focus'){
        state.cycle += 1;
        setPhase('short');
      } else {
        setPhase('focus');
      }
    }
  }

  function start(){
    if (state.running) return;
    state.running = true;
    state.startedAt = Date.now() - (state.total - state.left) * 1000;
    state.timer = setInterval(tick, 250);
    render();
  }

  function pause(){
    if (!state.running) return;
    state.running = false;
    clearInterval(state.timer);
    state.timer = null;
    state.total = state.left; // congela total para retomar
    render();
  }

  function stop(){
    state.running = false;
    clearInterval(state.timer);
    state.timer = null;
  }

  function reset(){
    stop();
    state.left = state.total = DUR[state.phase] * 60;
    render();
  }

  // Botões
  if (els.start) els.start.addEventListener('click', start);
  if (els.pause) els.pause.addEventListener('click', pause);
  if (els.reset) els.reset.addEventListener('click', reset);
  if (els.focus) els.focus.addEventListener('click', () => setPhase('focus'));
  if (els.short) els.short.addEventListener('click', () => setPhase('short'));
  if (els.long)  els.long.addEventListener('click',  () => setPhase('long'));

  // Inicializa
  setPhase('focus');
  render();
})();