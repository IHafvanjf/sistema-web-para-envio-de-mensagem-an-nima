<?php
session_start();
require_once 'conexao.php';

if (!isset($_SESSION['id']) || !isset($_POST['id'])) {
    echo json_encode(['success' => false]);
    exit;
}

$carta_id = intval($_POST['id']);

// Atualizar o campo 'visto'
$stmt = $conn->prepare("UPDATE cartas SET visto = 1 WHERE id = ?");
$stmt->bind_param("i", $carta_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
