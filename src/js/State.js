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
      const trueSolution = [...Array(numbers.length).keys()];
      trueSolution.shift();
      trueSolution.push(0);
      // pre-loader ##############
      const result = await this.findPath(numbers, trueSolution);
      const solutionDirections = await result;
      if (solutionDirections.findPath) {
        // pre-loader off ###########
        await this.moveContainerSolution(solutionDirections.path, numbers);
      } else {
        console.log(solutionDirections);
      }
    }
  }

  async moveContainerSolution(path, numbers) {
    let nums = numbers;
    if (path.length > 0) {
      const direction = path.shift();
      const emptyContainer = document.querySelector('#last_container');
      const zeroIndex = numbers.indexOf(0);
      const stateLength = numbers.length;
      const zeroX = Puzzle.getX(zeroIndex, stateLength);
      const zeroY = Puzzle.getY(zeroIndex, stateLength);
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

  static getIndexByDirection(direction, zeroX, zeroY, stateLength) {
    let index = 0;
    if (direction === 'D_LEFT') {
      index = Puzzle.getIndex(zeroX - 1, zeroY, stateLength);
    } else if (direction === 'D_RIGHT') {
      index = Puzzle.getIndex(zeroX + 1, zeroY, stateLength);
    } else if (direction === 'D_UP') {
      index = Puzzle.getIndex(zeroX, zeroY - 1, stateLength);
    } else if (direction === 'D_DOWN') {
      index = Puzzle.getIndex(zeroX, zeroY + 1, stateLength);
    }
    return index;
  }

  move(direction, numbers) { // return pair [bool, [[str], [array]]]
    const zeroIndex = numbers.indexOf(0);
    const stateLength = numbers.length;
    const zeroX = Puzzle.getX(zeroIndex, stateLength);
    const zeroY = Puzzle.getY(zeroIndex, stateLength);
    const lastZero = Math.sqrt(numbers.length) - 1;

    if ((direction === 'D_LEFT' && zeroX === 0)
    || (direction === 'D_RIGHT' && zeroX === lastZero)
    || (direction === 'D_DOWN' && zeroY === lastZero)
    || (direction === 'D_UP' && zeroY === 0)) {
      return {
        canMove: false,
        state: numbers,
      };
    }
    const index = State.getIndexByDirection(direction, zeroX, zeroY, stateLength);
    const result1 = numbers.slice(0, zeroIndex).concat(numbers[index])
      .concat(numbers.slice(zeroIndex + 1));
    const result2 = result1.slice(0, index).concat(0)
      .concat(result1.slice(index + 1));
    if (this.visited.has(State.getHash(result2))) {
      return {
        canMove: false,
        state: numbers,
      };
    }
    return {
      canMove: true,
      state: result2,
    };
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
        if (Puzzle.getX(elem - 1, arrLenght) === idx) {
          colArr[idx].push(elem);
        }
        if (Puzzle.getY(elem - 1, arrLenght) === i) {
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
      counter += Puzzle.getInversions(elemArr1);
    });
    objArr.row.forEach((elemArr2) => {
      counter += Puzzle.getInversions(elemArr2);
    });
    return counter * 2;
  }

  static manhattanDistance(arr) {
    let count = 0;
    arr.forEach((element, i) => {
      if (element !== 0) {
        const x = Puzzle.getX(i, arr.length);
        const y = Puzzle.getY(i, arr.length);
        const x1 = Puzzle.getX(element - 1, arr.length);
        const y1 = Puzzle.getY(element - 1, arr.length);
        count += Math.abs(x - x1) + Math.abs(y - y1);
      }
    });
    return count;
  }

  static getAllHeuristics(arr) {
    return State.linearConflict(arr)
    + State.manhattanDistance(arr)
    + arr.length
    + Puzzle.getInversions(arr);
  }

  static getQueueWhithMinHauristics(earlyQueue, minHeuristics) {
    return earlyQueue.filter(
      (item) => State.getAllHeuristics(item.state) === minHeuristics,
    );
  }
  // #############################################################################

  async findPath(startState, finalState) { // startState[[numbers], [path]]
    // if (Puzzle.isSoloble(startState)) return [false, 'Решения не существует'];
    const finalStateHash = State.getHash(finalState);
    let findPathFlag = false;
    const queue = [];
    const result = {};
    queue.push({ state: startState, path: [] });

    while (queue.length !== 0) {
      // firstState = { state: [numbers], path: ['D_UP', 'D_DOWN' ...]}
      const firstState = queue.shift(); // take first element
      const firstQueueHash = State.getHash(firstState.state);
      this.visited.add(firstQueueHash);
      const earlyQueue = [];
      const earlyQueueHeuristics = [];
      for (let j = 0; j < this.edirections.length; j += 1) {
        const resultMove = this.move(this.edirections[j], firstState.state);
        if (resultMove.canMove) {
          earlyQueue.push({
            state: resultMove.state,
            path: firstState.path.concat(this.edirections[j]),
          });
          earlyQueueHeuristics.push(State.getAllHeuristics(resultMove.state));
        }
        if (finalStateHash === State.getHash(resultMove.state)) {
          findPathFlag = true;
          result.findPath = true;
          result.path = earlyQueue.pop().path;
        }
      }
      if (findPathFlag === true) break;
      queue.push(...State.getQueueWhithMinHauristics(
        earlyQueue,
        Math.min(...earlyQueueHeuristics),
      ));
    }
    return result;
  }
}
