
import React, { useState, useEffect, useRef } from 'react';
import MainMenu from './components/MainMenu';
import GameView from './components/GameView';
import LevelSelection from './components/LevelSelection';
import SettingsModal from './components/SettingsModal';

function App() {
  const [view, setView] = useState('MENU'); // MENU, LEVEL_SELECT, GAME
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(() => {
    const saved = localStorage.getItem('maxLevel');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [volume, setVolume] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Audio Logic
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio object once
    audioRef.current = new Audio('/audio/bgm.m4a');
    audioRef.current.loop = true;

    // Helper to start playback safely
    const playAudio = () => {
      audioRef.current.play().catch(err => {
        // Autoplay blocked: wait for interaction
        console.log("Autoplay blocked, waiting for interaction");
        const resumeAudio = () => {
          audioRef.current.play();
          window.removeEventListener('click', resumeAudio);
          window.removeEventListener('keydown', resumeAudio);
        };
        window.addEventListener('click', resumeAudio);
        window.addEventListener('keydown', resumeAudio);
      });
    };

    playAudio();

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Update volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Persist Max Level
  useEffect(() => {
    localStorage.setItem('maxLevel', maxLevel);
  }, [maxLevel]);

  const handleStartGame = () => {
    setCurrentLevel(1);
    setShowTutorial(true);
    setView('GAME');
  };

  const handleContinue = () => {
    setView('LEVEL_SELECT');
  };

  const handleSelectLevel = (level) => {
    if (level <= maxLevel) {
      setCurrentLevel(level);
      // Only show tutorial on New Game? User said "when starts New Game".
      // But maybe level 0 implies tutorial level.
      // "Crear un tutorial guiado (nivel cero...) esto siempre que se empieza un nuevo juego."
      // "New Game" -> Level 1 (or 0?).
      // Let's assume Level 1 is the first level.
      // If we select a level manually, strictly speaking it's not "New Game" button.
      setShowTutorial(false);
      setView('GAME');
    }
  };

  const handleLevelComplete = (level) => {
    if (level === maxLevel) {
      setMaxLevel(prev => prev + 1);
    }
    // Auto advance to next level?
    const nextLevel = level + 1;
    setCurrentLevel(nextLevel);
    // Stay in GAME view, which will re-render with new level via key or effect
  };

  const handleExitGame = () => {
    setView('MENU');
  };

  return (
    <div className="antialiased">
      {view === 'MENU' && (
        <MainMenu
          onStart={handleStartGame}
          onContinue={handleContinue}
          onSettings={() => setShowSettings(true)}
          maxLevel={maxLevel}
        />
      )}

      {view === 'LEVEL_SELECT' && (
        <LevelSelection
          maxLevel={maxLevel}
          onSelectLevel={handleSelectLevel}
          onBack={() => setView('MENU')}
        />
      )}

      {view === 'GAME' && (
        <GameView
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          onExit={handleExitGame}
          showTutorial={showTutorial}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        volume={volume}
        onVolumeChange={setVolume}
        onResetData={() => {
          localStorage.removeItem('maxLevel');
          setMaxLevel(1);
          setCurrentLevel(1);
          setView('MENU'); // Force back to menu just in case
        }}
      />
    </div>
  );
}

export default App;
