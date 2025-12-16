import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Board from './Board';
import Tetromino from './Tetromino';
import GameLoop from './GameLoop';

const Scene = () => {
    return (
        <div className="w-full h-full bg-[#1a1a2e]">
            <Canvas camera={{ position: [5, 10, 20], fov: 50 }}>
                <color attach="background" args={['#9ED6F0']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />

                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                <group position={[-5, -10, 0]}> {/* Center the board roughly */}
                    <Board />
                    <Tetromino />
                </group>

                <GameLoop />
                <OrbitControls enablePan={false} minDistance={10} maxDistance={50} />
            </Canvas>
        </div>
    );
};

export default Scene;
