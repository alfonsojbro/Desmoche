console.log("Javascript online");
const SUITS = ["♠", "♣", "♥", "♦"];
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
  "K",
];

class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  pop() {
    return this.cards.shift();
  }

  push(card) {
    this.cards.push(card);
  }

  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red";
  }

  getHTML() {
    const cardDiv = document.createElement("div");
    cardDiv.innerText = this.suit;
    cardDiv.classList.add("card", this.color);

    cardDiv.id = `${this.value} ${this.suit}`;
    cardDiv.dataset.value = `${this.value} ${this.suit}`;
    return cardDiv;
  }
}

function freshDeck() {
  return SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return new Card(suit, value);
    });
  });
}

const computerCardSlot = document.querySelector(".computer-card-slot");
const computerDeckElement = document.querySelector(".computer-deck");
const playerCardContainer = document.querySelector(".player-card-container");
const playerCardCombinations = document.querySelector(
  ".player-card-combinations"
);
const combinationsTitle = document.querySelector(
  ".player-card-combinations-title"
);
const buttonGame = document.querySelector(".buttonGame");
const buttonDraw = document.querySelector(".buttonDraw");
const buttonDrop = document.querySelector(".buttonDrop");
const lossCount = document.querySelector(".score-marker-loss");
const wonCount = document.querySelector(".score-marker-won");

let playerDeck, computerDeck, inRound, stop, cardsSelected, computerCard;

function clearGame() {
  playerCardContainer.innerHTML = "";
}
buttonDraw.addEventListener("click", () => {
  if (stop) {
    startGame(1);
    return;
  }
  if (inRound) {
    cleanBeforeRound();
  } else {
    flipCards();
  }
});

buttonGame.addEventListener("click", (event) => makeGame(event));

function startGame(numberOfPlayers) {
  const deck = new Deck();
  deck.shuffle();

  const deckSplitPoint = deck.numberOfCards - numberOfPlayers * 9;

  computerDeck = new Deck(deck.cards.slice(0, deckSplitPoint));
  playerDeck = new Deck(deck.cards.slice(deckSplitPoint, deck.numberOfCards));
  inRound = false;
  stop = false;
  cardsSelected = [];
  showPlayerDeck();
  cleanBeforeRound();
}

function showPlayerDeck() {
  playerDeck.cards.map((card) => {
    const currentCard = card.getHTML();
    currentCard.addEventListener("click", selectCard);
    playerCardContainer.appendChild(currentCard);
  });
}
function cleanBeforeRound() {
  inRound = false;
  computerCardSlot.innerHTML = "";

  buttonGame.style.display = "none";
  cardsSelected.length = 0;
  updateDeckCount();
}

function flipCards() {
  inRound = true;

  buttonGame.style.display = "block";

  computerCard = computerDeck.pop();
  computerCardSlot.addEventListener("click", selectCard);

  computerCardSlot.appendChild(computerCard.getHTML());

  updateDeckCount();

  if (isGameOver(playerDeck)) {
    alert("You Lose!!");
    stop = true;
    startGame(1);
    updateScoreCount(false);
  } else if (isGameOver(computerDeck)) {
    alert("You Win!!");
    stop = true;
    startGame(1);
    updateScoreCount(true);
  }
}
function updateScoreCount(isGameWon) {
  if (isGameWon) {
    const winScore = parseInt(wonCount.textContent, 10);
    wonCount.innerText = winScore++;
  } else {
    const lossScore = parseInt(lossCount.textContent, 10);
    lossCount.innerText = lossScore++;
  }
}
function updateDeckCount() {
  computerDeckElement.innerText = computerDeck.numberOfCards;
}

function isGameOver(deck) {
  return deck.numberOfCards === 0;
}

