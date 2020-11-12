// import { ResolvePlugin } from 'webpack';

export default class Puzzle {
  constructor(size) {
    this.size = size;
    this.timer = null;
    this.gameState = 'stop'; // 'pause', 'play'
    this.directions = new Map(
      [
        ['D_UP', 'top'],
        ['D_DOWN', 'bottom'],
        ['D_LEFT', 'left'],
        ['D_RIGHT', 'right'],
      ],
    );
    this.movePuzzle = false;
  }

  static createElem(element, atributes = [], ...classes) {
    const elem = document.createElement(element);
    classes.forEach((className) => elem.classList.add(className));
    if (atributes.length > 0) {
      atributes.forEach((atribute) => elem.setAttribute(atribute[0], atribute[1]));
    }
    return elem;
  }

  createPazzle() {
    const mainContainer = Puzzle.createElem('div', [], 'main_container');
    const mainContainerSettings = Puzzle.createElem('div', [], 'setting');
    mainContainerSettings.innerHTML = '<input class=\'settingButton\' name=\'startGame\' type=\'button\' value=\'Размешать и начать\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'stopGame\' type=\'button\' value=\'Стоп\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'saveGame\' type=\'button\' value=\'Сохранить\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'getResults\' type=\'button\' value=\'Результаты\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'getSolution\' type=\'button\' value=\'Решение\'>';

    const mainContainerWrapper = Puzzle.createElem('div', [], 'wrapper');
    const mainContainerWrapperInfo = Puzzle.createElem('div', [], 'wrapper_info');
    mainContainerWrapperInfo.innerHTML = '<p>Ходов: <span id="wrapper_info__steps">0</span> Время: <span id="wrapper_info__time"><span id="time_min">00</span>:<span id ="time_sec">00</span></span></p>';
    this.mainContainerWrapperPuzzle = Puzzle.createElem('div', [], 'wrapper_puzzle');
    mainContainerWrapper.append(mainContainerWrapperInfo, this.mainContainerWrapperPuzzle);

    const mainContainerPuzzleSize = Puzzle.createElem('div', [], 'puzzleSize');
    mainContainerPuzzleSize.innerHTML = `<p>Размер поля ${this.size}x${this.size}</p>`;
    mainContainerPuzzleSize.innerHTML += 'Другие размеры ';
    mainContainerPuzzleSize.innerHTML += '<a class="size_puzzle" href="#">3x3</a> ';
    mainContainerPuzzleSize.innerHTML += '<a class="size_puzzle" href="#">4x4</a> ';
    mainContainerPuzzleSize.innerHTML += '<a class="size_puzzle" href="#">5x5</a> ';
    mainContainerPuzzleSize.innerHTML += '<a class="size_puzzle" href="#">6x6</a> ';
    mainContainerPuzzleSize.innerHTML += '<a class="size_puzzle" href="#">7x7</a> ';
    mainContainerPuzzleSize.innerHTML += '<a class="size_puzzle" href="#">8x8</a>';

    mainContainer.append(mainContainerSettings, mainContainerWrapper, mainContainerPuzzleSize);

    const modal = Puzzle.createElem('div', [], 'modal');
    Puzzle.modalWindow = Puzzle.createElem('div', [], 'modal_window'); // '<div class="modal_window"></div>'
    Puzzle.modalWindow.innerHTML = '<div class="modal_window__info"></div>';
    const buttonOk = Puzzle.createElem('div', [], 'modal_window__ok');
    buttonOk.innerHTML = '<p>OK</p>';
    Puzzle.modalWindow.append(buttonOk);
    modal.append(Puzzle.modalWindow);

    document.body.append(mainContainer, modal);
  }

  getSize() {
    return this.size;
  }

