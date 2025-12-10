import { useGameStore, BOARD_WIDTH, BOARD_HEIGHT } from '../../store/gameStore';
import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';

const Cell = ({ position, color, isClearing }) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[0.95, 0.95, 0.95]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isClearing ? 2 : 0.1} // Flash on clear
                roughness={0.3}
                metalness={0.1}
            />
        </mesh>
    );
};

const Edges = () => {
    // Create a box outline for the board
    // Board is from 0 to BOARD_WIDTH in x, 0 to BOARD_HEIGHT in y
    // We center it:
    const width = BOARD_WIDTH;
    const height = BOARD_HEIGHT;

    // Four corners of the board in 3D space relative to the group
    // The group is centered at position so (0,0) is bottom-left of the grid

    // Adjust logic: The grid rendering starts at X=0, Y=0. 
    // We want lines around X: -0.5 to WIDTH-0.5, Y: -0.5 to HEIGHT-0.5

    const x1 = -0.5;
    const x2 = width - 0.5;
    const y1 = -0.5;
    const y2 = height - 0.5;
    const z1 = 0.5; // Front
    const z2 = -0.5; // Back

    const color = "#555";

    return (
        <group>
            {/* Left */}
            <Line points={[[x1, y1, z1], [x1, y2, z1]]} color={color} lineWidth={2} />
            {/* Right */}
            <Line points={[[x2, y1, z1], [x2, y2, z1]]} color={color} lineWidth={2} />
            {/* Bottom */}
            <Line points={[[x1, y1, z1], [x2, y1, z1]]} color={color} lineWidth={2} />
            {/* Top (Open? Or closed? Tetris usually open top, but let's close for visual completeness frame) */}
            <Line points={[[x1, y2, z1], [x2, y2, z1]]} color={color} lineWidth={2} />

            {/* Back frame (optional, for depth) */}
            <Line points={[[x1, y1, z2], [x1, y2, z2]]} color={color} lineWidth={1} />
            <Line points={[[x2, y1, z2], [x2, y2, z2]]} color={color} lineWidth={1} />
            <Line points={[[x1, y1, z2], [x2, y1, z2]]} color={color} lineWidth={1} />
            <Line points={[[x1, y2, z2], [x2, y2, z2]]} color={color} lineWidth={1} />

            {/* Connecting lines */}
            <Line points={[[x1, y1, z1], [x1, y1, z2]]} color={color} lineWidth={1} />
            <Line points={[[x2, y1, z1], [x2, y1, z2]]} color={color} lineWidth={1} />
            <Line points={[[x1, y2, z1], [x1, y2, z2]]} color={color} lineWidth={1} />
            <Line points={[[x2, y2, z1], [x2, y2, z2]]} color={color} lineWidth={1} />
        </group>
    )
}

const Board = () => {
    const grid = useGameStore((state) => state.grid);
    const clearingLines = useGameStore((state) => state.clearingLines); // New state

    // Memoize the rendered grid to avoid unnecessary re-renders
    const renderedGrid = useMemo(() => {
        const cells = [];
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            const isRowClearing = clearingLines.includes(y);
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const color = grid[y][x];
                if (color !== 0) {
                    cells.push(
                        <Cell
                            key={`${x}-${y}`}
                            position={[x, BOARD_HEIGHT - 1 - y, 0]}
                            color={color}
                            isClearing={isRowClearing}
                        />
                    );
                }
            }
        }
        return cells;
    }, [grid, clearingLines]);

    return (
        <group>
            {/* Grid Container/Background 
            <mesh position={[BOARD_WIDTH / 2 - 0.5, BOARD_HEIGHT / 2 - 0.5, -0.5]}>
                <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
                <meshStandardMaterial color="#7171b4ff" opacity={0.8} transparent roughness={0.8} />
            </mesh>*/}

            <Edges />

            {/* Grid Lines (Optional, maybe use Grid helper) 
            <gridHelper
                args={[BOARD_WIDTH, BOARD_WIDTH, 0x333333, 0x111111]}
                position={[BOARD_WIDTH / 2 - 0.5, -0.5, BOARD_WIDTH / 2 - 0.5]}
                rotation={[Math.PI / 2, 0, 0]}
            />*/}

            {renderedGrid}
        </group>
    );
};

export default Board;
