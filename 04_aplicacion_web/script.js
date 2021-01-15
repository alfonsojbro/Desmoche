console.log("Javascript online")
const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]

class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards
  }

  get numberOfCards() {
    return this.cards.length
  }

  pop() {
    return this.cards.shift()
  }

  push(card) {
    this.cards.push(card)
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1))
      const oldValue = this.cards[newIndex]
      this.cards[newIndex] = this.cards[i]
      this.cards[i] = oldValue
    }
  }
 
}

class Card {
  constructor(suit, value) {
    this.suit = suit
    this.value = value
  }

  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red"
  }

  getHTML() {
    const cardDiv = document.createElement("div")
    cardDiv.innerText = this.suit
    cardDiv.classList.add("card", this.color)
  
    cardDiv.id = `${this.value} ${this.suit}`
    cardDiv.dataset.value = `${this.value} ${this.suit}`
    return cardDiv
  }
}

function freshDeck() {
  return SUITS.flatMap(suit => {
    return VALUES.map(value => {
      return new Card(suit, value)
    })
  })
}

const computerCardSlot = document.querySelector(".computer-card-slot")
const computerDeckElement = document.querySelector(".computer-deck")
const playerCardContainer = document.querySelector(".player-card-container")
const playerCardCombinations = document.querySelector(".player-card-combinations")
const combinationsTitle = document.querySelector(".player-card-combinations-title")
const buttonGame = document.querySelector(".buttonGame")
const buttonDraw = document.querySelector(".buttonDraw")
const buttonDrop = document.querySelector(".buttonDrop")

let playerDeck, computerDeck, inRound, stop, cardsSelected, computerCard

buttonDraw.addEventListener("click", () => {

  if (stop) {
    startGame(1)
    return
  }
  if (inRound) {
    cleanBeforeRound()
  } else {
    flipCards()
  }
})

buttonGame.addEventListener("click", (event) => makeGame(event))

function startGame(numberOfPlayers) {
  
  console.log("Game Started")
  const deck = new Deck()
  deck.shuffle()

  const deckSplitPoint = deck.numberOfCards - (numberOfPlayers * 9);
 
  computerDeck = new Deck(deck.cards.slice(0, deckSplitPoint))
  playerDeck = new Deck(deck.cards.slice(deckSplitPoint, deck.numberOfCards))
  inRound = false
  stop = false
  cardsSelected = []
  showPlayerDeck()
  cleanBeforeRound()
}

function showPlayerDeck(){
  playerDeck.cards.map(card=> {
    const currentCard = card.getHTML();
    currentCard.addEventListener("click", selectCard);
    playerCardContainer.appendChild(currentCard)
  })

}
function cleanBeforeRound() {
  inRound = false
  computerCardSlot.innerHTML = ""

  buttonGame.style.display = "none"
  cardsSelected.length = 0;
  updateDeckCount()
}


function flipCards() {
  inRound = true


  buttonGame.style.display = "block"

 computerCard = computerDeck.pop()
  computerCardSlot.addEventListener("click", selectCard)


  computerCardSlot.appendChild(computerCard.getHTML())
 
  updateDeckCount()


  if (isGameOver(playerDeck)) {
    alert( "You Lose!!")
    stop = true
  } else if (isGameOver(computerDeck)) {
   alert("You Win!!")
    stop = true
  }
}

function updateDeckCount() {
  computerDeckElement.innerText = computerDeck.numberOfCards

}


function isGameOver(deck) {
  return deck.numberOfCards === 0
}

function selectCard(event){

  const dataValue = event.target.getAttribute("data-value")
  const dataSplit = dataValue.split(" ")
  let value = dataSplit[0]
  const suit = dataSplit[1]

  const isCardSelected = (card) => (card.value === value && card.suit === suit)
  const index = cardsSelected.findIndex(isCardSelected)

  if(index < 0){
    const card = new Card(suit, value)
    event.target.style.backgroundColor = "green"
    cardsSelected.push(card)
  } else {
    event.target.style.backgroundColor =""
    cardsSelected.splice(index, 1)
  }

}

