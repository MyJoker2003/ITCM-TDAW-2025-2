import { useEffect } from 'react';
import Scene from './components/Game/Scene';
import MainMenu from './components/UI/MainMenu';
import HUD from './components/UI/HUD';
import GameOver from './components/UI/GameOver';
import SettingsModal from './components/UI/SettingsModal';
import TutorialOverlay from './components/UI/TutorialOverlay';
import LevelClearedModal from './components/UI/LevelClearedModal';
import PauseModal from './components/UI/PauseModal';
import LevelSelect from './components/UI/LevelSelect';
import { useGameStore } from './store/gameStore';

function App() {
  const status = useGameStore((state) => state.status);
  const isSettingsOpen = useGameStore((state) => state.isSettingsOpen);
  const isTutorialOpen = useGameStore((state) => state.isTutorialOpen);
  const isPaused = useGameStore((state) => state.isPaused);

  const movePiece = useGameStore((state) => state.movePiece);
  const rotatePiece = useGameStore((state) => state.rotatePiece);
  const togglePause = useGameStore((state) => state.togglePause);
  const loadProgress = useGameStore((state) => state.loadProgress);
  const hardDrop = useGameStore((state) => state.hardDrop);

  // Load persistence on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow pausing only during gameplay
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (status === 'PLAYING' || status === 'PAUSED') {
          togglePause();
          return;
        }
      }

      if (status !== 'PLAYING' || isSettingsOpen || isTutorialOpen || isPaused) return;

      // Prevent default behavior for game controls to avoid scrolling or button clicks
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1); // Soft drop
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          rotatePiece();
          // Blur any focused element to prevent random button clicks
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          break;
        case 'q':
        case 'Q':
          hardDrop();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isSettingsOpen, isTutorialOpen, isPaused, movePiece, rotatePiece, togglePause, hardDrop]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none">
      <Scene />

      {status === 'MENU' && <MainMenu />}
      {(status === 'PLAYING' || status === 'PAUSED' || status === 'LEVEL_CLEAR_ANIMATION') && <HUD />}
      {status === 'GAME_OVER' && <GameOver />}
      {status === 'LEVEL_CLEARED' && <LevelClearedModal />}
      {status === 'LEVEL_SELECT' && <LevelSelect />}

      {isSettingsOpen && <SettingsModal />}
      {isTutorialOpen && <TutorialOverlay />}
      {isPaused && <PauseModal />}
    </div>
  );
}

export default App;
