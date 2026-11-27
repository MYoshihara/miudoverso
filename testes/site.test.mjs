// Testes do site no navegador, com a prévia local (Worker + SQLite em memória).
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chromium, iniciarPrevia, novaPagina } from './apoio.mjs';

let previa, navegador, B;
before(async () => {
  previa = await iniciarPrevia();
  B = previa.url;
  navegador = await chromium.launch();
});
after(async () => {
  await navegador?.close();
  previa?.parar();
});

test('todas as páginas abrem sem erro e sem rolagem lateral', async () => {
  const rotas = ['/', '/materiais/', '/materiais/cartas-de-rimas/', '/visual/', '/sons/', '/inspira/', '/inspira/jogos-de-escuta/',
    '/conecta/', '/conecta/bia-costa/', '/criadores/', '/criar-perfil/', '/meu-miudoverso/', '/lista-de-espera/', '/privacidade/'];
  for (const largura of [320, 390, 1280]) {
    const pagina = await novaPagina(navegador, { viewport: { width: largura, height: 800 } });
    for (const rota of rotas) {
      const resposta = await pagina.goto(B + rota);
      assert.equal(resposta.status(), 200, rota);
      const sobra = await pagina.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.equal(sobra, 0, `rolagem lateral em ${rota} com ${largura}px`);
    }
    assert.deepEqual(pagina.erros, []);
    await pagina.close();
  }
});

test('endereço inexistente mostra a página 404 e /biblioteca/ leva ao Visual', async () => {
  const pagina = await novaPagina(navegador);
  const resposta = await pagina.goto(B + '/nao-existe/');
  assert.equal(resposta.status(), 404);
  assert.match(await pagina.textContent('h1'), /se perdeu/);
  await pagina.goto(B + '/biblioteca/');
  assert.ok(pagina.url().endsWith('/visual/'));
  await pagina.close();
});

test('catálogo: card clicável, favoritos, busca vazia e limpar filtros', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/materiais/');
  await pagina.locator('.resource').nth(0).locator('.save').click();
  assert.equal(await pagina.getAttribute('.resource >> nth=0 >> .save', 'aria-pressed'), 'true');
  assert.ok(pagina.url().endsWith('/materiais/'), 'favoritar não navega');
  await pagina.fill('#search', 'xyzxyz');
  await pagina.click('[data-clear-filters]');
  assert.equal(await pagina.locator('#resources .resource').count(), 12);
  await pagina.locator('.resource').nth(1).locator('.card-copy p').nth(1).click({ force: true });
  await pagina.waitForURL('**/sequencias-para-contar-historias/');
  await pagina.goto(B + '/materiais/cartas-de-rimas/');
  assert.equal(await pagina.getAttribute('.save-toggle', 'aria-pressed'), 'true', 'favorito aparece na página do material');
  await pagina.goto(B + '/meu-miudoverso/');
  assert.match(await pagina.textContent('#favorites'), /Cartas de rimas/);
  assert.deepEqual(pagina.erros, []);
  await pagina.close();
});

test('Conecta: curtir, seguir, filtrar, publicar com anexo e excluir', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/conecta/');
  assert.equal(await pagina.locator('#feed .post').count(), 12);
  await pagina.click('[data-like=p2]');
  assert.equal(await pagina.textContent('[data-like=p2] .like-count'), '42');
  await pagina.locator('.profile').nth(1).locator('[data-follow]').click();
  await pagina.click('#feed-filters [data-feed=seguindo]');
  assert.equal(await pagina.locator('#feed .post:visible').count(), 2);
  await pagina.locator('.profile').nth(1).locator('[data-follow]').click();
  assert.ok(await pagina.isVisible('#feed-empty'));
  await pagina.click('#feed-empty [data-feed=todos]');
  await pagina.fill('#composer-text', 'Publicação de teste');
  await pagina.selectOption('[name=attach]', 'material:historias');
  await pagina.click('#composer [type=submit]');
  assert.equal(await pagina.locator('.own-post .post-attachment').count(), 1);
  await pagina.reload();
  assert.match(await pagina.textContent('#my-posts'), /Publicação de teste/);
  await pagina.click('[data-delete-post]');
  assert.equal(await pagina.locator('.own-post').count(), 0);
  assert.deepEqual(pagina.erros, []);
  await pagina.close();
});

test('cadastro de perfil aparece no Meu Miudoverso e no Conecta', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/criar-perfil/');
  await pagina.click('[data-signup-next]');
  assert.ok(await pagina.isVisible('[data-step="1"]'), 'não avança com campos vazios');
  await pagina.fill('[name=fullName]', 'Joana Prado Souza');
  await pagina.fill('[name=personalEmail]', 'joana@example.com');
  await pagina.selectOption('[name=area]', 'Fonoaudiologia');
  await pagina.click('[data-signup-next]');
  await pagina.fill('[name=role]', 'Fonoaudióloga');
  await pagina.fill('[name=bio]', 'Linguagem infantil <b>teste</b>');
  await pagina.click('[data-signup-next]');
  assert.match(await pagina.innerHTML('#signup-review'), /&lt;b&gt;/);
  await pagina.click('.signup-actions [type=submit]');
  await pagina.waitForURL('**/meu-miudoverso/?perfil=criado');
  assert.equal(await pagina.textContent('#account-name'), 'Joana Prado');
  assert.ok(await pagina.isHidden('#signup-banner'));
  await pagina.goto(B + '/conecta/');
  assert.match(await pagina.textContent('#my-profile-card'), /Joana Prado/);
  assert.deepEqual(pagina.erros, []);
  await pagina.close();
});

test('simulador de ganhos e player dos Sons', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/criadores/');
  await pagina.fill('[name=price]', '29.90');
  await pagina.fill('[name=sales]', '10');
  assert.equal((await pagina.textContent('#earnings-range')).replace(/\s/g, ' '), 'R$ 239,20 a R$ 269,10');
  await pagina.goto(B + '/sons/');
  assert.equal(await pagina.locator('.sound-player').count(), 12);
  await pagina.locator('.sound-play').nth(0).click();
  await pagina.waitForTimeout(400);
  assert.equal(await pagina.evaluate(() => document.querySelectorAll('audio')[0].paused), false);
  await pagina.locator('.sound-play').nth(1).click();
  await pagina.waitForTimeout(200);
  assert.equal(await pagina.evaluate(() => document.querySelectorAll('audio')[0].paused), true, 'um som pausa o outro');
  assert.deepEqual(pagina.erros, []);
  await pagina.close();
});

test('lista de espera grava pelo Worker e recusa dados inválidos', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/lista-de-espera/');
  await pagina.fill('#waitlist [name=email]', 'ana@example.com');
  await pagina.selectOption('[name=area]', 'pedagogia');
  await pagina.selectOption('[name=interesse]', 'baixar');
  await pagina.check('[name=areas][value=visual]');
  await pagina.check('[name=consent]');
  await pagina.click('#waitlist [type=submit]');
  await pagina.waitForFunction(() => /confirmada/.test(document.querySelector('#waitlist .feedback').textContent));
  const ruim = await fetch(B + '/api/lista-de-espera', {
    method: 'POST', headers: { Origin: B, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'x@example.com', area: 'outra', interesse: 'baixar', areas: ['play'], consent: true })
  });
  assert.equal(ruim.status, 400);
  await pagina.close();
});
