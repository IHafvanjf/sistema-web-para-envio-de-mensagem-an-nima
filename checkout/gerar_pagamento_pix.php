<?php
require_once 'config.php';
require_once 'db.php';
session_start();
$remetente_id = isset($_SESSION['id']) ? $_SESSION['id'] : null;

header('Content-Type: application/json');

// Ativa exibição de erros para debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verifica se os dados básicos foram enviados
$destinatario = $_POST['destinatario'] ?? '';
$mensagem     = $_POST['mensagem'] ?? '';
$tipo         = $_POST['tipo'] ?? 'anonimo';
$tema         = $_POST['tema'] ?? 'padrao';

if (!$destinatario || !$mensagem) {
    http_response_code(400);
    echo json_encode(['erro' => 'Campos obrigatórios ausentes']);
    exit;
}

// Sem imagem por enquanto
$imagem_path = null;

// Gera pagamento PIX com Mercado Pago
$valor = 0.01;
$idempotency_key = uniqid('pix_', true);

$payload = [
    "transaction_amount" => $valor,
    "description" => "Correio Elegante para $destinatario",
    "payment_method_id" => "pix",
    "payer" => [
        "email" => "teste@teste.com",
        "first_name" => "APRO",
        "last_name" => "Test",
        "identification" => [
            "type" => "CPF",
            "number" => "10412828693"
        ]
    ]
];

// Envia requisição para Mercado Pago
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.mercadopago.com/v1/payments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . MP_ACCESS_TOKEN,
    "X-Idempotency-Key: $idempotency_key"
]);

$response = curl_exec($ch);

if (!$response) {
    http_response_code(500);
    echo json_encode(['erro' => 'Falha na requisição ao Mercado Pago', 'detalhe' => curl_error($ch)]);
    curl_close($ch);
    exit;
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$data = json_decode($response, true);

// Log opcional para depuração
file_put_contents(__DIR__ . '/log_pix.txt', $response);

if ($http_code !== 201 || !isset($data['id'])) {
    http_response_code($http_code);
    echo json_encode(['erro' => 'Erro ao gerar pagamento PIX', 'resposta' => $data]);
    exit;
}

$pagamento_id = $data['id'];
$pixCode = $data['point_of_interaction']['transaction_data']['qr_code'] ?? null;
$pixImg  = $data['point_of_interaction']['transaction_data']['qr_code_base64'] ?? null;

if (!$pixCode || !$pixImg) {
    http_response_code(500);
    echo json_encode(['erro' => 'QR Code não retornado pela API']);
    exit;
}

// Tenta salvar a carta no banco com status 'pendente'
try {
    $stmt = $pdo->prepare("INSERT INTO cartas 
(remetente_id, destinatario_nome, mensagem, imagem_path, tipo, tema, pagamento_id, status_pagamento)
VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente')");
$stmt->execute([$remetente_id, $destinatario, $mensagem, $imagem_path, $tipo, $tema, $pagamento_id]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao salvar no banco', 'mensagem' => $e->getMessage()]);
    exit;
}

// Retorna os dados para o frontend exibir
echo json_encode([
    'status' => 'sucesso',
    'payment_id' => $pagamento_id,
    'chave_pix' => $pixCode,
    'qr_code_base64' => $pixImg
]);
