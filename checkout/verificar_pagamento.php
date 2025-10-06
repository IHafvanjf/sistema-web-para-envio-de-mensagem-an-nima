<?php
require_once 'config.php';
require_once 'db.php';
header('Content-Type: application/json');

// Recebe payment_id via GET
$payment_id = isset($_GET['payment_id']) ? trim($_GET['payment_id']) : null;
if (!$payment_id) {
    http_response_code(400);
    echo json_encode(['erro' => 'payment_id ausente']);
    exit;
}

// Consulta o status via Mercado Pago
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.mercadopago.com/v1/payments/{$payment_id}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . MP_ACCESS_TOKEN
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);
$status_api = $data['status'] ?? null;

if ($http_code === 200 && $status_api) {
    // Mapeia o status da API para o sistema
    switch (strtolower($status_api)) {
        case 'approved':
            $status_local = 'aprovado';
            break;
        case 'pending':
            $status_local = 'pendente';
            break;
        case 'cancelled':
        case 'rejected':
            $status_local = 'rejeitado';
            break;
        default:
            $status_local = 'pendente';
    }

    // Atualiza na tabela cartas
    $stmt = $pdo->prepare("UPDATE cartas SET status_pagamento = ? WHERE pagamento_id = ?");
    $stmt->execute([$status_local, $payment_id]);

    echo json_encode([
        'status' => $status_local,
        'status_api' => $status_api,
        'payment_id' => $payment_id
    ]);
} else {
    http_response_code($http_code);
    echo json_encode([
        'erro' => 'Falha ao consultar pagamento',
        'resposta' => $data
    ]);
}
?>