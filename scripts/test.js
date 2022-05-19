const questions = JSON.parse(localStorage.questions);
let $container = document.querySelector(".container");
let $result    = document.querySelector(".result");
let $task      = document.querySelector(".task");
let $problem   = document.querySelector(".problem");
let $answer    = document.querySelector("#answer");
let $new       = document.querySelector(".new");
let $check     = document.querySelector(".check");
let $message   = document.querySelector(".message");
let $counter   = document.querySelector(".counter");

let counter = 0;

problems = JSON.parse(localStorage.problems);
problems.checkAns = function () {
  let problem = `problem${counter}`;
  this[problem].given = Number.parseInt($answer.value);
  $answer.value = "";
  this[problem].right = this[problem].ans === this[problem].given;
  return this[problem].right;
};

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomChoice(choice) {
  return choice[getRandom(0, choice.length - 1)];
}

// создает новое задание
function createNewTask(problems) {
  counter += 1;
  if (counter > questions) {
    localStorage.problems = JSON.stringify(problems);
    window.location.href = "../pages/result.html";
  } else {
    // $counter.style.color = "rgba(90, 90, 90, 0.8)";
    $counter.textContent = `${counter} задание из ${questions}`;
    $task.style.display = "block";
    $result.style.display = "none";
    $container.style.borderColor = "#4a4a4a";
    $problem.textContent = problems[`problem${counter}`].eq;
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
  // $counter.style.color = "#ebebeb";
  if (problems.checkAns()) {
    rightAns();
  } else {
    wrongAns();
  }
}

// отображается в случае правильного ответа
function rightAns() {
  // $container.style.background = "rgba(80, 255, 80, 0.5)";
  $container.style.border = "0.5vmin solid rgb(22, 255, 1)";
  $message.style.color = 'rgb(22, 255, 1)'
  $message.textContent = randomChoice([
    "Ты молодец!",
    "Так держать!",
    "Отлично!",
    "Правильно!",
  ]);
}

// отображается в случае неправильного ответа
function wrongAns() {
  // $container.style.background = "rgba(255, 55, 55, 0.5)";
  $container.style.border = "0.5vmin solid rgb(255, 55, 55)";
  $message.style.color = 'rgb(255, 55, 55)'
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