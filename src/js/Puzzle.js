export default class Puzzle {
  static answer
  static step = 0
  static minSpan
  static secSpan
  // static mainContainerWrapperPuzzle
  static stepSpan = '0'//document.querySelector('#wrapper_info__steps')
  constructor(size) {
    this.size = size
    this.gameState = 'stop' // 'pause', 'play'
    this.directions = new Map(
        [
          ['D_UP', 'top'],
          ['D_DOWN', 'bottom'],
          ['D_LEFT', 'left'],
          ['D_RIGHT', 'right']
        ]
      )
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
    this.mainContainerWrapperPuzzle.innerHTML = ''
    Puzzle.minSpan = document.querySelector('#time_min');
    Puzzle.secSpan = document.querySelector('#time_sec');
    Puzzle.answer = '';
    Puzzle.stepSpan = document.querySelector('#wrapper_info__steps');
    Puzzle.stepSpan.innerText = '0';

    const sizePuzzle = num === null ? this.size : num;
    const size = Math.pow(sizePuzzle, 2);
    for (let i = 1; i <= size - 1; i += 1) {
      let attribute = []
      const puzzleContainer = Puzzle.createElem('div', attribute, 'wrapper_puzzle__container');
      puzzleContainer.classList.add(`col_${sizePuzzle}`);
      puzzleContainer.innerHTML = `<div class="container" id="container_${i}"><p class="wrapper_puzzle__container-text">${i}</p></div>`;
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

  addListener() {
    // document.querySelector('.puzzleSize').addEventListener('click', this.setPuzzleSize.bind(this));
    document.querySelector('.setting').addEventListener('click', this.installSettings.bind(this));
    this.mainContainerWrapperPuzzle.addEventListener('mousedown', this.dragAndDrop.bind(this))
    this.mainContainerWrapperPuzzle.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  installSettings(e) {
    if (e.target.getAttribute('name') === 'startGame') {
      this.gameState = 'play'
    }
    if (e.target.getAttribute('name') === 'getSolution') {
      this.gameState = 'pause';
      this.getSequenceNumbers()
    }
  }


  getSequenceNumbers() {
    const sequence = []
    document.querySelectorAll('.wrapper_puzzle__container-text').forEach(number => {
      sequence.push(+number.innerText);
    })
    console.log(sequence);
  }




  static getCoords(elem) { 
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      width: box.width
    };

  }
  dragAndDrop(e) {
    if (e.target.closest('.container') && this.gameState === 'play') {
      const selectedContainer = e.target.closest('.container')
      const emptyContainer = document.querySelector('#last_container');
      const direction = Puzzle.getDirection(selectedContainer, emptyContainer)
      const selectedContainerCrdnts = Puzzle.getCoords(selectedContainer);
      let shiftX = e.pageX - selectedContainerCrdnts.left;
      let shiftY = e.pageY - selectedContainerCrdnts.top;
      function moveAt(e) {
        let resY = e.pageY - selectedContainerCrdnts.top - shiftY
        let resX = e.pageX - selectedContainerCrdnts.left - shiftX
        if (direction === 'D_UP') {
          selectedContainer.style.top = resY + 'px';
          if (resY < 0) {
            selectedContainer.style.top = 0 + 'px'
          }
          if (resY > selectedContainerCrdnts.width) {
            selectedContainer.style.top = selectedContainerCrdnts.width + 'px'
          }
        } else if(direction === 'D_DOWN') {
          selectedContainer.style.top = resY + 'px';
          if (resY > 0) {
            selectedContainer.style.top = 0 + 'px'
          }
          if (resY < -selectedContainerCrdnts.width) {
            selectedContainer.style.top = - selectedContainerCrdnts.width + 'px'
          }
        } else if(direction === 'D_LEFT') {
          selectedContainer.style.left = resX + 'px';
          if (resX < 0) {
            selectedContainer.style.left = 0 + 'px'
          }
          if (resX > selectedContainerCrdnts.width) {
            selectedContainer.style.left = selectedContainerCrdnts.width + 'px'
          }
        } else if(direction === 'D_RIGHT') {
          selectedContainer.style.left = resX + 'px';
          if (resX > 0) {
            selectedContainer.style.left = 0 + 'px'
          }
          if (resX < -selectedContainerCrdnts.width) {
            selectedContainer.style.left = - selectedContainerCrdnts.width + 'px'
          }
        }
        
      }
      selectedContainer.style.zIndex = 1000;
      moveAt(e)
      document.onmousemove = function(e) {
        moveAt(e);
      }
      selectedContainer.onmouseup = function() {
        document.onmousemove = null;
        selectedContainer.onmouseup = null;
      }
      selectedContainer.ondragstart = function() {
        return false;
      };
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
    // console.log(this.gameState);
    if (e.target.closest('.container') && this.gameState === 'play') {
      const selectedContainer = e.target.closest('.container');
      const emptyContainer = document.querySelector('#last_container');
      const direction = Puzzle.getDirection(selectedContainer, emptyContainer)
      if (direction.length > 0) this.moveContainer(selectedContainer, emptyContainer, direction); 
    }
  }

  static getDirection(selectedContainer, emptyContainer) {
      let direction = ''
      const selectedContainerCrdnts = Puzzle.getCoords(selectedContainer);
      const emptyContainerCrdnts = Puzzle.getCoords(emptyContainer);
      const resTop = Math.floor(selectedContainerCrdnts.top - emptyContainerCrdnts.top);
      const resLeft = Math.floor(selectedContainerCrdnts.left - emptyContainerCrdnts.left);
      if (selectedContainerCrdnts.left === emptyContainerCrdnts.left) {
        if (resTop <= 0 && resTop >= -Math.floor(selectedContainerCrdnts.width)) {
          direction = 'D_UP'
        }
        if (resTop >= 0 && resTop <= Math.floor(selectedContainerCrdnts.width)) {
          direction = 'D_DOWN'
        }
      }
      if (selectedContainerCrdnts.top === emptyContainerCrdnts.top) {
        if (resLeft <= 0 && resLeft >= -Math.floor(selectedContainerCrdnts.width)) {
          direction = 'D_LEFT'
        }
        if (resLeft >= 0 && resLeft <= Math.floor(selectedContainerCrdnts.width)) {
          direction = 'D_RIGHT'
        }
      }
      return direction;
  }

  moveContainer(container, emptyContainer, direction) {
    let offset = 0
    // let verticalOffset, horisontalOffset = false
    if (direction === 'D_UP' || direction === 'D_DOWN') {
      offset = Math.abs(+container.style.top.slice(0, -2));
      // verticalOffset = true;
    }
    if (direction === 'D_LEFT' || direction === 'D_RIGHT') {
      offset = Math.abs(+container.style.left.slice(0, -2));
      // horisontalOffset = true
    }
    console.log(offset, Puzzle.getCoords(container).width / 2);
    if (offset < Puzzle.getCoords(container).width / 2) {
      // if (verticalOffset) direction = direction === 'D_UP' ? 'D_DOWN' : 'D_UP'
      // if (horisontalOffset) direction = direction === 'D_LEFT' ? 'D_RIGHT' : 'D_LEFT'
    }
    const start = Date.now();
    const timer = setInterval(() => {
      const timePassed = Date.now() - start;
      if (timePassed >= 500) {
      clearInterval(timer);
      return;
    } 
  
      // console.log(topOffset, timePassed);
      container.style = `z-index: 1000; ${this.directions.get(direction)}: ${offset + (timePassed / 4)}px`;
      // console.log(container.style.top);

      // const promise = new Promise((resolve, reject) => {
        let result;
        if (direction === 'D_UP') {
          if (emptyContainer.getBoundingClientRect().top <= container.getBoundingClientRect().top) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
          }
        }
        if (direction === 'D_DOWN') {
          
          if (Math.floor(emptyContainer.getBoundingClientRect().top)
          >= Math.floor(container.getBoundingClientRect().top)) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
          }
        }
        if (direction === 'D_LEFT') {
          if (emptyContainer.getBoundingClientRect().left
          <= container.getBoundingClientRect().left) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
          }
        }
        if (direction === 'D_RIGHT') {
          if (emptyContainer.getBoundingClientRect().left
          >= container.getBoundingClientRect().left) {
            result = Puzzle.checkPositionActiveContainer(container, emptyContainer, timer);
          }
        }
        // setTimeout(() => resolve(result), 20);
      // });


      // let resAnswer = '';
      // promise.then((result) => {
      //   if (result === true) {
      //     document.querySelectorAll('.wrapper_puzzle__container p').forEach((res) => {
      //       resAnswer += res.innerText;
      //     });
      //     if (this.answer === resAnswer) {
      //       clearInterval(Puzzle.timer);
      //       // Puzzle.modalWindow.append(resAnswer)
      //       Puzzle.setResultsGame('getRes');
      //       alert('you are the best !');
      //     }
      //   }
      // });
    });
  }

  static checkPositionActiveContainer(container, emptyContainer, timer) {
    Puzzle.stepSpan.innerText = Number(Puzzle.stepSpan.innerText) + 1;
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
    //     modal_window.innerHTML += `<p>${index + 1}. Поле ${puzzleSize}x${puzzleSize}: Время - ${res.min}:${res.sec}; Шаги - ${res.step}</p>`;
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
    //       Puzzle.timer = setInterval(() => {
    //         sec += 1;
    //         if (sec < 10) Puzzle.secSpan.innerText = `0${sec}`;
    //         else if (sec >= 10 && sec < 60) Puzzle.secSpan.innerText = sec;
    //         if (sec === 60) {
    //           Puzzle.secSpan.innerText = '00';
    //           min += 1;
    //           sec = 0;
    //           if (min < 10) Puzzle.minSpan.innerText = `0${min}`;
    //           else if (min >= 10 && min < 60) Puzzle.minSpan.innerText = min;
    //         }
    //       }, 1000);
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
    this.gameState = 'play'
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
