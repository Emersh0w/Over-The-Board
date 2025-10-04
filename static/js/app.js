// js/app.js (VERSÃO FINAL - Vanilla JS)

// --- Funções Auxiliares de Análise de Brilho (Fora do Componente) ---

/**
 * Analisa a imagem e determina se ela é predominantemente clara ou escura.
 * @param {string} imageUrl - URL da imagem.
 * @param {function} callback - Função chamada com 'is-light-bg' ou 'is-dark-bg'.
 */
function getImageBrightness(imageUrl, callback) {
    const img = new Image();
    // Essencial para tentar ler pixels de imagens externas (CORS)
    img.crossOrigin = 'Anonymous'; 
    img.src = imageUrl;

    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Usa um tamanho de amostra pequeno para otimizar o desempenho
        const sampleSize = 100;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        
        let colorSum = 0;
        
        try {
            const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
            const data = imageData.data;

            // Itera sobre os pixels e calcula o brilho médio
            for (let i = 0; i < data.length; i += 4) {
                // Algoritmo de Brilho Relativo
                const brightness = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
                colorSum += brightness;
            }

            const averageBrightness = colorSum / (sampleSize * sampleSize);

            // Se o brilho médio for maior que 128 (metade de 255), é considerado claro
            const isLight = averageBrightness > 128;
            
            callback(isLight ? 'is-light-bg' : 'is-dark-bg');
            
        } catch (e) {
            // Em caso de erro de segurança (CORS não permitido), assume-se fundo escuro
            console.warn("Erro ao analisar pixels (CORS?). Assumindo fundo escuro.", e);
            callback('is-dark-bg');
        }
    };
    
    img.onerror = function() {
        console.error("Não foi possível carregar a imagem: " + imageUrl);
        callback('is-dark-bg');
    };
}


// A função que encapsula toda a lógica do efeito para um único card
function CardEffect(cardWrapElement) {
    // 1. Variáveis de Estado (e Seletores DOM)
    const card = cardWrapElement.querySelector('.card');
    const cardBg = cardWrapElement.querySelector('.card-bg');
    const cardInfo = cardWrapElement.querySelector('.card-info');
    
    // ATENÇÃO: Corrigido de h2 para h1 para ser consistente com seu HTML original
    const cardTitle = cardInfo.querySelector('h1'); 

    let mouseX = 0;
    let mouseY = 0;
    let mouseLeaveTimeout = null;
    
    // Obter o URL da imagem da data-attribute
    const dataImage = cardWrapElement.getAttribute('data-image');

    // Inicializa as dimensões do card (serão recalculadas no handleResize)
    let width = cardWrapElement.offsetWidth;
    let height = cardWrapElement.offsetHeight;

    // --- Funções Internas de Lógica ---
    
    // Lógica para limitar o texto
    function truncateText(element, maxLength) {
        const text = element.textContent;
        if (text.length > maxLength) {
            element.textContent = text.substring(0, maxLength) + '...';
        }
    }

    // Calcula a posição relativa do mouse (de -0.5 a 0.5)
    function getMousePX() {
      return mouseX / width;
    }
    function getMousePY() {
      return mouseY / height;
    }
    
    // Aplica as transformações CSS
    function updateCardTransforms() {
      const mousePX = getMousePX();
      const mousePY = getMousePY();
      
      // Transformação de Rotação (Efeito 3D)
      const rX = mousePX * 30; 
      const rY = mousePY * -30; 
      card.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;

      // Transformação de Posição do Background (Efeito Parallax)
      const tX = mousePX * -40; 
      const tY = mousePY * -40; 
      cardBg.style.transform = `translateX(${tX}px) translateY(${tY}px)`;
    }

    // 3. Manipulação de Eventos
    function handleMouseMove(e) {
      // Recalcula a posição do mouse em relação ao centro do card
      mouseX = e.pageX - cardWrapElement.offsetLeft - width / 2;
      mouseY = e.pageY - cardWrapElement.offsetTop - height / 2;
      
      updateCardTransforms();
    }

    function handleMouseEnter() {
      clearTimeout(mouseLeaveTimeout);
    }

    function handleMouseLeave() {
      mouseLeaveTimeout = setTimeout(() => {
        mouseX = 0;
        mouseY = 0;
        updateCardTransforms();
      }, 1000); 
    }

    // Recalcula as dimensões ao redimensionar a janela
    function handleResize() {
        width = cardWrapElement.offsetWidth;
        height = cardWrapElement.offsetHeight;
    }

    // 4. Inicialização
    
    // Lógica de Contraste
    if (dataImage) {
        cardBg.style.backgroundImage = `url(${dataImage})`;
        
        getImageBrightness(dataImage, (contrastClass) => {
            // Remove qualquer classe de contraste anterior e aplica a nova
            cardWrapElement.classList.remove('is-light-bg', 'is-dark-bg');
            cardWrapElement.classList.add(contrastClass);
        });
    }

    // Limitação de Texto
    if (cardTitle) {
        truncateText(cardTitle, 50);
    }

    // Anexar os Event Listeners
    cardWrapElement.addEventListener('mousemove', handleMouseMove);
    cardWrapElement.addEventListener('mouseenter', handleMouseEnter);
    cardWrapElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    cardWrapElement.classList.add('js-enabled'); 
}

// 5. Inicialização Global: Itera sobre todos os elementos e aplica o efeito
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos que devem ter o efeito de card
    const cardWraps = document.querySelectorAll('.card-wrap');

    // Inicializa a lógica para cada card encontrado
    cardWraps.forEach(CardEffect);
});