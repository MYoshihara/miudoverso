import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { biblioteca, materialPath, materials, profissionais } from './dados.js';
import { bookmark, escapeHtml, renderMaterialCard } from './material-card.js';

const { values } = parseArgs({ options: { 'static-output': { type: 'string' } } });
const staticOutput = values['static-output'];

const home = 'Miudoverso — Materiais para pedagogia e fonoaudiologia';
const profilePath = slug => 'conecta/' + slug + '/';
const pages = [
  ['/', 'inicio', home, 'Atividades, e-books e recursos de linguagem para pedagogia e fonoaudiologia.', '', true],
  ['/materiais/', 'materiais', 'Materiais | Miudoverso', 'Atividades para imprimir, recursos de linguagem e e-books.', 'materiais', true],
  ['/biblioteca/', 'biblioteca', 'Bibliotecas | Miudoverso', 'Imagens e sons gratuitos para atividades de linguagem, vocabulário e escuta.', 'biblioteca', 'biblioteca.js'],
  ['/conecta/', 'conecta', 'Conecta | Miudoverso', 'Perfis e materiais autorais de profissionais de pedagogia e fonoaudiologia.', 'conecta', true],
  ['/inspira/', 'inspira', 'Inspira | Miudoverso', 'Leituras para quem aplica, adapta e cria materiais.', 'inspira'],
  ['/meu-miudoverso/', 'meu-miudoverso', 'Meu Miudoverso', 'Seus materiais salvos e seu perfil profissional.', 'meu-miudoverso', true],
  ['/lista-de-espera/', 'lista-de-espera', 'Lista de espera | Miudoverso', 'Participe da primeira turma do Miudoverso.', '', true],
  ['/inspira/rimas/', 'rimas', 'Como adaptar uma atividade de rimas | Miudoverso Inspira', 'Como variar uma atividade de rimas para diferentes turmas.', 'inspira'],
  ['/inspira/ebook-autoral/', 'ebook-autoral', 'Antes de publicar seu primeiro e-book | Miudoverso Inspira', 'Uma revisão para quem quer publicar atividades, guias ou cadernos digitais.', 'inspira'],
  ...profissionais.map(person => [
    '/' + profilePath(person.slug), 'perfil-profissional', person.name + ' | Conecta · Miudoverso',
    person.bio, 'conecta', 'perfil-tabs.js', person
  ]),
  ...materials.map(item => [
    '/' + materialPath(item), 'material', item.title + ' | Materiais · Miudoverso',
    item.description, 'materiais', true, item
  ])
];
const nav = [['materiais','Materiais'], ['biblioteca','Bibliotecas'], ['conecta','Conecta'], ['inspira','Inspira']];
const portfolioImages = new Set(profissionais.flatMap(person =>
  (person.portfolio ?? []).flatMap(project => project.image ? [project.image.path] : [])));
const assets = [
  ['estilos.css', 'text/css; charset=utf-8'],
  ['miudoverso.js', 'text/javascript; charset=utf-8'],
  ['perfil-tabs.js', 'text/javascript; charset=utf-8'],
  ['material-card.js', 'text/javascript; charset=utf-8'],
  ['dados.js', 'text/javascript; charset=utf-8'],
  ['biblioteca.js', 'text/javascript; charset=utf-8'],
  ['assets/marca.webp', 'image/webp', true],
  ['assets/simbolo.webp', 'image/webp', true],
  ...Array.from(portfolioImages, path => [path, 'image/jpeg', true]),
  ...biblioteca.map(({ path, mime }) => [path, mime, true]),
  ...materials.filter(item => item.download).map(({ download }) =>
    [download.path, 'application/pdf', true, download.filename])
];
const assetContents = await Promise.all(assets.map(([path]) => readFile(path)));
const assetHash = createHash('sha256');
for (const [index, [path]] of assets.entries()) {
  assetHash.update(path).update('\0');
  assetHash.update(createHash('sha256').update(assetContents[index]).digest());
}
const assetRevision = assetHash.digest('hex').slice(0, 12);
const layout = await readFile('index.html', 'utf8');
const files = Object.create(null);
const redirects = Object.create(null);

