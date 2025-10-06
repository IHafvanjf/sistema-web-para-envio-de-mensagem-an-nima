<?php
session_start();
header("Content-Type: application/json");

$host = 'localhost';
$db   = 'u953537988_terceirao';
$user = 'u953537988_terceirao';
$pass = '13579012Victor)';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(['erro' => 'Erro na conexão com o banco']);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['nome'], $data['email'], $data['turma'], $data['senha'])) {
  http_response_code(400);
  echo json_encode(['erro' => 'Preencha todos os campos']);
  exit;
}

$nome = trim($data['nome']);
$email = trim($data['email']);
$turma = trim($data['turma']);
$senha = trim($data['senha']);

// Verifica se o usuário já existe (por nome, email e turma)
$sql = "SELECT * FROM usuarios WHERE nome = ? AND email = ? AND turma = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $nome, $email, $turma);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  // Login
  $usuario = $result->fetch_assoc();
  if (password_verify($senha, $usuario['senha'])) {
    $_SESSION['id'] = $usuario['id'];
    $_SESSION['nome'] = $usuario['nome'];
    $_SESSION['turma'] = $usuario['turma'];
    echo json_encode([
      'mensagem' => 'Login realizado com sucesso',
      'id' => $usuario['id'],
      'nome' => $usuario['nome']
    ]);
  } else {
    http_response_code(401);
    echo json_encode(['erro' => 'Senha incorreta']);
  }
} else {
  // Cadastro
  $hash = password_hash($senha, PASSWORD_DEFAULT);
  $insert = $conn->prepare("INSERT INTO usuarios (nome, email, turma, senha) VALUES (?, ?, ?, ?)");
  $insert->bind_param("ssss", $nome, $email, $turma, $hash);
  if ($insert->execute()) {
    $novo_id = $conn->insert_id;
    $_SESSION['id'] = $novo_id;
    $_SESSION['nome'] = $nome;
    $_SESSION['turma'] = $turma;
    echo json_encode([
      'mensagem' => 'Cadastro realizado com sucesso',
      'id' => $novo_id,
      'nome' => $nome
    ]);
  } else {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao cadastrar']);
  }
}
?>
