<?php
// Relatório da lista de espera e das estatísticas. Só roda pelo terminal (npm run relatorio).
declare(strict_types=1);
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require __DIR__ . '/comum.php';

$pdo = banco();
$argumentos = array_slice($argv, 1);

if (in_array('--csv', $argumentos, true)) {
    $saida = fopen('php://output', 'w');
    fputcsv($saida, ['email', 'area', 'interesse', 'areas', 'inscrito_em'], ',', '"', '');
    foreach ($pdo->query('SELECT email, area, interesse, areas, inscrito_em FROM waitlist ORDER BY inscrito_em') as $linha) {
        fputcsv($saida, $linha, ',', '"', '');
    }
    exit;
}

$dias = 30;
foreach ($argumentos as $argumento) {
    if (preg_match('/^--dias=(\d{1,3})$/', $argumento, $m)) $dias = max(1, (int) $m[1]);
}
$desde = gmdate('Y-m-d', time() - ($dias - 1) * 86400);

function tabela(string $titulo, iterable $linhas): void
{
    echo "\n$titulo\n" . str_repeat('-', mb_strlen($titulo)) . "\n";
    $vazio = true;
    foreach ($linhas as $linha) {
        $vazio = false;
        $valores = array_values($linha);
        printf("%6s  %s\n", array_pop($valores), implode(' · ', array_map(fn($v) => $v === '' ? '(nenhum)' : $v, $valores)));
    }
    if ($vazio) echo "  (sem registros)\n";
}

$total = (int) $pdo->query('SELECT COUNT(*) FROM waitlist')->fetchColumn();
echo "MIUDOVERSO · relatório ($dias dias para as estatísticas)\n";
echo "Inscrições na lista de espera: $total\n";
tabela('Inscrições por área de atuação', $pdo->query('SELECT area, COUNT(*) total FROM waitlist GROUP BY area ORDER BY total DESC'));
tabela('Inscrições por interesse principal', $pdo->query('SELECT interesse, COUNT(*) total FROM waitlist GROUP BY interesse ORDER BY total DESC'));

$areas = array_fill_keys(AREAS_MIUDOVERSO, 0);
foreach ($pdo->query("SELECT areas FROM waitlist WHERE areas <> ''") as $linha) {
    foreach (explode(',', $linha['areas']) as $area) if (isset($areas[$area])) $areas[$area]++;
}
arsort($areas);
tabela('Áreas que as pessoas usariam', array_map(fn($area, $total) => ['area' => $area, 'total' => $total], array_keys($areas), $areas));

$consulta = fn(string $sql) => (function () use ($pdo, $sql, $desde) {
    $c = $pdo->prepare($sql);
    $c->execute([$desde]);
    return $c->fetchAll();
})();
tabela('Visitas por página', $consulta("SELECT pagina, COUNT(*) total FROM eventos WHERE tipo = 'visita' AND dia >= ? GROUP BY pagina ORDER BY total DESC LIMIT 25"));
tabela('Ações e cliques', $consulta("SELECT alvo, COUNT(*) total FROM eventos WHERE tipo = 'acao' AND dia >= ? GROUP BY alvo ORDER BY total DESC LIMIT 25"));
tabela('Visitas por dia', $consulta("SELECT dia, COUNT(*) total FROM eventos WHERE tipo = 'visita' AND dia >= ? GROUP BY dia ORDER BY dia DESC"));
echo "\nPara exportar as inscrições: npm run relatorio -- --csv > inscricoes.csv\n";
