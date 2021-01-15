import { HallOfFame } from '../HallOfFame';
import { GameModeSelect } from '../GameModeSelect';
import { GameOver } from '../GameOver';
import ApiDataFetcher from '../../services/ApiDataFetcher/ApiDataFetcher';
import { GameEngine } from '../../services/GameEngine/GameEngine';
import { GameView } from '../GameView';

export const App = ({ options }) => {
  const rankingBtn = document.querySelector('.button--ranking');
  const modeRules = document.querySelector('.mode__rules');
  const rankingBtnTxt = rankingBtn.querySelector('.button__text');
  const rankingBtnIcon = rankingBtn.querySelector('.fas');
  const btnSettings = document.querySelector('.button--settings');
  const formSettings = document.querySelector('form');
  const btnBack = document.querySelector('.button--back');
  const playTheGame = document.querySelector('.button--play');
  const inGameMode = document.querySelector('.mode__game-in-progress');
  const progresBarContainer = document.querySelector('.progress');

  const config = {
    selectedGame: `people`,
  };

  const hallOfFame = new HallOfFame(
    document.querySelector('#halloffame'),
    config,
  );
  const gameOver = new GameOver({
    element: document.querySelector('#gameovermodal'),
    config: config,
    handleScoreSubmit: (result) => hallOfFame.saveResult(result),
  });
  //gameOver.display(); //tymczasowe, jedyna metoda wywołania modala

  const gameMode = new GameModeSelect(config);

  btnSettings.addEventListener('click', () => {
    btnSettings.hidden = true;

    document.querySelector('.mode__rules').hidden = true;
    document.querySelector('.mode__type').hidden = true;
    document.querySelector('.button--ranking').hidden = true;
    document.querySelector('.button--play').hidden = true;
    document.querySelector('.question__image').hidden = true;
    hallOfFame.hide();
    formSettings.hidden = false;
    btnBack.hidden = false;
  });

  btnBack.addEventListener('click', () => {
    window.location.reload();
  });

  function onLoadHide() {
    formSettings.hidden = true;
    btnBack.hidden = true;
  }

  onLoadHide();

  rankingBtn.addEventListener('click', switchBtn);
  function switchBtn() {
    if (rankingBtnTxt.innerHTML === 'Hall of fame') {
      rankingBtnTxt.innerHTML = 'Rules';
      rankingBtnIcon.classList = 'fas fa-graduation-cap';
      hallOfFame.display();
    } else {
      rankingBtnTxt.innerHTML = 'Hall of fame';
      rankingBtnIcon.classList = 'fas fa-id-badge';
      hallOfFame.hide();
    }
    modeRules.hidden = !modeRules.hidden;
  }

  //get data from API based on active game mode
  const apiDataFetcher = new ApiDataFetcher(options.swApiBaseUrl);
  playTheGame.addEventListener('click', () => play(config.selectedGame));

  async function play(gameMode) {
    const quiz = new GameEngine(gameMode, apiDataFetcher);

    await quiz.fetchAllQuestionsForMode(gameMode);

    const gameView = new GameView();
    const nextQuestion = quiz.generateNextQuestion();
    gameView.displayQuestion(nextQuestion);
  }

  playTheGame.addEventListener('click', setGameInProgressView);

  function setGameInProgressView() {
    modeRules.hidden = true;
    rankingBtn.hidden = true;
    playTheGame.hidden = true;
    btnSettings.hidden = true;
    inGameMode.hidden = false;
    progresBarContainer.style.display = 'flex';
    hallOfFame.hide();
  }
};
