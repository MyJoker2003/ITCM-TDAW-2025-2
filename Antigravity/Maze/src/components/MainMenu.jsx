
import React from 'react';
import { Play, Settings, List } from 'lucide-react';

const MainMenu = ({ onStart, onContinue, onSettings, maxLevel }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-sci-fi-bg text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-sci-fi-bg opacity-50 pointer-events-none"></div>

            <h1 className="text-6xl font-sci-fi font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-sci-fi-accent to-sci-fi-purple drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] z-10">
                NEON LABYRINTH
            </h1>

            <div className="flex flex-col gap-6 z-10 w-64">
                <button
                    onClick={onStart}
                    className="group relative px-6 py-3 bg-transparent border border-sci-fi-accent text-sci-fi-accent font-bold uppercase tracking-widest hover:bg-sci-fi-accent hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <Play size={20} />
                    New Game
                </button>

                {maxLevel > 1 && (
                    <button
                        onClick={onContinue}
                        className="group relative px-6 py-3 bg-transparent border border-sci-fi-purple text-sci-fi-purple font-bold uppercase tracking-widest hover:bg-sci-fi-purple hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <List size={20} />
                        Continue
                    </button>
                )}

                <button
                    onClick={onSettings}
                    className="group relative px-6 py-3 bg-transparent border border-slate-500 text-slate-400 font-bold uppercase tracking-widest hover:border-white hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <Settings size={20} />
                    Settings
                </button>
            </div>

            <div className="absolute bottom-4 text-slate-600 text-sm">
                v1.0.0
            </div>
        </div>
    );
};

export default MainMenu;
