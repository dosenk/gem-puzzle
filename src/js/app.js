import Puzzle from './Puzzle';
import State from './State';

window.onload = () => {
  const size = '3';
  const gemPuzzle = new Puzzle(size);
  gemPuzzle.createPazzle();
  gemPuzzle.renderPuzzle();
  gemPuzzle.addListener();
  // const nums = State.getNumbers(); // [0] - string, [1] - array
  // console.log(State.getHash(nums[0]));
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const nums = new State(arr);
  console.log(nums.move('D_UP'));
};
