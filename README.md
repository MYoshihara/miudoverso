# Miudoverso

Prévia de validação de uma plataforma para pedagogia e fonoaudiologia: materiais para baixar, bibliotecas de imagens e sons, artigos e uma rede de profissionais com perfis, feed e lojinhas.

| Área | Endereço | O que tem |
|---|---|---|
| Miudoverso Materiais | `/materiais/` | Catálogo com busca, filtros, favoritos e PDFs gratuitos |
| Miudoverso Visual | `/visual/` | Imagens para baixar |
| Miudoverso Sons | `/sons/` | Recursos sonoros com player próprio |
| Miudoverso Inspira | `/inspira/` | Artigos |
| Miudoverso Conecta | `/conecta/` | Feed, perfis, portfólios e lojinhas |
| Meu Miudoverso | `/meu-miudoverso/` | Perfil, favoritos e quem você segue |
| Para quem cria | `/criadores/` | Comissão, simulador de ganhos e planos |
| Criar perfil | `/criar-perfil/` | Cadastro em três etapas |

O Miudoverso Play (jogos digitais) fica para uma próxima etapa.

**O que é real e o que é demonstração:** a lista de espera e as estatísticas de uso gravam dados de verdade. Perfis, publicações no feed, curtidas, seguir, favoritos, compras, envio de materiais e denúncias são demonstrações e ficam só no navegador de quem testa. Os PDFs gratuitos podem ser baixados.

## Antes de divulgar

Preencha o responsável pelos dados e o e-mail de contato em `privacidade`, no fim de `dados.js`. Enquanto os campos `[definir …]` existirem, o build mostra um aviso e o `npm run publicar` se recusa a publicar.

## Executar no computador

Use Node.js 24 e rode estes comandos na pasta do projeto:

```sh
npm run build
npm run preview
```

Abra `http://127.0.0.1:9418`. Os cadastros locais são gravados em `inscricoes.sqlite`, que é criado na primeira execução. No Mac, dá para abrir a prévia com dois cliques em `iniciar-miudoverso.command`.

## Editar o conteúdo

Quase todo o conteúdo fica em `dados.js`: materiais, profissionais, publicações do feed, imagens e sons, o endereço público do site (`site.url`) e os dados da política de privacidade. Os textos fixos das páginas ficam em `paginas/`, e o layout comum, em `index.html`.

Depois de editar, rode `npm run build` de novo.

### Paginação

Cada lista mostra um número fixo de itens por página, definido em `paginacao`, no fim de `dados.js`:

- **Visual, Sons, Inspira e o diretório de profissionais** (`/conecta/profissionais/`) têm páginas com endereço próprio, como `/visual/pagina/2/`, geradas no build.
- **Catálogo de Materiais:** a paginação acontece junto com a busca e os filtros, e o estado fica no endereço (`?busca=&filtro=&pagina=`).
- **Feed do Conecta:** mostra um bloco de publicações por vez, com o botão "Carregar mais publicações".

Para ver a paginação funcionando com pouco conteúdo, gere o site com `MIUDOVERSO_POR_PAGINA=2 npm run build`.

## Publicar na Hostinger

```sh
npm run publicar
```

O comando gera o site em uma pasta temporária e o envia por `rsync` para `https://preview.ywd.com.br/miudoverso/`, usando o alias SSH `hostinger` configurado no Mac. Para ver as mudanças sem aplicá-las, use `npm run publicar -- --dry-run`.

Junto com o site vão:

- `api/`: os scripts PHP da lista de espera (`lista-de-espera.php`) e das estatísticas (`evento.php`). O servidor precisa de PHP 8.1 ou mais novo, com `pdo_sqlite`.
- `.htaccess`: a página de erro 404. Também há um `.htaccess` em `api/`, que bloqueia os arquivos internos.

As inscrições e as estatísticas ficam num arquivo SQLite fora da pasta pública, em `/home/matheusy/miudoverso-dados/`. O `npm run publicar` cria essa pasta com acesso só para o seu usuário.

### Publicação automática pelo GitHub

A Action `.github/workflows/publicar.yml` roda os testes em cada pull request. Quando o `main` é atualizado, ela roda os testes e, se passarem, executa o `npm run publicar`. Também dá para publicar na mão pela aba **Actions › Testar e publicar › Run workflow**. Enquanto o acesso abaixo não estiver configurado, a Action só roda os testes e avisa que pulou a publicação.

Configuração, feita uma única vez no Mac:

1. Crie uma chave SSH só para a Action, sem senha:

   ```sh
   ssh-keygen -t ed25519 -N "" -C "github-actions-miudoverso" -f ~/.ssh/miudoverso_deploy
   ```

2. Autorize a chave na Hostinger:

   ```sh
   ssh hostinger 'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys' < ~/.ssh/miudoverso_deploy.pub
   ```

3. Veja o servidor, a porta e o usuário que o alias `hostinger` usa:

   ```sh
   ssh -G hostinger | grep -E '^(hostname|port|user) '
   ```

4. Gere a impressão digital do servidor, trocando PORTA e SERVIDOR pelos valores do passo 3:

   ```sh
   ssh-keyscan -p PORTA SERVIDOR
   ```

5. No GitHub, abra **Settings › Environments**, crie o ambiente `preview` e cadastre:
   - em **Environment secrets**:
     - `HOSTINGER_SSH_KEY`: o conteúdo de `~/.ssh/miudoverso_deploy` (a chave privada, sem `.pub`);
     - `HOSTINGER_KNOWN_HOSTS`: a saída do passo 4;
   - em **Environment variables**: `HOSTINGER_HOST`, `HOSTINGER_PORT` e `HOSTINGER_USER`, com os valores do passo 3.

A chave privada só fica no seu Mac e nos segredos do GitHub. Para revogar o acesso, apague a linha `github-actions-miudoverso` do `~/.ssh/authorized_keys` na Hostinger.

## Ver inscrições e estatísticas

```sh
npm run relatorio
```

O relatório mostra o total de inscrições, por área de atuação, por interesse e pelas áreas que as pessoas usariam. Também mostra as visitas por página, as ações mais feitas e as visitas por dia nos últimos 30 dias. Para outro período, use `npm run relatorio -- --dias=7`. Para exportar as inscrições, use `npm run relatorio -- --csv > inscricoes.csv`.

As estatísticas são anônimas. Guardam apenas o dia, a página e a ação (curtir, seguir, favoritar, baixar, publicar, inscrever-se), sem IP, cookies ou identificadores.

## Publicação com o Worker

O build também gera um Worker em `dist/server/index.js`, com os endpoints `/api/lista-de-espera` e `/api/evento`. O manifesto de hospedagem está em `.openai/hosting.json`. Aplique as migrações de `drizzle/` (`0000_waitlist.sql` e `0001_areas_eventos.sql`) no banco D1 com o binding `DB`. Localmente, o `npm run preview` aplica as migrações sozinho.

## Prévia sem servidor

```sh
node build.mjs --static-output pasta-de-saida --demo
```

Gera uma versão que funciona sem PHP: a lista de espera só simula o envio e não há estatísticas.

## Testes

```sh
npm install
npx playwright install chromium
npm test
```

Os testes abrem o site no Chromium em várias larguras de tela e percorrem catálogo, feed, cadastro, simulador, player e lista de espera. Os testes da hospedagem PHP rodam quando o `php` com `pdo_sqlite` está instalado; sem ele, são pulados.
