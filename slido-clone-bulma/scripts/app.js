//dom selectors for the pages
const quizLandingPage = document.querySelector(".quiz-landing-page");
const quizCreatePage = document.querySelector(".quiz-create-page");
const quizPlayPage = document.querySelector(".quiz-play-page");

//[LANDING PAGE SELECTORS]

//player login and select qui
const playerUsernameInput = document.querySelector("#player-username-input");
const playerLoginError = document.querySelector("#player-login-error");
const playerStartBtn = document.querySelector("#player-start-btn");
const quizListDisplay = document.querySelector("#quiz-list-display");

//admin login and logout
const adminUsernameInput = document.querySelector("#admin-username-input");
const adminPasswordInput = document.querySelector("#admin-password-input");
const adminLoginError = document.querySelector("#admin-login-error");
const adminLoginBtn = document.querySelector("#admin-login-btn");
const adminUsernameDisplay = document.querySelector("#admin-username-display");
const adminLogoutBtn = document.querySelector("#admin-logout-btn");

//[CREATE QUIZ SELECTORS]

//inputs
const questionTextInput = document.querySelector("#question-text-input");
const addAnswerInput = document.querySelector("#add-answer-input");
const answerTimeInput = document.querySelector("#answer-time-input");
//containers
const createFormError = document.querySelector("#create-form-error");
const createQuestionError = document.querySelector("#create-question-error");
const questionPreviewText = document.querySelector("#question-preview-text");
const questionPreviewList = document.querySelector("#question-preview-list");

//buttons
const answerRightBtn = document.querySelector("#answer-add-right-btn");
const answerWrongBtn = document.querySelector("#answer-add-wrong-btn");
const addQuestionBtn = document.querySelector("#add-question-btn");
const resetQuestionBtn = document.querySelector("#reset-question-btn");

//[QUIZ PREVIEW SELECTORS]

//inputs
const quizNameInput = document.querySelector("#quiz-name-input");
const quizSelectStars = document.querySelector("#quiz-select-stars");
//containers
const quizPreviewName = document.querySelector("#quiz-preview-name");
const quizPreviewStars = document.querySelector("#quiz-preview-stars");
const quizPreviewDisplay = document.querySelector("#quiz-preview-display");
const createQuizError = document.querySelector("#create-quiz-error");
//buttons
const quizCreateBtn = document.querySelector("#quiz-create-btn");
const quizResetBtn = document.querySelector("#quiz-reset-btn");

//[QUIZ PLAY SELECTORS]

//buttons
const submitAnswerBtn = document.querySelector("#submit-answer-btn");
//containers
const questionPlayBox = document.querySelector(".question-play-box");
const victoryModal = document.querySelector("#victory-modal");
//[DATA ARRAYS]

const admins = [];
const allQuizes = [];
let tempQuestions = [];
let selectedQuiz;
//[CLASSES]

//ADMINS
class Admin {
  username;
  #password;
  constructor(username, password, displayName) {
    this.username = username;
    this.#password = password;
    this.displayName = displayName;
  }
  validateAdmin(usernameInput, passwordInput) {
    return usernameInput === this.username && passwordInput === this.#password
      ? true
      : false;
  }
}
//creating 2 working admins
admins.push(new Admin("boris", "12345", "Boris the Slav"));
admins.push(new Admin("maya23", "asd", "Maya Raya"));

//QUESTION
class Question {
  constructor(content, rightAnswer, allAnswers, answerTime) {
    this.content = content;
    this.rightAnswer = rightAnswer;
    this.allAnswers = allAnswers;
    this.answerTime = Number(answerTime);
  }
}
//QUIZ
class Quiz {
  constructor(name, difficulty, questions, author) {
    this.name = name;
    this.difficulty = difficulty;
    this.questions = questions;
    this.author = author;
    this.quizId = Math.floor(Math.random() * 899) + 100;
  }
}

