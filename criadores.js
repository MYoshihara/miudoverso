const form = document.querySelector('#earnings');
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let tracked = false;

function update() {
  const price = Number(form.elements.price.value);
  const sales = Math.round(Number(form.elements.sales.value));
  if (!(price > 0) || !(sales > 0)) return;
  const low = price * 0.8;
  const high = price * 0.9;
  document.querySelector('#earnings-range').textContent = money(low * sales) + ' a ' + money(high * sales);
  document.querySelector('#earnings-detail').textContent =
    'Por venda: ' + money(low) + ' com comissão de 20% ou ' + money(high) + ' com comissão de 10%.';
  if (!tracked) {
    tracked = true;
    window.miudoversoMetrica?.('criadores:simulador');
  }
}

form?.addEventListener('input', update);
form?.addEventListener('submit', event => event.preventDefault());
if (form) update();
