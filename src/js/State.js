import Puzzle from './Puzzle';
import Preloader from './Preloader';
import Modal from './Modal';
import Score from './Score';

export default class State extends Puzzle {
  constructor(size, SOLUTIONS) {
    super();
    this.edirections = ['D_LEFT', 'D_RIGHT', 'D_UP', 'D_DOWN'];
    this.visited = new Set();
    this.size = size;
    this.solutions = SOLUTIONS;
    this.moveForShuffle = [];
    // this.reverseMoveForShuffle = [];
  }

  addListenerState() {
    document.querySelector('.getSolution').addEventListener('click', (e) => this.doCorrectSolution(e));
    document.querySelector('.startGame').addEventListener('click', (e) => this.shufflePuzzles(e));
    document.querySelector('.saveGame').addEventListener('click', (e) => State.saveGame(e));
  }

  async doCorrectSolution() {
    if (Puzzle.gameState === 'stop') {
      clearTimeout(Puzzle.timer);
      let result = [];
      const numbers = Puzzle.getNumbers();
      const trueSolution = this.solutions[Math.sqrt(numbers.length) - 3];
      await Preloader.start();
      setTimeout(async () => {
        if (numbers.length > 16) {
          // console.log(Puzzle.movesForSolution);
          result.path = Puzzle.movesForSolution;
          result.path.unshift(...Puzzle.movesFromUser);
          if (result.path.length > 0) {
            result.foundPath = true;
          } else {
            result.foundPath = false;
            result.info = 'No solution required! Please, start the game :)';
          }
        } else {
          result = await this.findPath(numbers, trueSolution);
        }
        Preloader.stop();
        if (await result.foundPath) {
          await this.moveContainerSolution(result.path, numbers);
          Puzzle.movesForSolution = [];
          Puzzle.movesFromUser = [];
          Puzzle.gameState = 'stop';
          Puzzle.gameStarted = false;
        } else {
          Modal.drowModal(result.info);
        }
      }, 100);
    } else if (Puzzle.gameState !== 'pause') {
      const info = 'First press pause or save the game';
      Modal.drowModal(info);
    }
  }

  async shufflePuzzles() {
    if (Puzzle.gameState === 'play') {
      const info = 'First click pause or save the game';
      Modal.drowModal(info);
    } else if (Puzzle.gameState !== 'pause') {
      Puzzle.changePauseBtn('pause');
      Puzzle.gameStarted = true;
      const numbers = await Puzzle.getNumbers();
      Puzzle.movesForSolution.unshift(...Puzzle.movesFromUser);
      await this.mix(numbers);
      const path = this.moveForShuffle.slice();
      const resMove = await this.moveContainerSolution(path, numbers);
      if (resMove) {
        Puzzle.timer = Puzzle.setTimer();
        Puzzle.gameState = 'play';
        Puzzle.movesFromUser = [];
        this.moveForShuffle = [];
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
      await this.moveContainerSolution(path, nums);
    }
    return true;
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
    if (this.visited.has(Puzzle.getHash(result2))) {
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
    const finalStateHash = Puzzle.getHash(finalState);
    let findPathFlag = false;
    const queue = [];
    const result = {};
    queue.push({ state: startState, path: [] });
    if (finalStateHash === Puzzle.getHash(startState)) {
      return {
        foundPath: false,
        info: 'No solution required!</br> Please start the game!',
      };
    }

    while (queue.length !== 0) {
      // firstState = { state: [numbers], path: ['D_UP', 'D_DOWN' ...]}
      const firstState = queue.shift(); // take first element
      const firstQueueHash = Puzzle.getHash(firstState.state);
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
        if (finalStateHash === Puzzle.getHash(resultMove.state)) {
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
      arr = this.steps(arr);
      countMoves -= 1;
    }
    return arr;
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
    if (this.moveForShuffle.length === 0) {
      random = State.randomInteger(1, newArray.length);
      this.moveForShuffle.push(arrayMoves[random - 1]);
      Puzzle.movesForSolution.unshift(Puzzle.reverseMove(arrayMoves[random - 1]));
    } else {
      random = State.randomInteger(1, newArray.length);
      const randomMove = arrayMoves[random - 1];
      if ((this.moveForShuffle[this.moveForShuffle.length - 1] === 'D_LEFT' && randomMove === 'D_RIGHT')
                || (this.moveForShuffle[this.moveForShuffle.length - 1] === 'D_RIGHT' && randomMove === 'D_LEFT')
                || (this.moveForShuffle[this.moveForShuffle.length - 1] === 'D_UP' && randomMove === 'D_DOWN')
                || (this.moveForShuffle[this.moveForShuffle.length - 1] === 'D_DOWN' && randomMove === 'D_UP')) {
        newArray.splice(random - 1, 1);
        arrayMoves.splice(random - 1, 1);
        random = State.randomInteger(1, newArray.length);
        this.moveForShuffle.push(arrayMoves[random - 1]);
        Puzzle.movesForSolution.unshift(Puzzle.reverseMove(arrayMoves[random - 1]));
      } else {
        this.moveForShuffle.push(arrayMoves[random - 1]);
        Puzzle.movesForSolution.unshift(Puzzle.reverseMove(arrayMoves[random - 1]));
      }
    }
    return newArray[random - 1];
  }

  static randomInteger(min, max) {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  // ################# saveGame #######################
  static saveGame(e) {
    if (e.target.getAttribute('name') === 'saveGame' && Puzzle.gameState !== 'pause') {
      let info = '';
      const imgCanvasSrc = Puzzle.image.src;
      const imgCanvas = imgCanvasSrc.slice(imgCanvasSrc.lastIndexOf('/') + 1, -4);
      const numbers = Puzzle.getNumbers();
      const size = Math.sqrt(numbers.length);
      Puzzle.movesForSolution.unshift(...Puzzle.movesFromUser);
      if (Puzzle.gameState === 'play') {
        Puzzle.gameState = 'stop';
        Puzzle.changePauseBtn('play');
        clearInterval(Puzzle.timer);
        Score.saveStagedScore(
          size,
          Puzzle.stepSpan.innerText,
          Puzzle.minSpan.innerText,
          Puzzle.secSpan.innerText,
          imgCanvas,
          numbers,
          Puzzle.movesForSolution,
        );
        info = 'Game saved';
      } else {
        const startStopWorld = Puzzle.gameStarted ? 'stop' : 'start';
        info = `Please. First ${startStopWorld} the game, then save game!`;
      }
      Modal.drowModal(info);
    }
  }
}
