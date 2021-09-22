console.log("functional");

const dice = document.querySelectorAll(".dice-img");
const rollCount = document.querySelector("#roll-display-count");
const gameTable = document.querySelector("#game-table");
const btnRoll = document.querySelector("#btn-roll");
const btnHold = document.querySelector("#btn-hold");

//[selectors for the blockers]
const tableBlock = document.querySelector(".table-block");
const diceBlock = document.querySelector(".dice-block");

let heldDice = [];
let tries = 3;

function btnDisabled(on, off, both = false) {
  if (both) {
    on.disabled = true;
    off.disabled = true;
  } else {
    on.disabled = false;
    off.disabled = true;
  }
}
//init function
function init() {
  btnDisabled(btnRoll, btnHold);
  rollCount.innerText = tries;
}
init();
//function for disabling buttions

function selectDice() {
  for (let die of dice) {
    die.addEventListener("click", () => {
      die.classList.toggle("select");
      die.classList.remove("hold");
    });
  }
}
selectDice();

//function that selects and hold all dice
function selectAllDice() {
  for (let die of dice) {
    die.classList.add("select");
  }
  storeDiceValues();
}
//reset function
function reset() {
  tries = 3;
  btnDisabled(btnRoll, btnHold);
  rollCount.innerText = tries;
  heldDice = [];
  for (let die of dice) {
    die.classList.remove("select");
    die.classList.remove("hold");
  }
  tableBlock.classList.remove("block-hide");
  tableBlock.classList.remove("block-hide");
}

//[scoring algorithms]

