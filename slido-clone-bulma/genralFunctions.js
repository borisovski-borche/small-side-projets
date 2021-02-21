const cleanInputs = inputs => {
  inputs.forEach(input => (input.value = ""));
};
const hidePages = (show, hiddenPages) => {
  show.style.display = "";
  hiddenPages.forEach(page => (page.style.display = "none"));
};
