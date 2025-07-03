const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset-button');

const tempoDisplay = document.getElementById('tempo'); 
const nomeSpan = document.getElementById('nome'); 

const imagens = [
    'https://www.minhareceita.com.br/app/uploads/2024/06/milho-cozido-portal-minha-receita-1.jpg',
    'https://cdnm.westwing.com.br/glossary/uploads/br/2023/06/27200520/fogueira-de-festa-junina-1.png',
    'https://static.nationalgeographicbrasil.com/files/styles/image_3200/public/editmcaabr060620194959.webp',
    'https://images.tcdn.com.br/img/img_prod/672829/90_bandeirinha_festa_junina_de_plastico_kit_500_metros_1639_1_296dec800d2155e5b686025bc6cbaa77.jpg',
    'https://blog.novasafra.com.br/wp-content/uploads/2017/06/5-comidas-tipicas-da-festa-junina-para-voce-fazer-e-vender-bem.jpeg',
    'https://www.shutterstock.com/image-vector/festa-junina-straw-hat-illustration-600nw-2457540869.jpg',
    'https://cdn.dooca.store/140651/products/uwh97z8ensavhqacbluh33h7ukrbcayfdvqe_640x640+fill_ffffff.png?v=1707936495&webp=0',
    'https://i0.wp.com/receitaspelomundo.com.br/wp-content/uploads/2025/04/comidas-tipica-festa-junina-receitas-pelo-mundo.webp',
    'https://cdn.awsli.com.br/2500x2500/1333/1333597/produto/214795385/202504141506266286display_adesivo_festa_junina_sanfona-ooc2nj6wgf.png',
    'https://img.freepik.com/vetores-gratis/personagem-de-desenho-animado-de-milho-feliz_1308-172276.jpg?semt=ais_hybrid&w=740'
];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;

let segundos = 0;
let minutos = 0;
let cronometro = null;

function updateDisplay() {
    const minutosFormatado = String(minutos).padStart(2, '0');
    const segundosFormatado = String(segundos).padStart(2, '0');
    tempoDisplay.textContent = `${minutosFormatado}:${segundosFormatado}`;
}

function startTimer() {
    if (cronometro) return; // Impede múltiplas execuções

    cronometro = setInterval(() => {
        segundos++;
        if (segundos === 60) {
            segundos = 0;
            minutos++;
        }
        updateDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(cronometro);
    cronometro = null;
    segundos = 0;
    minutos = 0;
    updateDisplay();
}

function stopTimer() {
    clearInterval(cronometro);
    cronometro = null;
}

const params = new URLSearchParams(window.location.search);
const nome = params.get('nome');

if (nome) {
    nomeSpan.textContent = nome;
}

function createCards() {
    const allCards = [...imagens, ...imagens].sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = '';
    score = 0;
    scoreDisplay.textContent = score;

    resetTimer(); 
    startTimer(); 

    allCards.forEach((src) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.image = src;

        card.innerHTML = `
          <div class="front-face"><img src="${src}" alt="Imagem"></div>
          <div class="back-face"></div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    // Reset state variables
    resetBoard();
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    score++;
    scoreDisplay.textContent = score;

    resetBoard();

    if (score === imagens.length) {
        stopTimer();
        salvarNoRanking(nome, minutos, segundos);
        exibirRanking();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

resetButton.addEventListener('click', createCards);

createCards();

function salvarNoRanking(nome, minutos, segundos) {
    if (!nome) return; // Evita salvar sem nome

    const tempoTotal = minutos * 60 + segundos;

    const jogador = {
        nome: nome,
        tempo: tempoTotal
    };

    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push(jogador);

    // Ordena pelo menor tempo
    ranking.sort((a, b) => a.tempo - b.tempo);

    // Mantém só os 50 melhores
    ranking = ranking.slice(0, 50);

    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function exibirRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const rankingDiv = document.getElementById('ranking');
    rankingDiv.innerHTML = '<h3>Ranking dos Melhores</h3>';

    const lista = document.createElement('ol');
    ranking.forEach(jogador => {
        const minutos = Math.floor(jogador.tempo / 60);
        const segundos = jogador.tempo % 60;
        const tempoFormatado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        const li = document.createElement('li');
        li.textContent = `${jogador.nome} - ${tempoFormatado}`;
        lista.appendChild(li);
    });

    rankingDiv.appendChild(lista);
}
