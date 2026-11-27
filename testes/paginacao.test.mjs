// Paginação com 2 itens por página, para exercitar as listas com o conteúdo atual.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chromium, iniciarPrevia, novaPagina } from './apoio.mjs';

let previa, navegador, B;
before(async () => {
  process.env.MIUDOVERSO_POR_PAGINA = '2';
  previa = await iniciarPrevia(9432);
  B = previa.url;
  navegador = await chromium.launch();
});
after(async () => {
  await navegador?.close();
  previa?.parar();
  delete process.env.MIUDOVERSO_POR_PAGINA;
});

test('listas geradas no build têm páginas numeradas', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/visual/');
  assert.equal(await pagina.locator('.library-image').count(), 2);
  await pagina.click('.pagination a[rel=next]');
  assert.ok(pagina.url().endsWith('/visual/pagina/2/'));
  assert.equal(await pagina.getAttribute('.pagination [aria-current=page]', 'aria-label'), 'Página 2, atual');
  await pagina.goto(B + '/visual/pagina/1/');
  assert.ok(pagina.url().endsWith('/visual/'), '/pagina/1/ leva à primeira página');
  await pagina.goto(B + '/sons/pagina/3/');
  assert.equal(await pagina.locator('.sound-player').count(), 2);
  await pagina.goto(B + '/inspira/pagina/3/');
  assert.equal(await pagina.locator('.reading article').count(), 1);
  await pagina.goto(B + '/conecta/profissionais/pagina/2/');
  assert.equal(await pagina.locator('.profile').count(), 2);
  assert.deepEqual(pagina.erros, []);
  await pagina.close();
});

test('catálogo pagina junto com busca e filtros, com estado no endereço', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/materiais/');
  assert.match(await pagina.textContent('#result'), /Mostrando 1–2 de 15/);
  await pagina.click('#catalog-pages a[data-page="2"]');
  await pagina.click('#catalog-pages a[rel=next]');
  assert.ok(pagina.url().endsWith('/materiais/?pagina=3'));
  await pagina.click('[data-filter=fonoaudiologia]');
  assert.ok(pagina.url().endsWith('/materiais/?filtro=fonoaudiologia'), 'filtro volta para a página 1');
  await pagina.click('#catalog-pages a[rel=next]');
  await pagina.goBack();
  assert.ok(!pagina.url().includes('pagina='));
  assert.equal(await pagina.getAttribute('[data-filter=fonoaudiologia]', 'aria-pressed'), 'true');
  await pagina.goto(B + '/materiais/?pagina=99');
  assert.match(await pagina.textContent('#result'), /15 de 15/, 'página inexistente mostra a última');
  assert.deepEqual(pagina.erros, []);
  await pagina.close();
});

test('feed carrega mais publicações e respeita o filtro Seguindo', async () => {
  const pagina = await novaPagina(navegador);
  await pagina.goto(B + '/conecta/');
  assert.equal(await pagina.locator('#feed .post:visible').count(), 2);
  assert.match(await pagina.textContent('#feed-more'), /\(10\)/);
  await pagina.click('#feed-more');
  assert.equal(await pagina.locator('#feed .post:visible').count(), 4);
  assert.match(await pagina.textContent('.all-profiles'), /\(6\)/);
  await pagina.locator('.profile').nth(1).locator('[data-follow]').click();
  await pagina.click('#feed-filters [data-feed=seguindo]');
  assert.equal(await pagina.locator('#feed .post:visible').count(), 2);
  assert.ok(await pagina.isHidden('#feed-more'));
  assert.deepEqual(pagina.erros, []);
  await pagina.close();
});