function selectCard(event) {
  const dataValue = event.target.getAttribute("data-value");
  const dataSplit = dataValue.split(" ");
  let value = dataSplit[0];
  const suit = dataSplit[1];

  const isCardSelected = (card) => card.value === value && card.suit === suit;
  const index = cardsSelected.findIndex(isCardSelected);

  if (index < 0) {
    const card = new Card(suit, value);
    event.target.style.backgroundColor = "green";
    cardsSelected.push(card);
  } else {
    event.target.style.backgroundColor = "";
    cardsSelected.splice(index, 1);
  }
}

function makeGame() {
  if (cardsSelected.length < 3) {
    alert("Selecciona al menos tres cartas para hacer una jugada");
    return;
  }
  const cardsSelectedSorted = cardsSelected.sort((a, b) => {
    const aValue = convertFromStringToNumberValue(a.value);
    const bValue = convertFromStringToNumberValue(b.value);
    return parseInt(aValue) - parseInt(bValue);
  });
  if (isStraight(cardsSelectedSorted) || isSameNumber(cardsSelectedSorted)) {
    updateGame(cardsSelectedSorted);

    if (isComputerCardSelected()) {
      cardsSelected.length = 0;
      buttonDraw.style.display = "none";
      buttonDrop.style.display = "block";
      buttonGame.style.display = "none";
      selectCardToDrop();
    }
    cleanBeforeRound();
  } else {
    alert("Combinación incorrecta. Revisa las reglas de nuevo.");
  }
}
function isComputerCardSelected() {
  for (var x = 0; x < cardsSelected.length; x++) {
    if (
      computerCard.value ===
        convertFromNumberToStringValue(cardsSelected[x].value) &&
      computerCard.suit === cardsSelected[x].suit
    )
      return true;
  }
  return false;
}

function updateGame(cards) {
  combinationsTitle.style.visibility = "visible";
  const cardCombinationsContainer = document.createElement("div");
  cardCombinationsContainer.classList.add("cardContainer");
  cards.map((card) => {
    const currentCard = card.getHTML();
    console.log(card);
    var cardToRemove = document.getElementById(`${card.value} ${card.suit}`);
    if (cardToRemove) cardToRemove.parentNode.removeChild(cardToRemove);
    cardCombinationsContainer.appendChild(currentCard);
  });

  playerCardCombinations.appendChild(cardCombinationsContainer);
}

function selectCardToDrop() {
  buttonDrop.addEventListener("click", (event) => {
    const card = cardsSelected[0];
    if (!card) return alert("Selecciona una carta para botar");
    console.log(card);
    var cardToRemove = document.getElementById(`${card.value} ${card.suit}`);
    if (cardToRemove) cardToRemove.parentNode.removeChild(cardToRemove);
    buttonDraw.style.display = "block";
    buttonDrop.style.display = "none";
  });
}
function isStraight(cards) {
  let previousCard = cards[0];
  for (let x = 1; x < cards.length; x++) {
    const value = (parseInt(previousCard.value, 10) + 1).toString();
    const suit = previousCard.suit;
    if (value != cards[x].value || suit != cards[x].suit) {
      return false;
    }
    previousCard = cards[x];
  }
  return true;
}

function isSameNumber(cards) {
  let value = cards[0].value;
  for (let x = 0; x < cards.length; x++) {
    if (cards[x].value !== value) {
      return false;
    }
  }
  return true;
}

function convertFromStringToNumberValue(value) {
  if (value === "J") value = "11";
  else if (value === "Q") value = "12";
  else if (value === "K") value = "13";
  else if (value === "A") value = "1";

  return value;
}

function convertFromNumberToStringValue(number) {
  if (number === "11") number = "J";
  else if (number === "12") number = "Q";
  else if (number === "13") number = "K";
  else if (number === "1") number = "A";

  return number;
}

const buttonRules = document.querySelector(".button-rules");

const buttonScore = document.querySelector(".button-score");
const buttonNewGame = document.querySelector(".button-new-game");
const homeScreen = document.querySelector(".screen-intro");
const homeButton = document.querySelector(".home-button");
const scoreBody = document.querySelector(".rwd-body");
const buttonSaveScore = document.querySelector(".save-score-button");