//creating 2 quiz for start
allQuizes.push(
  new Quiz(
    "Basic Math",
    5,
    [
      new Question("What is 2+2", "4", ["3", "4", "5"], 15),
      new Question("What is 5+5", "10", ["8", "7", "10", "11"], 15),
      new Question("What is 10x15", "150", ["200", "175", "150", "225"], 10),
      new Question("What is 7x8", "56", ["65", "56", "32", "80"], 10),
      new Question("What is 2x2x2x2", "16", ["16", "18", "20", "22"], 10),
      new Question(
        "What is 60+60-50+60",
        "160",
        ["150", "160", "200", "250"],
        10
      ),
      new Question("What is 9x19", "171", ["171", "180", "175", "199"], 10),
    ],
    "boris"
  )
);
allQuizes.push(
  new Quiz(
    "Europe Capitals",
    4,
    [
      new Question(
        "What is the capital of Poland",
        "Warsaw",
        ["London", "Paris", "Madrid", "Warsaw"],
        15
      ),
      new Question(
        "What is the capital of Slovenia",
        "Ljubljana",
        ["Zagreb", "Sarajevo", "Belgrade", "Ljubljana"],
        15
      ),
      new Question(
        "What is the capital of Sweden",
        "Stockholm",
        ["Oslo", "Helsinki", "Stockholm", "Copenhagen"],
        10
      ),
      new Question("What is the capital of Portugal", "Lisbon", [
        "Porto",
        "Valencia",
        "Lisbon",
        "Barcelona",
      ]),
    ],
    "maya23"
  )
);
allQuizes.push(
  new Quiz(
    "Basic Math",
    3,
    [
      new Question("What is 2+2", "4", ["3", "4", "5"], 15),
      new Question("What is 5+5", "10", ["8", "7", "10", "11"], 15),
      new Question("What is 10x15", "150", ["200", "175", "150", "225"], 10),
      new Question("What is 7x8", "56", ["65", "56", "32", "80"]),
      new Question("What is 2x2x2x2", "16", ["16", "18", "20", "22"]),
    ],
    "maya23"
  )
);
//init
// hidePages(quizPlayPage, [quizCreatePage, quizLandingPage]);

hidePages(quizLandingPage, [quizCreatePage, quizPlayPage]);

//[FUNCTIONS]

//validating a question before adding it
const validateQuestion = (inputs, timerValue, answerList) => {
  if (
    !validateInputs(inputs) ||
    Number(timerValue) < 10 ||
    Number(timerValue) > 60 ||
    !answerList.find(el => el.classList.contains("right-answer")) ||
    answerList.length < 2
  ) {
    createQuestionError.innerText =
      "Question must have all fields valid: Question text,1 right answer, 2-10 total answers , 10-60s answering time,";
    return false;
  }
  createQuestionError.innerText = "";
  return true;
};
//validating quiz
const validateQuiz = (name, container) => {
  if (!name || container.children.length < 1) {
    createQuizError.innerText =
      "Quiz must have a valid name and be atleast 1 questions long";
    return false;
  }
  createQuizError.innerText = "";
  return true;
};
//validate quiz select
const validateQuizSelect = (playerName, elements, errorMsg) => {
  if (
    !playerName ||
    ![...elements].find(element => element.classList.contains("selected-quiz"))
  ) {
    errorMsg.innerText = "Quiz must be selected and name shouldn't be empty";
    return false;
  }
  return true;
};

//creating a new quiz;

//display difficulty
const displayDifficulty = (num, container) => {
  [...container.children]
    .filter((_, i) => i > num)
    .forEach(el => el.classList.remove("fas"));
  [...container.children]
    .filter((_, i) => i < num)
    .forEach(el => el.classList.add("fas"));
};
//rendering the landing page quiz list
const renderQuizList = (quizesArr, container) => {
  clearHTML([container]);
  quizesArr.forEach(quiz => {
    container.insertAdjacentHTML(
      "beforeEnd",
      `<li class="mb-2 quiz-list-li" data-quiz-id="${quiz.quizId}">
      <p class="has-text-weight-semibold">${quiz.name} <span class="quiz-list-stars-${quiz.quizId}">
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      </span> </p>
      <div class="is-flex is-justify-content-space-between is-align-items-flex-end">
        <p class="is-size-7">creator: <span class="has-text-weight-semibold">${quiz.author}</p>
        <p class="is-size-7">questions: <span class=" is-size-6 has-text-weight-bold">${quiz.questions.length}</span></p>
      </div>    
  </li>
    `
    );
    displayDifficulty(
      quiz.difficulty,
      document.querySelector(`.quiz-list-stars-${quiz.quizId}`)
    );
  });
};

