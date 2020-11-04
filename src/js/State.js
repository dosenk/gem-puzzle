// import Puzzle from './puzzle'
export default class State {
  constructor() {
    // this.numbers = this.getArray();
    this.edirections = ['D_LEFT', 'D_RIGHT', 'D_UP', 'D_DOWN'];
    // this.numbers = State.getNumbers(puzzleNumbers);
  }

  static getHash(numbersArr) {
    return numbersArr.join('').split('').reduce((a, b) => {
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
    return Math.trunc(index / Math.sqrt(length));
  }

  static getX(index, length) {
    return index % Math.sqrt(length);
  }

  static getIndex(x, y, length) {
    return (y * Math.sqrt(length)) + x;
  }

  static move(direction, numbers) { // return pair [bool, [[str], [array]]]
    const zeroIndex = numbers.indexOf('0');
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
    // console.log(zeroX, zeroY, stateLength, zeroIndex, index);
    const result1 = numbers.slice(0, zeroIndex).concat(numbers[index])
      .concat(numbers.slice(zeroIndex + 1));
    const result2 = result1.slice(0, index).concat('0')
      .concat(result1.slice(index + 1));
    return [true, result2];
  }

  static inversions(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j <= arr.length; j += 1) {
        if (arr[i] > arr[j] && (arr[i] !== 0 && arr[j] !== 0)) {
          count += 1;
        }
      }
    }
    return count;
  }

  static linearConflict(arr, finishArray) {
    let count = 0;
    let array = [];
    let s = -1;
    let t = -1;
    for (let i = 0; i < finishArray.length; i += 1) {
      if (finishArray[i] !== arr[i]) {
        const getIndexNumber = (number, arr) => {
          for (let i = 0; i < arr.length; i += 1) {
            if (arr[i] === number) {
              return i;
            }
          }
        };
        const getNumberByPosition = (x, y) => (x * Math.sqrt(arr.length)) + y;
        const x = Math.trunc(i / Math.sqrt(arr.length));
        const y = i % Math.sqrt(arr.length);
        const index = getIndexNumber(finishArray[i], arr);
        const x1 = Math.trunc(index / Math.sqrt(arr.length));
        const y1 = index % Math.sqrt(arr.length);

        if (x === x1 && y !== Math.sqrt(arr.length) - 1 && s !== x) {
          s = x;
          for (let i = y; i < Math.sqrt(arr.length); i += 1) {
            array.push(arr[getNumberByPosition(x, i)]);
          }
          count += State.inversions(array) * 2;
          array = [];
        }
        if (y === y1 && x !== Math.sqrt(arr.length) - 1 && t !== y) {
          t = y;
          for (let i = x; i < Math.sqrt(arr.length); i += 1) {
            array.push(arr[getNumberByPosition(i, y)]);
          }
          count += State.inversions(array) * 2;
          // console.log(inversions(array));
          array = [];
        }
      }
    }
    return count;
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

  static countInverses(arr) {
    // если следующая цифра меньше предыдущей - это инверсия, тогда + 1
    let counter = 0;
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j <= arr.length; j += 1) {
        const ch1 = arr[i];
        const ch2 = arr[j];
        if (ch1 === '0' || ch2 === '0') {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (ch1 > ch2) {
          counter += 1;
        }
      }
    }
    return counter;
  }

  static isSoloble(startStateArray) {
    let result = false;
    const numOfInversions = State.countInverses(startStateArray);
    const numOfLines = Math.sqrt(startStateArray.length);
    const zeroIndex = startStateArray.indexOf('0');
    const zeroY = State.getY(zeroIndex, startStateArray.length);
    // console.log(numOfInversions, ' - количество инверсий');
    // console.log(numOfLines, ' - количество строк');
    // console.log(zeroIndex, ' - индекс нуля');
    // console.log(zeroY, ' - позиция Y');
    if (numOfLines % 2 === 0) {
      // Если numOfLines четно, экземпляр головоломки разрешим, если:
      // - пробел находится в четной строке, считая снизу (вторая-последняя,
      // ​​четвертая-последняя и т. д.), а количество инверсий нечетное.
      // - пробел находится в нечетной строке, считая снизу (последняя,
      // ​​третья-последняя, ​​пятая-последняя и т. д.), а количество инверсий четное.
      if (zeroY % 2 === 0 && numOfInversions % 2 === 1) {
        result = true;
      } else if (zeroY % 2 === 1 && numOfInversions % 2 === 0) {
        result = true;
      }
    } else if (numOfLines % 2 === 1) {
      // если количество инверсий четное при нечетном количестве строк (поля: 3х3, 5х5, 7х7)
      result = (numOfInversions % 2 === 0);
    }
    return result;
  }

  findPath(startState, finalState) {
    if (!State.isSoloble(startState[0])) {
      console.log('Решения не существует');
      return;
    }
    // startState = [[startState], [path]]
    const finalStateHash = State.getHash(finalState);
    this.visited = new Set();
    let earlyQueue = [];
    let queue = [];
    queue.push(startState);
    let i = 0;
    while (queue.length !== 0) {
      earlyQueue = [];
      const firstQueue = queue[0]; // take first element
      // console.log(firstQueue[0]);
      if (i === 1000) {
        console.log('много итераций - СБРОС');
        break;
      }
      const firstQueueHash = State.getHash(firstQueue[0]);
      this.visited.add(firstQueueHash);

      if (finalStateHash === firstQueueHash) {
        console.log(finalStateHash, firstQueueHash);
        console.log('Решена за - ', firstQueue[1].length - 1, ' ходов');
        console.log('Ходы: ', firstQueue[1]);
        console.log('количество итераций - ', i);
        break;
      }

      // eslint-disable-next-line no-loop-func
      this.edirections.forEach((direction) => {
        const pair = State.move(direction, firstQueue[0]);
        // console.log(pair, direction);
        if (!pair[0]) return;
        if (!this.visited.has(State.getHash(pair[1]))) {
          const path = firstQueue[1].concat(direction);
          earlyQueue.push([pair[1], path]);
        }
      });

      const earlyQueueFiltred = this.getArraysManhMin(earlyQueue, finalState);
      queue = queue.concat(earlyQueueFiltred);
      queue.shift();
      // console.log(queue);
      i += 1;
    }
  }

  getArraysManhMin(earlyQueue, finishRes) {
    const earlyQueueManh = [];
    const queue = [];
    earlyQueue.forEach((item) => {
      const manhDist = State.manhattanDistance(item[0]);
      const linerConfl = State.linearConflict(item[0], finishRes);
      earlyQueueManh.push(manhDist + linerConfl);
    });
    const manhMin = Math.min(...earlyQueueManh);
    // console.log(manhMin);
    earlyQueueManh.forEach((item, idx) => {
      if (item === manhMin) {
        queue.push(earlyQueue[idx]);
      } else {
        const itemHash = State.getHash(earlyQueue[idx][0]);
        this.visited.add(itemHash);
      }
    });
    return queue;
  }
}