  renderPuzzle(num = null) {
    this.mainContainerWrapperPuzzle.innerHTML = '';
    Puzzle.minSpan = document.querySelector('#time_min');
    Puzzle.secSpan = document.querySelector('#time_sec');
    Puzzle.answer = '';
    Puzzle.stepSpan = document.querySelector('#wrapper_info__steps');
    Puzzle.stepSpan.innerText = '0';

    const sizePuzzle = num === null ? this.size : num;
    const size = sizePuzzle * sizePuzzle; // Math.pow(sizePuzzle, 2);
    for (let i = 1; i <= size - 1; i += 1) {
      const attribute = [];
      const puzzleContainer = Puzzle.createElem('div', attribute, 'wrapper_puzzle__container');
      puzzleContainer.classList.add(`col_${sizePuzzle}`);
      const container = Puzzle.createElem('div', [['id', `container_${i}`]], 'container');
      const canvas = Puzzle.createElem('canvas', [['width', `${320 / sizePuzzle}`], ['height', `${320 / sizePuzzle}`]], 'wrapper_puzzle__canvas');
      this.drowCanvasImg(canvas, i, sizePuzzle);
      const containerText = Puzzle.createElem('p', [], 'wrapper_puzzle__container-text');
      containerText.innerText = i;
      container.append(containerText, canvas);
      puzzleContainer.append(container);
      this.mainContainerWrapperPuzzle.append(puzzleContainer);
      Puzzle.answer += i;
    }
    Puzzle.answer += size;
    const lastPuzzleContainer = Puzzle.createElem('div', [['id', 'last_container']], 'wrapper_puzzle__container');
    lastPuzzleContainer.innerHTML = `<div id="container_${size}"><p class="wrapper_puzzle__container-last">0</p></div>`;
    lastPuzzleContainer.classList.add(`col_${sizePuzzle}`);
    this.mainContainerWrapperPuzzle.append(lastPuzzleContainer);
    document.querySelector('.puzzleSize p').innerHTML = `Размер поля ${sizePuzzle}x${sizePuzzle}`;
  }

  drowCanvasImg(canvas, i, size) {
    // const canvas = document.querySelector('.wrapper_puzzle__canvas');
    const idx = i - 1;
    const lengthPuzzle = size * size;
    const cnv = canvas;
    const context = cnv.getContext('2d');
    this.image = new Image();
    this.image.src = 'https://raw.githubusercontent.com/irinainina/image-data/master/box/3.jpg';
    this.image.onload = () => {
      const sourceWidth = this.image.width / size;
      const sourceHeight = this.image.height / size;
      const sourceX = Puzzle.getX(idx, lengthPuzzle) * sourceWidth;
      const sourceY = Puzzle.getY(idx, lengthPuzzle) * sourceHeight;
      const destWidth = canvas.width;
      const destHeight = canvas.height;
      const destX = 0;
      const destY = 0;
      context.drawImage(
        this.image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight,
      );
    };
  }

  addListener() {
    document.querySelector('.puzzleSize').addEventListener('click', this.setPuzzleSize.bind(this));
    document.querySelector('.setting').addEventListener('click', (e) => this.installSettings(e));
    this.mainContainerWrapperPuzzle.addEventListener('mousedown', (e) => this.dragAndDrop(e));
    // this.mainContainerWrapperPuzzle.addEventListener('mouseup', (e) => this.mouseUp(e));
  }

  static getSequenceNumbers() {
    const sequence = [];
    document.querySelectorAll('.wrapper_puzzle__container p').forEach((number) => {
      sequence.push(+number.innerText);
    });
    return sequence;
  }

  static getCoords(elem) {
    const box = elem.getBoundingClientRect();
    // eslint-disable-next-line no-restricted-globals
    const offsetY = pageYOffset;
    // eslint-disable-next-line no-restricted-globals
    const offsetX = pageXOffset;
    return {
      top: box.top + offsetY,
      left: box.left + offsetX,
      width: box.width,
    };
  }

