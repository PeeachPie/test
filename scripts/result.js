"use strict";

const problems  = JSON.parse(localStorage.problems);
const questions = JSON.parse(localStorage.questions);

let $answers = document.querySelector(".answers");
let $right   = document.querySelector(".rightAns");
let $correct = document.querySelector(".correct");
let $home    = document.querySelector(".home");

let Tasks = {
  problems: problems,
  questions: questions,

  // подсчитывает поличество правильных ответов
  countRight() {
    return this.problems.reduce((total, problem) => problem.right ? total + 1 : total, 0);
  },

  // находит неправильные примеры
  wrongProblems() {
    return problems.filter((problem) => !problem.right);
  },
};

Tasks.right = Tasks.countRight();

// показывает результаты ответов
function showAnswers(problems, number) {
  for (let i = 0; i < number; i++) {
    let el = document.createElement("div");
    el.className = problems[i].right ? "right" : "wrong";
    el.innerHTML = `
    ${problems[i].eq}
    ${problems[i].given == null ? "" : problems[i].given}
    ${problems[i].right ? "" : `&nbsp;&nbsp;(${problems[i].ans})`}
    `;
    $answers.append(el);
  }
}

// выбирает и устанавливает неправильно решенные примеры
function correctionOfMistakes() {
  localStorage.problems = JSON.stringify(Tasks.wrongProblems());
  localStorage.questions = JSON.stringify(Tasks.questions - Tasks.right);
}

// демонстрирует результат тестирования
function showResult(problems, number) {
  $right.textContent = `Результат: ${Tasks.right} из ${Tasks.questions}`;
  showAnswers(problems, number);
}

showResult(problems, questions);

if (questions == Tasks.right) {
  $correct.style.display = "none";
}

$correct.addEventListener("click", () => {
  correctionOfMistakes();
  window.location.href = "../pages/test.html";
});

$home.addEventListener("click", () => {
  window.location.href = "../index.html";
});
