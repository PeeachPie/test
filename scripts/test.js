"use strict";

const questions = JSON.parse(localStorage.questions);
let $container = document.querySelector(".container");
let $result = document.querySelector(".result");
let $task = document.querySelector(".task");
let $problem = document.querySelector(".problem");
let $answer = document.querySelector("#answer");
let $new = document.querySelector(".new");
let $check = document.querySelector(".check");
let $message = document.querySelector(".message");
let $counter = document.querySelector(".counter");

let counter = 0;

let problems = JSON.parse(localStorage.problems);

problems.checkAns = function () {
  this[counter].given = Number.parseInt($answer.value);
  $answer.value = "";
  this[counter].right = this[counter].ans === this[counter].given;
  counter++;
  return this[counter - 1].right;
};

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomChoice(choice) {
  return choice[getRandom(0, choice.length - 1)];
}

// создает новое задание
function createNewTask(problems) {
  if (counter + 1 > questions) {
    localStorage.problems = JSON.stringify(problems);
    window.location.href = "../pages/result.html";
  } else {
    $counter.textContent = `${counter + 1} задание из ${questions}`;
    $task.style.display = "block";
    $result.style.display = "none";
    $container.style.borderColor = "#4a4a4a";
    $problem.textContent = problems[counter].eq;
  }
}

function change(...elements) {
  for (let el of elements) {
    el.style.display = el.style.display === "block" ? "none" : "block";
  }
}

// показывает результат ответа
function showAns() {
  $task.style.display = "none";
  $result.style.display = "block";
  problems.checkAns() ? rightAns() : wrongAns();
}

// отображается в случае правильного ответа
function rightAns() {
  $container.style.border = "0.5vmin solid rgb(22, 255, 1)";
  $message.style.color = "rgb(22, 255, 1)";
  $message.textContent = randomChoice([
    "Ты молодец!",
    "Так держать!",
    "Отлично!",
    "Правильно!",
  ]);
}

// отображается в случае неправильного ответа
function wrongAns() {
  $container.style.border = "0.5vmin solid rgb(255, 55, 55)";
  $message.style.color = "rgb(255, 55, 55)";
  $message.textContent = randomChoice([
    "Ой...",
    "Ошибка!",
    "Внимательнее!",
    "Неправильно!",
  ]);
}

$check.addEventListener("click", showAns);
$answer.addEventListener("change", showAns);
$new.addEventListener("click", createNewTask.bind(null, problems));

createNewTask(problems);

