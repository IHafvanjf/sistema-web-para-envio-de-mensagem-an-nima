<?php
require '../vendor/autoload.php'; // <-- isso carrega tudo via Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$host = 'localhost';
$db   = 'u953537988_terceirao';
$user = 'u953537988_terceirao';
$pass = '13579012Victor)';
$conn = new mysqli($host, $user, $pass, $db);

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');

if (!$email) {
  http_response_code(400);
  echo json_encode(['erro' => 'Informe o e-mail']);
  exit;
}

// Verifica se existe
$sql = "SELECT id FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  http_response_code(404);
  echo json_encode(['erro' => 'E-mail não encontrado']);
  exit;
}

// Gera código
$codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
$expira = date('Y-m-d H:i:s', strtotime('+10 minutes'));

// Salva no banco
$update = $conn->prepare("UPDATE usuarios SET codigo_recuperacao = ?, codigo_expira_em = ? WHERE email = ?");
$update->bind_param("sss", $codigo, $expira, $email);
$update->execute();

// Configura PHPMailer
$mail = new PHPMailer(true);
try {
  $mail->isSMTP();
  $mail->Host       = 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'pedrolhf06@gmail.com'; // <-- SEU GMAIL
  $mail->Password   = 'hbzc bmix julz ausn';        // <-- SENHA DE APP
  $mail->SMTPSecure = 'tls';
  $mail->Port       = 587;

  $mail->setFrom('pedrolhf06@gmail.com', 'Correio Elegante');
  $mail->addAddress($email);
  $mail->isHTML(true); // ← isso ativa o modo HTML no corpo

$mail->Subject = '=?UTF-8?B?' . base64_encode('Código de Recuperação - Correio Elegante') . '?=';
$mail->Body = '
  <div style="font-family: Poppins, Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #eee; background: #f9f9f9;">
    <h2 style="text-align: center; color: #6b1d87;">Correio Elegante 💌</h2>
    <p style="font-size: 16px; color: #333;">Olá! Recebemos uma solicitação de recuperação de senha para seu e-mail.</p>
    <p style="font-size: 16px; color: #333;">Use o código abaixo para redefinir sua senha:</p>
    <div style="font-size: 24px; font-weight: bold; color: #6b1d87; text-align: center; margin: 20px 0;">' . $codigo . '</div>
    <p style="font-size: 14px; color: #666;">Este código é válido por 10 minutos. Caso você não tenha solicitado, ignore este e-mail.</p>
    <br>
    <p style="font-size: 12px; color: #aaa; text-align: center;">Correio Elegante - Terceirão 2024</p>
  </div>
';


  $mail->send();
  echo json_encode(['mensagem' => 'Código enviado com sucesso para seu e-mail']);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['erro' => 'Erro ao enviar: ' . $mail->ErrorInfo]);
}
?>
