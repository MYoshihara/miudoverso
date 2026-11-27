#!/usr/bin/env bash
# Configura a publicação automática pelo GitHub (rodar uma vez, no Mac).
#
# 1. Cria uma chave SSH só para a Action (~/.ssh/miudoverso_deploy), se ainda não existir.
# 2. Autoriza essa chave na Hostinger, usando o alias SSH "hostinger".
# 3. Testa o acesso com a chave nova.
# 4. Cadastra a chave e os dados do servidor no ambiente "preview" do GitHub:
#    com o GitHub CLI (gh), faz tudo sozinho; sem ele, copia cada valor para a
#    área de transferência e abre a página certa para você colar.
#
# Uso: npm run configurar-publicacao
set -euo pipefail

repo=MYoshihara/miudoverso
environment=preview
alias_ssh=hostinger
key="$HOME/.ssh/miudoverso_deploy"

step() { printf '\n\033[1m%s\033[0m\n' "$*"; }

step '1. Chave da Action'
if [[ -f $key ]]; then
  echo "Usando a chave que já existe em $key"
else
  ssh-keygen -t ed25519 -N '' -C 'github-actions-miudoverso' -f "$key" >/dev/null
  echo "Chave criada em $key"
fi

step '2. Autorizando a chave na Hostinger'
ssh -o BatchMode=yes "$alias_ssh" '
  key=$(cat)
  mkdir -p ~/.ssh && chmod 700 ~/.ssh
  touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
  grep -qxF "$key" ~/.ssh/authorized_keys || printf "%s\n" "$key" >> ~/.ssh/authorized_keys
' < "$key.pub"
echo 'Chave autorizada.'

ssh_config=$(ssh -G "$alias_ssh")
host=$(awk '$1 == "hostname" { print $2; exit }' <<< "$ssh_config")
port=$(awk '$1 == "port" { print $2; exit }' <<< "$ssh_config")
user=$(awk '$1 == "user" { print $2; exit }' <<< "$ssh_config")
echo "Servidor: $host · porta $port · usuário $user"

step '3. Testando o acesso com a chave nova'
known_hosts=$(ssh-keyscan -p "$port" "$host" 2>/dev/null || true)
if [[ -z $known_hosts ]]; then
  echo "Não foi possível ler a impressão digital de $host:$port." >&2
  exit 1
fi
known_file=$(mktemp)
trap 'rm -f "$known_file"' EXIT
printf '%s\n' "$known_hosts" > "$known_file"
ssh -i "$key" -o IdentitiesOnly=yes -o BatchMode=yes -o UserKnownHostsFile="$known_file" -o StrictHostKeyChecking=yes \
  -p "$port" "$user@$host" true
echo 'Acesso funcionando.'

step '4. Cadastrando no GitHub'
if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  gh api -X PUT "repos/$repo/environments/$environment" >/dev/null
  gh secret set HOSTINGER_SSH_KEY --repo "$repo" --env "$environment" < "$key"
  printf '%s\n' "$known_hosts" | gh secret set HOSTINGER_KNOWN_HOSTS --repo "$repo" --env "$environment"
  gh variable set HOSTINGER_HOST --repo "$repo" --env "$environment" --body "$host"
  gh variable set HOSTINGER_PORT --repo "$repo" --env "$environment" --body "$port"
  gh variable set HOSTINGER_USER --repo "$repo" --env "$environment" --body "$user"
  echo 'Segredos e variáveis cadastrados no ambiente "preview".'
else
  echo 'GitHub CLI (gh) não encontrado ou sem login. Vamos cadastrar pela página do GitHub.'
  echo "Se o ambiente \"$environment\" não existir, clique em New environment e crie com esse nome."
  open "https://github.com/$repo/settings/environments" 2>/dev/null || true
  paste_value() {
    printf '%s' "$2" | pbcopy
    read -r -p "Copiei $1. Cole em \"$3\" e pressione Enter para continuar... "
  }
  paste_value 'a chave privada' "$(cat "$key")" 'Environment secrets › HOSTINGER_SSH_KEY'
  paste_value 'a impressão digital do servidor' "$known_hosts" 'Environment secrets › HOSTINGER_KNOWN_HOSTS'
  paste_value 'o servidor' "$host" 'Environment variables › HOSTINGER_HOST'
  paste_value 'a porta' "$port" 'Environment variables › HOSTINGER_PORT'
  paste_value 'o usuário' "$user" 'Environment variables › HOSTINGER_USER'
  printf '' | pbcopy
  echo 'Pronto. A área de transferência foi limpa.'
fi

step 'Tudo configurado.'
echo 'A próxima atualização do main publica o site sozinha.'
echo "Para publicar agora: aba Actions › Testar e publicar › Run workflow (https://github.com/$repo/actions)."
