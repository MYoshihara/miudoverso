const assetVersion = new URL(import.meta.url).search;
const [{ demoProfile }, { escapeHtml }] = await Promise.all([
  import('./dados.js' + assetVersion),
  import('./material-card.js' + assetVersion)
]);

const form = document.querySelector('#signup');
const steps = [...form.querySelectorAll('.signup-step')];
const labels = [...form.querySelectorAll('[data-step-label]')];
const back = form.querySelector('[data-signup-back]');
const next = form.querySelector('[data-signup-next]');
const submit = form.querySelector('[type=submit]');
const feedback = document.querySelector('#signup-feedback');
let current = 0;

function values() {
  return Object.fromEntries([...new FormData(form)].map(([name, value]) => [name, value.trim()]));
}
function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => Array.from(word)[0]).join('').toLocaleUpperCase('pt-BR');
}
function review() {
  const profile = values();
  const specialties = profile.specialties.split('\n').map(item => item.trim()).filter(Boolean);
  document.querySelector('#signup-review').innerHTML = `
    <article class="profile signup-card">
      <span class="avatar violet" aria-hidden="true">${escapeHtml(initials(profile.displayName))}</span>
      <div><h3>${escapeHtml(profile.displayName)}</h3><p class="label">${escapeHtml(profile.role)}</p></div>
      <p class="bio">${escapeHtml(profile.bio)}</p>
      ${specialties.length ? '<ul class="signup-tags">' + specialties.map(item => '<li>' + escapeHtml(item) + '</li>').join('') + '</ul>' : ''}
      ${profile.location ? '<p class="signup-location">' + escapeHtml(profile.location) + '</p>' : ''}
    </article>
    <dl class="signup-account">
      <div><dt>Nome completo</dt><dd>${escapeHtml(profile.fullName)}</dd></div>
      <div><dt>E-mail</dt><dd>${escapeHtml(profile.personalEmail)}</dd></div>
      <div><dt>Área</dt><dd>${escapeHtml(profile.area)}</dd></div>
    </dl>`;
}
function show(index, focus = true) {
  current = index;
  steps.forEach((step, position) => { step.hidden = position !== index; });
  labels.forEach((label, position) => {
    label.classList.toggle('is-done', position < index);
    if (position === index) label.setAttribute('aria-current', 'step');
    else label.removeAttribute('aria-current');
  });
  back.hidden = index === 0;
  next.hidden = index === steps.length - 1;
  submit.hidden = index !== steps.length - 1;
  feedback.textContent = '';
  if (index === steps.length - 1) review();
  if (focus) steps[index].querySelector('input, select, textarea')?.focus();
}
function valid() {
  for (const field of steps[current].querySelectorAll('input, select, textarea')) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}

next.addEventListener('click', () => {
  if (!valid()) return;
  if (current === 0 && !form.elements.displayName.value) {
    form.elements.displayName.value = form.elements.fullName.value.trim().split(/\s+/).slice(0, 2).join(' ');
  }
  show(current + 1);
});
back.addEventListener('click', () => show(current - 1));
form.addEventListener('submit', event => {
  event.preventDefault();
  const { area, ...fields } = values();
  const blank = Object.fromEntries(Object.keys(demoProfile).map(key => [key, '']));
  try {
    localStorage.setItem('miudoverso:demo-profile', JSON.stringify({ ...blank, ...fields }));
    localStorage.setItem('miudoverso:perfil-criado', area || '1');
  } catch {
    feedback.textContent = 'Não foi possível salvar o perfil. Confira as permissões de armazenamento do navegador.';
    return;
  }
  window.miudoversoMetrica?.('perfil:criado');
  location.href = new URL('meu-miudoverso/?perfil=criado', import.meta.url).href;
});

form.hidden = false;
show(0, false);
