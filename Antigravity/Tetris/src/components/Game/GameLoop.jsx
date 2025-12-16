import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

const GameLoop = () => {
    const tick = useGameStore((state) => state.tick);
    const level = useGameStore((state) => state.level);
    const status = useGameStore((state) => state.status);

    useEffect(() => {
        if (status !== 'PLAYING') return;

        // Speed calculation: decreases as level increases
        // Level 1: 1000ms, Level 10: 100ms
        const speed = Math.max(100, 1000 - (level - 1) * 100);

        const interval = setInterval(() => {
            tick();
        }, speed);

        return () => clearInterval(interval);
    }, [tick, level, status]);

    return null;
};

export default GameLoop;
