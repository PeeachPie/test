const $questionsSettings = document.querySelector('.questions-settings');

const $questionsNumber = document.querySelector("#q");
const $questionsRange  = document.querySelector("#questions");

const $operatorsSettings = document.querySelector('.operators-settings');

const $operators = document.querySelectorAll(".operators .choose > *");
const $numbers   = document.querySelectorAll(".numbers .choose > *");

const [$plus, $minus, $multiply, $division]      = $operators;
const [$n1,$n2,$n3,$n4,$n5,$n6,$n7,$n8,$n9,$n10] = $numbers;

const $numbersBlock = document.querySelector('.numbers')
const $maxBlock     = document.querySelector('.max')


const $next   = document.querySelector("#next");
const $reset  = document.querySelector("#reset");
const $return = document.querySelector("#return");
const $start  = document.querySelector("#start");

const $maxRange  = document.querySelector("#max");
const $maxNumber = document.querySelector("#m");

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomChoice(choice) {
  return choice[getRandom(0, choice.length - 1)];
}

let Tasks = {
  operators: ['+'], // операторы
  numbers: [1],     // множители/числители
  max: 10,          // максимальное значение для сложения/вычитания
  questions: 5,     // количество вопросов в тесте

  // устанавливает значение по селектору
  setter (selector, value, button) {
    index = this[selector].indexOf(value);
    if ((index === -1)) {
      this[selector].push(value);
      button.className = 'selected'
    } 
    else if (this[selector].length > 1) {
      this[selector].splice(index, 1);
      button.className = 'unselected'
    }
  },

  // устанавливает оператор
  setOperator : function (value, button) {
    Tasks.setter('operators', value, button)
  },

  // утанавливает делитель/множитель
  setNumber : function (value, button) {
    Tasks.setter('numbers', value, button)
  },

  // создает пример
  createEquation (operator, max) {
    switch (operator) {
      case "+":
        a = getRandom(0, max / 2);
        b = getRandom(0, max / 2);
        return [`${a} + ${b} = `, a + b];
      case "-":
        a = getRandom(0, max);
        b = getRandom(0, a);
        return [`${a} - ${b} = `, a - b];
      case "/":
        a = randomChoice(this.numbers);
        b = getRandom(0, 10);
        return [`${a * b} ÷ ${a} = `, b];
      case "*":
        a = getRandom(0, 10);
        b = randomChoice(this.numbers);
        return [`${a} × ${b} = `, a * b];
    }
  },

  // создает примеры
  createEquations () {
    let problems = {}
    for (let i = 1; i <= this.questions; i++) {
      equation = this.createEquation(randomChoice(this.operators), this.max);
      problems[`problem${i}`] = {
        eq: equation[0],
        ans: equation[1],
        given: null,
        right: false,
      };
    }
    return problems;
  }
};

// обрабатывает событие двойного нажатия
function doubleClick (button) {
  let time = new Date().getTime()
  button.addEventListener('click', () => {
    if (new Date().getTime() - time <= 500) {
      selectNumbersBefore(button)
    }
  }, {once: true})
}

// выбирает делители/множители до нажатой кнопки включая ее
function selectNumbersBefore(button) {
  num = Number(button.textContent) - 1
  for (let j = num; j >= 0; j--) {
    if ($numbers[j].className === "unselected"){
      Tasks.setNumber(j + 1,$numbers[j])
    }
  }
}

// устанавливает максимальное значение для сложения/вычитания
function setMax () {
  $maxNumber.value = $maxRange.value;
  changeFill(((Number($maxRange.value) - 10) / 90) * 100, $maxRange)
  Tasks.max = Number($maxRange.value)
}

// устанавливает значение вопросов
function setQuestions () {
  $questionsNumber.value = $questionsRange.value;
  changeFill(((Number($questionsRange.value) - 5) / 25) * 100, $questionsRange)
  Tasks.questions = Number($questionsRange.value)
}

// изменяет заполнение input type="range"
function changeFill (perсent, range) {
  if (perсent >= 80) {
    perсent--
  } else if (perсent <= 12) {
    perсent++
  }
  range.style.background = `linear-gradient(90deg, rgb(22, 255, 1) ${perсent}%, 
  #1f1f1f ${perсent}%)`;
}


// сбрасывает настройки
function resetSettings() {
  for (let $number of $numbers) {
    $number.className = "unselected";
  }
  $numbers[0].className = "selected";

  for (let $operator of $operators) {
    $operator.className = "unselected";
  }
  $operators[0].className = "selected";

  Tasks.operators = ['+'];
  Tasks.numbers = [1];
  Tasks.max = 10;
  Tasks.questions = 5;

  $questionsRange.value = "5";
  $maxRange.value = "10";
  $questionsNumber.value = "5";
  $maxNumber.value = "10";

  changeFill(0, $maxRange)
  changeFill(0, $questionsRange)
}

function hideElement(element) {
  element.style.display = "none";
}

function showElement(element) {
  element.style.display = "flex";
}

for (let i = 0; i < $operators.length; i++) {
  $operators[i].addEventListener("click", Tasks.setOperator.bind(Tasks, ['+', '-', '*', '/'][i], $operators[i]))
}

for (let i = 0; i < $numbers.length; i++) {
  $numbers[i].addEventListener("click", Tasks.setNumber.bind(Tasks, i + 1, $numbers[i]))
}

for (let i = 0; i < $numbers.length; i++) {
  $numbers[i].addEventListener('click', doubleClick.bind(null, $numbers[i]))
}


$maxNumber.addEventListener('change', () => {
  $maxRange.value = $maxNumber.value
  setMax()
})

$maxRange.addEventListener("input", setMax);

$questionsNumber.addEventListener('change', () => {
  $questionsRange.value = $questionsNumber.value;
  setQuestions()
})

$questionsRange.addEventListener("input", setQuestions);

$start.addEventListener("click", () => {
  localStorage.problems = JSON.stringify(Tasks.createEquations());
  localStorage.questions = JSON.stringify(Tasks.questions);
  window.location.href = "../pages/test.html"
});

window.addEventListener('load', resetSettings)
window.addEventListener('unload', resetSettings)

window.addEventListener('click', () => {
  if (Tasks.operators.indexOf('+') === -1 && Tasks.operators.indexOf('-') === -1 ) {
    hideElement($maxBlock)
  } else {
    showElement($maxBlock)
  }
  if (Tasks.operators.indexOf('*') === -1 && Tasks.operators.indexOf('/') === -1 ) {
    hideElement($numbersBlock)
  } else {
    showElement($numbersBlock)
  }
})

$reset.addEventListener('click', resetSettings)

$next.addEventListener('click', () => {
  hideElement($operatorsSettings)
  showElement($questionsSettings)
})

$return.addEventListener('click', () => {
  hideElement($questionsSettings)
  showElement($operatorsSettings)
})

hideElement($numbersBlock)
