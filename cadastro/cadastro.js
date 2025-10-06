document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim(); 
  const turma = document.getElementById("turma").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    const resposta = await fetch("cadastro_login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, turma, senha }) 
    });

    const texto = await resposta.text();
    let resultado;

    try {
      resultado = JSON.parse(texto);
    } catch (e) {
      console.error("Resposta inválida:", texto);
      mostrarToast("Erro!", "Resposta inesperada do servidor.", true);
      return;
    }

    if (resposta.ok) {
      mostrarToast("Sucesso!", resultado.mensagem, false);
      spawnEmojiRain();
      setTimeout(() => {
        window.location.href = "../index.php";
      }, 2000);
    } else {
      console.warn("Erro recebido:", resultado);
      mostrarToast("Erro!", resultado?.erro || "Ocorreu um erro.", true);
    }

  } catch (erro) {
    console.error("Erro de conexão:", erro);
    mostrarToast("Erro!", "Não foi possível conectar ao servidor.", true);
  }
});


  function mostrarToast(titulo, mensagem, erro = false) {
    toast.classList.remove("erro", "mostrar");
    toast.querySelector(".toast-title").textContent = titulo;
    toast.querySelector(".toast-body").textContent = mensagem;

    if (erro) toast.classList.add("erro");
    toast.classList.add("mostrar");

    setTimeout(() => toast.classList.remove("mostrar"), 4000);
  }

  function spawnEmojiRain() {
    const emojis = ['🤍','❤️','💜'];
    const count = 30;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'emoji';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = (Math.random() * 100) + 'vw';
      el.style.animationDelay = (Math.random() * 1.5) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  }
});
