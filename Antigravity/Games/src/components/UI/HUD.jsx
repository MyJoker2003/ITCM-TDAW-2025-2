import PiecePreview from './PiecePreview';
import { useGameStore } from '../../store/gameStore';

const HUD = () => {
    const score = useGameStore((state) => state.score);
    const level = useGameStore((state) => state.level);
    const lines = useGameStore((state) => state.lines);
    const nextPiece = useGameStore((state) => state.nextPiece);

    return (
        <div className="absolute inset-0 pointer-events-none p-8 flex justify-between items-start z-40">
            <div className="flex flex-col gap-4">
                <div className="bg-black/50 p-4 rounded-lg border border-cyan-500/30 backdrop-blur-md">
                    <h2 className="text-cyan-400 text-sm uppercase tracking-wider mb-1">Score</h2>
                    <p className="text-3xl font-mono font-bold text-white">{score.toLocaleString()}</p>
                </div>

                <div className="bg-black/50 p-4 rounded-lg border border-purple-500/30 backdrop-blur-md">
                    <h2 className="text-purple-400 text-sm uppercase tracking-wider mb-1">Level</h2>
                    <p className="text-3xl font-mono font-bold text-white">{level}</p>
                </div>

                <div className="bg-black/50 p-4 rounded-lg border border-green-500/30 backdrop-blur-md">
                    <h2 className="text-green-400 text-sm uppercase tracking-wider mb-1">Lines</h2>
                    <p className="text-3xl font-mono font-bold text-white">{lines}</p>
                </div>
            </div>

            <div className="bg-black/50 p-4 rounded-lg border border-yellow-500/30 backdrop-blur-md">
                <h2 className="text-yellow-400 text-sm uppercase tracking-wider mb-2">Next</h2>
                <div className="w-24 h-24 flex items-center justify-center bg-black/30 rounded overflow-hidden">
                    {nextPiece && (
                        <PiecePreview
                            type={nextPiece.type}
                            shape={nextPiece.shape}
                            color={nextPiece.color}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HUD;
