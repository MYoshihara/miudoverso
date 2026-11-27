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