//rendering the quiz-preview box
const renderQuizPreview = (questions, container) => {
  clearHTML([container]);
  questions.forEach(question => {
    container.insertAdjacentHTML(
      "beforeEnd",
      `<div class="box mb-2 question-preview-box">
        <button class="delete"></button> 
        <p class= "is-size-5 stopwatch"><i class="fas fa-stopwatch"></i>: ${question.answerTime}</p> 
        <p class="has-text-weight-bold is-size-6">Q: ${question.content} </p> 
        <p class="has-text-success has-text-weight-bold">A: ${question.rightAnswer} <i class="fas fa-check"></i></p>
      </div>
    `
    );
  });
};
//rendering the play page header
const renderQuizHeader = (quiz, container, nameInput) => {
  clearHTML([container]);
  container.innerHTML = `
    <p><i class="fas fa-user is-size-5"></i> ${nameInput}</p>
      <div>
        <p class="is-size-3 has-text-weight-semibold">${quiz.name}</p>
        <p class="is-size-5 has-text-centered " id="quiz-header-stars">
        <i class="fas fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
      </p>
     </div>
  <p class="is-size-3" id="questions-counter-display">1/${quiz.questions.length}</p>`;
  displayDifficulty(
    quiz.difficulty,
    document.querySelector("#quiz-header-stars")
  );
};
const renderQuestion = (question, container) => {
  clearHTML([container]);
  container.innerHTML = `
  <div class="box is-size-5 is-flex is-justify-content-space-between is-align-items-baseline mb-0">
      <p class="is-size-4 has-text-weight-semibold">Q: ${question.content}</p> 
    <p class="is-size-3"><i class="fas fa-stopwatch"></i> ${question.answerTime}</p>
  </div>
  <progress class="progress is-radiusless is-primary" value="0" max="100" ></progress>
  <div class="ml-4 is-size-5 ">
    <ol class="ml-4 question-answer-list" >
    </ol>`;
  const answerList = document.querySelector(".question-answer-list");
  question.allAnswers.forEach(answer => {
    answerList.insertAdjacentHTML(
      "beforeEnd",
      `<li>
        <div class="control is-size-5 answer-text-box">
      <label class="radio answer-label">
      <input type="radio" name="answer" class="radio-input" value="${answer}">
      ${answer}
      </label>
      </div>
      </li>`
    );
  });
  container.insertAdjacentHTML(
    "beforeEnd",
    `<button class="submit-answer-btn button is-primary">SUBMIT!</button>`
  );
};
//
const renderVictoryModal = (
  correctCount,
  totalQuestions,
  container,
  playerName
) => {
  clearHTML([container]);
  container.innerHTML = `
          <div class="modal-background"></div>
              <div class="modal-content is-flex is-flex-direction-column is-align-items-center">
                <div class="is-size-6 box has-text-centered px-5 py-5">
                <div class="is-size-3 mb-3">Congratulations <span class="has-text-weight-bold is-size-2">${playerName}</span> you got <span class="has-text-weight-bold is-size-2 ">${correctCount}/${totalQuestions}</span> questions right and you receive a</div>
                <div><i class="medal-icon fas fa-medal"></i>
                <p class="is-size-3 has-text-weight-bold mt-3 medal-title">BRONZE MEDAL</p></div>
                </div>
              <div><button class="button has-text-weight-bold" id="victory-modal-btn">Back to Homepage</button></div>
          </div>`;
  const correctPercent = (correctCount / totalQuestions) * 100;
  const medalTitle = container.querySelector(".medal-title");
  const medalBox = container.querySelector(".medal-icon");
  if (correctPercent < 40) {
    medalBox.classList.remove("fa-medal");
    medalBox.classList.add("fa-award", "ribbon");
    medalTitle.innerText = "PARTICIPATION RIBBON";
  } else if (correctPercent < 60) {
    medalBox.classList.add("bronze-medal");
    medalTitle.innerText = "BRONZE MEDAL";
  } else if (correctPercent < 80) {
    medalBox.classList.add("silver-medal");
    medalTitle.innerText = "SILVER MEDAL";
  } else {
    medalBox.classList.add("gold-medal");
    medalTitle.innerText = "GOLD MEDAL";
  }
  // const
};
//check answer
const checkAnswer = (question, selectedAnswer) => {
  if (question.rightAnswer === selectedAnswer) {
    return true;
  }
  return false;
};
const renderAnswerColors = (question, displayedAnswers) => {
  console.log(question);
  console.log(displayedAnswers);
  const selectedAnswer = displayedAnswers.find(radio => radio.checked === true);
  const rightAnswer = displayedAnswers.find(
    radio => radio.value === question.rightAnswer
  );
  rightAnswer
    .closest("label")
    .classList.add("has-text-weight-bold", "has-text-success");
  rightAnswer
    .closest("label")
    .insertAdjacentHTML("beforeEnd", ` <i class="fas fa-check"></i>`);

  if (selectedAnswer.value !== question.rightAnswer) {
    selectedAnswer
      .closest("label")
      .classList.add("has-text-weight-bold", "has-text-danger");
    selectedAnswer
      .closest("label")
      .insertAdjacentHTML("beforeEnd", ` <i class="fas fa-times-circle"></i>`);
  }
};

