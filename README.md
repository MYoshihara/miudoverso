# Miudoverso

Prévia de validação com catálogo, perfis, lojinhas demonstrativas, artigos e lista de espera.

## Executar no computador

Use Node.js 24 e rode estes comandos na pasta `miudoverso`.

```sh
npm run build
npm run preview
```

Abra o endereço indicado no terminal. Os cadastros locais são gravados em `inscricoes.sqlite`. O arquivo é criado na primeira execução e permanece no computador.

Para consultar as inscrições locais com o utilitário SQLite:

```sh
sqlite3 -header -column inscricoes.sqlite 'SELECT email, area, interesse, inscrito_em FROM waitlist ORDER BY inscrito_em DESC;'
```

## Publicação estática no cPanel

Rode `npm run publicar` na pasta do projeto para atualizar `https://preview.ywd.com.br/miudoverso/` usando o alias SSH `hostinger` já configurado no Mac. O servidor precisa aceitar essa conexão e ter `rsync` disponível. Use `npm run publicar -- --dry-run` para listar as mudanças sem aplicá-las.

O comando gera a versão estática em uma pasta temporária, aplica `0644` aos arquivos e `0755` às pastas e transmite essas permissões também para arquivos existentes. A versão nas URLs do CSS e do JavaScript muda quando os recursos compilados mudam. A lista de espera da versão estática funciona em modo demonstração.

## Publicação com o Worker

O Worker é gerado em `dist/server/index.js`. O manifesto de hospedagem está em `.openai/hosting.json`. Aplique a migração em `drizzle/` para criar a lista de espera no banco da hospedagem.

Cadastros no ambiente local ficam no SQLite local. Cadastros de uma futura implantação ficam no D1 com o binding DB. Perfis, publicação de materiais, denúncias e compras são demonstrações. A ficha em PDF pode ser baixada.
