
import React from 'react';
import { X, Volume2 } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, volume, onVolumeChange, onResetData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-600 rounded-lg p-6 w-80 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-sci-fi text-white mb-6 text-center">SETTINGS</h2>

                <div className="flex flex-col gap-4">
                    <label className="text-slate-300 text-sm flex items-center gap-2">
                        <Volume2 size={16} />
                        Background Volume
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                            className="w-full accent-sci-fi-accent bg-slate-700 h-2 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-white font-mono w-8 text-right">{Math.round(volume * 100)}%</span>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-sci-fi-accent text-black font-bold rounded hover:bg-cyan-300 transition-colors w-full"
                    >
                        DONE
                    </button>

                    <button
                        onClick={() => {
                            onResetData();
                            onClose();
                        }}
                        className="px-6 py-2 bg-red-900/50 border border-red-500 text-red-400 font-bold rounded hover:bg-red-900 transition-colors w-full text-sm"
                    >
                        RESET PROGRESS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
