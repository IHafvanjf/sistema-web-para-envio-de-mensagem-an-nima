<?php
require_once 'config.php';
require_once 'db.php';
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Captura o corpo da notificação
$entrada = file_get_contents("php://input");
$evento = json_decode($entrada, true);

// Log opcional para debug
file_put_contents(__DIR__ . '/log_webhook.txt', $entrada . PHP_EOL, FILE_APPEND);

// Valida tipo de evento
if (!isset($evento['type']) || $evento['type'] !== 'payment') {
    http_response_code(200);
    echo json_encode(['status' => 'ignorado']);
    exit;
}

// ID do pagamento
$id_pagamento = $evento['data']['id'] ?? null;
if (!$id_pagamento) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID do pagamento ausente']);
    exit;
}

// Consulta a API do Mercado Pago para verificar o status
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.mercadopago.com/v1/payments/$id_pagamento");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . MP_ACCESS_TOKEN,
    "Content-Type: application/json"
]);
$resposta = curl_exec($ch);
curl_close($ch);

$dados_pagamento = json_decode($resposta, true);

if (!isset($dados_pagamento['status']) || $dados_pagamento['status'] !== 'approved') {
    http_response_code(200);
    echo json_encode(['status' => 'pagamento não aprovado ainda']);
    exit;
}

// Atualiza status da carta
try {
    $stmt = $pdo->prepare("UPDATE cartas SET status_pagamento = 'aprovado' WHERE pagamento_id = ?");
    $stmt->execute([$id_pagamento]);

    echo json_encode(['status' => 'ok', 'id' => $id_pagamento]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro no banco de dados', 'mensagem' => $e->getMessage()]);
}
