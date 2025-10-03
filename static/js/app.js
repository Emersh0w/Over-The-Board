// js/app.js (NOVA VERSÃO - Vanilla JS)

// A função que encapsula toda a lógica do efeito para um único card
function CardEffect(cardWrapElement) {
    // 1. Variáveis de Estado (como as 'data' e 'props' do Vue)
    const card = cardWrapElement.querySelector('.card');
    const cardBg = cardWrapElement.querySelector('.card-bg');

    function truncateText(element, maxLength) {
        const text = element.textContent;
        if (text.length > maxLength) {
            // Se o texto for maior que o limite, corte-o e adicione "..."
            element.textContent = text.substring(0, maxLength) + '...';
        }
    }

    const cardInfo = cardWrapElement.querySelector('.card-info');
    const cardTitle = cardInfo.querySelector('h2'); // Seleciona o h2

    let mouseX = 0;
    let mouseY = 0;
    let mouseLeaveTimeout = null;
    
    // Obter o URL da imagem da data-attribute
    const dataImage = cardWrapElement.getAttribute('data-image');
    cardBg.style.backgroundImage = `url(${dataImage})`;

    // Inicializa as dimensões do card
    let width = cardWrapElement.offsetWidth;
    let height = cardWrapElement.offsetHeight;

    // 2. Métodos (funções que calculam e aplicam o efeito)

    // Similar ao 'computed' do Vue: calcula a posição relativa do mouse (de -0.5 a 0.5)
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
      const rX = mousePX * 30; // 30 graus de rotação máxima
      const rY = mousePY * -30; // -30 graus de rotação máxima
      card.style.transform = `rotateY(${rX}deg) rotateX(${rY}deg)`;

      // Transformação de Posição do Background (Efeito Parallax)
      const tX = mousePX * -40; // -40px de translação máxima
      const tY = mousePY * -40; // -40px de translação máxima
      cardBg.style.transform = `translateX(${tX}px) translateY(${tY}px)`;
    }

    // 3. Manipulação de Eventos (como as '@mousemove', '@mouseenter', etc.)

    function handleMouseMove(e) {
      // Recalcula a posição do mouse em relação ao centro do card
      mouseX = e.pageX - cardWrapElement.offsetLeft - width / 2;
      mouseY = e.pageY - cardWrapElement.offsetTop - height / 2;
      
      // Atualiza o CSS a cada movimento do mouse
      updateCardTransforms();
    }

    function handleMouseEnter() {
      clearTimeout(mouseLeaveTimeout);
    }

    function handleMouseLeave() {
      // Define um timeout para retornar à posição original (0,0)
      mouseLeaveTimeout = setTimeout(() => {
        mouseX = 0;
        mouseY = 0;
        updateCardTransforms();
      }, 1000); // O mesmo atraso de 1 segundo (1000ms) do código Vue.js
    }

    // Recalcula as dimensões ao redimensionar a janela
    function handleResize() {
        width = cardWrapElement.offsetWidth;
        height = cardWrapElement.offsetHeight;
    }

    // 4. Inicialização: Anexar os Event Listeners (como o 'mounted' do Vue)
    if (cardTitle) {
        truncateText(cardTitle, 50);
    }

    cardWrapElement.addEventListener('mousemove', handleMouseMove);
    cardWrapElement.addEventListener('mouseenter', handleMouseEnter);
    cardWrapElement.addEventListener('mouseleave', handleMouseLeave);
    
    // Garante que as dimensões estão corretas
    window.addEventListener('resize', handleResize);
    
    // Adiciona a classe que o CSS usa para iniciar os efeitos de hover (se necessário)
    cardWrapElement.classList.add('js-enabled'); 
}

// 5. Inicialização: Itera sobre todos os elementos e aplica o efeito
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos que devem ter o efeito de card
    const cardWraps = document.querySelectorAll('.card-wrap');

    // Inicializa a lógica para cada card encontrado
    cardWraps.forEach(CardEffect);
});