//reset create page
const resetQuizCreate = () => {
  cleanInputs([quizNameInput]);
  tempQuestions = [];
  clearHTML([quizPreviewDisplay]);
  quizPreviewName.innerText = "Example name";
  displayDifficulty(0, quizSelectStars);
};

//umbrella function for playing the quiz
const playQuiz = (quiz, count) => {
  document.querySelector("#questions-counter-display").innerText = `${
    count + 1
  }/${quiz.questions.length}`;
  renderQuestion(quiz.questions[count], questionPlayBox);
};

//[EVENT HANDLERS]

// admin login and logout handlers
const adminLoginHandlers = () => {
  adminLoginBtn.addEventListener("click", () => {
    const loggedInAdmin = admins.find(
      admin =>
        !!admin.validateAdmin(
          adminUsernameInput.value,
          adminPasswordInput.value
        )
    );
    if (loggedInAdmin) {
      adminUsernameDisplay.innerText = loggedInAdmin.username;
      hidePages(quizCreatePage, [quizLandingPage, quizPlayPage]);
    } else {
      adminLoginError.innerText = "Invalid Username or Password";
    }
    cleanInputs([adminUsernameInput, adminPasswordInput]);
  });
  adminLogoutBtn.addEventListener("click", () => {
    hidePages(quizLandingPage, [quizCreatePage, quizPlayPage]);
    resetQuizCreate();
  });
};
//user select quiz and start playing handlers
const userSelectQuizHandlers = () => {
  quizListDisplay.addEventListener("click", e => {
    selectOnlyOne(
      e.target.closest(".quiz-list-li"),
      [...quizListDisplay.children],
      "selected-quiz"
    );
    selectedQuiz = allQuizes.find(
      quiz =>
        quiz.quizId === Number(e.target.closest(".quiz-list-li").dataset.quizId)
    );
  });
  playerStartBtn.addEventListener("click", () => {
    if (
      validateQuizSelect(
        playerUsernameInput.value,
        quizListDisplay.children,
        playerLoginError
      )
    )
      hidePages(quizPlayPage, [quizCreatePage, quizLandingPage]);
    renderQuizHeader(
      selectedQuiz,
      document.querySelector(".quiz-heading-box"),
      playerUsernameInput.value
    );
    playQuiz(selectedQuiz, 0);
  });
};

