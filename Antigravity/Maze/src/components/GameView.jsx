
import React, { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';
import MazeRenderer from './MazeRenderer';
import { Clock, Move, Key, ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight, Undo2 } from 'lucide-react';

const GameView = ({ level, onLevelComplete, onExit, showTutorial }) => {
    const { gameState, startNewGame, movePlayer, interact } = useGame();
    const [internalTutorial, setInternalTutorial] = useState(showTutorial);

    useEffect(() => {
        startNewGame(level);
    }, [level, startNewGame]);

    useEffect(() => {
        if (gameState.isWon) {
            const timer = setTimeout(() => {
                onLevelComplete(level);
            }, 1000); // 1s delay to see win
            return () => clearTimeout(timer);
        }
    }, [gameState.isWon, level, onLevelComplete]);

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Clear tutorial on input
            if (internalTutorial) setInternalTutorial(false);

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    movePlayer(1, 0);
                    break;
                case 'Enter':
                    interact();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer, interact, internalTutorial]);

    if (!gameState.isPlaying && !gameState.isWon) {
        return <div className="text-white flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="relative w-full h-screen bg-sci-fi-bg flex flex-col items-center overflow-hidden">

            {/* Top Bar / HUD */}
            <div className="relative w-full h-24 px-8 flex justify-between items-center text-white z-10 shrink-0">

                {/* Left: Stats */}
                <div className="flex gap-6 bg-slate-900/80 p-3 rounded-xl border border-slate-700 backdrop-blur-sm pointer-events-auto">
                    <div className="flex items-center gap-2 text-sci-fi-accent">
                        <Clock size={18} />
                        <span className="font-mono text-xl">{formatTime(gameState.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                        <Move size={18} />
                        <span className="font-mono text-xl">{gameState.moves}</span>
                    </div>
                    {/* Key Count (Level 5+) */}
                    {level >= 5 && (
                        <div className="flex items-center gap-2 text-yellow-400">
                            <Key size={18} />
                            <span className="font-mono text-xl">{gameState.inventory}</span>
                        </div>
                    )}
                </div>

                {/* Center: Level Indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-sci-fi font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    LEVEL {level}
                </div>

                {/* Right: Exit Button */}
                <button
                    onClick={onExit}
                    className="pointer-events-auto p-2 bg-slate-800 text-white rounded hover:bg-red-600 transition-colors flex gap-2 items-center border border-slate-600"
                >
                    <Undo2 size={20} />
                    <span className="hidden md:inline">Exit</span>
                </button>
            </div>


            {/* Main Game Area */}
            <div className="flex-1 flex items-center justify-center w-full p-4 overflow-hidden">
                <MazeRenderer
                    grid={gameState.grid}
                    width={gameState.width}
                    height={gameState.height}
                    playerPos={gameState.playerPos}
                    facing={gameState.facing}
                    endPos={gameState.endPos}
                    keys={gameState.keys}
                    doors={gameState.doors}
                />
            </div>

            {/* Tutorial Overlay */}
            {internalTutorial && (
                <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center pointer-events-none animate-fade-in">
                    <div className="bg-slate-900 border border-sci-fi-accent p-8 rounded-2xl flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                        <h3 className="text-2xl font-sci-fi text-sci-fi-accent">HOW TO PLAY</h3>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-slate-400 text-sm">MOVE</span>
                                <div className="grid grid-cols-3 gap-1">
                                    <div />
                                    <Kbd>W</Kbd>
                                    <div />
                                    <Kbd>A</Kbd>
                                    <Kbd>S</Kbd>
                                    <Kbd>D</Kbd>
                                </div>
                            </div>

                            <div className="h-full w-px bg-slate-700 mx-2"></div>

                            <div className="flex flex-col items-center justify-between py-2">
                                <span className="text-slate-400 text-sm">INTERACT</span>
                                <div className="h-10 border border-slate-500 rounded px-4 flex items-center text-white font-bold bg-slate-800">
                                    ENTER
                                </div>
                            </div>
                        </div>

                        <p className="text-slate-300 text-sm text-center max-w-xs">
                            Navigate to the goal. Collect keys to open doors.
                        </p>
                        <div className="text-sci-fi-accent text-xs animate-pulse mt-2">
                            PRESS A KEY TO START
                        </div>
                    </div>
                </div>
            )}

            {/* Win Overlay (Optional, though handled by App transition usually) */}
            {gameState.isWon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="text-6xl font-sci-fi text-sci-fi-accent animate-bounce drop-shadow-[0_0_20px_rgba(0,240,255,1)]">
                        LEVEL COMPLETE
                    </div>
                </div>
            )}
        </div>
    );
};

const Kbd = ({ children }) => (
    <div className="w-8 h-8 flex items-center justify-center bg-slate-800 border-b-2 border-slate-600 rounded text-white font-bold text-sm">
        {children}
    </div>
);

const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
};

export default GameView;
