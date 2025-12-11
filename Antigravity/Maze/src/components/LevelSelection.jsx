
import React from 'react';
import { ArrowLeft, Lock, Check } from 'lucide-react';

const LevelSelection = ({ maxLevel, onSelectLevel, onBack }) => {
    // Generate a list of levels to display. Let's show at least 15 placeholders, or just the unlocked ones + 1?
    // "ver la lista de los niveles disponibles, es decir los que ha completado y el ultimo que no ha completado"
    // So strictly 1 to maxLevel.

    const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-sci-fi-bg text-white relative p-8">
            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-sci-fi-accent hover:text-white transition-colors flex items-center gap-2"
            >
                <ArrowLeft /> Back
            </button>

            <h2 className="text-4xl font-sci-fi mb-12 text-sci-fi-accent">SELECT LEVEL</h2>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-6 max-w-4xl w-full">
                {levels.map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => onSelectLevel(lvl)}
                        className={`
              aspect-square flex flex-col items-center justify-center rounded-lg border-2 
              transition-all duration-300 hover:scale-105
              ${lvl < maxLevel
                                ? 'border-sci-fi-accent bg-sci-fi-accent/10 text-sci-fi-accent' // Completed
                                : 'border-sci-fi-purple bg-sci-fi-purple/10 text-sci-fi-purple animate-pulse' // Current
                            }
            `}
                    >
                        <span className="text-2xl font-bold">{lvl}</span>
                        {lvl < maxLevel && <Check size={16} className="mt-2" />}
                        {lvl === maxLevel && <span className="text-[10px] uppercase mt-2">Current</span>}
                    </button>
                ))}

                {/* Optional: Show next locked level as a teaser */}
                <div className="aspect-square flex items-center justify-center rounded-lg border-2 border-slate-700 bg-slate-900/50 text-slate-700 cursor-not-allowed">
                    <Lock size={24} />
                </div>
            </div>
        </div>
    );
};

export default LevelSelection;
