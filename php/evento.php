<?php
// Estatística anônima: registra o dia, a página e a ação, sem IP, cookies ou identificadores.
declare(strict_types=1);
require __DIR__ . '/comum.php';

$evento = ler_json(512, false);
$tipo = $evento['tipo'] ?? null;
$pagina = $evento['pagina'] ?? null;
$alvo = $evento['alvo'] ?? '';
$caminho = '/^\/[a-z0-9\-\/.]{0,118}$/';
$valido = in_array($tipo, ['visita', 'acao'], true)
    && is_string($pagina) && preg_match($caminho, $pagina) === 1
    && is_string($alvo) && preg_match('/^[a-z0-9\-\/.:]{0,120}$/', $alvo) === 1;
if (!$valido) {
    responder(400);
}
try {
    banco()->prepare('INSERT INTO eventos (dia, tipo, pagina, alvo) VALUES (?, ?, ?, ?)')
        ->execute([gmdate('Y-m-d'), $tipo, $pagina, $alvo]);
} catch (Throwable $erro) {
    error_log('Miudoverso eventos: ' . $erro->getMessage());
    responder(503);
}
responder(204);
