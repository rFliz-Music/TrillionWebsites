// Bézier evaluation
export function cubicBezier(p0, p1, p2, p3, t) {
    const x =
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * p1.x +
        3 * (1 - t) * Math.pow(t, 2) * p2.x +
        Math.pow(t, 3) * p3.x;
    const y =
        Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * p1.y +
        3 * (1 - t) * Math.pow(t, 2) * p2.y +
        Math.pow(t, 3) * p3.y;
    return { x, y };
    }

// tangent for orientation
export function cubicTangent(p0, p1, p2, p3, t) {
    const dx =
        3 * Math.pow(1 - t, 2) * (p1.x - p0.x) +
        6 * (1 - t) * t * (p2.x - p1.x) +
        3 * Math.pow(t, 2) * (p3.x - p2.x);
    const dy =
        3 * Math.pow(1 - t, 2) * (p1.y - p0.y) +
        6 * (1 - t) * t * (p2.y - p1.y) +
        3 * Math.pow(t, 2) * (p3.y - p2.y);
    return Math.atan2(dy, dx);
    }

