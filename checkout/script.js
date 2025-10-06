    async function gerarPIX() {
      const dados = JSON.parse(sessionStorage.getItem("carta_dados") || "{}");

      if (!dados.destinatario || !dados.mensagem) {
        alert("Dados da carta não encontrados.");
        window.location.href = "../index.php";
        return;
      }

      const jaExiste = JSON.parse(sessionStorage.getItem("pix_dados") || "null");
      if (jaExiste && jaExiste.payment_id && jaExiste.chave_pix && jaExiste.qr_code_base64) {
        exibirPIX(jaExiste);
        iniciarVerificacaoPagamento(jaExiste.payment_id);
        return;
      }

      const formData = new FormData();
      formData.append("destinatario", dados.destinatario);
      formData.append("mensagem", dados.mensagem);
      formData.append("tipo", dados.tipo);
      formData.append("tema", dados.tema);

      try {
        const res = await fetch("gerar_pagamento_pix.php", {
          method: "POST",
          body: formData
        });
        const resultado = await res.json();

        if (!resultado.qr_code_base64 || !resultado.chave_pix || !resultado.payment_id) {
          alert("Erro ao gerar QR Code");
          return;
        }

        sessionStorage.setItem("pix_dados", JSON.stringify(resultado));
        exibirPIX(resultado);
        iniciarVerificacaoPagamento(resultado.payment_id);
      } catch (erro) {
        alert("Erro ao conectar com o servidor.");
        console.error(erro);
      }
    }

    function exibirPIX(dados) {
      document.getElementById("qrCodeContainer").innerHTML = `
        <img src="data:image/jpeg;base64,${dados.qr_code_base64}" />
      `;
      const btnCopy = document.getElementById("btnCopy");
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(dados.chave_pix);
        btnCopy.innerText = "Código copiado!";
        setTimeout(() => btnCopy.innerText = "Copiar código PIX", 3000);
      };
      atualizarStatusPagamento("pendente");
    }

    function atualizarStatusPagamento(status) {
      const statusEl = document.getElementById("statusPagamento");
      if (!statusEl) return;

      if (status === "aprovado") {
        statusEl.textContent = "✅ Pagamento aprovado!";
        statusEl.style.color = "#28a745";
      } else if (status === "pendente") {
        statusEl.textContent = "⏳ Aguardando pagamento...";
        statusEl.style.color = "#3A0CA3";
      } else {
        statusEl.textContent = "❌ Pagamento não localizado";
        statusEl.style.color = "#dc3545";
      }
    }

function iniciarVerificacaoPagamento(payment_id) {
  const intervalo = setInterval(async () => {
    try {
      const res = await fetch("verificar_pagamento.php?payment_id=" + payment_id);
      const resultado = await res.json();

      if (resultado.status === "aprovado") {
        atualizarStatusPagamento("aprovado");
        clearInterval(intervalo);

        // Limpa sessionStorage após pagamento
        sessionStorage.removeItem("pix_dados");
        sessionStorage.removeItem("carta_dados");

        // Aguarda 3 segundos e volta para página inicial
        setTimeout(() => {
          window.location.href = "../index.php";
        }, 3000);
      } else if (resultado.status === "pendente") {
        atualizarStatusPagamento("pendente");
      } else {
        atualizarStatusPagamento("rejeitado");
        clearInterval(intervalo);
      }
    } catch (erro) {
      console.warn("Erro ao verificar pagamento:", erro);
    }
  }, 10000); // Verifica a cada 10 segundos
}


    gerarPIX();