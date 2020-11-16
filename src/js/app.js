import Puzzle from './Puzzle';
import State from './State';
import SOLUTIONS from './const/solutions';

window.onload = async () => {
  const size = '4';
  const gemPuzzle = new Puzzle(size, SOLUTIONS);
  gemPuzzle.renderDomElements();
  gemPuzzle.renderPuzzle();
  gemPuzzle.addListener();
  const state = new State(size, SOLUTIONS);
  state.addListenerState();
};
