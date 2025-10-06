document.addEventListener('DOMContentLoaded', () => {
  const emailStep = document.querySelector('.step-email');
  const codeStep = document.querySelector('.step-code');
  const passStep = document.querySelector('.step-new-password');
  const msgBox = document.getElementById('msg');

  let userEmail = '';

  function mostrarMensagem(texto, tipo = 'sucesso') {
    msgBox.textContent = texto;
    msgBox.className = 'mensagem ' + tipo;
    msgBox.style.display = 'block';
    setTimeout(() => {
      msgBox.style.display = 'none';
    }, 4000);
  }

  const emailBtn = document.getElementById('emailNext');

emailBtn.addEventListener('click', async () => {
  const email = document.getElementById('recoveryEmail').value.trim();
  if (!email) {
    mostrarMensagem('Digite seu e-mail', 'erro');
    return;
  }

  userEmail = email;

  //  Ativa feedback de carregamento
  emailBtn.disabled = true;
  const originalText = emailBtn.textContent;
  emailBtn.textContent = 'Enviando...';

  try {
    const res = await fetch('enviar_codigo.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email })
    });

    const dados = await res.json();
    if (res.ok) {
      mostrarMensagem(dados.mensagem, 'sucesso');
      emailStep.classList.remove('active');
      codeStep.classList.add('active');
    } else {
      mostrarMensagem(dados.erro || 'Erro ao enviar código', 'erro');
    }
  } catch (err) {
    mostrarMensagem('Erro de conexão com o servidor', 'erro');
  }

  //  Restaura botão
  emailBtn.disabled = false;
  emailBtn.textContent = originalText;
});


  document.getElementById('codeNext').addEventListener('click', async () => {
    const codigo = document.getElementById('verificationCode').value.trim();
    if (!codigo) {
      mostrarMensagem('Digite o código', 'erro');
      return;
    }

    try {
      const res = await fetch('verificar_codigo.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: userEmail, codigo })
      });

      const dados = await res.json();
      if (res.ok) {
        mostrarMensagem('Código verificado com sucesso', 'sucesso');
        codeStep.classList.remove('active');
        passStep.classList.add('active');
      } else {
        mostrarMensagem(dados.erro || 'Código inválido', 'erro');
      }
    } catch (err) {
      mostrarMensagem('Erro ao verificar o código', 'erro');
    }
  });

  document.getElementById('passwordSubmit').addEventListener('click', async () => {
    const senha = document.getElementById('newPassword').value.trim();
    const confirmar = document.getElementById('confirmPassword').value.trim();

    if (!senha || !confirmar) {
      mostrarMensagem('Preencha os dois campos', 'erro');
      return;
    }

    if (senha !== confirmar) {
      mostrarMensagem('As senhas não coincidem', 'erro');
      return;
    }

    try {
      const res = await fetch('redefinir_senha.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: userEmail, senha })
      });

      const dados = await res.json();
      if (res.ok) {
        mostrarMensagem(dados.mensagem || 'Senha redefinida com sucesso', 'sucesso');
        setTimeout(() => {
          window.location.href = '../index.php';
        }, 2000);
      } else {
        mostrarMensagem(dados.erro || 'Erro ao redefinir a senha', 'erro');
      }
    } catch (err) {
      mostrarMensagem('Erro ao conectar com o servidor', 'erro');
    }
  });
});
