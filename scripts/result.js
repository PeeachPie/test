"use strict";

import { Task } from './Tasks.js';

const $answers = document.querySelector(".answers");
const $right   = document.querySelector(".rightAns");
const $correct = document.querySelector(".correct");
const $home    = document.querySelector(".home");

let Tasks = new Task({
  operators: ["+"],
  numbers: [1],
  max: 10,  
  questions: JSON.parse(localStorage.getItem("questions"))
})

Tasks.problems = JSON.parse(localStorage.getItem("problems"));

// показывает результаты ответов
function showAnswers() {
  for (let i = 0; i < Tasks.questions; i++) {
    let el = document.createElement("div");
    el.className = Tasks.problems[i].right ? "right" : "wrong";
    el.innerHTML = `
    ${Tasks.problems[i].eq}
    ${Tasks.problems[i].given == null ? "" : Tasks.problems[i].given}
    ${Tasks.problems[i].right ? "" : `&nbsp;&nbsp;(${Tasks.problems[i].ans})`}
    `;
    $answers.append(el);
  }
}

// выбирает и устанавливает неправильно решенные примеры
function correctionOfMistakes() {
  localStorage.setItem("problems", JSON.stringify(Tasks.wrongProblems));
  localStorage.setItem("questions", JSON.stringify(Tasks.questions - Tasks.right));
}

// демонстрирует результат тестирования
function showResult() {
  $right.textContent = `Результат: ${Tasks.right} из ${Tasks.questions}`;
  showAnswers();
}

showResult();

if (Tasks.questions == Tasks.right) {
  $correct.style.display = "none";
}

$correct.addEventListener("click", () => {
  correctionOfMistakes();
  window.location.href = "../pages/test.html";
});

$home.addEventListener("click", () => {
  window.location.href = "../index.html";
});
