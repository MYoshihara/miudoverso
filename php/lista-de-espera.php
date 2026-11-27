<?php
declare(strict_types=1);
require __DIR__ . '/comum.php';

$form = ler_json(2048, true);
$email = is_string($form['email'] ?? null) ? strtolower(trim($form['email'])) : '';
$areas = $form['areas'] ?? [];
$valido = preg_match('/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/', $email) === 1 && strlen($email) <= 254
    && in_array($form['area'] ?? null, AREAS_ATUACAO, true)
    && in_array($form['interesse'] ?? null, INTERESSES, true)
    && ($form['consent'] ?? null) === true
    && is_array($areas) && count($areas) <= count(AREAS_MIUDOVERSO)
    && array_diff($areas, AREAS_MIUDOVERSO) === [];
if (!$valido) {
    responder(400, 'Informe um e-mail válido, selecione as opções e confirme seu interesse no piloto.');
}
if (!empty($form['website'])) {
    responder(201, 'Inscrição confirmada. Obrigado pelo interesse!');
}

try {
    $consulta = banco()->prepare(
        'INSERT INTO waitlist (email, area, interesse, areas) VALUES (?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET area = excluded.area, interesse = excluded.interesse, areas = excluded.areas'
    );
    $consulta->execute([$email, $form['area'], $form['interesse'], implode(',', array_unique($areas))]);
} catch (Throwable $erro) {
    error_log('Miudoverso lista de espera: ' . $erro->getMessage());
    responder(503, 'O formulário está temporariamente indisponível. Seus dados não foram confirmados.');
}
responder(201, 'Inscrição confirmada. Avisaremos por e-mail quando o piloto estiver disponível.');
