// Estatística anônima de uso: página visitada e ações, sem cookies, IP ou identificadores.
const endpoint = document.querySelector('meta[name="miudoverso-eventos"]')?.content;
const page = document.querySelector('meta[name="miudoverso-pagina"]')?.content || '/';
const base = new URL('./', import.meta.url);

function send(tipo, alvo = '') {
  if (!endpoint) return;
  const body = JSON.stringify({ tipo, pagina: page, alvo: alvo.toLowerCase().slice(0, 120) });
  const blob = new Blob([body], { type: 'application/json' });
  if (!navigator.sendBeacon?.(endpoint, blob)) {
    fetch(endpoint, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
  }
}

function sitePath(href) {
  const url = new URL(href, location.href);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return '';
  return '/' + url.pathname.slice(base.pathname.length).replace(/index\.html$/, '');
}

window.miudoversoMetrica = alvo => send('acao', alvo);
send('visita');

document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  if (link.hasAttribute('download')) {
    send('acao', 'baixar:' + link.getAttribute('download'));
    return;
  }
  const path = sitePath(link.href);
  if (path && !link.getAttribute('href').startsWith('#')) send('acao', 'link:' + path);
}, { capture: true });
