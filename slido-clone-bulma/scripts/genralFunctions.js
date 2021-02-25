//script for all general functions

const cleanInputs = inputs => inputs.forEach(input => (input.value = ""));

const hidePages = (show, hiddenPages) => {
  show.style.display = "";
  hiddenPages.forEach(page => (page.style.display = "none"));
};
const validateInputs = inputs => {
  return inputs.every(input => input.value) ? true : false;
};
const clearHTML = containers =>
  containers.forEach(container => (container.innerHTML = ""));

const selectOnlyOne = (selected, elements, className) => {
  elements.forEach(element => element.classList.remove(className));
  selected.classList.add(className);
};
