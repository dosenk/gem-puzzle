/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-named-as-default-member
import Puzzle from './Puzzle';

// import Puzzle from './puzzle'
export default class State extends Puzzle {
  constructor() {
    super();
    this.edirections = ['D_LEFT', 'D_RIGHT', 'D_UP', 'D_DOWN'];
    this.visited = new Set();
    this.visitedClosed = [];
  }

  addListenerState() {
    document.querySelector('.setting').addEventListener('click', this.doCorrectSolution.bind(this));
  }

  async doCorrectSolution(e) {
    if (e.target.getAttribute('name') === 'getSolution') {
      this.gameState = 'pause';
      const numbers = Puzzle.getSequenceNumbers();
      const trueSolution = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0];
      // console.log(numbers);
      const solution = await this.findPath([numbers, []], trueSolution);
      console.log(solution, numbers);
      await this.moveContainerSolution(solution[1], numbers);
    }
  }

  async moveContainerSolution(path, numbers) {
    let nums = numbers;
    if (path.length > 0) {
      const direction = path.shift();
      const emptyContainer = document.querySelector('#last_container');
      const zeroIndex = numbers.indexOf(0);
      const stateLength = numbers.length;
      const zeroX = State.getX(zeroIndex, stateLength);
      const zeroY = State.getY(zeroIndex, stateLength);
      const index = State.getIndexByDirection(direction, zeroX, zeroY, stateLength);
      const selectedContainer = document.querySelector(`#container_${numbers[index]}`);
      nums = await this.moveContainer(selectedContainer, emptyContainer, direction);
      this.moveContainerSolution(path, nums);
    }
  }

  static getHash(numbersArr) {
    return numbersArr.join(',');
  }

  static getNumbers(puzzleNumbers) {
    const numbersStr = puzzleNumbers.join('');
    return [numbersStr, puzzleNumbers];
  }

  static getY(index, length) {
    return Math.trunc(index / Math.sqrt(length));
  }

  static getX(index, length) {
    return index % Math.sqrt(length);
  }

  static getIndex(x, y, length) {
    return (y * Math.sqrt(length)) + x;
  }

  static getIndexByDirection(direction, zeroX, zeroY, stateLength) {
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
    return index;
  }

  move(direction, numbers) { // return pair [bool, [[str], [array]]]
    const zeroIndex = numbers.indexOf(0);
    const stateLength = numbers.length;
    const zeroX = State.getX(zeroIndex, stateLength);
    const zeroY = State.getY(zeroIndex, stateLength);
    const lastZero = Math.sqrt(numbers.length) - 1;

    if ((direction === 'D_LEFT' && zeroX === 0)
    || (direction === 'D_RIGHT' && zeroX === lastZero)
    || (direction === 'D_DOWN' && zeroY === lastZero)
    || (direction === 'D_UP' && zeroY === 0)) {
      return [false, numbers];
    }
    const index = State.getIndexByDirection(direction, zeroX, zeroY, stateLength);
    // console.log(zeroX, zeroY, stateLength, zeroIndex, index);
    const result1 = numbers.slice(0, zeroIndex).concat(numbers[index])
      .concat(numbers.slice(zeroIndex + 1));
    const result2 = result1.slice(0, index).concat(0)
      .concat(result1.slice(index + 1));
    // console.log(this.visited);
    if (this.visited.has(State.getHash(result2))) {
      // this.visitedClosed.add(result2);
      return [false, numbers];
    }

    return [true, result2];
  }

  static getInversions(arr) {
    const arrLength = arr.length;
    let count = 0;
    for (let i = 0; i < arrLength; i += 1) {
      for (let j = i + 1; j <= arrLength; j += 1) {
        if (arr[i] > arr[j] && (arr[i] !== 0 && arr[j] !== 0)) {
          count += 1;
        }
      }
    }
    return count;
  }

  static getTwoDimensionalArray(arr) {
    const arrLenght = arr.length;
    const numOfElem = Math.sqrt(arrLenght);
    const rowArr = []; // массив строк
    const colArr = []; // массив столбцов
    for (let i = 0; i <= numOfElem - 1; i += 1) {
      const numOfArr = arr.slice(i * numOfElem, (i + 1) * numOfElem);
      numOfArr.forEach((elem, idx) => {
        if (i === 0) {
          colArr.push([]);
          rowArr.push([]);
        }
        if (State.getX(elem - 1, arrLenght) === idx) {
          colArr[idx].push(elem);
        }
        if (State.getY(elem - 1, arrLenght) === i) {
          rowArr[i].push(elem);
        }
      });
    }
    return {
      row: rowArr,
      col: colArr,
    };
  }

  static linearConflict(arr) {
    let counter = 0;
    const objArr = State.getTwoDimensionalArray(arr);
    objArr.col.forEach((elemArr1) => {
      counter += State.getInversions(elemArr1);
    });
    objArr.row.forEach((elemArr2) => {
      counter += State.getInversions(elemArr2);
    });
    return counter * 2;
  }

  static manhattanDistance(arr) {
    let count = 0;
    arr.forEach((element, i) => {
      if (element !== 0) {
        const x = State.getX(i, arr.length);
        const y = State.getY(i, arr.length);
        const x1 = State.getX(element - 1, arr.length);
        const y1 = State.getY(element - 1, arr.length);
        count += Math.abs(x - x1) + Math.abs(y - y1);
      }
    });
    return count;
  }

  static isSoloble(startStateArray) {
    let result = false;
    const numOfInversions = State.getInversions(startStateArray);
    const numOfLines = Math.sqrt(startStateArray.length);
    const zeroIndex = startStateArray.indexOf(0);
    const zeroY = State.getY(zeroIndex, startStateArray.length);
    if (numOfLines % 2 === 0) {
      if (zeroY % 2 === 0 && numOfInversions % 2 !== 0) {
        result = true;
      } else if (zeroY % 2 !== 0 && numOfInversions % 2 === 0) {
        result = true;
      }
    } else if (numOfLines % 2 !== 0) {
      result = (numOfInversions % 2 === 0);
    }
    return !result;
  }

  // #############################################################################
  async findPath(startState, finalState) {
    if (State.isSoloble(startState[0])) {
      console.log('Решения не существует');
      return [false, 'Решения не существует'];
    }

    const finalStateHash = State.getHash(finalState);
    let queue = [];
    let result = [];
    queue.push(startState);
    let i = 0;
    while (queue.length !== 0) {
      const firstQueueArr = queue[0]; // take first element
      // console.log(firstQueueArr);
      const firstQueueHash = State.getHash(firstQueueArr[0]);
      this.visited.add(firstQueueHash);
      if (finalStateHash === firstQueueHash) {
        result = [true, firstQueueArr[1]];
        break;
      }
      for (let j = 0; j < this.edirections.length; j += 1) {
        const pair = this.move(this.edirections[j], firstQueueArr[0]);
        if (pair[0]) {
          const path = firstQueueArr[1].concat(this.edirections[j]);
          queue.push([pair[1], path]);
        }
      }
      queue.shift();
      queue = this.getArraysHeuristics(queue);
      if (i === 20000) {
        console.log('много итераций - СБРОС');
        break;
      }
      i += 1;
    }
    return result;
  }

  getArraysHeuristics(earlyQueue, flag = true) {
    const earlyQueueManh = [];
    const newArr = [];
    // console.log(earlyQueue);
    earlyQueue.forEach((item) => {
      // console.log(item);
      const arr = item[0];
      const manhDist = State.manhattanDistance(arr);
      const linerConfl = State.linearConflict(arr);
      const shotPath = item[1].length;
      const sumOfHeuristics = shotPath + manhDist + linerConfl;
      // console.log(shotPath, manhDist, linerConfl);
      earlyQueueManh.push(sumOfHeuristics);
    });
    const manhMinMax = flag ? Math.min(...earlyQueueManh) : Math.max(...earlyQueueManh);
    if (flag) {
      // console.log(manhMinMax, ' - manhMinMax');s
      // console.log(earlyQueue, ' - inc arr');
    }

    // for (let i = earlyQueueManh.length - 1; i >= 0; i -= 1) {
    for (let i = 0; i < earlyQueueManh.length; i += 1) {
      if (earlyQueueManh[i] === manhMinMax) {
        newArr.push(earlyQueue[i]);
        // if (!flag) {
        //   console.log(i);
        //   console.log(earlyQueue[i]);

        //   // console.log(i);
        //   this.visitedClosed.splice(i, 1);
        //   // i -= 1;
        //   // console.log(earlyQueue);
        //   // this.visitedClosed = earlyQueue;
        //   // console.log(this.visitedClosed);
        // }
      } else if (flag) {
        // const itemHash = State.getHash(earlyQueue[i][0]);
        // console.log(earlyQueue[i]);
        this.visitedClosed.push(earlyQueue[i]);
      }
    }
    if (!flag) console.log(newArr);
    return newArr;
  }

  //     const manhDist = State.manhattanDistance(arr);
  //     const linerConfl = State.linearConflict(arr);
  //     const inversions = State.getInversions(arr);
  //     const shotPath = item[1].length;
  //     const sumOfHeuristics = inversions + shotPath + manhDist + linerConfl;
}
