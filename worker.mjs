const areas = new Set(['pedagogia', 'fonoaudiologia', 'outra']);
const interests = new Set(['baixar', 'compartilhar', 'vender']);

function reply(message, status = 200) {
  return Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function enroll(request, env, url) {
  if (request.headers.get('Origin') !== url.origin) return reply('Envie o formulário pelo site.', 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply('Formato de inscrição inválido.', 415);
  if (!request.body) return reply('Preencha o formulário.', 400);

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 2048) {
      await reader.cancel();
      return reply('O formulário excedeu o tamanho permitido.', 413);
    }
    text += decoder.decode(value, { stream: true });
  }

  let form;
  try {
    form = JSON.parse(text + decoder.decode());
  } catch {
    return reply('Confira os dados e tente novamente.', 400);
  }
  if (!form || typeof form !== 'object') return reply('Confira os dados e tente novamente.', 400);
  const email = typeof form.email === 'string' ? form.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email) || email.length > 254 ||
      !areas.has(form.area) || !interests.has(form.interesse) || form.consent !== true) {
    return reply('Informe um e-mail válido, selecione as opções e confirme seu interesse no piloto.', 400);
  }
  if (form.website) return reply('Inscrição confirmada. Obrigado pelo interesse!', 201);
  try {
    await env.DB.prepare(
      'INSERT INTO waitlist (email, area, interesse) VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET area = excluded.area, interesse = excluded.interesse'
    ).bind(email, form.area, form.interesse).run();
  } catch {
    return reply('O formulário está temporariamente indisponível. Seus dados não foram confirmados.', 503);
  }
  return reply('Inscrição confirmada. Avisaremos por e-mail quando o piloto estiver disponível.', 201);
}

function audioResponse(request, body, headers) {
  const length = body.byteLength;
  headers['Accept-Ranges'] = 'bytes';
  headers['Content-Length'] = String(length);

  const range = request.headers.get('Range')?.match(/^bytes=(\d*)-(\d*)$/);
  if (request.method === 'HEAD' || request.headers.has('If-Range') || !range || (!range[1] && !range[2])) {
    return new Response(request.method === 'HEAD' ? null : body, { headers });
  }

  const [, first, last] = range;
  const start = first ? Number(first) : Math.max(0, length - Number(last));
  const end = first && last ? Math.min(length - 1, Number(last)) : length - 1;
  if (start > end) {
    headers['Content-Range'] = `bytes */${length}`;
    headers['Content-Length'] = '0';
    return new Response(null, { status: 416, headers });
  }

  headers['Content-Range'] = `bytes ${start}-${end}/${length}`;
  headers['Content-Length'] = String(end - start + 1);
  return new Response(body.subarray(start, end + 1), { status: 206, headers });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/lista-de-espera') {
      if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
      return enroll(request, env, url);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const redirect = redirects[url.pathname];
    if (redirect) return Response.redirect(new URL(redirect + url.search, url), 308);
    const file = files[url.pathname];
    if (!file) return new Response('Página não encontrada.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    const [type, content, base64, filename] = file;
    const body = base64 ? Uint8Array.from(atob(content), value => value.charCodeAt(0)) : content;
    const headers = {
      'Content-Type': type,
      'Cache-Control': type.startsWith('text/html') ? 'no-cache' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; img-src 'self'; base-uri 'none'; form-action 'self'"
    };
    if (filename) headers['Content-Disposition'] = 'attachment; filename="' + filename + '"';
    if (type.startsWith('audio/')) return audioResponse(request, body, headers);
    return new Response(request.method === 'HEAD' ? null : body, { headers });
  }
};
