export default class Score {
  static addListeners() {
    Score.scoreDiv.addEventListener('click', (event) => Score.closeScore(event));
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
    const localstBest = localStorage.getItem('bestScore') ? JSON.parse(localStorage.getItem('bestScore')) : [];
    const localstStaged = localStorage.getItem('stagedScore') ? JSON.parse(localStorage.getItem('stagedScore')) : [];
    Score.scoreDiv = Score.createElem('div', [], 'score');
    const scoreContainer = Score.createElem('div', [], 'score_container');
    const scoreContainerBestTable = Score.createElem('table', [], 'score_container__best_score-table');
    const scoreContainerStagedTable = Score.createElem('table', [], 'score_container__staged_score-table');
    const trFirstBestScore = Score.createElem('tr', [], 'main');
    const thBestScore = Score.createElem('th', [['colspan', '4']], 'bestScore');
    thBestScore.innerText = 'Best Score';
    trFirstBestScore.append(thBestScore);
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
    const trFirstStagedScore = Score.createElem('tr', [], 'main');
    const thStagedScore = Score.createElem('th', [['colspan', '4']], 'stagedScore');
    thStagedScore.innerText = 'Saved games';
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
        const tdInfoMin = localstStaged[j].min === '00' ? '' : `${+localstStaged[j].min} min `;
        tdInfo.innerHTML = `<p class='staged-score_time'> Time: ${tdInfoMin}${+localstStaged[j].sec} sec</p>`;
        tdInfo.innerHTML += `<p class='staged-score_steps'>Steps: ${localstStaged[j].steps}</p>`;
        const tdButton = Score.createElem('td', [], 'td_staged-score__load-game');
        const button = Score.createElem('button', [['value', 'load']], 'button-load');
        button.innerText = 'load';
        tdButton.append(button);
        tr.append(tdNum, tdGame, tdInfo, tdButton);
        scoreContainerStagedTable.append(tr);
      }
    }
    const closeBtnScore = Score.createElem('div', [], 'score_container_close-Btn');
    Score.addListeners();
    scoreContainer.append(scoreContainerBestTable, scoreContainerStagedTable);
    Score.scoreDiv.append(scoreContainer, closeBtnScore);
    document.body.append(Score.scoreDiv);
  }

  static closeScore(event) {
    if (event.target.closest('.score_container') === null) {
      Score.scoreDiv.remove();
    }
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
    if (stagedScore.length > 10) stagedScore.pop();
    localStorage.setItem('stagedScore', JSON.stringify(stagedScore));
  }
}
