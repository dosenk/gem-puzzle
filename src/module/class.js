export default class puzzle {
    static answer = ''
    // static step = 0
    static minSpan
    static secSpan 
    static mainContainerWrapperPuzzle
    static stepSpan = '0'//document.querySelector('#wrapper_info__steps')
    constructor(size) {
      this.size = size
    }

    createPazzle() {
        let mainContainer = puzzle.createElem('div', [], 'main_container')
        let mainContainerSettings = puzzle.createElem('div', [], 'setting')
        mainContainerSettings.innerHTML = `<input class='settingButton' name='settingStart' type='button' value='Размешать и начать'>`
        mainContainerSettings.innerHTML += `<input class='settingButton' name='settingStop' type='button' value='Стоп'>`
        mainContainerSettings.innerHTML += `<input class='settingButton' name='settingSave' type='button' value='Сохранить'>`
        mainContainerSettings.innerHTML += `<input class='settingButton' name='settingResult' type='button' value='Результаты'>`

        let mainContainerWrapper = puzzle.createElem('div', [], 'wrapper')
        let mainContainerWrapperInfo = puzzle.createElem('div', [], 'wrapper_info')
        mainContainerWrapperInfo.innerHTML = `<p>Ходов: <span id="wrapper_info__steps">0</span> Время: <span id="wrapper_info__time"><span id="time_min">00</span>:<span id ="time_sec">00</span></span></p>`
        puzzle.mainContainerWrapperPuzzle = puzzle.createElem('div', [], 'wrapper_puzzle')
        mainContainerWrapper.append(mainContainerWrapperInfo, puzzle.mainContainerWrapperPuzzle)

        let mainContainerPuzzleSize = puzzle.createElem('div', [], 'puzzleSize')
        mainContainerPuzzleSize.innerHTML = `<p>Размер поля ${this.size}x${this.size}</p>`;
        mainContainerPuzzleSize.innerHTML += `Другие размеры `
        mainContainerPuzzleSize.innerHTML += `<a class="size_puzzle" href="#">3x3</a> `
        mainContainerPuzzleSize.innerHTML += `<a class="size_puzzle" href="#">4x4</a> `
        mainContainerPuzzleSize.innerHTML += `<a class="size_puzzle" href="#">5x5</a> `
        mainContainerPuzzleSize.innerHTML += `<a class="size_puzzle" href="#">6x6</a> `
        mainContainerPuzzleSize.innerHTML += `<a class="size_puzzle" href="#">7x7</a> `
        mainContainerPuzzleSize.innerHTML += `<a class="size_puzzle" href="#">8x8</a>`

        mainContainer.append(mainContainerSettings, mainContainerWrapper, mainContainerPuzzleSize)

        let modal = puzzle.createElem('div', [], 'modal')
        puzzle.modalWindow = puzzle.createElem('div', [], 'modal_window') //'<div class="modal_window"></div>'
        puzzle.modalWindow.innerHTML = '<div class="modal_window__info"></div>'
        let buttonOk = puzzle.createElem('div', [], 'modal_window__ok')
        buttonOk.innerHTML = '<p>OK</p>'
        puzzle.modalWindow.append(buttonOk)
        modal.append(puzzle.modalWindow)

        document.body.append(mainContainer, modal);
    }

    getSize() {
        return this.size;   
    }

    renderPuzzle(num = null) {
        puzzle.minSpan = document.querySelector('#time_min')
        puzzle.secSpan = document.querySelector('#time_sec')
        puzzle.answer = ''
        puzzle.stepSpan = document.querySelector('#wrapper_info__steps')
        puzzle.stepSpan.innerText = '0'

        let sizePuzzle = num === null ? this.size : num;
        let size = Math.pow(sizePuzzle, 2)
        for (let i = 1; i <= size - 1; i++) {
            let puzzleContainer = puzzle.createElem('div', [], 'wrapper_puzzle__container')
            puzzleContainer.classList.add(`col_${sizePuzzle}`)
            puzzleContainer.innerHTML = `<div class="container" id="container_${i}"><p class="wrapper_puzzle__container-text">${i}</p></div>`;
            puzzle.mainContainerWrapperPuzzle.append(puzzleContainer)
            puzzle.answer += i
        }
        puzzle.answer += size
        let lastPuzzleContainer = puzzle.createElem('div', [['id', `last_container`]], 'wrapper_puzzle__container')
        lastPuzzleContainer.innerHTML = `<div id="container_${size}"><p class="wrapper_puzzle__container-last">${size}</p></div>`;
        lastPuzzleContainer.classList.add(`col_${sizePuzzle}`)
        puzzle.mainContainerWrapperPuzzle.append(lastPuzzleContainer)
        document.querySelector('.puzzleSize p').innerHTML = `Размер поля ${sizePuzzle}x${sizePuzzle}`
    }

    addListener() {
        document.querySelector('.puzzleSize').addEventListener('click', (e) => { 
        document.querySelector('.wrapper_puzzle').removeEventListener('mouseup', puzzle.mouseUp, false)
        clearInterval(puzzle.timer)
        puzzle.minSpan.innerText = '00'
        puzzle.secSpan.innerText = '00'
            if (e.target.classList.contains('size_puzzle')) {
                document.querySelectorAll('.wrapper_puzzle__container').forEach(container => {
                    container.remove();
                })
                this.renderPuzzle(e.target.innerText[0])
            }
            // e.target.style = 'cursor: not-allowed;' 
        })
        document.querySelector('.setting').addEventListener('click', puzzle.installSettings, false)
        document.querySelector('.settingButton').addEventListener('click', puzzle.startGame, false)

        // document.querySelector('.modal_window__ok').addEventListener('click', () => {
        //     console.log(123)

        //     document.querySelector('.modal').style = 'display: none'
        // }, false)
    }

    static createElem(element, atributes = [], ...classes) {
        let elem = document.createElement(element)
        classes.forEach(className => elem.classList.add(className))
        if (atributes.length > 0) {
            atributes.forEach(atribute => elem.setAttribute(atribute[0], atribute[1]))
        }
        return elem
    }

    static mouseUp (e) {
        let selectedContainer = e.target.closest('div')
 
        if (selectedContainer.classList.contains('container')) {

            let emptyContainer = document.querySelector('#last_container')
            let topSelectedContainer = selectedContainer.getBoundingClientRect().top
            let topEmptyContainer = emptyContainer.getBoundingClientRect().top
            let leftSelectedContainer = selectedContainer.getBoundingClientRect().left
            let leftEmptyContainer = emptyContainer.getBoundingClientRect().left
            let widthContainer = selectedContainer.getBoundingClientRect().width

            if (leftSelectedContainer === leftEmptyContainer) {
                if (Math.floor(topEmptyContainer - topSelectedContainer)  === Math.floor(widthContainer)) { 
                    this.removeEventListener('mouseup', puzzle.mouseUp, false)
                    puzzle.moveContainer(selectedContainer, emptyContainer, 'top')
                }
                if (Math.floor(topSelectedContainer - topEmptyContainer)  === Math.floor(widthContainer)) { 
                    this.removeEventListener('mouseup', puzzle.mouseUp, false)
                    puzzle.moveContainer(selectedContainer, emptyContainer, 'bottom')
                }
            }
            if (topSelectedContainer === topEmptyContainer) {
                if (Math.floor(leftEmptyContainer - leftSelectedContainer)  === Math.floor(widthContainer)) { 
                    this.removeEventListener('mouseup', puzzle.mouseUp, false)
                    puzzle.moveContainer(selectedContainer, emptyContainer, 'left')
                }
                if (Math.floor(leftSelectedContainer - leftEmptyContainer) === Math.floor(widthContainer)) { 
                    this.removeEventListener('mouseup', puzzle.mouseUp, false)
                    puzzle.moveContainer(selectedContainer, emptyContainer, 'right')
                }
            }
            
            
        }
    }

    static moveContainer(container, emptyContainer, direction) {
        let start = Date.now()
        let timer = setInterval(() => {
            let timePassed = Date.now() - start;
            if (timePassed >= 500) {
                clearInterval(timer)
                return
            }
            container.style = `z-index: 1000; ${direction}: ${timePassed/4}px`;

        let promise = new Promise((resolve, reject) => {
            let result;
            if (direction === 'top') {
                if (emptyContainer.getBoundingClientRect().top <= container.getBoundingClientRect().top) {
                    result = puzzle.checkPositionActiveContainer(container, emptyContainer, timer)
                    }
            }
            if (direction === 'bottom') {
                if (Math.floor(emptyContainer.getBoundingClientRect().top) >= Math.floor(container.getBoundingClientRect().top)) {
                    result = puzzle.checkPositionActiveContainer(container, emptyContainer, timer)
                    }
            }
            if (direction === 'left') {
                if (emptyContainer.getBoundingClientRect().left <= container.getBoundingClientRect().left) {
                    result = puzzle.checkPositionActiveContainer(container, emptyContainer, timer)
                    }
            }
            if (direction === 'right') {
                if (emptyContainer.getBoundingClientRect().left >= container.getBoundingClientRect().left) {
                    result = puzzle.checkPositionActiveContainer(container, emptyContainer, timer)
                    }
            }
            setTimeout(() => resolve(result), 20);
        });
            let resAnswer = '';
            promise.then(result => {
                if (result === true) {
                    document.querySelectorAll('.wrapper_puzzle__container p').forEach(res => {
                        resAnswer += res.innerText
                    })
                    if (this.answer === resAnswer) {
                        clearInterval(puzzle.timer)
                        // puzzle.modalWindow.append(resAnswer)
                        puzzle.setResultsGame('getRes')
                        alert('you are the best !')
                    }
                }
            })
        })
    }

    static checkPositionActiveContainer(container, emptyContainer, timer) {
        puzzle.stepSpan.innerText = Number(puzzle.stepSpan.innerText) + 1
        let numEmptyContainer = emptyContainer.childNodes[0]
        emptyContainer.removeAttribute('id')
        emptyContainer.removeAttribute('style')
        container.removeAttribute('style')
        container.parentNode.setAttribute('id', 'last_container')
        container.parentNode.append(numEmptyContainer)
        emptyContainer.append(container)
        clearInterval(timer)
        document.querySelector('.wrapper_puzzle').addEventListener('mouseup', puzzle.mouseUp, false)
        return true
    }

    static installSettings(e) {
        if (e.target.getAttribute('name') === 'settingStop') {
            clearInterval(puzzle.timer)
            puzzle.stopFlag = true
            document.querySelector('.wrapper_puzzle').removeEventListener('mouseup', puzzle.mouseUp, false)
        }
        if (e.target.getAttribute('name') === 'settingSave') {
            clearInterval(puzzle.timer)

            // localStorage.clear()
            if (puzzle.stopFlag) {
                puzzle.stopFlag = false
                clearInterval(puzzle.timer)
                puzzle.setResultsGame('saveRes')
                alert('Игра сохранена. Для возобновления игры зайдите в результаты - и выберите пунтк "Продолжить сохраненную игру"')
            } else {
                alert('Сперва остановите игру!')
            }
            
        }
        // ############################################################## settingResult ###########################################################
        if (e.target.getAttribute('name') === 'settingResult') {
            document.querySelector('.modal').style = 'display: block'
            let modal_window = document.querySelector('.modal_window__info')
            modal_window.innerHTML = ''
            let results = JSON.parse(localStorage.getRes)
            // console.log(results)
            
            results.forEach((res, index) => {
                let puzzleSize = Math.sqrt(res.puzzleOrder.length)
                modal_window.innerHTML += `<p>${index + 1}. Поле ${puzzleSize}x${puzzleSize}: Время - ${res.min}:${res.sec}; Шаги - ${res.step}</p>`
            })
            modal_window.innerHTML += `<a href="#">Продолжить сохраненную игру</a>`

            document.querySelector('.modal_window__info a').addEventListener('click', () => {
                clearInterval(puzzle.timer)
                // document.querySelector('.modal').style = 'display: none'
                let resN = JSON.parse(localStorage.getItem('saveRes'))
                let container = document.querySelector('.wrapper_puzzle');
                puzzle.stepSpan.innerText = resN.step
                puzzle.minSpan.innerText = resN.min
                puzzle.secSpan.innerText = resN.sec
                console.log(resN.puzzleOrder)
                container.innerHTML = resN.puzzleOrder
                let settingStart = document.querySelector('.settingButton')
            
                document.querySelector('.settingButton').removeEventListener('click', puzzle.startGame, false)
                settingStart.value = 'ПРОДОЛЖИТЬ'

                settingStart.addEventListener('click', () => {
                document.querySelector('.wrapper_puzzle').addEventListener('mouseup', puzzle.mouseUp, false)
                    
                    let min = Number(puzzle.minSpan.innerText)
                    let sec = Number(puzzle.secSpan.innerText)
                    puzzle.timer = setInterval(() => {
                        sec += 1
                        if (sec < 10) puzzle.secSpan.innerText = `0${sec}`
                        else if (sec >= 10 && sec < 60) puzzle.secSpan.innerText = sec
                        if (sec === 60) {
                            puzzle.secSpan.innerText = '00'
                            min += 1
                            sec = 0
                            if (min < 10) puzzle.minSpan.innerText = `0${min}`
                            else if (min >= 10 && min < 60) puzzle.minSpan.innerText = min
                        }
                    }, 1000)
                    settingStart.value = 'Размешать и начать'
                    document.querySelector('.settingButton').addEventListener('click', puzzle.startGame, false)
                })





                
            }, false)
            document.querySelector('.modal_window__ok').addEventListener('click', () => {
                document.querySelector('.modal').style = 'display: none'
            }, false)
        }
    }

    static setResultsGame(resName) { // 'saveRes', 'getRes'
        let res = {}
        res.step = puzzle.stepSpan.innerText
        res.min = puzzle.minSpan.innerText
        res.sec = puzzle.secSpan.innerText

        if (resName === 'saveRes') {
            res.puzzleOrder = document.querySelector('.wrapper_puzzle').innerHTML
            // document.querySelector('.wrapper_puzzle').forEach(element => {
            //     console.log(element)
            //     res.puzzleOrder.push(element) 
            // }) 
        }
        console.log(res)
        
        if (resName === 'getRes') {
            let resN = localStorage.getItem(resName) !== null ? localStorage.getItem(resName) : JSON.stringify([])
            resN = JSON.parse(resN)
            if (resN.length >= 10) resN.pop()
            resN.unshift(res)
            res = resN
        }
        
        localStorage.setItem(resName, JSON.stringify(res));
        console.log(localStorage)
    }

    static startGame() {
            document.querySelector('.wrapper_puzzle').addEventListener('mouseup', puzzle.mouseUp, false)
            // console.log(e.target)
            clearInterval(puzzle.timer)
            puzzle.stepSpan.innerText = '0'
            let arrauDiv = []
            document.querySelectorAll('.wrapper_puzzle__container ').forEach(elem => {
                arrauDiv.push(elem)
                elem.remove()
            })
            arrauDiv.sort(() => Math.random() - 0.5);
            arrauDiv.forEach(elem => {
                puzzle.mainContainerWrapperPuzzle.append(elem)
            })
            puzzle.minSpan.innerText = '00'
            puzzle.secSpan.innerText = '00'
            let min = 0
            let sec = 0
            puzzle.timer = setInterval(() => {
                sec += 1
                if (sec < 10) puzzle.secSpan.innerText = `0${sec}`
                else if (sec >= 10 && sec < 60) puzzle.secSpan.innerText = sec
                if (sec === 60) {
                    puzzle.secSpan.innerText = '00'
                    min += 1
                    sec = 0
                    if (min < 10) puzzle.minSpan.innerText = `0${min}`
                    else if (min >= 10 && min < 60) puzzle.minSpan.innerText = min
                }
            }, 1000)
    }
}