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
  right() {
    let right = 0;
    for (let i = 1; i <= this.questions; i++) {
      if (this.problems[`problem${i}`].right) {
        right += 1;
      }
    }
    return right;
  },
  // находит неправильные примеры
  wrongProblems() {
    let uncorrect = {};
    let counter = 0;
    for (let i = 1; i <= this.questions; i++) {
      let problem = `problem${i}`;
      if (!problems[problem].right) {
        counter += 1;
        uncorrect[`problem${counter}`] = problems[problem];
      }
    }
    return uncorrect;
  },
};

// показывает результаты ответов
function showAnswers(problems, number) {
  for (let i = 1; i <= number; i++) {
    let problem = `problem${i}`;
    let el = document.createElement("div");
    el.className = problems[problem].right ? "right" : "wrong";
    el.innerHTML = `${problems[problem].eq}${
      problems[problem].given == null ? "" : problems[problem].given
    }${problems[problem].right ? "" : `&nbsp;&nbsp;(${problems[problem].ans})`}`;
    $answers.append(el);
  }
}

// выбирает и устанавливает неправильно решенные примеры
function correctionOfMistakes() {
  localStorage.problems = JSON.stringify(Tasks.wrongProblems());
  localStorage.questions = JSON.stringify(Tasks.questions - Tasks.right());
}

// демонстрирует результат тестирования
function showResult(problems, number) {
  $right.textContent = `Результат: ${Tasks.right()} из ${Tasks.questions}`;
  showAnswers(problems, number);
}

showResult(problems, questions);

if (questions == Tasks.right()) {
  $correct.style.display = "none";
}

$correct.addEventListener("click", () => {
  correctionOfMistakes();
  window.location.href = "../pages/test.html";
});

$home.addEventListener("click", () => {
  window.location.href = "../index.html";
});
