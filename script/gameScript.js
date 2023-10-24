// Variables
let cardColumnCount = 4;
let cardRowCount = 4;
let decksize = cardColumnCount*cardRowCount;

let cardHeight = 100;
let cardWidth = 100;

const cardMargin = 10;
const cardBorderSize = 4;
const cardBorder = cardBorderSize+'px solid black'

const maxFlippedCard = 2;
let totMatchedCard = 0;

let flippedCard1 = {card: null, cardDiv: null};
let flippedCard2 = {card: null, cardDiv: null};
let flippedNumber = 0;

let clicNumber = 0;
let maxClicNumber = cardColumnCount*cardRowCount*5;

const maxTime = cardColumnCount*cardRowCount*3;
var sec;
let score = 0;

// Choix des couleurs qui seront associées aux cartes 
let color = [ '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FF5500',
'#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080', '#C0C0C0',
'#FF8080', '#80FF80', '#8080FF', '#FFFF80', '#FF80FF', '#80FFFF', '#FFC0C0', '#C0FFC0',
'#C0C0FF', '#FFFFC0', '#FFC0FF', '#C0FFFF', '#FF9999', '#99FF99', '#9999FF', '#FFFF99',
'#FF99FF', '#99FFFF', '#FFB266', '#66FFB2', '#B266FF', '#FFFFB2', '#FFB2FF', '#B2FFFF',
'#FFCC99', '#99FFCC', '#CC99FF', '#FFFFCC', '#FFCCFF', '#CCFFFF', '#FFD699', '#99FFD6',
'#D699FF', '#FFFFD6', '#FFD6FF', '#D6FFFF', '#FFE0B2', '#B2FFE0', '#E0B2FF', '#FFFFE0',
'#FFE0FF', '#E0FFFF', '#FFE6B2', '#B2FFE6', '#E6B2FF', '#FFFFE6', '#FFE6FF', '#E6FFFF'
]

