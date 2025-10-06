<?php
session_start();

if (!isset($_SESSION['id'])) {
    header("Location: cadastro/index.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dia dos Namorados</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="hearts">
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
    <span class="heart"></span>
  </div>

  <div id="content">
    <div class="view-container" id="viewContainer">
      <section class="view view-home">
        <header class="header">
          <div class="logo">
            <img src="img/logo.png" alt="Logo" id="logoImg" />
          </div>
          <h1 class="page-title">Dia dos Namorados</h1>
        <div class="account-info">
          <i class="fas fa-user-circle"></i>
          <span>
            <?php
              echo htmlspecialchars($_SESSION['nome'] ?? 'Usuário');
              echo ' (Turma ' . htmlspecialchars($_SESSION['turma'] ?? '?') . ')';
            ?>
          </span>
          <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Sair</a>
        </div>
        </header>

        <section class="slider-section">
          <div class="slider">
            <button class="nav prev">‹</button>
            <div class="slides">
              <div class="slide active">
                <img src="img/slide1.png" alt="Slide 1">
                <div class="caption">Envie sua carta anonimamente!!</div>
              </div>
              <div class="slide">
                <img src="img/slide2.jpg" alt="Slide 2">
                <div class="caption">Recordação vitalícia do seu amor!</div>
              </div>
              <div class="slide">
                <img src="img/slide3.jpg" alt="Slide 3">
                <div class="caption">Encontre seu amor aqui!!</div>
              </div>
            </div>
            <button class="nav next">›</button>
          </div>
          <div class="dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </section>

        <nav class="section-nav">
          <h2>Meus Envios</h2>
        </nav>

        <ul class="item-list">

        </ul>
      </section>

      <section class="view view-form">
        <header class="header">
          <div class="logo">
            <img src="img/logo.png" alt="Logo" id="logoImg" />
          </div>
          <h1 class="page-title">Dia dos Namorados</h1>
        </header>
        
        <div class="form-container">
          <div class="back-arrow" id="backButton">
            <i class="fas fa-arrow-left"></i>
          </div>
          
          <div class="progress-container" id="progressContainer" style="display:none;">
            <div class="progress-bar">
              <div class="progress-step active" data-step="1">
                <div class="step-icon"><i class="fas fa-user-secret"></i></div>
                <div class="step-label">Anônimo</div>
              </div>
              <div class="progress-step" data-step="2">
                <div class="step-icon">❤</div>
                <div class="step-label">Destinatário</div>
              </div>
              <div class="progress-step" data-step="3">
                <div class="step-icon"><i class="fas fa-envelope"></i></div>
                <div class="step-label">Mensagem</div>
              </div>
              <div class="progress-line"></div>
            </div>
          </div>

          <div class="form-steps" id="formSteps" style="display:none;">
            <div class="form-step active" data-step="1">
              <div class="form-card">
                <div class="form-header">
                  <h2>Como deseja enviar?</h2>
                </div>
                <div class="form-group" style="display:flex; gap:1rem; justify-content:center;">
                <button type="button" class="submit-btn select-btn" data-type="anonimo">
                  <i class="fas fa-user-secret"></i> Correio Elegante
                </button>
                <button type="button" class="submit-btn select-btn" data-type="carta">
                  <i class="fas fa-user-friends"></i> Carta
                </button>
                </div>
              </div>
            </div>

            <div class="form-step" data-step="2">
              <div class="form-card">
                <div class="form-header">
                  <h2>Para quem é sua carta?</h2>
                </div>
                <form id="recipientForm">
                  <div class="form-group">
                    <input type="text" id="destinatario" name="destinatario" placeholder="Encontre seu amor aqui" required>
                    <input type="hidden" id="destinatarioFinal" name="destinatarioFinal">
                    <div class="search-results">
                  
                    </div>
                  </div>
                  <div class="form-actions">
                    <button type="button" class="back-btn">Voltar</button>
                  </div>
                </form>
              </div>
            </div>

            <div class="form-step" data-step="3">
              <div class="form-card">
                <div class="form-header">
                  <h2>Escreva sua mensagem</h2>
                  <p class="subtitle">Adicione um momento juntos</p>
                </div>
                <form id="messageForm">
                  <div class="form-group">
                    <label for="imagem" class="custom-file-label">
                      <i class="fas fa-hand-pointer"></i> Adicionar foto
                    </label>
                    <input type="file" id="imagem" name="imagem" accept="image/*" class="custom-file-input">
                    <div id="previewContainer"></div>
                  </div>
                  <div class="form-group">
                    <textarea id="mensagem" name="mensagem"
                              placeholder="Digite sua mensagem de amor..."
                              rows="5" required></textarea>
                  </div>
                  <div class="form-actions">
                    <button type="button" class="back-btn">Voltar</button>
                    <button type="submit" class="submit-btn">Enviar Carta</button>
                  </div>
                </form>
              </div>
            </div>

            <div class="form-step" data-step="4">
              <div class="form-card">
                <div class="carousel">
                  <div class="carousel__item carousel__item--left" id="c1"></div>
                  <div class="carousel__item carousel__item--main" id="c2"></div>
                  <div class="carousel__item carousel__item--right" id="c3"></div>
                  <div class="carousel__item" id="c4"></div>
                  <div class="carousel__btns">
                    <button class="carousel__btn" id="leftBtn">&#8249;</button>
                    <button class="carousel__btn" id="rightBtn">&#8250;</button>
                  </div>
                </div>
                <div class="form-actions">
                  <button type="button" class="back-btn" id="voltarStep4">Voltar</button>
                  <button type="button" class="submit-btn" id="confirmThemeBtn">Confirmar Fundo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="view view-receive">
        <header class="header">
          <div class="logo">
            <img src="img/logo.png" alt="Logo" />
          </div>
          <h1 class="page-title">Recebidos</h1>
        </header>
        <ul class="received-list">
          
        </ul>
      </section>

    </div>

    <nav class="bottom-nav">
      <button class="bottom-btn btn-home">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3.172l8 7.028v10.8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-10.8l8-7.028z"/></svg>
        <span class="btn-label">Início</span>
      </button>
      <button class="bottom-btn btn-send">
        <img src="img/enviados.png" alt="Enviar" />
        <span class="btn-label">Enviar</span>
      </button>
      <button class="bottom-btn btn-receive">
        <img src="img/chat.png" alt="Recebidos" />
        <span class="btn-label">Recebidos</span>
      </button>
    </nav>
  </div>

  <div id="previewModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
      <button id="closeModal" class="modal-close">&times;</button>

      <div class="card-preview" id="cardPreview"></div>

      <div class="message-preview" id="messagePreview"></div>

      <div class="image-preview" id="imagePreview"></div>

      <div class="reaction-container">
        <p class="reaction-hint">Clique para enviar reação</p>
        <img class="reaction-icon" src="img/emojiCoraçao.png" alt="Curtir (coração)" data-reacao="❤️" />
        <img class="reaction-icon" src="img/emojiVomito.png" alt="Nojo (vômito)" data-reacao="🤢" />
      </div>

      <div class="modal-actions" style="margin-top:1.5rem;">
        <button id="payBtn" class="submit-btn" style="width:auto; padding:0.75rem 1.5rem;">
          Pagar
        </button>
      </div>
    </div>
  </div>



  <script src="main.js"></script>
</body>
</html>
