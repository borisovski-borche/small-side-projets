console.log("functional");

//dom selecitons

//elements
const correctNumberDisplay = document.querySelector("#correctNumber");
const numberInput = document.querySelector("#numberInput");
const guessText = document.querySelector("#guessText");
const currScoreDisplay = document.querySelector("#currScore");
const highScoreDisplay = document.querySelector("#highScore");
const mainDisplay = document.querySelector(".mainDisplay");

//buttons
const resetBtn = document.querySelector("#reset");
const checkBtn = document.querySelector("#checkNumber");

//global variables
let gameover = false;
let currScore = 20;
let highScore = 0;
highScoreDisplay.innerText = highScore;
currScoreDisplay.innerText = currScore;
//funciton for determining the random number
const randomNumberFunc = () => {
  return Math.floor(Math.random() * 20) + 1;
};
let correctNumber = randomNumberFunc();

//decriment the score value
function decriment() {
  currScore--;
  currScoreDisplay.innerText = currScore;
}

//change html to display victory or reset victory scren
function displayResults(bool) {
  if (bool) {
    correctNumberDisplay.innerText = correctNumber;
    mainDisplay.classList.add("winBackground");
    numberInput.classList.add("winBackground");
    gameover = true;
  } else {
    correctNumberDisplay.innerText = "?";
    mainDisplay.classList.remove("winBackground");
    numberInput.classList.remove("winBackground");
    numberInput.value = "";
    guessText.innerText = "Start Guessing...";
  }
}
//guessText funciton
function textMsg(msg) {
  guessText.innerText = msg;
}
//set highscore function
function setHighScore() {
  if (currScore >= highScore) {
    highScore = currScore;
    highScoreDisplay.innerText = highScore;
  }
}
//function to guess the correct number
function guess(num, correct) {
  if (num) {
    if (num === correct) {
      textMsg("🔥 Correct Number!");
      displayResults(true);
      setHighScore();
      numberInput.disabled = true;
      gameover = true;
    } else if (num !== correct) {
      num > correct ? textMsg("📈 Too High!") : textMsg("📉 Too Low!");
      decriment();
    }
  } else {
    textMsg("⛔ No Number");
  }
}
// console.log(correctNumber);
//reset values function
function resetScore() {
  currScore = 20;
  currScoreDisplay.innerText = currScore;
}

//checkBtn event listener
checkBtn.addEventListener("click", () => {
  const guessValue = Number(numberInput.value);
  guess(guessValue, correctNumber);
});

//resetBtn event listener
resetBtn.addEventListener("click", () => {
  if (gameover === true) {
    correctNumber = randomNumberFunc();
    numberInput.disabled = false;
    displayResults(false);
    resetScore();
    gameover = false;
  }
});

//fullly functional and working
