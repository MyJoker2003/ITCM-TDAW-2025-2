import { useGameStore } from '../../store/gameStore';
import { X } from 'lucide-react';

const TutorialOverlay = () => {
    const toggleTutorial = useGameStore((state) => state.toggleTutorial);

    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/backimages/starry.webp')" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative z-10 bg-gray-900 border border-cyan-500/50 p-8 rounded-xl max-w-2xl w-full relative shadow-2xl shadow-cyan-900/20">
                <button
                    onClick={toggleTutorial}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
                    How to Play
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-2">Controls</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-3">
                                <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">←</kbd>
                                <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">→</kbd>
                                <span>Move Left / Right</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">↓</kbd>
                                <span>Soft Drop</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">↑</kbd>
                                <span className="border border-white/30 px-2 rounded text-sm bg-white/10">Space</span>
                                <span>Rotate</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="border border-cyan-400/50 px-2 rounded text-sm bg-cyan-900/30 font-bold text-cyan-400">Q</span>
                                <span>Hard Drop</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-2">Rules</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Complete horizontal lines to clear them and score points.
                            The game ends if the blocks reach the top of the grid.
                            Clear multiple lines at once for bonus points!
                        </p>
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mt-4">
                            <p className="text-sm text-cyan-300">
                                Tip: Watch the shadow to see where the piece will land!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={toggleTutorial}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;
