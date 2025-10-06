<?php
session_start();
require_once 'conexao.php'; // arquivo com a conexão ao banco

header('Content-Type: application/json');

if (!isset($_SESSION['id'])) {
    echo json_encode(['enviadas' => [], 'recebidas' => []]);
    exit();
}

$id_usuario = $_SESSION['id'];

// Cartas enviadas com pagamento aprovado
$sqlEnvios = "SELECT id, tipo, tema, criado_em FROM cartas WHERE remetente_id = ? AND status_pagamento = 'aprovado'";
$stmtEnvios = $conn->prepare($sqlEnvios);
$stmtEnvios->bind_param("i", $id_usuario);
$stmtEnvios->execute();
$resultEnvios = $stmtEnvios->get_result();
$enviadas = [];
while ($row = $resultEnvios->fetch_assoc()) {
    $enviadas[] = $row;
}

// Cartas recebidas (não precisam de filtro por pagamento)
$sqlRecebidas = "SELECT id, tipo, tema, mensagem, visto, reacao 
                 FROM cartas 
                 WHERE destinatario_nome = (SELECT nome FROM usuarios WHERE id = ?)";
$stmtRecebidas = $conn->prepare($sqlRecebidas);
$stmtRecebidas->bind_param("i", $id_usuario);
$stmtRecebidas->execute();
$resultRecebidas = $stmtRecebidas->get_result();
$recebidas = [];
while ($row = $resultRecebidas->fetch_assoc()) {
    $recebidas[] = $row;
}

// Resposta JSON

echo json_encode([
    'enviadas' => $enviadas,
    'recebidas' => $recebidas
]);