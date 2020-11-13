// eslint-disable-next-line import/no-named-as-default-member
import Puzzle from './Puzzle';
import State from './State';

window.onload = async () => {
  const size = '4';
  const gemPuzzle = new Puzzle(size);
  gemPuzzle.renderDomElements();
  gemPuzzle.renderPuzzle();
  gemPuzzle.addListener();

  const state = new State();
  state.addListenerState();

  // const a = [3, 5, 7, 2, 1, 0, 6, 8, 4];
  // const b = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  // const path = await state.findPath(a, b);
  // console.log(await path.path);
};