function fadeToScreen(targetScreenClassName) {
  var _nameScreen;

  if (!targetScreenClassName) {
    _nameScreen = "screen-intro";
  }

  _nameScreen = targetScreenClassName;

  var $elementTarget = "." + _nameScreen;
  var $elementActiveScreen = ".active-screen";

  const previousActiveElement = document.querySelector($elementActiveScreen);
  previousActiveElement.classList.remove("active-screen");

  const newActiveElement = document.querySelector($elementTarget);
  newActiveElement.classList.add("active-screen");
}
buttonNewGame.addEventListener("click", (event) => {
  fadeToScreen("screen-game");
  startGame(1);
});

function postScore(data) {
  fetch("http://localhost:8080/postScore", {
    method: "POST", // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => alert("¡Puntuación guardada!"))
    .catch((error) => alert("Error guardando!"));
}
function getScore() {
  fetch("http://localhost:8080/getScore", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      setScore(data.scores);
    });
}

/* SCORE JSON : {
  name: string;
  win: string;
  loss: string;
  createdAt: string;
}
*/
function setScore(result) {
  scoreBody.innerHTML = "";
  result.map((score) => {
    const scoreParsed = JSON.parse(score);

    var newRow = scoreBody.insertRow();
    var nameCell = newRow.insertCell();
    var nameText = document.createTextNode(scoreParsed.name);
    nameCell.appendChild(nameText);

    var winCell = newRow.insertCell();
    var winText = document.createTextNode(scoreParsed.win);
    winCell.appendChild(winText);

    var lossCell = newRow.insertCell();
    var lossText = document.createTextNode(scoreParsed.loss);
    lossCell.appendChild(lossText);

    var dateCell = newRow.insertCell();
    var dateText = document.createTextNode(scoreParsed.createdAt);
    dateCell.appendChild(dateText);
  });
}
buttonScore.addEventListener("click", (event) => {
  fadeToScreen("screen-score");

  getScore();
});

buttonRules.addEventListener("click", (event) => {
  fadeToScreen("screen-rules");
});
homeButton.addEventListener("click", (event) => {
  fadeToScreen("screen-intro");
  clearGame();
});

var Modal = (function () {
  var trigger = $qsa(".modal__trigger"); // what you click to activate the modal
  var modals = $qsa(".modal"); // the entire modal (takes up entire window)
  var modalsbg = $qsa(".modal__bg"); // the entire modal (takes up entire window)
  var content = $qsa(".modal__content"); // the inner content of the modal
  var closers = $qsa(".modal__close"); // an element used to close the modal
  var playerNameInput = $qsa(".player-name-input"); // the name set by the player on the input of the modal
  var w = window;
  var isOpen = false;
  var contentDelay = 400; // duration after you click the button and wait for the content to show
  var len = trigger.length;

  // make it easier for yourself by not having to type as much to select an element
  function $qsa(el) {
    return document.querySelectorAll(el);
  }

  var getId = function (event) {
    event.preventDefault();
    var self = this;
    // get the value of the data-modal attribute from the button
    var modalId = self.dataset.modal;
    var len = modalId.length;
    // remove the '#' from the string
    var modalIdTrimmed = modalId.substring(1, len);
    // select the modal we want to activate
    var modal = document.getElementById("modal1");
    // execute function that creates the temporary expanding div
    makeDiv(self, modal);
  };

  var makeDiv = function (self, modal) {
    var fakediv = document.getElementById("modal__temp");

    /**
     * if there isn't a 'fakediv', create one and append it to the button that was
     * clicked. after that execute the function 'moveTrig' which handles the animations.
     */

    if (fakediv === null) {
      var div = document.createElement("div");
      div.id = "modal__temp";
      self.appendChild(div);
      moveTrig(self, modal, div);
    }
  };

  var moveTrig = function (trig, modal, div) {
    var trigProps = trig.getBoundingClientRect();
    var m = modal;
    var mProps = m.querySelector(".modal__content").getBoundingClientRect();
    var transX, transY, scaleX, scaleY;
    var xc = w.innerWidth / 2;
    var yc = w.innerHeight / 2;

    // this class increases z-index value so the button goes overtop the other buttons
    trig.classList.add("modal__trigger--active");

    // these values are used for scale the temporary div to the same size as the modal
    scaleX = mProps.width / trigProps.width;
    scaleY = mProps.height / trigProps.height;

    scaleX = scaleX.toFixed(3); // round to 3 decimal places
    scaleY = scaleY.toFixed(3);

    // these values are used to move the button to the center of the window
    transX = Math.round(xc - trigProps.left - trigProps.width / 2);
    transY = Math.round(yc - trigProps.top - trigProps.height / 2);

    // if the modal is aligned to the top then move the button to the center-y of the modal instead of the window
    if (m.classList.contains("modal--align-top")) {
      transY = Math.round(
        mProps.height / 2 + mProps.top - trigProps.top - trigProps.height / 2
      );
    }

    // translate button to center of screen
    trig.style.transform = "translate(" + transX + "px, " + transY + "px)";
    trig.style.webkitTransform =
      "translate(" + transX + "px, " + transY + "px)";
    // expand temporary div to the same size as the modal
    div.style.transform = "scale(" + scaleX + "," + scaleY + ")";
    div.style.webkitTransform = "scale(" + scaleX + "," + scaleY + ")";

    window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        open(m, div);
      });
    }, contentDelay);
  };

  var open = function (m, div) {
    if (!isOpen) {
      // select the content inside the modal
      var content = m.querySelector(".modal__content");
      // reveal the modal
      m.classList.add("modal--active");
      // reveal the modal content
      content.classList.add("modal__content--active");

      /**
       * when the modal content is finished transitioning, fadeout the temporary
       * expanding div so when the window resizes it isn't visible ( it doesn't
       * move with the window).
       */

      content.addEventListener("transitionend", hideDiv, false);

      isOpen = true;
    }

    function hideDiv() {
      // fadeout div so that it can't be seen when the window is resized
      div.style.opacity = "0";
      content.removeEventListener("transitionend", hideDiv, false);
    }
  };

  var close = function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    var target = event.target;
    var div = document.getElementById("modal__temp");

    /**
     * make sure the modal__bg or modal__close was clicked, we don't want to be able to click
     * inside the modal and have it close.
     */

    if (
      (isOpen && target.classList.contains("modal__bg")) ||
      target.classList.contains("modal__close")
    ) {
      // make the hidden div visible again and remove the transforms so it scales back to its original size
      div.style.opacity = "1";
      div.removeAttribute("style");

      /**
       * iterate through the modals and modal contents and triggers to remove their active classes.
       * remove the inline css from the trigger to move it back into its original position.
       */

      for (var i = 0; i < len; i++) {
        modals[i].classList.remove("modal--active");
        content[i].classList.remove("modal__content--active");
        trigger[i].style.transform = "none";
        trigger[i].style.webkitTransform = "none";
        trigger[i].classList.remove("modal__trigger--active");
      }

      // when the temporary div is opacity:1 again, we want to remove it from the dom
      div.addEventListener("transitionend", removeDiv, false);

      isOpen = false;
      var d = new Date();

      const score = {
        name: playerNameInput[0].value,
        win: wonCount.textContent,
        loss: lossCount.textContent,
        createdAt: d.toLocaleString(),
      };

      postScore(score);
    }

    function removeDiv() {
      setTimeout(function () {
        window.requestAnimationFrame(function () {
          // remove the temp div from the dom with a slight delay so the animation looks good
          div.remove();
        });
      }, contentDelay - 50);
    }
  };

  var bindActions = function () {
    for (var i = 0; i < len; i++) {
      trigger[i].addEventListener("click", getId, false);
      closers[i].addEventListener("click", close, false);
      modalsbg[i].addEventListener("click", close, false);
    }
  };

  var init = function () {
    bindActions();
  };

  return {
    init: init,
  };
})();

Modal.init();
