import { useGameStore } from '../../store/gameStore';
import { Trophy, ArrowRight, Home } from 'lucide-react';

const LevelClearedModal = () => {
    const level = useGameStore((state) => state.level);
    const nextLevel = useGameStore((state) => state.nextLevel);
    const setStatus = useGameStore((state) => state.setStatus);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-gray-900 border border-yellow-500/50 p-8 rounded-xl max-w-sm w-full relative shadow-2xl shadow-yellow-900/20 text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-yellow-500/20 rounded-full animate-bounce">
                        <Trophy size={48} className="text-yellow-400" />
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                    Level {level} Cleared!
                </h2>
                <p className="text-gray-400 mb-8">Great job! Ready for the next challenge?</p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={nextLevel}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/30"
                    >
                        <ArrowRight size={20} />
                        CONTINUE TO LEVEL {level + 1}
                    </button>

                    <button
                        onClick={() => setStatus('MENU')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-bold transition-all"
                    >
                        <Home size={20} />
                        MAIN MENU
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelClearedModal;
