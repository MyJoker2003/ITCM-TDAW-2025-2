
// Directions for maze generation (Up, Right, Down, Left)
const DIRECTIONS = [
    { x: 0, y: -2, dx: 0, dy: -1 }, // Up
    { x: 2, y: 0, dx: 1, dy: 0 },   // Right
    { x: 0, y: 2, dx: 0, dy: 1 },   // Down
    { x: -2, y: 0, dx: -1, dy: 0 }  // Left
];

/**
 * Generates a maze for the given level.
 * @param {number} level - Current game level (1-based).
 * @returns {object} - { grid, start: {x,y}, end: {x,y}, keys: [], doors: [] }
 */
export const generateMaze = (level) => {
    // 1. Calculate Grid Size based on Level
    // Base size 15x15, increasing by 2 every level?
    // Level 1: 15, Level 2: 17...
    // User wants "progressive rejugability".
    const size = 15 + (level - 1) * 2;
    const width = size;
    const height = size;

    // Initialize Grid (1 = Wall, 0 = Floor)
    // We use a 2D array. odd indices are potential cells, even are walls.
    const grid = Array.from({ length: height }, () => Array(width).fill(1));

    // Helper to check bounds
    const isValid = (x, y) => x > 0 && y > 0 && x < width - 1 && y < height - 1;

    // 2. Recursive Backtracker
    const startX = 1;
    const startY = 1;
    grid[startY][startX] = 0;

    const stack = [{ x: startX, y: startY }];

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = [];

        for (const dir of DIRECTIONS) {
            const nx = current.x + dir.x;
            const ny = current.y + dir.y;

            if (isValid(nx, ny) && grid[ny][nx] === 1) {
                neighbors.push({ nx, ny, dx: dir.dx, dy: dir.dy });
            }
        }

        if (neighbors.length > 0) {
            const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
            // Carve path (remove wall between)
            grid[current.y + chosen.dy][current.x + chosen.dx] = 0;
            // Mark neighbor visited
            grid[chosen.ny][chosen.nx] = 0;
            stack.push({ x: chosen.nx, y: chosen.ny });
        } else {
            stack.pop();
        }
    }

    // Define Start and End
    const start = { x: 1, y: 1 };

    // Find a far point for End (BFS/DFS from start to find furthest?)
    // For simplicity in a perfect maze, bottom-right-ish is usually good, 
    // but let's find the max distance tile for better gameplay.
    let end = findFurthestPoint(grid, start, width, height);

    // 3. Level 5+ Mechanics: Keys and Doors
    let doors = [];
    let keys = [];

    if (level >= 5) {
        // Calculate number of keys: Level 5->1, 7->2, 9->3 ... Max 8.
        // (Level - 5) / 2 + 1 ?
        // L5: 1. L6: 1. L7: 2.
        let numKeys = Math.floor((level - 5) / 2) + 1;
        if (numKeys > 8) numKeys = 8;

        // Find solution path
        const path = findPath(grid, start, end, width, height);

        // We need to place `numKeys` doors on the path.
        // Filter path to exclude start/end and immediate surroundings to avoid soft-locks.
        const candidatePath = path.slice(2, path.length - 2);

        // Segment the path
        if (candidatePath.length >= numKeys) {
            // Naive segmentation: pick random distinct indices sorted
            const indices = []; // indices in candidatePath
            while (indices.length < numKeys) {
                const idx = Math.floor(Math.random() * candidatePath.length);
                if (!indices.includes(idx)) indices.push(idx);
            }
            indices.sort((a, b) => a - b);

            const distinctDoors = indices.map(idx => candidatePath[idx]);

            // Place keys
            // For Door 0 (indices[0]), Key must be in Region 0 (Start -> Door 0).
            // For Door k, Key must be in Region 0..k (Start -> ... -> Door k).
            // To ensure solvability, we usually place Key k in the region immediately preceding Door k?
            // Or ANYWHERE before.
            // Let's iterate:

            // We need to know which tiles are reachable before crossing Door i.
            // Since it's a perfect maze (tree), removing the door tile splits the tree.
            // The component containing Start is the safe region.

            // Current "Blocks": All proposed doors.
            const tempGrid = grid.map(row => [...row]);
            distinctDoors.forEach(d => { tempGrid[d.y][d.x] = 1; }); // Temporarily treat as walls

            distinctDoors.forEach((doorPos, i) => {
                // 1. Identify Reachable Cells from Start in tempGrid
                const reachable = getReachableCells(tempGrid, start, width, height);

                // 2. Pick a random reachable cell for the Key
                const keyPos = reachable[Math.floor(Math.random() * reachable.length)];

                keys.push({ ...keyPos, id: `key-${i}` });
                doors.push({ ...doorPos, id: `door-${i}` });

                // 3. "Open" this door for the next iteration (Key 2 can be behind Door 1)
                tempGrid[doorPos.y][doorPos.x] = 0;
            });
        }
    }

    return {
        grid, // 0: floor, 1: wall
        width,
        height,
        start,
        end,
        keys,
        doors
    };
};

// --- Helpers ---

function findFurthestPoint(grid, start, width, height) {
    let q = [{ x: start.x, y: start.y, dist: 0 }];
    let visited = new Set([`${start.x},${start.y}`]);
    let maxDist = -1;
    let furthest = start;

    let head = 0;
    while (head < q.length) {
        const { x, y, dist } = q[head++];
        if (dist > maxDist) {
            maxDist = dist;
            furthest = { x, y };
        }

        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (let [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && grid[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                visited.add(`${nx},${ny}`);
                q.push({ x: nx, y: ny, dist: dist + 1 });
            }
        }
    }
    return furthest;
}

function findPath(grid, start, end, width, height) {
    // BFS for shortest path (in Tree it's the only path)
    let q = [[start]];
    let visited = new Set([`${start.x},${start.y}`]);

    let head = 0;
    while (head < q.length) {
        const path = q[head++];
        const curr = path[path.length - 1];

        if (curr.x === end.x && curr.y === end.y) return path;

        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (let [dx, dy] of dirs) {
            const nx = curr.x + dx;
            const ny = curr.y + dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && grid[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                visited.add(`${nx},${ny}`);
                q.push([...path, { x: nx, y: ny }]);
            }
        }
    }
    return [];
}

function getReachableCells(grid, start, width, height) {
    let cells = [];
    let q = [{ x: start.x, y: start.y }];
    let visited = new Set([`${start.x},${start.y}`]);

    let head = 0;
    while (head < q.length) {
        const curr = q[head++];
        cells.push(curr);

        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (let [dx, dy] of dirs) {
            const nx = curr.x + dx;
            const ny = curr.y + dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && grid[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
                visited.add(`${nx},${ny}`);
                q.push({ x: nx, y: ny });
            }
        }
    }
    return cells;
}
