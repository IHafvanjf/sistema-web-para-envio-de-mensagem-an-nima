// script.js

alert("oi")

let selectedType = 'anonimo';

document.addEventListener('DOMContentLoaded', function() {

  const payBtn = document.getElementById('payBtn');
  const confirmThemeButton = document.getElementById('confirmThemeBtn');
  const previewModal = document.getElementById('previewModal');
  const viewContainer = document.getElementById('viewContainer');
  const btnSend = document.querySelector('.btn-send');
  const btnHome = document.querySelector('.btn-home');
  const btnReceive = document.querySelector('.btn-receive');
  const backButton = document.getElementById('backButton');
  const progressContainer = document.getElementById('progressContainer');
  const formStepsWrap = document.getElementById('formSteps');
  const messageForm = document.getElementById('messageForm');
  const progressLine = document.querySelector('.progress-line');

  if (payBtn) {
    payBtn.style.display = 'none';
  }

  const initMain = document.querySelector('.carousel__item--main');
  if (initMain) {
    initMain.classList.add('selected');
  }

  const loader = document.getElementById('loader');
  if (loader) {
    const svgLine = loader.querySelector('#line');
    if (svgLine) {
      svgLine.addEventListener('animationend', function() {
        loader.classList.add('hide');
        loader.addEventListener('transitionend', function() {
          loader.style.display = 'none';
          const content = document.getElementById('content');
          if (content) {
            content.style.display = 'flex';
            content.style.justifyContent = 'center';
            content.style.alignItems = 'center';
            document.body.style.overflow = 'auto';
          }
        });
      });
    }
  }

  let slides = document.querySelectorAll('.slide');
  let dots = document.querySelectorAll('.dot');
  let prevButton = document.querySelector('.prev');
  let nextButton = document.querySelector('.next');
  let currentSlide = 0;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  if (prevButton && nextButton && dots.length > 0) {
    prevButton.addEventListener('click', function() {
      goToSlide(currentSlide - 1);
    });
    nextButton.addEventListener('click', function() {
      goToSlide(currentSlide + 1);
    });
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        goToSlide(index);
      });
    });
  }


  if (viewContainer && btnSend && btnHome && btnReceive && backButton) {
    btnSend.addEventListener('click', function () {
      if (usuarios.length === 0) {
        fetch('get_usuarios.php')
          .then(res => res.json())
          .then(data => usuarios = data)
          .catch(err => console.error('Erro ao carregar usuários:', err));
      }
      viewContainer.classList.remove('show-receive');
      viewContainer.classList.add('show-form');
      selectedType = 'anonimo';
      setFirstStepType('anonimo');
      progressContainer.style.display = 'block';
      formStepsWrap.style.display = 'block';
      showStep(1);
    });

    btnHome.addEventListener('click', function() {
      viewContainer.classList.remove('show-form');
      viewContainer.classList.remove('show-receive');
    });

    btnReceive.addEventListener('click', function () {
      if (document.readyState === "complete") {
        viewContainer.classList.remove('show-form');
        viewContainer.classList.add('show-receive');
        carregarRecebidos();
      } else {
        window.addEventListener('load', function () {
          viewContainer.classList.remove('show-form');
          viewContainer.classList.add('show-receive');
          carregarRecebidos();
        });
      }
    });

  }

  let formSteps = formStepsWrap
    ? Array.from(formStepsWrap.querySelectorAll('.form-step'))
    : [];
  let progressSteps = Array.from(document.querySelectorAll('.progress-step'));
  const destProgressStep = document.querySelector('.progress-step[data-step="2"]');
  const destFormStep = document.querySelector('.form-step[data-step="2"]');
  let currentStep = 1;
  const maxSteps = 4;

  function updateProgressBar(step) {
    progressSteps.forEach(function(ps) {
      const stepNumber = Number(ps.dataset.step);
      ps.classList.toggle('active', stepNumber === step);
      ps.classList.toggle('completed', stepNumber < step);
    });
    const percentage = ((step - 1) / (maxSteps - 1)) * 100;
    if (progressLine) {
      progressLine.style.setProperty('--progress', percentage + '%');
    }
  }

  const destinatarioInput = document.getElementById('destinatario');
