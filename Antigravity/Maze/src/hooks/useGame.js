
import { useState, useCallback, useEffect } from 'react';
import { generateMaze } from '../game/mazeGenerator';

export const useGame = () => {
    const [gameState, setGameState] = useState({
        level: 1,
        isPlaying: false,
        isWon: false,
        width: 0,
        height: 0,
        grid: [], // 2D array
        playerPos: { x: 0, y: 0 },
        facing: { x: 0, y: 1 }, // Default facing down
        endPos: { x: 0, y: 0 },
        keys: [], // Array of key objects {x, y, id}
        doors: [], // Array of door objects {x, y, id}
        inventory: 0,
        time: 0,
        moves: 0,
    });

    // Timer
    useEffect(() => {
        let interval;
        if (gameState.isPlaying && !gameState.isWon) {
            interval = setInterval(() => {
                setGameState(prev => ({ ...prev, time: prev.time + 1 }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState.isPlaying, gameState.isWon]);

    const startNewGame = useCallback((level = 1) => {
        const maze = generateMaze(level);

        setGameState({
            level,
            isPlaying: true,
            isWon: false,
            width: maze.width,
            height: maze.height,
            grid: maze.grid,
            playerPos: maze.start,
            facing: { x: 0, y: 1 },
            endPos: maze.end,
            keys: maze.keys,
            doors: maze.doors,
            inventory: 0,
            time: 0,
            moves: 0
        });
    }, []);

    const movePlayer = useCallback((dx, dy) => {
        setGameState(prev => {
            if (!prev.isPlaying || prev.isWon) return prev;

            const newPos = { x: prev.playerPos.x + dx, y: prev.playerPos.y + dy };
            const newFacing = { x: dx, y: dy };

            // Check Bounds
            if (newPos.x < 0 || newPos.y < 0 || newPos.x >= prev.width || newPos.y >= prev.height) {
                return { ...prev, facing: newFacing };
            }

            // Check Walls
            if (prev.grid[newPos.y][newPos.x] === 1) {
                return { ...prev, facing: newFacing };
            }

            // Check Doors
            // Doors are stored in `prev.doors`. They are logically walls until opened.
            // But visually/logically they might be overlaying the grid.
            // My mazeGenerator does NOT mark doors as walls in `grid` (it sets them to 0 temporarily for pathing if I used the tempGrid logic, wait).
            // Let's check `mazeGenerator.js`.
            // `tempGrid[d.y][d.x] = 0` was local to the generator.
            // The returned `grid` has walls (1) or floors (0).
            // The doors were placed on the Path, which are 0s.
            // So in `prev.grid`, a door tile is 0.
            // *However*, we must treat it as solid if it's in `prev.doors`.

            const isDoor = prev.doors.some(d => d.x === newPos.x && d.y === newPos.y);
            if (isDoor) {
                return { ...prev, facing: newFacing }; // Locked door behaves like wall
            }

            // Move is valid
            // Check for Key Collection
            let newInventory = prev.inventory;
            let newKeys = prev.keys;

            const keyIndex = prev.keys.findIndex(k => k.x === newPos.x && k.y === newPos.y);
            if (keyIndex !== -1) {
                // Collect key
                newInventory++;
                newKeys = [...prev.keys];
                newKeys.splice(keyIndex, 1);
                // Play sound effect hook here later?
            }

            // Check Win
            let isWon = false;
            if (newPos.x === prev.endPos.x && newPos.y === prev.endPos.y) {
                isWon = true;
            }

            return {
                ...prev,
                playerPos: newPos,
                facing: newFacing,
                inventory: newInventory,
                keys: newKeys,
                moves: prev.moves + 1,
                isWon,
                isPlaying: !isWon // Stop playing if won
            };
        });
    }, []);

    const interact = useCallback(() => {
        setGameState(prev => {
            if (!prev.isPlaying || prev.isWon) return prev;
            if (prev.inventory <= 0) return prev; // Do nothing if no keys

            // Check all 4 adjacent cells (Up, Down, Left, Right)
            const neighbors = [
                { x: prev.playerPos.x, y: prev.playerPos.y - 1 }, // Up
                { x: prev.playerPos.x, y: prev.playerPos.y + 1 }, // Down
                { x: prev.playerPos.x - 1, y: prev.playerPos.y }, // Left
                { x: prev.playerPos.x + 1, y: prev.playerPos.y }  // Right
            ];

            // Find a door in any of the neighboring cells
            const doorIndex = prev.doors.findIndex(d =>
                neighbors.some(n => n.x === d.x && n.y === d.y)
            );

            if (doorIndex !== -1) {
                // Found a door nearby
                const newDoors = [...prev.doors];
                newDoors.splice(doorIndex, 1);

                return {
                    ...prev,
                    doors: newDoors,
                    inventory: prev.inventory - 1,
                };
            }
            return prev;
        });
    }, []);

    return { gameState, startNewGame, movePlayer, interact };
};
