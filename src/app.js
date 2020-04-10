import puzzle from './module/class.js'

window.onload = () => {
    let size = '4'
    let gemPuzzle = new puzzle(size)

    gemPuzzle.createPazzle()
    gemPuzzle.renderPuzzle()
    gemPuzzle.addListener()
}
