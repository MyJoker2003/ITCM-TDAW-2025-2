import { useGameStore } from '../../store/gameStore';
import { X, Volume2, Monitor } from 'lucide-react';

const SettingsModal = () => {
    const toggleSettings = useGameStore((state) => state.toggleSettings);

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 backdrop-blur-md p-4">
            <div className="bg-gray-900 border border-purple-500/50 p-8 rounded-xl max-w-md w-full relative shadow-2xl shadow-purple-900/20">
                <button
                    onClick={toggleSettings}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-bold text-purple-400 mb-8 flex items-center gap-3">
                    Settings
                </h2>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-white font-medium">
                            <Volume2 size={20} />
                            Master Volume
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-white font-medium">
                            <Monitor size={20} />
                            Graphics Quality
                        </label>
                        <select className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-2 focus:border-purple-500 focus:outline-none">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={toggleSettings}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
