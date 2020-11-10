// eslint-disable-next-line import/no-named-as-default-member
import Puzzle from './Puzzle';
import State from './State';

window.onload = async () => {
  const size = '5';
  const gemPuzzle = new Puzzle(size);
  gemPuzzle.createPazzle();
  gemPuzzle.renderPuzzle();
  gemPuzzle.addListener();

  const nums = new State();
  nums.addListenerState();
};
