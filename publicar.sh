#!/usr/bin/env bash
set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")"

flags=()
case "${1:-}" in
  --dry-run) flags+=(--dry-run) ;;
  '') ;;
  *) printf 'Uso: npm run publicar [-- --dry-run]\n' >&2; exit 2 ;;
esac
if (( $# > 1 )); then
  printf 'Uso: npm run publicar [-- --dry-run]\n' >&2
  exit 2
fi

host=hostinger
destination=/home/matheusy/preview.ywd.com.br/miudoverso
ssh=(ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=yes -o ClearAllForwardings=yes)

"${ssh[@]}" "$host" "test -f '$destination/index.html' && command -v rsync >/dev/null"

# Inscrições e estatísticas ficam fora da pasta pública, em /home/usuario/miudoverso-dados.
data_dir=$(dirname -- "$(dirname -- "$destination")")/miudoverso-dados
if [[ -z ${flags[*]-} ]]; then
  "${ssh[@]}" "$host" "mkdir -p '$data_dir' && chmod 700 '$data_dir'"
fi

staging=$(mktemp -d "${TMPDIR:-/tmp}/miudoverso-publicacao.XXXXXXXX")
trap 'rm -rf -- "$staging"' EXIT
site="$staging/site"
node build.mjs --static-output "$site"

if grep -q 'class="to-define"' "$site/privacidade/index.html" && [[ -z ${flags[*]-} && ${MIUDOVERSO_PUBLICAR_SEM_PRIVACIDADE:-} != 1 ]]; then
  printf '\nA política de privacidade ainda tem campos [definir …].\n' >&2
  printf 'Preencha "privacidade" em dados.js antes de publicar.\n' >&2
  printf 'Para publicar mesmo assim: MIUDOVERSO_PUBLICAR_SEM_PRIVACIDADE=1 npm run publicar\n' >&2
  exit 1
fi

# A área temporária preserva os modos Unix independentemente do SSD externo.
find "$site" -type d -exec chmod 0755 {} +
find "$site" -type f -exec chmod 0644 {} +

rsync --recursive --perms --checksum --delay-updates --itemize-changes \
  -e "${ssh[*]}" ${flags[@]+"${flags[@]}"} -- "$site/" "$host:$destination/"
