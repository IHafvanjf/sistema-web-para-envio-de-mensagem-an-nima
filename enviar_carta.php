<?php
include 'conexao.php';
session_start(); // adicione no topo
if (!isset($_SESSION['id'])) {
  http_response_code(403);
  echo "Erro: usuário não autenticado.";
  exit;
}

$remetente_id = $_SESSION['id']; // força para inteiro
$destinatario = $_POST['destinatario'];
$mensagem = $_POST['mensagem'];
$tipo = $_POST['tipo'];
$tema = $_POST['tema'];
$imagem_path = null;

if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] == 0) {
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) mkdir($upload_dir);
    
    $filename = uniqid() . "_" . basename($_FILES['imagem']['name']);
    $target_file = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['imagem']['tmp_name'], $target_file)) {
        $imagem_path = $target_file;
    }
}

$stmt = $conn->prepare("INSERT INTO cartas (remetente_id, destinatario_nome, mensagem, imagem_path, tipo, tema) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssss", $remetente_id, $destinatario, $mensagem, $imagem_path, $tipo, $tema);

if ($stmt->execute()) {
    echo "Carta enviada com sucesso!";
} else {
    echo "Erro: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
