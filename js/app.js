//MEMORY GAME

//A list of all let and const used in the global scope

let cards = [...document.querySelectorAll(".card")]; //array of all cards
const deck = document.querySelector(".deck");
const counterDisplay = document.querySelector(".moves");
let openCards = []; //array of open cards
let playable = true; //user can click on the cards
let counter = 0; //number of moves
let matchedPairs = 0; //number of all matched Pairs so far in the game
let timing = false; //if timing is false, stopwatch is off
let sec = 0; //counting seconds of playing
let starRatio = document.querySelector(".stars").innerHTML;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  };
  return array;
};

// Timer functionality from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript

function time(val) { //function to have a stopwatch in desired format 00:00
  return val > 9 ? val : "0" + val;
}

let gameTime = setInterval(function() {
  if (timing === true) { //start of counting time
    document.getElementById("seconds").innerHTML = time(++sec % 60);
    document.getElementById("minutes").innerHTML = time(parseInt(sec / 60, 10));
  }
}, 1000);

//Counting the user's moves
function counterIncrement() {
  counterDisplay.textContent = ++counter; //actual moves visible to user
  if ((counter == 14) || (counter == 17) || (counter == 20)) { //stars ratio
    let stars = document.querySelector(".fa-star");
    stars.parentNode.removeChild(stars); //removing the star with the number of moves above
  };
};

//Add event listeners on cards
for (const index in cards) {
  cards[index].addEventListener("click", userClick);
};

//Turning cards by user
function userClick() {
  timing = true; //starting the game timer
  if ((this.classList.contains("open") === false) && playable) {
    this.classList.add("open", "show");
    openCards.push(this); //filling the array of openCards for futher checking
    checkMatch();
  };
};

//Checking the match among the cards
function checkMatch() {
  if (openCards.length == 2) { //checks are run only when there is a pair
    if (openCards[0].id == openCards[1].id) { //a pair is found
      match();
    } else {
      notMatch();
    };
    counterIncrement(); //add a move to move counter
  };
};

//Match is found
function match() {
  openCards[0].classList.remove("open", "show");
  openCards[0].classList.add("match"); // removing and adding right classes
  openCards[0].removeEventListener("click", userClick); //the card is not clickable/playable
  openCards[1].classList.remove("open", "show");
  openCards[1].classList.add("match");
  openCards[1].removeEventListener("click", userClick);
  openCards = []; //empty the array of open cards
  matchedPairs += 1; //increment the number of all matched pairs
  if (matchedPairs == 8) { //if all cards are matched
    win();
  };
};

//Not Match
function notMatch() {
  playable = false; //no other cards can be clicked
  setTimeout(function() { //timeout to user to be able to see both opened cards
    openCards[0].classList.remove("open", "show"); //removing classes
    openCards[1].classList.remove("open", "show");
    openCards = []; //empty the array of open cards
    playable = true; //all cards are clickable again
  }, 1000);
};

//Win function
function win() {
  clearInterval(gameTime); //stop the timer
  setTimeout(function() { //filling the modal with user stats
    document.querySelector(".winMoves span").textContent = counter;
    document.getElementById("winSecs").innerHTML = (sec % 60);
    document.getElementById("winMins").innerHTML = parseInt(sec / 60);
    document.querySelector(".winStars").innerHTML = starRatio;
    $('#modal').modal({ //showing the modal to user
      show: true
    });
  }, 1000);
};

//Function to start a game
function startGame() {
  removeClasses();
  cards = shuffle(cards);
  deck.innerHtml = ""; //empty the current deck
  for (const index in cards) { //filling the empty deck with the cards in the new order
    deck.appendChild(cards[index]);
  };
};

//Function to remove classes of the cards (to be sure that all cards are playable in right way)
function removeClasses() {
  for (const index in cards) {
    cards[index].classList.remove("match", "open", "show");
  };
};

//Init of the game
startGame();

//Restarting the game similar to refreshing the page
function restart() {
  location.reload();
};