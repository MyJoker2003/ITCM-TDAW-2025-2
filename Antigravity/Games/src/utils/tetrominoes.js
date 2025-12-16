export const TETROMINOES = {
    I: {
        shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
        color: '#4db6ac', // Soft Teal
    },
    J: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ],
        color: '#5c6bc0', // Indigo
    },
    L: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ],
        color: '#ffb74d', // Orange Peeling
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: '#fff176', // Soft Yellow
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
        color: '#81c784', // Soft Green
    },
    T: {
        shape: [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
        color: '#ba68c8', // Soft Purple
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
        color: '#e57373', // Soft Red
    },
};

export const randomTetromino = () => {
    const keys = Object.keys(TETROMINOES);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    return { type: randKey, ...TETROMINOES[randKey] };
};
