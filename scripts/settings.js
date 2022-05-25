"use strict";

// import {getRandom, randomChoice} from './utilits.js';
import { Task } from './Tasks.js';

const $questionsSettings = document.querySelector(".questions-settings");

const $questionsNumber = document.querySelector("#q");
const $questionsRange = document.querySelector("#questions");

const $operatorsSettings = document.querySelector(".operators-settings");

const $operators = document.querySelectorAll(".operators .choose > *");
const $numbers = document.querySelectorAll(".numbers .choose > *");

// const [$plus, $minus, $multiply, $division] = $operators;
// const [$n1, $n2, $n3, $n4, $n5, $n6, $n7, $n8, $n9, $n10] = $numbers;

const $numbersBlock = document.querySelector(".numbers");
const $maxBlock = document.querySelector(".max");

const $next = document.querySelector("#next");
const $reset = document.querySelector("#reset");
const $return = document.querySelector("#return");
const $start = document.querySelector("#start");

const $maxRange = document.querySelector("#max");
const $maxNumber = document.querySelector("#m");

let Tasks = new Task({
  operators: ["+"],
  numbers: [1],
  max: 10,  
  questions: 5
})

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
  rgb(22, 255, 1) ${perсent}%, 
  #1f1f1f ${perсent}%)`;
}

// сбрасывает настройки
function resetSettings() {
  $numbers.forEach(($num) => ($num.className = "unselected"));
  $numbers[0].className = "selected";

  $operators.forEach(($operator) => ($operator.className = "unselected"));
  $operators[0].className = "selected";

  Tasks.operators = ["+"];
  Tasks.numbers = [1];
  Tasks.max = 10;
  Tasks.questions = 5;

  $questionsRange.value = "5";
  $maxRange.value = "10";
  $questionsNumber.value = "5";
  $maxNumber.value = "10";

  changeFill(0, $maxRange);
  changeFill(0, $questionsRange);
}

function hideElement(element) {
  element.style.display = "none";
  // element.hidden = true;
}

function showElement(element) {
  element.style.display = "flex";
  // element.hidden = false;
}

for (let i = 0; i < $operators.length; i++) {
  $operators[i].addEventListener("click", Tasks.setOperator.bind(Tasks, ["+", "-", "*", "/"][i], $operators[i]));
}

for (let i = 0; i < $numbers.length; i++) {
  $numbers[i].addEventListener("click", Tasks.setNumber.bind(Tasks, i + 1, $numbers[i]));
  $numbers[i].addEventListener("click", doubleClick.bind(null, $numbers[i]));
}

// $numbersBlock.addEventListener("click", (event) => {

// })

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
  Tasks.createEquations()
  localStorage.setItem("problems", JSON.stringify(Tasks.problems));
  localStorage.setItem("questions", JSON.stringify(Tasks.questions));
  window.location.href = "../pages/test.html";
});

window.addEventListener("load", resetSettings);
window.addEventListener("unload", resetSettings);

window.addEventListener("click", () => {
  if (Tasks.operators.includes("+") || Tasks.operators.includes("-")) {
    showElement($maxBlock);
  } else {
    hideElement($maxBlock);
  }
  if (Tasks.operators.includes("*") || Tasks.operators.includes("/")) {
    showElement($numbersBlock);
  } else {
    hideElement($numbersBlock);
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

// $numbersBlock.addEventListener("click", (event) => {
//   Tasks.setNumber(2, event.target)
// })