// Création et mélange du deck 
let deck = []
for (let index = 0; index < decksize; index += 2) {
    deck[index] = {id: index+1, matchID: index +1, color: color[0], isFlipped: false, isMatched: false} // Rajouter pair_id 
    deck[index+1] = {id: index+2, matchID: index +1, color: color[0], isFlipped: false, isMatched: false}
    color.splice(0, 1)
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
shuffleArray(deck)

//Retournement des cartes (changement de couleur et de status IsFlipped)
function cardFlipped(cardDiv, card) {
    //Si moins de deux cartes retournée
    if (flippedNumber < maxFlippedCard){
        if (!card.isFlipped) {
            card.isFlipped = true;
            cardDiv.style.backgroundColor = card.color;
            cardDiv.textContent = card.id;
            flippedNumber++;
            //Enregistrement de l'objet card qui est retourné
            if(!flippedCard1.card) { 
              flippedCard1.card=card;
              flippedCard1.cardDiv=cardDiv;
            } else {
              flippedCard2.card=card;
              flippedCard2.cardDiv=cardDiv;
            }
        }
    }    
    // Si deux cartes retournees (changement de couleur et de status IsFlipped et IsMatched et reset ou non des cartes retournées)
    if(flippedNumber === maxFlippedCard) {
      if(flippedCard1.card.color === flippedCard2.card.color) {
        flippedCard1.card.isMatched = true;
        flippedCard2.card.isMatched = true;
        flippedCard1 = {card: null, cardDiv: null};
        flippedCard2 = {card: null, cardDiv: null};
        flippedNumber = 0;
      } else {
        setTimeout(function() {
          flippedCard1.card.isFlipped = false;
          flippedCard2.card.isFlipped = false;
          flippedCard1.cardDiv.style.backgroundColor = 'black';
          flippedCard1.cardDiv.textContent = '';
          flippedCard2.cardDiv.style.backgroundColor = 'black';
          flippedCard2.cardDiv.textContent = '';
          flippedCard1 = {card: null, cardDiv: null};
          flippedCard2 = {card: null, cardDiv: null};
          flippedNumber = 0;
        }, 500)
//!!!!!!!!!!!!!!!!!!!!!!!!! Faire une fonction show carte et hide carte !!!!!!!!
      }     
    }
}

// Creation des divs en appendChild #gameArea en fonction du nombre de carte dans 'deck'. Stylise les div avec les propriétés des variables
function gameAreaCreation() {
    gameArea.innerHTML = ''
    for (const key in deck) {
        // Creation des div par rapport au nombre de carte dans deck
        if (deck.hasOwnProperty(key)) {
            let card = deck[key];
            let gameArea = document.querySelector('#gameArea');
            let cardDiv = document.createElement('div');
            // Style des divs
            cardDiv.style.backgroundColor = 'black';
            cardDiv.style.minWidth = cardWidth+'px';
            cardDiv.style.minHeight = cardHeight+'px';
            cardDiv.style.margin = cardMargin+'px';
            cardDiv.style.border = cardBorder;
            cardDiv.style.borderRadius = 10+'px';
            // Envent on Clic
            cardDiv.onclick = function(e) {
                cardFlipped(cardDiv, card);
                wincondition(deck);
                clicNumber++;
                clicCounter(clicNumber)
            }
            // Ajout des divs
            gameArea.appendChild(cardDiv);   
        }
    }    
}

//Taille de l'interface de jeux #gameArea avec un maxWidth et maxHeight en fonctions des valeurs des variables cardColumnCount, cardRowCount, cardHeight, cardWidth, cardMargin, cardBorderSize
function gameAreaSize() {
    let gameArea = document.querySelector('#gameArea')
    console.log(gameArea);
    gameArea.style.display = 'flex';
    gameArea.style.flexWrap = 'wrap';
    gameArea.style.margin = 'auto';
    gameArea.style.justifyContent = 'center';
    gameArea.style.alignItems = 'center';
    gameArea.style.maxHeight = 0
    gameArea.style.maxWidth = 0
    gameArea.style.maxWidth = cardColumnCount*(cardWidth+(cardBorderSize*2)+(cardMargin*2))+'px';
    gameArea.style.maxHeight = cardRowCount*(cardHeight+(cardBorderSize*2)+(cardMargin*2))+'px';
}

// Vérifie si le joueur a gagné et affiche un message en console et recharge la page
function wincondition(deck) {
  totMatchedCard = 0; // Réinitialiser le compteur des cartes retournées
  deck.forEach(carte => {
    if (carte.isMatched == true) {
      totMatchedCard += 1;
      console.log(totMatchedCard);
    }
  });
  if (totMatchedCard === decksize) {
    setTimeout(function() {
      alert('Vous avez gagné. Votre score est de: '+score);
      window.location.href = 'index.html' 
    }, 500);             
  }
  if (clicNumber >= maxClicNumber) {
    setTimeout(function() {
      alert('Vous avez atteint le nombre de coups maximum. Vous avez perdu. Votre score est de: '+score);
      window.location.href = 'index.html' 
    }, 500);             
  }
  if (sec >= maxTime) {
    setTimeout(function() {
      alert('Vous avez atteint le temps maximum. Vous avez perdu. Votre score est de: '+score);
      window.location.href = 'index.html' 
    }, 100);          
  }
}

//Timer: Chronometre
function timer() {
  sec = 0;
  var timer = setInterval(function() {
    document.getElementById('timer').innerHTML = 'Chrono: 00:' + sec.toString().padStart(2, '0') + '  / '+ maxTime;
    sec++;
    if (sec > maxTime) {
      clearInterval(timer);
    }
  }, 1000);
}

function scoreCounter(sec, clicNumber) {
  score = sec + clicNumber + (sec*clicNumber)
  document.getElementById('score').innerHTML = 'Score: ' + score;
}

function clicCounter(clicNumber) {
  document.querySelector('#clic').innerHTML = 'Coups: ' + clicNumber + '/' +  maxClicNumber
}
function parameters() {
  cardColumnCount = document.getElementById('colonnes').value
  cardRowCount = document.getElementById('lignes').value
  decksize = cardColumnCount*cardRowCount
  cardHeight = document.getElementById('hCarte').value
  cardWidth = document.getElementById('lCarte').value
  deck = []
  
  for (let index = 0; index < decksize; index += 2) {
    deck[index] = {id: index+1, matchID: index +1, color: color[0], isFlipped: false, isMatched: false} // Rajouter pair_id 
    deck[index+1] = {id: index+2, matchID: index +1, color: color[0], isFlipped: false, isMatched: false}
    color.splice(0, 1)  
  }
  shuffleArray(deck)
  gameAreaSize()
  gameAreaCreation()
  
    
}

//Event listener button
document.querySelector('#start').addEventListener('click', timer)
document.querySelector('#appliquer').addEventListener('click', parameters)

// Appel des fonctions
setInterval(function() {
  scoreCounter(sec, clicNumber);
}, 1000);


gameAreaSize()
gameAreaCreation()

