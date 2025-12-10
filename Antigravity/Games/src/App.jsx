import { useEffect } from 'react';
import Scene from './components/Game/Scene';
import MainMenu from './components/UI/MainMenu';
import HUD from './components/UI/HUD';
import GameOver from './components/UI/GameOver';
import SettingsModal from './components/UI/SettingsModal';
import TutorialOverlay from './components/UI/TutorialOverlay';
import { useGameStore } from './store/gameStore';

function App() {
  const status = useGameStore((state) => state.status);
  const isSettingsOpen = useGameStore((state) => state.isSettingsOpen);
  const isTutorialOpen = useGameStore((state) => state.isTutorialOpen);
  const movePiece = useGameStore((state) => state.movePiece);
  const rotatePiece = useGameStore((state) => state.rotatePiece);
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'PLAYING' || isSettingsOpen || isTutorialOpen) return;

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
        case ' ': // Hard drop (optional, or just fast drop)
          // For now, space can also rotate or be hard drop if implemented
          // Let's make space hard drop later, for now maybe just rotate
          rotatePiece();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, movePiece, rotatePiece]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none">
      <Scene />

      {status === 'MENU' && <MainMenu />}
      {status === 'PLAYING' && <HUD />}
      {status === 'GAME_OVER' && <GameOver />}

      {isSettingsOpen && <SettingsModal />}
      {isTutorialOpen && <TutorialOverlay />}
    </div>
  );
}

export default App;
