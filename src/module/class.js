export default class puzzle {
    constructor(size) {
      this.size = size
    }

    createPazzle() {
        let mainContainer = puzzle.createElem('div', [], 'container')
        let mainContainerSettings = puzzle.createElem('div', [], 'setting')
        mainContainerSettings.innerHTML = `<input class='settingButton' name='settingStart' type='button' value='Размешать и начать'>`
        mainContainerSettings.innerHTML += `<input class='settingButton' name='settingStop' type='button' value='Стоп'>`
        mainContainerSettings.innerHTML += `<input class='settingButton' name='settingSave' type='button' value='Сохранить'>`
        mainContainerSettings.innerHTML += `<input class='settingButton' name='settingResult' type='button' value='Результаты'>`

        let mainContainerWrapper = puzzle.createElem('div', [], 'wrapper')
        let mainContainerWrapperInfo = puzzle.createElem('div', [], 'wrapper_info')
        mainContainerWrapperInfo.innerHTML = '<p>Ходов: <span id="wrapper_info__steps">12</span> Время: <span id="wrapper_info__time">12:43</span></p>'
        this.mainContainerWrapperPuzzle = puzzle.createElem('div', [], 'wrapper_puzzle')
        mainContainerWrapper.append(mainContainerWrapperInfo, this.mainContainerWrapperPuzzle)

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
        document.body.append(mainContainer);
    }

    renderPuzzle(num = null) {
        let sizePuzzle = num === null ? this.size : num;
        let size = Math.pow(sizePuzzle, 2)
        for (let i = 1; i <= size - 1; i++) {
            let puzzleContainer = puzzle.createElem('div', [['id', `container_${i}`]], 'wrapper_puzzle__container')
            puzzleContainer.classList.add(`col_${sizePuzzle}`)
            puzzleContainer.innerHTML = `<p class="wrapper_puzzle__container-text">${i}</p>`;
            this.mainContainerWrapperPuzzle.append(puzzleContainer)
        }
        let lastPuzzleContainer = puzzle.createElem('div', [['id', `container_${size}`]], 'wrapper_puzzle__container')
        lastPuzzleContainer.classList.add(`col_${sizePuzzle}`)
        this.mainContainerWrapperPuzzle.append(lastPuzzleContainer)
    }

    addListener() {
        document.querySelector('.puzzleSize').addEventListener('click', (e) => {
            if (e.target.classList.contains('size_puzzle')) {
                document.querySelectorAll('.wrapper_puzzle__container').forEach(container => {
                    container.remove();
                })
                this.renderPuzzle(e.target.innerText[0])
            }
            // e.target.style = 'cursor: not-allowed;'
            console.log(this.mainContainerWrapperPuzzle)
        })
        
    }



    static createElem(element, atributes = [], ...classes) {
        let elem = document.createElement(element)
        classes.forEach(className => elem.classList.add(className))
        if (atributes.length > 0) {
            atributes.forEach(atribute => elem.setAttribute(atribute[0], atribute[1]))
        }
        return elem
    }

}