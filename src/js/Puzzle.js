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
    this.imageCanvas = 1;
    this.moveArr = [];
  }

  static createElem(element, atributes = [], ...classes) {
    const elem = document.createElement(element);
    classes.forEach((className) => elem.classList.add(className));
    if (atributes.length > 0) {
      atributes.forEach((atribute) => elem.setAttribute(atribute[0], atribute[1]));
    }
    return elem;
  }

  renderDomElements() {
    const mainContainer = Puzzle.createElem('main', [], 'main_container');
    const header = Puzzle.createElem('header', [], 'puzzle_header');
    const mainContainerSettings = Puzzle.createElem('div', [], 'setting');
    mainContainerSettings.innerHTML = '<input class=\'settingButton\' name=\'startGame\' type=\'button\' value=\'Размешать и начать\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'stopGame\' type=\'button\' value=\'Стоп\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'saveGame\' type=\'button\' value=\'Сохранить\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'getResults\' type=\'button\' value=\'Результаты\'>';
    mainContainerSettings.innerHTML += '<input class=\'settingButton\' name=\'getSolution\' type=\'button\' value=\'Решение\'>';
    const mainContainerWrapper = Puzzle.createElem('div', [], 'wrapper');
    const mainContainerWrapperInfo = Puzzle.createElem('div', [], 'wrapper_info');
    const mainContainerWrapperInfoChImage = Puzzle.createElem('button', [], 'wrapper_info__chImage');
    mainContainerWrapperInfoChImage.innerText = 'change image';
    const mainContainerWrapperInfoContainer = Puzzle.createElem('div', [], 'wrapper_info__container');
    const mainContainerWrapperInfoContainerSteps = Puzzle.createElem('p', [], 'wrapper_info__container');
    mainContainerWrapperInfoContainerSteps.innerText = 'Steps: ';
    Puzzle.stepSpan = Puzzle.createElem('span', [['id', 'wrapper_info__steps']], 'info_steps');
    Puzzle.stepSpan.innerText = '0';
    mainContainerWrapperInfoContainerSteps.append(Puzzle.stepSpan);
    const mainContainerWrapperInfoContainerTime = Puzzle.createElem('p', [], 'wrapper_info__container');
    mainContainerWrapperInfoContainerTime.innerText = 'Time: ';
    this.minSpan = Puzzle.createElem('span', [['id', 'time_min']], 'info_min');
    this.minSpan.innerText = '00';
    this.timeDelimiterSpan = Puzzle.createElem('span', [['id', 'time_min']], 'info_time-delimetr');
    this.timeDelimiterSpan.innerText = ':';
    this.secSpan = Puzzle.createElem('span', [['id', 'time_sec']], 'info_sec');
    this.secSpan.innerText = '00';
    mainContainerWrapperInfoContainerTime.append(
      this.minSpan,
      this.timeDelimiterSpan,
      this.secSpan,
    );
    mainContainerWrapperInfoContainer.append(
      mainContainerWrapperInfoContainerSteps,
      mainContainerWrapperInfoContainerTime,
    );
    mainContainerWrapperInfo.append(
      mainContainerWrapperInfoContainer,
      mainContainerWrapperInfoChImage,
    );
    this.mainContainerWrapperPuzzle = Puzzle.createElem('div', [], 'wrapper_puzzle');
    mainContainerWrapper.append(this.mainContainerWrapperPuzzle);
    const mainContainerPuzzleSize = Puzzle.createElem('div', [], 'puzzleSize');
    mainContainerPuzzleSize.innerHTML = `<div class="puzzleSizeNow"><p>Размер поля ${this.size}x${this.size}</p></div>`;
    const mainContainerPuzzleSizeOther = Puzzle.createElem('div', [], 'puzzleSizeOther');
    for (let i = 2; i <= 8; i += 1) {
      const text = (i === 2) ? '<p>Другие размеры</p> ' : `<a class="size_puzzle" href="#">${i}x${i}</a> `;
      mainContainerPuzzleSizeOther.innerHTML += text;
    }
    mainContainerPuzzleSize.append(mainContainerPuzzleSizeOther);
    mainContainer.append(mainContainerWrapperInfo, mainContainerWrapper, mainContainerPuzzleSize);
    const modal = Puzzle.createElem('div', [], 'modal');
    Puzzle.modalWindow = Puzzle.createElem('div', [], 'modal_window'); // '<div class="modal_window"></div>'
    Puzzle.modalWindow.innerHTML = '<div class="modal_window__info"></div>';
    const buttonOk = Puzzle.createElem('div', [], 'modal_window__ok');
    buttonOk.innerHTML = '<p>OK</p>';
    Puzzle.modalWindow.append(buttonOk);
    const footer = Puzzle.createElem('footer', [], 'puzzle_footer');
    modal.append(Puzzle.modalWindow);
    header.append(mainContainerSettings);
    document.body.append(header, mainContainer, footer, modal);
  }

  renderPuzzle(num = null) {
    this.image = new Image();
    this.image.src = `https://raw.githubusercontent.com/irinainina/image-data/master/box/${this.imageCanvas}.jpg`;
    this.image.onload = () => {
      this.mainContainerWrapperPuzzle.innerHTML = '';
      this.innerText = '0';
      this.size = num === null ? this.size : num;
      const sizeCanvas = this.getCanvasSizeFromResolution(this.size);
      const size = this.size * this.size;
      for (let i = 1; i <= size - 1; i += 1) {
        const attribute = [];
        const puzzleContainer = Puzzle.createElem('div', attribute, 'wrapper_puzzle__container');
        puzzleContainer.classList.add(`col_${this.size}`);
        const container = Puzzle.createElem('div', [['id', `container_${i}`]], 'container');
        const canvas = Puzzle.createElem('canvas', [['width', `${sizeCanvas}`], ['height', `${sizeCanvas}`]], 'wrapper_puzzle__canvas');
        this.drowCanvasImg(canvas, i, this.size);
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
      lastPuzzleContainer.classList.add(`col_${this.size}`);
      this.mainContainerWrapperPuzzle.append(lastPuzzleContainer);
      document.querySelector('.puzzleSize p').innerHTML = `Размер поля ${this.size}x${this.size}`;
    };
  }

  getCanvasSizeFromResolution() {
    let sizeCanvas;
    const resolution = window.screen.width;
    if (resolution > 1280) {
      sizeCanvas = Math.trunc(600 / this.size);
    } else if (resolution <= 1280 && resolution >= 768) {
      sizeCanvas = Math.trunc(500 / this.size);
    } else if (resolution < 768) {
      sizeCanvas = Math.trunc(300 / this.size);
    }
    return sizeCanvas - 1;
  }

  drowCanvasImg(canvas, i, size) {
    // const canvas = document.querySelector('.wrapper_puzzle__canvas');
    const idx = i - 1;
    const lengthPuzzle = size * size;
    const cnv = canvas;
    const context = cnv.getContext('2d');

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
  }

  changeCanvasImg() {
    this.imageCanvas = Math.trunc(1 + Math.random() * (150));
    this.renderPuzzle(this.size, this.imageCanvas);
  }

  addListener() {
    document.querySelector('.puzzleSize').addEventListener('click', (e) => this.setPuzzleSize(e));
    document.querySelector('.setting').addEventListener('click', (e) => this.installSettings(e));
    document.querySelector('.wrapper_info__chImage').addEventListener('click', () => this.changeCanvasImg());
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
        document.onmousemove = null;
        if (dndFlag && this.gameState === 'play' && direction.length > 0) {
          dndFlag = !dndFlag;
          await this.moveContainer(selectedContainer, emptyContainer, direction);
        } else {
          await this.mouseUp(event);
        }
        this.gameState = 'play';
        document.onmouseup = null;
      };
      selectedContainer.ondragstart = () => false;
    }
  }

  setPuzzleSize(e) {
    clearInterval(this.timer);
    this.minSpan.innerText = '00';
    this.secSpan.innerText = '00';
    if (e.target.classList.contains('size_puzzle')) {
      this.renderPuzzle(e.target.innerText[0]);
    }
  }

  async mouseUp(e) {
    if (e.target.closest('.container') && this.gameState === 'play') {
      const selectedContainer = e.target.closest('.container');
      const emptyContainer = document.querySelector('#last_container');
      const direction = Puzzle.getDirection(selectedContainer, emptyContainer);
      if (direction.length > 0) {
        await this.moveContainer(selectedContainer, emptyContainer, direction);
      }
    }
  }

  static getDirection(selectedContainer, emptyContainer) {
    let direction = '';
    const selectedContainerCrdnts = Puzzle.getCoords(selectedContainer);
    const emptyContainerCrdnts = Puzzle.getCoords(emptyContainer);
    const resTop = Math.floor(selectedContainerCrdnts.top - emptyContainerCrdnts.top);
    const resLeft = Math.floor(selectedContainerCrdnts.left - emptyContainerCrdnts.left);
    if (selectedContainerCrdnts.left === emptyContainerCrdnts.left) {
      if (resTop <= 0 && resTop >= -Math.floor(selectedContainerCrdnts.width + 5)) {
        direction = 'D_UP';
      }
      if (resTop >= 0 && resTop <= Math.floor(selectedContainerCrdnts.width + 5)) {
        direction = 'D_DOWN';
      }
    }
    if (selectedContainerCrdnts.top === emptyContainerCrdnts.top) {
      if (resLeft <= 0 && resLeft >= -Math.floor(selectedContainerCrdnts.width + 5)) {
        direction = 'D_LEFT';
      }
      if (resLeft >= 0 && resLeft <= Math.floor(selectedContainerCrdnts.width + 5)) {
        direction = 'D_RIGHT';
      }
    }
    return direction;
  }

  async moveContainer(container, emptyContainer, direction) {
    this.gameState = 'pause';
    let offset = 0;
    let answer = [];
    const cntnr = container;
    if (direction === 'D_UP' || direction === 'D_DOWN') {
      offset = Math.abs(+container.style.top.slice(0, -2));
    }
    if (direction === 'D_LEFT' || direction === 'D_RIGHT') {
      offset = Math.abs(+cntnr.style.left.slice(0, -2));
    }
    const startDate = Date.now();
    const promise = new Promise((resolve) => {
      let result;

      const timer = setInterval(() => {
        const timePassed = Date.now() - startDate;
        if (timePassed >= 500) {
          console.log(timer);
          clearInterval(timer);
          return;
        }
        cntnr.style = `z-index: 1000; ${this.directions.get(direction)}: ${offset + (timePassed)}px`;

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

    // promise.then((result) => {
    //   // console.log(result);
    //   if (result) answer = Puzzle.getSequenceNumbers();
    //   //
    // });
    if (await promise) answer = Puzzle.getSequenceNumbers();
    return answer;
  }

  static checkPositionActiveContainer(container, emptyContainer, timer) {
    // console.log(this);
    Puzzle.stepSpan.innerText = +Puzzle.stepSpan.innerText + 1;
    const numEmptyContainer = emptyContainer.childNodes[0];
    emptyContainer.removeAttribute('id');
    emptyContainer.removeAttribute('style');
    container.removeAttribute('style');
    container.parentNode.setAttribute('id', 'last_container');
    container.parentNode.append(numEmptyContainer);
    emptyContainer.append(container);
    clearInterval(timer);
    // document.querySelector('.wrapper_puzzle').addEventListener('mouseup', this.mouseUp);

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

  setTime() {
    Puzzle.stepSpan.innerText = '0';
    this.minSpan.innerText = '00';
    this.secSpan.innerText = '00';
    let min = 0;
    let sec = 0;
    return setInterval(() => {
      sec += 1;
      if (sec < 10) this.secSpan.innerText = `0${sec}`;
      else if (sec >= 10 && sec < 60) this.secSpan.innerText = sec;
      if (sec === 60) {
        this.secSpan.innerText = '00';
        min += 1;
        sec = 0;
        if (min < 10) this.minSpan.innerText = `0${min}`;
        else if (min >= 10 && min < 60) this.minSpan.innerText = min;
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
    // ################# start game #######################
    if (e.target.getAttribute('name') === 'startGame') {
      this.gameState = 'play';
      // this.shufflePuzzle();
      clearTimeout(this.timer);
      this.timer = this.setTime();
    }

    // ################# get solution #######################
    if (e.target.getAttribute('name') === 'getSolution') {
      this.gameState = 'pause';
      clearTimeout(this.timer);
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
