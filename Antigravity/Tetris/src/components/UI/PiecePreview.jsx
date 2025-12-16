import { Canvas } from '@react-three/fiber';
import { Center } from '@react-three/drei';

const PiecePreview = ({ type, shape, color }) => {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Center>
                    <group>
                        {shape.map((row, y) =>
                            row.map((cell, x) => {
                                if (cell) {
                                    return (
                                        <mesh key={`${x}-${y}`} position={[x, -y, 0]}>
                                            <boxGeometry args={[0.9, 0.9, 0.9]} />
                                            <meshStandardMaterial
                                                color={color}
                                                emissive={color}
                                                emissiveIntensity={0.2}
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
                </Center>
            </Canvas>
        </div>
    );
};

export default PiecePreview;
