import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import worker from './dist/server/index.js';

const database = new DatabaseSync(process.env.MIUDOVERSO_DB ?? 'inscricoes.sqlite');
const schema = await readFile('drizzle/0000_waitlist.sql', 'utf8');
database.exec(schema.replace('CREATE TABLE waitlist', 'CREATE TABLE IF NOT EXISTS waitlist'));
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
