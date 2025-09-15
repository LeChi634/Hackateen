
// pomodoro.js - simples timer local sem dependências
(() => {
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (s) => `${pad(Math.floor(s/60))}:${pad(s%60)}`;

  const el = (id) => document.getElementById(id);

  const display = el('pomo-display');
  const focusChip = el('chip-focus');
  const shortChip = el('chip-short');
  const longChip  = el('chip-long');
  const startBtn  = el('pomo-start');
  const pauseBtn  = el('pomo-pause');
  const resetBtn  = el('pomo-reset');
  const meta      = el('pomo-meta');

  let mode = 'focus';
  let timer = null;
  let remaining = 25*60;
  let cycles = 0;

  const DUR = { focus: 25*60, short: 5*60, long: 15*60 };

  function setMode(m, customRemaining=null){
    mode = m;
    remaining = customRemaining ?? DUR[m];
    display.textContent = fmt(remaining);
    document.title = `${fmt(remaining)} • ${m === 'focus' ? 'Foco' : m === 'short' ? 'Pausa Curta' : 'Pausa Longa'} | Metodologia Livre`;
    [focusChip, shortChip, longChip].forEach(c=>c.classList.remove('active'));
    (m === 'focus' ? focusChip : m === 'short' ? shortChip : longChip).classList.add('active');
  }

function tick(){
  remaining -= 1;
  if (remaining <= 0){
    clearInterval(timer); timer = null;
    notify();
    if (mode === 'focus'){
      cycles += 1;
      setMode(cycles % 4 === 0 ? 'long' : 'short');
    }else{
    setMode('focus');
  }
meta.textContent = `Ciclos completos: ${cycles}`;
return;
}
display.textContent = fmt(remaining);
document.title = `${fmt(remaining)} • ${mode === 'focus' ? 'Foco' : mode === 'short' ? 'Pausa Curta' : 'Pausa Longa'} | Metodologia Livre`;
}

function start(){
  if (timer) return;
  timer = setInterval(tick, 1000);
}
function pause(){
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}
function reset(){
  pause();
  setMode(mode);
}

function notify(){
  try {
    if (window.Notification && Notification.permission !== 'denied'){
      Notification.requestPermission().then(() => {
        new Notification('Pomodoro', { body: 'Tempo encerrado! 🛎️' });
      });
  } else {
  // fallback simples
  alert('Tempo encerrado!');
}
} catch(e){
console.log('Notify not available', e);
}
}

// Chip handlers
focusChip.addEventListener('click', () => { pause(); setMode('focus'); });
shortChip.addEventListener('click', () => { pause(); setMode('short'); });
longChip.addEventListener('click',  () => { pause(); setMode('long'); });

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);

// init
setMode('focus');
meta.textContent = `Ciclos completos: ${cycles}`;
})();
