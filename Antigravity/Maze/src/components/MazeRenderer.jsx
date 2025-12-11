
import React from 'react';
import { User, Key, DoorOpen, Flag } from 'lucide-react';

const MazeRenderer = ({ grid, width, height, playerPos, facing, endPos, keys, doors }) => {
    // Determine cell size based on viewport? 
    // For now, let's use a responsive container and calculate percentage or use a fixed size logic with transform.
    // Actually, CSS Grid `repeat(width, minmax(0, 1fr))` ensures it fits the container.

    return (
        <div
            className="grid gap-0 bg-sci-fi-grid shadow-2xl shadow-sci-fi-accent/20 border border-slate-700"
            style={{
                gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
                aspectRatio: `${width}/${height}`,
                width: 'min(90vw, 70vh)', // Keep it square-ish and fitting
            }}
        >
            {grid.map((row, y) => (
                row.map((cell, x) => {
                    const isWall = cell === 1;
                    const isPlayer = playerPos.x === x && playerPos.y === y;
                    const isEnd = endPos.x === x && endPos.y === y;

                    // Check for Objects
                    const keyItem = keys.find(k => k.x === x && k.y === y);
                    const doorItem = doors.find(d => d.x === x && d.y === y);

                    return (
                        <div
                            key={`${x}-${y}`}
                            className={`
                relative flex items-center justify-center
                ${isWall ? 'bg-slate-800' : 'bg-transparent'}
              `}
                        >
                            {/* Wall Visuals */}
                            {isWall && (
                                <div className="absolute inset-0.5 bg-slate-700 rounded-sm border-t border-slate-600"></div>
                            )}

                            {/* Floor Visuals (Grid lines are handled by gap/bg if needed, or simple border) */}
                            {!isWall && (
                                <div className="absolute inset-0 border border-slate-800/30"></div>
                            )}

                            {/* End Goal */}
                            {isEnd && (
                                <div className="animate-bounce text-sci-fi-accent">
                                    <Flag size="60%" fill="currentColor" />
                                </div>
                            )}

                            {/* Keys */}
                            {keyItem && (
                                <div className="absolute text-yellow-400 animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">
                                    <Key size="60%" />
                                </div>
                            )}

                            {/* Doors */}
                            {doorItem && (
                                <div className="absolute inset-0 bg-red-900/80 border border-red-500 flex items-center justify-center">
                                    <DoorOpen size="60%" className="text-red-400" />
                                </div>
                            )}

                            {/* Player */}
                            {isPlayer && (
                                <div
                                    className="absolute text-sci-fi-purple drop-shadow-[0_0_8px_rgba(191,0,255,0.8)] transition-all duration-150"
                                    style={{
                                        transform: `rotate(${Math.atan2(facing.y, facing.x)}rad)` // Simplistic rotation, might need adjustment for UP (-1 y)
                                        // Math.atan2(y, x). Up: (0, -1) -> -PI/2. Right: (1, 0) -> 0. Down: (0, 1) -> PI/2. Left: (-1, 0) -> PI.
                                        // This creates proper rotation logic.
                                        // However, standard CSS rotate starts at x-axis (Right).
                                        // So if Lucide User icon faces "up" by default or "front"?
                                        // User icon is usually just a head/body.
                                        // Let's use a simpler Chevron or Arrow for direction, or just no rotation for Humanoid.
                                        // Re-reading user request: "Control del personaje".
                                        // I'll stick to User icon and maybe no rotation or just flip.
                                    }}
                                >
                                    <User size="75%" />
                                </div>
                            )}
                        </div>
                    );
                })
            ))}
        </div>
    );
};

export default MazeRenderer;
