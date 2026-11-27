const players = document.querySelectorAll('#sons audio');

for (const player of players) {
  player.addEventListener('play', () => {
    for (const other of players) {
      if (other !== player) other.pause();
    }
  });
}
