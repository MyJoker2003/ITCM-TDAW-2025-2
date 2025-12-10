import { useGameStore } from '../../store/gameStore';
import { Play, Settings, HelpCircle } from 'lucide-react';

const MainMenu = () => {
    const startGame = useGameStore((state) => state.startGame);
    const toggleSettings = useGameStore((state) => state.toggleSettings);
    const toggleTutorial = useGameStore((state) => state.toggleTutorial);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-12 animate-pulse">
                3D TETRIS
            </h1>

            <div className="flex flex-col gap-4 w-64">
                <button
                    onClick={startGame}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                >
                    <Play size={24} />
                    START GAME
                </button>

                <button
                    onClick={toggleSettings}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
                >
                    <Settings size={24} />
                    SETTINGS
                </button>

                <button
                    onClick={toggleTutorial}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
                >
                    <HelpCircle size={24} />
                    TUTORIAL
                </button>
            </div>
        </div>
    );
};

export default MainMenu;
