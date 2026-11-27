const icons = {
  play: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pause: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>'
};
const players = [];

function clock(seconds) {
  const whole = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  return Math.floor(whole / 60) + ':' + String(whole % 60).padStart(2, '0');
}

function enhance(audio) {
  const title = (audio.getAttribute('aria-label') || 'Ouvir som').replace(/^Ouvir /, '');
  const player = document.createElement('div');
  player.className = 'sound-player';
  player.innerHTML = `
    <button class="sound-play" type="button">${icons.play}</button>
    <input class="sound-seek" type="range" min="0" max="1000" step="1" value="0">
    <span class="sound-time">0:00 / 0:00</span>`;
  const button = player.querySelector('.sound-play');
  const seek = player.querySelector('.sound-seek');
  const time = player.querySelector('.sound-time');
  let frame = 0;
  button.setAttribute('aria-label', 'Tocar ' + title);
  seek.setAttribute('aria-label', 'Posição em ' + title);

  function render() {
    const ratio = audio.duration ? audio.currentTime / audio.duration : 0;
    seek.value = String(Math.round(ratio * 1000));
    seek.style.setProperty('--progress', (ratio * 100).toFixed(2) + '%');
    seek.setAttribute('aria-valuetext', clock(audio.currentTime) + ' de ' + clock(audio.duration));
    time.textContent = clock(audio.currentTime) + ' / ' + clock(audio.duration);
  }
  function loop() {
    render();
    if (!audio.paused) frame = requestAnimationFrame(loop);
  }
  function setPlaying(playing) {
    button.innerHTML = playing ? icons.pause : icons.play;
    button.setAttribute('aria-label', (playing ? 'Pausar ' : 'Tocar ') + title);
    player.classList.toggle('is-playing', playing);
  }

  button.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  });
  seek.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = Number(seek.value) / 1000 * audio.duration;
    render();
  });
  audio.addEventListener('loadedmetadata', render);
  audio.addEventListener('play', () => {
    for (const other of players) if (other !== audio) other.pause();
    setPlaying(true);
    cancelAnimationFrame(frame);
    loop();
  });
  audio.addEventListener('pause', () => { setPlaying(false); render(); });
  audio.addEventListener('ended', () => { audio.currentTime = 0; render(); });

  audio.removeAttribute('controls');
  audio.preload = 'metadata';
  audio.hidden = true;
  audio.after(player);
  players.push(audio);
  render();
}

for (const audio of document.querySelectorAll('audio')) enhance(audio);
