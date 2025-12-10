import { useGameStore } from '../../store/gameStore';
import { RefreshCw } from 'lucide-react';

const GameOver = () => {
    const startGame = useGameStore((state) => state.startGame);
    const score = useGameStore((state) => state.score);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-50 backdrop-blur-sm animate-in fade-in duration-500">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">GAME OVER</h1>
            <p className="text-2xl text-white mb-8">Final Score: {score}</p>

            <button
                onClick={startGame}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-900 hover:bg-gray-200 rounded-full font-bold text-xl transition-all transform hover:scale-110 shadow-xl"
            >
                <RefreshCw size={24} />
                TRY AGAIN
            </button>
        </div>
    );
};

export default GameOver;
