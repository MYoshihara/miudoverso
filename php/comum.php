<?php
// Funções compartilhadas pelos endpoints do Miudoverso na hospedagem PHP.
declare(strict_types=1);

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    http_response_code(404);
    exit;
}

const AREAS_ATUACAO = ['pedagogia', 'fonoaudiologia', 'outra'];
const INTERESSES = ['baixar', 'compartilhar', 'vender'];
const AREAS_MIUDOVERSO = ['materiais', 'visual', 'sons', 'conecta', 'inspira'];

// Os dados ficam fora da pasta pública: /home/usuario/miudoverso-dados.
function pasta_dados(): string
{
    $pasta = getenv('MIUDOVERSO_DADOS') ?: dirname(__DIR__, 3) . '/miudoverso-dados';
    if (!is_dir($pasta) && !@mkdir($pasta, 0700, true)) {
        throw new RuntimeException('Pasta de dados indisponível: ' . $pasta);
    }
    return $pasta;
}

function banco(): PDO
{
    $pdo = new PDO('sqlite:' . pasta_dados() . '/miudoverso.sqlite', null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA busy_timeout = 3000');
    $pdo->exec("CREATE TABLE IF NOT EXISTS waitlist (
        email TEXT PRIMARY KEY NOT NULL,
        area TEXT NOT NULL,
        interesse TEXT NOT NULL,
        areas TEXT NOT NULL DEFAULT '',
        inscrito_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )");
    $pdo->exec("CREATE TABLE IF NOT EXISTS eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dia TEXT NOT NULL,
        tipo TEXT NOT NULL,
        pagina TEXT NOT NULL,
        alvo TEXT NOT NULL DEFAULT ''
    )");
    $pdo->exec('CREATE INDEX IF NOT EXISTS eventos_dia ON eventos (dia)');
    return $pdo;
}

function responder(int $status, ?string $mensagem = null): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if ($mensagem !== null) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['message' => $mensagem], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

// Aceita só POST com JSON de até $limite bytes e devolve o objeto decodificado.
function ler_json(int $limite, bool $exigir_origem): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        responder(405);
    }
    $origem = $_SERVER['HTTP_ORIGIN'] ?? '';
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (($exigir_origem || $origem !== '') && parse_url($origem, PHP_URL_HOST) !== strtok($host, ':')) {
        responder(403, 'Envie o formulário pelo site.');
    }
    if (!str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
        responder(415, 'Formato inválido.');
    }
    $corpo = file_get_contents('php://input', false, null, 0, $limite + 1);
    if ($corpo === false || strlen($corpo) > $limite) {
        responder(413, 'O envio excedeu o tamanho permitido.');
    }
    $dados = json_decode($corpo, true);
    if (!is_array($dados)) {
        responder(400, 'Confira os dados e tente novamente.');
    }
    return $dados;
}
