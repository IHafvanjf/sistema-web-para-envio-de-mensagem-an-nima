<?php
header("Content-Type: application/json");
$host = 'localhost';
$db   = 'u953537988_terceirao';
$user = 'u953537988_terceirao';
$pass = '13579012Victor)';
$conn = new mysqli($host, $user, $pass, $db);

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$novaSenha = trim($data['senha'] ?? '');

if (!$email || !$novaSenha) {
  http_response_code(400);
  echo json_encode(['erro' => 'Dados incompletos']);
  exit;
}

$hash = password_hash($novaSenha, PASSWORD_DEFAULT);

$sql = "UPDATE usuarios SET senha = ?, codigo_recuperacao = NULL, codigo_expira_em = NULL WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $hash, $email);
$stmt->execute();

echo json_encode(['mensagem' => 'Senha redefinida com sucesso']);
?>
