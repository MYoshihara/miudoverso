// Funções de apoio dos testes: build, servidores locais e navegador.
import { spawn, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
export const { chromium } = require('playwright');
export const raiz = new URL('..', import.meta.url).pathname;

export function build(...args) {
  execFileSync(process.execPath, ['build.mjs', ...args], { cwd: raiz, stdio: 'pipe' });
}

async function esperar(url) {
  for (let tentativa = 0; tentativa < 50; tentativa++) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  throw new Error('O servidor não respondeu em ' + url);
}

// Prévia com o Worker e banco SQLite em memória.
export async function iniciarPrevia(porta = 9431) {
  build();
  const processo = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', 'preview.mjs'], {
    cwd: raiz, env: { ...process.env, MIUDOVERSO_DB: ':memory:', MIUDOVERSO_PORT: String(porta) }, stdio: 'ignore'
  });
  const url = 'http://127.0.0.1:' + porta;
  await esperar(url + '/');
  return { url, parar: () => processo.kill() };
}

// Versão estática servida pelo PHP numa subpasta, como na Hostinger.
export async function iniciarPhp(porta = 9531) {
  const pasta = mkdtempSync(join(tmpdir(), 'miudoverso-'));
  const dados = join(pasta, 'dados');
  mkdirSync(dados);
  build('--static-output', join(pasta, 'www', 'miudoverso'));
  const processo = spawn('php', ['-S', '127.0.0.1:' + porta, '-t', join(pasta, 'www')], {
    env: { ...process.env, MIUDOVERSO_DADOS: dados }, stdio: 'ignore'
  });
  const url = 'http://127.0.0.1:' + porta + '/miudoverso';
  await esperar(url + '/');
  const relatorio = (...args) => execFileSync('php', [join(pasta, 'www', 'miudoverso', 'api', 'relatorio.php'), ...args], {
    env: { ...process.env, MIUDOVERSO_DADOS: dados }, encoding: 'utf8'
  });
  return { url, relatorio, parar: () => processo.kill() };
}

// Abre uma página e acumula erros de JavaScript em pagina.erros.
export async function novaPagina(navegador, opcoes = {}) {
  const pagina = await navegador.newPage({ viewport: { width: 1280, height: 800 }, ...opcoes });
  pagina.erros = [];
  pagina.on('pageerror', erro => pagina.erros.push(erro.message));
  return pagina;
}
