/**
 * HangMan Game
 * @author Johan Mosquera
 * @version 1.0
 */

// Global variables
let data = [];
let items = [];
let theme = "";

let answer = "";
let maxWrong = 6;
let mistakes = 0;
let guessedLetters = [];
let wordStatus = null;

/**
 * Load the data from the json file
 */
fetch("./data.json")
  .then((response) => response.json())
  .then((datos) => {
    loadData(datos);
  });

function loadData(datos) {
  data = datos;
  initGame();
}

function chooseRandomTheme() {
  let randomTheme = data[Math.floor(Math.random() * data.length)];
  theme = randomTheme.name;
  items = randomTheme.items;
}

function generateRandomWord() {
  answer =
    items[Math.floor(Math.floor(Math.random() * items.length))].toUpperCase();
}

function generateButtons() {
  // let buttonLetters = "abcdefghijklmnñopqrstuvwxyz"
  let buttonLetters = "qwertyuiopasdfghjklñzxcvbnm"
    .split("")
    .map((letter, index) => {
      let divContainer = "";
      if (index > 0 && index % 10 == 0) {
        divContainer = '</div><div class="mb-2">';
      }
      return (
        `${divContainer}<button class="btn btn-outline-dark btn-letter" id="${letter}" onClick="handleGuess('` +
        letter +
        `')">${letter}</button>`
      );
    });
  document.getElementById(
    "keyboard"
  ).innerHTML = `<div class="mb-2">${buttonLetters.join("")}</div>`;
}

function handleGuess(letter) {
  document.getElementById(letter).setAttribute("disabled", true);
  letter = letter.toUpperCase();
  guessedLetters.indexOf(letter) === -1 ? guessedLetters.push(letter) : null;

  /**
   * Check if the letter is in the answer
   */
  if (answer.indexOf(letter) >= 0) {
    guessedWord();
    checkIfGameWon();
  } else if (answer.indexOf(letter) === -1 && mistakes < maxWrong) {
    mistakes++;
    updateMistakes();
    updateHangmanPicture();
    checkIfGameIsLost();
  }
}

function guessedWord() {
  wordStatus = answer
    .split("")
    .map((letter) => {
      return guessedLetters.indexOf(letter) >= 0 ? letter : " _ ";
    })
    .join("");

  document.getElementById("wordSpotlight").innerHTML = wordStatus;
}

function updateMistakes() {
  document.getElementById("mistakes").innerHTML = mistakes;
}

/**
 * Show the hangman parts when the user make a mistake
 */
function updateHangmanPicture() {
  //   document.getElementById("hangmanPicture").src = "./images/" + mistakes + ".jpg";
  document.getElementById("stickman-" + mistakes).style.visibility = "visible";
}

function checkIfGameWon() {
  if (wordStatus === answer) {
    document.getElementById("keyboard").innerHTML = "Ganaste 😁";
  }
}

function checkIfGameIsLost() {
  if (mistakes === maxWrong) {
    document.getElementById("keyboard").innerHTML = "Perdiste 😢";
    document.getElementById(
      "wordSpotlight"
    ).innerHTML = `La respuesta era ${answer}`;
  }
}

function reset() {
  answer = "";
  mistakes = 0;
  guessedLetters = [];
  wordStatus = null;

  document.getElementById("keyboard").innerHTML = "";

  //   document.getElementById("hangmanPicture").src = "./images/0.jpg";
  for (let i = 1; i <= maxWrong; i++) {
    document.getElementById("stickman-" + i).style.visibility = "hidden";
  }

  document.getElementById("wordSpotlight").innerHTML = "";
  document.getElementById("mistakes").innerHTML = "";

  initGame();
}

document.getElementById("maxWrong").innerHTML = maxWrong;

function initGame() {
  chooseRandomTheme();
  generateButtons();
  generateRandomWord();
  guessedWord();
  updateMistakes();
  document.getElementById("theme").innerHTML = theme;
}
