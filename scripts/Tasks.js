import {getRandom, randomChoice} from './utilits.js';

export class Task {
  constructor (options) {
    this.operators = options.operators;
    this.numbers = options.numbers;
    this.max = options.max;
    this.questions = options.questions;
    this.problems = [];
  }

  // устанавливает значение по селектору
  setter(selector, value, button) {
    let index = this[selector].indexOf(value);
    if (index === -1) {
      this[selector].push(value);
      button.className = "selected";
    } else if (this[selector].length > 1) {
      this[selector].splice(index, 1);
      button.className = "unselected";
    }
  }

  // устанавливает оператор
  setOperator(value, button) {
    this.setter("operators", value, button);
  }

  // утанавливает делитель/множитель
  setNumber(value, button) {
    this.setter("numbers", value, button);
  }

  // создает пример
  createEquation(operator, max) {
    let a, b;
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
        return [`${a} \u00d7 ${b} = `, a * b];
      default: return 'some Error'
    } 
  }

  // создает примеры
  createEquations() {
    for (let i = 1; i <= this.questions; i++) {
      let equation = this.createEquation(randomChoice(this.operators), this.max);
      this.problems.push({
        eq: equation[0],
        ans: equation[1],
        given: null,
        right: false,
      });
    }
  }
  
  // подсчитывает поличество правильных ответов
  get right() {
    return this.problems.reduce((total, problem) => problem.right ? total + 1 : total, 0);
  }

  // находит неправильные примеры
  get wrongProblems() {
    return this.problems.filter((problem) => !problem.right);
  }
}
