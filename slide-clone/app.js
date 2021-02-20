console.log("Functional");

// [DOM SELECTORS]

//dom selectors for the pages
const quizLandingPage = document.querySelector(".quiz-landing-page");
const quizCreatePage = document.querySelector(".quiz-create-page");
const quizPlayPage = document.querySelector(".quiz-play-page");

//admin login and logout
const adminUsernameInput = document.querySelector("#admin-username");
const adminPasswordInput = document.querySelector("#admin-password");
const adminLoginError = document.querySelector("#admin-login-error");
const adminLoginBtn = document.querySelector("#admin-login-button");
const adminUsernameDisplay = document.querySelector("#admin-username-display");
const adminLogoutBtn = document.querySelector("#admin-logout-btn");
//global data variables
const admins = [];

//class for the admin
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
admins.push(new Admin("boris", "12345", "Boris the Slav"));
admins.push(new Admin("maya23", "asd", "Maya Raya"));
//functions hiding the pages
const hidePages = (show, hiddenPages) => {
  hiddenPages.forEach(page => {
    page.classList.add("hide-page");
  });
  show.classList.remove("hide-page");
};

hidePages(quizLandingPage, [quizCreatePage, quizPlayPage]);
//function for cleaning inputs
const cleanInputs = inputs => inputs.forEach(input => (input.value = ""));

//[EVENT HANDLERS]

//admin login and logout
adminLoginBtn.addEventListener("click", () => {
  const loggedInAdmin = admins.find(
    admin =>
      !!admin.validateAdmin(adminUsernameInput.value, adminPasswordInput.value)
  );
  if (loggedInAdmin) {
    adminUsernameDisplay.innerText = `Welcome, ${loggedInAdmin.username}`;
    hidePages(quizCreatePage, [quizLandingPage, quizPlayPage]);
    cleanInputs([adminUsernameInput, adminPasswordInput]);
  } else {
    adminLoginError.innerText = "Invalid Login";
    cleanInputs([adminUsernameInput, adminPasswordInput]);
  }
});
adminLogoutBtn.addEventListener("click", () => {
  hidePages(quizLandingPage, [quizCreatePage, quizPlayPage]);
});
