#!/bin/zsh -il
cd -- "${0:A:h}" || exit 1

setopt pipefail

if [[ ${1:-} == --ativar-automatico ]]; then
  set -e
  if ! node_bin=$(whence -p node) ||
    ! "$node_bin" --disable-warning=ExperimentalWarning -e 'require("node:sqlite")'; then
    print -u2 'A prévia automática requer Node.js com suporte a SQLite. Use Node.js 24.'
    exit 1
  fi

  agent_label=br.com.ywd.miudoverso.preview
  agent_dir="$HOME/Library/LaunchAgents"
  agent_plist="$agent_dir/$agent_label.plist"
  agent_domain="gui/$UID"
  log_path="$HOME/Library/Logs/miudoverso-preview.log"

  /bin/mkdir -p "$agent_dir" "${log_path:h}"
  temp_plist=$(/usr/bin/mktemp "$agent_dir/$agent_label.XXXXXX")
  trap '/bin/rm -f "$temp_plist"' EXIT

  "$node_bin" - "$agent_label" "$PWD" "$node_bin" "$log_path" <<'NODE' | /usr/bin/plutil -convert xml1 -o "$temp_plist" -- -
const [label, project, node, log] = process.argv.slice(2);
process.stdout.write(JSON.stringify({
  Label: label,
  ProgramArguments: [
    '/bin/zsh',
    '-c',
    '[[ -d "$1" ]] || exit 0\ncd -- "$1" || exit 1\n"$2" build.mjs && MIUDOVERSO_DB=:memory: exec "$2" preview.mjs',
    label,
    project,
    node
  ],
  RunAtLoad: true,
  StartOnMount: true,
  KeepAlive: { SuccessfulExit: false },
  ThrottleInterval: 30,
  StandardOutPath: log,
  StandardErrorPath: log
}));
NODE

  /usr/bin/plutil -lint -s "$temp_plist"
  if /bin/launchctl print "$agent_domain/$agent_label" >/dev/null 2>&1; then
    /bin/launchctl bootout "$agent_domain/$agent_label"
  fi
  /bin/mv -f "$temp_plist" "$agent_plist"
  /bin/launchctl bootstrap "$agent_domain" "$agent_plist"

  preview_url=http://127.0.0.1:9418/
  for attempt in {1..10}; do
    if page=$(/usr/bin/curl --noproxy '*' --fail --silent --max-time 1 "$preview_url") &&
      [[ "$page" == *'<title>Miudoverso'* ]]; then
      print "Miudoverso em execução. Inicialização automática ativada. $preview_url"
      exit 0
    fi
    /bin/sleep 1
  done
  print -u2 "Inicialização automática registrada. O servidor ainda não respondeu em $preview_url"
  print -u2 "Registro do servidor: $log_path"
  exit 1
fi

if npm run build && MIUDOVERSO_DB=:memory: MIUDOVERSO_OPEN_BROWSER=1 npm run preview; then
  exit 0
fi
printf '\nNão foi possível iniciar a prévia. O erro está nas linhas acima.\n'
read -r '?Pressione Enter para fechar. '
exit 1