const destinatarioFinalInput = document.getElementById('destinatarioFinal');
const searchResultsContainer = document.querySelector('.search-results');
let usuarios = [];

if (destinatarioInput && searchResultsContainer) {
  fetch('get_usuarios.php')
    .then(res => res.json())
    .then(data => {
      usuarios = data;
    })
    .catch(err => console.error('Erro ao carregar usuários:', err));

  // Escuta digitação no input
  destinatarioInput.addEventListener('input', () => {
    const termo = destinatarioInput.value.toLowerCase();
    searchResultsContainer.innerHTML = '';

    if (termo.length < 2) {
      searchResultsContainer.classList.remove('active');
      return;
    }

    const filtrados = usuarios.filter(user =>
      user.nome.toLowerCase().includes(termo) ||
      user.turma.toLowerCase().includes(termo)
    );

    if (filtrados.length === 0) {
      searchResultsContainer.innerHTML = '<div class="result-item">Nenhum resultado</div>';
    } else {
      filtrados.forEach(user => {
        const div = document.createElement('div');
        div.classList.add('result-item');
        div.innerHTML = `
          <span>${user.nome} (Turma ${user.turma})</span>
          <button type="button" class="send-to-btn" data-nome="${user.nome}">Enviar</button>
        `;
        searchResultsContainer.appendChild(div);
      });
    }

    searchResultsContainer.classList.add('active');
  });

  // Clique em um resultado
  searchResultsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('send-to-btn')) {
      const nome = e.target.dataset.nome;
      destinatarioFinalInput.value = nome;
      destinatarioInput.value = nome;
      searchResultsContainer.classList.remove('active');
      showStep(3);
    }
  });
}

  function showStep(step) {
    formSteps.forEach(function(f) {
      f.classList.toggle('active', Number(f.dataset.step) === step);
    });
    

    if (step === 3) {
      const photoGroup = document.getElementById('imagem')?.parentElement;
      if (photoGroup) {
        photoGroup.style.display = selectedType === 'anonimo' ? 'none' : '';
      }
    }
    if (confirmThemeButton) {
      confirmThemeButton.style.display = step === 4 ? 'block' : 'none';
    }
    updateProgressBar(step);
    currentStep = step;
  }

  function setFirstStepType(type) {
    selectedType = type;
    const iconElement  = document.querySelector('.progress-step[data-step="1"] .step-icon');
    const labelElement = document.querySelector('.progress-step[data-step="1"] .step-label');
    if (!iconElement || !labelElement) return;

    if (type === 'anonimo') {
      iconElement.innerHTML  = '<i class="fas fa-user-secret"></i>';
      labelElement.textContent = 'Anônimo';
    } else {
      iconElement.innerHTML  = '<i class="fas fa-user-friends"></i>';
      labelElement.textContent = 'Carta';
    }
  }

