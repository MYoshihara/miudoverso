const assetVersion = new URL(import.meta.url).search;
const [{ demoProfile, materials, materialPath }, { escapeHtml, renderMaterialCard }] = await Promise.all([
  import('./dados.js' + assetVersion),
  import('./material-card.js' + assetVersion)
]);

const grid = document.querySelector('#resources');
const query = document.querySelector('#search');
const dialog = document.querySelector('#dialog');
const dialogBody = document.querySelector('#dialog-body');
const favoritesRegion = document.querySelector('#favorites');
const profileForm = document.querySelector('#my-profile');
const profileStorageKey = 'miudoverso:demo-profile';
let saved;
let selectedFilter = 'todos';

function loadFavorites() {
  try {
    const values = JSON.parse(localStorage.getItem('miudoverso:saved') || '[]');
    if (Array.isArray(values)) return new Set(values.filter(id => materials.some(item => item.id === id)));
  } catch {}
  return new Set();
}
function comparable(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}
function materialLink(item) {
  return new URL(materialPath(item), import.meta.url).href;
}
function renderCatalog() {
  const term = comparable(query.value);
  const shown = materials.filter(item => {
    const matchesTerm = comparable(item.title + ' ' + item.author + ' ' + item.label + ' ' + item.description + ' ' + item.type).includes(term);
    const matchesFilter = selectedFilter === 'todos' || selectedFilter === item.area || (selectedFilter === 'gratuitos' && !item.price);
    return matchesTerm && matchesFilter;
  });
  const count = shown.length;
  document.querySelector('#result').textContent = count === 0 ? 'Nenhum material encontrado.' : count + (count === 1 ? ' material encontrado' : ' materiais encontrados');
  grid.innerHTML = count === 0
    ? '<div class="empty-state"><p>Tente outra palavra ou remova os filtros para ver todos os materiais.</p>' +
      '<button class="button outlined" type="button" data-clear-filters>Limpar busca e filtros</button></div>'
    : shown.map(item => renderMaterialCard(item, materialLink(item), saved.has(item.id))).join('');
}

function clearFilters() {
  query.value = '';
  selectedFilter = 'todos';
  for (const chip of document.querySelectorAll('#filters [data-filter]')) {
    chip.setAttribute('aria-pressed', String(chip.dataset.filter === 'todos'));
  }
  renderCatalog();
  query.focus();
}
function show(title, contents) {
  document.querySelector('#dialog-title').textContent = title;
  dialogBody.innerHTML = contents;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('.close').focus();
}
function listLinks(items) {
  return '<ul>' + items.map(item => '<li><a class="text-link" href="' + materialLink(item) + '">' + item.title + '</a></li>').join('') + '</ul>';
}
function renderFavorites() {
  if (!favoritesRegion) return;
  const favorites = materials.filter(item => saved.has(item.id));
  favoritesRegion.innerHTML = favorites.length
    ? listLinks(favorites)
    : '<p>Use o ícone de favorito nos materiais para encontrá-los aqui.</p>';
}
function publish() {
  show('Publicar material', '<p>Experimente o envio. O arquivo selecionado fica no seu dispositivo.</p><form class="form" id="publish-form">' +
    '<label>Título do material<input name="title" maxlength="90" required></label>' +
    '<label>Tipo<select name="type"><option>Atividade gratuita</option><option>Material pago</option><option>E-book pago</option></select></label>' +
    '<label>Selecionar PDF<input name="file" type="file" accept=".pdf,application/pdf" required></label>' +
    '<label class="check"><input type="checkbox" required> <span>Confirmo que o material é autoral ou que tenho autorização para distribuí-lo.</span></label>' +
    '<button type="submit" class="button primary">Simular envio para revisão</button><p class="feedback" role="status"></p></form>');
}
function report() {
  show('Denunciar material', '<form class="form" id="report-form"><label>Motivo<select name="reason" required><option value="">Selecione o motivo</option>' +
    '<option>Possível cópia sem autorização</option><option>Conteúdo inadequado</option><option>Outro motivo</option></select></label>' +
    '<button class="button primary" type="submit">Simular denúncia</button><p class="feedback" role="status"></p></form>');
}
function readProfile(form) {
  return Object.fromEntries([...new FormData(form)].map(([name, value]) => [name, value.trim()]));
}

function profileInitials(name) {
  return name.split(/\s+/).slice(0, 2).map(word => Array.from(word)[0]).join('').toLocaleUpperCase('pt-BR');
}

function renderDemoAccount(profile) {
  const name = profile.displayName || profile.fullName || 'Seu perfil';
  document.querySelector('#account-avatar').textContent = profileInitials(name);
  document.querySelector('#account-name').textContent = name;
  document.querySelector('#account-role').textContent = profile.role;
}