  static checkPostn(e, selectedContainer, selectedContainerCrdnts, direction, shiftX, shiftY) {
    const container = selectedContainer;
    const resY = e.pageY - selectedContainerCrdnts.top - shiftY;
    const resX = e.pageX - selectedContainerCrdnts.left - shiftX;
    if (direction === 'D_UP') {
      container.style.top = `${resY}px`;
      if (resY < 0) {
        container.style.top = `${0}px`;
      }
      if (resY > selectedContainerCrdnts.width) {
        container.style.top = `${selectedContainerCrdnts.width}px`;
      }
    } else if (direction === 'D_DOWN') {
      container.style.top = `${resY}px`;
      if (resY > 0) {
        container.style.top = `${0}px`;
      }
      if (resY < -selectedContainerCrdnts.width) {
        container.style.top = `${-selectedContainerCrdnts.width}px`;
      }
    } else if (direction === 'D_LEFT') {
      container.style.left = `${resX}px`;
      if (resX < 0) {
        container.style.left = `${0}px`;
      }
      if (resX > selectedContainerCrdnts.width) {
        container.style.left = `${selectedContainerCrdnts.width}px`;
      }
    } else if (direction === 'D_RIGHT') {
      container.style.left = `${resX}px`;
      if (resX > 0) {
        container.style.left = `${0}px`;
      }
      if (resX < -selectedContainerCrdnts.width) {
        container.style.left = `${-selectedContainerCrdnts.width}px`;
      }
    }
  }