function profileCards(base) {
  return profissionais.map(person => `
    <article class="profile">
      <span class="avatar ${escapeHtml(person.color)}" aria-hidden="true">${escapeHtml(person.initials)}</span>
      <div><h2>${escapeHtml(person.name)}</h2><p class="label">${escapeHtml(person.role)}</p></div>
      <p class="bio">${escapeHtml(person.bio)}</p>
      <a class="text-link card-link" href="${base + escapeHtml(profilePath(person.slug))}" aria-label="${escapeHtml('Ver perfil de ' + person.name)}">Ver perfil</a>
    </article>`).join('');
}

function profileFacts(person) {
  const address = person.address;
  let addressRow = '';
  if (address?.street) {
    const street = [address.street, address.number].filter(Boolean).join(', ');
    const lines = [
      [street, address.complement].filter(Boolean).join(' · '),
      [address.district, person.location].filter(Boolean).join(' · '),
      address.zip && 'CEP ' + address.zip
    ].filter(Boolean).map(escapeHtml);
    addressRow = `
      <div class="professional-address">
        <dt>Endereço de atendimento</dt>
        <dd><address>${lines.join('<br>')}</address></dd>
      </div>`;
  }
  const facts = [
    ['Localização', addressRow ? '' : person.location],
    ['Atendimento', person.modalities?.join(' · ')],
    ['Público atendido', person.audience],
    ['Registro profissional', person.registration]
  ].filter(([, value]) => value).map(([label, value]) => `
    <div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  const email = person.email ? `
    <div><dt>E-mail</dt><dd><a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a></dd></div>` : '';
  const { number, display } = person.whatsapp ?? {};
  const hasWhatsAppLink = /^[1-9]\d{7,14}$/.test(number ?? '');
  const whatsAppLabel = escapeHtml(display || (hasWhatsAppLink ? '+' + number : ''));
  const whatsApp = whatsAppLabel ? `
    <div><dt>WhatsApp</dt><dd>${hasWhatsAppLink ? '<a href="https://wa.me/' + number + '">' + whatsAppLabel + '</a>' : whatsAppLabel}</dd></div>` : '';
  const data = addressRow + facts;
  const contacts = whatsApp + email;

  const title = data && contacts ? 'Atendimento e contato' : data ? 'Atendimento' : 'Contato profissional';
  const html = data || contacts ? `
    <section class="professional-facts" id="atendimento" aria-labelledby="profile-facts-title" tabindex="-1">
      <h2 id="profile-facts-title">${title}</h2>
      ${data ? '<dl>' + data + '</dl>' : ''}
      ${contacts ? '<section class="professional-contact" id="contato" aria-label="Contato profissional" tabindex="-1">' +
        (data ? '<h3>Contato profissional</h3>' : '') + '<dl>' + contacts + '</dl></section>' : ''}
    </section>` : '';
  return { html, hasContacts: Boolean(contacts) };
}

function portfolioCard(project, shopItems, base) {
  const { image } = project;
  const related = shopItems.find(item => item.id === project.materialId);
  const cover = image ? `
    <img class="portfolio-cover" src="${base + escapeHtml(image.path)}" alt="${escapeHtml(image.alt)}"
      width="768" height="512" loading="lazy">` : '';
  const application = project.steps?.length ? `
    <details class="portfolio-application">
      <summary>Como aplicar a atividade</summary>
      <ol>${project.steps.map(step => '<li>' + escapeHtml(step) + '</li>').join('')}</ol>
    </details>` : '';

  return `
    <article class="portfolio-project">
      <div class="portfolio-overview${image ? ' has-cover' : ''}">
        ${cover}
        <div class="portfolio-copy">
          ${project.format ? '<p class="label">' + escapeHtml(project.format) + '</p>' : ''}
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          ${project.audience ? '<p class="portfolio-audience"><strong>Público</strong> ' + escapeHtml(project.audience) + '</p>' : ''}
          ${related ? '<a class="text-link" href="' + base + escapeHtml(materialPath(related)) + '">Ver material relacionado</a>' : ''}
        </div>
      </div>
      ${application}
    </article>`;
}

function profileDetails(person, shopItems, base) {
  const specialties = person.specialties?.length ? `
    <div class="professional-specialties">
      <h3>Especialidades</h3>
      <ul>${person.specialties.map(specialty => '<li>' + escapeHtml(specialty) + '</li>').join('')}</ul>
    </div>` : '';
  const about = person.about || specialties ? `
    <section class="professional-section" aria-labelledby="about-title">
      <h2 id="about-title">Sobre ${escapeHtml(person.name.split(' ')[0])}</h2>
      <div class="professional-items">
        ${person.about ? '<p class="professional-about">' + escapeHtml(person.about) + '</p>' : ''}
        ${specialties}
      </div>
    </section>` : '';

  const background = [
    ['Formação', person.education],
    ['Experiência profissional', person.experience]
  ].filter(([, entries]) => entries?.length).map(([label, entries]) => `
    <div>
      <h3>${label}</h3>
      <ul>${entries.map(entry => '<li>' + escapeHtml(entry) + '</li>').join('')}</ul>
    </div>`).join('');
  const credentials = background ? `
    <section class="professional-section" id="formacao" aria-labelledby="background-title" tabindex="-1">
      <h2 id="background-title">Formação e experiência</h2>
      <div class="professional-background">${background}</div>
    </section>` : '';

  const portfolio = person.portfolio?.length ? `
    <section class="professional-section" aria-labelledby="portfolio-title">
      <h2 id="portfolio-title">Portfólio</h2>
      <div class="professional-items">${person.portfolio.map(project => portfolioCard(project, shopItems, base)).join('')}</div>
    </section>` : '';

  const shop = shopItems.length ? `
    <section class="professional-section" aria-labelledby="shop-title">
      <h2 id="shop-title">Lojinha</h2>
      <div class="grid">${shopItems.map(item => renderMaterialCard(item, base + materialPath(item))).join('')}</div>
    </section>` : '';

  const facts = profileFacts(person);
  const aboutSections = about + credentials;
  const aboutContent = aboutSections || facts.html ? `
    <div class="professional-about-layout">
      ${aboutSections ? '<div class="professional-summary">' + aboutSections + '</div>' : ''}
      ${facts.html}
    </div>` : '';
  const panels = [
    { id: 'sobre', label: 'Sobre', content: aboutContent },
    { id: 'portfolio', label: 'Portfólio', content: portfolio },
    { id: 'lojinha', label: 'Lojinha', content: shop }
  ].filter(panel => panel.content);
  const links = panels.map(({ id, label }) => `<a id="aba-${id}" href="#${id}">${label}</a>`).join('');
  const sections = panels.map(({ id, content }) =>
    `<div class="professional-tab-panel" id="${id}" tabindex="-1">${content}</div>`).join('');
  const [actionTarget, actionLabel] = facts.hasContacts ? ['#contato', 'Ver contato'] : ['#atendimento', 'Ver atendimento'];

  return {
    'main-action': facts.html ? `<a class="button primary" href="${actionTarget}">${actionLabel}</a>` : '',
    'section-links': links ? '<nav class="professional-navigation" aria-label="Seções do perfil"><div class="wrap professional-shortcuts" data-profile-tabs>' + links + '</div></nav>' : '',
    details: sections ? '<div class="wrap professional-content professional-main">' + sections + '</div>' : ''
  };
}

function materialDetails(item, base) {
  const { download } = item;
  const purchase = item.price ? `
    <p class="material-price"><strong>${escapeHtml(item.price)}</strong><span class="demo">Preço de exemplo</span></p>
    <button class="button primary" type="button" data-buy>Simular interesse na compra</button>
    <p class="feedback" id="purchase-feedback" role="status"></p>` : '';
  const free = download ? `
    <p class="material-price"><strong>Gratuito</strong></p>
    <a class="button primary" href="${base + escapeHtml(download.path)}" download="${escapeHtml(download.filename)}">Baixar ficha em PDF</a>` : '';

  return {
    'material-title': escapeHtml(item.title),
    category: escapeHtml(item.label),
    summary: escapeHtml(item.description),
    author: escapeHtml(item.author),
    'author-link': base + escapeHtml(profilePath(item.authorSlug)),
    kind: escapeHtml(item.type),
    color: escapeHtml(item.color),
    art: escapeHtml(item.art),
    access: purchase || free,
    id: escapeHtml(item.id),
    bookmark,
    related: materials.filter(other => other.id !== item.id)
      .map(other => renderMaterialCard(other, base + materialPath(other))).join('')
  };
}

function fill(source, values) {
  return source.replace(/@([a-z-]+)@/g, (token, name) => {
    if (!Object.hasOwn(values, name)) throw new Error('Campo não preenchido: ' + token);
    return values[name];
  });
}

function libraryCard(item, base) {
  const url = base + escapeHtml(item.path) + '?v=' + assetRevision;
  const title = escapeHtml(item.title);
  const image = item.mime === 'image/jpeg';
  const format = image ? 'JPG' : 'WAV';
  const downloadLabel = image ? 'Baixar imagem' : 'Baixar áudio';
  return `
    <article class="resource library-card">
      ${image ? `<img class="library-image" src="${url}" alt="${escapeHtml(item.alt)}" width="1536" height="1024" decoding="async">` : ''}
      <div class="card-copy library-card-copy">
        <h3>${title}</h3>
        <p>${escapeHtml(item.description)}</p>
        ${image ? '' : `<audio controls preload="none" src="${url}" aria-label="Ouvir ${title}"></audio>`}
        <div class="library-card-actions">
          <span class="library-format">${format}${image ? '' : ' · ' + escapeHtml(item.duration)}</span>
          <a class="button outlined" href="${url}" download="${escapeHtml(item.path.split('/').pop())}" aria-label="${downloadLabel} de ${title}">${downloadLabel}</a>
        </div>
      </div>
    </article>`;
}

async function emit(file, contents) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, contents);
}
for (const [route, fragment, title, description, active, script, data] of pages) {
  const depth = route.split('/').filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';
  const path = route.slice(1) + 'index.html';
  const body = await readFile('paginas/' + fragment + '.html', 'utf8');
  const current = name => name === active ? ' aria-current="page"' : '';
  const scripts = script ? [script === true ? 'miudoverso.js' : script] : [];
  let bodyValues = {};
  if (fragment === 'perfil-profissional') {
    const person = data;
    const shopItems = materials.filter(item => item.authorSlug === person.slug);
    if (shopItems.length) scripts.push('miudoverso.js');
    bodyValues = {
      name: escapeHtml(person.name),
      initials: escapeHtml(person.initials),
      role: escapeHtml(person.role),
      color: escapeHtml(person.color),
      bio: escapeHtml(person.bio),
      ...profileDetails(person, shopItems, base)
    };
  }
  if (fragment === 'conecta') bodyValues.profiles = profileCards(base);
  if (fragment === 'inicio') bodyValues.featured = materials.map(item => renderMaterialCard(item, base + materialPath(item))).join('');
  if (fragment === 'material') bodyValues = materialDetails(data, base);
  if (fragment === 'biblioteca') {
    bodyValues.images = biblioteca.filter(item => item.mime.startsWith('image/')).map(item => libraryCard(item, base)).join('');
    bodyValues.sounds = biblioteca.filter(item => item.mime.startsWith('audio/')).map(item => libraryCard(item, base)).join('');
  }
  const values = {
    base, title: escapeHtml(title), description: escapeHtml(description), revision:assetRevision,
    script: scripts.map(file => '<script type="module" src="' + base + file + '?v=' + assetRevision + '"></script>').join('\n'),
    nav: nav.map(([slug, label]) => '<a href="' + base + slug + '/"' + current(slug) + '>' + label + '</a>').join(''),
    account: current('meu-miudoverso')
  };
  function render(demo) {
    return fill(layout, {
      ...values,
      content: fill(body, {
        ...bodyValues,
        base,
        'waitlist-mode': demo ? ' data-demo' : '',
        'waitlist-email': demo ? 'E-mail de teste' : 'Seu e-mail',
        'waitlist-note': demo
          ? 'Prévia de validação. Use um e-mail de exemplo para simular a inscrição.'
          : 'Usaremos seus dados de contato para a lista de espera e o acompanhamento do piloto.',
        'waitlist-button': demo ? 'Simular inscrição' : 'Quero participar'
      })
    });
  }
  await emit(join(staticOutput ?? 'publicacao-estatica', path), render(true));
  files[route] = ['text/html; charset=utf-8', render(false), false];
  redirects[route + 'index.html'] = route;
  if (route !== '/') redirects[route.slice(0, -1)] = route;
}
for (const [index, [path, type, binary, filename]] of assets.entries()) {
  const bytes = assetContents[index];
  await emit(join(staticOutput ?? 'publicacao-estatica', path), bytes);
  files['/' + path] = [type, bytes.toString(binary ? 'base64' : 'utf8'), Boolean(binary), filename];
}
for (const filename of ['marca.webp', 'simbolo.webp', 'cartas-de-rimas.pdf']) {
  redirects['/' + filename] = '/assets/' + filename;
}
if (staticOutput === undefined) {
  const server = await readFile('worker.mjs', 'utf8');
  await emit('dist/server/index.js', 'const files = ' + JSON.stringify(files) + ';\nconst redirects = ' + JSON.stringify(redirects) + ';\n' + server);
}