//upper scoring function
function scoreUpperBox(count) {
  return heldDice.filter((el) => el === count + 1).length !== 0
    ? heldDice.filter((el) => el === count + 1).reduce((acc, el) => acc + el)
    : 0;
}
//minimax function
function scoreMiniMax() {
  return heldDice.reduce((acc, el) => acc + el);
}
//small function to create result array for 2pair and fullhouse
function createResultArr() {
  const result = [];
  for (value of heldDice) {
    heldDice.filter((el) => el === value).length >= 2 && result.push(value);
  }
  return result.sort((a, b) => a - b);
}
//two pair function
function scoreTwoPair() {
  const result = createResultArr();
  if (result[0] !== result[3]) {
    if (result.length === 4) {
      return result.reduce((acc, el) => acc + el) + 10;
    } else if (result.length === 5) {
      result
        .sort(
          (a, b) =>
            result.filter((el) => el === a).length <
            result.filter((el) => el === b).length
        )
        .shift(0);
      return result.reduce((acc, el) => acc + el) + 10;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
  // return result.length >= 4 ? result.reduce((acc, el) => acc + el) + 10 : 0;
}
//full house function
function scoreFullHouse() {
  const result = createResultArr();
  return result.length === 5 && result[0] !== result[3]
    ? result.reduce((acc, el) => acc + el) + 30
    : 0;
}
//straight function
function scoreStraight() {
  const sortedArr = heldDice.sort((a, b) => a - b);
  return sortedArr.every((el, i) => i === el - 1) ||
    sortedArr.every((el, i) => i === el - 2)
    ? 66
    : 0;
}
//mulitples function
function scoreMultiples(num, bonus) {
  for (let value of heldDice) {
    if (heldDice.filter((el) => el === value).length === num) {
      return value * num + bonus;
    }
  }
  return 0;
}
//[functions for scoring the seperate columns]

//sum upper and lower sections
const sumUpperLower = (cells, box, bool) => {
  let valuesArr = Array.from(cells).map((el) => (el = el.innerText));
  bool
    ? (valuesArr = valuesArr.filter((_, i) => i < 6))
    : (valuesArr = valuesArr.filter((_, i) => i > 7));
  if (valuesArr.some((el) => el)) {
    box.innerText = valuesArr
      .map((el) => Number(el))
      .reduce((acc, el) => acc + el);
  }
};

//sum minimax funciton
const sumMiniMaxFunc = (cells, box) => {
  const [min, max, ones] = [
    Number(cells[6].innerText),
    Number(cells[7].innerText),
    Number(cells[0].innerText),
  ];
  if (min && max && ones) {
    box.innerText = (max - min) * ones > 0 ? (max - min) * ones : 0;
  }
};
//functioon for add +30 if upper sum is >63
const upperBonus = (box) => {
  Number(box.innerText) >= 63
    ? (box.innerText = Number(box.innerText) + 30)
    : "";
};
//overall summing function
const sumAll = (elements, index) => {
  sumUpperLower(elements, sumUpperBoxes[index], true);
  upperBonus(sumUpperBoxes[index]);
  sumUpperLower(elements, sumLowerBoxes[index], false);
  sumMiniMaxFunc(elements, miniMaxBoxes[index]);
};
//function for calculcating final score
const calcFinal = (arr) => {
  return arr.map((el) => Number(el.innerText)).reduce((acc, el) => acc + el);
};
//function that contains all cases for different algorithms
const scoreCells = (elements, counter) => {
  if (counter <= 5) {
    elements[counter].innerText = scoreUpperBox(counter);
  }
  switch (counter) {
    case 6:
    case 7:
      elements[counter].innerText = scoreMiniMax();
      break;
    case 8:
      elements[counter].innerText = scoreTwoPair();
      break;
    case 9:
      elements[counter].innerText = scoreMultiples(3, 20);
      break;
    case 10:
      elements[counter].innerText = scoreStraight();
      break;
    case 11:
      elements[counter].innerText = scoreFullHouse();
      break;
    case 12:
      elements[counter].innerText = scoreMultiples(4, 40);
      break;
    case 13:
      elements[counter].innerText = scoreMultiples(5, 50);
    default:
      break;
  }
};
//[summing functions]

//[functions for scoring columns]

//function for scoring ascending and descending column
const scoreUpDownColumns = (elements, counter, bool) => {
  for (let cell of elements) {
    cell.addEventListener("click", () => {
      selectAllDice();
      scoreCells(elements, counter);
      if (bool) {
        sumAll(elements, 0);
        counter++;
      } else {
        sumAll(elements, 1);
        counter--;
      }

      reset();
    });
  }
};
//function for scoring free column
const scoreFreeAll = (elements) => {
  for (let [index, cell] of elements.entries()) {
    cell.addEventListener(
      "click",
      () => {
        selectAllDice();
        scoreCells(elements, index);
        sumAll(elements, 2);
        reset();
      },
      { once: true }
    );
  }
};
//function for scoring announce column
const announcedBoxesHandler = (elements) => {
  for (let cell of elements) {
    cell.addEventListener("click", () => {
      if (cell.innerText === "" && tries === 2) {
        cell.classList.add("announce-selected");
        tableBlock.classList.add("block-announce");
        tableBlock.classList.remove("block-hide");
      }
    });
  }
};
//function for storing the announced cell
const scoreAnnounceCell = () => {
  if (
    tries === 0 &&
    Array.from(announceBoxes).some(
      (el) => el.classList[1] === "announce-selected"
    )
  ) {
    selectAllDice();
    const indexCell = Array.from(announceBoxes).findIndex(
      (el) => el.classList[1]
    );
    scoreCells(announceBoxes, indexCell);
    sumAll(announceBoxes, 3);
    announceBoxes[indexCell].classList.remove("announce-selected");
    reset();
  }
};

//creating the dynamic table
function drawTable() {
  //[adding dynamic html for score boxes]
  //upper section html
  let tableData = "";
  //table head categoriesw
  tableData += `<tr>
    <th>By Boris.</th>
    <th>👇</th>
    <th>👆</th>
    <th>Free</th>
    <th>📢</th>
    </tr>`;
  for (let i = 1; i <= 6; i++) {
    //adding the categories
    tableData += `
    <tr>
    <td>Sum of ${i}</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  }
  //upper sum html
  tableData += `
    <tr>
    <th>Upper Total</th>
    <th class="sum-upper-box"></th>
    <th class="sum-upper-box"></th>
    <th class="sum-upper-box"></th>
    <th class="sum-upper-box"></th>
    </tr>`;
  //minimax html
  tableData += `
    <tr>
    <td>Min</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>
    <tr>
    <td>Max</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  //minimax total
  tableData += `
    <tr>
    <th>Max-Min Total</th>
    <th class="minimax-box"></th>
    <th class="minimax-box"></th>
    <th class="minimax-box"></th>
    <th class="minimax-box"></th>
    </tr>`;
  //two pair html
  tableData += `
    <tr>
    <td>Two Pair</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  //3 of a kind html
  tableData += `
    <tr>
    <td>Three of a kind</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  //straight html
  tableData += `
    <tr>
    <td>Straight</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  //full house html
  tableData += `
    <tr>
    <td>Full House</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  //4 of a kind html
  tableData += `
    <tr>
    <td>Four of a Kind</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  //5 of a kind(YAMB)
  tableData += `
    <tr>
    <td>YAMB!</td>
    <td class="descending-box"></td>
    <td class="ascending-box"></td>
    <td class="free-box"></td>
    <td class="announce-box"></td>
    </tr>`;
  //lower sum html
  tableData += `
    <tr>
    <th>Lower Total</th>
    <th class="sum-lower-box"></th>
    <th class="sum-lower-box"></th>
    <th class="sum-lower-box"></th>
    <th class="sum-lower-box"></th>
    </tr>`;
  //final score html
  tableData += `
    <tr>
    <td id="final-cell-button"><button type="button" id="final-score-btn">Show Final Score</button></td>
    <td id="final-score-cell" colspan="4"></td>
    </tr>
    `;
  //adding the table data to the HTML all at once
  gameTable.innerHTML += tableData;
}
drawTable();

const descendingBoxes = document.querySelectorAll(".descending-box");
const ascendingBoxes = document.querySelectorAll(".ascending-box");
const freeBoxes = document.querySelectorAll(".free-box");
const announceBoxes = document.querySelectorAll(".announce-box");

const miniMaxBoxes = document.querySelectorAll(".minimax-box");
const sumUpperBoxes = document.querySelectorAll(".sum-upper-box");
const sumLowerBoxes = document.querySelectorAll(".sum-lower-box");
const finalScoreBtn = document.querySelector("#final-score-btn");
const finalScoreCell = document.querySelector("#final-score-cell");
//calling the functions to score each column

//function that makes the table scorable
scoreUpDownColumns(descendingBoxes, 0, true);
scoreUpDownColumns(ascendingBoxes, 13, false);
scoreFreeAll(freeBoxes);
announcedBoxesHandler(announceBoxes);

//final result event listener
finalScoreBtn.addEventListener("click", () => {
  finalScoreCell.innerText = calcFinal([
    ...Array.from(miniMaxBoxes),
    ...Array.from(sumUpperBoxes),
    ...Array.from(sumLowerBoxes),
  ]);
});

//[functions for interacting with the dice]

//function for rolling dice
function rollDice() {
  btnRoll.disabled = true;
  if (tries > 0) {
    const diceInterval = setInterval(() => {
      for (let die of dice) {
        if (!die.classList[2]) {
          die.src = `./images/dice-${Math.floor(Math.random() * 6) + 1}.png`;
        }
      }
    }, 100);
    setTimeout(() => {
      clearInterval(diceInterval);
      btnDisabled(btnHold, btnRoll);
      if (tableBlock.classList[1] !== "block-announce") {
        tableBlock.classList.add("block-hide");
      }
      diceBlock.classList.add("block-hide");
    }, 2000);
    tries--;
    rollCount.innerText = tries;
  }
}

//function for hold dice
function storeDiceValues() {
  btnDisabled(btnRoll, btnHold);
  tries === 0 && btnDisabled(btnRoll, btnHold, true);
  heldDice = [];
  for (let die of dice) {
    if (die.classList[1] === "select") {
      heldDice.push(die.src.match(/dice-[0-9]/g)[0].match(/[0-9]/g));
      die.classList.add("hold");
    }
  }

  heldDice = heldDice.map((el) => Number(el));
  //function to score the announced cell

  diceBlock.classList.remove("block-hide");
  console.log(heldDice);
}

//[event handlers]
function removeBlock() {
  tries === 0 && tableBlock.classList.remove("block-announce");
}

btnRoll.addEventListener("click", rollDice);
btnHold.addEventListener("click", () => {
  removeBlock();
  storeDiceValues();
  scoreAnnounceCell();
});
