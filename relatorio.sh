#!/usr/bin/env bash
# Mostra o relatório da lista de espera e das estatísticas gravadas na Hostinger.
# Uso: npm run relatorio [-- --dias=7 | -- --csv > inscricoes.csv]
set -euo pipefail

host=hostinger
destination=/home/matheusy/preview.ywd.com.br/miudoverso
ssh=(ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=yes -o ClearAllForwardings=yes)

args=()
for arg in "$@"; do
  case "$arg" in
    --csv|--dias=[0-9]|--dias=[0-9][0-9]|--dias=[0-9][0-9][0-9]) args+=("$arg") ;;
    *) printf 'Uso: npm run relatorio [-- --dias=N | -- --csv]\n' >&2; exit 2 ;;
  esac
done

"${ssh[@]}" "$host" "php '$destination/api/relatorio.php' ${args[*]-}"