function makeGame(){

  if( cardsSelected.length < 3) return;
  const cardsSelectedSorted = cardsSelected.sort((a,b) => { 
    const aValue = convertFromStringToNumberValue(a.value);
    const bValue = convertFromStringToNumberValue(b.value);
    return parseInt(aValue) - parseInt(bValue);
   })
   if(isStraight(cardsSelectedSorted) || isSameNumber(cardsSelectedSorted)  ){
    updateGame(cardsSelectedSorted)

    if(isComputerCardSelected()){
      cardsSelected.length = 0;
      buttonDraw.style.display = "none"
      buttonDrop.style.display = "block"
      buttonGame.style.display = "none"
      selectCardToDrop();
    }
    cleanBeforeRound()
    
   } else {
    alert("Incorrect combination! Check the rules again.")
   }

}
function isComputerCardSelected(){
  for(var x = 0; x <cardsSelected.length; x++){
    if(computerCard.value === convertFromNumberToStringValue(cardsSelected[x].value) && computerCard.suit === cardsSelected[x].suit) return true;
  }
  return false;
}

function updateGame(cards){

  combinationsTitle.style.visibility = "visible"
  const cardCombinationsContainer =  document.createElement("div")
  cardCombinationsContainer.classList.add("cardContainer")
  cards.map(card=> {
    const currentCard = card.getHTML();
    console.log(card)
    var cardToRemove = document.getElementById(`${card.value} ${card.suit}`);
    if(cardToRemove) cardToRemove.parentNode.removeChild(cardToRemove)
    cardCombinationsContainer.appendChild(currentCard)
  })

  playerCardCombinations.appendChild(cardCombinationsContainer)
}

function selectCardToDrop(){
  
  buttonDrop.addEventListener("click", (event) => {
      const card = cardsSelected[0];
      if(!card) return alert("Selecciona una carta para botar");
      console.log(card)
      var cardToRemove = document.getElementById(`${card.value} ${card.suit}`);
      if(cardToRemove) cardToRemove.parentNode.removeChild(cardToRemove)
      buttonDraw.style.display = "block"
      buttonDrop.style.display = "none"
  })
}
function isStraight (cards){
  let previousCard = cards[0];
  for(let x = 1; x < cards.length; x++){ 
    const value = (parseInt(previousCard.value,10) + 1).toString();
    const suit = previousCard.suit;
    if(value != cards[x].value || suit != cards[x].suit) {
      return false;  
    }
    previousCard = cards[x];
   
  }
  return true;
}

function isSameNumber(cards){
  let value = cards[0].value;
  for(let x = 0; x < cards.length; x++){
    if(cards[x].value !== value) {
      return false;  
    }
  }
  return true;
}

function convertFromStringToNumberValue(value){
  if(value === "J") value = "11";
  else if(value === "Q") value = "12";
  else if(value === "K") value = "13";
  else if(value === "A") value = "1";

  return value;
}

function convertFromNumberToStringValue(number){
  if(number === "11") number = "J";
  else if(number === "12") number = "Q";
  else if(number === "13") number = "K";
  else if(number === "1") number = "A";

  return number;
}




const buttonRules = document.querySelector(".button-rules")

const buttonScore = document.querySelector(".button-score")
const buttonNewGame = document.querySelector('.button-new-game')
const homeScreen = document.querySelector('.screen-intro')
const homeButton = document.querySelector('.home-button')
const scoreTable = document.querySelector('.score-table')

  function fadeToScreen(targetScreenClassName) {
    var _nameScreen;

    if (!targetScreenClassName) {
      _nameScreen = 'screen-intro';
    }

    _nameScreen = targetScreenClassName;

    var $elementTarget = '.' + _nameScreen;
    var $elementActiveScreen = '.active-screen';

    const previousActiveElement = document.querySelector($elementActiveScreen)
    previousActiveElement.classList.remove("active-screen")


    const newActiveElement =  document.querySelector($elementTarget)
    newActiveElement.classList.add("active-screen");
   
    
 
  }
  buttonNewGame.addEventListener('click', event =>  {
    fadeToScreen('screen-game');
    startGame(1)
  });


  
function postScore(data){
  fetch("http://localhost:8080/postScore", {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
}
function getScore(){
  fetch("http://localhost:8080/getScore").then(data => setScore(data.json()));
}
function setScore(result){

  result.map(score => {
    var newRow = scoreTable.insertRow();
    var nameCell = newRow.insertCell();
    var nameText = document.createTextNode(score.name);
    nameCell.appendChild(nameText);

    var winCell = newRow.insertCell();
    var winText = document.createTextNode(score.win);
    winCell.appendChild(winText);

    var lossCell = newRow.insertCell();
    var lossText = document.createTextNode(score.loss);
    lossCell.appendChild(lossText);
  })

}
  buttonScore.addEventListener('click', event =>  {
    fadeToScreen('screen-score');

    getScore()
   
  });

  buttonRules.addEventListener('click', event =>  {
    fadeToScreen('screen-rules');
   
  });
  homeButton.addEventListener('click', event =>{
    fadeToScreen('screen-intro')
  })
  