formStepsWrap.addEventListener('click', function(event) {
  const target = event.target;
  if (target.classList.contains('select-btn') &&
     (target.dataset.type === 'anonimo' || target.dataset.type === 'carta')) {
    // tipo genérico para ambos
    selectedType = target.dataset.type;
    setFirstStepType(selectedType);

    progressContainer.style.display = 'block';
    formStepsWrap.style.display = 'block';

    showStep(2);

    // só abrir automaticamente a busca para anonimo
    if (selectedType === 'anonimo') {
      setTimeout(() => {
        document.querySelector('.search-results')?.classList.add('active');
      }, 300);
    }
  }
});


  if (messageForm) {
    messageForm.addEventListener('submit', function(event) {
      event.preventDefault();
      showStep(4);
    });
  }

  if (progressLine) {
    progressLine.style.setProperty('--progress', '0%');
  }


  const carouselItems = document.querySelectorAll(
    '.form-step[data-step="4"] .carousel__item'
  );
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');

  function rotateCarousel(direction) {
    const mainItem = document.querySelector('.carousel__item--main');
    const leftItem = document.querySelector('.carousel__item--left');
    const rightItem = document.querySelector('.carousel__item--right');

    carouselItems.forEach(item => {
      item.className = 'carousel__item ' + item.id;
    });

    if (direction === 'next') {
      const newMain = rightItem;
      const newLeft = mainItem;
      const idx = Array.from(carouselItems).indexOf(rightItem);
      const newRight = carouselItems[idx + 1] || carouselItems[0];
      newMain.classList.add('carousel__item--main');
      newLeft.classList.add('carousel__item--left');
      newRight.classList.add('carousel__item--right');
    } else {
      const newMain = leftItem;
      const newRight = mainItem;
      const idx = Array.from(carouselItems).indexOf(leftItem);
      const newLeft = carouselItems[idx - 1] || carouselItems[carouselItems.length - 1];
      newMain.classList.add('carousel__item--main');
      newRight.classList.add('carousel__item--right');
      newLeft.classList.add('carousel__item--left');
    }
  }

  if (rightBtn && leftBtn) {
    rightBtn.addEventListener('click', () => rotateCarousel('next'));
    leftBtn.addEventListener('click', () => rotateCarousel('prev'));
  }

  const imageInputElement = document.getElementById('imagem');
  const previewContainer = document.getElementById('previewContainer');
  if (imageInputElement && previewContainer) {
    imageInputElement.addEventListener('change', function(event) {
      previewContainer.innerHTML = '';
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const imgTag = document.createElement('img');
        imgTag.src = URL.createObjectURL(file);
        imgTag.alt = 'Preview da foto';
        imgTag.style.maxWidth = '100%';
        imgTag.style.maxHeight = '200px';
        imgTag.style.borderRadius = '8px';
        previewContainer.appendChild(imgTag);
      }
    });
  }

  if (confirmThemeButton) {
    confirmThemeButton.addEventListener('click', function() {
      const mainItem = document.querySelector('.carousel__item--main');
      const backgroundStyle = window.getComputedStyle(mainItem).background;
      const mensagemTexto = document.getElementById('mensagem')?.value || '';
      const partes = mensagemTexto.split('\n');
      const firstPart = partes[0] || '';
      const secondPart = partes.slice(1).join('\n') || '';

      const cardPreview = document.getElementById('cardPreview');
      const imagePreview = document.getElementById('imagePreview');

      cardPreview.innerHTML = '';
      imagePreview.innerHTML = '';

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.style.background = backgroundStyle;
      cardDiv.style.position = 'relative';
      cardDiv.style.width = '100%';
      cardDiv.style.height = '100%';
      cardDiv.style.display = 'flex';
      cardDiv.style.flexDirection = 'column';
      cardDiv.style.justifyContent = 'center';
      cardDiv.style.alignItems = 'center';
      cardDiv.style.padding = '30px';
      cardDiv.style.boxSizing = 'border-box';
      cardDiv.style.overflow = 'auto';

      const firstText = document.createElement('div');
      firstText.textContent = firstPart;
      firstText.style.color = 'white';
      firstText.style.fontSize = '1.4rem';
      firstText.style.textAlign = 'center';
      firstText.style.marginBottom = '20px';
      firstText.style.whiteSpace = 'pre-wrap';
      firstText.style.maxWidth = '100%';
      firstText.style.wordWrap = 'break-word';

      const secondText = document.createElement('div');
      secondText.textContent = secondPart;
      secondText.style.color = 'white';
      secondText.style.fontSize = '1.1rem';
      secondText.style.textAlign = 'center';
      secondText.style.whiteSpace = 'pre-wrap';
      secondText.style.maxWidth = '100%';
      secondText.style.wordWrap = 'break-word';

      cardDiv.appendChild(firstText);
      cardDiv.appendChild(secondText);

      const imagemFile = document.getElementById('imagem')?.files[0];
      if (selectedType === 'carta' && imagemFile) {
        const imgEl = document.createElement('img');
        imgEl.src = URL.createObjectURL(imagemFile);
        imgEl.alt = 'Foto adicionada';
        imgEl.classList.add('card-top-image');
        cardDiv.insertBefore(imgEl, firstText);
      }

      cardPreview.appendChild(cardDiv);

      const reactionCont = previewModal.querySelector('.reaction-container');
      if (reactionCont) {
        reactionCont.style.display = 'none';
      }

      previewModal.style.display = 'flex';
      if (payBtn) {
        payBtn.style.display = 'inline-flex';
      }
    });
  }

  if (payBtn) {
payBtn.addEventListener('click', () => {
  sessionStorage.setItem("carta_dados", JSON.stringify({
    destinatario: destinatarioFinalInput.value,
    mensagem: document.getElementById("mensagem").value,
    tipo: selectedType,
    tema: document.querySelector('.carousel__item--main')?.id || 'padrao'
    // imagem opcional: encode se quiser
  }));

  window.location.href = "checkout/index.html";
});

  }


  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('open-btn')) {
      event.preventDefault();
      const link = event.target.closest('.item-link');
      if (!link) {
        return;
      }

      const cartaId = link.getAttribute('data-id');
      fetch(`get_carta.php?id=${encodeURIComponent(cartaId)}`)
        .then(response => response.json())
        .then(carta => {
          if (!carta || carta.erro) {
            return;
          }
          const cardPreview = document.getElementById('cardPreview');
          const messagePreview = document.getElementById('messagePreview');
          const imagePreview = document.getElementById('imagePreview');

          cardPreview.innerHTML = '';
          messagePreview.innerHTML = '';
          imagePreview.innerHTML = '';

          const cardDiv = document.createElement('div');
          cardDiv.className = 'card';
          cardDiv.style.background = getTemaBackground(carta.tema);
          cardDiv.style.display = 'flex';
          cardDiv.style.flexDirection = 'column';
          cardDiv.style.alignItems = 'center';
          cardDiv.style.justifyContent = 'center';
          cardDiv.style.padding = '30px';
          cardDiv.style.color = 'white';
          cardDiv.style.textAlign = 'center';
          cardDiv.style.boxSizing = 'border-box';

          const msgDiv = document.createElement('div');
          msgDiv.textContent = carta.mensagem;
          msgDiv.style.whiteSpace = 'pre-wrap';
          msgDiv.style.fontSize = '1.2rem';

          cardDiv.appendChild(msgDiv);
          if (carta.imagem) {
            const img = document.createElement('img');
            img.src = `uploads/${carta.imagem}`;
            img.alt = 'Foto';
            img.className = 'card-top-image';
            cardDiv.insertBefore(img, msgDiv);
          }
          cardPreview.appendChild(cardDiv);

          previewModal.style.display = 'flex';
          if (payBtn) {
            payBtn.style.display = 'none';
          }
          const reactionCont = previewModal.querySelector('.reaction-container');
          if (reactionCont) {
            reactionCont.style.display = 'flex';
          }
        })
        .catch(err => {
          console.error('Erro ao buscar carta enviada:', err);
        });
    }
  });

