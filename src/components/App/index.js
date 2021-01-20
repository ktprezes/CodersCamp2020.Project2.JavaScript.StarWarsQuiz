import { HallOfFame } from '../HallOfFame';
import { GameModeSelect } from '../GameModeSelect';
import { GameOver } from '../GameOver';
import ApiDataFetcher from '../../services/ApiDataFetcher/ApiDataFetcher';
import { GameEngine } from '../../services/GameEngine/GameEngine';
import { Timer } from '../Timer';
import { GameView } from '../GameView';
import { ControlButtons } from '../ControlButtons';
import { GameDescription } from '../GameDescription';
export const App = ({ options }) => {
  const inGameMode = document.querySelector('.mode__game-in-progress');

  const config = {
    selectedGame: `people`,
    quizMaxTime: options.quizMaxTime,
  };

  const hallOfFame = new HallOfFame(config);

  const apiDataFetcher = new ApiDataFetcher(options.swApiBaseUrl);

  const gameOver = new GameOver({
    config: config,
    handleScoreSubmit: (result) =>
      hallOfFame.saveResult(result) || hallOfFame.update(),
  });

  const gameDescription = new GameDescription({
    config: config,
    apiDataFetcher: apiDataFetcher,
  });

  const gameMode = new GameModeSelect(handleGameModeChange);

  function handleGameModeChange(selected) {
    config.selectedGame = selected;
    gameDescription.update();
    hallOfFame.update();
  }

  const timer = new Timer({
    config: config,
    announceGameOver: handleGameOver,
  });

  const controlButtons = new ControlButtons({
    handleSwitchToRules: () =>
      hallOfFame.hide() ||
      gameDescription.setGameDescription(config.selectedGame),
    handleSwitchToHall: () => hallOfFame.display() || gameDescription.hide(),
    handlePlayTheGame: () => play(config.selectedGame),
  });

  controlButtons.display();
  //do wykorzystania także, gdy skończą się pytania
  function handleGameOver() {
    gameOver.display();
    timer.hide();
    inGameMode.hidden = true;
    controlButtons.display();
    gameMode.enableButtons();
    hallOfFame.display();
    gameDescription.hide();
  }

  /*to się przydaje do testów w sytuacji, gdy skończyły się pytania
  document
    .querySelector('.answers__option')
    .addEventListener('click', () => handleGameOver());*/

  async function play(gameMode) {
    const quiz = new GameEngine(gameMode, apiDataFetcher);
    await quiz.fetchAllQuestionsForMode(gameMode);
    const gameView = new GameView();
    const nextQuestion = quiz.generateNextQuestion();
    gameView.displayQuestion(nextQuestion);
    setGameInProgressView();
  }

  function setGameInProgressView() {
    gameDescription.hide();
    controlButtons.hide();
    inGameMode.hidden = false;
    timer.display();
    hallOfFame.hide();
    gameMode.disableButtons();
  }
};
