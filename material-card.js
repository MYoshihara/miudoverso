export const bookmark = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z" stroke-linejoin="round"/></svg>';

export function escapeHtml(value) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return value.replace(/[&<>"']/g, character => entities[character]);
}

export function renderMaterialCard(item, href, saved = false) {
  const title = escapeHtml(item.title);
  return `
    <article class="resource">
      <div class="cover ${escapeHtml(item.color)}">
        <div class="mini-sheet" aria-hidden="true"><strong>${escapeHtml(item.art)}</strong><small>${escapeHtml(item.type)}</small></div>
        <span class="tag">${escapeHtml(item.price || 'Gratuito')}</span>
        <button class="save" type="button" data-save="${escapeHtml(item.id)}" aria-label="Favoritar ${title}" aria-pressed="${saved}">${bookmark}</button>
      </div>
      <div class="card-copy">
        <p class="label">${escapeHtml(item.label)} · ${escapeHtml(item.author)}</p>
        <h3>${title}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="text-link card-link" href="${escapeHtml(href)}" aria-label="Ver material: ${title}">Ver material</a>
      </div>
    </article>`;
}

// Navegação entre páginas, usada pelo build e pelo catálogo no navegador.
// hrefFor(n) devolve o endereço da página n.
export function renderPagination(current, total, hrefFor, label = 'Páginas') {
  if (total <= 1) return '';
  const numbers = [...new Set([1, current - 1, current, current + 1, total])]
    .filter(page => page >= 1 && page <= total).sort((a, b) => a - b);
  let items = '';
  numbers.forEach((page, index) => {
    if (index && page - numbers[index - 1] > 1) items += '<li class="pagination-gap" aria-hidden="true">…</li>';
    items += page === current
      ? `<li><a href="${escapeHtml(hrefFor(page))}" aria-current="page" aria-label="Página ${page}, atual">${page}</a></li>`
      : `<li><a href="${escapeHtml(hrefFor(page))}" data-page="${page}" aria-label="Página ${page}">${page}</a></li>`;
  });
  const step = (page, text, rel) => page < 1 || page > total
    ? `<span class="pagination-step" aria-hidden="true">${text}</span>`
    : `<a class="pagination-step" href="${escapeHtml(hrefFor(page))}" data-page="${page}" rel="${rel}">${text}</a>`;
  return `<nav class="pagination" aria-label="${escapeHtml(label)}">
    ${step(current - 1, '← Anterior', 'prev')}
    <ol>${items}</ol>
    ${step(current + 1, 'Próxima →', 'next')}
    <p class="pagination-status">Página ${current} de ${total}</p>
  </nav>`;
}