function carregarCartasUnificadas() {
  fetch('listar_enviadas.php')
    .then(res => res.json())
    .then(data => {
      // Cartas enviadas
      const listaEnvios = document.querySelector('.item-list');
      listaEnvios.innerHTML = '';
      if (!data.enviadas || data.enviadas.length === 0) {
        listaEnvios.innerHTML = `
          <li class="empty-state">
            <p class="empty-state__message">
              Você ainda não enviou nenhuma carta.<br>
              Que tal enviar a primeira agora?
            </p>
            <img src="img/cupidoTriste.png" alt="Coração estilizado" class="empty-state__image" />
            <button id="startSend" class="submit-btn" style="margin-top:1rem; max-width:200px;">
              Enviar Carta
            </button>
          </li>
        `;
        document.getElementById('startSend')?.addEventListener('click', () => btnSend.click());
      } else {
        data.enviadas.forEach((carta, index) => {
          const li = document.createElement('li');
          li.className = 'item';
          li.innerHTML = `
            <a href="#" class="item-link"
               data-id="${encodeURIComponent(carta.id)}"
               data-tipo="${carta.tipo}"
               data-tema="${carta.tema}">
              <img src="img/iconeCarta.png" alt="Carta" class="letter-icon" />
              <span class="item-title">
                ${carta.tipo === 'carta' ? 'Carta' : 'Correio'} ${index + 1}
              </span>
              <button class="open-btn">Abrir</button>
            </a>
          `;
          listaEnvios.appendChild(li);
        });
      }

      const listaRecebidas = document.querySelector('.received-list');
      listaRecebidas.innerHTML = '';
      if (!data.recebidas || data.recebidas.length === 0) {
        listaRecebidas.innerHTML = `<li class="empty-state"><p>Você ainda não recebeu nenhuma carta.</p></li>`;
      } else {
        data.recebidas.forEach(carta => {
          const li = document.createElement('li');
          li.className = 'received-item';
          const vistoStatus = carta.visto ? '👁️ Visto' : '🕵️‍♂️ Não Visto';
          const reacaoStatus = carta.reacao ? `💬 Reação: ${carta.reacao}` : '';
          li.innerHTML = `
            <a href="#" class="item-link"
               data-id="${encodeURIComponent(carta.id)}"
               data-msg="${carta.mensagem}"
               data-tema="${carta.tema}"
               data-tipo="${carta.tipo}">
              <span>${carta.tipo === 'anonimo' ? 'Carta Anônima' : 'Carta Identificada'}</span><br>
              <small class="visto-status">${vistoStatus}</small><br>
              <small>${reacaoStatus}</small><br>
              <button class="open-btn">Abrir</button>
            </a>
          `;
          listaRecebidas.appendChild(li);
        });

        document.querySelectorAll('.received-item .open-btn').forEach(button => {
          button.addEventListener('click', function(event) {
            event.preventDefault();
            const link = event.target.closest('.item-link');
            const cartaId = link.getAttribute('data-id');
            const mensagem = link.getAttribute('data-msg');
            const tema = link.getAttribute('data-tema');

            fetch('marcar_visto.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id=${encodeURIComponent(cartaId)}`
            }).then(resp => resp.json()).then(res => {
              if (res.success) {
                link.querySelector('.visto-status').textContent = '👁️ Visto';
              }
            });

            const cardPreview = document.getElementById('cardPreview');
            const messagePreview = document.getElementById('messagePreview');
            cardPreview.innerHTML = '';
            messagePreview.innerHTML = '';
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.style.background = getTemaBackground(tema);
            cardDiv.style.display = 'flex';
            cardDiv.style.flexDirection = 'column';
            cardDiv.style.alignItems = 'center';
            cardDiv.style.justifyContent = 'center';
            cardDiv.style.padding = '30px';
            cardDiv.style.color = 'white';
            cardDiv.style.textAlign = 'center';
            cardDiv.style.boxSizing = 'border-box';
            const textDiv = document.createElement('div');
            textDiv.textContent = mensagem;
            textDiv.style.whiteSpace = 'pre-wrap';
            textDiv.style.fontSize = '1.2rem';
            cardDiv.appendChild(textDiv);
            cardPreview.appendChild(cardDiv);
            previewModal.style.display = 'flex';
            if (payBtn) payBtn.style.display = 'none';
            const reactionCont = previewModal.querySelector('.reaction-container');
            if (reactionCont) reactionCont.style.display = 'flex';
          });
        });
      }
    })
    .catch(err => console.error('Erro ao carregar cartas:', err));
}

