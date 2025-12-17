import React, { useRef, useEffect, useState } from 'react';
import { Home, Plus, Minus } from 'lucide-react';
import { evaluateFunction } from '../utils/mathUtils';

const GraphCanvas = ({ functions, view, setView }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [hoverPoint, setHoverPoint] = useState(null);
    const isDragging = useRef(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Drawing Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = dimensions;
        const { center, zoom } = view;

        // Set canvas actual size
        canvas.width = width;
        canvas.height = height;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Coordinate Helper Functions
        const toScreenX = (worldX) => (worldX - center.x) * zoom + width / 2;
        const toScreenY = (worldY) => height / 2 - (worldY - center.y) * zoom;
        const toWorldX = (screenX) => (screenX - width / 2) / zoom + center.x;

        // 1. Draw Grid and Graduation
        const gridSize = 50; // Minimum pixels between lines

        let step = 1;
        if (zoom < 20) step = 5;
        if (zoom < 5) step = 10;
        if (zoom > 100) step = 0.5;
        if (zoom > 200) step = 0.1;

        const startX = Math.floor(toWorldX(0) / step) * step;
        const endX = Math.ceil(toWorldX(width) / step) * step;

        ctx.lineWidth = 1;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8'; // text-muted

        // Calculate Y-pos for X-axis labels (clamp to screen if axis is off)
        const xAxisY = Math.min(Math.max(toScreenY(0), 0), height - 20);
        const yAxisX = Math.min(Math.max(toScreenX(0), 0), width - 30);

        // Major Grid & X Labels
        ctx.strokeStyle = '#334155'; // var(--grid-major)
        ctx.beginPath();

        // Vertical lines & X labels
        for (let x = startX; x <= endX; x += step) {
            const sx = toScreenX(x);
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, height);

            // Label (skip 0 to avoid clutter at origin if we want, or adjust)
            // We draw label if it's not too close to Y axis line if Y axis is visible?
            // Simple approach: just draw.
            if (Math.abs(sx - yAxisX) > 20 || Math.abs(x) > 0.0001) {
                ctx.fillText(parseFloat(x.toFixed(2)), sx, xAxisY + 4);
            }
        }

        // Horizontal lines & Y labels
        const worldYMin = center.y - (height / 2) / zoom;
        const worldYMax = center.y + (height / 2) / zoom;
        const startYCorrected = Math.floor(worldYMin / step) * step;
        const endYCorrected = Math.ceil(worldYMax / step) * step;

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        for (let y = startYCorrected; y <= endYCorrected; y += step) {
            const sy = toScreenY(y);
            ctx.moveTo(0, sy);
            ctx.lineTo(width, sy);

            // Label
            if (Math.abs(sy - xAxisY) > 20 || Math.abs(y) > 0.0001) {
                ctx.fillText(parseFloat(y.toFixed(2)), yAxisX - 4, sy);
            }
        }
        ctx.stroke();

        // 2. Draw Axes Lines (Brighter)
        ctx.strokeStyle = '#cbd5e1'; // var(--axis-color)
        ctx.lineWidth = 2;
        ctx.beginPath();
        // X Axis
        const y0 = toScreenY(0);
        if (y0 >= 0 && y0 <= height) {
            ctx.moveTo(0, y0);
            ctx.lineTo(width, y0);
        }
        // Y Axis
        const x0 = toScreenX(0);
        if (x0 >= 0 && x0 <= width) {
            ctx.moveTo(x0, 0);
            ctx.lineTo(x0, height);
        }
        ctx.stroke();

        // 3. Draw Functions
        functions.forEach(fn => {
            if (!fn.visible || !fn.valid || !fn.compiledExpression) return;

            ctx.strokeStyle = fn.color || '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();

            let isDrawing = false;

            for (let sx = 0; sx <= width; sx++) {
                const wx = toWorldX(sx);
                const wy = evaluateFunction(fn.compiledExpression, wx);
                const sy = toScreenY(wy);

                if (isNaN(wy) || !isFinite(wy)) {
                    isDrawing = false;
                    continue;
                }

                if (sy < -height * 2 || sy > height * 2) {
                    if (isDrawing) ctx.lineTo(sx, Math.max(Math.min(sy, height * 3), -height * 3));
                    isDrawing = false;
                    continue;
                }

                if (!isDrawing) {
                    ctx.moveTo(sx, sy);
                    isDrawing = true;
                } else {
                    ctx.lineTo(sx, sy);
                }
            }
            ctx.stroke();
        });

        // 4. Draw Tooltip if active
        if (hoverPoint) {
            const { sx, sy, wx, wy, color } = hoverPoint;

            // Point
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(sx, sy, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Tooltip Box
            const text = `(${wx.toFixed(2)}, ${wy.toFixed(2)})`;
            ctx.font = '12px Inter, sans-serif';
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const boxWidth = textWidth + 16;
            const boxHeight = 24;
            const boxX = sx + 10;
            const boxY = sy - 30;

            // Background
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // var(--bg-app) semi-transparent
            ctx.beginPath();
            ctx.rect(boxX, boxY, boxWidth, boxHeight);
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Text
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, boxX + boxWidth / 2, boxY + boxHeight / 2);
        }

    }, [dimensions, view, functions, hoverPoint]);

    // Event Handlers
    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const direction = e.deltaY < 0 ? 1 : -1;
        const newZoom = direction > 0 ? view.zoom * zoomFactor : view.zoom / zoomFactor;
        setView(prev => ({ ...prev, zoom: Math.max(1, Math.min(newZoom, 1000)) }));
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left; // Canvas-relative coordinates
        const my = e.clientY - rect.top;

        if (isDragging.current) {
            // Panning logic
            const dx = e.clientX - lastMousePos.current.x; // Global movement
            const dy = e.clientY - lastMousePos.current.y;

            setView(prev => ({
                ...prev,
                center: {
                    x: prev.center.x - dx / prev.zoom,
                    y: prev.center.y + dy / prev.zoom
                }
            }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        } else {
            // Hover Logic
            const { width, height } = dimensions;
            const { center, zoom } = view;
            // Don't duplicate helpers, just quick inline or reuse logic if refactored.
            // Replicating simplified toWorldX logic:
            const toWorldX = (screenX) => (screenX - width / 2) / zoom + center.x;
            const toScreenY = (worldY) => height / 2 - (worldY - center.y) * zoom;

            const wx = toWorldX(mx);

            let closest = null;
            let minDist = 15; // threshold

            functions.forEach(fn => {
                if (!fn.visible || !fn.valid || !fn.compiledExpression) return;
                const wy = evaluateFunction(fn.compiledExpression, wx);
                if (isNaN(wy)) return;

                const sy = toScreenY(wy);
                const dist = Math.abs(my - sy);

                if (dist < minDist) {
                    minDist = dist;
                    closest = { sx: mx, sy, wx, wy, color: fn.color };
                }
            });

            setHoverPoint(closest);
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    return (
        <div
            ref={containerRef}
            className="graph-container"
            style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-app)' }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
                handleMouseUp();
                setHoverPoint(null);
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ display: 'block' }}
            />

            {/* Controls */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 10
            }}>
                <button className="icon-btn" onClick={() => setView({ center: { x: 0, y: 0 }, zoom: 50 })}>
                    <Home size={20} />
                </button>
                <button className="icon-btn" onClick={() => setView(v => ({ ...v, zoom: v.zoom * 1.2 }))}>
                    <Plus size={20} />
                </button>
                <button className="icon-btn" onClick={() => setView(v => ({ ...v, zoom: v.zoom / 1.2 }))}>
                    <Minus size={20} />
                </button>
            </div>
        </div>
    );
};

export default GraphCanvas;
