import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { readFile, readdir } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import worker from './dist/server/index.js';

const database = new DatabaseSync(process.env.MIUDOVERSO_DB ?? 'inscricoes.sqlite');
// Aplica cada migração de drizzle/ uma única vez, na ordem dos arquivos.
database.exec('CREATE TABLE IF NOT EXISTS _migracoes (nome TEXT PRIMARY KEY NOT NULL)');
const applied = new Set(database.prepare('SELECT nome FROM _migracoes').all().map(row => row.nome));
const hasWaitlist = database.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'waitlist'").get();
if (hasWaitlist && !applied.size) applied.add('0000_waitlist.sql');
for (const name of (await readdir('drizzle')).filter(file => file.endsWith('.sql')).sort()) {
  if (applied.has(name)) continue;
  database.exec('BEGIN');
  database.exec(await readFile('drizzle/' + name, 'utf8'));
  database.prepare('INSERT OR IGNORE INTO _migracoes (nome) VALUES (?)').run(name);
  database.exec('COMMIT');
}
const env = { DB: { prepare: sql => ({ bind: (...values) => ({ run: () => database.prepare(sql).run(...values) }) }) } };
const server = createServer(async (incoming, outgoing) => {
  const method = incoming.method;
  const payload = method === 'GET' || method === 'HEAD' ? {} : { body: Readable.toWeb(incoming), duplex: 'half' };
  const request = new Request('http://' + incoming.headers.host + incoming.url, { method, headers: incoming.headers, ...payload });
  const response = await worker.fetch(request, env);
  outgoing.writeHead(response.status, Object.fromEntries(response.headers));
  if (response.body) Readable.fromWeb(response.body).pipe(outgoing);
  else outgoing.end();
});
server.listen(Number(process.env.MIUDOVERSO_PORT ?? 9418), '127.0.0.1', () => {
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  console.log('Local ' + url);

  if (process.env.MIUDOVERSO_OPEN_BROWSER === '1' && process.platform === 'darwin') {
    execFile('/usr/bin/open', [url], error => {
      if (error) console.error('Abra a prévia no navegador: ' + url);
    });
  }
});