let isLoadingRecebidos = false;

function carregarRecebidos() {
  if (isLoadingRecebidos) return;
  isLoadingRecebidos = true;

  fetch('listar_recebidas.php')
    .then(res => res.json())
    .then(data => {
      const lista = document.querySelector('.received-list');
      lista.innerHTML = '';
      if (!data || data.length === 0) {
        lista.innerHTML = `<li class="empty-state"><p>Você ainda não recebeu nenhuma carta.</p></li>`;
        isLoadingRecebidos = false;
        return;
      }
      data.forEach(carta => {
        const li = document.createElement('li');
        li.className = 'received-item';
        const vistoStatus = carta.visto ? '👁️ Visto' : '🕵️‍♂️ Não Visto';
        const reacaoStatus = carta.reacao ? `💬 Reação: ${carta.reacao}` : '';
        li.innerHTML = `
          <a href="#" class="item-link"
             data-id="${encodeURIComponent(carta.id)}"
             data-msg="${carta.mensagem}"
             data-tema="${carta.tema}"
             data-tipo="${carta.tipo}">
            <span>${carta.tipo === 'anonimo' ? 'Carta Anônima' : 'Carta Identificada'}</span><br>
            <small class="visto-status">${vistoStatus}</small><br>
            <small>${reacaoStatus}</small><br>
            <button class="open-btn">Abrir</button>
          </a>
        `;
        lista.appendChild(li);
      });

      document.querySelectorAll('.received-item .open-btn').forEach(button => {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          const link = event.target.closest('.item-link');
          const cartaId = link.getAttribute('data-id');
          const mensagem = link.getAttribute('data-msg');
          const tema = link.getAttribute('data-tema');

          fetch('marcar_visto.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${encodeURIComponent(cartaId)}`
          }).then(resp => resp.json()).then(res => {
            if (res.success) {
              link.querySelector('.visto-status').textContent = '👁️ Visto';
            }
          });

          const cardPreview = document.getElementById('cardPreview');
          const messagePreview = document.getElementById('messagePreview');
          cardPreview.innerHTML = '';
          messagePreview.innerHTML = '';
          const cardDiv = document.createElement('div');
          cardDiv.className = 'card';
          cardDiv.style.background = getTemaBackground(tema);
          cardDiv.style.display = 'flex';
          cardDiv.style.flexDirection = 'column';
          cardDiv.style.alignItems = 'center';
          cardDiv.style.justifyContent = 'center';
          cardDiv.style.padding = '30px';
          cardDiv.style.color = 'white';
          cardDiv.style.textAlign = 'center';
          cardDiv.style.boxSizing = 'border-box';
          const textDiv = document.createElement('div');
          textDiv.textContent = mensagem;
          textDiv.style.whiteSpace = 'pre-wrap';
          textDiv.style.fontSize = '1.2rem';
          cardDiv.appendChild(textDiv);
          cardPreview.appendChild(cardDiv);

          previewModal.style.display = 'flex';
          if (payBtn) payBtn.style.display = 'none';
          const reactionCont = previewModal.querySelector('.reaction-container');
          if (reactionCont) reactionCont.style.display = 'flex';
        });
      });

      isLoadingRecebidos = false;
    })
    .catch(err => {
      console.error('Erro ao carregar recebidos:', err);
      isLoadingRecebidos = false;
    });
}

  document.querySelectorAll('.reaction-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const currentModal = document.getElementById('previewModal');
      const cartaId = currentModal.getAttribute('data-id');
      if (!cartaId) {
        return;
      }
      const reacão = icon.dataset.reacao;
      fetch('enviar_reacao.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(cartaId)}&reacao=${encodeURIComponent(reacão)}`
      })
      .then(res => res.json())
      .then(resultado => {
        if (resultado.success) {
          alert('Reação enviada com sucesso!');
          currentModal.style.display = 'none';
          
        } else {
          alert('Erro ao enviar reação.');
        }
      })
      .catch(err => console.error('Erro ao enviar reação:', err));
    });
  });

  const closeModalButton = document.getElementById('closeModal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', function() {
      previewModal.style.display = 'none';
    });
  }

  function getTemaBackground(tema) {
    switch (tema) {
      case 'c1':
        return 'linear-gradient(to bottom, #ff0000 0%, #000000 100%)';
      case 'c2':
        return 'linear-gradient(to bottom, #007bff 0%, #6f42c1 100%)';
      case 'c3':
        return 'linear-gradient(to bottom, #ff4f79 0%, #ffc0cb 100%)';
      case 'c4':
        return 'linear-gradient(to bottom, #6f42c1 0%, #ff4f79 100%)';
      default:
        return 'linear-gradient(to bottom, #3a0ca3 0%, #7209b7 100%)';
    }
  }

});

