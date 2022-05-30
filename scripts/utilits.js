export function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export function randomChoice(choice) {
  return choice[getRandom(0, choice.length - 1)];
}

// export {getRandom, randomChoice}