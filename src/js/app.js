import { Puzzle } from './class';

window.onload = () => {
  const size = '4';
  const gemPuzzle = new Puzzle(size);
  gemPuzzle.createPazzle();
  gemPuzzle.renderPuzzle();
  gemPuzzle.addListener();
};
