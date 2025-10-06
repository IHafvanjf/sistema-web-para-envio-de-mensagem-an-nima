<?php
header("Content-Type: application/json");
$host = 'localhost';
$db   = 'u953537988_terceirao';
$user = 'u953537988_terceirao';
$pass = '13579012Victor)';
$conn = new mysqli($host, $user, $pass, $db);

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$codigo = trim($data['codigo'] ?? '');

if (!$email || !$codigo) {
  http_response_code(400);
  echo json_encode(['erro' => 'Informe o e-mail e código']);
  exit;
}

$sql = "SELECT codigo_recuperacao, codigo_expira_em FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || $user['codigo_recuperacao'] !== $codigo) {
  http_response_code(401);
  echo json_encode(['erro' => 'Código inválido']);
  exit;
}

if (strtotime($user['codigo_expira_em']) < time()) {
  http_response_code(410);
  echo json_encode(['erro' => 'Código expirado']);
  exit;
}

echo json_encode(['mensagem' => 'Código válido']);
?>
