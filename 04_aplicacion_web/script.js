import  Deck, {Card} from "./deck.js"

const CARD_VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

const computerCardSlot = document.querySelector(".computer-card-slot")

const computerDeckElement = document.querySelector(".computer-deck")
const playerCardContainer = document.querySelector(".player-card-container")
const playerCardCombinations = document.querySelector(".player-card-combinations")
const button = document.querySelector(".button")

let playerDeck, computerDeck, inRound, stop, cardsSelected

button.addEventListener("click", () => {
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

  button.innerText = "Click to Draw"

  updateDeckCount()
}

function flipCards() {
  inRound = true

  button.innerText = "Make your game"
  const computerCard = computerDeck.pop()
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
  const value = dataSplit[0]
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
 


 



 console.log(cardsSelected)
}


