export default class Score {
  static addListeners() {
    Score.closeBtnScore.addEventListener('click', (e) => Score.closeScore(e));
  }

  static createElem(element, atributes = [], ...classes) {
    const elem = document.createElement(element);
    classes.forEach((className) => elem.classList.add(className));
    if (atributes.length > 0) {
      atributes.forEach((atribute) => elem.setAttribute(atribute[0], atribute[1]));
    }
    return elem;
  }

  static renderScorePage() {
    // console.log(JSON.parse(localStorage.getItem('stagedScore')));
    // console.log(JSON.parse(localStorage.getItem('stagedScore')));
    const localstBest = localStorage.getItem('bestScore') ? JSON.parse(localStorage.getItem('bestScore')) : [];
    const localstStaged = localStorage.getItem('stagedScore') ? JSON.parse(localStorage.getItem('stagedScore')) : [];

    Score.scoreDiv = Score.createElem('div', [], 'score');
    const scoreContainer = Score.createElem('div', [], 'score_container');
    const scoreContainerBestTable = Score.createElem('table', [], 'score_container__best_score-table');
    const scoreContainerStagedTable = Score.createElem('table', [], 'score_container__staged_score-table');
    // tr main ############## BEST SCORE ##############################
    const trFirstBestScore = Score.createElem('tr', [], 'main');
    const thBestScore = Score.createElem('th', [['colspan', '4']], 'bestScore');
    thBestScore.innerText = 'Best Score';
    trFirstBestScore.append(thBestScore);
    // second
    const trSecondBestScore = Score.createElem('tr', [['rowspan', '2']], 'second_best-score');
    const trThirdBestScore = Score.createElem('tr', [], 'third_best-score');
    const numberBestScore = Score.createElem('th', [['rowspan', '2']], 'number_best-score');
    numberBestScore.innerText = '№';
    const gameBestScore = Score.createElem('th', [['rowspan', '2']], 'game_best-score');
    gameBestScore.innerText = 'Game';
    const resultBestScore = Score.createElem('th', [['colspan', '2']], 'score_best-score');
    resultBestScore.innerText = 'Score';
    const resultBestScoreSteps = Score.createElem('th', [], 'score_best-score_steps');
    resultBestScoreSteps.innerText = 'steps';
    const resultBestScoreTime = Score.createElem('th', [], 'score_best-score_time');
    resultBestScoreTime.innerText = 'time';
    trSecondBestScore.append(numberBestScore, gameBestScore, resultBestScore);
    trThirdBestScore.append(resultBestScoreSteps, resultBestScoreTime);
    scoreContainerBestTable.append(trFirstBestScore, trSecondBestScore, trThirdBestScore);
    if (localstBest.length > 0) {
      for (let i = 0; i < localstBest.length; i += 1) {
        const tr = Score.createElem('tr', [], `tr_${i + 1}`);
        const tdNum = Score.createElem('td', [], 'td_best-score__number');
        tdNum.innerText = i + 1;
        const tdGame = Score.createElem('td', [], 'td_best-score__game');
        const tdGameSize = Score.createElem('p', [], 'td_best-score__game-size');
        tdGameSize.innerText = `${localstBest[i].size} x ${localstBest[i].size}`;
        const src = `https://raw.githubusercontent.com/irinainina/image-data/master/box/${localstBest[i].imageNumber}.jpg`;
        const tdGameImg = Score.createElem('img', [['src', src]], 'td_best-score__game-image');
        tdGame.append(tdGameSize, tdGameImg);
        const tdGameSteps = Score.createElem('td', [], 'td_best-score__steps');
        tdGameSteps.innerText = localstBest[i].steps;
        const tdGameTime = Score.createElem('td', [], 'td_best-score__time');
        tdGameTime.innerText = `${localstBest[i].min}:${localstBest[i].sec}`;
        tr.append(tdNum, tdGame, tdGameSteps, tdGameTime);
        scoreContainerBestTable.append(tr);
      }
    }

    // tr main ################################ STAGED SCORE ################################
    const trFirstStagedScore = Score.createElem('tr', [], 'main');
    const thStagedScore = Score.createElem('th', [['colspan', '4']], 'stagedScore');
    thStagedScore.innerText = 'Staged Score';
    trFirstStagedScore.append(thStagedScore);
    const trSecondStagedScore = Score.createElem('tr', [], 'second_staged-score');
    const numberStagedScore = Score.createElem('th', [], 'number_staged-score');
    numberStagedScore.innerText = '№';
    const gameStageScore = Score.createElem('th', [], 'game_staged-score');
    gameStageScore.innerText = 'Game';
    const infoStagedScore = Score.createElem('th', [], 'info_staged-score');
    infoStagedScore.innerText = 'info';
    const loadStageScore = Score.createElem('th', [], 'load_staged-score');
    loadStageScore.innerText = 'Load game';
    trSecondStagedScore.append(numberStagedScore, gameStageScore, infoStagedScore, loadStageScore);
    scoreContainerStagedTable.append(trFirstStagedScore, trSecondStagedScore);
    if (localstStaged.length > 0) {
      for (let j = 0; j < localstStaged.length; j += 1) {
        const tr = Score.createElem('tr', [], `tr_${j + 1}`);
        const tdNum = Score.createElem('td', [], 'td_staged-score__number');
        tdNum.innerText = j + 1;
        const tdGame = Score.createElem('td', [], 'td_staged-score__game');
        const tdGameSize = Score.createElem('p', [], 'td_staged-score__game-size');
        tdGameSize.innerText = `${localstStaged[j].size} x ${localstStaged[j].size}`;
        const src = `https://raw.githubusercontent.com/irinainina/image-data/master/box/${localstStaged[j].imageNumber}.jpg`;
        const tdGameImg = Score.createElem('img', [['src', src]], 'td_staged-score__game-image');
        tdGame.append(tdGameSize, tdGameImg);
        const tdInfo = Score.createElem('td', [], 'td_staged-score__info');
        tdInfo.innerHTML = `<p class='staged-score_time'>${localstStaged[j].min}:${localstStaged[j].sec}</p>`;
        tdInfo.innerHTML += `<p class='staged-score_steps'>${localstStaged[j].steps}</p>`;
        const tdLoadGame = Score.createElem('button', [['value', 'load']], 'td_staged-score__load-game');
        tdLoadGame.innerText = 'load';
        tr.append(tdNum, tdGame, tdInfo, tdLoadGame);
        scoreContainerStagedTable.append(tr);
      }
    }

    // ############### BUTTON OK ###################
    Score.closeBtnScore = Score.createElem('button', [], 'score_container_close-Btn');
    Score.closeBtnScore.innerText = 'OK';
    Score.addListeners();
    // append in all container
    scoreContainer.append(scoreContainerBestTable, scoreContainerStagedTable, Score.closeBtnScore);
    Score.scoreDiv.append(scoreContainer);
    document.body.append(Score.scoreDiv);
    // return Score.scoreDiv;
  }

