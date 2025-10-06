<?php
session_start();
require_once 'conexao.php';

header('Content-Type: application/json; charset=utf-8');

// Verifica se o usuário está logado
if (!isset($_SESSION['id'])) {
    echo json_encode([]);
    exit;
}

$usuario_id = $_SESSION['id'];

// Buscar nome e turma do usuário
$busca = $conn->prepare("SELECT nome, turma FROM usuarios WHERE id = ?");
$busca->bind_param("i", $usuario_id);
$busca->execute();
$result = $busca->get_result();
$usuario = $result->fetch_assoc();

if (!$usuario) {
    echo json_encode([]);
    exit;
}

// Formata o nome completo para comparação com o campo destinatario_nome
$nomeCompleto = $usuario['nome'] . " (Turma " . $usuario['turma'] . ")";

// DEBUG OPCIONAL: salvar o nome buscado para testar se está igual ao do banco
// file_put_contents("debug_nome.txt", $nomeCompleto);

// Buscar cartas recebidas com pagamento aprovado
$cartasQuery = $conn->prepare("
    SELECT id, remetente_id, destinatario_nome, mensagem, imagem_path, tipo, criado_em, tema, reacao, visto 
    FROM cartas 
    WHERE destinatario_nome = ? AND status_pagamento = 'aprovado'
    ORDER BY criado_em DESC
");
$cartasQuery->bind_param("s", $nomeCompleto);
$cartasQuery->execute();
$resultado = $cartasQuery->get_result();

// Monta o array de cartas recebidas
$cartas = [];
while ($row = $resultado->fetch_assoc()) {
    $cartas[] = [
        'id' => $row['id'],
        'remetente_id' => $row['remetente_id'],
        'destinatario_nome' => $row['destinatario_nome'],
        'mensagem' => $row['mensagem'],
        'imagem_path' => $row['imagem_path'],
        'tipo' => $row['tipo'],
        'criado_em' => $row['criado_em'],
        'tema' => $row['tema'],
        'reacao' => $row['reacao'],
        'visto' => (bool) $row['visto']
    ];
}

echo json_encode($cartas, JSON_UNESCAPED_UNICODE);
