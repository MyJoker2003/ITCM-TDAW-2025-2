export const VIBRANT_COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#d946ef', // Fuchsia
    '#f43f5e', // Rose
];

export const generateRandomColor = (excludeColors = []) => {
    const available = VIBRANT_COLORS.filter(c => !excludeColors.includes(c));
    if (available.length === 0) return VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
    return available[Math.floor(Math.random() * available.length)];
};

const MATH_REPLACEMENTS = [
    { regex: /\^/g, replacement: '**' },
    { regex: /sin/g, replacement: 'Math.sin' },
    { regex: /cos/g, replacement: 'Math.cos' },
    { regex: /tan/g, replacement: 'Math.tan' },
    { regex: /sqrt/g, replacement: 'Math.sqrt' },
    { regex: /log/g, replacement: 'Math.log' },
    { regex: /pi/gi, replacement: 'Math.PI' },
    { regex: /π/g, replacement: 'Math.PI' },
    { regex: /\be\b/g, replacement: 'Math.E' }, // Word boundary for 'e'
    { regex: /abs/g, replacement: 'Math.abs' },
];

export const parseExpression = (expression) => {
    if (!expression) return null;
    let parsed = expression.toLowerCase();

    MATH_REPLACEMENTS.forEach(({ regex, replacement }) => {
        parsed = parsed.replace(regex, replacement);
    });

    return parsed;
};

export const isValidExpression = (expression) => {
    if (!expression) return false;
    try {
        const parsed = parseExpression(expression);
        // Try to evaluate at x=1 to see if it throws
        const testFn = new Function('x', `return ${parsed}`);
        const result = testFn(1);
        return !isNaN(result) && isFinite(result);
    } catch (e) {
        return false;
    }
};

export const evaluateFunction = (expression, x) => {
    try {
        // Note: expression is expected to be the ALREADY PARSED javascript string (e.g. "x**2")
        // Optimization: In a real app we would cache the Function object, not recreate it every pixel
        const fn = new Function('x', `return ${expression}`);
        return fn(x);
    } catch (e) {
        return NaN;
    }
};