  static closeScore() {
    Score.scoreDiv.remove();
  }

  static saveBestScore(size, steps, min, sec, imageNumber) {
    const resultSum = (+min * 60 + +sec + +steps) / (+size * +size);
    let indexForPush = 0;
    let bestScore = JSON.parse(localStorage.getItem('bestScore'));
    if (bestScore === null) {
      bestScore = [];
    } else {
      for (let i = 0; i < bestScore.length; i += 1) {
        if (+bestScore[i].resultSum >= resultSum) {
          indexForPush = i;
          break;
        } else {
          indexForPush = i + 1;
        }
      }
    }
    if (indexForPush <= 10) {
      bestScore.splice(indexForPush, 0, {
        resultSum, min, sec, steps, size, imageNumber,
      });
      if (bestScore.length > 10) bestScore.pop();
      localStorage.setItem('bestScore', JSON.stringify(bestScore));
    }
  }

  static saveStagedScore(size, steps, min, sec, imageNumber, numbers, solution) {
    let stagedScore = JSON.parse(localStorage.getItem('stagedScore'));
    if (stagedScore === null) {
      stagedScore = [];
    }
    stagedScore.unshift({
      size, steps, min, sec, imageNumber, numbers, solution,
    });
    // console.log(stagedScore);
    if (stagedScore.length > 10) stagedScore.pop();
    localStorage.setItem('stagedScore', JSON.stringify(stagedScore));
    // localStorage.clear();
  }
}
