<?php
session_start();

// Salva os dados da carta recebida via POST
$_SESSION['carta'] = [
    'tipo' => $_POST['tipo'],
    'destinatario' => $_POST['destinatario'],
    'mensagem' => $_POST['mensagem'],
    'imagem' => $_POST['imagem'], // pode ser base64 ou nome de arquivo salvo
    'tema' => $_POST['tema']
];

// Redireciona para o checkout
header("Location: checkout/index.html");
exit();