//creating question and adding answers
const questionPreviewHandlers = () => {
  questionTextInput.addEventListener("input", () => {
    questionPreviewText.innerText = questionTextInput.value;
  });
  answerWrongBtn.addEventListener("click", () => {
    if (!validateInputs([addAnswerInput])) {
      createFormError.innerText = "Answer Field Must Be Filled";
      return;
    }
    if (questionPreviewList.children.length === 10) {
      createFormError.innerText = "Answer Limit Reached";
      return;
    }
    questionPreviewList.insertAdjacentHTML(
      "beforeend",
      `<li>${addAnswerInput.value}</li>`
    );
    cleanInputs([addAnswerInput]);
  });
  answerRightBtn.addEventListener("click", () => {
    if (!validateInputs([addAnswerInput])) {
      createFormError.innerText = "Answer Field Must Be Filled";
      return;
    }
    if (questionPreviewList.children.length === 10) {
      createFormError.innerText = "Answer Limit Reached";
      return;
    }
    questionPreviewList.insertAdjacentHTML(
      "beforeend",
      ` <li class="has-text-success has-text-weight-bold right-answer">
      ${addAnswerInput.value} <i class="fas fa-check"></i></li>`
    );
    cleanInputs([addAnswerInput]);
    answerRightBtn.disabled = true;
  });
};
//adding questions handlers
const questionAddHandlers = () => {
  addQuestionBtn.addEventListener("click", () => {
    if (
      validateQuestion([questionTextInput], answerTimeInput.value, [
        ...questionPreviewList.children,
      ])
    ) {
      const allAnswers = [...questionPreviewList.children].map(
        el => el.innerText
      );
      const correct = [...questionPreviewList.children].find(el =>
        el.classList.contains("right-answer")
      );
      tempQuestions.push(
        new Question(
          questionTextInput.value,
          correct.innerText,
          allAnswers,
          answerTimeInput.value
        )
      );
      renderQuizPreview(tempQuestions, quizPreviewDisplay);
      cleanInputs([questionTextInput, answerTimeInput]);
      clearHTML([questionPreviewList, questionPreviewText]);
      answerRightBtn.disabled = false;
    }
  });
  resetQuestionBtn.addEventListener("click", () => {
    cleanInputs([questionTextInput, answerTimeInput]);
    clearHTML([questionPreviewList, questionPreviewText]);
    answerRightBtn.disabled = true;
  });
};
//adding listeners for the quiz preview
const quizPreviewHandlers = () => {
  quizNameInput.addEventListener("input", () => {
    quizPreviewName.innerText = quizNameInput.value;
  });
  quizSelectStars.addEventListener("mouseover", e => {
    if (e.target.classList.contains("fa-star")) {
      const index = [...quizSelectStars.children].findIndex(
        el => el === e.target
      );
      displayDifficulty(index + 1, quizSelectStars);
    }
    quizPreviewStars.innerHTML = quizSelectStars.innerHTML;
  });
  quizPreviewDisplay.addEventListener("click", e => {
    if (e.target.classList.contains("delete")) {
      e.target.closest(".question-preview-box").remove();
    }
  });
};
//quiz create event handlers
const quizCreateHandlers = () => {
  quizCreateBtn.addEventListener("click", () => {
    if (validateQuiz(quizNameInput.value, quizPreviewDisplay)) {
      const difficulty = [...quizPreviewStars.children].filter(star =>
        star.classList.contains("fas")
      ).length;
      allQuizes.push(
        new Quiz(
          quizNameInput.value,
          difficulty,
          tempQuestions,
          adminUsernameDisplay.innerText
        )
      );
    }
    resetQuizCreate();
    renderQuizList(allQuizes, quizListDisplay);
  });

  quizResetBtn.addEventListener("click", () => {
    resetQuizCreate();
  });
};
//play quiz and  change question handlers
const playQuizHandlers = () => {
  let count = 0;
  let correctCount = 0;
  let rightAnswer;
  questionPlayBox.addEventListener("click", e => {
    if (e.target.classList.contains("submit-answer-btn")) {
      if (rightAnswer) correctCount++;

      renderAnswerColors(selectedQuiz.questions[count], [
        ...questionPlayBox.querySelectorAll(".radio-input"),
      ]);

      if (count === selectedQuiz.questions.length - 1) {
        setTimeout(() => {
          renderVictoryModal(
            correctCount,
            selectedQuiz.questions.length,
            victoryModal,
            playerUsernameInput.value
          );
        }, 1000);
        victoryModal.classList.add("is-active");
        return;
      }
      count++;
      questionPlayBox.querySelector(".submit-answer-btn").disabled = true;
      setTimeout(() => {
        playQuiz(selectedQuiz, count);
        questionPlayBox.querySelector(".submit-answer-btn").disabled = false;
      }, 1500);
    }
    if (e.target.classList.contains("radio-input")) {
      rightAnswer = checkAnswer(selectedQuiz.questions[count], e.target.value);
      selectOnlyOne(
        e.target.closest("label"),
        questionPlayBox.querySelectorAll("label"),
        "has-text-info",
        "has-text-weight-bold"
      );
    }
  });
  victoryModal.addEventListener("click", e => {
    if (e.target.id === "victory-modal-btn") {
      hidePages(quizLandingPage, [quizCreatePage, quizPlayPage]);
      victoryModal.classList.remove("is-active");
      cleanInputs([playerUsernameInput]);
      selectOnlyOne(null, [...quizListDisplay.children], "selected-quiz");
      count = 0;
      correctCount = 0;
    }
  });
};

renderQuizList(allQuizes, quizListDisplay);

adminLoginHandlers();
userSelectQuizHandlers();
questionAddHandlers();
questionPreviewHandlers();
quizPreviewHandlers();
quizCreateHandlers();
playQuizHandlers();
