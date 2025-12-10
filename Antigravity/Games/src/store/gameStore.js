import { create } from 'zustand';
import { TETROMINOES, randomTetromino } from '../utils/tetrominoes';

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

const createEmptyGrid = () =>
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export const useGameStore = create((set, get) => ({
    grid: createEmptyGrid(),
    activePiece: null, // { type, shape, color, position: {x, y}, rotation }
    nextPiece: randomTetromino(),
    score: 0,
    lines: 0,
    level: 1,
    levelProgress: 0, // Lines cleared in current level
    maxUnlockedLevel: 1,
    status: 'MENU',
    isSettingsOpen: false,
    isTutorialOpen: false,
    isPaused: false,
    clearingLines: [], // Indices of lines being cleared

    setStatus: (status) => set({ status }),
    toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
    toggleTutorial: () => set((state) => ({ isTutorialOpen: !state.isTutorialOpen })),

    togglePause: () => set((state) => {
        if (state.status === 'PLAYING') {
            return { status: 'PAUSED', isPaused: true };
        } else if (state.status === 'PAUSED') {
            return { status: 'PLAYING', isPaused: false };
        }
        return {};
    }),

    loadProgress: () => {
        const saved = localStorage.getItem('tetris_progress');
        if (saved) {
            try {
                const { maxUnlockedLevel } = JSON.parse(saved);
                set({ maxUnlockedLevel: maxUnlockedLevel || 1 });
            } catch (e) {
                console.error("Failed to load progress", e);
            }
        }
    },

    saveProgress: () => {
        const { maxUnlockedLevel } = get();
        localStorage.setItem('tetris_progress', JSON.stringify({ maxUnlockedLevel }));
    },

    startGame: (level = 1) => {
        set({
            grid: createEmptyGrid(),
            activePiece: null,
            nextPiece: randomTetromino(),
            score: 0,
            lines: 0,
            level: level,
            levelProgress: 0,
            status: 'PLAYING',
            isSettingsOpen: false,
            isTutorialOpen: false,
            isPaused: false,
            clearingLines: [],
        });
        get().spawnPiece();
    },

    nextLevel: () => {
        const { level, maxUnlockedLevel } = get();
        const nextLvl = level + 1;

        // Update max unlocked level if needed
        let newMax = maxUnlockedLevel;
        if (nextLvl > maxUnlockedLevel) {
            newMax = nextLvl;
            set({ maxUnlockedLevel: newMax });
            get().saveProgress();
        }

        set({
            grid: createEmptyGrid(), // Reset board for new level
            activePiece: null,
            nextPiece: randomTetromino(),
            level: nextLvl,
            levelProgress: 0,
            status: 'PLAYING',
            clearingLines: [],
        });
        get().spawnPiece();
    },

    spawnPiece: () => {
        const piece = get().nextPiece;
        const newNext = randomTetromino();

        // Initial position: centered at top
        const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2);
        const startY = 0; // Top of the board (0 index)

        set({
            activePiece: {
                ...piece,
                position: { x: startX, y: startY },
                rotation: 0,
            },
            nextPiece: newNext,
        });

        // Check collision immediately for Game Over
        if (get().checkCollision(get().activePiece)) {
            set({ status: 'GAME_OVER' });
        }
    },

    movePiece: (dirX, dirY) => {
        const { activePiece, status, checkCollision } = get();
        if (status !== 'PLAYING' || !activePiece) return;

        const newPos = {
            x: activePiece.position.x + dirX,
            y: activePiece.position.y + dirY,
        };

        const movedPiece = { ...activePiece, position: newPos };

        if (!checkCollision(movedPiece)) {
            set({ activePiece: movedPiece });
            return true; // Moved successfully
        }
        return false; // Blocked
    },

    rotatePiece: () => {
        const { activePiece, status, checkCollision } = get();
        if (status !== 'PLAYING' || !activePiece) return;

        // Rotate matrix 90 degrees
        const rotatedShape = activePiece.shape[0].map((_, index) =>
            activePiece.shape.map((row) => row[index]).reverse()
        );

        const rotatedPiece = { ...activePiece, shape: rotatedShape };

        // Wall kicks (basic: try to move left/right if blocked)
        if (!checkCollision(rotatedPiece)) {
            set({ activePiece: rotatedPiece });
        } else {
            // Simple wall kick: try moving left or right 1 step
            const kickLeft = { ...rotatedPiece, position: { ...rotatedPiece.position, x: rotatedPiece.position.x - 1 } };
            const kickRight = { ...rotatedPiece, position: { ...rotatedPiece.position, x: rotatedPiece.position.x + 1 } };

            if (!checkCollision(kickLeft)) {
                set({ activePiece: kickLeft });
            } else if (!checkCollision(kickRight)) {
                set({ activePiece: kickRight });
            }
        }
    },

    checkCollision: (piece) => {
        const { grid } = get();
        const { shape, position } = piece;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                // Check only filled cells of the tetromino
                if (shape[y][x] !== 0) {
                    const boardX = position.x + x;
                    const boardY = position.y + y;

                    // Check boundaries
                    if (
                        boardX < 0 ||
                        boardX >= BOARD_WIDTH ||
                        boardY >= BOARD_HEIGHT
                    ) {
                        return true;
                    }

                    // Check grid occupancy
                    if (boardY >= 0 && grid[boardY][boardX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    hardDrop: () => {
        const { activePiece, status, checkCollision, lockPiece } = get();
        if (status !== 'PLAYING' || !activePiece) return;

        let dropDist = 0;
        while (true) {
            const nextPos = { ...activePiece.position, y: activePiece.position.y + dropDist + 1 };
            if (checkCollision({ ...activePiece, position: nextPos })) {
                break;
            }
            dropDist++;
        }

        const newPiece = { ...activePiece, position: { ...activePiece.position, y: activePiece.position.y + dropDist } };
        set({ activePiece: newPiece });
        get().lockPiece(); // Call via get() to ensure context
    },

    lockPiece: () => {
        const { grid, activePiece } = get();
        const newGrid = grid.map((row) => [...row]);
        const { shape, position, color } = activePiece;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardY = position.y + y;
                    const boardX = position.x + x;
                    if (boardY >= 0 && boardY < BOARD_HEIGHT) {
                        newGrid[boardY][boardX] = color;
                    }
                }
            }
        }

        // Check for cleared lines BEFORE finalizing state
        const linesToClear = [];
        newGrid.forEach((row, index) => {
            if (row.every((cell) => cell !== 0)) {
                linesToClear.push(index);
            }
        });

        if (linesToClear.length > 0) {
            // Animation state
            set({ grid: newGrid, activePiece: null, clearingLines: linesToClear });

            const playAnimation = async () => {
                const sleep = (ms) => new Promise(r => setTimeout(r, ms));

                await sleep(200);   // ON 1
                set({ clearingLines: [] });
                await sleep(100);   // OFF 1

                set({ clearingLines: linesToClear }); // ON 2
                await sleep(200);
                set({ clearingLines: [] }); // OFF 2
                await sleep(100);

                set({ clearingLines: linesToClear }); // ON 3
                await sleep(200);

                get().clearLines(linesToClear, newGrid);
            };
            playAnimation();

        } else {
            set({ grid: newGrid, activePiece: null });
            get().spawnPiece();
        }
    },

    clearLines: (linesIndices, currentGrid) => {
        const { score, lines, level, levelProgress } = get();
        const linesCleared = linesIndices.length;

        // Filter out cleared lines
        const newGrid = currentGrid.filter((_, index) => !linesIndices.includes(index));

        // Add new empty lines at top
        while (newGrid.length < BOARD_HEIGHT) {
            newGrid.unshift(Array(BOARD_WIDTH).fill(0));
        }

        // Classic scoring (simplified)
        const points = [0, 40, 100, 300, 1200];
        const newScore = score + points[linesCleared] * level;
        const newLines = lines + linesCleared;
        const newLevelProgress = levelProgress + linesCleared;

        const linesRequired = 10 + (level - 1) * 4;

        if (newLevelProgress >= linesRequired) {
            // LEVEL CLEARED ANIMATION
            const allLines = Array.from({ length: BOARD_HEIGHT }, (_, i) => i);

            set({
                grid: newGrid,
                score: newScore,
                lines: newLines,
                levelProgress: newLevelProgress,
                clearingLines: allLines,
                activePiece: null
            });

            const playLevelAnim = async () => {
                const sleep = (ms) => new Promise(r => setTimeout(r, ms));

                await sleep(200);
                set({ clearingLines: [] });
                await sleep(100);

                set({ clearingLines: allLines });
                await sleep(200);
                set({ clearingLines: [] });
                await sleep(100);

                set({ clearingLines: allLines });
                await sleep(200);

                set({
                    status: 'LEVEL_CLEARED',
                    clearingLines: [],
                    maxUnlockedLevel: Math.max(get().maxUnlockedLevel, level + 1)
                });
                get().saveProgress();
            };
            playLevelAnim();

        } else {
            set({
                grid: newGrid,
                score: newScore,
                lines: newLines,
                levelProgress: newLevelProgress,
                clearingLines: [],
            });
            get().spawnPiece();
        }
    },

    tick: () => {
        const { status, movePiece, lockPiece, clearingLines, isPaused } = get();
        if (status !== 'PLAYING' || isPaused) return;

        // Don't tick if animation is playing
        if (clearingLines.length > 0) return;

        // Try moving down
        const moved = movePiece(0, 1);
        if (!moved) {
            // Lock if can't move down
            lockPiece();
        }
    },
}));
