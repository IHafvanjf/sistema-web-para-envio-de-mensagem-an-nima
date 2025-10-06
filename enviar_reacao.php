<?php
session_start();
require_once 'conexao.php';

if (!isset($_SESSION['id']) || !isset($_POST['id']) || !isset($_POST['reacao'])) {
    echo json_encode(['success' => false]);
    exit;
}

$carta_id = intval($_POST['id']);
$reacao = $_POST['reacao'];

// Atualizar o campo 'reacao'
$stmt = $conn->prepare("UPDATE cartas SET reacao = ? WHERE id = ?");
$stmt->bind_param("si", $reacao, $carta_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
