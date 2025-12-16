import { useGameStore } from '../../store/gameStore';
import { Lock, Play, ArrowLeft } from 'lucide-react';

const LevelSelect = () => {
    const maxUnlockedLevel = useGameStore((state) => state.maxUnlockedLevel);
    const startGame = useGameStore((state) => state.startGame);
    const setStatus = useGameStore((state) => state.setStatus);

    // Generate array of levels based on maxUnlocked
    // Let's assume a cap or just show unlocked ones + 1 locked
    const levelsToShow = Math.max(5, maxUnlockedLevel + 1);
    const levels = Array.from({ length: levelsToShow }, (_, i) => i + 1);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Background Image reusable if component structure allowed, or duplicate */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/backimages/starry.webp')" }}
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-4xl p-8 flex flex-col items-center h-full sm:h-auto overflow-y-auto">
                <div className="w-full flex justify-between items-center mb-8">
                    <button
                        onClick={() => setStatus('MENU')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                        Back
                    </button>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                        Select Level
                    </h1>
                    <div className="w-20" /> {/* Spacer */}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {levels.map((lvl) => {
                        const isUnlocked = lvl <= maxUnlockedLevel;
                        return (
                            <button
                                key={lvl}
                                disabled={!isUnlocked}
                                onClick={() => isUnlocked && startGame(lvl)}
                                className={`
                                    relative p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all transform hover:scale-105
                                    ${isUnlocked
                                        ? 'bg-gray-800/80 border-cyan-500/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group'
                                        : 'bg-gray-900/50 border-gray-800 opacity-60 cursor-not-allowed'
                                    }
                                `}
                            >
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2
                                    ${isUnlocked ? 'bg-cyan-900/50 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors' : 'bg-gray-800 text-gray-600'}
                                `}>
                                    {isUnlocked ? lvl : <Lock size={24} />}
                                </div>
                                <span className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                                    Level {lvl}
                                </span>
                                {isUnlocked && (
                                    <span className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
                                        <Play size={16} />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LevelSelect;
