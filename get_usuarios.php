<?php
// get_usuarios.php
include 'conexao.php'; // conexão com o banco

$sql = "SELECT nome, turma FROM usuarios ORDER BY nome ASC";
$result = $conn->query($sql);

$usuarios = [];
while ($row = $result->fetch_assoc()) {
  $usuarios[] = [
    'nome' => $row['nome'],
    'turma' => $row['turma']
  ];
}

header('Content-Type: application/json');
echo json_encode($usuarios);
