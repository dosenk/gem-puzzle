import puzzle from './module/class.js';
let size = '4';
let gemPuzzle = new puzzle(size);

gemPuzzle.createPazzle();
gemPuzzle.renderPuzzle();
gemPuzzle.addListener()