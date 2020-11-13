import Puzzle from './Puzzle';
import Preloader from './Preloader';
import SOLUTIONS from './const/solutions';

export default class State extends Puzzle {
  constructor() {
    super();
    this.edirections = ['D_LEFT', 'D_RIGHT', 'D_UP', 'D_DOWN'];
    this.visited = new Set();
    this.visitedClosed = [];
  }

  addListenerState() {
    document.querySelector('.setting').addEventListener('click', (e) => this.doCorrectSolution(e));
    document.querySelector('.setting').addEventListener('click', (e) => this.installShuffle(e));
  }

  async doCorrectSolution(e) {
    if (e.target.getAttribute('name') === 'getSolution') {
      let result = [];
      this.gameState = 'pause';
      const numbers = Puzzle.getSequenceNumbers();
      const trueSolution = SOLUTIONS[Math.sqrt(numbers.length) - 3];
      // pre-loader ##############
      if (numbers.length > 16) {
        console.log(this.moveArr);
        result = this.moveArr; // vlad func
      } else {
        result = await this.findPath(numbers, trueSolution);
      }
      // const solutionDirections = await result;
      if (await result.foundPath) {
        // pre-loader off ###########
        console.log(result);

        await this.moveContainerSolution(result.path, numbers);
      } else {
        console.log(result);
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

  move(direction, numbers) { // return pair = [bool, [[str], [array]]]
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
    const rowArr = [];
    const colArr = [];
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

  async findPath(startState, finalState) { // startState[[numbers], [path]]
    const finalStateHash = State.getHash(finalState);
    let findPathFlag = false;
    const queue = [];
    const result = {};
    queue.push({ state: startState, path: [] });
    if (finalStateHash === State.getHash(startState)) {
      return {
        foundPath: false,
        info: 'no solution required',
      };
    }

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
          this.visited.clear();
          findPathFlag = true;
          result.foundPath = true;
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

  mix(array) {
    let countMoves = State.randomInteger(30, 100);
    let arr = array;
    while (countMoves !== 0) {
      arr = this.Steps(arr);
      countMoves -= 1;
    }
    return arr;
  }

  installShuffle(e) {
    if (e.target.getAttribute('name') === 'startGame') {
      const mainContainer = document.querySelector('.wrapper_puzzle');
      console.log(this.mix());
      // const numbers = this.steps();
      // console.log(numbers);
      // numbers.forEach((elem) => mainContainer.append(elem));
    }
  }

  steps(array) {
    const directions = ['D_LEFT', 'D_RIGHT', 'D_UP', 'D_DOWN'];
    const newArray = [];
    const arrayMoves = [];
    let random = 0;
    directions.forEach((element) => {
      if (this.move(element, array).canMove) {
        newArray.push(this.move(element, array).state);
        arrayMoves.push(element);
      }
    });
    if (this.moveArr.length === 0) {
      random = State.randomInteger(1, newArray.length);
      this.moveArr.push(arrayMoves[random - 1]);
    } else {
      random = State.randomInteger(1, newArray.length);
      const randomMove = arrayMoves[random - 1];
      if ((this.moveArr[this.moveArr.length - 1] === 'D_LEFT' && randomMove === 'D_RIGHT')
                || (this.moveArr[this.moveArr.length - 1] === 'D_RIGHT' && randomMove === 'D_LEFT')
                || (this.moveArr[this.moveArr.length - 1] === 'D_UP' && randomMove === 'D_DOWN')
                || (this.moveArr[this.moveArr.length - 1] === 'D_DOWN' && randomMove === 'D_UP')) {
        newArray.splice(random - 1, 1);
        arrayMoves.splice(random - 1, 1);
        random = State.randomInteger(1, newArray.length);
        this.moveArr.push(arrayMoves[random - 1]);
      } else {
        this.moveArr.push(arrayMoves[random - 1]);
      }
    }
    return newArray[random - 1];
  }

  static randomInteger(min, max) {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }
}
