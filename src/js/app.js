import Puzzle from './Puzzle';
import State from './State';

window.onload = () => {
  const size = '5';
  const gemPuzzle = new Puzzle(size);
  gemPuzzle.createPazzle();
  gemPuzzle.renderPuzzle();
  gemPuzzle.addListener();

  // const arrStart = [[2, 4, 3, 0, 5, 6, 1, 7, 8], []];
  // const arrFinal = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  // const arrStart = [[1, 2, 4, 12, 10, 7, 0, 8, 3, 13, 5, 11, 9, 14, 15, 6], []];
  // const arrFinal = [1, 2, 3, 4,
  //   5, 6, 7, 8,
  //   9, 10, 11, 12,
  //   13, 14, 15, 0];

  const arrStart = [[1, 2, 3, 4,
    5, 6, 7, 8,
    9, 0, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], []];
  const arrFinal = [1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0];

  const nums = new State();
  // // console.log(State.move('D_RIGHT', arr));
  // const ar1 = [10, 6, 1, 2,
  //   11, 9, 13, 8,
  //   0, 14, 15, 7,
  //   12, 3, 4, 5];

  // const ar2 = [10, 6, 1, 2,
  //   11, 9, 13, 8,
  //   14, 15, 0, 7,
  //   12, 3, 4, 5];

  // const ar3 = [10, 6, 1, 2,
  //   11, 0, 13, 8,
  //   14, 9, 15, 7,
  //   12, 3, 4, 5];

  // const ar4 = [10, 6, 1, 2,
  //   11, 9, 13, 8,
  //   14, 3, 15, 7,
  //   12, 0, 4, 5];
  nums.findPath(arrStart, arrFinal);
  // console.log(State.isSoloble(ar4));
  // console.log(State.manhattanDistance(ar4));
  // console.log(State.linearConflict(ar4));
  // State.linearConflict(arrFinal);
};
