// Testes da hospedagem PHP: lista de espera, estatísticas, relatório e proteções.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { after, before, test } from 'node:test';
import { chromium, iniciarPhp, novaPagina } from './apoio.mjs';

let php, navegador;
let temPhp = true;
try { execFileSync('php', ['-m'], { encoding: 'utf8' }).includes('pdo_sqlite') || (temPhp = false); } catch { temPhp = false; }

before(async () => {
  if (!temPhp) return;
  php = await iniciarPhp();
  navegador = await chromium.launch();
});
after(async () => {
  await navegador?.close();
  php?.parar();
});

test('inscrição e estatísticas são gravadas e aparecem no relatório', { skip: !temPhp && 'PHP com pdo_sqlite não está instalado' }, async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(php.url + '/lista-de-espera/');
  await pagina.fill('#waitlist [name=email]', 'Ana@Example.com');
  await pagina.selectOption('[name=area]', 'fonoaudiologia');
  await pagina.selectOption('[name=interesse]', 'vender');
  await pagina.check('[name=areas][value=conecta]');
  await pagina.check('[name=consent]');
  await pagina.click('#waitlist [type=submit]');
  await pagina.waitForFunction(() => /confirmada/.test(document.querySelector('#waitlist .feedback').textContent));
  await pagina.goto(php.url + '/conecta/');
  await pagina.click('[data-like=p2]');
  await pagina.goto(php.url + '/');
  await pagina.waitForTimeout(300);
  assert.deepEqual(pagina.erros, []);
  await pagina.close();

  const relatorio = php.relatorio();
  assert.match(relatorio, /Inscrições na lista de espera: 1/);
  assert.match(relatorio, /\/conecta\//);
  assert.match(relatorio, /curtir:p2/);
  assert.match(php.relatorio('--csv'), /ana@example\.com,fonoaudiologia,vender,conecta,/);
});

test('arquivos internos e envios de fora do site são recusados', { skip: !temPhp && 'PHP com pdo_sqlite não está instalado' }, async () => {
  assert.equal((await fetch(php.url + '/api/relatorio.php')).status, 404);
  assert.equal((await fetch(php.url + '/api/comum.php')).status, 404);
  const json = { 'Content-Type': 'application/json' };
  const corpo = JSON.stringify({ email: 'x@example.com', area: 'outra', interesse: 'baixar', consent: true });
  assert.equal((await fetch(php.url + '/api/lista-de-espera.php', { method: 'POST', headers: json, body: corpo })).status, 403);
  assert.equal((await fetch(php.url + '/api/lista-de-espera.php', { method: 'POST', headers: { ...json, Origin: 'https://outro.example' }, body: corpo })).status, 403);
  assert.equal((await fetch(php.url + '/api/evento.php', { method: 'POST', headers: json, body: '{"tipo":"visita","pagina":"<script>"}' })).status, 400);
});
