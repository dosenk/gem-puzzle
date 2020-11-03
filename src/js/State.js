// import Puzzle from './puzzle';
const Edirections = [
  'D_LEFT',
  'D_RIGHT',
  'D_UP',
  'D_DOWN',
];

export default class State {
  constructor(puzzleNumbers) {
    // this.numbers = this.getArray();
    this.edirections = ['D_LEFT', 'D_RIGHT', 'D_UP', 'D_DOWN'];
    this.numbers = State.getNumbers(puzzleNumbers);
  }

  static getHash(numbers) {
    return numbers.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  static getNumbers(puzzleNumbers) {
    const numbersStr = puzzleNumbers.join('');
    // const numbersArr = [];
    // const puzzleNumbers = document.querySelectorAll('.wrapper_puzzle__container-text');
    // puzzleNumbers.forEach((p) => {
    //   numbersStr += p.innerText;
    //   numbersArr.push(p.innerText);
    // });
    return [numbersStr, puzzleNumbers];
  }

  static getY(index, length) {
    return Math.ceil(index / Math.sqrt(length));
  }

  static getX(index, length) {
    return index % Math.sqrt(length);
  }

  static getIndex(x, y, length) {
    return (y * Math.sqrt(length)) + x;
  }

  move(direction) { // return pair [bool, [[str], [array]]]
    const zeroIndex = this.numbers[1].indexOf(0);
    const stateLength = this.numbers[0].length;
    console.log(zeroIndex, 'zeroIndex');
    const zeroX = State.getX(zeroIndex, stateLength);
    const zeroY = State.getY(zeroIndex, stateLength);

    if ((direction === 'D_LEFT' && zeroX === 0)
    || (direction === 'D_RIGHT' && zeroX === 2)
    || (direction === 'D_DOWN' && zeroY === 2)
    || (direction === 'D_UP' && zeroY === 0)) {
      return [false, this.numbers];
    }
    let index = 0;
    if (direction === 'D_LEFT') {
      index = State.getIndex(zeroX - 1, zeroY, stateLength);
    } else if (direction === 'D_RIGHT') {
      index = State.getIndex(zeroX + 1, zeroY, stateLength);
    } else if (direction === 'D_UP') {
      index = State.getIndex(zeroX, zeroY - 1, stateLength);
    } else if (direction === 'D_DOWN') {
      index = State.getIndex(zeroX, zeroY + 1, stateLength);
    }
    console.log(index);
    this.numbers[1].splice(zeroIndex, 1, this.numbers[1][index]);
    this.numbers[1].splice(index, 1, '0');
    return this.numbers;
  }

  static countInverses(arr) {
    let counter = 0;
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j <= arr.length; j += 1) {
        const ch1 = arr[i];
        const ch2 = arr[j];
        if (ch1 === '0' || ch2 === '0') {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (ch2 > ch1) {
          counter += 1;
        }
      }
    }
    return counter;
  }

  isSoloble(startState, endState) {
    const startIsOdd = (this.countInverses(startState) % 2 === 1);
    const endIsOdd = (this.countInverses(endState) % 2 === 1);
    return (startIsOdd === endIsOdd);
  }

  findPath(startState, finalState) {
    const queue = [];
    queue.push(startState);
    while (queue.length !== 0) {
      queue[0]; // take first element
      queue.shift();
    }
  }
}
