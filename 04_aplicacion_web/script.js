import  Deck, {Card} from "./deck.js"

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
startGame(1)
function startGame(numberOfPlayers) {
  
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
    text.innerText = "You Lose!!"
    stop = true
  } else if (isGameOver(computerDeck)) {
    text.innerText = "You Win!!"
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
  

    const valueFormatted = convertFromStringToNumberValue(value);
    const card = new Card(suit, valueFormatted)
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
    const aValue = (a.value);
    const bValue = (b.value);
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
    if(computerCard.value === cardsSelected[x].value && computerCard.suit === cardsSelected[x].suit) return true;
  }
  return false;
}

function updateGame(cards){

  combinationsTitle.style.visibility = "visible"
  const cardCombinationsContainer =  document.createElement("div")
  cardCombinationsContainer.classList.add("cardContainer")
  cards.map(card=> {
    const currentCard = card.getHTML();
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
