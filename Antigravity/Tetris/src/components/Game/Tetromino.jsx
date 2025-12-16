import { useGameStore, BOARD_HEIGHT } from '../../store/gameStore';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

const Tetromino = () => {
    const activePiece = useGameStore((state) => state.activePiece);
    const groupRef = useRef();

    // Smooth movement interpolation could go here

    if (!activePiece) return null;

    const { shape, position, color } = activePiece;

    return (
        <group position={[position.x, BOARD_HEIGHT - 1 - position.y, 0]}>
            {shape.map((row, y) =>
                row.map((cell, x) => {
                    if (cell) {
                        return (
                            <mesh key={`${x}-${y}`} position={[x, -y, 0]}>
                                <boxGeometry args={[0.95, 0.95, 0.95]} />
                                <meshStandardMaterial
                                    color={color}
                                    emissive={color}
                                    emissiveIntensity={0.1}
                                    roughness={0.3}
                                    metalness={0.1}
                                />
                            </mesh>
                        );
                    }
                    return null;
                })
            )}
        </group>
    );
};

export default Tetromino;
