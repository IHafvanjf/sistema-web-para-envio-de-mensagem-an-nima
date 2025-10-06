<?php
session_start();

// Remove todas as variáveis da sessão
$_SESSION = [];

// Destroi a sessão
session_destroy();

// Redireciona para a página de cadastro
header("Location: cadastro/index.html");
exit;
?>