  async dragAndDrop(e) {
    if (e.target.closest('.container') && this.gameState === 'play') {
      let dndFlag = false;
      const selectedContainer = e.target.closest('.container');
      const emptyContainer = document.querySelector('#last_container');
      const direction = Puzzle.getDirection(selectedContainer, emptyContainer);
      const selectedContainerCrdnts = Puzzle.getCoords(selectedContainer);
      const shiftX = e.pageX - selectedContainerCrdnts.left;
      const shiftY = e.pageY - selectedContainerCrdnts.top;
      selectedContainer.style.zIndex = 1000;
      document.onmousemove = (event) => {
        dndFlag = true;
        Puzzle.checkPostn(
          event,
          selectedContainer,
          selectedContainerCrdnts,
          direction, shiftX, shiftY,
        );
      };

      document.onmouseup = async (event) => {
        if (dndFlag && this.gameState === 'play') {
          dndFlag = !dndFlag;
          await this.moveContainer(selectedContainer, emptyContainer, direction);
        } else {
          this.mouseUp(event);
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
      selectedContainer.ondragstart = () => false;
    }
  }

  setPuzzleSize(e) {
    clearInterval(Puzzle.timer);
    Puzzle.minSpan.innerText = '00';
    Puzzle.secSpan.innerText = '00';
    if (e.target.classList.contains('size_puzzle')) {
      this.renderPuzzle(e.target.innerText[0]);
    }
  }

  mouseUp(e) {
    if (e.target.closest('.container') && this.gameState === 'play') {
      const selectedContainer = e.target.closest('.container');
      const emptyContainer = document.querySelector('#last_container');
      const direction = Puzzle.getDirection(selectedContainer, emptyContainer);
      if (direction.length > 0) this.moveContainer(selectedContainer, emptyContainer, direction);
    }
  }

  static getDirection(selectedContainer, emptyContainer) {
    let direction = '';
    const selectedContainerCrdnts = Puzzle.getCoords(selectedContainer);
    const emptyContainerCrdnts = Puzzle.getCoords(emptyContainer);
    const resTop = Math.floor(selectedContainerCrdnts.top - emptyContainerCrdnts.top);
    const resLeft = Math.floor(selectedContainerCrdnts.left - emptyContainerCrdnts.left);
    if (selectedContainerCrdnts.left === emptyContainerCrdnts.left) {
      if (resTop <= 0 && resTop >= -Math.floor(selectedContainerCrdnts.width)) {
        direction = 'D_UP';
      }
      if (resTop >= 0 && resTop <= Math.floor(selectedContainerCrdnts.width)) {
        direction = 'D_DOWN';
      }
    }
    if (selectedContainerCrdnts.top === emptyContainerCrdnts.top) {
      if (resLeft <= 0 && resLeft >= -Math.floor(selectedContainerCrdnts.width)) {
        direction = 'D_LEFT';
      }
      if (resLeft >= 0 && resLeft <= Math.floor(selectedContainerCrdnts.width)) {
        direction = 'D_RIGHT';
      }
    }
    return direction;
  }

  async moveContainer(container, emptyContainer, direction) {
    this.gameState = 'pause';
    // console.log(this.gameState);
    let offset = 0;
    let answer = [];
    const cntnr = container;
    // let verticalOffset, horisontalOffset = false
    if (direction === 'D_UP' || direction === 'D_DOWN') {
      offset = Math.abs(+container.style.top.slice(0, -2));
      // verticalOffset = true;
    }
    if (direction === 'D_LEFT' || direction === 'D_RIGHT') {
      offset = Math.abs(+cntnr.style.left.slice(0, -2));
      // horisontalOffset = true
    }
    // console.log(offset, Puzzle.getCoords(container).width / 2);
    if (offset < Puzzle.getCoords(cntnr).width / 2) {
      // if (verticalOffset) direction = direction === 'D_UP' ? 'D_DOWN' : 'D_UP'
      // if (horisontalOffset) direction = direction === 'D_LEFT' ? 'D_RIGHT' : 'D_LEFT'
    }
    const start = Date.now();
    const promise = new Promise((resolve) => {
      let result;
      const timer = setInterval(() => {
        const timePassed = Date.now() - start;
        if (timePassed >= 500) {
          clearInterval(timer);
          return;
        }
        cntnr.style = `z-index: 1000; ${this.directions.get(direction)}: ${offset + (timePassed / 4)}px`;

        if (direction === 'D_UP') {
          if (emptyContainer.getBoundingClientRect().top <= container.getBoundingClientRect().top) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
            resolve(result);
          }
        }
        if (direction === 'D_DOWN') {
          if (Math.floor(emptyContainer.getBoundingClientRect().top)
          >= Math.floor(container.getBoundingClientRect().top)) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
            resolve(result);
          }
        }
        if (direction === 'D_LEFT') {
          if (emptyContainer.getBoundingClientRect().left
          <= container.getBoundingClientRect().left) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
            resolve(result);
          }
        }
        if (direction === 'D_RIGHT') {
          if (emptyContainer.getBoundingClientRect().left
          >= container.getBoundingClientRect().left) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
            resolve(result);
          }
        }
      });
    });
    if (await promise) answer = Puzzle.getSequenceNumbers();
    this.gameState = 'play';
    return answer;
  }

  static checkPositionActiveContainer(container, emptyContainer, timer) {
    Puzzle.stepSpan.innerText = +Puzzle.stepSpan.innerText + 1;
    const numEmptyContainer = emptyContainer.childNodes[0];
    emptyContainer.removeAttribute('id');
    emptyContainer.removeAttribute('style');
    container.removeAttribute('style');
    container.parentNode.setAttribute('id', 'last_container');
    container.parentNode.append(numEmptyContainer);
    emptyContainer.append(container);
    clearInterval(timer);
    document.querySelector('.wrapper_puzzle').addEventListener('mouseup', this.mouseUp);

    return true;
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

  static isSoloble(startState) {
    const startStateArr = [];
    startState.forEach((item) => {
      startStateArr.push(+item.innerText);
    });
    let result = false;
    const numOfInversions = Puzzle.getInversions(startStateArr);
    const numOfLines = Math.sqrt(startStateArr.length);
    const zeroIndex = startStateArr.indexOf(0);
    const zeroY = Puzzle.getY(zeroIndex, startStateArr.length);
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

  static setTime() {
    Puzzle.stepSpan.innerText = '0';
    Puzzle.minSpan.innerText = '00';
    Puzzle.secSpan.innerText = '00';
    let min = 0;
    let sec = 0;
    return setInterval(() => {
      sec += 1;
      if (sec < 10) Puzzle.secSpan.innerText = `0${sec}`;
      else if (sec >= 10 && sec < 60) Puzzle.secSpan.innerText = sec;
      if (sec === 60) {
        Puzzle.secSpan.innerText = '00';
        min += 1;
        sec = 0;
        if (min < 10) Puzzle.minSpan.innerText = `0${min}`;
        else if (min >= 10 && min < 60) Puzzle.minSpan.innerText = min;
      }
    }, 1000);
  }

  shufflePuzzle(numbers = []) {
    if (numbers.length === 0) {
      document.querySelectorAll('.wrapper_puzzle__container ').forEach((elem) => {
        numbers.push(elem);
        elem.remove();
      });
    }
    numbers.sort(() => Math.random() - 0.5);
    if (Puzzle.isSoloble(numbers)) this.shufflePuzzle(numbers);
    numbers.forEach((elem) => this.mainContainerWrapperPuzzle.append(elem));
  }

  installSettings(e) {
    if (e.target.getAttribute('name') === 'startGame') {
      this.gameState = 'play';
      this.shufflePuzzle();
      clearTimeout(this.timer);
      this.timer = Puzzle.setTime();
    }
  }

  // installSettings(e) {
  //   if (e.target.getAttribute('name') === 'settingAnswer') {
  //     console.log(1);
  //     // clearInterval(Puzzle.timer);
  //     // Puzzle.stopFlag = true;
  //     // console.log(this.mouseUp);
  //     // this.mainContainerWrapperPuzzle.removeEventListener('mousedown', this.dragAndDrop);
  //     this.mainContainerWrapperPuzzle.removeEventListener('mouseup', this.mouseUp);
  //   }

  // if (e.target.getAttribute('name') === 'settingStop') {
  //   clearInterval(Puzzle.timer);
  //   Puzzle.stopFlag = true;
  //   this.mainContainerWrapperPuzzle.removeEventListener('mouseup', this.mouseUp);
  // }
  // if (e.target.getAttribute('name') === 'settingSave') {
  //   clearInterval(Puzzle.timer);

  //   // localStorage.clear()
  //   if (Puzzle.stopFlag) {
  //     Puzzle.stopFlag = false;
  //     clearInterval(Puzzle.timer);
  //     Puzzle.setResultsGame('saveRes');
  //     alert('Игра сохранена. Для возобновления игры зайдите в результаты -'
  //     + 'и выберите пунтк "Продолжить сохраненную игру"');
  //   } else {
  //     alert('Сперва остановите игру!');
  //   }
  // }
  // ###################################### settingResult ###################################
  // if (e.target.getAttribute('name') === 'settingResult') {
  //   document.querySelector('.modal').style = 'display: block';
  //   const modal_window = document.querySelector('.modal_window__info');
  //   modal_window.innerHTML = '';
  //   const results = JSON.parse(localStorage.getRes);
  //   // console.log(results)

  //   results.forEach((res, index) => {
  //     const puzzleSize = Math.sqrt(res.puzzleOrder.length);
  //     modal_window.innerHTML += `<p>${index + 1}. Поле ${puzzleSize}x${puzzleSize}:
  // Время - ${res.min}:${res.sec}; Шаги - ${res.step}</p>`;
  //   });
  //   modal_window.innerHTML += '<a href="#">Продолжить сохраненную игру</a>';

  //   document.querySelector('.modal_window__info a').addEventListener('click', () => {
  //     clearInterval(Puzzle.timer);
  //     // document.querySelector('.modal').style = 'display: none'
  //     const resN = JSON.parse(localStorage.getItem('saveRes'));
  //     const container = document.querySelector('.wrapper_puzzle');
  //     Puzzle.stepSpan.innerText = resN.step;
  //     Puzzle.minSpan.innerText = resN.min;
  //     Puzzle.secSpan.innerText = resN.sec;
  //     console.log(resN.puzzleOrder);
  //     container.innerHTML = resN.puzzleOrder;
  //     const settingStart = document.querySelector('.settingButton');

  //     document.querySelector('.settingButton').removeEventListener('click', this.startGame);
  //     settingStart.value = 'ПРОДОЛЖИТЬ';

  //     settingStart.addEventListener('click', () => {

  //       let min = Number(Puzzle.minSpan.innerText);
  //       let sec = Number(Puzzle.secSpan.innerText);
  // Puzzle.timer = setInterval(() => {
  //   sec += 1;
  //   if (sec < 10) Puzzle.secSpan.innerText = `0${sec}`;
  //   else if (sec >= 10 && sec < 60) Puzzle.secSpan.innerText = sec;
  //   if (sec === 60) {
  //     Puzzle.secSpan.innerText = '00';
  //     min += 1;
  //     sec = 0;
  //     if (min < 10) Puzzle.minSpan.innerText = `0${min}`;
  //     else if (min >= 10 && min < 60) Puzzle.minSpan.innerText = min;
  //   }
  // }, 1000);
  //       settingStart.value = 'Размешать и начать';
  //       document.querySelector('.settingButton').addEventListener('click', this.startGame);
  //     });
  //   }, false);
  //   document.querySelector('.modal_window__ok').addEventListener('click', () => {
  //     document.querySelector('.modal').style = 'display: none';
  //   }, false);
  // }
  // }

  // static setResultsGame(resName) { // 'saveRes', 'getRes'
  //   let res = {};
  //   res.step = Puzzle.stepSpan.innerText;
  //   res.min = Puzzle.minSpan.innerText;
  //   res.sec = Puzzle.secSpan.innerText;

  //   if (resName === 'saveRes') {
  //     res.puzzleOrder = document.querySelector('.wrapper_puzzle').innerHTML;
  //     // document.querySelector('.wrapper_puzzle').forEach(element => {
  //     //     console.log(element)
  //     //     res.puzzleOrder.push(element)
  //     // })
  //   }
  //   console.log(res);

  //   if (resName === 'getRes') {
  //     let resN = localStorage.getItem(resName) !== null
  //       ? localStorage.getItem(resName)
  //       : JSON.stringify([]);
  //     resN = JSON.parse(resN);
  //     if (resN.length >= 10) resN.pop();
  //     resN.unshift(res);
  //     res = resN;
  //   }

  //   localStorage.setItem(resName, JSON.stringify(res));
  //   console.log(localStorage);
  // }

  startGame() {
    this.gameState = 'play';
    // clearInterval(Puzzle.timer);
    // Puzzle.stepSpan.innerText = '0';
    // const arrauDiv = [];
    // document.querySelectorAll('.wrapper_puzzle__container ').forEach((elem) => {
    //   arrauDiv.push(elem);
    //   elem.remove();
    // });
    // arrauDiv.sort(() => Math.random() - 0.5);
    // arrauDiv.forEach((elem) => {
    //   this.mainContainerWrapperPuzzle.append(elem);
    // });
    // Puzzle.minSpan.innerText = '00';
    // Puzzle.secSpan.innerText = '00';
    // let min = 0;
    // let sec = 0;
    // Puzzle.timer = setInterval(() => {
    //   sec += 1;
    //   if (sec < 10) Puzzle.secSpan.innerText = `0${sec}`;
    //   else if (sec >= 10 && sec < 60) Puzzle.secSpan.innerText = sec;
    //   if (sec === 60) {
    //     Puzzle.secSpan.innerText = '00';
    //     min += 1;
    //     sec = 0;
    //     if (min < 10) Puzzle.minSpan.innerText = `0${min}`;
    //     else if (min >= 10 && min < 60) Puzzle.minSpan.innerText = min;
    //   }
    // }, 1000);
  }
}
