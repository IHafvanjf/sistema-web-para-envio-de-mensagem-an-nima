<?php
session_start();
if (!isset($_SESSION['id'])) {
  echo json_encode(['erro' => 'Não autorizado']);
  exit;
}

if (!isset($_GET['id'])) {
  echo json_encode(['erro' => 'ID inválido']);
  exit;
}

$id = intval($_GET['id']);
include "conexao.php"; 

$stmt = $conn->prepare("SELECT * FROM cartas WHERE id = ? AND remetente_id = ?");
$stmt->bind_param("ii", $id, $_SESSION['id']);
$stmt->execute();
$result = $stmt->get_result();
$carta = $result->fetch_assoc();

echo json_encode($carta);