function previewProfile(profile) {
  const name = profile.displayName || 'Seu nome de exibição';
  const specialties = profile.specialties.split('\n').map(item => item.trim()).filter(Boolean);
  const background = [
    ['Formação', profile.education],
    ['Experiência profissional', profile.experience]
  ].filter(([, value]) => value).map(([label, value]) =>
    '<div><h4>' + label + '</h4><p>' + escapeHtml(value) + '</p></div>').join('');
  const facts = [
    ['Cidade e estado', profile.location],
    ['Endereço de atendimento', profile.officeAddress],
    ['Modalidade', profile.modality],
    ['Público atendido', profile.audience],
    ['Registro profissional', profile.registration],
    ['E-mail profissional', profile.workEmail],
    ['WhatsApp profissional', profile.workPhone]
  ].filter(([, value]) => value).map(([label, value]) =>
    '<div><dt>' + label + '</dt><dd>' + escapeHtml(value) + '</dd></div>').join('');

  show('Prévia do perfil no Conecta', `
    <div class="personal-preview">
      <div class="personal-preview-identity">
        <span class="avatar violet" aria-hidden="true">${escapeHtml(profileInitials(name))}</span>
        <div>
          <h3>${escapeHtml(name)}</h3>
          ${profile.role ? '<p class="label">' + escapeHtml(profile.role) + '</p>' : ''}
        </div>
      </div>
      ${profile.bio ? '<p>' + escapeHtml(profile.bio) + '</p>' : ''}
      ${profile.about || specialties.length ? `<section class="professional-section">
        <h3>Sobre</h3>
        ${profile.about ? '<p>' + escapeHtml(profile.about) + '</p>' : ''}
        ${specialties.length ? '<div class="professional-specialties"><ul aria-label="Especialidades">' +
          specialties.map(item => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul></div>' : ''}
      </section>` : ''}
      ${background ? '<section class="professional-section"><h3>Formação e experiência</h3>' +
        '<div class="professional-background">' + background + '</div></section>' : ''}
      ${facts ? '<section class="professional-facts"><h3>Atendimento e contato</h3><dl>' + facts + '</dl></section>' : ''}
    </div>`);
}

if (profileForm) {
  const feedback = document.querySelector('#profile-feedback');
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(profileStorageKey));
  } catch {
    feedback.textContent = 'Não foi possível carregar os dados salvos neste navegador.';
  }
  for (const field of profileForm.elements) {
    if (Object.hasOwn(demoProfile, field.name)) {
      field.value = typeof stored?.[field.name] === 'string' ? stored[field.name] : demoProfile[field.name];
    }
  }
  renderDemoAccount(readProfile(profileForm));
  profileForm.addEventListener('input', () => { feedback.textContent = 'Você tem alterações não salvas.'; });
  profileForm.addEventListener('submit', event => {
    event.preventDefault();
    const profile = readProfile(profileForm);
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify(profile));
      renderDemoAccount(profile);
      feedback.textContent = 'Perfil de demonstração salvo neste navegador.';
    } catch {
      feedback.textContent = 'Não foi possível salvar seus dados. Confira as permissões de armazenamento do navegador.';
    }
  });
  document.querySelector('#profile-preview').addEventListener('click', () => previewProfile(readProfile(profileForm)));
  document.querySelector('#demo-account').hidden = false;
  profileForm.hidden = false;
  document.querySelector('#personal-shortcuts').hidden = false;
}

if (grid) {
  query.addEventListener('input', renderCatalog);
  document.querySelector('#filters').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    selectedFilter = button.dataset.filter;
    for (const chip of event.currentTarget.querySelectorAll('[data-filter]')) chip.setAttribute('aria-pressed', String(chip === button));
    renderCatalog();
  });
}
document.querySelector('#publish')?.addEventListener('click', publish);

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const { save } = button.dataset;
  if (save) {
    if (saved.has(save)) saved.delete(save);
    else saved.add(save);
    button.setAttribute('aria-pressed', String(saved.has(save)));
    try { localStorage.setItem('miudoverso:saved', JSON.stringify([...saved])); } catch {}
  }
  if (button.hasAttribute('data-buy')) document.querySelector('#purchase-feedback').textContent = 'Simulação concluída. Nenhum pagamento foi realizado.';
  if (button.hasAttribute('data-report')) report();
  if (button.hasAttribute('data-clear-filters')) clearFilters();
});
dialog.addEventListener('submit', event => {
  const form = event.target;
  if (form.method === 'dialog') return;
  event.preventDefault();
  if (form.id === 'publish-form') {
    const file = form.elements.file.files[0];
    const feedback = form.querySelector('[role=status]');
    if (!file?.name.toLowerCase().endsWith('.pdf')) {
      feedback.textContent = 'Selecione um PDF.';
      return;
    }
    form.reset();
    feedback.textContent = 'Envio simulado. No piloto, o material poderia passar por revisão antes de aparecer no catálogo.';
  }
  if (form.id === 'report-form') {
    form.reset();
    form.querySelector('[role=status]').textContent = 'Simulação concluída. Nenhuma denúncia foi enviada.';
  }
});
document.querySelector('#waitlist')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button');
  const feedback = form.querySelector('[role=status]');
  if (form.hasAttribute('data-demo')) {
    form.reset();
    feedback.textContent = 'Simulação concluída. Nenhum dado foi gravado na lista de espera.';
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  button.disabled = true;
  feedback.textContent = 'Enviando sua inscrição…';
  try {
    const response = await fetch('/api/lista-de-espera', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ ...data, consent:data.consent === 'on' })
    });
    const payload = await response.json();
    feedback.textContent = payload.message;
    if (response.ok) form.reset();
  } catch {
    feedback.textContent = 'Não foi possível confirmar a inscrição. Tente novamente.';
  } finally {
    button.disabled = false;
  }
});
function refreshSavedMaterials() {
  saved = loadFavorites();
  if (grid) {
    renderCatalog();
  } else {
    for (const button of document.querySelectorAll('[data-save]')) {
      button.setAttribute('aria-pressed', String(saved.has(button.dataset.save)));
    }
  }
  renderFavorites();
}
window.addEventListener('pageshow', event => {
  if (event.persisted) refreshSavedMaterials();
});
window.addEventListener('storage', event => {
  if (event.key === 'miudoverso:saved' || event.key === null) refreshSavedMaterials();
});
refreshSavedMaterials();
