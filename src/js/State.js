// import Puzzle from './puzzle'
export default class State {
  constructor() {
    // this.numbers = this.getArray();
    this.edirections = ['D_LEFT', 'D_RIGHT', 'D_UP', 'D_DOWN'];
    this.visited = new Set();
    // this.numbers = State.getNumbers(puzzleNumbers);
  }

  static getHash(numbersArr) {
    return numbersArr.join(',');
    // .split('').reduce((a, b) => {
    //   a = ((a << 5) - a) + b.charCodeAt(0);
    //   return a & a;
    // }, 0);
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
    const result2 = result1.slice(0, index).concat(0)
      .concat(result1.slice(index + 1));
    // console.log(this.visited);
    if (this.visited.has(State.getHash(result2))) {
      return [false, numbers];
    }

    return [true, result2];
  }

  static getInversions(arr) {
    const arrLength = arr.length;
    // console.log(arr);
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
    // console.log(objArr);
    objArr.col.forEach((elemArr1) => {
      counter += State.getInversions(elemArr1);
    });
    objArr.row.forEach((elemArr2) => {
      counter += State.getInversions(elemArr2);
    });
    // console.log(counter);
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

  static getPuzzlesOutOfPlace() {

  }

  // static countInverses(arr) {
  //   // если следующая цифра меньше предыдущей - это инверсия, тогда + 1
  //   let counter = 0;
  //   for (let i = 0; i < arr.length; i += 1) {
  //     for (let j = i + 1; j <= arr.length; j += 1) {
  //       const ch1 = arr[i];
  //       const ch2 = arr[j];
  //       if (ch1 === '0' || ch2 === '0') {
  //         // eslint-disable-next-line no-continue
  //         continue;
  //       }
  //       if (ch1 > ch2) {
  //         counter += 1;
  //       }
  //     }
  //   }
  //   return counter;
  // }

  static isSoloble(startStateArray) {
    let result = false;
    const numOfInversions = State.getInversions(startStateArray);
    const numOfLines = Math.sqrt(startStateArray.length);
    const zeroIndex = startStateArray.indexOf(0);
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
      if (zeroY % 2 === 0 && numOfInversions % 2 !== 0) {
        result = true;
      } else if (zeroY % 2 !== 0 && numOfInversions % 2 === 0) {
        result = true;
      }
    } else if (numOfLines % 2 !== 0) {
      // если количество инверсий четное при нечетном количестве строк (поля: 3х3, 5х5, 7х7)
      result = (numOfInversions % 2 === 0);
    }
    return result;
  }

  // #############################################################################
  async findPath(startState, finalState) {
    if (!State.isSoloble(startState[0])) {
      console.log('Решения не существует');
      return;
    }

    const finalStateHash = State.getHash(finalState);

    let earlyQueue = [];
    let queue = [];
    queue.push(startState);
    let i = 0;
    while (queue.length !== 0) {
      earlyQueue = [];
      const firstQueue = queue[0]; // take first element
      // console.log(firstQueue[0]);
      const firstQueueHash = State.getHash(firstQueue[0]);
      this.visited.add(firstQueueHash);

      if (i === 1105) {
        console.log('много итераций - СБРОС');
        break;
      }
      if (finalStateHash === firstQueueHash) {
        // console.log(finalStateHash, firstQueueHash);
        console.log('Решена за - ', firstQueue[1].length, ' ходов');
        console.log('Ходы: ', firstQueue[1]);
        console.log('количество итераций - ', i);
        break;
      }

      // eslint-disable-next-line no-loop-func
      this.edirections.forEach((direction) => {
        const pair = this.move(direction, firstQueue[0]);
        if (!pair[0]) return;
        const path = firstQueue[1].concat(direction);
        earlyQueue.push([pair[1], path]);
      });
      queue.shift();

      queue = queue.concat(earlyQueue);

      queue = await State.getArraysHeuristics(queue);
      i += 1;
      console.log(1);
      // console.log('###############################################################');
    }
  }

  static async getArraysHeuristics(earlyQueue) {
    const earlyQueueManh = [];
    const newArr = [];
    // console.log(earlyQueue);
    earlyQueue.forEach((item) => {
      const arr = item[0];
      const manhDist = State.manhattanDistance(arr);
      const linerConfl = State.linearConflict(arr);
      const shotPath = item[1].length;
      const sumOfHeuristics = shotPath + manhDist + linerConfl;
      // console.log(shotPath, manhDist, linerConfl);
      earlyQueueManh.push(sumOfHeuristics);
    });
    const manhMin = Math.min(...earlyQueueManh);
    // console.log(earlyQueueManh, earlyQueue);

    for (let i = 0; i < earlyQueueManh.length; i += 1) {
      if (earlyQueueManh[i] === manhMin) {
        // console.log(earlyQueue[idx], idx);
        newArr.push(earlyQueue[i]);
      }
      // else {
      //   const itemHash = State.getHash(earlyQueue[i][0]);
      //   this.visited.add(itemHash)
      // }
    }

    return newArr;
  }

  // getArraysHeuristicsInv(earlyQueue) {
  //   const earlyQueueManh = [];
  //   const queue = [];
  //   // console.log(earlyQueue);
  //   earlyQueue.forEach((item) => {
  //     const arr = item[0];
  //     const manhDist = State.manhattanDistance(arr);
  //     const linerConfl = State.linearConflict(arr);
  //     const inversions = State.getInversions(arr);
  //     const shotPath = item[1].length;
  //     const sumOfHeuristics = inversions + shotPath + manhDist + linerConfl;
  //     earlyQueueManh.push(sumOfHeuristics);
  //   });
  //   const manhMin = Math.min(...earlyQueueManh);
  //   // console.log(earlyQueueManh);
  //   earlyQueueManh.forEach((item, idx) => {
  //     if (item === manhMin) {
  //       queue.push(earlyQueue[idx]);
  //     } else {
  //       const itemHash = State.getHash(earlyQueue[idx][0]);
  //       this.visited.add(itemHash);
  //     }
  //   });
  //   return queue;
  // }
}
