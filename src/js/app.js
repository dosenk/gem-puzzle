import Puzzle from './Puzzle';
import State from './State';

window.onload = () => {
  const size = '4';
  const gemPuzzle = new Puzzle(size);
  gemPuzzle.createPazzle();
  gemPuzzle.renderPuzzle();
  gemPuzzle.addListener();

  // const arrStart = [['2', '8', '3', '1', '4', '5', '6', '7', '0'], ['now']];
  // const arrFinal = ['1', '2', '3', '4', '5', '6', '7', '8', '0'];

  const arrStart = [['1', '2', '3', '4', '5', '6', '7', '8', '0', '10', '11', '12', '9', '13', '14', '15'], ['strat']];
  const arrFinal = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '0'];
  const nums = new State();
  // console.log(State.move('D_RIGHT', arr));

  nums.findPath(arrStart, arrFinal);
};
