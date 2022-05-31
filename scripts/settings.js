"use strict";

import { Task } from './Tasks.js';

const $info =  document.querySelector(".info");

const $questionsSettings = document.querySelector(".questions-settings");

const $questionsNumber = document.querySelector("#questions-number");
const $questionsRange = document.querySelector("#questions-range");

const $operatorsSettings = document.querySelector(".operators-settings");

const $operators = document.querySelectorAll(".operators .choose > *");
const $numbers = document.querySelectorAll(".numbers .choose > *");

const $numbersBlock = document.querySelector(".numbers");
const $maxBlock = document.querySelector(".max");

const $next = document.querySelector("#next");
const $reset = document.querySelector("#reset");
const $resetPath = document.querySelector("#reset-svg-path")
const $return = document.querySelector("#return");
const $start = document.querySelector("#start");

const $maxRange = document.querySelector("#max-range");
const $maxNumber = document.querySelector("#max-number");

let Tasks = new Task()

// обрабатывает событие двойного нажатия
function doubleClick(button) {
  let time = new Date().getTime();
  button.addEventListener("click",() => {
      if (new Date().getTime() - time <= 300) {
        selectNumbersBefore(button);
      }
    },
    { once: true }
  );
}

// выбирает делители/множители до нажатой кнопки включая ее
function selectNumbersBefore(button) {
  let num = Number(button.textContent) - 1;
  for (let j = num; j >= 0; j--) {
    if ($numbers[j].className === "unselected") {
      Tasks.setNumber(j + 1, $numbers[j]);
    }
  }
}

// устанавливает максимальное значение для сложения/вычитания
function setMax() {
  $maxNumber.value = $maxRange.value;
  changeFill(((Number($maxRange.value) - 10) / 90) * 100, $maxRange);
  Tasks.max = Number($maxRange.value);
}

// устанавливает значение вопросов
function setQuestions() {
  $questionsNumber.value = $questionsRange.value;
  changeFill(((Number($questionsRange.value) - 5) / 25) * 100, $questionsRange);
  Tasks.questions = Number($questionsRange.value);
}

// изменяет заполнение input type="range"
function changeFill(perсent, range) {
  if (perсent >= 80) {
    perсent--;
  } else if (perсent <= 12) {
    perсent++;
  }
  range.style.background = `linear-gradient(90deg, 
  rgb(212,0,255) ${perсent}%, 
  #1f1f1f ${perсent}%)`;
}

// сбрасывает настройки
function resetSettings() {
  $numbers.forEach(($num) => ($num.className = "unselected"));

  $operators.forEach(($operator) => ($operator.className = "unselected"));

  Tasks.reset();

  $questionsRange.value = $questionsNumber.value = "5";
  $maxRange.value = $maxNumber.value = "10";

  changeFill(0, $maxRange);
  changeFill(0, $questionsRange);

  unableButton($next)
  $reset.style.pointerEvents = "none"
  $resetPath.style.fill = '#777777';

  showElement($info)
}

function hideElement(element) {
  element.style.display = "none";
}

function showElement(element) {
  element.style.display = "flex";
}

for (let i = 0; i < $operators.length; i++) {
  $operators[i].addEventListener("click", Tasks.setOperator.bind(Tasks, ["+", "-", "*", "/"][i], $operators[i]));
}

for (let i = 0; i < $numbers.length; i++) {
  $numbers[i].addEventListener("click", Tasks.setNumber.bind(Tasks, i + 1, $numbers[i]));
  $numbers[i].addEventListener("click", doubleClick.bind(null, $numbers[i]));
}

$maxNumber.addEventListener("change", () => {
  $maxRange.value = $maxNumber.value;
  setMax();
});

$maxRange.addEventListener("input", setMax);

$questionsNumber.addEventListener("change", () => {
  $questionsRange.value = $questionsNumber.value;
  setQuestions();
});

$questionsRange.addEventListener("input", setQuestions);

$start.addEventListener("click", () => {
  Tasks.createProblems()
  localStorage.setItem("problems", JSON.stringify(Tasks.problems));
  localStorage.setItem("questions", JSON.stringify(Tasks.questions));
});

// window.addEventListener("load", resetSettings);
window.addEventListener("unload", resetSettings);

function ableButton(button) {
  button.style.color = "#ebebeb"
  button.style.pointerEvents = "auto"
}

function unableButton(button) {
  button.style.color = "#777777"
  button.style.pointerEvents = "none"
}

window.addEventListener("click", () => {
  Tasks.operators.includes("+") || Tasks.operators.includes("-")
    ? showElement($maxBlock)
    : hideElement($maxBlock);
  Tasks.operators.includes("*") || Tasks.operators.includes("/")
    ? showElement($numbersBlock)
    : hideElement($numbersBlock);

  if (Tasks.operators.length > 0) {
    $reset.style.pointerEvents = "auto";
    $resetPath.style.fill = '#ebebeb';
    hideElement($info);
  }

  if ((Tasks.operators.includes("*") || Tasks.operators.includes("/"))) {
    Tasks.numbers.length > 0 ? ableButton($next) : unableButton($next);
  } 
  else if (Tasks.operators.includes("+") || Tasks.operators.includes("-")) {
    ableButton($next);
  }
});

$reset.addEventListener("click", resetSettings);

$next.addEventListener("click", () => {
  hideElement($operatorsSettings);
  showElement($questionsSettings);
});

$return.addEventListener("click", () => {
  hideElement($questionsSettings);
  showElement($operatorsSettings);
});
