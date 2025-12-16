import { useGameStore } from '../../store/gameStore';
import { Play, Home } from 'lucide-react';

const PauseModal = () => {
    const togglePause = useGameStore((state) => state.togglePause);
    const setStatus = useGameStore((state) => state.setStatus);

    const handleQuit = () => {
        togglePause(); // Unpause logic state first? Or setStatus MENU overrides it.
        // Better safe:
        setStatus('MENU');
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-sm w-full shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-widest uppercase">
                    Paused
                </h2>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={togglePause}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-cyan-500/30"
                    >
                        <Play size={20} />
                        RESUME
                    </button>

                    <button
                        onClick={handleQuit}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-red-600/80 text-white rounded-lg font-bold transition-all"
                    >
                        <Home size={20} />
                        QUIT TO MENU
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PauseModal;
